import { useRouter } from 'next/router'
import {
    Card,
    Divider,
    Row,
    Col,
    Descriptions,
    Table,
    Spin,
    Tag,
    Tooltip
} from 'antd'
import { StarFilled, CloseCircleOutlined } from '@ant-design/icons'
import { getTranslateText } from 'utils/translate-utils'
import { useCallback, useEffect, useRef, useState, FC, memo } from 'react'
import BookingAPI from 'api/BookingAPI'
import { IBooking, IQuiz } from 'types'
import { notify } from 'contexts/Notification'
import QuizAPI from 'api/QuizAPI'
import moment from 'moment'
import _ from 'lodash'
import { ColumnsType } from 'antd/lib/table'
import { EnumQuizSessionStatus, EnumQuizSessionType } from 'const'
import HomeWorkResultPopup from 'components/Atoms/HomeWorkResultPopup'
import { toReadablePrice } from 'utils/price-utils'
import BlockHeader from '../../BlockHeader'
import BookingInfo from '../../MultiChoice/BookingInfo'
import Question from '../../MultiChoice/Question'
import Result from '../../MultiChoice/Result'

type Props = {
    type: string
}
const MultiChoice: FC<Props> = ({ type }) => {
    const router = useRouter()
    const topHomeworkRef = useRef<null | HTMLDivElement>(null)
    const [booking, setBooking] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [quizInfo, setQuizInfo] = useState<IQuiz>()
    const [quizSession, setQuizSession] = useState<IQuiz>()
    const [historyQuiz, setHistoryQuiz] = useState([])
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [startingQuiz, setStarting] = useState(false)
    const [userAnswers, setUserAnswers] = useState<any[]>([])
    const [questions, setQuestions] = useState<any[]>([])
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [visibleQuizResult, setVisibleQuizResult] = useState(false)

    const toggleHomeWorkResult = useCallback(
        (val) => {
            setVisibleQuizResult(val)
        },
        [visibleQuizResult]
    )

    const getDetailBooking = (id) => {
        setLoading(true)
        BookingAPI.getDetailLesson(id)
            .then((res) => {
                setBooking(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    const scrollToTopHomework = () => {
        if (topHomeworkRef?.current) {
            topHomeworkRef?.current?.scrollIntoView({
                behavior: 'smooth'
            })
        }
    }

    const getQuizInfo = (id) => {
        QuizAPI.getDetailQuiz(id)
            .then((res) => {
                setQuizInfo(res)
                if (res?.doing_quiz_session) {
                    setQuizSession({
                        ...res.doing_quiz_session,
                        status: EnumQuizSessionStatus.DOING
                    })
                    const newQuestions = res.doing_quiz_session.questions.map(
                        (i) => {
                            const tmp = {
                                ...i,
                                ...i?.question
                            }
                            return tmp
                        }
                    )
                    setQuestions(newQuestions)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    const getHistoryDoHomework = (query?: {
        page_size: number
        page_number: number
        quiz_id: number
        type: number
    }) => {
        QuizAPI.getHistoryDoHomework(query)
            .then((res) => {
                setHistoryQuiz(res.data)
                if (res.pagination && res.pagination.total > 0) {
                    setTotal(res.pagination.total)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    useEffect(() => {
        const { id } = router.query
        if (id) {
            getDetailBooking(id)
            // calculateAvg(id)
        }
    }, [router.query])

    useEffect(() => {
        if (booking?.unit?.exam_id) {
            getQuizInfo(booking?.unit?.exam_id)
        }
    }, [booking])

    useEffect(() => {
        if (booking?.id) {
            const homeworkId = booking?.unit?.exam_id
            if (homeworkId) {
                getHistoryDoHomework({
                    page_number: pageNumber,
                    page_size: pageSize,
                    quiz_id: homeworkId,
                    type:
                        type === 'EXAM'
                            ? EnumQuizSessionType.EXAM
                            : EnumQuizSessionType.TEST
                })
            }
        }
    }, [pageNumber, pageSize, booking])

    useEffect(() => {
        if (topHomeworkRef.current) {
            scrollToTopHomework()
        }
    }, [topHomeworkRef, startingQuiz])

    const startDoHomework = () => {
        setStarting(true)
        setUserAnswers([])
        QuizAPI.startDoHomework({
            quiz_id: quizInfo.id,
            type:
                type === 'EXAM'
                    ? EnumQuizSessionType.EXAM
                    : EnumQuizSessionType.TEST
        })
            .then((res) => {
                getQuizInfo(quizInfo.id)
                // setQuizSession(res)
                const newHistory = [...historyQuiz, res]
                setHistoryQuiz(newHistory)
                setTotal((prev) => prev + 1)
                scrollToTopHomework()
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setStarting(false))
    }

    const submitResult = () => {
        setLoadingSubmit(true)
        QuizAPI.submitResultHomework({
            user_answers: userAnswers,
            quiz_session_id: quizSession.id
        })
            .then((res) => {
                notify('success', 'Success')
                const newHistory = [...historyQuiz]
                newHistory[newHistory.length - 1] = res
                setHistoryQuiz(newHistory)
                setQuizSession(res)
                toggleHomeWorkResult(true)
                const newQuestions = res.questions.map((i) => {
                    const tmp = {
                        ...i,
                        ...i?.question
                    }
                    return tmp
                })
                setQuestions(newQuestions)
                // return calculateAvg(booking.id)
            })
            .catch((err) => {
                setQuestions([])
                notify('error', err.message)
            })
            .finally(() => setLoadingSubmit(false))
    }

    const onChangeAnswer = useCallback(
        (question_id, answer_id) => {
            const deadline = quizSession?.end_time
                ? moment(quizSession?.end_time).valueOf()
                : moment().valueOf()
            if (deadline > moment().valueOf()) {
                const newAnswers = [...userAnswers]
                const checkIndex = _.findIndex(
                    newAnswers,
                    (o) => o.question_id === question_id
                )
                if (checkIndex >= 0) {
                    newAnswers[checkIndex] = {
                        question_id,
                        answers: [answer_id]
                    }
                } else {
                    newAnswers.push({ question_id, answers: [answer_id] })
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
        {
            title: `${getTranslateText('quiz.name')}`,
            dataIndex: ['quiz', 'name'],
            key: 'quiz.name',
            width: 300,
            align: 'center'
        },
        {
            title: `${getTranslateText('quiz.score')}`,
            dataIndex: 'user_score',
            key: 'user_score',
            width: 150,
            align: 'center',
            render: (text, record: any) =>
                `${text.toFixed(2)}/${record?.quiz?.score}`
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
        // {
        //     title: `${getTranslateText('common.status')}`,
        //     dataIndex: 'status',
        //     key: 'status',
        //     width: 120,
        //     fixed: 'right',
        //     align: 'center',
        //     render: (text, record: IBooking) => {
        //         if (text === EnumQuizSessionStatus.PASS) {
        //             return <Tag color='#36cb7c'>PASS</Tag>
        //         }
        //         if (text === EnumQuizSessionStatus.FAIL) {
        //             return <Tag color='#f15179'>FAIL</Tag>
        //         }
        //         if (text === EnumQuizSessionStatus.DOING) {
        //             return <Tag color='#076fd6'>DOING</Tag>
        //         }
        //         return null
        //     }
        // }
    ]

    return (
        <div>
            <BlockHeader title={getTranslateText('examination')} />
            <Card loading={loading}>
                <BookingInfo data={booking} />
                <Divider />
                <Descriptions
                    title={getTranslateText('quiz.exam.description')}
                    bordered
                    className='mb-3'
                >
                    <Descriptions.Item
                        label={`${getTranslateText('quiz.name')}: ${
                            quizInfo?.name
                        }`}
                    >
                        {`${getTranslateText('quiz.number_of_question')}: ${
                            quizInfo?.score
                        }`}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={`${getTranslateText(
                            'quiz.time'
                        )}: ${toReadablePrice(
                            _.toInteger(quizInfo?.time_limit / 60),
                            ','
                        )} ${getTranslateText('quiz.minute')}`}
                    >
                        {`${getTranslateText('quiz.passed_minimum')}: ${
                            quizInfo?.passed_minimum
                        }/${quizInfo?.score}`}
                    </Descriptions.Item>
                </Descriptions>
                {!_.isEmpty(historyQuiz) && (
                    <Table
                        bordered
                        dataSource={historyQuiz}
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
                        // title={() => (
                        //     <p className='text-center mb-0 fs-17'>
                        //         <Tooltip
                        //             title={getTranslateText(
                        //                 'quiz.desc_avg'
                        //             )}
                        //         >
                        //             <strong>
                        //                 {getTranslateText('quiz.avg')}:{' '}
                        //                 {avgHomework}{' '}
                        //                 {getTranslateText('quiz.point')}
                        //             </strong>
                        //         </Tooltip>
                        //     </p>
                        // )}
                    />
                )}
                <div>
                    {startingQuiz ? (
                        <div className='d-flex justify-content-center'>
                            <Spin />
                        </div>
                    ) : !_.isEmpty(quizSession) && !_.isEmpty(questions) ? (
                        <Spin spinning={loadingSubmit}>
                            <Row
                                gutter={[20, 0]}
                                className='mt-5'
                                ref={topHomeworkRef}
                            >
                                <Col span={16}>{renderQuizSession()}</Col>
                                <Col span={8}>
                                    <Result
                                        questions={questions}
                                        answers={userAnswers}
                                        quizSession={quizSession}
                                        onSubmit={submitResult}
                                        onStartDoAgain={startDoHomework}
                                    />
                                </Col>
                            </Row>
                        </Spin>
                    ) : (
                        <div>
                            <button
                                className='btn my-2 my-sm-0 big-bt big-bt2'
                                type='button'
                                onClick={startDoHomework}
                                disabled={startingQuiz}
                            >
                                <span className='color-white'>
                                    {getTranslateText('quiz.start_do_homework')}
                                </span>
                                <img
                                    src='/static/img/homepage/bt.png'
                                    alt='Start do homework'
                                />
                            </button>
                        </div>
                    )}
                </div>
            </Card>
            <HomeWorkResultPopup
                visible={visibleQuizResult}
                toggleModal={toggleHomeWorkResult}
                data={historyQuiz[historyQuiz.length - 1]}
            />
        </div>
    )
}
export default memo(MultiChoice)
