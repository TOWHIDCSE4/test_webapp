import { useRouter } from 'next/router'
import { Card, Divider, Row, Col, Descriptions, Table, Spin, Tag } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IBooking, IQuiz, IExam } from 'types'
import { notify } from 'contexts/Notification'
import QuizAPINEW from 'api/QuizAPINEW'
import ExamAPI from 'api/ExamAPI'
import moment from 'moment'
import _ from 'lodash'
import { ColumnsType } from 'antd/lib/table'
import { EnumQuizSessionStatus } from 'const'
import { useAuth } from 'contexts/Auth'
import HomeWorkResultPopup from 'components/Atoms/HomeWorkResultPopup'
import Question from '../MultiChoice/Question'
import Result from '../MultiChoice/Result'
import BlockHeader from '../../BlockHeader'

const DoQuizPage = () => {
    const { user } = useAuth()
    const router = useRouter()
    const topExampleRef = useRef<null | HTMLDivElement>(null)
    const [exam, setExam] = useState<IExam>()
    const [loading, setLoading] = useState(false)
    const [quizSession, setQuizSession] = useState<IQuiz>()
    const [historyExample, setHistoryExample] = useState([])
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [startingExample, setStarting] = useState(false)
    const [userAnswers, setUserAnswers] = useState<any[]>([])
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [questions, setQuestions] = useState<any[]>([])
    const [visibleHomeWorkResult, setVisibleHomeWorkResult] = useState(false)
    const [quiz, setQuiz] = useState<any>()

    const toggleHomeWorkResult = useCallback(
        (val) => {
            setVisibleHomeWorkResult(val)
        },
        [visibleHomeWorkResult]
    )

    const getDetailQuiz = useCallback(
        (id) => {
            setLoading(true)
            QuizAPINEW.getDetailQuiz(id)
                .then((res) => {
                    setQuiz(res)
                    if (!_.isEmpty(res.doing_quiz_session))
                        setQuizSession({
                            ...res.doing_quiz_session,
                            status: EnumQuizSessionStatus.DOING
                        })
                    setQuestions(res.questions)
                })
                .catch((err) => {
                    notify('error', err.message)
                })
                .finally(() => setLoading(false))
        },
        [quiz]
    )

    // const scrollToTopExample = () => {
    //     if (topExampleRef?.current) {
    //         topExampleRef?.current?.scrollIntoView({
    //             behavior: 'smooth'
    //         })
    //     }
    // }

    const getQuizSessionInfo = (id) => {
        setStarting(true)
        QuizAPINEW.getDetailQuizSession(id)
            .then((res) => {
                setQuizSession({ ...res, status: EnumQuizSessionStatus.DOING })
                setQuestions(res.questions)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setStarting(false))
    }

    const startDoExample = () => {
        setStarting(true)
        setUserAnswers([])
        QuizAPINEW.startDoQuiz(quiz.id)
            .then((res) => {
                // getQuizSessionInfo(res.id)
                getDetailQuiz(quiz.id)
                // const newHistory = [res, ...historyExample]
                // setHistoryExample(newHistory)
                // setTotal((prev) => prev + 1)
                // scrollToTopExample()
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setStarting(false))
    }

    const getHistoryDoExample = (query?: {
        page_size: number
        page_number: number
        quiz_id: number
    }) => {
        QuizAPINEW.getQuizSessions(query)
            .then((res) => {
                setHistoryExample(res.data)
                if (res.pagination && res.pagination.total > 0) {
                    setTotal(res.pagination.total)
                }
                // const findDoing = _.find(
                //     res.data,
                //     (o) => o.status === EnumQuizSessionStatus.DOING
                // )
                // if (findDoing) {
                //     return getQuizSessionInfo(findDoing.id)
                // }
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const submitResult = () => {
        setLoadingSubmit(true)
        QuizAPINEW.userSubmitResult({
            user_answers: userAnswers,
            quiz_session_id: quizSession.id
        })
            .then((res) => {
                notify('success', 'Success')
                const newHistory = [...historyExample]
                newHistory[newHistory.length - 1] = res
                setHistoryExample(newHistory)
                setQuizSession(res)
                setQuestions(res.questions)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoadingSubmit(false))
    }

    useEffect(() => {
        const { id } = router.query
        if (id) {
            getDetailQuiz(id)
        }
    }, [router.query])

    useEffect(() => {
        if (topExampleRef.current) {
            // scrollToTopExample()
        }
    }, [topExampleRef, startingExample])

    useEffect(() => {
        if (quiz?.id) {
            getHistoryDoExample({
                page_number: pageNumber,
                page_size: pageSize,
                quiz_id: quiz.id
            })
        }
    }, [pageNumber, pageSize, quiz])

    const onChangeAnswer = useCallback(
        (question_id, answers) => {
            if (quizSession.status === EnumQuizSessionStatus.DOING) {
                const newAnswers = [...userAnswers]
                const checkIndex = _.findIndex(
                    newAnswers,
                    (o) => o.question_id === question_id
                )
                if (checkIndex >= 0) {
                    newAnswers[checkIndex] = {
                        question_id,
                        answers
                    }
                } else {
                    newAnswers.push({ question_id, answers })
                }
                setUserAnswers(newAnswers)
            }
        },
        [userAnswers, quizSession]
    )

    const renderQuizSession = () => {
        if (!_.isEmpty(quizSession) && !_.isEmpty(questions)) {
            return _.sortBy(questions, 'display_order').map(
                (question, index) => (
                    <Question
                        key={question.id}
                        data={{ ...question, display_order: index + 1 }}
                        onChangeAnswer={onChangeAnswer}
                        userAnswers={userAnswers}
                    />
                )
            )
        }
    }

    const handleChangePagination = (_pageNumber, _pageSize) => {
        if (_pageNumber !== pageNumber) {
            setPageNumber(_pageNumber)
        }
        if (_pageSize !== pageSize) {
            setPageSize(_pageSize)
        }
    }

    const columns: ColumnsType = [
        {
            title: `${getTranslateText('teacher.summary.no')}`,
            dataIndex: 'index',
            key: 'index',
            width: 70,
            align: 'center',
            render: (text, record, index) => index + 1
        },
        // {
        //     title: `${getTranslateText('quiz.name')}`,
        //     dataIndex: 'name',
        //     key: 'name',
        //     width: 300,
        //     align: 'center'
        // },
        {
            title: `${getTranslateText('quiz.score')}`,
            dataIndex: 'user_score',
            key: 'user_score',
            width: 150,
            align: 'center',
            render: (text, record: any) => `${text}/${record?.quiz?.score}`
        },
        {
            title: `${getTranslateText('quiz.start_time')}`,
            dataIndex: 'start_time',
            key: 'start_time',
            width: 250,
            align: 'center',
            render: (text, record) =>
                text && moment(text).format('DD/MM/YYYY HH:mm:ss')
        },
        {
            title: `${getTranslateText('quiz.submit_time')}`,
            dataIndex: 'submit_time',
            key: 'submit_time',
            width: 250,
            align: 'center',
            render: (text, record) =>
                text && moment(text).format('DD/MM/YYYY HH:mm:ss')
        },
        {
            title: `${getTranslateText('common.status')}`,
            dataIndex: 'end_time',
            key: 'end_time',
            width: 120,
            fixed: 'right',
            align: 'center',
            render: (text, record: IBooking) => {
                if (moment(text).valueOf() <= moment().valueOf()) {
                    return <Tag color='#36cb7c'>DONE</Tag>
                }
                // if (text === EnumQuizSessionStatus.FAIL) {
                //     return <Tag color='#f15179'>FAIL</Tag>
                // }
                if (moment(text).valueOf() > moment().valueOf()) {
                    return <Tag color='#076fd6'>DOING</Tag>
                }
                return null
            }
        }
    ]

    return (
        <div>
            <BlockHeader title={getTranslateText('examination')} />
            <div className='mb-3' />

            <Card loading={loading}>
                <Descriptions
                    title='Quiz Description'
                    bordered
                    className='mb-3'
                >
                    <Descriptions.Item
                        label={`${getTranslateText('quiz.name')}: ${
                            quiz?.name
                        }`}
                    >
                        {`${getTranslateText('quiz.number_of_question')}: ${
                            quiz?.questions?.length
                        }`}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={`${getTranslateText('quiz.time')}: ${moment(
                            quiz?.time_limit * 1000
                        ).format('mm')} ${getTranslateText('quiz.minute')}`}
                    >
                        {`${getTranslateText('quiz.passed_minimum')}: ${
                            quiz?.passed_minimum
                        }/${quiz?.score}`}
                    </Descriptions.Item>
                </Descriptions>
                {!_.isEmpty(historyExample) && (
                    <Table
                        bordered
                        dataSource={historyExample}
                        columns={columns}
                        pagination={{
                            defaultCurrent: 1,
                            current: pageNumber,
                            pageSize: 10,
                            total,
                            onChange: handleChangePagination
                        }}
                        rowKey={(record: any) => record?._id}
                        scroll={{
                            x: 300,
                            y: 300
                        }}
                    />
                )}
                <div>
                    {startingExample ? (
                        <div className='d-flex justify-content-center'>
                            <Spin />
                        </div>
                    ) : !_.isEmpty(quizSession) && !_.isEmpty(questions) ? (
                        <Spin spinning={loadingSubmit}>
                            <Row
                                gutter={[20, 0]}
                                className='mt-5'
                                // ref={topExampleRef}
                            >
                                <Col span={16}>{renderQuizSession()}</Col>
                                <Col span={8}>
                                    <Result
                                        questions={questions}
                                        answers={userAnswers}
                                        quizSession={quizSession}
                                        onSubmit={submitResult}
                                        onStartDoAgain={startDoExample}
                                    />
                                </Col>
                            </Row>
                        </Spin>
                    ) : (
                        <div>
                            <button
                                className='btn my-2 my-sm-0 big-bt big-bt2'
                                type='button'
                                onClick={startDoExample}
                                disabled={startingExample}
                            >
                                <span className='color-white'>
                                    {getTranslateText(
                                        'quiz.exam.start_do_exam'
                                    )}
                                </span>
                                <img
                                    src='/static/img/homepage/bt.png'
                                    alt='Start do Quiz'
                                />
                            </button>
                        </div>
                    )}
                </div>
            </Card>
            <HomeWorkResultPopup
                visible={visibleHomeWorkResult}
                toggleModal={toggleHomeWorkResult}
                data={historyExample[historyExample.length - 1]}
            />
        </div>
    )
}
export default DoQuizPage
