import cn from 'classnames'
import { Row, Col, Card, Image, Tag } from 'antd'
import {
    DEFAULT_DISCOUNT_PREVIEW,
    DEFAULT_SALE_OFF_PREVIEW
} from 'const/common'
import { getTranslateText } from 'utils/translate-utils'
import { FC, memo } from 'react'
import _ from 'lodash'
import { EnumPackageOrderType, EnumStudentType, ICoupon } from 'types'
import { CopyOutlined } from '@ant-design/icons'
import moment from 'moment'
import { DATE_FORMAT, MAX_TIME_SHOWN_REMAIN } from 'const'
import copy from 'copy-to-clipboard'
import { notify } from 'contexts/Notification'
import styles from './CouponItem.module.scss'

type Props = {
    data: ICoupon
}

const CouponItem: FC<Props> = ({ data }) => {
    const onCopy = () => {
        copy(data?.code)
        notify('success', 'Copy successfully')
    }

    return (
        <Card className={cn(styles['coupon-card'])}>
            <Row>
                <Col xs={24} sm={6} md={6} lg={6}>
                    <div className='d-flex justify-content-center'>
                        <Image
                            src={data?.image || DEFAULT_SALE_OFF_PREVIEW}
                            alt={data?.title || 'Coupon image'}
                            width={100}
                            height={100}
                            preview={false}
                            fallback={DEFAULT_SALE_OFF_PREVIEW}
                        />
                    </div>
                </Col>
                <Col xs={24} sm={16} md={16} lg={16}>
                    <Tag color='processing'>
                        {data?.student_type === EnumStudentType.NEW
                            ? getTranslateText('coupon.new_customer')
                            : data?.student_type === EnumStudentType.RENEW &&
                              getTranslateText('coupon.old_customer')}
                    </Tag>
                    <Tag color='processing'>
                        {_.get(EnumPackageOrderType, data?.package_type)}
                    </Tag>
                    <Row>
                        <Col xs={16} sm={16} md={16} lg={16}>
                            <h4 className={cn(styles.title)}>{data?.title}</h4>
                            <h5 className={cn(styles.content)}>
                                {data?.content}
                            </h5>
                            <div className={cn('')}>
                                <p className={cn(styles.code)}>
                                    <span className='mr-1'>
                                        {getTranslateText('coupon.code')}:
                                    </span>
                                    <span>
                                        {data?.code}
                                        <CopyOutlined onClick={onCopy} />
                                    </span>
                                </p>
                                <p className={cn(styles.timeUse)}>
                                    {getTranslateText('coupon.expire_time')}:{' '}
                                    {moment(data?.end_time_applied).format(
                                        DATE_FORMAT
                                    )}
                                </p>
                                {moment(data?.end_time_applied).diff(
                                    moment(),
                                    'days'
                                ) < MAX_TIME_SHOWN_REMAIN && (
                                    <p className={cn(styles.remain)}>
                                        ({getTranslateText('coupon.remain')}{' '}
                                        {moment(
                                            data?.end_time_applied
                                        ).fromNow()}
                                        )
                                    </p>
                                )}
                            </div>
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8}>
                            <h4 className={cn(styles.couponType)}>SALE OFF</h4>
                            <h4 className={cn(styles.valueCoupon)}>
                                {data?.percentage_off} %
                            </h4>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    )
}

export default memo(CouponItem)
