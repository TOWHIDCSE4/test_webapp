import cn from 'classnames'
import { FC } from 'react'

type Props = {
    className?: string
    style?: any
    onClick?: any
}

const NextArrow: FC<Props> = ({ className, style, onClick }) => (
    <div
        className={cn(className, 'owl-next')}
        style={{ ...style }}
        onClick={onClick}
    />
)

export default NextArrow
