import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import TeacherAPI from 'api/TeacherAPI'
import { notify } from 'contexts/Notification'
import _ from 'lodash'
import { Spin, Steps, Alert } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import { useRouter } from 'next/router'
import { EnumStepsBooking, STEPS_IN_BOOKING } from 'const'
import cn from 'classnames'
import { ICourse, ITeacher, IUnit, IOrderedPackage } from 'types'
import BookingAPI from 'api/BookingAPI'
import { useAuth } from 'contexts/Auth'
import moment from 'moment'
import BlockHeader from '../BlockHeader'
import ChooseTime from './ChooseTime'
import ChooseCourse from './ChooseCourse'
import styles from './Booking.module.scss'
import ChooseUnit from './ChooseUnit'
import Done from './Done'

const { Step } = Steps

export interface IBookingDTO {
    ordered_package_id: number | null
    course_id: number | null
    unit_id: number | null
    start_time: number | string
    calendar_id: number | string
    teacher_id: any
    student_note: string
    course: ICourse
    ordered_package: IOrderedPackage
    unit: IUnit
    teacher: ITeacher
    calendar: any
}

const Booking = () => {
    const { user } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isSuccess, setSuccess] = useState(false)
    const [teacher, setTeacher] = useState<ITeacher>()
    const [stepCurrent, setStepCurrent] = useState(0)
    const [bookingInfo, setBookingInfo] = useState<IBookingDTO>({
        course_id: null,
        ordered_package_id: null,
        unit_id: null,
        start_time: '',
        calendar_id: '',
        teacher_id: '',
        student_note: '',
        course: null,
        ordered_package: null,
        unit: null,
        teacher: null,
        calendar: null
    })
    const [selectedTime, setSelectedTime] = useState(0)
    const [showErrorChooseTime, setShowErrorChooseTime] = useState(false)
    const [showErrorChooseTime2, setShowErrorChooseTime2] = useState(false)

    const { id } = router.query
    const getDetailTeacher = (teacher_id) => {
        setLoading(true)
        TeacherAPI.getFullInfoTeacher(teacher_id)
            .then((res) => {
                setTeacher(res)
                setBookingInfo({
                    ...bookingInfo,
                    teacher: res,
                    teacher_id: _.toInteger(teacher_id)
                })
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (id) {
            getDetailTeacher(id)
        }
    }, [id])

    const onChangeStep = useCallback(
        (val: number) => {
            setStepCurrent(val)
        },
        [stepCurrent]
    )

    const onNextStep = useCallback(() => {
        setStepCurrent((prev) => prev + 1)
    }, [stepCurrent])

    const onPrevStep = useCallback(() => {
        setStepCurrent((prev) => prev - 1)
    }, [stepCurrent])

    const onChooseScheduleTime = useCallback(
        (key: string) => (time: any, val: any) => {
            setSelectedTime(time)
            setShowErrorChooseTime(false)
            setShowErrorChooseTime2(false)
            if (Object.keys(val).length > 0) {
                setBookingInfo({
                    ...bookingInfo,
                    start_time: '',
                    calendar_id: '',
                    [key]: val.id,
                    calendar: val
                })
            } else {
                setBookingInfo({
                    ...bookingInfo,
                    start_time: '',
                    calendar_id: '',
                    calendar: null,
                    [key]: val
                })
            }
        },
        [bookingInfo]
    )

    const onChangeCourse = useCallback(
        (val: ICourse) => {
            setBookingInfo({
                ...bookingInfo,
                course_id: val?.id,
                course: val
            })
        },
        [bookingInfo]
    )

    const onChangeOrder = useCallback(
        (val: IOrderedPackage) => {
            setBookingInfo({
                ...bookingInfo,
                ordered_package_id: val?.id || null,
                course_id: null,
                ordered_package: val
            })
        },
        [bookingInfo]
    )
    const onChangeUnit = useCallback(
        (val: IUnit) => {
            setBookingInfo({
                ...bookingInfo,
                unit_id: val?.id,
                unit: val
            })
        },
        [bookingInfo]
    )

    const onChangeNote = useCallback(
        (val) => {
            setBookingInfo({
                ...bookingInfo,
                student_note: val
            })
        },
        [bookingInfo]
    )
    const isDisabledBtn = () => {
        if (
            stepCurrent === EnumStepsBooking.CHOOSE_SCHEDULE_TIME &&
            !bookingInfo.calendar_id &&
            !bookingInfo.start_time
        )
            return true
        if (
            stepCurrent === EnumStepsBooking.CHOOSE_COURSE &&
            (!bookingInfo.course_id || !bookingInfo.ordered_package_id)
        )
            return true
        if (
            stepCurrent === EnumStepsBooking.CHOOSE_UNIT &&
            !bookingInfo.unit_id
        )
            return true
        if (
            stepCurrent === EnumStepsBooking.DONE &&
            ((!bookingInfo.calendar_id && !bookingInfo.start_time) ||
                !bookingInfo.course_id ||
                !bookingInfo.ordered_package_id ||
                !bookingInfo.unit_id)
        )
            return true
        return false
    }

    const isDisabledStep = (_step: EnumStepsBooking) => {
        if (
            _step === EnumStepsBooking.CHOOSE_SCHEDULE_TIME &&
            !bookingInfo.calendar_id &&
            !bookingInfo.start_time
        )
            return true
        if (
            _step === EnumStepsBooking.CHOOSE_COURSE &&
            (!bookingInfo.course_id || !bookingInfo.ordered_package_id)
        )
            return true
        if (_step === EnumStepsBooking.CHOOSE_UNIT && !bookingInfo.unit_id)
            return true
        if (
            _step === EnumStepsBooking.DONE &&
            ((!bookingInfo.calendar_id && !bookingInfo.start_time) ||
                !bookingInfo.course_id ||
                !bookingInfo.ordered_package_id ||
                !bookingInfo.unit_id)
        )
            return true
        if (isSuccess) return true
        return false
    }

    const handleBooking = () => {
        if (stepCurrent === EnumStepsBooking.DONE) {
            setLoading(true)
            if (bookingInfo.calendar_id) {
                BookingAPI.createBooking({
                    ...bookingInfo,
                    student_id: user.id
                })
                    .then((res) => {
                        notify('success', getTranslateText('booking_success'))
                        setSuccess(true)
                    })
                    .catch((err) => {
                        notify('error', err.message)
                    })
                    .finally(() => setLoading(false))
            } else if (bookingInfo.start_time) {
                const cloneTime = moment(bookingInfo.start_time).clone()
                const end_time = cloneTime
                    .set('minute', cloneTime.get('minute') + 30)
                    .valueOf()
                BookingAPI.createBookingWithRegularCalendar({
                    ...bookingInfo,
                    student_id: user.id,
                    end_time
                })
                    .then((res) => {
                        notify('success', getTranslateText('booking_success'))
                        setSuccess(true)
                    })
                    .catch((err) => {
                        notify('error', err.message)
                    })
                    .finally(() => setLoading(false))
            }
        } else {
            onNextStep()
        }
    }
    const backToRoute = () => {
        const queryRouter = router.query
        delete queryRouter.redirect
        delete queryRouter.id
        router.push({
            pathname:
                (router.query.redirect as string) || '/student/find-a-teacher',
            query: queryRouter
        })
    }
    const renderStepContent = () => {
        switch (stepCurrent) {
            case EnumStepsBooking.CHOOSE_SCHEDULE_TIME:
                return (
                    <ChooseTime
                        teacher_id={teacher.user_id}
                        selectedCalendarId={bookingInfo.calendar_id}
                        selectedRegularTime={bookingInfo.start_time}
                        onChooseScheduleTime={onChooseScheduleTime}
                        time={selectedTime}
                    />
                )
            case EnumStepsBooking.CHOOSE_COURSE:
                return (
                    <ChooseCourse
                        selectCourseId={bookingInfo.course_id}
                        TimeChoose={selectedTime}
                        onChangeCourse={onChangeCourse}
                        onChangeOrder={onChangeOrder}
                        setShowErrorChooseTime={setShowErrorChooseTime}
                        setShowErrorChooseTime2={setShowErrorChooseTime2}
                    />
                )
            case EnumStepsBooking.CHOOSE_UNIT:
                return (
                    <ChooseUnit
                        courseId={bookingInfo.course_id}
                        selectUnitId={bookingInfo.unit_id}
                        onChangeUnit={onChangeUnit}
                    />
                )
            case EnumStepsBooking.DONE:
                return (
                    <Done
                        studentNote={bookingInfo.student_note}
                        data={bookingInfo}
                        onChangeNote={onChangeNote}
                    />
                )
            default:
                break
        }
    }
    return (
        <>
            <div className='d-flex mb-4'>
                <button
                    className={cn(
                        'btn my-2 my-sm-0 big-bt card-shadow m-0',
                        styles['btn-back']
                    )}
                    type='button'
                    name='next'
                    onClick={() => backToRoute()}
                >
                    <img src='/static/img/homepage/bt.png' alt='Next step' />
                    <span>{getTranslateText('back')}</span>
                </button>
                <div className='w-100'>
                    <BlockHeader
                        title={`${getTranslateText('schedule_your_lesson')} - ${
                            teacher?.user?.full_name
                        }`}
                    />
                </div>
            </div>
            <Steps current={stepCurrent} onChange={onChangeStep}>
                {STEPS_IN_BOOKING.map((item) => (
                    <Step
                        key={item.id}
                        title={getTranslateText(item.title)}
                        className={cn(styles['Cs-Step'])}
                        disabled={isDisabledStep(item.id)}
                    />
                ))}
            </Steps>
            {loading ? (
                <div className='mt-4 d-flex justify-content-center'>
                    <Spin />
                </div>
            ) : (
                <>
                    <div className='mt-4 mb-4 d-flex justify-content-center'>
                        <div className='w-100'>{renderStepContent()}</div>
                    </div>
                    {isSuccess && (
                        <Alert
                            message={getTranslateText('booking_success')}
                            description={
                                <div>
                                    {getTranslateText(
                                        'booking_success_desc.prefix'
                                    )}
                                    <a className={cn(styles.colorBlue4)}>
                                        <span> {teacher?.user?.full_name}</span>
                                    </a>
                                    <span>. </span>
                                    {getTranslateText(
                                        'booking_success_desc.suffix'
                                    )}
                                    <span> </span>
                                    <Link href='/student/my-booking' passHref>
                                        <a>
                                            {getTranslateText(
                                                'here'
                                            ).toLowerCase()}
                                        </a>
                                    </Link>
                                </div>
                            }
                            type='success'
                            showIcon
                            style={{ marginBottom: '1rem' }}
                        />
                    )}
                    {!isSuccess && (
                        <div className='flex justify-content-end'>
                            {stepCurrent >= 1 && (
                                <button
                                    type='button'
                                    name='previous'
                                    className={cn(styles.PreviousBtn)}
                                    value='Back'
                                    onClick={onPrevStep}
                                >
                                    <span>{getTranslateText('back')}</span>
                                </button>
                            )}
                            <button
                                className={cn(
                                    'btn my-2 my-sm-0 big-bt card-shadow m-0',
                                    styles['disable-btn-next']
                                )}
                                type='button'
                                name='next'
                                onClick={handleBooking}
                                disabled={
                                    loading ||
                                    isDisabledBtn() ||
                                    showErrorChooseTime ||
                                    showErrorChooseTime2
                                }
                            >
                                <span>
                                    {stepCurrent === EnumStepsBooking.DONE
                                        ? getTranslateText('save')
                                        : getTranslateText('next')}
                                </span>
                                <img
                                    src='/static/img/homepage/bt.png'
                                    alt='Next step'
                                />
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default Booking
