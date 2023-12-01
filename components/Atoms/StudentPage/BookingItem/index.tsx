import React, {
    FC,
    memo,
    useState,
    useRef,
    useCallback,
    useEffect
} from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'
import TagStatus from 'components/Atoms/TeacherPage/TagStatus'
import {
    Row,
    Col,
    Image,
    Button,
    Modal,
    Form,
    Input,
    Dropdown,
    Menu
} from 'antd'
import {
    EyeOutlined,
    CaretRightOutlined,
    TeamOutlined,
    FileDoneOutlined,
    TrophyOutlined,
    SoundOutlined
} from '@ant-design/icons'
import _ from 'lodash'
import Star from 'components/Atoms/TeacherPage/Star'
import moment from 'moment'
import { BOOKING_TYPE } from 'const/calendar'
import { FULL_DATE_FORMAT, HOUR_TO_MS, MINUTE_TO_MS } from 'const/date-time'
import {
    EnumBookingMediumType,
    EnumOrderType,
    IBooking,
    EnumUnitType
} from 'types'
import { BOOKING_STATUS, TEST_TYPE } from 'const/status'
import BookingAPI from 'api/BookingAPI'
import { notify } from 'contexts/Notification'
import RatingPopup from 'components/Atoms/RatingPopup'
import { getTranslateText } from 'utils/translate-utils'
import { hasHTTPUrl } from 'utils/string-utils'
import { getCookie } from 'helpers/cookie'
import { ROLES_ENUM } from 'const'
import { useAuth } from 'contexts/Auth'
import TrialTestApi from 'api/TrialTestApi'
import { encodeFilenameFromLink } from 'utils/functions'
import styles from './BookingItem.module.scss'

const { TextArea } = Input

type Props = {
    data: IBooking
    refetchData: () => void
    openMemoModal: (booking: IBooking) => void
    showHomework?: boolean
    timestampNow?: number
}

// let idIntervel: any = 0

const BookingItem: FC<Props> = ({
    data,
    refetchData,
    openMemoModal,
    showHomework = true,
    timestampNow
}) => {
    const { user } = useAuth()
    const router = useRouter()

    const refInputReason = useRef(null)

    const [isLoading, setLoading] = useState<boolean>(false)
    const [visibleCancel, setVisibleCancel] = useState<boolean>(false)
    const [visibleRating, setVisibleRating] = useState<boolean>(false)
    const [confirmBeforeTest, setConfirmBeforeTest] = useState<boolean>(false)
    const [typeRequest, setTypeRequest] = useState(null)
    const cancelTime = data?.teacher_info?.cancel_time || 180
    // const [time, setTime] = useState(moment().valueOf())

    // useEffect(() => {
    //     idIntervel = setInterval(() => setTime(moment().valueOf()), 1000)
    //     return () => clearInterval(idIntervel)
    // }, [])

    const toggleReasonModal = (value, type) => {
        setVisibleCancel(value)
        setTypeRequest(type)
    }

    const toggleConfirmBeforeTestModal = (value) => {
        if (value === false) {
            const myVideo: any = document.getElementById('video-trial-test')
            myVideo.src = 'https://www.youtube.com/embed/NJvggKc_9ks'
        }
        setConfirmBeforeTest(value)
    }

    const toggleRatingModal = useCallback(
        (value) => {
            setVisibleRating(value)
        },
        [visibleRating]
    )

    const handleCancel = () => {
        const reason =
            refInputReason.current?.resizableTextArea?.textArea?.value
        setLoading(true)
        const minute = (data.calendar.start_time - timestampNow) / MINUTE_TO_MS
        BookingAPI.absentOrCancelLesson(data.id, {
            reason,
            status:
                typeRequest === 'absent' ||
                (!typeRequest && minute < cancelTime)
                    ? BOOKING_STATUS.STUDENT_ABSENT
                    : BOOKING_STATUS.CANCEL_BY_STUDENT
        })
            .then(() => {
                notify(
                    'success',
                    getTranslateText(
                        typeRequest === 'absent' ||
                            (!typeRequest && minute < cancelTime)
                            ? 'absent_lesson_success'
                            : 'cancel_lesson_success'
                    )
                )
                refetchData()
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    const handleJoinClass = () => {
        if (
            data.status === BOOKING_STATUS.TEACHING ||
            data.status === BOOKING_STATUS.CONFIRMED
        ) {
            if (
                data.learning_medium?.medium_type ===
                    EnumBookingMediumType.HAMIA_MEET &&
                data.learning_medium?.info?.student_link
            ) {
                window.open(data.learning_medium?.info?.student_link, '_self')
                // window.open(
                //     `/meet?room=${data.id}&idTeacher=${data.teacher_id}&idStudent=${data.student_id}&time=${data.calendar.start_time}`,
                //     '_self'
                // )
            } else {
                BookingAPI.joinClass(data.id)
                    .then((res) => {
                        window.open(res.join_url, '_self')
                    })
                    .catch((err) => {
                        notify('error', err.message)
                    })
            }
        } else {
            notify('error', getTranslateText('teacher_not_start_class'))
        }
    }

    const handleJoinClassSoon = () => {
        window.open(
            `/meet?room=${data.id}&idTeacher=${data.teacher_id}&idStudent=${data.student_id}&time=${data.calendar.start_time}`,
            '_self'
        )
    }

    const baseTrialUrl = process.env.NEXT_PUBLIC_TRIAL_TEST_URL
    const trialTestToken = getCookie('token')

    const openTrialTest = (type) => {
        // const windowReference = window.open()
        if (type === 'regular') {
            toggleConfirmBeforeTestModal(false)
        }
        BookingAPI.startTest(data.id, type)
            .then((res) => {
                // const url = `${baseTrialUrl}/student/trial-test?code=${res.data.test_result_code}&type=test&trial_test_token=${trialTestToken}`
                const url = `${baseTrialUrl}${res.data.trial_test_url}?code=${res.data.test_result_code}&type=test`
                // windowReference.location = url
                setTimeout(() => {
                    window.open(url, '_blank')
                }, 500)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const openResultTrialTest = (type) => {
        // const url = `${baseTrialUrl}/student/trial-test?code=${data.test_result_code}&type=result&trial_test_token=${trialTestToken}`
        let url = ''
        console.log(type)
        switch (type) {
            case 'regular':
                url = `${baseTrialUrl}${data.trial_test_url}?code=${data.test_result_code}&type=result`
                break
            case 'ielts_grammar':
                url = `${baseTrialUrl}${data.trial_test_ielts_result?.test_url}?code=${data.trial_test_ielts_result?.test_result_grammar?.test_result_code}&type=result`
                break
            case 'ielts_listening':
                url = `${baseTrialUrl}${data.trial_test_ielts_result?.test_result_listening.sub_test_url}?code=${data.trial_test_ielts_result?.test_result_listening?.test_result_code}&type=result`
                break
            case 'ielts_reading':
                url = `${baseTrialUrl}${data.trial_test_ielts_result?.test_result_reading.sub_test_url}?code=${data.trial_test_ielts_result?.test_result_reading?.test_result_code}&type=result`
                break
            case 'ielts_writing':
                url = `${baseTrialUrl}${data.trial_test_ielts_result?.test_result_writing.sub_test_url}?code=${data.trial_test_ielts_result?.test_result_writing?.test_result_code}&type=result`
                break
            default:
                break
        }
        console.log(url)
        window.open(url, '_blank')
    }

    const showTrialTest = () => {
        // Nếu booking có test_topic_id thì hiện nút này
        if (data && data.test_topic_id) {
            // Nếu booking có test_result_id thì hiện view kết quả test
            if (data.test_result_id) {
                return (
                    <Button
                        type='primary'
                        shape='round'
                        className='btn btn-result-trial-test'
                        onClick={() => openResultTrialTest('regular')}
                    >
                        {getTranslateText('view_result_trial_test')}
                    </Button>
                )
            }
            // Nếu booking không có test_result_id thì hiện start test
            if (!data.test_result_id) {
                return (
                    <Button
                        type='primary'
                        shape='round'
                        className='btn btn-start-trial-test'
                        onClick={() => toggleConfirmBeforeTestModal(true)}
                        // onClick={() => openTrialTest()}
                    >
                        {getTranslateText('start_trial_test')}
                    </Button>
                )
            }
        }
    }

    const showCancel = () => {
        // Nếu thời gian hiện tại lớn hơn giờ học dự kiến là 1 tiêng thì show btn cancel
        if (
            [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(
                data.status
            ) &&
            data.calendar &&
            data.calendar.start_time > timestampNow
        ) {
            const minute =
                (data.calendar.start_time - timestampNow) / MINUTE_TO_MS
            if (minute >= cancelTime) {
                return (
                    <Button
                        type='primary'
                        shape='round'
                        danger
                        onClick={() => toggleReasonModal(true, 'cancel')}
                    >
                        {getTranslateText('cancel')}
                    </Button>
                )
            }
            return (
                <Button
                    type='primary'
                    shape='round'
                    danger
                    onClick={() => toggleReasonModal(true, 'absent')}
                >
                    {getTranslateText('absent')}
                </Button>
            )
        }
        if (BOOKING_STATUS.COMPLETED === data.status) {
            return (
                <>
                    <TrophyOutlined />
                    <span
                        className='pl-1'
                        onClick={() => toggleRatingModal(true)}
                    >
                        {getTranslateText('rating')}
                    </span>
                </>
            )
        }
    }

    const showMemoOrJoinClass = () => {
        if (
            [BOOKING_STATUS.CONFIRMED].includes(data.status) &&
            data.calendar.start_time - timestampNow < 1800000
        ) {
            return (
                <Col
                    span={12}
                    style={{ color: '#25ab5c' }}
                    className={`${cn(styles.borderRight)} ${cn(
                        styles.borderRight_none
                    )} d-flex align-items-center justify-content-center py-3`}
                >
                    <Button
                        type='primary'
                        shape='round'
                        onClick={handleJoinClass}
                        loading={isLoading}
                    >
                        {getTranslateText('join_class_soon').toUpperCase()}
                    </Button>
                </Col>
            )
        }

        if ([BOOKING_STATUS.TEACHING].includes(data.status)) {
            return (
                <Col
                    span={12}
                    style={{ color: '#25ab5c' }}
                    className={`${cn(styles.borderRight)} ${cn(
                        styles.borderRight_none
                    )} d-flex align-items-center justify-content-center py-3`}
                >
                    <Button
                        type='primary'
                        shape='round'
                        onClick={handleJoinClass}
                        loading={isLoading}
                    >
                        {getTranslateText('join_class').toUpperCase()}
                    </Button>
                </Col>
            )
        }

        if (
            data.status === BOOKING_STATUS.COMPLETED &&
            (data.memo?.note.length > 0 || data.memo?.other.length > 0) &&
            !(
                user?.role?.includes(ROLES_ENUM.STUDENT) &&
                data.ordered_package?.type === EnumOrderType.TRIAL
            )
        ) {
            return (
                <Col
                    span={12}
                    style={{ color: '#25ab5c' }}
                    className={`${cn(styles.borderRight)} ${cn(
                        styles.borderRight_none
                    )} d-flex align-items-center justify-content-center py-3 ${
                        data.status === BOOKING_STATUS.COMPLETED
                            ? 'clickable'
                            : ''
                    }`}
                    onClick={() => openMemoModal(data)}
                >
                    <FileDoneOutlined />
                    <span className='pl-1'>
                        {getTranslateText('student.booking.viewMemo')}
                    </span>
                </Col>
            )
        }
    }

    const visibleShowDetail = () => (
        <>
            {data.status === BOOKING_STATUS.COMPLETED && (
                <div className={styles['show-detail']}>
                    <Button
                        type='primary'
                        shape='round'
                        onClick={() => {
                            router.push(`${router.pathname}/${data.id}`)
                        }}
                    >
                        {getTranslateText('show_detail')}
                    </Button>
                </div>
            )}
        </>
    )

    const onViewDocument = useCallback(
        (linkDoc) => {
            if (linkDoc) {
                window.open(
                    hasHTTPUrl(linkDoc)
                        ? encodeFilenameFromLink(linkDoc)
                        : `https://ispeak.vn/${encodeFilenameFromLink(
                              linkDoc
                          )}`,
                    '_blank'
                )
            } else {
                notify('error', getTranslateText('link_document_invalid'))
            }
        },
        [data]
    )

    const onViewAudio = useCallback(
        (item) => {
            const linkAudio = item
            if (linkAudio) {
                window.open(
                    hasHTTPUrl(linkAudio)
                        ? encodeFilenameFromLink(linkAudio)
                        : `https://ispeak.vn/${encodeFilenameFromLink(
                              linkAudio
                          )}`,
                    '_blank'
                )
            } else {
                notify('error', getTranslateText('unit_audio_invalid'))
            }
        },
        [data]
    )

    const onViewVideo = useCallback(() => {
        const recordLink = data?.record_link
        if (recordLink) {
            if (typeof recordLink === 'string') {
                window.open(encodeFilenameFromLink(recordLink), '_blank')
            } else {
                // eslint-disable-next-line no-restricted-syntax
                for (const iterator of recordLink as any) {
                    window.open(encodeFilenameFromLink(iterator), '_blank')
                }
            }
        }
    }, [data])

    const renderTest = () => {
        if (data.unit?.unit_type === EnumUnitType.IELTS_4_SKILLS) {
            return (
                <>
                    {data?.trial_test_ielts_result?.test_result_listening
                        ?.test_topic_id &&
                        !data?.trial_test_ielts_result?.test_result_listening
                            ?.submission_time && (
                            <Menu.Item
                                key='4'
                                onClick={() => openTrialTest('ielts_listening')}
                            >
                                <span className='pl-1'>
                                    {getTranslateText('listening_test')}
                                </span>
                            </Menu.Item>
                        )}
                    {data?.trial_test_ielts_result?.test_result_reading
                        ?.test_topic_id &&
                        !data?.trial_test_ielts_result?.test_result_reading
                            ?.submission_time && (
                            <Menu.Item
                                key='5'
                                onClick={() => openTrialTest('ielts_reading')}
                            >
                                <span className='pl-1'>
                                    {getTranslateText('reading_test')}
                                </span>
                            </Menu.Item>
                        )}
                    {data?.trial_test_ielts_result?.test_result_writing
                        ?.test_topic_id &&
                        !data?.trial_test_ielts_result?.test_result_writing
                            ?.submission_time && (
                            <Menu.Item
                                key='6'
                                onClick={() => openTrialTest('ielts_writing')}
                            >
                                <span className='pl-1'>
                                    {getTranslateText('writing_test')}
                                </span>
                            </Menu.Item>
                        )}
                    {data?.trial_test_ielts_result?.test_result_reading
                        ?.test_topic_id &&
                        data?.trial_test_ielts_result?.test_result_reading
                            ?.test_result_id &&
                        data?.trial_test_ielts_result?.test_result_reading
                            ?.submission_time && (
                            <Menu.Item
                                key='7'
                                onClick={() =>
                                    openResultTrialTest('ielts_reading')
                                }
                            >
                                <span className='pl-1'>
                                    {getTranslateText('reading_test_result')}
                                </span>
                            </Menu.Item>
                        )}
                    {data?.trial_test_ielts_result?.test_result_writing
                        ?.test_topic_id &&
                        data?.trial_test_ielts_result?.test_result_writing
                            ?.test_result_id &&
                        data?.trial_test_ielts_result?.test_result_writing
                            ?.submission_time && (
                            <Menu.Item
                                key='8'
                                onClick={() =>
                                    openResultTrialTest('ielts_writing')
                                }
                            >
                                <span className='pl-1'>
                                    {getTranslateText('writing_test_result')}
                                </span>
                            </Menu.Item>
                        )}
                    {data?.trial_test_ielts_result?.test_result_listening
                        ?.test_topic_id &&
                        data?.trial_test_ielts_result?.test_result_listening
                            ?.test_result_id &&
                        data?.trial_test_ielts_result?.test_result_listening
                            ?.submission_time && (
                            <Menu.Item
                                key='9'
                                onClick={() =>
                                    openResultTrialTest('ielts_listening')
                                }
                            >
                                <span className='pl-1'>
                                    {getTranslateText('listening_test_result')}
                                </span>
                            </Menu.Item>
                        )}
                </>
            )
        }
        if (data.unit?.unit_type === EnumUnitType.IELTS_GRAMMAR) {
            if (
                data?.trial_test_ielts_result?.test_result_grammar
                    ?.test_topic_id &&
                !data?.trial_test_ielts_result?.test_result_grammar
                    ?.submission_time
            ) {
                return (
                    <Menu.Item
                        key='3'
                        onClick={() => toggleConfirmBeforeTestModal(true)}
                    >
                        <span className='pl-1'>
                            {getTranslateText('grammar_test')}
                        </span>
                    </Menu.Item>
                )
            }
            if (
                data?.trial_test_ielts_result?.test_result_grammar
                    ?.test_topic_id &&
                data?.trial_test_ielts_result?.test_result_grammar
                    ?.submission_time &&
                data?.trial_test_ielts_result?.test_result_grammar
                    ?.test_result_id
            ) {
                return (
                    <Menu.Item
                        key='4'
                        onClick={() => openResultTrialTest('ielts_grammar')}
                    >
                        <span className='pl-1'>
                            {getTranslateText('grammar_test_result')}
                        </span>
                    </Menu.Item>
                )
            }
        } else {
            let isStartTest = false
            let isTestResult = false

            const allScore = [
                data.test_result?.vocabulary,
                data.test_result?.reading,
                data.test_result?.writing,
                data.test_result?.grammar
            ]
            const checkNumber = (element) => typeof element === 'number'
            if (allScore.some(checkNumber)) {
                isTestResult = true
            } else {
                isStartTest = true
            }

            if (
                data?.ordered_package?.type === EnumOrderType.TRIAL &&
                data?.test_topic_id &&
                isStartTest
            ) {
                return (
                    <Menu.Item
                        key='3'
                        onClick={() => toggleConfirmBeforeTestModal(true)}
                    >
                        <span className='pl-1'>
                            {getTranslateText('reading_writing_test')}
                        </span>
                    </Menu.Item>
                )
            }
            if (
                data?.ordered_package?.type === EnumOrderType.TRIAL &&
                data?.test_topic_id &&
                data?.test_result_id &&
                isTestResult
            ) {
                return (
                    <Menu.Item
                        key='4'
                        onClick={() => openResultTrialTest('regular')}
                    >
                        <span className='pl-1'>
                            {getTranslateText('reading_writing_test_result')}
                        </span>
                    </Menu.Item>
                )
            }
        }
    }

    const showMenuDocument = () => {
        if (
            data?.unit?.student_document ||
            data?.unit?.homework_id ||
            data?.unit?.homework2_id ||
            data?.unit?.workbook ||
            data?.test_topic_id ||
            data?.trial_test_ielts_result
        ) {
            const handleRedirectDetailHomework = () => {
                if (data?.unit?.homework || data?.unit?.homework2) {
                    window.open(`/student/homework/${data.id}`, '_blank')
                }
            }

            const menu = (
                <Menu>
                    {data?.unit?.student_document && (
                        <Menu.Item
                            key='0'
                            onClick={() =>
                                onViewDocument(data?.unit?.student_document)
                            }
                        >
                            <span className='pl-1'>
                                {data?.ordered_package?.type ===
                                EnumOrderType.TRIAL
                                    ? getTranslateText(
                                          'student.booking.speakingTest'
                                      )
                                    : getTranslateText(
                                          'student.booking.documentLesson'
                                      )}
                            </span>
                        </Menu.Item>
                    )}
                    {(data?.unit?.homework_id || data?.unit?.homework2_id) &&
                        showHomework && (
                            <Menu.Item
                                key='1'
                                onClick={handleRedirectDetailHomework}
                            >
                                <span className='pl-1'>
                                    {getTranslateText(
                                        'student.booking.homework'
                                    )}
                                </span>
                            </Menu.Item>
                        )}
                    {data?.unit?.workbook && (
                        <Menu.Item
                            key='2'
                            onClick={() => onViewDocument(data?.unit?.workbook)}
                        >
                            <span className='pl-1'>
                                {getTranslateText('student.booking.workbook')}
                            </span>
                        </Menu.Item>
                    )}
                    {renderTest()}
                </Menu>
            )

            return (
                <Dropdown overlay={menu} trigger={['click']}>
                    <Col
                        span={12}
                        className={`${cn(
                            styles.borderRight,
                            styles.btnControl
                        )} d-flex align-items-center justify-content-center py-3 clickable`}
                    >
                        <>
                            <EyeOutlined />
                            <span className='pl-1'>
                                {data?.ordered_package?.type ===
                                EnumOrderType.TRIAL
                                    ? getTranslateText(
                                          'student.booking.testDocument'
                                      )
                                    : getTranslateText(
                                          'student.booking.viewDocument'
                                      )}
                            </span>
                        </>
                    </Col>
                </Dropdown>
            )
        }

        return <></>
    }

    const showBookingType = () => {
        if (data?.ordered_package?.type === EnumOrderType.TRIAL) {
            return <span>TRIAL</span>
        }
        if (data?.is_regular_booking) {
            return <span className={cn(styles.regular)}>REGULAR</span>
        }
        return <span>FLEXIBLE</span>
    }

    const showListAudio = () => {
        if (data?.unit?.audio && data?.unit?.audio.length > 0) {
            if (
                !Array.isArray(data?.unit?.audio) ||
                (Array.isArray(data?.unit?.audio) &&
                    data?.unit?.audio.length === 1)
            ) {
                return (
                    <Col
                        span={12}
                        className={`${cn(
                            styles.borderRight,
                            styles.btnControl
                        )} d-flex align-items-center justify-content-center py-3 clickable`}
                        onClick={() =>
                            onViewAudio(
                                Array.isArray(data?.unit?.audio)
                                    ? data?.unit?.audio[0]
                                    : data?.unit?.audio
                            )
                        }
                    >
                        <SoundOutlined />
                        <span className='pl-1'>
                            {getTranslateText('student.booking.viewAudio')}
                        </span>
                    </Col>
                )
            }
            const menu = (
                <Menu>
                    {Array.isArray(data?.unit?.audio) &&
                        data?.unit?.audio.length > 1 &&
                        data?.unit?.audio.map((item: any, index: number) => (
                            <Menu.Item
                                key={index}
                                onClick={() => onViewAudio(item)}
                            >
                                <span className='pl-1'>
                                    {getTranslateText(
                                        'student.booking.viewAudio'
                                    )}{' '}
                                    {index + 1}
                                </span>
                            </Menu.Item>
                        ))}
                </Menu>
            )

            return (
                <Dropdown overlay={menu} trigger={['click']}>
                    <Col
                        span={12}
                        className={`${cn(
                            styles.borderRight,
                            styles.btnControl
                        )} d-flex align-items-center justify-content-center py-3 clickable`}
                    >
                        <>
                            <SoundOutlined />
                            <span className='pl-1'>
                                {getTranslateText('student.booking.viewAudio')}
                            </span>
                        </>
                    </Col>
                </Dropdown>
            )
        }

        return <></>
    }

    return (
        <div className={cn(styles.item)}>
            {visibleShowDetail()}
            <TagStatus status={data.status} />
            <Row className={`${cn(styles.content)} m-0`}>
                <div className={cn(styles.topItem)}>
                    <div className={`${cn(styles.item_left)}`}>
                        <div className={cn(styles.item_left_child)}>
                            <ul className={cn(styles.timeDate)}>
                                <li className={cn(styles.numberID)}>
                                    #{data.id}
                                </li>
                                <li className={cn(styles.textTime)}>
                                    <span>
                                        {data.calendar &&
                                            moment(
                                                data.calendar.start_time
                                            ).format('HH')}
                                        :
                                        {data.calendar &&
                                            moment(
                                                data.calendar.start_time
                                            ).format('mm')}
                                    </span>
                                    <span> - </span>
                                    <span>
                                        {data.calendar &&
                                            moment(
                                                data.calendar.end_time
                                            ).format('HH')}
                                        :
                                        {data.calendar &&
                                            moment(
                                                data.calendar.end_time
                                            ).format('mm')}
                                    </span>
                                </li>
                                <li className={cn(styles.textLarge)}>
                                    {showBookingType()}
                                </li>
                                <li className={cn(styles.textDateTime)}>
                                    {data.calendar &&
                                        moment(data.calendar.start_time).format(
                                            'DD/MM/YYYY'
                                        )}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={`${cn(styles.item_mid)}`}>
                        <ul className={cn(styles.courseName)}>
                            <li>
                                <span>
                                    {getTranslateText('student.booking.course')}
                                </span>
                                <span>{data.course && data.course.name}</span>
                            </li>
                            {/* <li>
                                <span>
                                    {getTranslateText('student.booking.page')}
                                </span>
                                <span>8</span>
                            </li> */}
                            <li>
                                <span>
                                    {getTranslateText('student.booking.unit')}
                                </span>
                                <span>{data.unit && data.unit.name}</span>
                            </li>
                        </ul>
                    </div>
                    <div className={`${cn(styles.item_right)}`}>
                        <ul className={cn(styles.studentName)}>
                            <li>
                                <span>
                                    {getTranslateText(
                                        'student.booking.teacher'
                                    )}
                                </span>
                                <span>
                                    {data.teacher && data.teacher.full_name}
                                </span>
                            </li>
                            <li>
                                <span>{getTranslateText('email')}</span>
                                <span>
                                    {data.teacher && data.teacher.email}
                                </span>
                            </li>
                            <li>
                                <span>
                                    {getTranslateText('teacher.info.skype')}
                                </span>
                                <span>{data.teacher?.skype_account || ''}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <Col span={24} className={`${cn(styles.control)}`}>
                    <Row>
                        <Col span={8}>
                            <Row>
                                {showMenuDocument()}
                                {showListAudio()}
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row>
                                {data?.record_link && (
                                    <Col
                                        span={12}
                                        className={`${cn(
                                            styles.borderRight,
                                            styles.btnControl
                                        )} d-flex align-items-center justify-content-center py-3 clickable`}
                                        onClick={onViewVideo}
                                    >
                                        <>
                                            <CaretRightOutlined />
                                            <span className='pl-1'>
                                                {getTranslateText(
                                                    'student.booking.viewVideo'
                                                )}
                                            </span>
                                        </>
                                    </Col>
                                )}
                                {data?.status === BOOKING_STATUS.TEACHING && (
                                    <Col
                                        span={12}
                                        className={`${cn(
                                            styles.borderRight,
                                            styles.btnControl
                                        )} d-flex align-items-center justify-content-center py-3 clickable`}
                                    >
                                        <FileDoneOutlined />
                                        <span className='pl-1'>
                                            {getTranslateText('common.report')}
                                        </span>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <Col
                                    span={12}
                                    className={`${cn(
                                        styles.borderRight,
                                        styles.btnControl
                                    )} d-flex align-items-center justify-content-center py-3 clickable`}
                                >
                                    {showCancel()}
                                </Col>
                                {showMemoOrJoinClass()}
                            </Row>
                        </Col>
                    </Row>
                </Col>
                {/* <Col span={24} className={`${cn(styles.control)}`}>
                    <Row>
                        <Col
                            span={24}
                            className={`${cn(
                                styles.borderRight,
                                styles.btnControl
                            )} d-flex align-items-center justify-content-center py-3 clickable`}
                        >
                            {showTrialTest()}
                        </Col>
                    </Row>
                </Col> */}
                {data.report && data.report.report_content.rating > 0 && (
                    <Col span={24} className={cn(styles.review_rating)}>
                        <div>{getTranslateText('student_review_rating')}</div>
                        <div className={cn(styles.nameStudent)}>
                            {data.student && `${data.student.full_name}`}
                        </div>
                        <div className={cn(styles.review)}>
                            {data.report?.report_content?.teacher?.comment}
                        </div>
                        <div className={`${cn(styles.rating)}`}>
                            <div className={cn(styles.groupStar)}>
                                {_.fill(Array(5), 0).map((_item, index) => (
                                    <div
                                        key={index}
                                        className={cn(styles.starRatingItem)}
                                    >
                                        <Star
                                            active={
                                                data.report?.report_content
                                                    .rating >=
                                                index + 1
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={cn(styles.dateTime)}>
                                <div>
                                    <TeamOutlined
                                        style={{ color: '#9c9c9c' }}
                                    />
                                    <span>
                                        {getTranslateText(
                                            'student.booking.public'
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        {moment(
                                            data.report?.created_time
                                        ).format(FULL_DATE_FORMAT)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Col>
                )}
            </Row>
            <Modal
                maskClosable
                centered
                visible={visibleCancel}
                title={
                    typeRequest === 'absent'
                        ? getTranslateText('request.absent')
                        : getTranslateText('request.cancel')
                }
                closeIcon={false}
                closable={false}
                onCancel={() => toggleReasonModal(false, typeRequest)}
                onOk={handleCancel}
            >
                {typeRequest === 'absent' && (
                    <div className={cn(styles.noteStyle)}>
                        Đã quá giờ quy định xin nghỉ, nếu bạn quyết định nghỉ
                        thì sẽ mất buổi học hôm nay và trạng thái là Student
                        Absent
                    </div>
                )}
                <Form.Item label='Reason' style={{ marginBottom: 0 }}>
                    <TextArea ref={refInputReason} />
                </Form.Item>
            </Modal>
            <Modal
                maskClosable
                centered
                visible={confirmBeforeTest}
                title={getTranslateText('manipulation_instructions')}
                closeIcon={false}
                closable={false}
                width={700}
                footer={[
                    <Button
                        key='submit1'
                        type='default'
                        onClick={() => toggleConfirmBeforeTestModal(false)}
                    >
                        {getTranslateText('cancel')}
                    </Button>,
                    <Button
                        key='submit2'
                        type='primary'
                        onClick={() => openTrialTest('regular')}
                    >
                        {getTranslateText('start_trial_test')}
                    </Button>
                ]}
            >
                <iframe
                    className='video-huong-dan-thao-tac'
                    id='video-trial-test'
                    src='https://www.youtube.com/embed/NJvggKc_9ks'
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    style={{
                        width: '100%',
                        minHeight: '315px',
                        borderRadius: '10px'
                    }}
                />
            </Modal>
            {data?.id && data?.teacher?.id && (
                <RatingPopup
                    visible={visibleRating}
                    data={data.report?.report_content}
                    toggleModal={() => toggleRatingModal(false)}
                    refetchData={refetchData}
                    bookingData={{
                        id: data?.id,
                        teacher_id: data?.teacher?.id
                    }}
                />
            )}
        </div>
    )
}

export default memo(BookingItem)
