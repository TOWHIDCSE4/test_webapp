import React from 'react'
import cn from 'classnames'
import { Image } from 'antd'
import styles from '../Handbook.module.scss'

const Header = () => (
    <div className={cn('flex-between', styles.header)}>
        <Image src='/assets/images/homepage/logo.png' preview={false} />
        <div className={styles['header-text']}>
            ISPEAK TEACHER INFORMATION PORTAL
        </div>
    </div>
)

export default Header
