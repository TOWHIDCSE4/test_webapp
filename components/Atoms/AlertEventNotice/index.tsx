import { useEffect, useState } from 'react'
import { EnumEventNoticeType, IEventNotice } from 'types'
import EventNoticeAPI from 'api/EventNoticeAPI'
import { Alert } from 'antd'
import { sanitize } from 'utils/string-utils'
import Link from 'next/link'
import { useAuth } from 'contexts/Auth'
import { ROLES } from 'const'
import { getTranslateText } from 'utils/translate-utils'
import _ from 'lodash'
import * as store from 'helpers/storage'
import HolidayEvenPopup from '../HolidayEvenPopup'

const AlertEventNotice = () => {
    const { user, teacherInfo } = useAuth()

    const [eventNotices, setEventNotices] = useState<IEventNotice[]>([])

    const fetchEventNotices = () => {
        EventNoticeAPI.getEventNotices({ page_number: 1, page_size: 10 })
            .then((res) => {
                setEventNotices(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const renderHolidayEvent = () => {
        const checkClose = store.get('close_popup')
        const holidayNotices = eventNotices.filter(
            (x) =>
                [EnumEventNoticeType.HOLIDAY_EVENT].includes(x.type) && x?.image
        )
        const birthdayNotices = eventNotices.filter(
            (x) =>
                [EnumEventNoticeType.HAPPY_BIRTHDAY_EVENT].includes(x.type) &&
                x?.content
        )
        if (!checkClose) {
            return [...holidayNotices, ...birthdayNotices].map(
                (item, index) => {
                    if (item.type === EnumEventNoticeType.HOLIDAY_EVENT)
                        return (
                            <HolidayEvenPopup src={item?.image} key={index} />
                        )
                    if (
                        item.type === EnumEventNoticeType.HAPPY_BIRTHDAY_EVENT
                    ) {
                        return (
                            <HolidayEvenPopup
                                src={
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            overflow: 'auto'
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: sanitize(item?.content)
                                        }}
                                    />
                                }
                                key={index}
                            />
                        )
                    }
                    return null
                }
            )
        }
    }
    useEffect(() => {
        fetchEventNotices()
    }, [])

    const commonNotices = eventNotices.filter(
        (x) =>
            ![
                EnumEventNoticeType.HOLIDAY_EVENT,
                EnumEventNoticeType.HAPPY_BIRTHDAY_EVENT
            ].includes(x.type) && x?.content
    )
    return (
        <>
            {commonNotices.length > 0 && (
                <Alert
                    message={<b>{commonNotices[0]?.title}</b>}
                    description={
                        <>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'auto'
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: sanitize(commonNotices[0]?.content)
                                }}
                            />
                        </>
                    }
                    type='warning'
                    showIcon
                    className='mb-3'
                    action={
                        <Link
                            href={
                                user && user?.role?.includes(ROLES.STUDENT)
                                    ? '/student/notice'
                                    : user &&
                                      user?.role?.includes(ROLES.TEACHER)
                                    ? '/teacher/notices'
                                    : '#'
                            }
                        >
                            <a style={{ color: '#076fd6', marginTop: '-5px' }}>
                                {getTranslateText('see_more')}
                            </a>
                        </Link>
                    }
                />
            )}
            {renderHolidayEvent()}
        </>
    )
}

export default AlertEventNotice
