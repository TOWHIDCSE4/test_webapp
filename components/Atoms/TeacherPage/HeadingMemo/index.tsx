import { FC, memo } from 'react'
import { Row, Col } from 'antd'
import { EnumScheduledMemoType, IBooking, IScheduledMemo } from 'types'
import { getTranslateText } from 'utils/translate-utils'
import cn from 'classnames'
import styles from './index.module.scss'

type Props = {
    data: IBooking | IScheduledMemo
    min: number
    max: number
    memoType: EnumScheduledMemoType
}
const HeadingMemo: FC<Props> = ({ data, min = 1, max = 10, memoType }) => (
    <>
        <Row justify='center' gutter={[5, 5]}>
            <Col span={24}>
                <p className={cn(styles.titleBookingInfo, styles.assessment)}>
                    {getTranslateText('assessment').toUpperCase()}
                </p>
                <p
                    className={cn(styles.assessmentDesc)}
                    style={{
                        textAlign: 'center',
                        marginBottom: 20
                    }}
                >
                    (*{min} {getTranslateText('trial_memo.very_poor')}; {max}{' '}
                    {getTranslateText('trial_memo.excellent')})
                </p>
            </Col>
        </Row>
        {[
            EnumScheduledMemoType.NORMAL_MEMO,
            EnumScheduledMemoType.COURSE_MEMO
        ].includes(memoType) && (
            <Row>
                <Col xs={24} sm={24} md={24} lg={9} xl={9}>
                    <p>
                        {getTranslateText('student.booking.course')}:{' '}
                        <span className={cn(styles.titleBookingInfo)}>
                            {data?.course?.name}
                        </span>
                    </p>
                </Col>
                {EnumScheduledMemoType.NORMAL_MEMO === memoType && (
                    <>
                        <Col xs={24} sm={24} md={24} lg={9} xl={9}>
                            <p>
                                {getTranslateText('student.booking.unit')}:{' '}
                                <span className={cn(styles.titleBookingInfo)}>
                                    {data?.unit?.name}
                                </span>
                            </p>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                            <p>
                                {getTranslateText('student.booking.page')}:{' '}
                                <span className={cn(styles.titleBookingInfo)}>
                                    1
                                </span>
                            </p>
                        </Col>
                    </>
                )}
            </Row>
        )}
        {[
            EnumScheduledMemoType.MONTHLY_MEMO,
            EnumScheduledMemoType.COURSE_MEMO
        ].includes(memoType) && (
            <Row>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <p className='mb-0'>
                        <span className='mr-2'>
                            {getTranslateText('memo.registered_class')}:
                        </span>
                        <span className={cn(styles.titleBookingInfo)}>
                            {data?.registered_class}
                        </span>
                    </p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <p className='mb-0'>
                        <span className='mr-2'>
                            {getTranslateText('memo.completed_class')}:
                        </span>
                        <span className={cn(styles.titleBookingInfo)}>
                            {data?.completed_class}
                        </span>
                    </p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <p>
                        <span className='mr-2'>
                            {getTranslateText('memo.absent_cancel_class')}:
                        </span>
                        <span className={cn(styles.titleBookingInfo)}>
                            {data?.registered_class &&
                                data?.completed_class &&
                                data?.registered_class - data?.completed_class}
                        </span>
                    </p>
                </Col>
            </Row>
        )}
    </>
)

export default memo(HeadingMemo)
