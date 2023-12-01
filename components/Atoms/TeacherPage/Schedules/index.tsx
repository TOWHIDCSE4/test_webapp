import React, { useState, useReducer, useEffect, useCallback } from 'react'
import cn from 'classnames'
import {
    LeftCircleOutlined,
    RightCircleOutlined,
    LeftOutlined
} from '@ant-design/icons'
import { DatePicker, Image, notification, Empty, Spin, Button } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import CalendarAPI from 'api/CalendarAPI'
import { getTranslateText } from 'utils/translate-utils'
import { ISchedule } from 'types'
import {
    convertToModuloTimestamp,
    getTimestampInWeekToLocal
} from 'utils/datetime-utils'
import { useAuth } from 'contexts/Auth'
import { Logger } from 'utils/logger'
import TeacherAPI from 'api/TeacherAPI'
import Panel from './Panel'
import ScheduleItem from './ScheduleItem'
import styles from './Schedules.module.scss'
import DetailScheduleItem from './Details/DetailScheduleItem'

const Schedules = () => {
    const { teacherInfo } = useAuth()

    const [values, setValues] = useReducer(
        (state: any, newState: any) => ({ ...state, ...newState }),
        {
            start_week: moment().startOf('isoWeek').valueOf(),
            end_week: moment().endOf('isoWeek').valueOf()
        }
    )

    const [loading, setLoading] = useState<boolean>(false)
    const [indexCollapse, setIndexCollapse] = useState(moment().day())
    const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false)
    const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
    const [openDetailByDay, setOpenDetailByDay] = useState<number>(null)
    const [absentRequests, setAbsentRequests] = useState(null)
    const [schedules, setSchedules] = useState<ISchedule>({
        available_schedule: [],
        booked_schedule: [],
        available_regular_schedule: [],
        registered_regular_schedule: []
    })

    const getTeacherAbsentRequests = () => {
        setLoading(true)

        TeacherAPI.getAllAbsentRequests({
            page_size: 9999,
            page_number: 1,
            status: 2
        })
            .then((res) => {
                const data = res.data.filter(
                    (e) => e.end_time > moment().startOf('week').valueOf()
                )
                setAbsentRequests(data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const getAllSchedules = (query: {
        start_time: number
        end_time: number
    }) => {
        setLoading(true)
        return CalendarAPI.getCalendarsActive(query)
            .then((res) => {
                setSchedules(res)
            })
            .catch((err) => {
                Logger.error(err)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getAllSchedules({
            start_time: values.start_week,
            end_time: values.end_week
        })
        getTeacherAbsentRequests()
    }, [])

    const onChangeValueCalendar = (date: any) => {
        const start_week = date.clone().valueOf()
        const end_week = date.clone().add(6, 'days').endOf('day').valueOf()
        setValues({ start_week, end_week })
        getAllSchedules({ start_time: start_week, end_time: end_week })
    }

    const openDetail = useCallback(
        (variable: number) => {
            setIsOpenDetail(true)
            setIsOpenEdit(false)
            setOpenDetailByDay(variable)
        },
        [openDetailByDay, isOpenEdit, isOpenDetail]
    )

    const closeDetail = useCallback(() => {
        setIsOpenDetail(false)
        setIsOpenEdit(false)
        setOpenDetailByDay(null)
    }, [openDetailByDay, isOpenEdit, isOpenDetail])

    const toggleEditSlot = () => {
        setIsOpenEdit(!isOpenEdit)
    }

    const onPrevWeek = () => {
        const start_week = moment(values.start_week)
            .clone()
            .subtract(7, 'days')
            .valueOf()
        if (moment(start_week) <= moment().subtract(3, 'months')) {
            notification.error({
                message: 'Error',
                description: getTranslateText('error.query_time_invalid')
            })
        } else {
            const end_week = moment(values.end_week)
                .clone()
                .subtract(7, 'days')
                .endOf('day')
                .valueOf()
            setValues({ start_week, end_week })
            getAllSchedules({ start_time: start_week, end_time: end_week })
        }
    }

    const onNextWeek = () => {
        const start_week = moment(values.start_week)
            .clone()
            .add(7, 'days')
            .valueOf()
        if (moment(start_week) >= moment().add(3, 'months')) {
            notification.error({
                message: 'Error',
                description: getTranslateText('error.query_time_invalid')
            })
        } else {
            const end_week = moment(values.end_week)
                .clone()
                .add(7, 'days')
                .endOf('day')
                .valueOf()
            setValues({ start_week, end_week })
            getAllSchedules({ start_time: start_week, end_time: end_week })
        }
    }

    const disabledDate = (current: any): boolean =>
        current &&
        (current <= moment().subtract(3, 'months') ||
            current >= moment().add(3, 'months'))

    const onReload = () =>
        getAllSchedules({
            start_time: values.start_week,
            end_time: values.end_week
        })

    const renderEditScheduleItem = () =>
        _.fill(Array(7), 0).map((item, index) => {
            const entryTime = moment(values.start_week).add(index, 'days')
            return (
                <div
                    key={entryTime.valueOf()}
                    className={cn(
                        styles.collapseSchedules_Item,
                        styles.collapseSchedules_Item_Show
                    )}
                >
                    <div
                        className={cn(
                            styles.collapseSchedules_Nav,
                            cn(styles.hide)
                        )}
                    >
                        <div className={cn(styles.dateTime)}>
                            {entryTime.format('ddd').toUpperCase()}
                        </div>
                        <div className={cn(styles.blocked)}>
                            {0} {getTranslateText('teacher.schedules.booked')}
                        </div>
                    </div>
                    <div className={cn(styles.collapseSchedules_Panel)}>
                        <Panel isOpen>
                            <ScheduleItem
                                startTime={entryTime.valueOf()}
                                disabled={entryTime < moment().startOf('day')}
                                schedules={schedules}
                                isOpenEdit={isOpenEdit}
                                refetchData={onReload}
                                absentRequests={absentRequests}
                            />
                        </Panel>
                    </div>
                </div>
            )
        })

    const renderViewScheduleItem = () =>
        _.fill(Array(7), 0).map((item, day) => {
            const entryTime = moment(values.start_week).clone().add(day, 'd')

            const startDay = entryTime.valueOf()

            const endDay = entryTime.clone().endOf('day').valueOf()

            const totalBookedSchedule = schedules.booked_schedule.filter(
                (o) =>
                    o.calendar.start_time >= startDay &&
                    o.calendar.end_time <= endDay
            ).length

            const totalRegisteredRegular =
                schedules.registered_regular_schedule.filter(
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

            const totalDuplicateBookedAndRegular = schedules.booked_schedule
                .map((x) => x.calendar.start_time)
                .filter(
                    (x) =>
                        x >= startDay &&
                        x <= endDay &&
                        _.find(
                            schedules.registered_regular_schedule,
                            (el) =>
                                getTimestampInWeekToLocal(
                                    el.regular_start_time
                                ) ===
                                convertToModuloTimestamp(
                                    moment(x).get('days'),
                                    moment(x).get('hours'),
                                    moment(x).get('minutes')
                                )
                        )
                ).length

            let isOpen = false
            if (indexCollapse - 1 === day) {
                isOpen = true
            }

            return (
                <div
                    key={entryTime.valueOf()}
                    onClick={() => {
                        setIndexCollapse(day + 1)
                    }}
                    className={`${cn(styles.collapseSchedules_Item)} ${
                        isOpen && cn(styles.collapseSchedules_Item_Show)
                    }`}
                >
                    <div
                        className={`${cn(
                            styles.collapseSchedules_Nav,
                            isOpen && cn(styles.hide)
                        )} `}
                    >
                        <div className={`${cn(styles.dateTime)} `}>
                            {entryTime.format('ddd').toUpperCase()}
                        </div>
                        <div className={cn(styles.blocked)}>
                            {_.sum([
                                totalBookedSchedule,
                                totalRegisteredRegular,
                                -1 * totalDuplicateBookedAndRegular
                            ])}{' '}
                            {getTranslateText('teacher.schedules.booked')}
                        </div>
                    </div>
                    <div className={cn(styles.collapseSchedules_Panel)}>
                        <Panel isOpen={isOpen}>
                            <ScheduleItem
                                startTime={entryTime.valueOf()}
                                disabled={entryTime < moment().startOf('day')}
                                schedules={schedules}
                                absentRequests={absentRequests}
                            />
                        </Panel>
                    </div>
                </div>
            )
        })

    const renderDetail = () => {
        if (openDetailByDay) {
            const startDay = moment(openDetailByDay).valueOf()
            const endDay = moment(openDetailByDay).endOf('day').valueOf()
            const bookedScheduleByDay = schedules.booked_schedule.filter(
                (o: any) => o.start_time >= startDay && o.end_time <= endDay
            )
            if (!_.isEmpty(bookedScheduleByDay))
                return bookedScheduleByDay.map((item: any, index: number) => (
                    <DetailScheduleItem
                        type={1}
                        key={item._id}
                        booking={item}
                    />
                ))
            return <Empty />
        }
    }

    const startDay: number =
        openDetailByDay && moment(openDetailByDay).valueOf()
    const endDay: number =
        openDetailByDay && moment(openDetailByDay).endOf('day').valueOf()
    const totalBookedSchedule = openDetailByDay
        ? schedules.booked_schedule.filter(
              (o) =>
                  o.calendar.start_time >= startDay &&
                  o.calendar.end_time <= endDay
          ).length
        : 0
    const totalRegisteredRegular = openDetailByDay
        ? schedules.registered_regular_schedule.filter(
              (o: any) => o >= startDay && o <= endDay
          ).length
        : 0
    const totalAvailableFlexible = openDetailByDay
        ? schedules.available_schedule.filter(
              (o: any) => o.start_time >= startDay && o.end_time <= endDay
          ).length
        : 0
    const totalAvailableRegular = openDetailByDay
        ? schedules.available_regular_schedule.filter(
              (o: any) => o >= startDay && o <= endDay
          ).length -
          schedules.booked_schedule.filter(
              (o: any) =>
                  o.start_time >= startDay &&
                  o.end_time <= endDay &&
                  schedules.available_regular_schedule.includes(o.start_time)
          ).length
        : 0

    return (
        <div className={cn('mb-4', styles.wrapSchedules)}>
            <div className={cn(styles.wrapCollapseSchedules)}>
                <div
                    className={cn(
                        styles.collapseSchedules,
                        isOpenDetail && styles.hide
                    )}
                >
                    <div className={cn(styles.headerScheduleCollapse)}>
                        <div className={cn(styles.headerScheduleCollapse_left)}>
                            <div className={cn(styles.btnShowCalendar)}>
                                <Image
                                    width={24}
                                    height={24}
                                    src='/static/img/teacher/schedules/schedule.svg'
                                    preview={false}
                                />
                                <div className={cn(styles.calendar)}>
                                    <DatePicker
                                        defaultValue={moment(values.start_week)}
                                        value={moment(values.start_week)}
                                        disabledDate={disabledDate}
                                        onChange={onChangeValueCalendar}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={cn(styles.headerScheduleCollapse_mid)}>
                            <LeftCircleOutlined onClick={onPrevWeek} />
                            <span className={cn(styles.dateTime)}>
                                {moment(values.start_week).format('DD/MM/YYYY')}{' '}
                                - {moment(values.end_week).format('DD/MM/YYYY')}
                            </span>
                            <RightCircleOutlined onClick={onNextWeek} />
                        </div>
                        <Button
                            onClick={toggleEditSlot}
                            type='primary'
                            color='primary'
                        >
                            {!isOpenEdit
                                ? getTranslateText('common.edit')
                                : getTranslateText('done')}
                        </Button>
                    </div>
                    <Spin spinning={loading}>
                        <div className={cn(styles.content)}>
                            {isOpenEdit
                                ? renderEditScheduleItem()
                                : renderViewScheduleItem()}
                        </div>
                    </Spin>
                </div>
            </div>
            <div
                className={`${cn(styles.your_schedules)} ${
                    isOpenDetail && cn(styles.show)
                }`}
            >
                <div className={cn(styles.header_title)}>
                    <div onClick={closeDetail} className={cn(styles.title)}>
                        <LeftOutlined />
                        {getTranslateText('teacher.schedules.your_schedule')}
                    </div>
                    <div className={cn(styles.dateTime)}>
                        {moment(openDetailByDay).format('DD/MM/YYYY')}
                    </div>
                    <div>
                        {_.sum([totalBookedSchedule, totalRegisteredRegular])}/
                        {_.sum([
                            totalAvailableFlexible,
                            totalAvailableRegular,
                            totalBookedSchedule,
                            totalRegisteredRegular
                        ])}{' '}
                        {getTranslateText('teacher.schedules.booked')}
                    </div>
                </div>

                <div className={cn(styles.content)}>
                    <div className={cn(styles.contentItem)}>
                        {renderDetail()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Schedules
