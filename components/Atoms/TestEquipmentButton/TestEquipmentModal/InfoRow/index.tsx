/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/alt-text */
import React, { FC } from 'react'
import cn from 'classnames'

import styles from './index.module.scss'

type Props = {
    icon?: any
    title: string
    success?: any
    content?: any
    center?: any
}

const InfoRow: FC<Props> = ({ icon, title, success, content, center }) => (
    <>
        <div className={styles['info-row']}>
            <div className={styles.icon}>
                {success ? (
                    <>{icon ?? <img src='/assets/icons/icon-ok.svg' />}</>
                ) : (
                    <>{icon ?? <img src='/assets/icons/icon-warning.svg' />}</>
                )}
            </div>
            <div
                className={cn(
                    styles['body-content'],
                    success ? styles[success] : ''
                )}
            >
                <div className={styles.title}>
                    {title && (
                        <label className='font-weight-bold'>{title}</label>
                    )}
                </div>
                <div className={center && 'text-center'}>{content}</div>
            </div>
        </div>
    </>
)

export default InfoRow
