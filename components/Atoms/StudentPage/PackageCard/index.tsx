import cn from 'classnames'
import { Row, Col, Card, Button, Space, Avatar } from 'antd'
import { DEFAULT_PACKAGE_PREVIEW } from 'const/common'
import { getTranslateText } from 'utils/translate-utils'
import { FC, memo } from 'react'
import { toReadablePrice } from 'utils/price-utils'
import _ from 'lodash'
import { EnumPackageType, IPackage } from 'types'
import { POINT_VND_RATE } from 'const'
import styles from './PackageCard.module.scss'

type Props = {
    data: IPackage
    onSelectPackage: (item: IPackage) => void
}

const PackageCard: FC<Props> = ({ data, onSelectPackage }) => (
    <Card className={cn(styles['teacher-card'])}>
        <Row>
            <Col md={8}>
                <Space direction='vertical' align='center'>
                    <Avatar
                        src={data?.image || DEFAULT_PACKAGE_PREVIEW}
                        alt='Avatar teacher'
                        size={160}
                    />
                    <Button
                        className={cn(styles['btn-book'])}
                        onClick={() => onSelectPackage(data)}
                    >
                        {getTranslateText('student.package_card.add_cart')}
                    </Button>
                </Space>
            </Col>
            <Col md={16}>
                <Card bordered={false} className={cn(styles['teacher-info'])}>
                    <b className='blue3'>{data?.name}</b>
                    <br />
                    <b className={cn(styles.skill)}>
                        {getTranslateText('student.package_card.type')}
                    </b>
                    <span>
                        {_.findKey(EnumPackageType, (o) => o === data?.type)}
                    </span>
                    <br />
                    <b className={cn(styles.skill)}>
                        {getTranslateText('student.package_card.price')}
                    </b>
                    <span>
                        {toReadablePrice(data?.price)} VND |{' '}
                        {toReadablePrice(data?.price / POINT_VND_RATE)}{' '}
                        {getTranslateText('point')}
                    </span>
                    <br />
                    <b className={cn(styles.skill)}>
                        {getTranslateText('student.package_card.location')}
                    </b>
                    <span>
                        {data?.location_id === -1
                            ? 'All Teacher'
                            : data?.location?.name}
                    </span>
                    <br />
                    <b>{getTranslateText('student.package_card.duration')}</b>
                    <span>{data?.day_of_use} days</span>
                </Card>
            </Col>
        </Row>
    </Card>
)

export default memo(PackageCard)
