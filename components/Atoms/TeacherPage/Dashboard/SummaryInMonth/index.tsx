/* eslint-disable @typescript-eslint/no-use-before-define */

import React, { useCallback, useEffect, useState, useMemo, memo } from 'react'
import { useRouter } from 'next/router'
import { DatePicker, Progress, Select, Badge, Button, Alert } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { Row, Col } from 'react-bootstrap'
import BookingAPI from 'api/BookingAPI'
import moment from 'moment'
import cn from 'classnames'
import { MONTHS_LABEL } from 'const/date-time'
import {
    getTranslateText,
    getInterpolationTransText
} from 'utils/translate-utils'
import Highcharts from 'highcharts'
import { ITeacher, ITeacherSalary } from 'types'
import { notify } from 'contexts/Notification'
import { toReadablePrice } from 'utils/price-utils'
import UserAPI from 'api/UserAPI'
import { useAuth } from 'contexts/Auth'
import { Logger } from 'utils/logger'
import { capitalizeFirstLetter } from 'utils/string-utils'
import styles from './SummaryInMonth.module.scss'
import Link from 'next/link'
import { RangePickerProps } from 'antd/lib/date-picker'

const SummaryInMonth = (props: any) => {
    const router = useRouter()
    const { locale } = router
    const [isChartMobile, setIsChartMobile] = useState<boolean>(false)
    const [dataReport, setDataReport] = useState(null)
    const [circle, setCircle] = useState<number>(1)
    const [teacherSummary, setTeachersSummary] = useState(null)
    const [timeReport, setTimeReport] = useState<number>(
        moment().startOf('month').valueOf()
    )

    const currentMonth = moment(timeReport).month()

    const getStatisticSalary = (query?: { month: number; circle: number }) => {
        const realMonth = moment(query.month).get('months') + 1
        const year = moment(query.month).get('years')
        const newQuery = { month: realMonth, year, circle: query.circle }
        BookingAPI.getTeacherSalary(newQuery)
            .then((res) => {
                setTeachersSummary(res)
                props?.setData(res)
            })
            .catch((err) => {
                Logger.error(err)
            })
    }

    useEffect(() => {}, [])

    useEffect(() => {
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    useEffect(() => {
        loadDataReport()
        getStatisticSalary({ month: timeReport, circle })
    }, [timeReport, circle])

    const loadDataReport = useCallback(() => {
        let start_time = moment(timeReport)
            .startOf('month')
            .startOf('day')
            .valueOf()
        let end_time = moment(timeReport)
            .startOf('month')
            .add(14, 'days')
            .endOf('day')
            .valueOf()
        if (circle === 2) {
            start_time = moment(timeReport)
                .startOf('month')
                .add(15, 'days')
                .startOf('day')
                .valueOf()
            end_time = moment(timeReport).endOf('month').endOf('day').valueOf()
        }
        BookingAPI.teacherGetReport({
            start_time,
            end_time
        })
            .then((res) => {
                setDataReport(res)
            })
            .catch((err) => {
                Logger.error(err)
            })
    }, [timeReport, circle])

    const onChangeReport = useCallback(
        (values: moment.Moment) => {
            setCircle(1)
            setTimeReport(values.valueOf())
        },
        [setTimeReport, setCircle]
    )

    const resize = useCallback(() => {
        if (screen.width < 426) {
            setIsChartMobile(true)
        } else {
            setIsChartMobile(false)
        }
    }, [setIsChartMobile])

    const data = useMemo(
        () => [
            {
                type: getTranslateText(
                    'teacher.dashboard.chart.legend.doneLabel'
                ),
                value: dataReport?.total_done || 0,
                color: '#20AC5C'
            },
            {
                type: getTranslateText(
                    'teacher.dashboard.chart.legend.studentAbsent'
                ),
                value: dataReport?.total_student_absent || 0,
                color: '#FA9B1A'
            },
            {
                type: getTranslateText(
                    'teacher.dashboard.chart.legend.teacherAbsent'
                ),
                value: dataReport?.total_teacher_absent || 0,
                color: '#5D5D5D'
            },
            {
                type: getTranslateText(
                    'teacher.dashboard.chart.legend.cancelByStudent'
                ),
                value: dataReport?.total_student_cancel || 0,
                color: '#A9A9A9'
            },
            {
                type: getTranslateText(
                    'teacher.dashboard.chart.legend.cancelByAdmin'
                ),
                value: dataReport?.total_admin_cancel || 0,
                color: '#F63238'
            },
            {
                type: getTranslateText(
                    'teacher.dashboard.chart.legend.openClass'
                ),
                value: dataReport?.total_open || 0,
                color: '#016DFF'
            }
        ],
        [dataReport]
    )

    useEffect(() => {
        let totalClass = 0
        const colors = []
        const dataToChart = data.map((item) => {
            totalClass += item.value
            colors.push(item.color)
            return [item.type, item.value]
        })
        Highcharts.chart('summary-chart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                style: {
                    fontFamily: 'MB Grotesk'
                }
            },
            title: {
                text: `${getTranslateText(
                    'teacher.dashboard.summary.byTeachingStatus.total'
                )}<br/>${totalClass}`,
                align: 'center',
                verticalAlign: 'middle',
                y: isChartMobile ? -55 : -20,
                style: {
                    fontSize: '24px',
                    fontWeight: '100'
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: ''
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: isChartMobile ? -25 : -30,
                        style: {
                            fontWeight: '400',
                            color: 'white',
                            fontSize: '16px'
                        },
                        format: '{point.y}'
                    },
                    startAngle: 0,
                    endAngle: 360,
                    /* center: ['50%', '50%'], */
                    size: '100%',
                    showInLegend: true,
                    colors
                }
            },
            legend: {
                itemStyle: {
                    fontSize: '18px',
                    fontWeight: '100'
                },
                itemMarginBottom: 5
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: 'pie',
                    name: 'Value',
                    innerSize: '60%',
                    data: dataToChart
                }
            ]
        })
    }, [data, isChartMobile])
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return (
            current &&
            (current < moment('2022-09-01').endOf('month') ||
                current > moment().endOf('month'))
        )
    }

    return (
        <div className={cn(styles.WrapSummaryInMonth)}>
            <Row className='justify-end'>
                <Col>
                    <h4 className={cn(styles.titlePage)}>
                        {getTranslateText('teacher.dashboard.chart.title')}
                    </h4>
                </Col>
                <Col
                    xl='6'
                    md='12'
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginRight: 5
                    }}
                >
                    <DatePicker
                        picker='month'
                        disabledDate={disabledDate}
                        value={moment(timeReport)}
                        onChange={onChangeReport}
                        className='mr-2'
                    />
                    <Select
                        value={circle}
                        onChange={(value) => setCircle(value)}
                        className={styles['circle-select']}
                    >
                        {/* <Select.Option value={''}>
                            {getTranslateText(
                                'teacher.dashboard.circleSelector.allCircles'
                            )}
                        </Select.Option> */}
                        <Select.Option value={1}>
                            {getTranslateText(
                                'teacher.dashboard.circleSelector.firstCircle'
                            )}
                        </Select.Option>
                        <Select.Option value={2}>
                            {getTranslateText(
                                'teacher.dashboard.circleSelector.secondCircle'
                            )}
                        </Select.Option>
                    </Select>
                </Col>
            </Row>
            <Row className='m-0'>
                <Col xl='6' md='12'>
                    <h4 className={cn(styles.titleChart)}>
                        {getTranslateText(
                            'teacher.dashboard.summary.byTeachingStatus'
                        )}
                    </h4>
                    <div
                        className={cn(styles.Chart)}
                        style={{ maxWidth: '100%', maxHeight: 400 }}
                    >
                        <div id='summary-chart' />
                    </div>
                </Col>
                <Col xl='6' md='12' className={cn(styles.summaryInMonth)}>
                    <h5>
                        {getTranslateText(
                            'teacher.dashboard.summary.calculatedWage'
                        )}
                        &nbsp;(Last update:&nbsp;
                        {moment(teacherSummary?.updated_time).format(
                            'DD/MM/YYYY HH:mm Z'
                        )}
                        )
                    </h5>
                    <div className={cn(styles.numberPHP)}>
                        {toReadablePrice(teacherSummary?.total_salary)}{' '}
                        <span style={{ fontSize: 20 }}>
                            {teacherSummary?.currency}
                        </span>
                        {props.isShow && (
                            <div>
                                <Badge offset={[-10, 0]}>
                                    <Link href='/teacher/teaching-summary'>
                                        <a className='btn btn-success d-flex align-items-center'>
                                            {getTranslateText(
                                                'teacher.dashboard.summary.calculatedWage.detail'
                                            )}
                                            <RightOutlined />
                                        </a>
                                    </Link>
                                </Badge>
                            </div>
                        )}
                    </div>
                    <div className={cn(styles.summaryInMonth_info)}>
                        <div className='mb-2'>
                            <div>
                                {getTranslateText(
                                    'teacher.summary.base_salary'
                                )}
                            </div>
                            <div className={cn(styles.line)} />
                            <div>
                                {toReadablePrice(
                                    teacherSummary?.base_salary?.total_salary
                                )}{' '}
                                <span style={{ fontSize: 12 }}>
                                    {teacherSummary?.currency}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={cn(styles.summaryInMonth_info)}>
                        <div>
                            <div>
                                {getTranslateText(
                                    'teacher.dashboard.summary.bonus'
                                )}
                            </div>
                            <div className={cn(styles.line)} />
                            <div>
                                {toReadablePrice(
                                    teacherSummary?.bonus?.total_bonus
                                )}{' '}
                                <span style={{ fontSize: 12 }}>
                                    {teacherSummary?.currency}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div>
                                {getTranslateText(
                                    'teacher.dashboard.summary.punish'
                                )}
                            </div>
                            <div className={cn(styles.line)} />
                            <div>
                                {toReadablePrice(
                                    teacherSummary?.punish?.total_punish
                                )}{' '}
                                <span style={{ fontSize: 12 }}>
                                    {teacherSummary?.currency}
                                </span>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Alert
                className='mt-2 mb-2'
                message={getTranslateText('warning.salary')}
                type='warning'
            />
        </div>
    )
}

export default SummaryInMonth
