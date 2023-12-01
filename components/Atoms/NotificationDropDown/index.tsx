/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { INotification } from 'types'
import cn from 'classnames'
import { Badge, Spin } from 'antd'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { getTranslateText } from 'utils/translate-utils'
import moment from 'moment'
import _ from 'lodash'
import useOutside from 'hooks/useOutside'
import { FULL_DATE_FORMAT } from 'const'
import { sanitize } from 'utils/string-utils'
import { sanitizeMessage } from 'utils/notification'
import styles from './NotificationDropDown.module.scss'

const DynamicJqueryDiamonds = dynamic(() => import('jquery'), {
    ssr: false
})

declare global {
    interface Window {
        jQuery: any
    }
}

type Props = {
    data: INotification[]
    unseen: number
    loadMore: () => void
    loading: boolean
    onMarkNotificationAsSeen: () => void
}

const NotificationDropDown: FC<Props> = ({
    data,
    unseen,
    loadMore,
    loading,
    onMarkNotificationAsSeen
}) => {
    const wrapperRef = useRef(null)
    const wrapperLoadMoreRef = useRef(null)

    const fetchMoreListItems = () => {
        loadMore()
        setTimeout(() => {
            setIsFetching(false)
        }, 500)
    }
    const [isFetching, setIsFetching] = useInfiniteScroll(
        wrapperLoadMoreRef,
        fetchMoreListItems
    )
    const [visibleDropDown, setVisible] = useState(false)

    const toggleVisible = (val) => {
        setVisible(val)
        if (!val) {
            onMarkNotificationAsSeen()
        }
    }

    const handleClickOutSide = useCallback(() => {
        const listCn = window.jQuery('#dropdown-noti').attr('class')
        if (listCn.includes('slideUp2 show')) {
            toggleVisible(false)
        }
    }, [toggleVisible])
    useOutside(wrapperRef, handleClickOutSide)

    useEffect(() => {
        window.jQuery = require('jquery')

        window.jQuery('.slimScrollBar,.slimScrollRail').remove()
        window.jQuery('.slimScrollDiv').contents().unwrap()
    }, [visibleDropDown])

    const renderContent = () => (
        <ul
            className={cn('dropdown-menu', visibleDropDown && 'slideUp2 show')}
            style={{ top: 0, margin: 0 }}
            id='dropdown-noti'
        >
            <li className='header'>{getTranslateText('notifications')}</li>
            <ul
                className={cn(styles.dropdownNoti)}
                ref={wrapperLoadMoreRef}
                style={{
                    margin: 0,
                    padding: 0
                }}
            >
                <li>
                    <ul className='menu list-unstyled'>
                        {!_.isEmpty(data) ? (
                            data.map((notification, index) => (
                                <li key={notification._id}>
                                    <a>
                                        <div
                                            className={cn(
                                                'menu-info',
                                                !notification?.seen
                                                    ? styles[
                                                          'notification-item--new'
                                                      ]
                                                    : styles[
                                                          'notification-item'
                                                      ]
                                            )}
                                        >
                                            <h4>
                                                <span
                                                    // eslint-disable-next-line react/no-danger
                                                    dangerouslySetInnerHTML={{
                                                        __html: sanitizeMessage(
                                                            notification
                                                        )
                                                    }}
                                                />
                                            </h4>
                                            <p
                                                title={moment(
                                                    notification.created_time
                                                ).format(FULL_DATE_FORMAT)}
                                                style={{ cursor: 'default' }}
                                            >
                                                {notification.created_time &&
                                                    moment(
                                                        notification.created_time
                                                    ).fromNow()}
                                            </p>
                                        </div>
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li>
                                <a>
                                    <div className='menu-info'>
                                        <h4>
                                            {getTranslateText(
                                                'no_notifications_to_show'
                                            )}
                                        </h4>
                                    </div>
                                </a>
                            </li>
                        )}
                    </ul>
                    <div className='d-flex justify-content-center'>
                        {loading && <Spin spinning={loading} />}
                    </div>
                </li>
            </ul>
            <li className='footer'>
                <Link href='/student/notice'>
                    <a title={getTranslateText('view_all')}>
                        {getTranslateText('view_all')}
                    </a>
                </Link>
            </li>
        </ul>
    )
    return (
        <li className='dropdown' ref={wrapperRef}>
            <a
                className='dropdown-toggle'
                title='Notifications'
                onClick={() => toggleVisible(!visibleDropDown)}
            >
                <i className='zmdi zmdi-notifications' />
                <div className='notify'>
                    {unseen > 0 && (
                        <Badge
                            className='badge-noti'
                            size='small'
                            offset={[11, -43]}
                            count={unseen}
                        />
                    )}
                </div>
            </a>
            {renderContent()}
        </li>
    )
}

export default memo(NotificationDropDown)
