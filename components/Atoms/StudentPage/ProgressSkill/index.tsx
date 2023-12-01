import { FC, useEffect } from 'react'
import { Card, Progress } from 'antd'
import cn from 'classnames'
import styles from './ProgressSkill.module.scss'

type Props = {
    title: string
    percent: number
    color?: string
}

const ProgressSkill: FC<Props> = ({ title, percent, color }) => {
    useEffect(() => {}, [])

    return (
        <Card
            title={title}
            bordered={false}
            className={cn(styles['progress-skill'])}
        >
            <Progress percent={percent} strokeColor={color} />
        </Card>
    )
}

export default ProgressSkill
