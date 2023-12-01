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
import { useCallback, useEffect, useRef, useState } from 'react'
import BookingAPI from 'api/BookingAPI'
import { IBooking, IQuiz } from 'types'
import { notify } from 'contexts/Notification'
import QuizAPI from 'api/QuizAPI'
import moment from 'moment'
import _ from 'lodash'
import { ColumnsType } from 'antd/lib/table'
import {
    EnumQuizSessionStatus,
    HOUR_TO_MS,
    PIVOT_HOUR_FOR_AVG,
    EnumQuizSessionType,
    EnumHomeworkType,
    EnumHomeworkDataType
} from 'const'
import HomeWorkResultPopup from 'components/Atoms/HomeWorkResultPopup'
import { toReadablePrice } from 'utils/price-utils'
import HomeworkTestResultApi from 'api/HomeworkTestResultApi'
import { getCookie } from 'helpers/cookie'
import BlockHeader from '../BlockHeader'
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
    const [questions, setQuestions] = useState<any[]>([])
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [avgHomework, setAvgHomework] = useState(0)
    const [visibleHomeWorkResult, setVisibleHomeWorkResult] = useState(false)
    const [typeHomework, setTypeHomework] = useState(EnumHomeworkType.v2)
    const [typeDataHomework, setTypeDataHomework] = useState(
        EnumHomeworkDataType.COMMON
    )

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

    const editHomeworkBooking = (booking_id, payload) => {
        BookingAPI.editHomeworkBooking(booking_id, payload)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const baseTrialUrl = process.env.NEXT_PUBLIC_TRIAL_TEST_URL
    const trialTestToken = getCookie('token')

    const openHomeworkTest = () => {
        // const windowReference = window.open()
        HomeworkTestResultApi.startTest(booking.id)
            .then((res) => {
                // const url = `${baseTrialUrl}/student/trial-test?code=${res.data.test_result_code}&type=test&trial_test_token=${trialTestToken}`
                const url = `${baseTrialUrl}${res.data.test_url}?code=${res.data.test_result_code}&type=test`
                // windowReference.location = url
                setTimeout(() => {
                    window.open(url, '_blank')
                }, 500)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const openResultHomeworkTest = (data) => {
        // const url = `${baseTrialUrl}/student/trial-test?code=${data.test_result_code}&type=result&trial_test_token=${trialTestToken}`
        const url = `${baseTrialUrl}${data.test_url}?code=${data.test_result_code}&type=result`
        window.open(url, '_blank')
    }

    const checkScoreValid = (time_booking_finished, submission_time) => {
        const allowTimeForHomeWork = PIVOT_HOUR_FOR_AVG * HOUR_TO_MS
        if (submission_time - time_booking_finished <= allowTimeForHomeWork) {
            return true
        }
        return false
    }

    const calculateAvg = (quiz_id, booking_finished_at) => {
        QuizAPI.calculateAvgHomework(_.toInteger(quiz_id), booking_finished_at)
            .then((res) => {
                if (res) {
                    setAvgHomework(res.average.toFixed(2))

                    editHomeworkBooking(router.query.id, { homework: res })
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
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

    useEffect(() => {
        if (booking?.unit?.homework_id) {
            getQuizInfo(booking?.unit?.homework_id)
        }
    }, [booking])

    useEffect(() => {
        const { id } = router.query
        if (id) {
            getDetailBooking(id)
        }
    }, [router.query])

    const scrollToTopHomework = () => {
        if (topHomeworkRef?.current) {
            topHomeworkRef?.current?.scrollIntoView({
                behavior: 'smooth'
            })
        }
    }

    const getHistoryDoHomework = (query?: {
        page_size: number
        page_number: number
        quiz_id: number
        type: number
    }) => {
        QuizAPI.getHistoryDoHomework(query)
            .then((res) => {
                setHistoryHomework(res.data)
                if (res.pagination && res.pagination.total > 0) {
                    setTotal(res.pagination.total)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const getHistoryDoHomework2 = (query?: {
        page_size: number
        page_number: number
        booking_id: number
        type: string
    }) => {
        HomeworkTestResultApi.getSessionHomeworkTestIelts(query)
            .then((res) => {
                setHistoryHomework(res.data)
                if (res.data.length > 0 && res.data[0].test_result) {
                    if (
                        checkScoreValid(
                            booking?.calendar?.end_time,
                            res.data[0]?.test_result?.submission_time
                        )
                    ) {
                        setAvgHomework(
                            query?.type === EnumHomeworkDataType.IELTS
                                ? res.data[0]?.test_result
                                      ?.percent_correct_answers
                                : res.data[0]?.test_result.avg
                        )
                    } else {
                        setAvgHomework(0)
                    }
                }
                if (res.pagination && res.pagination.total > 0) {
                    setTotal(res.pagination.total)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    useEffect(() => {
        if (booking?.id) {
            const homeworkId = booking?.unit?.homework_id
            const homework2Id = booking?.unit?.homework2_id
            if (
                homeworkId &&
                ((booking.homework?.sessions &&
                    booking.homework?.sessions[0]) ||
                    !homework2Id)
            ) {
                setTypeHomework(EnumHomeworkType.v1)
                getHistoryDoHomework({
                    page_number: pageNumber,
                    page_size: pageSize,
                    quiz_id: homeworkId,
                    type: EnumQuizSessionType.HOMEWORK
                })

                calculateAvg(
                    booking?.unit?.homework_id,
                    booking?.calendar?.end_time
                )
            }
            if (
                (!booking.homework?.sessions ||
                    (booking.homework?.sessions &&
                        !booking.homework?.sessions[0])) &&
                homework2Id
            ) {
                setTypeHomework(EnumHomeworkType.v2)
                if (
                    booking?.course?.course_type === EnumHomeworkDataType.COMMON
                ) {
                    setTypeDataHomework(EnumHomeworkDataType.COMMON)
                    getHistoryDoHomework2({
                        page_number: pageNumber,
                        page_size: pageSize,
                        booking_id: booking?.id,
                        type: EnumHomeworkDataType.COMMON
                    })
                } else {
                    setTypeDataHomework(EnumHomeworkDataType.IELTS)
                    getHistoryDoHomework2({
                        page_number: pageNumber,
                        page_size: pageSize,
                        booking_id: booking?.id,
                        type: EnumHomeworkDataType.IELTS
                    })
                }
            }
        }
    }, [pageNumber, pageSize, booking])

    useEffect(() => {
        if (topHomeworkRef.current) {
            scrollToTopHomework()
        }
    }, [topHomeworkRef, startingHomework])

    const startDoHomework = () => {
        if (!quizInfo) {
            return
        }
        setStarting(true)

        setUserAnswers([])

        QuizAPI.startDoHomework({
            quiz_id: quizInfo.id,
            type: EnumQuizSessionType.HOMEWORK
        })
            .then((res) => {
                getQuizInfo(quizInfo.id)
                // setQuizSession(res)
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

    const submitResult = () => {
        setLoadingSubmit(true)
        QuizAPI.submitResultHomework({
            user_answers: userAnswers,
            quiz_session_id: quizSession.id
        })
            .then((res) => {
                notify('success', 'Success')
                const newHistory = [...historyHomework]
                newHistory[newHistory.length - 1] = res
                setHistoryHomework(newHistory)
                setQuizSession({
                    ...res,
                    status:
                        res?.user_score >= res?.quiz?.passed_minimum
                            ? EnumQuizSessionStatus.PASS
                            : EnumQuizSessionStatus.FAIL
                })
                toggleHomeWorkResult(true)
                const newQuestions = res.questions.map((i) => {
                    const tmp = {
                        ...i,
                        ...i?.question
                    }
                    return tmp
                })
                setQuestions(newQuestions)
                return calculateAvg(
                    booking.unit.homework_id,
                    booking?.calendar?.end_time
                )
            })
            .catch((err) => {
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
                        key={question._id}
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

    const columns1: ColumnsType = [
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
            dataIndex: 'end_time',
            key: 'end_time',
            width: 150,
            align: 'center',
            render: (text, record, index) => {
                if (text && booking?.calendar?.end_time) {
                    if (
                        checkScoreValid(
                            booking?.calendar?.end_time,
                            moment(text).valueOf()
                        ) &&
                        index === 0
                    ) {
                        return (
                            <StarFilled
                                style={{ color: '#fadb14', fontSize: '18px' }}
                            />
                        )
                    }
                }
                return (
                    <CloseCircleOutlined
                        style={{ color: '#ff4d4f', fontSize: '18px' }}
                    />
                )
            }
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

    const columns2: ColumnsType = [
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
            dataIndex: 'test_result',
            key: 'submission_time',
            width: 150,
            align: 'center',
            render: (text, record: any, index) => {
                if (text && booking?.calendar?.end_time) {
                    if (
                        checkScoreValid(
                            booking?.calendar?.end_time,
                            text.submission_time
                        ) &&
                        index === 0
                    ) {
                        return (
                            <StarFilled
                                style={{ color: '#fadb14', fontSize: '18px' }}
                            />
                        )
                    }
                }
                return (
                    <CloseCircleOutlined
                        style={{ color: '#ff4d4f', fontSize: '18px' }}
                    />
                )
            }
        },
        {
            title: `${getTranslateText('quiz.name')}`,
            dataIndex: 'test_topic_name',
            key: 'test_topic_name',
            width: 300,
            align: 'center'
        },
        {
            title: `${getTranslateText('quiz.score')}`,
            dataIndex: 'test_result',
            key: 'point_v2',
            width: 150,
            align: 'center',
            render: (text, record: any) => {
                if (record.test_result) {
                    if (
                        typeDataHomework === EnumHomeworkDataType.IELTS &&
                        record.test_result?.percent_correct_answers
                    ) {
                        return `${record.test_result?.percent_correct_answers.toFixed(
                            1
                        )}%`
                    }
                    if (
                        typeDataHomework === EnumHomeworkDataType.COMMON &&
                        record.test_result.avg
                    ) {
                        return `${record.test_result?.avg.toFixed(1)}/10`
                    }
                }
            }
        },
        {
            title: `${getTranslateText('quiz.start_time')}`,
            dataIndex: 'test_result',
            key: 'test_start_time',
            width: 250,
            align: 'center',
            render: (text) =>
                text &&
                moment(text.test_start_time).format('DD/MM/YYYY HH:mm:ss')
        },
        {
            title: `${getTranslateText('quiz.submit_time')}`,
            dataIndex: 'test_result',
            key: 'test_submit_time',
            width: 250,
            align: 'center',
            render: (text, record: any) =>
                text &&
                moment(text.submission_time).format('DD/MM/YYYY HH:mm:ss')
        },
        {
            title: `${getTranslateText('homework.title_view_result')}`,
            key: 'preview',
            width: 120,
            fixed: 'right',
            align: 'center',
            render: (record: any) => {
                if (record) {
                    return (
                        <button
                            className='btn big-bt'
                            style={{
                                backgroundColor: '#36cb7c',
                                width: '80px',
                                margin: '0'
                            }}
                            type='button'
                            onClick={() => openResultHomeworkTest(record)}
                        >
                            <span
                                className='color-white'
                                style={{ padding: '0 10px' }}
                            >
                                {getTranslateText('homework.view_result')}
                            </span>
                        </button>
                    )
                }
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
                            typeHomework === EnumHomeworkType.v1
                                ? quizInfo?.name
                                : booking &&
                                  booking.unit?.homework2 &&
                                  booking.unit?.homework2.topic
                        }`}
                    >
                        {/* {`${getTranslateText('quiz.number_of_question')}: ${
                            quizInfo?.score
                        }`} */}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={`${getTranslateText('quiz.time')}: ${
                            typeHomework === EnumHomeworkType.v1
                                ? toReadablePrice(
                                      _.toInteger(quizInfo?.time_limit / 60),
                                      ','
                                  )
                                : booking &&
                                  booking.unit?.homework2 &&
                                  booking.unit?.homework2.test_time
                        } ${getTranslateText('quiz.minute')}`}
                    >
                        {typeHomework === EnumHomeworkType.v1
                            ? `${getTranslateText('quiz.passed_minimum')}: ${
                                  quizInfo?.passed_minimum
                              }/${quizInfo?.score}`
                            : booking &&
                              booking.unit.homework2 &&
                              (typeDataHomework === EnumHomeworkDataType.IELTS
                                  ? `${getTranslateText(
                                        'quiz.passed_minimum'
                                    )}: 70%`
                                  : `${getTranslateText(
                                        'quiz.passed_minimum'
                                    )}: 5/10`)}
                    </Descriptions.Item>
                </Descriptions>
                {!_.isEmpty(historyHomework) && (
                    <Table
                        bordered
                        dataSource={historyHomework}
                        columns={
                            typeHomework === EnumHomeworkType.v1
                                ? columns1
                                : columns2
                        }
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
                            <div>
                                <p className='text-center mb-0 fs-17'>
                                    {/* <Tooltip
                                    title={getTranslateText('quiz.desc_avg')}
                                > */}
                                    <strong>
                                        {getTranslateText(
                                            'quiz.start_case_point'
                                        )}
                                        : {avgHomework}
                                        {typeHomework === EnumHomeworkType.v2 &&
                                        typeDataHomework ===
                                            EnumHomeworkDataType.IELTS
                                            ? ''
                                            : ' '}
                                        {typeHomework === EnumHomeworkType.v2 &&
                                        typeDataHomework ===
                                            EnumHomeworkDataType.IELTS
                                            ? '%'
                                            : getTranslateText(
                                                  'quiz.point'
                                              )}{' '}
                                    </strong>
                                    {/* </Tooltip> */}
                                </p>
                                <div
                                    className='text-center mb-0'
                                    style={{
                                        color: '#FF4D4F',
                                        fontSize: '13px',
                                        fontStyle: 'italic',
                                        marginTop: '0',
                                        fontWeight: 600
                                    }}
                                >
                                    Điểm bài tập chỉ tính lần nộp bài đầu tiên
                                    trong vòng 72h từ lúc kết thúc lớp học.
                                </div>
                            </div>
                        )}
                    />
                )}
                <div>
                    {startingHomework ? (
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
                                onClick={
                                    typeHomework === EnumHomeworkType.v2
                                        ? openHomeworkTest
                                        : startDoHomework
                                }
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
function elseif(arg0: any) {
    throw new Error('Function not implemented.')
}
