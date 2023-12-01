import UtilsAPI from 'api/UtilsAPI'
import { notify } from 'contexts/Notification'
import moment from 'moment'
import React, { FC, useEffect, useState } from 'react'

interface Props {
    deadline: any
    onFinishCountDown: () => void
}
let idInterval: any = 0
let idIntervalReGetTimeServer: any = 0

const CountdownCustom: FC<Props> = (props) => {
    const { deadline, onFinishCountDown } = props
    const [days, setDays] = useState('00')
    const [hours, setHours] = useState('00')
    const [minutes, setMinutes] = useState('00')
    const [seconds, setSeconds] = useState('00')
    const [timestampNow, setTimestampNow] = useState<number>(null)

    const getServerTime = () => {
        const timeStartRequest = moment().valueOf()
        UtilsAPI.getServerTime()
            .then((res) => {
                const timeEndResponse = moment().valueOf()
                const timeDelay = timeEndResponse - timeStartRequest
                setTimestampNow(res + timeDelay)
            })
            .catch((err) => {
                notify('error', err.message)
                setTimestampNow(null)
            })
    }

    const prettifyTime = (time: any, type: any) => {
        if (time >= 0) {
            if (time < 10) {
                time = `0${time}`
            }
            // eslint-disable-next-line default-case
            switch (type) {
                case 'days':
                    setDays(time)
                    break
                case 'hours':
                    setHours(time)
                    break
                case 'minutes':
                    setMinutes(time)
                    break
                case 'seconds':
                    setSeconds(time)
                    break
            }
        }
    }
    useEffect(() => {
        getServerTime()
        idIntervalReGetTimeServer = setInterval(() => {
            getServerTime()
        }, 60e3) // 60s thì update time server 1 lần
        return () => {
            clearInterval(idIntervalReGetTimeServer)
        }
    }, [])

    useEffect(() => {
        if (!timestampNow) {
            return
        }
        idInterval = setInterval(
            (oldTime: number) => {
                const diffTime = moment().valueOf() - oldTime
                const newTimestamp = timestampNow + diffTime
                setTimestampNow(newTimestamp)
            },
            1000,
            moment().valueOf()
        )
        return () => {
            clearInterval(idInterval)
            // idInterval = null
        }
    }, [setTimestampNow, timestampNow])

    useEffect(() => {
        if (deadline && timestampNow && deadline > timestampNow) {
            const interval = setInterval(() => {
                const difference = deadline - timestampNow
                const d = Math.floor(difference / (1000 * 60 * 60 * 24))
                prettifyTime(d, 'days')

                const h = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                )
                prettifyTime(h, 'hours')

                const m = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                )
                prettifyTime(m, 'minutes')

                const s = Math.floor((difference % (1000 * 60)) / 1000)
                prettifyTime(s, 'seconds')

                if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
                    onFinishCountDown()
                }
            }, 1000) // 1s thì update countdown 1 lần
            return () => {
                clearInterval(interval)
            }
        }
    }, [timestampNow])

    return (
        <div>
            {parseInt(days as string, 10) > 0 ? (
                <>
                    <div className='timer-wrapper'>
                        <span className='time'>
                            {days}-{hours}:{minutes}:{seconds}
                        </span>
                    </div>
                </>
            ) : (
                <>
                    <div className='timer-wrapper'>
                        <span className='time'>
                            {hours}:{minutes}:{seconds}
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}

export default CountdownCustom
