/* eslint-disable @typescript-eslint/no-use-before-define */
import cookie from 'js-cookie'
import Router from 'next/router'

// set in cookie
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1
        })
    }
}

// remove from cookie
export const removeCookie = (key) => {
    if (process.browser) {
        cookie.remove(key)
    }
}

// get from cookie such as stored token
// will be useful when we need to make request to server with auth token
export const getCookie = (key, req?) =>
    // if (process.browser) {
    //     return cookie.get(key);
    // }
    getCookieFromBrowser(key)

export const getCookieFromBrowser = (key) => cookie.get(key)

export const getCookieFromServer = (key, req) => {
    if (!req.headers?.cookie) {
        return undefined
    }
    const token = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith(`${key}=`))
    if (!token) {
        return undefined
    }
    const tokenValue = token.split('=')[1]
    return tokenValue
}
