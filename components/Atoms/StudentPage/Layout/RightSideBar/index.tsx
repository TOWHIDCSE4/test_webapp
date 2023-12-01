/* eslint-disable react/no-danger */
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from 'contexts/Auth'
import Link from 'next/link'
import {
    connect,
    subscribeNotificationChanges,
    unSubscribeNotificationChanges
} from 'socket'
import NotificationAPI from 'api/NotificationAPI'
import { notify } from 'contexts/Notification'
import moment from 'moment'
import { FULL_DATE_FORMAT, PAGE_SIZE } from 'const'
import NotificationDropDown from 'components/Atoms/NotificationDropDown'
import { sanitize } from 'utils/string-utils'
import _ from 'lodash'
import WalletAPI from 'api/WalletAPI'
import { toReadablePrice } from 'utils/price-utils'
import { getTranslateText } from 'utils/translate-utils'
import { sanitizeMessage } from 'utils/notification'
import TemplateAPI from 'api/TemplateAPI'
import SelectLanguage from '../../SelectLanguage'

const RightSideBar = () => {
    const { user, logout, logoutHomePage } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [unseenNoti, setUnseen] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const [total, setTotal] = useState(0)
    const [balance, setBalance] = useState(0)
    const [templateObj, setTemplateObj] = useState(null)

    const fetchBalance = useCallback(async () => {
        WalletAPI.getBalance()
            .then((res) => {
                setBalance(res.balance)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }, [balance])

    const getNotifications = async (query: {
        page_size: number
        page_number: number
        type_data: String
        template_obj_id: any
    }) => {
        if (templateObj) {
            query.template_obj_id = templateObj
        } else {
            let templateObjIds = {}
            await TemplateAPI.getAllTemplateByStudent()
                .then((res) => {
                    templateObjIds = res
                })
                .catch((err) => {
                    notify('error', err.message)
                })
            setTemplateObj(templateObjIds)
            query.template_obj_id = templateObjIds ?? {}
        }
        let result = null
        await NotificationAPI.getNotifications(query)
            .then((res) => {
                result = res
            })
            .catch((err) => {
                notify('error', err.message)
            })
        if (result) {
            const newNotis = [...result?.data]
            const countUnSeen = newNotis.filter(
                (item: any) => !item.seen
            ).length
            setUnseen(countUnSeen)
            setNotifications(newNotis)
            if (result?.pagination && result?.pagination.total > 0) {
                setTotal(result.pagination.total)
            }
        }
    }

    const triggerCheckingIfUserCloseDropDown = useCallback(async () => {
        // await NotificationAPI.markNotificationsAsSeen()
        const newNoti = notifications.map((x) => {
            const tmp = {
                ...x,
                seen: true
            }
            return tmp
        })
        setNotifications(newNoti)
        getNotifications({
            page_number: 1,
            page_size: PAGE_SIZE,
            type_data: 'student',
            template_obj_id: {}
        })
        setPageNumber(1)
        setUnseen(0)
    }, [notifications])

    const handleLoadMore = useCallback(() => {
        const nextPage = pageNumber + 1
        if (nextPage * PAGE_SIZE < total) {
            getNotifications({
                page_number: nextPage,
                page_size: PAGE_SIZE,
                type_data: 'student',
                template_obj_id: {}
            })
            setPageNumber((prev) => prev + 1)
        }
    }, [pageNumber, total])

    useEffect(() => {
        fetchBalance()
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
                        setUnseen((prev) => prev + 1)
                        setNotifications((prevState) => [
                            newNotification,
                            ...prevState
                        ])
                    }
                }
            })
        })
        getNotifications({
            page_number: pageNumber,
            page_size: PAGE_SIZE,
            type_data: 'student',
            template_obj_id: {}
        })

        return () => {
            unSubscribeNotificationChanges({ user_id: user.id })
        }
    }, [])

    return (
        <div className='navbar-right'>
            <ul className='navbar-nav'>
                <SelectLanguage />
                <NotificationDropDown
                    data={notifications}
                    unseen={unseenNoti}
                    loadMore={handleLoadMore}
                    loading={false}
                    onMarkNotificationAsSeen={
                        triggerCheckingIfUserCloseDropDown
                    }
                />
                {/* <li>
                    <a
                        title={`${toReadablePrice(balance)} ${getTranslateText(
                            'point'
                        )}`}
                    >
                        <Link href='/student/wallet'>
                            <i className='zmdi zmdi-hc-fw'></i>
                        </Link>
                    </a>
                </li> */}
                <li>
                    <Link href='/student/profile'>
                        <a title='Profile'>
                            <i className='zmdi zmdi-hc-fw'></i>
                        </a>
                    </Link>
                </li>
                <li className='clickable' onClick={logoutHomePage}>
                    <a title='Logout'>
                        <i className='zmdi zmdi-power' />
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default RightSideBar
