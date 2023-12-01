import React, { FC } from 'react'
import cn from 'classnames'
import { ROLES_ENUM } from 'const/role'
import moment from 'moment'
import _ from 'lodash'
import { useAuth } from 'contexts/Auth'
import styles from './TimeCell.module.scss'
import { BOOKING_STATUS } from 'const/status'
import { getTimestampListInPeriod } from 'utils/datetime-utils'

type Props = {
    schedule: any
    selectedCalendarId: number | string
    selectedRegularTime: number | string
    start_time: number
    end_time: number
    time: any
    onChooseScheduleTime: (key: string) => (time: number, val: any) => void
}
const TimeCell: FC<Props> = ({
    schedule,
    selectedCalendarId,
    selectedRegularTime,
    start_time,
    end_time,
    time,
    onChooseScheduleTime
}) => {
    const { user } = useAuth()
    const role = user?.role
    const now = moment().valueOf()
    const validTime = moment().add(2, 'hour').valueOf()
    let checkSlotTime = ''
    let activeData = null

    const renderColor = () => {
        if (role && role.includes(ROLES_ENUM.STUDENT) && !_.isEmpty(schedule)) {
            const {
                available_schedule,
                booked_schedule,
                available_regular_schedule,
                on_absent_period
            } = schedule
            let { registered_regular_schedule } = schedule

            // close toàn bộ time nằm trong khoảng thời gian giáo viên xin nghỉ mà đã được staff chấp nhận
            if (on_absent_period && on_absent_period.length) {
                for (const iterator of on_absent_period) {
                    if (
                        start_time >= iterator.start_time &&
                        start_time < iterator.end_time
                    ) {
                        return (checkSlotTime = 'calendar-cell-expired')
                    }
                }
            }
            // close toàn bộ time không đủ điều kiện
            if (start_time < validTime) {
                return (checkSlotTime = 'calendar-cell-expired')
            }
            // mở lịch linh hoạt available
            if (available_schedule && available_schedule.length) {
                const item = available_schedule.find(
                    (x) => x.start_time === start_time
                )
                if (item) {
                    checkSlotTime = 'calendar-cell-actived'
                    activeData = {
                        type: 'avaiable',
                        data: item
                    }
                }
            }
            // close toàn bộ time giáo viên đã có lịch cố định đã match
            if (
                registered_regular_schedule &&
                registered_regular_schedule.length
            ) {
                const registered_regular_times =
                    registered_regular_schedule.map((x) => x.regular_start_time)
                registered_regular_schedule = getTimestampListInPeriod(
                    registered_regular_times,
                    start_time,
                    end_time
                )
                const item = registered_regular_schedule.find(
                    (e) => e === start_time
                )
                if (item) {
                    checkSlotTime = 'calendar-cell-expired'
                }
            }

            // mở những lịch cố định mà chưa ghép với học viên nào
            if (
                available_regular_schedule &&
                available_regular_schedule.length
            ) {
                const item = available_regular_schedule.find(
                    (x) => x === start_time
                )
                if (item) {
                    checkSlotTime = 'calendar-cell-actived'
                    activeData = {
                        type: 'regular',
                        data: item
                    }
                }
            }
            // đóng các lịch đã có booking
            if (booked_schedule && booked_schedule.length) {
                const item = booked_schedule.find((x) => {
                    return x.calendar.start_time === start_time
                })
                if (item) {
                    checkSlotTime = 'calendar-cell-expired'
                }
            }
            // mở các lịch đã có booking nhưng bị học viên cancel hoặc staff đổi lịch
            if (booked_schedule && booked_schedule.length) {
                const items = booked_schedule.filter((x) => {
                    return x.calendar.start_time === start_time
                })
                if (items && items.length) {
                    // sort lại để lấy booking mới nhất
                    items.sort(function (a, b) {
                        return (
                            new Date(b.created_time).getTime() -
                            new Date(a.created_time).getTime()
                        )
                    })
                    if (
                        [
                            BOOKING_STATUS.CHANGE_TIME,
                            BOOKING_STATUS.CANCEL_BY_STUDENT
                        ].includes(items[0].status) &&
                        items[0].teacher.is_active === true
                    ) {
                        checkSlotTime = 'calendar-cell-actived'
                        activeData = {
                            type: 'booked',
                            data: items[0].calendar
                        }
                    }
                }
            }

            // đổi màu khi lịch mở được select
            if (time === start_time) {
                checkSlotTime = 'calendar-cell-selected'
            }
        }
    }
    renderColor()

    const _handleCLick = () => {
        if (role.includes(ROLES_ENUM.STUDENT) && onChooseScheduleTime) {
            // không cho select click vào các ô không đc active
            if (checkSlotTime !== 'calendar-cell-actived') {
                return
            }
            const { available_schedule, available_regular_schedule } = schedule
            if (activeData && activeData.type == 'regular') {
                onChooseScheduleTime('start_time')(start_time, activeData.data)
            }
            if (activeData && activeData.type == 'avaiable') {
                onChooseScheduleTime('calendar_id')(start_time, activeData.data)
            }
            if (activeData && activeData.type == 'booked') {
                onChooseScheduleTime('calendar_id')(start_time, activeData.data)
            }
        }
    }
    return (
        <td onClick={_handleCLick}>
            <div
                className={cn(
                    styles['calendar-cell'],
                    !checkSlotTime &&
                        user?.role?.includes(ROLES_ENUM.STUDENT) &&
                        styles.invalid,
                    styles[checkSlotTime]
                )}
            />
        </td>
    )
}

export default TimeCell
