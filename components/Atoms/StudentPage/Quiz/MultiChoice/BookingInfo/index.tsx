import { Row, Col } from 'antd'
import { FC, memo } from 'react'
import { IBooking } from 'types'
import { getTranslateText } from 'utils/translate-utils'

type Props = {
    data: IBooking
}
const BookingInfo: FC<Props> = ({ data }) => (
    <Row>
        <Col xs={24} sm={24} md={8}>
            <p>{getTranslateText('student.booking.course')}</p>
            <strong className='color-blue'>{data?.course?.name}</strong>
        </Col>
        <Col xs={24} sm={24} md={8}>
            <p>{getTranslateText('student.booking.unit')}</p>
            <strong className='color-blue'>{data?.unit?.name}</strong>
        </Col>
        <Col xs={24} sm={24} md={8}>
            <p>{getTranslateText('student.booking.teacher')}</p>
            <strong className='color-blue'>{data?.teacher?.full_name}</strong>
        </Col>
    </Row>
)
export default memo(BookingInfo)
