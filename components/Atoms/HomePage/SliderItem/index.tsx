import { FC, memo } from 'react'
import cn from 'classnames'
import { Card, Image } from 'antd'
import styles from './SliderItem.module.scss'

type Props = {
    src: string
    name: string
    location: string
}

const SliderItem: FC<Props> = ({ src, name, location }) => (
    <Card bodyStyle={{ padding: '0 0 0 23px' }} bordered={false}>
        <h2 className={cn(styles.badge)}>
            <span className='name-gv'>{name}</span>
            <strong>
                <i className='fa fa-fw fa-star' />
                {location}
            </strong>
        </h2>
        <Image
            src={src}
            style={{
                borderRadius: '10px',
                height: '275px',
                width: '225px'
            }}
            alt={`${name} - ${location}`}
            preview={false}
        />
    </Card>
)

export default memo(SliderItem)
