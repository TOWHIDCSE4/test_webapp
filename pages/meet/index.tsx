/* eslint-disable jsx-a11y/iframe-has-title */
import { useRouter } from 'next/router'
import React, { useEffect, useState, useRef } from 'react'
import { EnumBookingMediumType, EnumOrderType, IBooking } from 'types'
import { ROLES_ENUM } from 'const/role'
import { useAuth } from 'contexts/Auth'
import BookingAPI from 'api/BookingAPI'
import { notify } from 'contexts/Notification'
import { BOOKING_STATUS } from 'const'
import { Button, Result, Spin } from 'antd'
import _ from 'lodash'
import { SmileOutlined } from '@ant-design/icons'
import {
    connect,
    subscribeBookingChanges,
    unsubscribeBookingChanges
} from 'socket'
import RatingPopup from 'components/Atoms/RatingPopup'
import MemoModal from 'components/Atoms/TeacherPage/Dashboard/MemoModal'
import { EnumActionPostMessageMeet } from 'const/meet'
import HamiaMeet from 'components/Atoms/HamiaMeet'
import { getTranslateText } from 'utils/translate-utils'

const Meet = () => {
    const refMemo = useRef(null)

    const { user } = useAuth()

    const router = useRouter()
    const id = router.query.room

    const [loading, setLoading] = useState(false)
    const [loadingEndClass, setLoadingEndClass] = useState(false)
    const [booking, setBooking] = useState<IBooking>(null)
    const [meetClassUrl, setMeetClassUrl] = useState('')
    const [visibleTrialMemo, setVisibleTrialMemo] = useState(false)
    const [visibleMemo, setVisibleMemo] = useState(false)

    const [visibleTeacherMemo, setVisibleTeacherMemo] = useState(false)
    const [visibleRating, setVisibleRating] = useState(false)

    const requestLinkMeet = (booking_id: number) => {
        if (user && user?.role?.includes(ROLES_ENUM.STUDENT) && booking_id) {
            setLoading(true)
            BookingAPI.joinClass(booking_id)
                .then((res) => {
                    setMeetClassUrl(res.join_url)
                })
                .catch((err) => {
                    notify('error', err.message)
                })
                .finally(() => setLoading(false))
        }
        if (user && user?.role?.includes(ROLES_ENUM.TEACHER) && booking_id) {
            setLoading(true)
            BookingAPI.startClass(booking_id, {
                medium_type: EnumBookingMediumType.HAMIA_MEET
            })
                .then((res) => {
                    setMeetClassUrl(res.join_url)
                })
                .catch((err) => {
                    notify('error', err.message)
                })
                .finally(() => setLoading(false))
        }
    }

    const getDetailLesson = (booking_id: number) => {
        setLoading(true)
        BookingAPI.getDetailLesson(booking_id)
            .then((res) => {
                if (res.booking) {
                    setBooking(res.booking)
                } else {
                    setBooking(res)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (id) {
            getDetailLesson(_.toInteger(id))
        }
    }, [router.query.room])

    useEffect(() => {
        if (id) {
            requestLinkMeet(_.toInteger(id))
        }
    }, [router.query.room, user])

    const updateEndClass = (data) => {
        const bookingChange = data
        if (bookingChange) {
            if (user?.role?.includes(ROLES_ENUM.TEACHER)) {
                if (booking?.ordered_package?.type === EnumOrderType.TRIAL) {
                    setVisibleTrialMemo(true)
                } else {
                    setVisibleMemo(true)
                }
            }
            if (user?.role?.includes(ROLES_ENUM.STUDENT)) {
                setVisibleRating(true)
            }
        }
    }

    const goToDashboard = () => {
        if (user && user.role && user.role.includes(ROLES_ENUM.TEACHER)) {
            router.push('/teacher/dashboard')
        } else if (user && user.role.includes(ROLES_ENUM.STUDENT)) {
            router.push('/student/dashboard')
        } else {
            router.push('/')
        }
    }
    useEffect(() => {
        if (id) {
            connect(() => {
                subscribeBookingChanges({
                    booking_id: _.toInteger(id),
                    onEndClass: updateEndClass
                })
            })

            return () => {
                unsubscribeBookingChanges({ booking_id: _.toInteger(id) })
            }
        }
    }, [router.query.room])

    if (
        booking &&
        [booking?.teacher_id, booking?.student_id].includes(user?.id)
    ) {
        if (
            [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.TEACHING].includes(
                booking?.status
            ) &&
            meetClassUrl
        ) {
            return (
                <>
                    <HamiaMeet
                        id={id}
                        meetClassUrl={meetClassUrl}
                        updateEndClass={updateEndClass}
                        width='100%'
                        height='calc(100vh - 10px)'
                    />
                    <MemoModal
                        type='other'
                        visible={visibleMemo}
                        close={() => {
                            setVisibleMemo(false)
                        }}
                        data={booking}
                    />
                    <MemoModal
                        type='trial'
                        visible={visibleTrialMemo}
                        close={() => {
                            setVisibleTrialMemo(false)
                        }}
                        data={booking}
                    />
                    <RatingPopup
                        visible={visibleRating}
                        data={{
                            rating: 5,
                            teacher: {
                                is_late: false,
                                not_enough_time: false,
                                teaching: false,
                                bad_attitude: false,
                                comment: ''
                            },
                            network: { good: false, bad: false, comment: '' },
                            homework: {
                                bad_homework: false,
                                easy: false,
                                hard: false,
                                normal: false,
                                comment: ''
                            },
                            document: {
                                bad_document: false,
                                easy: false,
                                hard: false,
                                normal: false,
                                commend: ''
                            }
                        }}
                        toggleModal={() => {
                            setVisibleRating(false)
                        }}
                        bookingData={{
                            id,
                            teacher_id: booking?.teacher?.id
                        }}
                        refetchData={() => {}}
                        isHideReport
                    />
                </>
            )
        }
        if (BOOKING_STATUS.COMPLETED === booking?.status) {
            return (
                <div>
                    <Result
                        icon={<SmileOutlined />}
                        title='Great, we have completed class!'
                        extra={
                            <Button
                                type='primary'
                                shape='round'
                                onClick={goToDashboard}
                            >
                                {getTranslateText('back_home')}
                            </Button>
                        }
                    />
                </div>
            )
        }
        return (
            <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
                <Spin spinning={loading} size='large' />
            </div>
        )
    }

    if (loading)
        return (
            <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
                <Spin spinning={loading} size='large' />
            </div>
        )

    return (
        <>
            <Result
                status='403'
                title='403'
                subTitle='Sorry, you are not authorized to access this page.'
                extra={
                    <Button
                        type='primary'
                        shape='round'
                        onClick={() => router.push('/')}
                    >
                        {getTranslateText('back_home')}
                    </Button>
                }
            />
        </>
    )
}

export default Meet
