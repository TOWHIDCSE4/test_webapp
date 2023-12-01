import React from 'react'
import cn from 'classnames'
import styles from './Panel.module.scss'

export default function Index(props) {
    const { children, isOpen } = props
    return (
        <div className={cn(styles.panel)}>
            <div
                style={{ maxHeight: `${isOpen === 'true' ? '2000px' : '0px'}` }}
                className={cn(styles.content)}
            >
                {children}
            </div>
        </div>
    )
}
