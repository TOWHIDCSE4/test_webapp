import React, { FC, memo, useEffect, useState } from 'react'
import ISpeakClassApi from 'ispeak-class-api'
import { EnumActionPostMessageMeet } from 'const/meet'
import { useAuth } from 'contexts/Auth'
import { ROLES_ENUM } from 'const/role'
import { Spin } from 'antd'
import BookingAPI from 'api/BookingAPI'
import { BOOKING_STATUS } from 'const'
import { notify } from 'contexts/Notification'
import { useRouter } from 'next/router'

type Props = {
    id: any
    meetClassUrl: string
    updateEndClass: any
    width: any
    height: any
}

const HamiaMeet: FC<Props> = ({
    id,
    meetClassUrl,
    width,
    height,
    updateEndClass
}) => {
    const { user } = useAuth()
    const router = useRouter()
    const [loadingEndClass, setLoadingEndClass] = useState(false)
    const endClassByTeacher = () => {
        setLoadingEndClass(true)
        BookingAPI.endClass({
            lesson_id: id,
            status: BOOKING_STATUS.COMPLETED,
            teacher_note: 'Finish lesson'
        })
            .then((res) => {
                setLoadingEndClass(false)
                updateEndClass(true)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => {
                setLoadingEndClass(false)
            })
    }

    const handleRecordUpload = (url) => {
        setLoadingEndClass(true)
        BookingAPI.uploadVideoByTeacher({ data: id, video: url })
            .then((res) => {
                setLoadingEndClass(false)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => {
                setLoadingEndClass(false)
            })
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
        try {
            const ispeakClassApi = new ISpeakClassApi(meetClassUrl)
            const iframe = ispeakClassApi?.iframe
            iframe.style.width = '100%'
            iframe.style.height = '100%'
            console.log('init iframe')
            document.getElementById('meet-box').appendChild(iframe)
            ispeakClassApi.on(
                EnumActionPostMessageMeet.END_CLASS,
                (payload) => {
                    console.log('---->', EnumActionPostMessageMeet.END_CLASS)
                    if (user?.role?.includes(ROLES_ENUM.TEACHER)) {
                        endClassByTeacher()
                    }
                }
            )
            ispeakClassApi.on(
                EnumActionPostMessageMeet.UPLOADED_VIDEO,
                (payload) => {
                    console.log(
                        '---->',
                        EnumActionPostMessageMeet.UPLOADED_VIDEO
                    )
                    if (user?.role?.includes(ROLES_ENUM.TEACHER)) {
                        handleRecordUpload(payload as string)
                    }
                }
            )
            ispeakClassApi.on(EnumActionPostMessageMeet.GO_HOME, () => {
                console.log('---->', EnumActionPostMessageMeet.GO_HOME)
                goToDashboard()
            })
        } catch (error) {
            console.log(error)
        }
    }, [])
    return (
        <Spin spinning={loadingEndClass}>
            <div id='meet-box' style={{ width, height }} />
        </Spin>
    )
}

export default memo(HamiaMeet)
