import React, { FC } from 'react'
import cn from 'classnames'
import { Row, Col, Image } from 'antd'
import { EyeOutlined, WarningOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getTranslateText } from 'utils/translate-utils'
import Flag from '../Flag'
import styles from './DetailScheduleItem.module.scss'

type Props = {
    type: number
    booking: any
}

const DetailScheduleItem: FC<Props> = (props) => {
    const { type = 3, booking } = props

    return (
        <>
            <div className={cn(styles.item)}>
                <Flag type={type} />
                <Row className={`${cn(styles.content)} row m-0`}>
                    <div className={cn(styles.topItem)}>
                        <div className={`${cn(styles.item_left)}`}>
                            <div className={cn(styles.item_left_child)}>
                                <ul className={cn(styles.timeDate)}>
                                    <li className={cn(styles.numberID)}>
                                        #{booking.id}
                                    </li>
                                    <li className={cn(styles.textTime)}>
                                        <span>09 : 30</span>{' '}
                                        <span>- 10 : 00</span>
                                    </li>
                                    <li className={cn(styles.textLarge)}>
                                        FLEXIBLE
                                    </li>
                                    <li className={cn(styles.textDateTime)}>
                                        {booking.calendar &&
                                            moment(
                                                booking.calendar.start_time
                                            ).format('DD/MM/YYYY')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={`${cn(styles.item_mid)}`}>
                            <ul className={cn(styles.courseName)}>
                                <li>
                                    <span>
                                        {getTranslateText('common.course')}
                                    </span>{' '}
                                    <span>Family and Friends 2</span>
                                </li>
                                <li>
                                    <span>
                                        {getTranslateText(
                                            'student.booking.page'
                                        )}
                                    </span>{' '}
                                    <span>8</span>
                                </li>
                                <li>
                                    <span>
                                        {getTranslateText('booking.unit')}
                                    </span>{' '}
                                    <span>Have you got a milkshake 1</span>
                                </li>
                            </ul>
                        </div>
                        <div className={`${cn(styles.item_right)}`}>
                            <ul className={cn(styles.studentName)}>
                                <li>
                                    <br />
                                </li>
                                <li>
                                    <span>
                                        {getTranslateText('booking.student')}
                                    </span>{' '}
                                    <span> Felecitas Oliquino</span>
                                </li>
                                <li>
                                    <span>
                                        {getTranslateText(
                                            'student.booking.studentSkype'
                                        )}
                                    </span>{' '}
                                    <span>oliquino.fs@gmail.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Col span={24} className={`${cn(styles.control)}`}>
                        <Row>
                            <Col span={8}>
                                <Row>
                                    <Col
                                        span={12}
                                        className={`${cn(
                                            styles.borderRight
                                        )} d-flex align-items-center py-3`}
                                    >
                                        <Image
                                            src='/static/img/teacher/teaching-history/skype.png'
                                            width={16}
                                            height={16}
                                            preview={false}
                                        />
                                        <span>
                                            {getTranslateText(
                                                'student.booking.bySkype'
                                            )}
                                        </span>
                                    </Col>
                                    <Col
                                        span={12}
                                        className={cn(styles.borderRight)}
                                    />
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col
                                        span={12}
                                        className={`${cn(
                                            styles.borderRight
                                        )} d-flex align-items-center py-3`}
                                    >
                                        <EyeOutlined />
                                        <span>
                                            {getTranslateText(
                                                'booking.view_document'
                                            )}
                                        </span>
                                    </Col>
                                    <Col
                                        span={12}
                                        className={`${cn(
                                            styles.borderRight
                                        )} d-flex align-items-center py-3`}
                                    >
                                        <Image
                                            src='/static/img/teacher/schedules/change-unit.svg'
                                            preview={false}
                                            width={16}
                                        />
                                        <span>
                                            {getTranslateText('change_unit')}
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col
                                        span={12}
                                        style={{ color: '#DBDBDB' }}
                                        className={`${cn(
                                            styles.borderRight
                                        )} d-flex align-items-center py-3`}
                                    >
                                        <WarningOutlined />
                                        <span>
                                            {getTranslateText(
                                                'rating.report_label'
                                            )}
                                        </span>
                                    </Col>
                                    <Col
                                        span={12}
                                        style={{ color: '#25ab5c' }}
                                        className={`${cn(
                                            styles.borderRight
                                        )} ${cn(
                                            styles.borderRight_none
                                        )} d-flex align-items-center py-3`}
                                    >
                                        <Image
                                            src='/static/img/teacher/schedules/play.svg'
                                            width={16}
                                            height={16}
                                            preview={false}
                                        />
                                        <span>
                                            {getTranslateText(
                                                'teacher.dashboard.schedule.start_teaching'
                                            )}
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className={cn(styles.title)}>
                    {getTranslateText('fixed_calendar')}
                </div>
            </div>
        </>
    )
}

export default DetailScheduleItem
