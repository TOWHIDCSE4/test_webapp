import React, { FC, memo } from 'react'
import cn from 'classnames'
import { Row, Col, Input } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import moment from 'moment'
import styles from '../ChooseUnit/ChooseUnit.module.scss'
import { IBookingDTO } from '../index'

const { TextArea } = Input
type Props = {
    studentNote: string
    data: IBookingDTO
    onChangeNote: (val) => void
}

const Done: FC<Props> = ({ studentNote, data, onChangeNote }) => (
    <Row
        gutter={[25, 20]}
        justify='center'
        className={cn('mb-4', styles['scroll-courses'])}
    >
        <Col offset={6} span={4}>
            <b>{getTranslateText('student.booking.teacher')}:</b>
        </Col>
        <Col span={14}>{data?.teacher?.user?.full_name}</Col>
        <Col offset={6} span={4}>
            <b>{getTranslateText('student.booking.time')}:</b>
        </Col>
        <Col span={14}>
            {data?.start_time
                ? moment(data.start_time).format('HH:mm DD-MM-YYYY')
                : data?.calendar &&
                  moment(data.calendar.start_time).format('HH:mm DD-MM-YYYY')}
        </Col>
        <Col offset={6} span={4}>
            <b>{getTranslateText('student.package.package')}:</b>
        </Col>
        <Col span={14}>{data?.ordered_package?.package_name}</Col>
        <Col offset={6} span={4}>
            <b>{getTranslateText('student.booking.course')}:</b>
        </Col>
        <Col span={14}>{data?.course?.name}</Col>
        <Col offset={6} span={4}>
            <b>{getTranslateText('student.booking.unit')}:</b>
        </Col>
        <Col span={14}>{data?.unit?.name}</Col>
        <Col offset={0} span={12}>
            <TextArea
                onChange={(e) => onChangeNote(e.target.value)}
                value={studentNote}
                placeholder={getTranslateText('enter_note_here')}
            />
        </Col>
    </Row>
)

export default memo(Done)
