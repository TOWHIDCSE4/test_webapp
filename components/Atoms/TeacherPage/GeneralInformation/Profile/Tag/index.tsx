import React from 'react'
import cn from 'classnames'
import styles from './Tag.module.scss'

const Tag = ({ content, isActive }) => (
    <div
        className={`${cn(styles.tag)} ${
            isActive ? cn(styles.active) : cn(styles.inactive)
        }`}
    >
        {content}
    </div>
)

export default Tag
