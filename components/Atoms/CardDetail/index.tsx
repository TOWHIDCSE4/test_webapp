import cn from 'classnames'
import styles from './CardDetail.module.scss'

export default function CardDetail({ children }) {
    return <div className={cn(styles.baseCard_detail)}>{children}</div>
}
