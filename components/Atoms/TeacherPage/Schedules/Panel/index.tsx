import React, { memo, FC } from 'react'
import cn from 'classnames'

import styles from './Panel.module.scss'

type Props = {
    children: any
    isOpen: boolean
}

const Panel: FC<Props> = (props) => {
    const { children, isOpen } = props
    return (
        <div className={cn(styles.panel)}>
            <div
                style={{ maxHeight: `${isOpen === true ? '1500px' : '0px'}` }}
                className={cn(styles.content)}
            >
                {children}
            </div>
        </div>
    )
}

export default memo(Panel)
