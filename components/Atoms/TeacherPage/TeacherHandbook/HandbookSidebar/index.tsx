import React, { FC } from 'react'
import { Menu } from 'antd'
import styles from '../Handbook.module.scss'

interface ISideBar {
    sideBarItems: {
        elementId: number | string
        title: string
    }[]
}

const SideBar: FC<ISideBar> = ({ sideBarItems }) => (
    <Menu className={styles.sidebar}>
        {sideBarItems.map((item, index) => (
            <Menu.Item
                key={item.elementId}
                style={{
                    whiteSpace: 'normal',
                    height: 'auto',
                    lineHeight: '32px'
                }}
            >
                <a href={`#${item.elementId}`}>{`${index + 1}. ${
                    item.title
                }`}</a>
            </Menu.Item>
        ))}
    </Menu>
)

export default SideBar
