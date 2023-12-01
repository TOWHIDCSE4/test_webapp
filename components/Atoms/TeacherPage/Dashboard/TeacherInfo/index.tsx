import React, { useCallback, useEffect, useReducer, useState } from 'react'
import _ from 'lodash'
import cn from 'classnames'
import { Progress, Avatar, Button, Image, Row, Col, Badge, Rate } from 'antd'
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import ReactTooltip from 'react-tooltip'
import Panel from 'components/Atoms/TeacherPage/Panel'
import { useAuth } from 'contexts/Auth'
import Link from 'next/link'
import { getTranslateText } from 'utils/translate-utils'
import moment from 'moment'
import { DEFAULT_AVATAR } from 'const'
import { ITeacher } from 'types'
import UserAPI from 'api/UserAPI'
import { notify } from 'contexts/Notification'
import { toReadablePrice } from 'utils/price-utils'
import UtilsAPI from 'api/UtilsAPI'
import TeachingScheduleList from './TeachingScheduleList'
import styles from './index.module.scss'

let idInterval: any = 0
let idIntervalReGetTimeServer: any = 0

const NumberClock = (props) => {
    if (!props.timestamp) {
        return null
    }
    const currentMoment = moment(props.timestamp)
    return (
        <p>
            {currentMoment.date() < 10
                ? `0${currentMoment.date()}`
                : currentMoment.date()}{' '}
            /{' '}
            {currentMoment.month() + 1 < 10
                ? `0${currentMoment.month() + 1}`
                : currentMoment.month() + 1}{' '}
            / {currentMoment.year()} {currentMoment.format('HH:mm:ss')}
        </p>
    )
}

const TeacherInfo = () => {
    const { user } = useAuth()

    const [keyPane, setKeyPane] = useState('info')
    const [teacher, setTeacher] = useState<ITeacher>()
    const [timezone, setTimezone] = useState<string>('')
    const [timestampNow, setTimestampNow] = useState<number>(null)

    const [counter, setCounter] = useReducer(
        (prev, newState) => ({ ...prev, ...newState }),
        {
            schedules: 0,
            memo: 0
        }
    )

    useEffect(() => {
        const tmp = window.localStorage.getItem('timezone')
        if (tmp) {
            setTimezone(tmp)
        }
    }, [])

    const onChangeCounter = useCallback(
        (val) => {
            setCounter(val)
        },
        [counter]
    )
    const getTeacherFullInfo = () => {
        UserAPI.getFullInfoByTeacher()
            .then((res) => {
                setTeacher(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

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

    useEffect(() => {
        getTeacherFullInfo()
    }, [])

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
            idInterval = null
        }
    }, [setTimestampNow, timestampNow])

    const getWelcomeText = () => {
        const currentHour = moment(timestampNow).hour()
        if (currentHour >= 18) return getTranslateText('good_evening')
        if (currentHour >= 12) return getTranslateText('good_afternoon')
        return getTranslateText('good_morning')
    }

    return (
        <>
            <div className={`${cn(styles.infoUserDashboard)} mb-4`}>
                <Row className='align-items-center'>
                    <Col
                        xl={8}
                        lg={8}
                        md={10}
                        xs={22}
                        className='mt-3 mb-3 mr-1 ml-1'
                        style={{ position: 'relative' }}
                    >
                        <div className={cn(styles.progressAndAvata)}>
                            <ReactTooltip
                                className={cn(styles.tooltip)}
                                id='Hourly'
                                place='right'
                                type='success'
                            />
                            <Progress
                                data-for='Hourly'
                                data-tip={`${getTranslateText(
                                    'teacher.summary.hourly_rate'
                                )}: ${toReadablePrice(
                                    teacher?.hourly_rate || 0
                                )} ${teacher?.location?.currency}`}
                                type='circle'
                                width={180}
                                percent={30}
                                success={{ percent: 30 }}
                                showInfo={false}
                            />
                            <div className={cn(styles.avartaUser)}>
                                <Avatar
                                    size={160}
                                    src={user?.avatar || DEFAULT_AVATAR}
                                    icon={
                                        <Image
                                            src={DEFAULT_AVATAR}
                                            alt='Avatar user'
                                            fallback={DEFAULT_AVATAR}
                                            style={{
                                                height: '160px'
                                            }}
                                            preview={false}
                                        />
                                    }
                                    alt='Avatar user'
                                />
                            </div>
                        </div>
                        <div className={cn(styles.ratingStartGroup)}>
                            <Rate value={teacher?.average_rating} disabled />
                            <p>
                                {teacher?.average_rating &&
                                    _.round(teacher?.average_rating, 2)}{' '}
                                {getTranslateText('teacher.info.rate')}
                            </p>
                        </div>
                        {/* <div className={cn(styles.countReview)}>
                                <span>
                                    47{' '}
                                    {getTranslateText(
                                        'teacher.dashboard.reviews'
                                    )}
                                </span>
                            </div> */}
                        <div className={cn(styles.socialNetwork)}>
                            <div className={cn(styles.facebook)}>
                                <a>
                                    <Image
                                        src='/static/img/teacher/dashboard/facebook.svg'
                                        width={28}
                                        alt='Facebook'
                                        preview={false}
                                    />
                                </a>
                            </div>
                            <div className={cn(styles.gmail)}>
                                <a>
                                    <Image
                                        src='/static/img/teacher/dashboard/google.svg'
                                        width={28}
                                        alt='Google'
                                        preview={false}
                                    />
                                </a>
                            </div>
                        </div>
                    </Col>

                    <Col xl={8} lg={15} md={12} xs={22} className='mr-1 ml-1'>
                        <div className={cn(styles.infoUserMid)}>
                            <div className={cn(styles.name)}>
                                {getWelcomeText()} {user && `${user.full_name}`}
                            </div>
                            <div className={cn(styles.level)}>
                                {teacher?.level?.name}
                            </div>
                            {user &&
                                (!user.gender ||
                                    !user.date_of_birth ||
                                    !user.skype_account) && (
                                    <div className='text-warning'>
                                        <span>
                                            {getTranslateText(
                                                'teacher.dashboard.label.fill_more_info'
                                            )}{' '}
                                        </span>
                                        <Link href='profile' passHref>
                                            {getTranslateText(
                                                'teacher.dashboard.label.fill_more_info_link'
                                            )}
                                        </Link>
                                    </div>
                                )}
                        </div>
                    </Col>
                    <Col xl={7} lg={10} md={12} xs={22} className='mr-1 ml-1'>
                        <div className={cn(styles.infoUserSchedule)}>
                            <NumberClock timestamp={timestampNow} />
                            <p>{timezone}</p>
                            <p>{getTranslateText('teacher.dashboard.today')}</p>
                            <p>
                                {moment(timestampNow).date() < 10
                                    ? `0${moment(timestampNow).date()}`
                                    : moment(timestampNow).date()}
                            </p>
                            <p>
                                {getTranslateText(
                                    'teacher.dashboard.schedules'
                                )}
                            </p>
                            <div>
                                <Badge
                                    count={counter.schedules}
                                    offset={[-10, 0]}
                                >
                                    <Button
                                        onClick={() => {
                                            keyPane === 'schedules'
                                                ? setKeyPane('')
                                                : setKeyPane('schedules')
                                        }}
                                        shape='round'
                                        className={cn(styles.btnShowSchedule)}
                                    >
                                        {getTranslateText('show_schedules')}
                                        {keyPane === 'schedules' ? (
                                            <DownOutlined />
                                        ) : (
                                            <RightOutlined />
                                        )}
                                    </Button>
                                </Badge>
                            </div>
                            <div>
                                <Badge count={counter.memo} offset={[-10, 0]}>
                                    <Button
                                        onClick={() => {
                                            keyPane === 'schedulesMemo'
                                                ? setKeyPane('')
                                                : setKeyPane('schedulesMemo')
                                        }}
                                        shape='round'
                                        className={cn(styles.btnShowSchedule)}
                                    >
                                        {getTranslateText('memo_schedules')}
                                        {keyPane === 'schedulesMemo' ? (
                                            <DownOutlined />
                                        ) : (
                                            <RightOutlined />
                                        )}
                                    </Button>
                                </Badge>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <TeachingScheduleList
                timestampNow={timestampNow}
                keyPane={keyPane}
                setKeyPane={setKeyPane}
                onChangeCounter={onChangeCounter}
            />
        </>
    )
}

export default TeacherInfo
