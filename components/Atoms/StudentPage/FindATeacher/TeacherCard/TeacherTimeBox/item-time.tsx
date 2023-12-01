/* eslint-disable react/button-has-type */

import { SQUARE_TYPE } from 'const/calendar'
import { BOOKING_STATUS } from 'const/status'
import {
    getTimestampInWeek,
    getTimestampListInPeriod
} from 'utils/datetime-utils'
import moment from 'moment'

export default ({ ...props }) => {
    let color = ''
    let type = 0
    const renderColor = () => {
        if (
            [SQUARE_TYPE.REGISTERED_REGULAR, SQUARE_TYPE.REGULAR].includes(type)
        )
            return (color = '#009144')
        if ([SQUARE_TYPE.FLEXIBLE].includes(type)) return (color = '#9de1bd')
        if ([SQUARE_TYPE.CLOSE_REGULAR].includes(type))
            return (color = '#707070')
        if ([SQUARE_TYPE.REGULAR_BOOKED].includes(type))
            return (color = '#F63238')
        if ([SQUARE_TYPE.FLEXIBLE_BOOKED].includes(type))
            return (color = '#ff9999')
    }

    const checkType = () => {
        if (!props.schedules) {
            return
        }
        const start_time = props.start_time.valueOf()
        const end_time = props.end_time.valueOf()

        const {
            available_regular_schedule,
            available_schedule,
            booked_schedule,
            on_absent_period
        } = props.schedules
        const { registered_regular_schedule } = props.schedules

        // close toàn bộ time nằm trong khoảng thời gian giáo viên xin nghỉ mà đã được staff chấp nhận
        if (on_absent_period && on_absent_period.length) {
            // eslint-disable-next-line no-restricted-syntax
            for (const iterator of on_absent_period) {
                if (
                    start_time >= iterator.start_time &&
                    start_time < iterator.end_time
                ) {
                    type = SQUARE_TYPE.CLOSE_REGULAR
                    renderColor()
                    return
                }
            }
        }
        //  lịch linh hoạt available
        if (available_schedule && available_schedule.length) {
            const item = available_schedule.find(
                (x) => x.start_time === start_time
            )
            if (item) {
                type = SQUARE_TYPE.FLEXIBLE
            }
        }
        // lịch cố định đã đc match
        if (registered_regular_schedule && registered_regular_schedule.length) {
            const time1970 = getTimestampInWeek(start_time)
            const item = registered_regular_schedule.find(
                (e) => e.regular_start_time === time1970
            )
            if (item) {
                type = SQUARE_TYPE.REGULAR_BOOKED
            }
        }

        //  lịch cố định available
        if (available_regular_schedule && available_regular_schedule.length) {
            const item = available_regular_schedule.find(
                (x) => x === start_time
            )
            if (item) {
                console.log('available_regular_schedule')
                type = SQUARE_TYPE.REGULAR
            }
        }

        // lịch đã book
        if (booked_schedule && booked_schedule.length) {
            const item = booked_schedule.find(
                (x) => x.calendar.start_time === start_time
            )
            if (item) {
                type = SQUARE_TYPE.REGULAR_BOOKED
            }
        }

        // mở các lịch đã có booking nhưng bị học viên cancel hoặc staff đổi lịch
        if (booked_schedule && booked_schedule.length) {
            const items = booked_schedule.filter(
                (x) => x.calendar.start_time === start_time
            )
            if (items && items.length) {
                // sort lại để lấy booking mới nhất
                items.sort(function (a, b) {
                    return (
                        new Date(b.bookingCreated_time).getTime() -
                        new Date(a.bookingCreated_time).getTime()
                    )
                })
                if (
                    [
                        BOOKING_STATUS.CHANGE_TIME,
                        BOOKING_STATUS.CANCEL_BY_STUDENT
                    ].includes(items[0].bookingStatus)
                ) {
                    type = SQUARE_TYPE.FLEXIBLE
                }
            }
        }
        renderColor()
    }
    checkType()
    return (
        <div className='d-flex flex-column text-center'>
            <p>{props.start_time.format('HH:mm')}</p>
            <div
                className='item-time'
                style={{
                    backgroundColor: color
                }}
            >
                {type === SQUARE_TYPE.REGISTERED_REGULAR ? 'F' : ''}
            </div>
        </div>
    )
}
