/* eslint-disable no-restricted-syntax */
import React, { useReducer, useEffect } from 'react'
import moment from 'moment'
import { getCurrentWeek } from '../../../../../../utils/datetime-utils'

export default function Availability(props) {
    const { day_of_week, start_time } = props.calendar
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            tab: 'general',
            week_start: moment().valueOf(),
            week_end: moment().add(7, 'days').valueOf()
        }
    )

    useEffect(() => {
        if (day_of_week) {
            setValues({ tab: 'general' })
        } else if (start_time) {
            setValues({ tab: 'specific' })
        }
    }, [])

    const onChangeTab = (value) => {
        setValues({ tab: value })
    }
    const onChangeCalendar = (key, value) => {
        if (props.onChangeCalendar) {
            const { calendar } = props
            const new_calendar: any = {}
            for (const [_key, _value] of Object.entries(calendar)) {
                new_calendar[_key] = ''
            }
            new_calendar[key] = value
            if (key === 'start_time') {
                new_calendar.end_time = moment(value).endOf('days').valueOf()
            }
            props.onChangeCalendar(new_calendar)
        }
    }

    const onNextWeek = () => {
        if (
            new Date(values.week_start).getMonth() - new Date().getMonth() <=
            3
        ) {
            const next_week_start = moment(values.week_start)
                .add(7, 'days')
                .valueOf()
            const next_week_end = moment(values.week_end)
                .add(7, 'days')
                .valueOf()
            setValues({ week_start: next_week_start, week_end: next_week_end })
        }
    }

    const onPrevWeek = () => {
        if (new Date(values.week_start) > new Date()) {
            const prev_week_start = moment(values.week_start)
                .subtract(7, 'days')
                .valueOf()
            const prev_week_end = moment(values.week_end)
                .subtract(7, 'days')
                .valueOf()
            setValues({ week_start: prev_week_start, week_end: prev_week_end })
        }
    }

    const clearFilter = () => {
        if (props.onClearFilter) {
            props.onClearFilter('calendar')
        }
    }

    const applyFilter = () => {
        if (props.onApplyFilter) {
            props.onApplyFilter()
        }
    }

    const _renderDates = () => {
        const days = getCurrentWeek(values.week_start)
        return days.map((item, index) => (
            <div
                className={`fitler-availability-day-section ${
                    start_time === moment(item).startOf('days').valueOf()
                        ? 'fitler-availability-specific-active'
                        : ''
                }`}
                key={index}
                onClick={() => {
                    onChangeCalendar(
                        'start_time',
                        moment(item).startOf('days').valueOf()
                    )
                }}
            >
                <p className='fitler-availability-weekday'>
                    {moment(item).format('ddd')}
                </p>
                <p className='fitler-availability-day'>
                    {moment(item).format('DD')}
                </p>
            </div>
        ))
    }

    return (
        <div className='filter-container'>
            <div className='filter-body'>
                <div className='filter-availability-tab-head'>
                    <div
                        className={`filter-availability-tab-title ${
                            values.tab === 'general'
                                ? 'filter-availability-tab-active'
                                : ''
                        }`}
                        onClick={() => onChangeTab('general')}
                    >
                        <span>General time</span>
                    </div>
                    <div
                        className={`filter-availability-tab-title ${
                            values.tab === 'specific'
                                ? 'filter-availability-tab-active'
                                : ''
                        }`}
                        onClick={() => onChangeTab('specific')}
                    >
                        <span>Specific time</span>
                    </div>
                </div>
                {values.tab === 'general' ? (
                    <div className='filter-availability-tab-body'>
                        <div className='filter-availability-tab-item'>
                            <div className='availability-day-range-head'>
                                <span>Days of the week</span>
                            </div>
                            <div className='availability-day-range'>
                                <div
                                    className={`availability-day-choice${
                                        day_of_week === '0'
                                            ? ' availability-day-active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        onChangeCalendar('day_of_week', '0')
                                    }
                                >
                                    Sun
                                </div>
                                <div
                                    className={`availability-day-choice${
                                        day_of_week === '1'
                                            ? ' availability-day-active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        onChangeCalendar('day_of_week', '1')
                                    }
                                >
                                    Mon
                                </div>
                                <div
                                    className={`availability-day-choice${
                                        day_of_week === '2'
                                            ? ' availability-day-active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        onChangeCalendar('day_of_week', '2')
                                    }
                                >
                                    Tue
                                </div>
                                <div
                                    className={`availability-day-choice${
                                        day_of_week === '3'
                                            ? ' availability-day-active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        onChangeCalendar('day_of_week', '3')
                                    }
                                >
                                    Wed
                                </div>
                                <div
                                    className={`availability-day-choice${
                                        day_of_week === '4'
                                            ? ' availability-day-active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        onChangeCalendar('day_of_week', '4')
                                    }
                                >
                                    Thu
                                </div>
                                <div
                                    className={`availability-day-choice${
                                        day_of_week === '5'
                                            ? ' availability-day-active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        onChangeCalendar('day_of_week', '5')
                                    }
                                >
                                    Fri
                                </div>
                                <div
                                    className={`availability-day-choice${
                                        day_of_week === '6'
                                            ? ' availability-day-active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        onChangeCalendar('day_of_week', '6')
                                    }
                                >
                                    Sat
                                </div>
                            </div>
                            {/* <div className="availability-time-range-head">
                                    <span>Time range</span>
                                </div>
                                <div className="availability-time-range">
                                    <div className="availability-time-choice" data-cy="ts_ab_time0004">00 - 04</div>
                                    <div className="availability-time-choice" data-cy="ts_ab_time0408">04 - 08</div>
                                    <div className="availability-time-choice" data-cy="ts_ab_time0812">08 - 12</div>
                                    <div className="availability-time-choice" data-cy="ts_ab_time1216">12 - 16</div>
                                    <div className="availability-time-choice" data-cy="ts_ab_time1620">16 - 20</div>
                                    <div className="availability-time-choice" data-cy="ts_ab_time2024">20 - 24</div>
                                </div> */}
                            <p className='availability-timezone'>
                                <span className='user-based-timezone'>
                                    <span>Based on your timezone</span>{' '}
                                    (UTC+07:00)
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className='filter-availability-tab-body'>
                        <div className='filter-availability-tab-item'>
                            <div className='filter-availability-date'>
                                <div
                                    className='filter-availability-date-arrow items-center'
                                    data-cy='ts_ab_specifictime_leftbtn'
                                    onClick={onPrevWeek}
                                >
                                    <svg
                                        height='24'
                                        viewBox='0 0 24 24'
                                        width='24'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='#333'
                                    >
                                        <path
                                            clipRule='evenodd'
                                            d='M16.494 3.436a.75.75 0 01.07 1.058L9.997 12l6.567 7.506a.75.75 0 11-1.128.988l-7-8a.75.75 0 010-.988l7-8a.75.75 0 011.058-.07z'
                                            fillRule='evenodd'
                                        />
                                    </svg>
                                </div>
                                <div className='filter-availability-date-range'>
                                    {moment(values.week_start).format(
                                        'MMMM DD YYYY'
                                    )}
                                    &nbsp;-&nbsp;
                                    {moment(values.week_end).format(
                                        'MMMM DD YYYY'
                                    )}
                                </div>
                                <div
                                    className='filter-availability-date-arrow items-center'
                                    data-cy='ts_ab_specifictime_rightbtn'
                                    onClick={onNextWeek}
                                >
                                    <svg
                                        height='24'
                                        viewBox='0 0 24 24'
                                        width='24'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='#333'
                                    >
                                        <path
                                            clipRule='evenodd'
                                            d='M7.506 3.436a.75.75 0 00-.07 1.058L14.003 12l-6.567 7.506a.75.75 0 001.128.988l7-8a.75.75 0 000-.988l-7-8a.75.75 0 00-1.058-.07z'
                                            fillRule='evenodd'
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className='fitler-availability-days'>
                                {_renderDates()}
                            </div>
                        </div>
                    </div>
                )}
                <div className='filter-footer'>
                    <button
                        type='button'
                        className='ant-btn filter-clear-btn ant-btn-default ant-btn-sm'
                        onClick={clearFilter}
                    >
                        <span data-cy='ts_clear'>Clear</span>
                    </button>
                    <button
                        type='button'
                        className='ant-btn filter-apply-btn ant-btn-primary ant-btn-sm'
                        onClick={applyFilter}
                    >
                        <span data-cy='ts_apply'>Apply</span>
                    </button>
                </div>
            </div>
            <style jsx global>{`
                .fitler-availability-days {
                    display: -webkit-flex;
                    display: flex;
                    padding: 16px 0;
                }
                .fitler-availability-day-section {
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    text-align: center;
                    width: 50px;
                    height: 52px;
                    border: 1px solid transparent;
                }
                .fitler-availability-specific-active {
                    background: rgba(0, 191, 189, 0.1);
                    border: 1px solid #00bfbd;
                    color: #00bfbd;
                    border-radius: 4px;
                }
                .fitler-availability-weekday {
                    font-size: 12px;
                    color: #8c8c8c;
                    margin-top: 4px;
                    letter-spacing: 0.75px;
                    text-transform: uppercase;
                    line-height: 16px;
                    margin-bottom: 0.25rem;
                }
                .fitler-availability-specific-active
                    .fitler-availability-weekday {
                    color: #00bfbd;
                }
                .fitler-availability-day {
                    font-size: 20px;
                    font-weight: 500;
                    position: relative;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    border-radius: 4px;
                    border: 1px solid transparent;
                    cursor: pointer;
                    margin: -4px auto 0;
                    line-height: 28px;
                }
            `}</style>
            <style jsx>{`
                .filter-container {
                    position: fixed;
                    margin-top: 13px;
                    max-width: 375px;
                    min-width: 280px;
                    transition: top 0.2s;
                    background: #fff;
                    border-radius: 4px;
                }
                .filter-section .filter-container {
                    -webkit-transform: translateX(-25%);
                    transform: translateX(-25%);
                }
                .filter-section:first-child .filter-container {
                    -webkit-transform: translateX(0);
                    transform: translateX(0);
                    width: 280px;
                }
                .filter-body {
                    background: #fff;
                    border-radius: 4px;
                }
                .filter-availability-tab-head {
                    display: -webkit-flex;
                    display: flex;
                    padding-top: 16px;
                    height: 48px;
                    border-bottom: 1px solid #ddd;
                    -webkit-justify-content: center;
                    justify-content: center;
                }
                .filter-availability-tab-title {
                    font-size: 14px;
                    cursor: pointer;
                    margin: 0 20px;
                }
                .filter-availability-tab-active {
                    border-bottom: 2px solid #ff4338;
                    font-weight: 500;
                }
                .filter-availability-tab-body {
                    padding: 24px 16px 16px;
                }
                .availability-day-range-head,
                .availability-specific-time-head,
                .availability-time-range-head {
                    margin-bottom: 16px;
                    font-size: 16px;
                    font-weight: 500;
                }
                .availability-day-range,
                .availability-time-range {
                    display: -webkit-flex;
                    display: flex;
                    margin-bottom: 24px;
                    -webkit-flex-wrap: wrap;
                    flex-wrap: wrap;
                    overflow: hidden;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                }
                .availability-day-range {
                    -webkit-flex-wrap: nowrap;
                    flex-wrap: nowrap;
                }
                .availability-day-choice,
                .availability-time-choice {
                    display: -webkit-flex;
                    display: flex;
                    height: 32px;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .availability-day-choice {
                    width: 44px;
                }
                .availability-time-range {
                    margin-bottom: 16px;
                }
                .availability-timezone {
                    font-size: 12px;
                    color: #8c8c8c;
                }
                .availability-time-choice {
                    width: 109px;
                    border: 1px solid transparent;
                    margin-bottom: 8px;
                }

                .filter-footer {
                    position: relative;
                    display: -webkit-flex;
                    display: flex;
                    height: 56px;
                    padding: 16px;
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-justify-content: flex-end;
                    justify-content: flex-end;
                    border-top: 1px solid #e9e9eb;
                    background: #fff;
                    border-radius: 4px;
                }
                button.filter-apply-btn {
                    margin-left: 16px;
                }
                .availability-day-active,
                .availability-time-active {
                    background: rgba(0, 191, 189, 0.1);
                    border: 1px solid #00bfbd;
                    color: #00bfbd;
                    border-radius: 4px;
                }
                .filter-availability-date,
                .filter-availability-time {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .filter-availability-date-arrow {
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    border: 1px solid #d9d9d9;
                    display: -webkit-flex;
                    display: flex;
                    justify-items: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    border-radius: 4px;
                }
                .filter-availability-date-range,
                .filter-availability-time-range {
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    font-size: 14px;
                    text-align: center;
                }
            `}</style>
        </div>
    )
}
