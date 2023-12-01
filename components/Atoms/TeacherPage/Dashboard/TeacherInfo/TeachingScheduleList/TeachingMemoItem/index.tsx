import React, { memo, useCallback, useEffect } from 'react'
import cn from 'classnames'
import { EyeOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'
import moment from 'moment'
import { EnumBookingStatus } from 'const'
import { notify } from 'contexts/Notification'
import { hasHTTPUrl } from 'utils/string-utils'
import { getTranslateText } from 'utils/translate-utils'
import { EnumScheduledMemoType } from 'types'
import { encodeFilenameFromLink } from 'utils/functions'
import styles from './TeachingScheduleItem.module.scss'

const calendar = {
    lastDay: '[LAST DAY]',
    sameDay: '[TODAY]',
    nextDay: '[NEXT DAY]',
    lastWeek: '[LAST] dddd',
    nextWeek: '[NEXT] dddd',
    sameElse: 'L'
}

const TeachingMemoItem = ({
    isOpen,
    index,
    setIndex,
    booking,
    onMemo,
    memoType = EnumScheduledMemoType.NORMAL_MEMO
}) => {
    const [heightItem, setHeightItem] = React.useState(215)

    useEffect(() => {
        // responsive Item
        if (screen.width < 426) {
            setHeightItem(495)
        }
    }, [isOpen])

    const openMemo = useCallback(() => {
        if (onMemo) onMemo(booking)
    }, [booking, onMemo])

    const onViewDocument = useCallback(() => {
        const linkDoc = booking?.unit?.teacher_document
        if (linkDoc) {
            window.open(
                hasHTTPUrl(linkDoc)
                    ? encodeFilenameFromLink(linkDoc)
                    : `https://ispeak.vn/${encodeFilenameFromLink(linkDoc)}`,
                '_blank'
            )
        } else {
            notify('error', getTranslateText('link_document_invalid'))
        }
    }, [booking])

    const renderBookingStatus = () => {
        let cont = getTranslateText('booking.status.pending')

        if (booking?.status === EnumBookingStatus.CONFIRMED) {
            cont = getTranslateText('booking.status.upcoming')
        }
        if (booking?.status === EnumBookingStatus.TEACHING) {
            cont = getTranslateText('booking.status.teaching')
        }
        return <span>{cont.toUpperCase()}</span>
    }

    return (
        <>
            <div className={cn(styles.wrapTeachingScheduleItem)}>
                <div
                    style={{
                        height: `${
                            isOpen === 'true' ? `${heightItem}px` : '0'
                        }`,
                        bottom: `${isOpen === 'true' ? '0px' : '-2px'}`
                    }}
                    className={cn(styles.teachingScheduleItem)}
                >
                    <div className={cn(styles.headTeachingSchedule)}>
                        <span>
                            {memoType === EnumScheduledMemoType.NORMAL_MEMO
                                ? getTranslateText('memo.normal')
                                : memoType ===
                                  EnumScheduledMemoType.MONTHLY_MEMO
                                ? getTranslateText('memo.monthly')
                                : memoType ===
                                      EnumScheduledMemoType.COURSE_MEMO &&
                                  getTranslateText('memo.course')}
                        </span>
                        {[
                            EnumScheduledMemoType.MONTHLY_MEMO,
                            EnumScheduledMemoType.COURSE_MEMO
                        ].includes(memoType) && (
                            <div
                                className={cn(styles.btnMemoRight)}
                                onClick={openMemo}
                            >
                                <a>
                                    <EyeOutlined className='mr-2' />
                                    {getTranslateText('booking.memo')}
                                </a>
                            </div>
                        )}
                    </div>
                    <div className={cn(styles.headTeachingSchedule_content)}>
                        <Row className='m-0'>
                            <Col
                                md={8}
                                className={cn(
                                    styles.headTeachingSchedule_content_left
                                )}
                            >
                                {memoType ===
                                    EnumScheduledMemoType.NORMAL_MEMO && (
                                    <span>
                                        {booking &&
                                            moment(
                                                booking.calendar?.start_time
                                            ).calendar(null, calendar)}
                                    </span>
                                )}
                                <span>
                                    {memoType ===
                                        EnumScheduledMemoType.NORMAL_MEMO &&
                                    booking
                                        ? moment(
                                              booking.calendar?.start_time
                                          ).format('HH:mm')
                                        : memoType ===
                                          EnumScheduledMemoType.MONTHLY_MEMO
                                        ? `${booking?.month} - ${booking?.year}`
                                        : moment(booking?.created_time).format(
                                              'YYYY-MM-DD'
                                          )}
                                </span>
                            </Col>
                            {memoType !==
                                EnumScheduledMemoType.MONTHLY_MEMO && (
                                <Col md={8} className='p-0'>
                                    <div
                                        className={cn(
                                            styles.headTeachingSchedule_content_mid
                                        )}
                                    >
                                        <div>
                                            <p>
                                                {getTranslateText(
                                                    'common.course'
                                                )}
                                            </p>

                                            {memoType ===
                                                EnumScheduledMemoType.NORMAL_MEMO && (
                                                <>
                                                    <p>
                                                        {getTranslateText(
                                                            'booking.unit'
                                                        )}
                                                    </p>
                                                    <p>
                                                        {getTranslateText(
                                                            'booking.page'
                                                        )}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <p>{booking?.course?.name}</p>
                                            {memoType ===
                                                EnumScheduledMemoType.NORMAL_MEMO && (
                                                <>
                                                    <p>{booking?.unit?.name}</p>
                                                    <p>8</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            )}
                            <Col md={8} className='p-0'>
                                <div
                                    className={cn(
                                        styles.headTeachingSchedule_content_right
                                    )}
                                >
                                    <div>
                                        <p>{getTranslateText('common.type')}</p>
                                        <p>
                                            {getTranslateText(
                                                'booking.student'
                                            )}
                                        </p>
                                        <p>
                                            {getTranslateText(
                                                'booking.student_skype'
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            {getTranslateText(
                                                'teacher.dashboard.private_class'
                                            )}
                                        </p>
                                        <p>{`${booking?.student?.full_name}`}</p>
                                        <p>{booking?.student?.email}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className={cn(styles.footTeachingSchedule)}>
                        <Row className='m-0'>
                            <Col
                                md={8}
                                className={cn(styles.footTeachingSchedule_left)}
                            >
                                {memoType ===
                                    EnumScheduledMemoType.NORMAL_MEMO && (
                                    <>
                                        <span>#{booking?.id}</span>
                                        {renderBookingStatus()}
                                        <span>
                                            {booking
                                                ? moment(
                                                      booking.calendar
                                                          ?.start_time
                                                  ).format('DD-MM-YYYY')
                                                : ''}
                                        </span>
                                    </>
                                )}
                            </Col>

                            {memoType === EnumScheduledMemoType.NORMAL_MEMO && (
                                <>
                                    <Col
                                        md={8}
                                        className={cn(
                                            styles.footTeachingSchedule_mid
                                        )}
                                    >
                                        <div
                                            className={cn(styles.btnControl)}
                                            onClick={onViewDocument}
                                        >
                                            <a>
                                                <EyeOutlined className='mr-2' />
                                                {getTranslateText(
                                                    'booking.view_document'
                                                )}
                                            </a>
                                        </div>
                                    </Col>
                                    <Col
                                        md={8}
                                        className={cn(
                                            styles.footTeachingSchedule_mid
                                        )}
                                    >
                                        <div
                                            className={cn(styles.btnControl)}
                                            onClick={openMemo}
                                        >
                                            <a>
                                                <EyeOutlined className='mr-2' />
                                                {getTranslateText(
                                                    'booking.memo'
                                                )}
                                            </a>
                                        </div>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </div>
                </div>
                <div
                    onClick={() => {
                        setIndex(index)
                    }}
                    style={{
                        height: `${
                            isOpen === 'true' ? `${heightItem}px` : 'auto'
                        }`
                    }}
                    className={cn(styles.scheduleRectangleItem)}
                >
                    <Row className='m-0 align-items-center	'>
                        <Col md={8}>
                            <div
                                className={cn(
                                    styles.scheduleRectangleItem_left
                                )}
                            >
                                {memoType ===
                                EnumScheduledMemoType.NORMAL_MEMO ? (
                                    <>
                                        <span>#{booking?.id}</span>
                                        {renderBookingStatus()}
                                        <span>
                                            {booking &&
                                                moment(
                                                    booking.calendar?.start_time
                                                ).format('DD-MM-YYYY HH:mm')}
                                        </span>
                                    </>
                                ) : memoType ===
                                  EnumScheduledMemoType.MONTHLY_MEMO ? (
                                    <span>
                                        {booking?.month} - {booking?.year}
                                    </span>
                                ) : (
                                    <span>
                                        {moment(booking?.created_time).format(
                                            'DD-MM-YYYY HH:mm'
                                        )}
                                    </span>
                                )}
                            </div>
                        </Col>

                        {memoType !== EnumScheduledMemoType.MONTHLY_MEMO && (
                            <Col md={8}>
                                <div
                                    className={cn(
                                        styles.scheduleRectangleItem_mid
                                    )}
                                >
                                    <span>
                                        {getTranslateText('common.course')}
                                    </span>
                                    <span>{booking?.course?.name}</span>
                                </div>
                            </Col>
                        )}
                        <Col md={8}>
                            <div
                                className={cn(
                                    styles.scheduleRectangleItem_right
                                )}
                            >
                                <span>
                                    {getTranslateText('booking.student')}
                                </span>
                                <span>{`${booking?.student?.full_name}`}</span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default memo(TeachingMemoItem)
