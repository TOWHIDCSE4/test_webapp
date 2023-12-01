import https from 'https'
import axios, { AxiosResponse, AxiosError } from 'axios'
import * as store from 'helpers/storage'
import { EMAIL_NOT_VERIFY_CODE, ERROR_REPORT_TYPES, ROUTE_ALIAS } from 'const'
import _ from 'lodash'
import { setCookie, removeCookie, getCookie } from 'helpers/cookie'
import handleNotifyError from '../components/Atoms/notificationError'

const queryString = require('query-string')

axios.defaults.headers.common.Accept = 'application/json'

const getApiRoot = (route) => {
    let API_ROOT = ''
    _.forIn(ROUTE_ALIAS, function (value, key) {
        if (route.indexOf(key) !== -1) API_ROOT = value
    })
    return API_ROOT
}

const agent = new https.Agent({
    rejectUnauthorized: false
})

export default class ApiSender {
    protected static handleResponse(res: AxiosResponse): any {
        if (res.status === 200 && res.data.code === '10000')
            return res.data.data
        throw new Error(res.data.message)
    }

    protected static handleError(error: AxiosError): any {
        const server_current: any = process.env.NEXT_PUBLIC_SERVER
        if (error.response && error.response.data) {
            if (error.response.status === 401) {
                localStorage.clear()
                removeCookie('token')
                location.href = '/login'
                return
            }
            if (error.response.data.code === EMAIL_NOT_VERIFY_CODE) {
                return error.response.data
            }
            // if (
            //     error.response.status >= 500 &&
            //     server_current === 'production'
            // ) {
            //     handleNotifyError.getInfoErrorPushNotifyChatwork(
            //         error,
            //         ERROR_REPORT_TYPES.SERVER
            //     )
            // }
            throw new Error(
                error?.response?.data?.message || 'Something went wrong'
            )
        } else {
            // if (server_current === 'production') {
            //     handleNotifyError.getInfoErrorPushNotifyChatwork(
            //         error,
            //         ERROR_REPORT_TYPES.NETWORK
            //     )
            // }
            throw new Error(error.message)
        }
    }

    public static async get(url: string, params = {}): Promise<any> {
        const API_ROOT = getApiRoot(url)
        axios.defaults.baseURL = API_ROOT
        const AUTH_TOKEN = getCookie('token')
        axios.defaults.headers.common.authorization = AUTH_TOKEN
        const LOCALE = getCookie('locale')
        if (LOCALE) axios.defaults.headers.common['Accept-Language'] = LOCALE
        return axios
            .get(url, {
                params,
                paramsSerializer(_params) {
                    return queryString.stringify(_params, {
                        skipNull: true,
                        skipEmptyString: true
                    })
                },
                httpsAgent: agent
            })
            .then(this.handleResponse)
            .catch(this.handleError)
    }

    public static post(url: string, data = {}) {
        const API_ROOT = getApiRoot(url)
        axios.defaults.baseURL = API_ROOT
        const AUTH_TOKEN = getCookie('token')
        axios.defaults.headers.common.authorization = AUTH_TOKEN
        const LOCALE = getCookie('locale')
        if (LOCALE) axios.defaults.headers.common['Accept-Language'] = LOCALE
        return axios
            .post(url, data, { httpsAgent: agent })
            .then(this.handleResponse)
            .catch(this.handleError)
    }

    public static put(url: string, data = {}) {
        const API_ROOT = getApiRoot(url)
        axios.defaults.baseURL = API_ROOT
        const AUTH_TOKEN = getCookie('token')
        axios.defaults.headers.common.authorization = AUTH_TOKEN
        const LOCALE = getCookie('locale')
        if (LOCALE) axios.defaults.headers.common['Accept-Language'] = LOCALE
        return axios
            .put(url, data, { httpsAgent: agent })
            .then(this.handleResponse)
            .catch(this.handleError)
    }

    public static patch(url: string, data = {}) {
        const API_ROOT = getApiRoot(url)
        axios.defaults.baseURL = API_ROOT
        const AUTH_TOKEN = getCookie('token')
        axios.defaults.headers.common.authorization = AUTH_TOKEN
        const LOCALE = getCookie('locale')
        if (LOCALE) axios.defaults.headers.common['Accept-Language'] = LOCALE
        return axios
            .patch(url, data, { httpsAgent: agent })
            .then(this.handleResponse)
            .catch(this.handleError)
    }

    public static delete(url: string) {
        const API_ROOT = getApiRoot(url)
        axios.defaults.baseURL = API_ROOT
        const AUTH_TOKEN = getCookie('token')
        axios.defaults.headers.common.authorization = AUTH_TOKEN
        const LOCALE = getCookie('locale')
        if (LOCALE) axios.defaults.headers.common['Accept-Language'] = LOCALE
        return axios
            .delete(url, { httpsAgent: agent })
            .then(this.handleResponse)
            .catch(this.handleError)
    }
}
