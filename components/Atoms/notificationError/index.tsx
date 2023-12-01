import axios, { AxiosResponse, AxiosError } from 'axios'
import { ERROR_REPORT_TYPES } from 'const'
import { setCookie, removeCookie, getCookie } from 'helpers/cookie'

export default class handleNotifyError {
    public static getInfoErrorPushNotifyChatwork(
        error: AxiosError,
        type: number
    ): any {
        try {
            let messageNotify = null
            const auth_token = getCookie('token')
            let messageError = null
            if (type === ERROR_REPORT_TYPES.SERVER) {
                messageError = `Message error:  ${JSON.stringify(
                    error?.response?.data?.message
                )}\n`
            } else if (type === ERROR_REPORT_TYPES.NETWORK) {
                messageError = `Message error:  ${error.message}\n`
            }
            if (auth_token !== undefined) {
                const token = error?.config?.headers?.authorization || null
                if (token) {
                    const base64Payload = token.split('.')[1]
                    const payloadBuffer = Buffer.from(base64Payload, 'base64')
                    const dataDecode = JSON.parse(payloadBuffer.toString())
                    if (type === ERROR_REPORT_TYPES.SERVER) {
                        messageNotify =
                            messageError +
                            JSON.stringify(error?.response) +
                            JSON.stringify(dataDecode)
                    } else if (type === ERROR_REPORT_TYPES.NETWORK) {
                        messageNotify =
                            messageError +
                            JSON.stringify(error.config) +
                            JSON.stringify(dataDecode)
                    }
                }
            } else if (!auth_token || auth_token === undefined) {
                if (type === ERROR_REPORT_TYPES.SERVER) {
                    messageNotify =
                        messageError + JSON.stringify(error?.response)
                } else if (type === ERROR_REPORT_TYPES.NETWORK) {
                    messageNotify = messageError + JSON.stringify(error?.config)
                }
            }
            if (messageNotify) {
                // this.errorPushNotifyChatwork(messageNotify)
            }
            // eslint-disable-next-line @typescript-eslint/no-shadow
        } catch (error: any) {
            console.log(error)
        }
    }

    // protected static async errorPushNotifyChatwork(
    //     messError: string
    // ): Promise<any> {
    //     const room_id = null
    //     const xhr = new XMLHttpRequest()
    //     const url = ''
    //     xhr.open('POST', url, true)
    //     xhr.setRequestHeader('Content-Type', 'application/json')
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === 4 && xhr.status === 200) {
    //             const res = this.responseText
    //         }
    //     }
    //     const data = JSON.stringify({ roomId: room_id, message: messError })
    //     xhr.send(data)
    // }
}
