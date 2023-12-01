import React, { FC, memo, useCallback, useState } from 'react'
import cn from 'classnames'
import TagStatus from 'components/Atoms/TeacherPage/TagStatus'
import { Row, Col, Dropdown, Menu, Spin, Popover } from 'antd'
import {
    EyeOutlined,
    CaretRightOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    UploadOutlined,
    EditOutlined,
    CheckOutlined
} from '@ant-design/icons'
import _ from 'lodash'
import Star from 'components/Atoms/TeacherPage/Star'
import moment from 'moment'
import { BOOKING_STATUS } from 'const/status'
import { hasHTTPUrl } from 'utils/string-utils'
import { getTranslateText } from 'utils/translate-utils'
import { notify } from 'contexts/Notification'
import { EnumOrderType, IBooking } from 'types'
import { BOOKING_TYPE } from 'const'
import { buildFileSelector } from 'utils/build-file-selector'
import BookingAPI from 'api/BookingAPI'
import UploadAPI from 'api/UploadAPI'
import { encodeFilenameFromLink } from 'utils/functions'
import styles from './index.module.scss'

type Props = {
    item: IBooking
    openMemoModal: (val: IBooking) => void
    refetchItem?: (data: any) => void
    openConfirmClass: (shown: boolean, val: IBooking) => void
}

const TeachingHistoryItem: FC<Props> = ({
    item,
    openMemoModal,
    refetchItem,
    openConfirmClass
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const onViewDocument = useCallback(
        (linkDoc) => {
            if (linkDoc) {
                window.open(
                    hasHTTPUrl(linkDoc)
                        ? encodeFilenameFromLink(linkDoc)
                        : `https://ispeak.vn/${encodeFilenameFromLink(
                              linkDoc
                          )}`,
                    '_blank'
                )
            } else {
                notify('error', getTranslateText('link_document_invalid'))
            }
        },
        [item]
    )

    const onViewVideo = useCallback(() => {
        const recordLink = item?.record_link
        if (recordLink) {
            if (typeof recordLink === 'string') {
                window.open(encodeFilenameFromLink(recordLink), '_blank')
            } else {
                for (const iterator of recordLink as any) {
                    window.open(encodeFilenameFromLink(iterator), '_blank')
                }
            }
        }
    }, [item])

    const menu = (
        <Menu>
            <Menu.Item
                key='0'
                onClick={() => onViewDocument(item?.unit?.teacher_document)}
            >
                <span className='pl-1'>
                    {getTranslateText('document_lesson')}
                </span>
            </Menu.Item>
            <Menu.Item
                key='1'
                onClick={() => onViewDocument(item?.unit?.homework)}
            >
                <span className='pl-1'>{getTranslateText('homework')}</span>
            </Menu.Item>
            <Menu.Item
                key='2'
                onClick={() => onViewDocument(item?.unit?.workbook)}
            >
                <span className='pl-1'>{getTranslateText('workbook')}</span>
            </Menu.Item>
        </Menu>
    )

    const handleSelecteFiles = async (fileList) => {
        if (fileList.length === 0) {
            return
        }

        setIsLoading(true)

        try {
            const file = fileList[0]
            const arr = file.name.split('.')
            const extensionFile = arr[arr.length - 1]

            const newFile = new File(
                [file],
                `${item.teacher_id}-${item.student_id}-${item.id}.${extensionFile}`
            )

            const record_link = await UploadAPI.uploadImage(newFile)

            const payload = {
                record_link
            }
            const res = await BookingAPI.updateRecordBooking(item?.id, payload)

            if (res) {
                notify(
                    'success',
                    getTranslateText('memo.upload_video_successfully')
                )

                refetchItem({
                    id: item.id,
                    record_link
                })
            }
        } catch (error) {
            notify('error', getTranslateText('memo.upload_video_failed'))
            console.log(error)
        }

        setIsLoading(false)
    }

    const fileSelector = buildFileSelector(handleSelecteFiles, false, 'video/*')

    const handleUploadVideo = (e: any) => {
        e.preventDefault()
        fileSelector.click()
    }

    const renderMemo = () => {
        if (item.status !== BOOKING_STATUS.COMPLETED) {
            return <></>
        }

        if (item?.ordered_package?.type === EnumOrderType.TRIAL) {
            if (!item?.record_link) {
                return (
                    <Col
                        span={12}
                        style={{ color: '#25ab5c' }}
                        className={`${cn(styles.borderRight)} ${cn(
                            styles.borderRight_none
                        )} d-flex align-items-center justify-content-center py-3 clickable`}
                        onClick={handleUploadVideo}
                    >
                        <UploadOutlined />
                        <span>{getTranslateText('upload_video')}</span>
                    </Col>
                )
            }

            return (
                <Col
                    span={12}
                    style={{ color: '#25ab5c' }}
                    className={`${cn(styles.borderRight)} ${cn(
                        styles.borderRight_none
                    )} d-flex align-items-center justify-content-center py-3 clickable`}
                    onClick={() => {
                        openMemoModal(item)
                    }}
                >
                    {item?.memo?.note.length > 0 ||
                    item?.memo?.other.length > 0 ? (
                        <CheckOutlined />
                    ) : (
                        <EditOutlined />
                    )}

                    <span>{getTranslateText('view_memo')}</span>
                </Col>
            )
        }

        return (
            <Col
                span={12}
                style={{ color: '#25ab5c' }}
                className={`${cn(styles.borderRight)} ${cn(
                    styles.borderRight_none
                )} d-flex align-items-center justify-content-center py-3 clickable`}
                onClick={() => {
                    openMemoModal(item)
                }}
            >
                {item?.memo?.note.length > 0 || item?.memo?.other.length > 0 ? (
                    <CheckOutlined />
                ) : (
                    <EditOutlined />
                )}

                <span>{getTranslateText('view_memo')}</span>
            </Col>
        )
    }

    const showBookingType = () => {
        if (item?.ordered_package?.type === EnumOrderType.TRIAL) {
            return <span>TRIAL</span>
        }
        if (item?.is_regular_booking) {
            return <span className={cn(styles.regular)}>REGULAR</span>
        }
        return <span>FLEXIBLE</span>
    }

    return (
        <Spin spinning={isLoading} className='text-center' size='large'>
            <div className={cn(styles.item)}>
                <TagStatus status={item.status} />

                <Row className={`${cn(styles.content)} m-0`}>
                    <div className={cn(styles.topItem)}>
                        <div className={`${cn(styles.item_left)}`}>
                            <div className={cn(styles.item_left_child)}>
                                <ul className={cn(styles.timeDate)}>
                                    <li className={cn(styles.numberID)}>
                                        #{item.id}
                                    </li>
                                    <li className={cn(styles.textTime)}>
                                        <span>
                                            {item.calendar &&
                                                moment(
                                                    item.calendar.start_time
                                                ).format('HH')}{' '}
                                            :{' '}
                                            {item.calendar &&
                                                moment(
                                                    item.calendar.start_time
                                                ).format('mm')}
                                        </span>
                                        <span> - </span>
                                        <span>
                                            {item.calendar &&
                                                moment(
                                                    item.calendar.end_time
                                                ).format('HH')}{' '}
                                            :{' '}
                                            {item.calendar &&
                                                moment(
                                                    item.calendar.end_time
                                                ).format('mm')}
                                        </span>
                                    </li>
                                    <li className={cn(styles.textLarge)}>
                                        {showBookingType()}
                                    </li>
                                    <li className={cn(styles.textDateTime)}>
                                        {item.calendar &&
                                            moment(
                                                item.calendar.start_time
                                            ).format('DD/MM/YYYY')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={`${cn(styles.item_mid)}`}>
                            <ul className={cn(styles.courseName)}>
                                <li>
                                    <span>
                                        {getTranslateText('common.course')}
                                    </span>
                                    <span>
                                        {item.course && item.course.name}
                                    </span>
                                </li>
                                {/* <li>
                                    <span>
                                        {getTranslateText('booking.page')}
                                    </span>
                                    <span>8</span>
                                </li> */}
                                <li>
                                    <span>
                                        {getTranslateText('booking.unit')}
                                    </span>
                                    <span>{item.unit && item.unit.name}</span>
                                </li>
                                <li>
                                    <span>
                                        {item?.teacher_note
                                            ? getTranslateText(
                                                  'teacher.note_for_teacher'
                                              )
                                            : ''}
                                    </span>
                                    <span className='text-truncate text-success'>
                                        <Popover
                                            content={
                                                <p
                                                    style={{
                                                        maxWidth: '300px'
                                                    }}
                                                >
                                                    {item.teacher_note}
                                                </p>
                                            }
                                            placement='topLeft'
                                        >
                                            {item.teacher_note}
                                        </Popover>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className={`${cn(styles.item_right)}`}>
                            <ul className={cn(styles.studentName)}>
                                {/* <li>
                                    <br />
                                </li> */}
                                <li>
                                    <span>
                                        {getTranslateText('booking.student')}
                                    </span>

                                    <span>
                                        {item.student &&
                                            `${item.student.full_name}`}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        {getTranslateText(
                                            'student.booking.studentSkype'
                                        )}
                                    </span>
                                    <span>
                                        {item.student &&
                                            item.student?.skype_account}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Col span={24} className={`${cn(styles.control)}`}>
                        <Row>
                            <Col span={8}>
                                <Row>
                                    <Col
                                        span={12}
                                        className={`${cn(
                                            styles.borderRight
                                        )} d-flex align-items-center justify-content-center py-3`}
                                    >
                                        <img
                                            src='/static/img/teacher/teaching-history/skype.png'
                                            width={16}
                                            height={16}
                                            alt=''
                                        />
                                        <span>
                                            {getTranslateText(
                                                'student.booking.bySkype'
                                            )}
                                        </span>
                                    </Col>
                                    <Col
                                        span={12}
                                        className={cn(styles.borderRight)}
                                    />
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Dropdown
                                        overlay={menu}
                                        trigger={['click']}
                                    >
                                        <Col
                                            span={12}
                                            className={`${cn(
                                                styles.borderRight,
                                                styles.btnControl
                                            )} d-flex align-items-center justify-content-center py-3 clickable`}
                                        >
                                            <>
                                                <EyeOutlined />
                                                <span className='pl-1'>
                                                    {getTranslateText(
                                                        'view_document'
                                                    )}
                                                </span>
                                            </>
                                        </Col>
                                    </Dropdown>
                                    <Col
                                        span={12}
                                        className={`${cn(
                                            styles.borderRight,
                                            styles.btnControl
                                        )} d-flex align-items-center justify-content-center py-3 clickable`}
                                        onClick={onViewVideo}
                                    >
                                        {item?.record_link && (
                                            <>
                                                <CaretRightOutlined />
                                                <span>
                                                    {getTranslateText(
                                                        'view_video'
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col
                                        span={12}
                                        className={`${cn(
                                            styles.borderRight,
                                            styles.btnControl
                                        )} d-flex align-items-center justify-content-center py-3 clickable`}
                                        onClick={() =>
                                            item.status ===
                                            BOOKING_STATUS.TEACHER_CONFIRMED
                                                ? openConfirmClass(true, item)
                                                : null
                                        }
                                    >
                                        {item.status ===
                                            BOOKING_STATUS.TEACHER_CONFIRMED && (
                                            <>
                                                <CheckCircleOutlined />
                                                <span>
                                                    {getTranslateText(
                                                        'confirm_class'
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </Col>
                                    {renderMemo()}
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    {item.student_rating && item.student_rating > 0 && (
                        <Col span={24} className={cn(styles.review_rating)}>
                            <div>Student Review & Rating</div>
                            <div className={cn(styles.nameStudent)}>
                                {item.student && `${item.student.full_name}`}
                            </div>
                            <div className={cn(styles.review)}>
                                {item.student_note}
                            </div>
                            <div className={`${cn(styles.rating)}`}>
                                <div className={cn(styles.groupStar)}>
                                    {_.fill(Array(5), 0).map((_item, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                styles.starRatingItem
                                            )}
                                        >
                                            <Star
                                                active={
                                                    item.student_rating >=
                                                    index + 1
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className={cn(styles.dateTime)}>
                                    <div>
                                        <TeamOutlined
                                            style={{ color: '#9c9c9c' }}
                                        />{' '}
                                        <span>
                                            {getTranslateText(
                                                'student.booking.public'
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        {' '}
                                        <span>12 : 00</span>{' '}
                                        <span style={{ marginLeft: 10 }}>
                                            23/11/2019
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </div>
        </Spin>
    )
}

export default memo(TeachingHistoryItem)
