import { FC, useState, useEffect } from 'react'
import moment from 'moment'
import CalendarAPI from 'api/CalendarAPI'
import { notify } from 'contexts/Notification'
import { getCurrentWeek, parseTime } from 'utils/datetime-utils'
import { DATE_FORMAT, TIME_RANGE } from 'const'
import TimeCell from 'components/Atoms/StudentPage/Booking/ChooseTime/TimeCell'
import _ from 'lodash'
import cn from 'classnames'
import { DatePicker, Spin } from 'antd'
import styles from './ChooseTime.module.scss'

type Props = {
    teacher_id: number
    selectedCalendarId: number | string
    selectedRegularTime: number | string
    time: any
    onChooseScheduleTime: (key: string) => (time: number, val: any) => void
}

const ChooseTime: FC<Props> = ({
    teacher_id,
    onChooseScheduleTime,
    selectedCalendarId,
    selectedRegularTime,
    time
}) => {
    const [startTime, setStartTime] = useState(
        moment().startOf('day').valueOf()
    )
    const [endTime, setEndTime] = useState(
        moment().startOf('day').add(7, 'days').valueOf()
    )
    const [loading, setLoading] = useState(false)
    const [schedule, setSchedule] = useState({})

    const getSchedulesByTeacher = (query: {
        teacher_id: number
        start_time: number
        end_time: number
    }) => {
        setLoading(true)
        CalendarAPI.getCalendarByStudent(query.teacher_id, {
            start_time: query.start_time,
            end_time: query.end_time
        })
            .then((res) => {
                setSchedule(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getSchedulesByTeacher({
            teacher_id,
            start_time: startTime,
            end_time: endTime
        })
    }, [teacher_id])

    const onChangeTime = (date) => {
        if (date) {
            const nextStartTime = date.valueOf()
            const nextEndTime = date.clone().add('d', 7).valueOf()
            setStartTime(nextStartTime)
            setEndTime(nextEndTime)
            getSchedulesByTeacher({
                teacher_id,
                start_time: nextStartTime,
                end_time: nextEndTime
            })
        } else {
            const nextStartTime = moment().startOf('day').valueOf()
            const nextEndTime = moment().startOf('day').add(7, 'days').valueOf()
            setStartTime(nextStartTime)
            setEndTime(nextEndTime)
            getSchedulesByTeacher({
                teacher_id,
                start_time: nextStartTime,
                end_time: nextEndTime
            })
        }
    }

    const renderDates = () => {
        const days = getCurrentWeek(startTime)
        return days.map((item, index) => (
            <th key={index}>
                <span>{moment(item).format('ddd, MMM DD')}</span>
            </th>
        ))
    }

    const renderTimeCellInDayOfWeek = (hours: number, minutes: number) => {
        const days = getCurrentWeek(startTime)
        return days.map((day, index) => {
            const start_time = moment(day)
                .clone()
                .set('h', hours)
                .set('m', minutes)
                .valueOf()
            const end_time = moment(day)
                .clone()
                .set('h', hours)
                .set('m', minutes)
                .add({
                    minute: 30
                })
                .valueOf()
            return (
                <TimeCell
                    schedule={schedule}
                    key={index}
                    selectedCalendarId={selectedCalendarId}
                    selectedRegularTime={selectedRegularTime}
                    start_time={start_time}
                    end_time={end_time}
                    time={time}
                    onChooseScheduleTime={onChooseScheduleTime}
                />
            )
        })
    }

    // Render 23 row time between range 7h -> 22h30h
    const renderSchedulesTime = () =>
        TIME_RANGE.map((timeValue, index) => {
            const tmp = (index + 14) * 30
            const hours: any = _.toInteger(String(tmp / 60))
            const minutes = tmp - hours * 60
            return (
                <tr key={index}>
                    <td>
                        <span>{parseTime(tmp)}</span>
                    </td>
                    {renderTimeCellInDayOfWeek(hours, minutes)}
                </tr>
            )
        })

    return (
        <Spin spinning={loading}>
            <div className='mb-4 d-flex justify-content-end'>
                {/* <DatePicker
                    onChange={onChangeTime}
                    format={DATE_FORMAT}
                    value={moment(startTime)}
                    allowClear
                    disabledDate={(current) =>
                        current && current < moment().startOf('day')
                    }
                /> */}
            </div>
            <fieldset className={cn(styles['sheet-time'])}>
                <div className='form-card mb-0'>
                    <div className='fc-view-container'>
                        <div className='fc-view fc-agendaWeek-view fc-agenda-view'>
                            <table
                                className='w-100'
                                style={{ backgroundColor: '#fff' }}
                            >
                                <thead className='fc-head'>
                                    <tr>
                                        <td className='fc-head-container fc-widget-header'>
                                            <div className='fc-row fc-widget-header'>
                                                <table className='x5'>
                                                    <thead>
                                                        <tr>
                                                            <th> </th>
                                                            {renderDates()}
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody className='fc-body'>
                                    <tr>
                                        <td className='fc-widget-content'>
                                            <div className='fc-scroller fc-time-grid-container'>
                                                <div className='fc-time-grid fc-unselectable'>
                                                    <div className='fc-slats'>
                                                        <table className='x5'>
                                                            <tbody>
                                                                {renderSchedulesTime()}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </fieldset>
        </Spin>
    )
}

export default ChooseTime
