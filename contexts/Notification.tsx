// contexts/auth.js

import React, { createContext, useContext } from 'react'
import { notification } from 'antd'
import _ from 'lodash'

const NotificationContext = createContext({})

export const NotificationProvider = ({ children }) => {
    const notify = (type, message) => {
        const _type = type
        if (_type === 'danger') type = 'error'
        return notification[type]({
            message: _.capitalize(type),
            description: message
        })
    }

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => useContext(NotificationContext)

export const notify = (type, message) =>
    notification[type]({
        message: _.capitalize(type),
        description: message
    })
