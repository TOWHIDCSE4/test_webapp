/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { getCookie } from 'helpers/cookie'
import { io } from 'socket.io-client'
import * as SOCKET_EVENT from '../const/socket-events'
import * as store from '../helpers/storage'

const SOCKET_API = process.env.NEXT_PUBLIC_SOCKET_API

let socket = null

export const subscribeNotificationChanges = ({ user_id, onUpdateChanges }) => {
    const userId = user_id || store.get('user')?.id
    if (socket) {
        unSubscribeNotificationChanges({ user_id: userId })
        socket.on(SOCKET_EVENT.NEW_NOTIFICATION_EVENT, onUpdateChanges)
        socket.emit(SOCKET_EVENT.SUBSCRIBE_NOTIFICATION_EVENT, userId)
    } else {
        retry(subscribeNotificationChanges, {
            user_id: userId,
            onUpdateChanges
        })
    }
}

export const unSubscribeNotificationChanges = ({ user_id }) => {
    const userId = user_id || store.get('user')?.id
    if (socket) {
        socket.off(SOCKET_EVENT.NEW_NOTIFICATION_EVENT)
        socket.emit(SOCKET_EVENT.SUBSCRIBE_NOTIFICATION_EVENT, userId)
    }
}

export const subscribeBookingChanges = ({ booking_id, onEndClass }) => {
    if (socket) {
        socket.emit(SOCKET_EVENT.SUBSCRIBE_BOOKING_CHANGES_EVENT, booking_id)
        socket.on(SOCKET_EVENT.BOOKING_END_CLASS_EVENT, onEndClass)
    } else {
        retry(subscribeBookingChanges, { booking_id, onEndClass })
    }
}

export const unsubscribeBookingChanges = ({ booking_id }) => {
    if (socket) {
        socket.emit(SOCKET_EVENT.UN_SUBSCRIBE_BOOKING_CHANGES_EVENT, booking_id)
        socket.off(SOCKET_EVENT.BOOKING_END_CLASS_EVENT)
    }
}

export const connect = (successCallback) => {
    if (socket) {
        return
    }
    const serverUrl: any = SOCKET_API
    const access_token = getCookie('token')
    const query: any = { access_token }
    const _socket = io(serverUrl, {
        query
        // withCredentials: true
    })

    _socket.on('connect', () => {
        socket = _socket
        if (successCallback) successCallback()
    })
}

export const disconnect = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}

const retry = (func, params) => {
    const onConnected = () => {
        func(params)
    }

    connect(onConnected)
    // setTimeout(func, 1000, params);
}

export default socket
