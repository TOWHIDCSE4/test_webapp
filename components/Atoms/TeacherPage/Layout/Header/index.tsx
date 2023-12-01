/* eslint-disable react/no-danger */
import React, { useState, FC, useRef, useEffect } from 'react'
import { Image, Avatar, Menu, Drawer, Dropdown } from 'antd'
import cn from 'classnames'
import ContainerWrap from 'components/Atoms/TeacherPage/ContainerWrap'
import SelectLanguage from 'components/Atoms/SelectLanguage'
import { DEFAULT_AVATAR } from 'const/common'
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuth } from 'contexts/Auth'
import { getTranslateText } from 'utils/translate-utils'
import { notify } from 'contexts/Notification'
import NotificationAPI from 'api/NotificationAPI'
import {
    connect,
    subscribeNotificationChanges,
    unSubscribeNotificationChanges
} from 'socket'
import UserAPI from 'api/UserAPI'
import { IUser } from 'types'
import { toReadablePrice } from 'utils/price-utils'
import { FULL_DATE_FORMAT } from 'const'
import moment from 'moment'
import { sanitize } from 'utils/string-utils'
import _ from 'lodash'
import styles from './Header.module.scss'
import { sanitizeMessage } from 'utils/notification'

type Props = {
    openMenuMobile: () => void
}

const Header: FC<Props> = (props) => {
    const { openMenuMobile } = props
    const { logout, user, newNotificationCount, setNewNotificationCount } =
        useAuth()
    const [visible, setVisible] = useState(false)
    const [teacher, setTeacher] = useState<IUser>()
    const [openMenu, setOpenMenu] = useState({
        height: '0px',
        padding: '0'
    })
    const [openNoti, setOpenNoti] = useState({
        maxHeight: '0px'
    })
    const [notifications, setNotifications] = useState([])
    const [total, setTotal] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const newNotificationCountRef = useRef(0)

    useEffect(() => {
        newNotificationCountRef.current = newNotificationCount
    }, [newNotificationCount])

    const getNotifications = async (query: {
        page_size: number
        page_number: number
        seen?: boolean
    }) => {
        const result = await NotificationAPI.getNotifications(query)
        setNotifications(result.data)
        setTotal(result.pagination.total)
        setNewNotificationCount(
            (result.data || []).filter((notification) => !notification.seen)
                .length
        )
    }

    const getTeacherFullInfo = () => {
        UserAPI.getFullInfoByTeacher()
            .then((res) => {
                setTeacher(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    useEffect(() => {
        getTeacherFullInfo()
        getNotifications({
            page_size: pageSize,
            page_number: pageNumber
        })
    }, [])
    useEffect(() => {
        connect(() => {
            subscribeNotificationChanges({
                user_id: user.id,
                onUpdateChanges: (data) => {
                    const newNotification = data
                    if (newNotification) {
                        notify(
                            'info',
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeMessage(newNotification)
                                }}
                            />
                        )
                        setNewNotificationCount(
                            newNotificationCountRef.current + 1
                        )
                        setNotifications((prevState) => [
                            newNotification,
                            ...prevState
                        ])
                    }
                }
            })
        })
        return () => {
            unSubscribeNotificationChanges({ user_id: user.id })
        }
    }, [])

    const OpenMenu = () => {
        if (openMenu.height === '0px') {
            setOpenMenu({
                height: '250px',
                padding: '25px 0'
            })
            setOpenNoti({
                maxHeight: '0px'
            })
        } else {
            setOpenMenu({
                height: '0px',
                padding: '0'
            })
        }
    }
    const OpenNoti = async () => {
        // Open
        if (openNoti.maxHeight === '0px') {
            setOpenNoti({
                maxHeight: '500px'
            })
            setOpenMenu({
                height: '0px',
                padding: '0'
            })
        }
        // Close
        else {
            setOpenNoti({
                maxHeight: '0px'
            })
            await NotificationAPI.markNotificationsAsSeen()
            await getNotifications({
                page_size: pageSize,
                page_number: pageNumber
            })
        }
    }

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const renderSubMenu = () => (
        <Menu>
            <Menu.Item key='1' icon={<LogoutOutlined />} onClick={logout}>
                {getTranslateText('logout')}
            </Menu.Item>
        </Menu>
    )

    return (
        <header className={cn(styles.header)}>
            <ContainerWrap>
                <div className={cn(styles.wrapHeader)}>
                    <div className={cn(styles.leftHeader)}>
                        <a style={{ marginRight: '15px' }} href='/'>
                            <Image
                                style={{ width: '150px' }}
                                src='/assets/images/logo_ispeak.png'
                                alt='Logo Ispeak.vn'
                                preview={false}
                            />
                        </a>
                        <div className='site-drawer-render-in-current-wrapper'>
                            <MenuOutlined
                                className={cn(styles.menuIcon)}
                                onClick={showDrawer}
                            />
                            <Drawer
                                style={{
                                    position: 'absolute'
                                }}
                                title='Menu Bar'
                                placement='left'
                                onClose={onClose}
                                visible={visible}
                            />
                        </div>
                    </div>

                    <div
                        onClick={openMenuMobile}
                        className={cn(styles.avatarMobile)}
                    >
                        <Avatar
                            src={user?.avatar || DEFAULT_AVATAR}
                            alt='Account Image'
                        />
                    </div>

                    <div className={cn(styles.rightHeader)}>
                        <div className={cn(styles.myAccount)}>
                            <Dropdown
                                overlay={renderSubMenu()}
                                placement='bottomLeft'
                                trigger={['click']}
                            >
                                <div className={cn(styles.inforAccount)}>
                                    <Avatar
                                        size={35}
                                        src={user?.avatar || DEFAULT_AVATAR}
                                        icon={
                                            <Image
                                                src={DEFAULT_AVATAR}
                                                fallback={DEFAULT_AVATAR}
                                                alt='Account Image'
                                                style={{
                                                    height: '35px'
                                                }}
                                                preview={false}
                                            />
                                        }
                                        alt='Account Image'
                                    />
                                    <div className={cn(styles.desc)}>
                                        <h4 className={cn(styles.name)}>
                                            {user && `${user.full_name}`}
                                        </h4>
                                        <p className={cn(styles.level)}>
                                            <span>
                                                {getTranslateText(
                                                    'teacher.summary.hourly_rate'
                                                )}
                                                :{' '}
                                                {toReadablePrice(
                                                    teacher?.hourly_rate || 0
                                                )}{' '}
                                                {teacher?.location?.currency}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Dropdown>
                        </div>
                        <div
                            className={cn(styles.notification)}
                            onClick={OpenNoti}
                        >
                            <div className={cn(styles.notiIcon)}>
                                <Image
                                    src='/static/img/teacher/header/icon-1.png'
                                    preview={false}
                                />
                                {newNotificationCount > 0 && (
                                    <span className={cn(styles.number)}>
                                        {newNotificationCount}
                                    </span>
                                )}
                            </div>
                            <div
                                style={openNoti}
                                className={cn(styles.menuNoti)}
                            >
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            className={cn(
                                                styles.itemMenuNoti,
                                                !notification.seen
                                                    ? styles[
                                                          'notification-item--new'
                                                      ]
                                                    : ''
                                            )}
                                            key={notification._id}
                                        >
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitize(
                                                        _.template(
                                                            notification.message
                                                        )({
                                                            ...notification.extra_info,
                                                            start_time:
                                                                notification
                                                                    ?.extra_info
                                                                    ?.start_time
                                                                    ? moment(
                                                                          notification
                                                                              ?.extra_info
                                                                              ?.start_time
                                                                      ).format(
                                                                          FULL_DATE_FORMAT
                                                                      )
                                                                    : '',
                                                            regular_start_time:
                                                                notification
                                                                    ?.extra_info
                                                                    ?.regular_start_time
                                                                    ? moment(
                                                                          notification
                                                                              ?.extra_info
                                                                              ?.regular_start_time
                                                                      ).format(
                                                                          'dddd HH:mm'
                                                                      )
                                                                    : ''
                                                        })
                                                    )
                                                }}
                                            />
                                            <div
                                                className={cn(styles.pulation)}
                                            >
                                                <span
                                                    title={moment(
                                                        notification.created_time
                                                    ).format(FULL_DATE_FORMAT)}
                                                    style={{
                                                        cursor: 'default'
                                                    }}
                                                >
                                                    {moment(
                                                        notification.created_time
                                                    ).fromNow()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={cn(styles.itemMenuNoti)}>
                                        <p>
                                            {getTranslateText(
                                                'no_notifications_to_show'
                                            )}
                                        </p>
                                    </div>
                                )}
                                {/* <div className={cn(styles.itemMenuNoti)}>
                                    <a href='#'>Xóa Tất Cả</a>
                                </div> */}
                            </div>
                        </div>
                        <ul className='navbar-nav ml-3'>
                            <SelectLanguage />
                        </ul>
                    </div>
                </div>
            </ContainerWrap>
        </header>
    )
}

export default Header
