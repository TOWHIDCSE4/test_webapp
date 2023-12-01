import React, { FC } from 'react'
import { map } from 'lodash'
import { Button } from 'antd'
import styles from '../Handbook.module.scss'

interface ISideBar {
    contentItems: {
        elementId: number | string
        title: string
        subItems: {
            title?: string
            content: string | Element
        }[]
    }[]
}

const Content: FC<ISideBar> = ({ contentItems }) => (
    <div className={styles.content}>
        {map(contentItems, (item, index: number) => (
            <div className={styles['content-box']} key={item.elementId}>
                <div className='box-index'>
                    {index + 1 >= 10 ? index + 1 : `0${index + 1}`}
                </div>
                <div className='box-title' id={item.elementId.toString()}>
                    {item.title}
                </div>
                {item.subItems?.map((subItem) => (
                    <>
                        {subItem.title && (
                            <Button
                                type='primary'
                                style={{ cursor: 'auto' }}
                                className='sub-item__title'
                            >
                                {subItem.title}
                            </Button>
                        )}
                        {subItem.content && (
                            <div className='sub-item__box'>
                                {subItem.content}
                            </div>
                        )}
                    </>
                ))}
            </div>
        ))}
    </div>
)

export default Content
