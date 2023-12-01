import cn from 'classnames'
import moment from 'moment'
import { Row, Col, message, Popover, Modal, Form } from 'antd'
import _ from 'lodash'
import { ENUM_SQUARE_TYPE, SQUARE_TYPE } from 'const/calendar'
import { FC, memo, useState, useCallback, useRef } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import ConfirmModal from 'components/Atoms/ConfirmModal'
import CalendarAPI from 'api/CalendarAPI'
import { notify } from 'contexts/Notification'
import { IAbsentRequest, ICalendar, ISchedule } from 'types'
import {
    convertToModuloTimestamp,
    formatTimestamp,
    getTimestampInWeekToLocal,
    getTimestampInWeekToUTC
} from 'utils/datetime-utils'
import {
    BOOKING_STATUS,
    EnumBookingStatus,
    EnumModalType,
    BOOKING_STATUS_TITLE
} from 'const'
import SquareItem from './SquareItem'
import styles from './ScheduleItem.module.scss'
import AbsentRequestModal from '../../AbsentRequest/modal'

const NUMBERS_CELL_IN_COLUMN = 32

type Props = {
    disabled: boolean
    startTime: number
    schedules: ISchedule
    isOpenEdit?: boolean
    refetchData?: () => Promise<any>
    absentRequests?: any
}

const ScheduleItem: FC<Props> = (props) => {
    const {
        disabled = false,
        startTime,
        isOpenEdit,
        schedules,
        refetchData,
        absentRequests
    } = props
    const {
        available_schedule,
        booked_schedule,
        available_regular_schedule,
        registered_regular_schedule
    } = schedules
    const [loading, setLoading] = useState(false)
    const [clickedSquare, setClickedSquare] = useState<number>()
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<any>(null)

    const createSchedule = useCallback(
        (payload: { start_time: number; end_time: number }) => {
            setLoading(true)
            CalendarAPI.createSchedule(payload)
                .then((res) => {
                    notify(
                        'success',
                        getTranslateText(
                            'teacher.schedules.success_create_slot'
                        )
                    )
                    if (refetchData) return refetchData()
                })
                .then(() => setLoading(false))
                .catch((err) => {
                    setLoading(false)
                    notify('error', err.message)
                })
        },
        [loading, refetchData]
    )

    const editSchedule = useCallback(
        (calendar_id: number) => {
            if (calendar_id) {
                setLoading(true)
                CalendarAPI.editSchedule(calendar_id)
                    .then((res) => {
                        notify(
                            'success',
                            getTranslateText(
                                'teacher.schedules.success_edit_slot'
                            )
                        )
                        if (refetchData) return refetchData()
                    })
                    .then(() => setLoading(false))
                    .catch((err) => {
                        setLoading(false)
                        notify('error', err.message)
                    })
            }
        },
        [loading, refetchData]
    )

    const toggleModal = useCallback(
        (val: boolean) => {
            setVisibleModal(val)
        },
        [visibleModal]
    )

    const handleClickSquare = (
        start_time: number,
        end_time: number,
        calendar: ICalendar,
        type: any
    ) => {
        console.log(isOpenEdit, loading, type)
        setClickedSquare(start_time)
        const now = moment().valueOf()
        if (isOpenEdit && start_time < now) {
            return message.error(
                getTranslateText('teacher.schedules.error_create_slot_past')
            )
        }
        if (isOpenEdit && !loading && type !== SQUARE_TYPE.REGULAR) {
            if (calendar) {
                ConfirmModal({
                    content: getTranslateText(
                        'teacher.schedules.warning_edit_slot'
                    ),
                    onOk: () => {
                        editSchedule(calendar.id)
                    }
                })
            } else {
                ConfirmModal({
                    content: getTranslateText(
                        'teacher.schedules.warning_create_slot'
                    ),
                    onOk: () => {
                        createSchedule({ start_time, end_time })
                    }
                })
            }
        }
        if (isOpenEdit && !loading && type === SQUARE_TYPE.REGULAR) {
            setSelectedItem({
                teacher_note: '',
                start_time,
                end_time
            })
            toggleModal(true)
        }
    }

    const renderContentPopover = (
        student_name: string,
        course_name: string,
        unit_name: string,
        class_start_time: string,
        type: any,
        status: any
    ) => (
        <div>
            <p>
                {getTranslateText('student.booking.student')}:{' '}
                <strong>{student_name}</strong>
            </p>
            <p>
                {getTranslateText('student.booking.course')}:{' '}
                <strong>{course_name}</strong>
            </p>
            {unit_name && (
                <p>
                    {getTranslateText('student.booking.unit')}:{' '}
                    <strong>{unit_name}</strong>
                </p>
            )}
            <p>
                {getTranslateText('student.booking.time')}:{' '}
                <strong>{class_start_time}</strong>
            </p>
            <p>
                {getTranslateText('common.type')}:{' '}
                <strong>{ENUM_SQUARE_TYPE[type]}</strong>
            </p>
            {status ? (
                <p>
                    {getTranslateText('common.status')}:{' '}
                    <strong>{BOOKING_STATUS_TITLE[status]}</strong>
                </p>
            ) : (
                ''
            )}
        </div>
    )

    const handleClickSquareBookedOrRegular = (
        matchRegularCalendar,
        booking,
        start_time,
        end_time
    ) => {
        // case request absent khi đã có booking và là lịch linh hoạt đã mathch với học viên
        if (
            isOpenEdit &&
            booking &&
            (booking.status === BOOKING_STATUS.CONFIRMED ||
                booking.status === BOOKING_STATUS.PENDING)
        ) {
            setSelectedItem({
                teacher_note: '',
                start_time,
                end_time
            })
            toggleModal(true)
            return
        }
        if (booking && booking.status === BOOKING_STATUS.TEACHER_ABSENT) {
            return
        }

        // case request absent khi là lịch cố định và đã đc match với học viên
        if (isOpenEdit && matchRegularCalendar) {
            setSelectedItem({
                teacher_note: '',
                start_time,
                end_time
            })
            toggleModal(true)
        }
    }

    const renderLatest = (i: number, ii: number, iii: number) =>
        Array(NUMBERS_CELL_IN_COLUMN / 16)
            .fill(0)
            .map((item, index) => {
                const indexOrigin =
                    i * 2 + ii * 4 + iii * 2 + index + (i === 1 ? 14 : 0)
                // Mỗi cell là khoảng thời gian cách nhau 30 phút, tính từ 7h sáng
                const entry: number = (indexOrigin + 14) * 30
                const hours = _.floor(entry / 60)
                const minutes = entry - hours * 60
                const start_time = moment(startTime)
                    .clone()
                    .set('hour', hours)
                    .set('minute', minutes)
                    .set('second', 0)
                    .set('millisecond', 0)
                    .valueOf()
                const end_time = moment(start_time)
                    .clone()
                    .set('minute', minutes + 30)
                    .valueOf()
                let type = 1
                // kiểm tra schedule có nằm trong danh sach absent cua giao vien hay không
                if (absentRequests && absentRequests.length) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const iterator of absentRequests) {
                        if (
                            start_time >= iterator.start_time &&
                            end_time <= iterator.end_time
                        ) {
                            type = SQUARE_TYPE.CLOSE_REGULAR
                            return (
                                <Popover
                                    content={
                                        <p>
                                            {getTranslateText(
                                                'leave_request.schedule_close'
                                            )}
                                        </p>
                                    }
                                    placement='topLeft'
                                    key={_.uniqueId(start_time.toString())}
                                >
                                    <Col span={12} className='p-0'>
                                        <SquareItem
                                            type={type}
                                            loading={
                                                loading &&
                                                start_time === clickedSquare
                                            }
                                            editing={isOpenEdit}
                                        />
                                    </Col>
                                </Popover>
                            )
                        }
                    }
                }

                // Kiem tra slot time voi lich linh hoat
                if (
                    _.find(
                        available_schedule,
                        (o) => o.start_time === start_time
                    )
                ) {
                    type = SQUARE_TYPE.FLEXIBLE
                }
                // Kiem tra slot time voi lich co dinh da mo cua giao vien
                if (
                    _.find(available_regular_schedule, (o) => o === start_time)
                ) {
                    type = SQUARE_TYPE.REGULAR
                }
                // Kiem tra slot time voi lich co dinh da duoc match voi hoc vien cua giao vien
                const matchRegularCalendar = _.find(
                    registered_regular_schedule,
                    (o) =>
                        getTimestampInWeekToLocal(o.regular_start_time) ===
                        convertToModuloTimestamp(
                            moment(start_time).get('days'),
                            hours,
                            minutes
                        )
                )

                if (matchRegularCalendar) {
                    type = SQUARE_TYPE.REGISTERED_REGULAR
                }

                const bookings = booked_schedule.filter(
                    (o) => o?.calendar.start_time === start_time
                )
                const booking: any = bookings.length
                    ? bookings[bookings.length - 1]
                    : null

                if (booking && booking.teacher.is_active === false) {
                    type = SQUARE_TYPE.REGULAR
                }

                // Kiem tra slot time voi booing da duoc dat
                if (booking && booking.teacher.is_active === true) {
                    // nếu lịch là bị đổi ngày hoặc học viên cancel thì mở lịch
                    if (
                        booking.status === BOOKING_STATUS.CHANGE_TIME ||
                        booking.status === BOOKING_STATUS.CANCEL_BY_STUDENT
                    ) {
                        type = SQUARE_TYPE.FLEXIBLE
                    } else if (
                        // nếu lịch là lịch cố định thì chuyển thành cố định đã book
                        _.find(
                            registered_regular_schedule,
                            (o) =>
                                getTimestampInWeekToLocal(
                                    o.regular_start_time
                                ) ===
                                convertToModuloTimestamp(
                                    moment(start_time).get('days'),
                                    hours,
                                    minutes
                                )
                        )
                    ) {
                        type = SQUARE_TYPE.REGULAR_BOOKED
                    } else {
                        // nếu lịch là lịch linh hoạt thì chuyển thành linh hoạt đã book
                        type = SQUARE_TYPE.FLEXIBLE_BOOKED
                    }
                }

                let calendar =
                    type === SQUARE_TYPE.FLEXIBLE &&
                    available_schedule &&
                    _.find(
                        available_schedule,
                        (o: any) => o.start_time === start_time
                    )

                if (
                    (booking &&
                        booking.status !== BOOKING_STATUS.CANCEL_BY_STUDENT &&
                        booking.status !== BOOKING_STATUS.CHANGE_TIME) ||
                    matchRegularCalendar
                ) {
                    return (
                        <Popover
                            content={
                                booking
                                    ? renderContentPopover(
                                          booking.student?.full_name,
                                          booking.course?.name,
                                          booking.unit?.name,
                                          moment(
                                              booking.calendar.start_time
                                          ).format('HH:mm DD/MM/YYYY'),
                                          type,
                                          booking.status
                                      )
                                    : renderContentPopover(
                                          matchRegularCalendar.student
                                              ?.full_name,
                                          matchRegularCalendar.course?.name,
                                          null,
                                          formatTimestamp(
                                              getTimestampInWeekToLocal(
                                                  matchRegularCalendar.regular_start_time
                                              )
                                          ),
                                          type,
                                          null
                                      )
                            }
                            placement='topLeft'
                            key={_.uniqueId(start_time.toString())}
                        >
                            <Col
                                span={12}
                                className='p-0'
                                onClick={() =>
                                    handleClickSquareBookedOrRegular(
                                        matchRegularCalendar,
                                        booking,
                                        start_time,
                                        end_time
                                    )
                                }
                            >
                                <SquareItem
                                    type={type}
                                    loading={
                                        loading && start_time === clickedSquare
                                    }
                                    editing={isOpenEdit}
                                />
                            </Col>
                        </Popover>
                    )
                }
                if (
                    booking &&
                    (booking.status === BOOKING_STATUS.CANCEL_BY_STUDENT ||
                        booking.status === BOOKING_STATUS.CHANGE_TIME)
                ) {
                    calendar = booking.calendar
                    if (!calendar.is_active) {
                        type = 1
                    }
                }
                return (
                    <Col
                        span={12}
                        className='p-0'
                        key={_.uniqueId(start_time.toString())}
                        onClick={() =>
                            handleClickSquare(
                                start_time,
                                end_time,
                                calendar,
                                type
                            )
                        }
                    >
                        <SquareItem
                            type={type}
                            loading={loading && start_time === clickedSquare}
                            editing={isOpenEdit}
                        />
                    </Col>
                )
            })

    const renderSquareDouble = (i: number, ii: number) =>
        Array(NUMBERS_CELL_IN_COLUMN / 16)
            .fill(0)
            .map((item, index) => {
                const indexOrigin =
                    i * 2 + ii * 2 + index + 7 + (i === 1 ? 6 : 0)
                return (
                    <Col span={12} className='p-2' key={index}>
                        <div className={cn(styles.time)}>
                            {indexOrigin < 10 ? `0${indexOrigin}` : indexOrigin}
                            :00
                        </div>
                        <Row className='m-0'>{renderLatest(i, ii, index)}</Row>
                    </Col>
                )
            })

    const renderSquareQuart = (i: number) =>
        Array(NUMBERS_CELL_IN_COLUMN / 8)
            .fill(0)
            .map((item, index) => (
                <Col md={6} xs={12} className='px-2' key={index}>
                    <Row className='m-0'>{renderSquareDouble(i, index)}</Row>
                </Col>
            ))

    const renderSquare = () =>
        Array(NUMBERS_CELL_IN_COLUMN / 16)
            .fill(0)
            .map((item, index) => (
                <Row key={index} className='m-0'>
                    {renderSquareQuart(index)}
                </Row>
            ))

    const startDay = moment(startTime).valueOf()
    const endDay = moment(startTime).endOf('day').valueOf()
    const totalBookedSchedule = booked_schedule.filter(
        (o) =>
            o.calendar.start_time >= startDay && o.calendar.end_time <= endDay
    ).length
    const totalRegisteredRegular = registered_regular_schedule.filter(
        (o) =>
            getTimestampInWeekToLocal(o.regular_start_time) >=
                convertToModuloTimestamp(
                    moment(startDay).get('days'),
                    moment(startDay).get('hours'),
                    moment(startDay).get('minutes')
                ) &&
            getTimestampInWeekToLocal(o.regular_start_time) <=
                convertToModuloTimestamp(
                    moment(endDay).get('days'),
                    moment(endDay).get('hours'),
                    moment(endDay).get('minutes')
                )
    ).length
    const totalDuplicateBookedAndRegular = booked_schedule
        .map((x) => x.calendar.start_time)
        .filter(
            (x) =>
                x >= startDay &&
                x <= endDay &&
                _.find(
                    registered_regular_schedule,
                    (el) =>
                        getTimestampInWeekToLocal(el.regular_start_time) ===
                        convertToModuloTimestamp(
                            moment(x).get('days'),
                            moment(x).get('hours'),
                            moment(x).get('minutes')
                        )
                )
        ).length
    const totalAvailableFlexible = available_schedule.filter(
        (o) => o.start_time >= startDay && o.end_time <= endDay
    ).length
    const totalAvailableRegular =
        available_regular_schedule.filter((o) => o >= startDay && o <= endDay)
            .length -
        booked_schedule.filter(
            (o) =>
                o.calendar.start_time >= startDay &&
                o.calendar.end_time <= endDay &&
                available_regular_schedule.includes(o.calendar.start_time)
        ).length
    return (
        <>
            <div
                className={cn(styles.wrapItem, disabled && cn(styles.disabled))}
            >
                <div
                    className={cn(styles.left, disabled && cn(styles.disabled))}
                >
                    <div className={cn(styles.dateTime)}>
                        <span>{moment(startTime).format('DD')}</span>
                        <span>{moment(startTime).format('MM')}</span>
                    </div>
                    <div className={cn(styles.dateTimeMobile)}>
                        {moment(startTime).format('DD/MM')}
                    </div>
                    <div className={cn(styles.day)}>
                        {moment(startTime).format('ddd').toUpperCase()}
                    </div>
                </div>
                <div className={cn(styles.mid)}>
                    <div className='w-100'>{renderSquare()}</div>
                </div>
                <div className={cn(styles.right)}>
                    <div className={cn(styles.numBlocked)}>
                        {_.sum([
                            totalBookedSchedule,
                            totalRegisteredRegular,
                            -1 * totalDuplicateBookedAndRegular
                        ])}
                        /
                        {_.sum([
                            totalAvailableFlexible,
                            totalAvailableRegular,
                            totalBookedSchedule,
                            totalRegisteredRegular,
                            -1 * totalDuplicateBookedAndRegular
                        ])}
                    </div>
                    <div>{getTranslateText('teacher.schedules.booked')}</div>
                </div>
            </div>

            <AbsentRequestModal
                visible={visibleModal}
                toggleModal={toggleModal}
                data={selectedItem}
                method={EnumModalType.ADD_NEW_ON_SCHEDULE}
                refetchData={refetchData}
            />
        </>
    )
}

export default memo(ScheduleItem)
