import cn from 'classnames'
import { FC } from 'react'

type Props = {
    className?: string
    style?: any
    onClick?: any
}

const PrevArrow: FC<Props> = ({ className, style, onClick }) => (
    <div
        className={cn(className, 'owl-prev')}
        style={{ ...style }}
        onClick={onClick}
    />
)

export default PrevArrow
