import cn from 'classnames'
import styles from './ContainerWrap.module.scss'

export default function ContainerWrap({ children }) {
    return <div className={cn(styles.containerWrap)}>{children}</div>
}
