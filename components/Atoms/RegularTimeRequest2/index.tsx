/* eslint-disable no-restricted-syntax */
import React, { useReducer, useEffect, FC, useState } from 'react'
import {
    DAY_TO_MS,
    HOUR_TO_MS,
    MINUTE_TO_MS,
    DAYS_OF_WEEK
} from 'const/date-time'
import _ from 'lodash'
import moment from 'moment'
import {
    Button,
    TimePicker,
    Checkbox,
    notification,
    Select,
    Form,
    Row,
    Col,
    Empty
} from 'antd'
import { EditFilled } from '@ant-design/icons'

import { Method } from 'components/Molecules/RegularRequestModal'
import {
    formatTimestamp,
    formatTimestampMoment,
    getHourAndMinuteInMs,
    getStartOfTheWeek,
    getTimestampInWeek,
    getTimestampInWeekToLocal,
    getTimestampInWeekToUTC,
    moduloTimestamp
} from 'utils/datetime-utils'
import { getTranslateText } from 'utils/translate-utils'
import UserAPI from 'api/UserAPI'

const { Option } = Select
type RegularTimeRequestProps = {
    regularTimes: any[]
    onSave: (new_regular_times: any) => void
    method: Method
}

const RegularTimeRequest: FC<RegularTimeRequestProps> = ({
    regularTimes,
    onSave,
    method
}) => {
    const [values, setValues] = useReducer(
        (state: any, newState: any) => ({ ...state, ...newState }),
        {
            formValues: {
                js_Friday_checkbox: false,
                js_Monday_checkbox: false,
                js_Saturday_checkbox: false,
                js_Sunday_checkbox: false,
                js_Thursday_checkbox: false,
                js_Tuesday_checkbox: false,
                js_Wednesday_checkbox: false
            }
        }
    )
    const [form] = Form.useForm()
    const [user, setUser] = useState(null)
    const listDayOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]
    const timeInDay = ['Morning', 'Afternoon', 'Evening']

    const getDisabledHoursMorning = (): number[] => {
        const arr = []
        for (let index = 0; index < 24; index++) {
            if (index < 7 || index > 12) {
                arr.push(index)
            }
        }
        return arr
    }
    const getDisabledHoursAfternoon = (): number[] => {
        const arr = []
        for (let index = 0; index < 24; index++) {
            if (index < 13 || index > 18) {
                arr.push(index)
            }
        }
        return arr
    }
    const getDisabledHoursEvening = (): number[] => {
        const arr = []
        for (let index = 0; index < 24; index++) {
            if (index < 19 || index > 22) {
                arr.push(index)
            }
        }
        return arr
    }

    const renderBoxTime = (day) => {
        const result = []
        for (const [index, iterator] of timeInDay.entries() as any) {
            result.push(
                <div key={index}>
                    <span className='font-weight-bold'>{iterator}</span>
                    <div className='d-flex align-items-center'>
                        <Form.Item
                            name={`${day}_${iterator}_start`}
                            label='Start time'
                            className='my-2 mr-2'
                        >
                            <TimePicker
                                format='HH:mm'
                                minuteStep={30}
                                disabledHours={
                                    iterator === 'Morning'
                                        ? getDisabledHoursMorning
                                        : iterator === 'Afternoon'
                                        ? getDisabledHoursAfternoon
                                        : getDisabledHoursEvening
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            name={`${day}_${iterator}_end`}
                            label='End time'
                            className='my-2  mr-2'
                        >
                            <TimePicker
                                format='HH:mm'
                                minuteStep={30}
                                disabledHours={
                                    iterator === 'Morning'
                                        ? getDisabledHoursMorning
                                        : iterator === 'Afternoon'
                                        ? getDisabledHoursAfternoon
                                        : getDisabledHoursEvening
                                }
                            />
                        </Form.Item>
                    </div>
                </div>
            )
        }
        return result
    }
    const handleCheckbox = (event: any) => {
        const { target } = event
        const key = target['data-js-id']
        setValues({
            formValues: {
                ...values.formValues,
                [key]: !values.formValues[key]
            }
        })
    }
    const renderDayInWeek = () => {
        const result = []
        for (const [index, iterator] of listDayOfWeek.entries() as any) {
            result.push(
                <div className='col-12 mb-2 d-flex' key={index}>
                    <Checkbox
                        checked={values.formValues[`js_${iterator}_checkbox`]}
                        data-js-id={`js_${iterator}_checkbox`}
                        id={`js_${iterator}_checkbox`}
                        onChange={handleCheckbox}
                        style={{ minWidth: 150 }}
                    >
                        <b>{iterator}</b>
                    </Checkbox>
                    <div
                        className={`${
                            values.formValues[`js_${iterator}_checkbox`]
                                ? 'd-block'
                                : 'd-none'
                        } border p-2`}
                        id={`js_${iterator}`}
                    >
                        {renderBoxTime(iterator)}
                    </div>
                </div>
            )
        }
        return result
    }
    const getDayOfWeek = (text) => {
        if (text === 'Sunday') {
            return 0
        }
        if (text === 'Monday') {
            return 1
        }
        if (text === 'Tuesday') {
            return 2
        }
        if (text === 'Wednesday') {
            return 3
        }
        if (text === 'Thursday') {
            return 4
        }
        if (text === 'Friday') {
            return 5
        }
        if (text === 'Saturday') {
            return 6
        }
    }
    const handleSubmit = async (event) => {
        let dataPost = []
        let dataPost2 = []

        let hasACheck = false
        for (const iterator of listDayOfWeek) {
            const element = document.getElementById(
                `js_${iterator}_checkbox`
            ) as any
            if (element.checked) {
                for (const iterator2 of timeInDay) {
                    const valueStart = event[`${iterator}_${iterator2}_start`]
                    const valueEnd = event[`${iterator}_${iterator2}_end`]

                    // cần chuyển đổi sang giờ phút để so sánh, vì  khi edit form input time, có case thư viện nó set value = today
                    // vì vậy so sánh cả ngày tháng năm là không chính xác
                    const valueStartOnlyTimeMs = valueStart
                        ? getHourAndMinuteInMs(valueStart)
                        : null
                    const valueEndOnlyTimeMs = valueEnd
                        ? getHourAndMinuteInMs(valueEnd)
                        : null

                    if (!valueEndOnlyTimeMs && !valueEndOnlyTimeMs) {
                        // no need action
                        continue
                    }
                    if (
                        (valueStartOnlyTimeMs && !valueEndOnlyTimeMs) ||
                        (!valueStartOnlyTimeMs && valueEnd) ||
                        (valueStartOnlyTimeMs &&
                            valueEndOnlyTimeMs &&
                            valueStartOnlyTimeMs >= valueEndOnlyTimeMs)
                    ) {
                        return notification.error({
                            message: 'Error',
                            description: `Please double check the time of ${iterator} ${iterator2.toLocaleLowerCase()}`
                        })
                    }

                    let tempValueStartOnlyHourAndMinuteInMs =
                        valueStartOnlyTimeMs
                    const arr = []
                    const arr2 = []

                    while (
                        tempValueStartOnlyHourAndMinuteInMs < valueEndOnlyTimeMs
                    ) {
                        const day_of_week = getDayOfWeek(iterator)
                        const _time =
                            day_of_week * DAY_TO_MS +
                            tempValueStartOnlyHourAndMinuteInMs
                        arr.push(_time)
                        arr2.push(
                            moment()
                                .startOf('week')
                                .set('day', day_of_week)
                                .add(
                                    tempValueStartOnlyHourAndMinuteInMs,
                                    'millisecond'
                                )
                                .valueOf()
                        )
                        tempValueStartOnlyHourAndMinuteInMs += 30 * MINUTE_TO_MS
                    }
                    dataPost = dataPost.concat(arr)
                    dataPost2 = dataPost2.concat(arr2)
                }
                hasACheck = true
            }
        }
        if (!hasACheck) {
            notification.error({
                message: 'Error',
                description: getTranslateText('dont_have_any_time')
            })
        }
        try {
            const convertToUtc = _.clone(dataPost).map((t) =>
                getTimestampInWeekToUTC(t)
            )
            const validPeakTime = dataPost2.filter((e) => {
                const time = moment(e)
                const day = time.day()
                const hour = time.hour()

                if (day >= 1 && day <= 5 && hour >= 18 && hour < 21) {
                    return true
                }
                if (
                    (day == 6 || day == 0) &&
                    ((hour >= 9 && hour < 11) ||
                        (hour >= 14 && hour < 17) ||
                        (hour >= 18 && hour < 21))
                ) {
                    return true
                }
                return false
            })
            let count = 0
            const validPeakTimeByDay = _.chain(
                validPeakTime.map((e) => ({
                    time: e,
                    day: moment(e).date()
                }))
            )
                .groupBy('day')
                .map((value, key) => ({ day: key, times: value }))
                .value()
            validPeakTimeByDay.forEach((element) => {
                for (const iterator of element.times) {
                    const hasANextSlot = element.times.find(
                        (e) =>
                            e.time ==
                            moment(iterator.time).add(30, 'minute').valueOf()
                    )
                    if (hasANextSlot) {
                        count++
                        break
                    }
                }
            })

            if (
                validPeakTime.length <
                user.level.min_peak_time_per_circle / 2
            ) {
                return notification.error({
                    message: 'Error',
                    description:
                        getTranslateText(
                            'regular.do_not_enough_number_slot_peak_time'
                        ) + user.level.min_peak_time_per_circle
                })
            }

            if (convertToUtc.length < user.level.min_calendar_per_circle / 2) {
                return notification.error({
                    message: 'Error',
                    description:
                        getTranslateText('regular.do_not_enough_number_slot') +
                        user.level.min_calendar_per_circle
                })
            }
            if (count < 2) {
                return notification.error({
                    message: 'Error',
                    description: getTranslateText(
                        'regular.do_not_enough_2day_1hour'
                    )
                })
            }

            await onSave(convertToUtc)
            notification.success({
                message: 'Success',
                description: getTranslateText('submit_request_successfully')
            })
        } catch (err) {
            notification.error({
                message: 'Error',
                description: err.message
            })
        }
    }
    const setFormValue = (arr) => {
        if (!arr.length) {
            return
        }
        const valueStart = moment(arr[0].value.valueOf())
        let valueEnd = moment(arr[0].value.valueOf()).add({
            minute: 30
        })
        if (arr.length !== 1) {
            valueEnd = moment(
                arr[arr.length - 1].value
                    .add({
                        minute: 30
                    })
                    .valueOf()
            )
        }
        console.log(
            `key start ${arr[0].keyStart}: ${valueStart}, keyend: ${arr[0].keyEnd} ${valueEnd}`
        )
        form.setFieldValue(arr[0].keyStart, valueStart)
        form.setFieldValue(arr[0].keyEnd, valueEnd)
    }

    const getFullInfoByTeacher = async () => {
        const user = await UserAPI.getFullInfoByTeacher()
        setUser(user)
    }

    useEffect(() => {
        form.resetFields()
        const regularTimesLocal = _.clone(regularTimes)
            .sort((a: any, b: any) => a - b)
            .map((t) => formatTimestampMoment(getTimestampInWeekToLocal(t)))
        const listTime = []
        const listChecked = {}
        for (const iterator of regularTimesLocal) {
            const dddd = iterator.format('dddd')
            listChecked[`js_${dddd}_checkbox`] = true
            let time = 'Morning'
            if (iterator.hour() >= 13 && iterator.hour() <= 18) {
                time = 'Afternoon'
            }
            if (iterator.hour() >= 19) {
                time = 'Evening'
            }
            const keyStart = `${dddd}_${time}_start`
            const keyEnd = `${dddd}_${time}_end`
            const temp = listTime.find((e) => e.key === dddd)
            if (temp) {
                temp.arr.push({
                    time,
                    value: iterator,
                    keyStart,
                    keyEnd
                })
            } else {
                listTime.push({
                    key: dddd,
                    arr: [
                        {
                            time,
                            value: iterator,
                            keyStart,
                            keyEnd
                        }
                    ]
                })
            }
        }
        setValues({
            formValues: {
                ...values.formValues,
                ...listChecked
            }
        })
        console.log(listTime)

        listTime.forEach((element) => {
            const arrMorning = element.arr.filter((e) => e.time === 'Morning')
            const arrAfternoon = element.arr.filter(
                (e) => e.time === 'Afternoon'
            )
            const arrEvening = element.arr.filter((e) => e.time === 'Evening')
            setFormValue(arrMorning)
            setFormValue(arrAfternoon)
            setFormValue(arrEvening)
        })
        getFullInfoByTeacher()
    }, [regularTimes])
    return (
        <>
            <Form form={form} onFinish={handleSubmit} autoComplete='off'>
                {user && (
                    <p>
                        You are at {user.level.name} level. You have to open at
                        least {user.level.min_calendar_per_circle} slots in a
                        circle and {user.level.min_peak_time_per_circle} peak
                        time in a circle
                    </p>
                )}

                <div className='row'>{renderDayInWeek()}</div>
                <div className='row'>
                    <div className='col-12 d-flex justify-content-end'>
                        <Button type='primary' htmlType='submit'>
                            Submit
                        </Button>
                    </div>
                </div>
            </Form>
        </>
    )
}

export default RegularTimeRequest
