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
import { StarFilled } from '@ant-design/icons'
import { getTranslateText } from 'utils/translate-utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import BookingAPI from 'api/BookingAPI'
import { IBooking, IQuiz } from 'types'
import { notify } from 'contexts/Notification'
import QuizAPI from 'api/QuizAPI'
import moment from 'moment'
import _ from 'lodash'
import { ColumnsType } from 'antd/lib/table'
import { EnumQuizSessionStatus, HOUR_TO_MS, PIVOT_HOUR_FOR_AVG } from 'const'
import HomeWorkResultPopup from 'components/Atoms/HomeWorkResultPopup'
import BlockHeader from '../../BlockHeader'
import BookingInfo from './BookingInfo'
import Question from './Question'
import Result from './Result'

const MultiChoice = () => {
    const router = useRouter()

    const topHomeworkRef = useRef<null | HTMLDivElement>(null)
    const [booking, setBooking] = useState<IBooking>()
    const [loading, setLoading] = useState(false)
    const [quizInfo, setQuizInfo] = useState<IQuiz>()
    const [quizSession, setQuizSession] = useState<IQuiz>()
    const [historyHomework, setHistoryHomework] = useState([])
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [startingHomework, setStarting] = useState(false)
    const [userAnswers, setUserAnswers] = useState<any[]>([])
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [avgHomework, setAvgHomework] = useState(0)
    const [visibleHomeWorkResult, setVisibleHomeWorkResult] = useState(false)

    const toggleHomeWorkResult = useCallback(
        (val) => {
            setVisibleHomeWorkResult(val)
        },
        [visibleHomeWorkResult]
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
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    const getQuizSessionInfo = (id) => {
        setStarting(true)
        QuizAPI.getDetailQuizSession(id)
            .then((res) => {
                setQuizSession(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setStarting(false))
    }

    const getHistoryDoHomework = (query?: {
        page_size: number
        page_number: number
        quiz_id: number
    }) => {
        QuizAPI.getHistoryDoHomework(query)
            .then((res) => {
                setHistoryHomework(res.data)
                if (res.pagination && res.pagination.total > 0) {
                    setTotal(res.pagination.total)
                }
                const findDoing = _.find(
                    res.data,
                    (o) => o.status === EnumQuizSessionStatus.DOING
                )
                if (findDoing) {
                    return getQuizSessionInfo(findDoing.id)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const calculateAvg = (booking_id) => {
        // QuizAPI.calculateAvgHomework({ booking_id })
        //     .then((res) => {
        //         setAvgHomework(res)
        //     })
        //     .catch((err) => {
        //         notify('error', err.message)
        //     })
        //     .finally(() => setLoading(false))
    }

    useEffect(() => {
        const { id } = router.query
        if (id) {
            getDetailBooking(id)
            calculateAvg(id)
        }
    }, [router.query])

    useEffect(() => {
        if (booking?.unit?.homework) {
            getQuizInfo(booking?.unit?.homework)
        }
    }, [booking])

    useEffect(() => {
        const { id } = router.query
        if (id) {
            getHistoryDoHomework({
                page_number: pageNumber,
                page_size: pageSize,
                quiz_id: _.toInteger(id)
            })
        }
    }, [pageNumber, pageSize, booking, router.query])

    useEffect(() => {
        if (topHomeworkRef.current) {
            scrollToTopHomework()
        }
    }, [topHomeworkRef, startingHomework])

    const startDoHomework = () => {
        setStarting(true)
        setUserAnswers([])
        QuizAPI.startDoHomework({
            quiz_id: quizInfo.id
        })
            .then((res) => {
                setQuizSession(res)
                const newHistory = [...historyHomework, res]
                setHistoryHomework(newHistory)
                setTotal((prev) => prev + 1)
                scrollToTopHomework()
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setStarting(false))
    }

    const submitResult = async () => {
        setLoadingSubmit(true)

        try {
            const res = await QuizAPI.submitResultHomework({
                user_answers: userAnswers,
                quiz_session_id: quizSession.id
            })
            notify('success', 'Success')
            const newHistory = [...historyHomework]
            newHistory[newHistory.length - 1] = res
            setHistoryHomework(newHistory)
            setQuizSession(res)
            toggleHomeWorkResult(true)
            return calculateAvg(booking.id)
        } catch (err) {
            notify('error', err.message)
        } finally {
            setLoadingSubmit(false)
        }
    }

    const onChangeAnswer = useCallback(
        (question_id, answer_id) => {
            if (quizSession.status === EnumQuizSessionStatus.DOING) {
                const newAnswers = [...userAnswers]
                const checkIndex = _.findIndex(
                    newAnswers,
                    (o) => o.question_id === question_id
                )
                if (checkIndex >= 0) {
                    newAnswers[checkIndex] = {
                        question_id,
                        answer_id
                    }
                } else {
                    newAnswers.push({ question_id, answer_id })
                }
                setUserAnswers(newAnswers)
            }
        },
        [userAnswers, quizSession]
    )

    const renderQuizSession = () => {
        if (!_.isEmpty(quizSession) && !_.isEmpty(quizSession.questions)) {
            return _.sortBy(quizSession.questions, 'display_order').map(
                (question, index) => (
                    <Question
                        key={question.id}
                        data={question}
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
            title: `${getTranslateText('quiz.calculated_to_avg')}`,
            dataIndex: 'start_time',
            key: 'start_time',
            width: 150,
            align: 'center',
            render: (text, record, index) => {
                if (text && booking.calendar.end_time) {
                    if (
                        moment(text).valueOf() -
                            moment(booking.calendar.end_time).valueOf() <
                            PIVOT_HOUR_FOR_AVG * HOUR_TO_MS &&
                        index === 0
                    ) {
                        return <StarFilled style={{ color: '#fadb14' }} />
                    }
                }
                return null
            }
        },
        {
            title: `${getTranslateText('quiz.name')}`,
            dataIndex: 'name',
            key: 'name',
            width: 300,
            align: 'center'
        },
        {
            title: `${getTranslateText('quiz.score')}`,
            dataIndex: 'user_score',
            key: 'user_score',
            width: 150,
            align: 'center',
            render: (text, record: any) => `${text}/${record?.score}`
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
            dataIndex: 'status',
            key: 'status',
            width: 120,
            fixed: 'right',
            align: 'center',
            render: (text, record: IBooking) => {
                if (text === EnumQuizSessionStatus.PASS) {
                    return <Tag color='#36cb7c'>PASS</Tag>
                }
                if (text === EnumQuizSessionStatus.FAIL) {
                    return <Tag color='#f15179'>FAIL</Tag>
                }
                if (text === EnumQuizSessionStatus.DOING) {
                    return <Tag color='#076fd6'>DOING</Tag>
                }
                return null
            }
        }
    ]

    return (
        <div>
            <BlockHeader title={getTranslateText('homework')} />
            <Card loading={loading}>
                <BookingInfo data={booking} />
                <Divider />
                <Descriptions
                    title={getTranslateText('quiz.description_homework')}
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
                        label={`${getTranslateText('quiz.time')}: ${moment(
                            quizInfo?.time_limit * 1000
                        ).format('mm')} ${getTranslateText('quiz.minute')}`}
                    >
                        {`${getTranslateText('quiz.passed_minimum')}: ${
                            quizInfo?.passed_minimum
                        }/${quizInfo?.score}`}
                    </Descriptions.Item>
                </Descriptions>
                {!_.isEmpty(historyHomework) && (
                    <Table
                        bordered
                        dataSource={historyHomework}
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
                        title={() => (
                            <p className='text-center mb-0 fs-17'>
                                <Tooltip
                                    title={getTranslateText('quiz.desc_point')}
                                >
                                    <strong>
                                        {getTranslateText('quiz.avg')}:{' '}
                                        {avgHomework}{' '}
                                        {getTranslateText('quiz.point')}
                                    </strong>
                                </Tooltip>
                            </p>
                        )}
                    />
                )}
                <div>
                    {startingHomework ? (
                        <div className='d-flex justify-content-center'>
                            <Spin />
                        </div>
                    ) : !_.isEmpty(quizSession) &&
                      !_.isEmpty(quizSession.questions) ? (
                        <Spin spinning={loadingSubmit}>
                            <Row
                                gutter={[20, 0]}
                                className='mt-5'
                                ref={topHomeworkRef}
                            >
                                <Col span={16}>{renderQuizSession()}</Col>
                                <Col span={8}>
                                    <Result
                                        questions={quizSession.questions}
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
                                disabled={startingHomework}
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
                visible={visibleHomeWorkResult}
                toggleModal={toggleHomeWorkResult}
                data={historyHomework[historyHomework.length - 1]}
            />
        </div>
    )
}
export default MultiChoice
