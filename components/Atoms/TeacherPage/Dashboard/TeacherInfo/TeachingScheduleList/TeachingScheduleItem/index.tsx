/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import {
    CheckOutlined,
    EyeOutlined,
    WarningOutlined,
    CaretRightOutlined,
    SoundOutlined
} from '@ant-design/icons'
import {
    Row,
    Col,
    Menu,
    Dropdown,
    Spin,
    Form,
    Input,
    Modal,
    Popover
} from 'antd'
import moment from 'moment'
import BookingAPI from 'api/BookingAPI'
import { EnumBookingStatus, EnumModalType } from 'const'
import { notify } from 'contexts/Notification'
import { getTranslateText } from 'utils/translate-utils'
import { hasHTTPUrl } from 'utils/string-utils'
import { EnumBookingMediumType, EnumOrderType, IBooking } from 'types'
import { encodeFilenameFromLink } from 'utils/functions'
import styles from './TeachingScheduleItem.module.scss'
import AbsentRequestModal from '../../../../AbsentRequest/modal'

const { TextArea } = Input

const calendar = {
    lastDay: '[LAST DAY]',
    sameDay: '[TODAY]',
    nextDay: '[NEXT DAY]',
    lastWeek: '[LAST] dddd',
    nextWeek: '[NEXT] dddd',
    sameElse: 'L'
}

interface IProps {
    isOpen: boolean
    setIndex: (id: number) => void
    booking: IBooking
    reload: any
    showStartTeaching: boolean
    showFinishTeaching: boolean
}

const TeachingScheduleItem = ({
    isOpen,
    setIndex,
    booking,
    reload,
    showStartTeaching,
    showFinishTeaching
}: IProps) => {
    const refInputReason = useRef(null)

    const [heightItem, setHeightItem] = useState<number>(250)
    const [visible, setVisible] = useState<boolean>(false)
    const [loadingWillTeach, setLoadingWillTeach] = useState<boolean>(false)
    const [loadingAbsent, setLoadingAbsent] = useState<boolean>(false)
    const [isSendTeacherAbsent, setIsSendTeacherAbsent] =
        useState<boolean>(false)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)

    useEffect(() => {
        if (
            booking?.status === EnumBookingStatus.CONFIRMED ||
            booking?.status === EnumBookingStatus.TEACHING ||
            booking?.status === EnumBookingStatus.PENDING
        ) {
            setHeightItem(265)
        }
    }, [isOpen])
    const startTeaching = async (type: EnumBookingMediumType) => {
        setLoadingWillTeach(true)
        BookingAPI.startClass(booking?.id, { learning_medium: type })
            .then((res) => {
                if (type === EnumBookingMediumType.SKYPE) {
                    notify('success', getTranslateText('create_skype_success'))
                } else {
                    notify('success', res?.message)
                }
                const joinUrl = res?.join_url
                if (joinUrl) {
                    window.open(joinUrl)
                }
            })
            .catch((err) => {
                notify('error', err?.message)
            })
            .finally(() => {
                setLoadingWillTeach(false)
                reload && reload()
            })
    }

    const willTeach = () => {
        setLoadingWillTeach(true)
        BookingAPI.willTeach({
            lesson_id: booking?.id
        })
            .then((res) => {
                reload && reload()
                notify('success', res?.message)
            })
            .catch((err) => {
                notify('error', err?.message)
            })
            .finally(() => setLoadingWillTeach(false))
    }

    const finishTeach = () => {
        setLoadingWillTeach(true)
        BookingAPI.endClass({
            lesson_id: booking?.id,
            status: EnumBookingStatus.COMPLETED
        })
            .then((res) => {
                notify('success', res?.message)
            })
            .catch((err) => {
                notify('error', err?.message)
            })
            .finally(() => {
                setLoadingWillTeach(false)
                reload && reload()
            })
    }

    const openModal = useCallback(() => {
        setVisible(true)
    }, [])

    const hiddenModal = useCallback(() => {
        setVisible(false)
    }, [])

    const studentAbsent = useCallback((id, reason) => {
        BookingAPI.makeStudentAbsent(id, reason)
            .then((res) => {
                notify('success', res?.message)
                reload && reload()
            })
            .catch((err) => {
                notify('error', err?.message)
            })
    }, [])

    const onOkeReason = useCallback(() => {
        hiddenModal()
        const reason =
            refInputReason.current?.resizableTextArea?.textArea?.value
        studentAbsent(booking?.id, reason)
    }, [booking, isSendTeacherAbsent])

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
        [booking]
    )

    const onViewAudio = useCallback(
        (item) => {
            const linkAudio = item
            if (linkAudio) {
                window.open(
                    hasHTTPUrl(linkAudio)
                        ? encodeFilenameFromLink(linkAudio)
                        : `https://ispeak.vn/${encodeFilenameFromLink(
                              linkAudio
                          )}`,
                    '_blank'
                )
            } else {
                notify('error', getTranslateText('unit_audio_invalid'))
            }
        },
        [booking]
    )

    const renderDropDownBtn = () => {
        if (
            booking?.status === EnumBookingStatus.CONFIRMED ||
            booking?.status === EnumBookingStatus.PENDING
        ) {
            if (showStartTeaching) {
                const menuStartTeaching = (
                    <Menu>
                        {booking?.is_show_hmp &&
                            booking?.learning_medium?.medium_type ===
                                EnumBookingMediumType.HAMIA_MEET && (
                                <Menu.Item
                                    key='0'
                                    onClick={() =>
                                        startTeaching(
                                            EnumBookingMediumType.HAMIA_MEET
                                        )
                                    }
                                >
                                    <span className='pl-1'>
                                        Via Hamia Meet Plus
                                    </span>
                                </Menu.Item>
                            )}
                        <Menu.Item
                            key='1'
                            onClick={() =>
                                startTeaching(EnumBookingMediumType.SKYPE)
                            }
                        >
                            <span className='pl-1'>Via Skype</span>
                        </Menu.Item>
                    </Menu>
                )

                return (
                    <Dropdown overlay={menuStartTeaching} trigger={['click']}>
                        <a>
                            <CaretRightOutlined className='mr-2' />
                            <a>
                                {getTranslateText(
                                    'teacher.dashboard.schedule.start_teaching'
                                )}
                            </a>
                        </a>
                    </Dropdown>
                )
            }

            return <></>
        }
        if (booking?.status === EnumBookingStatus.PENDING) {
            return (
                <a onClick={willTeach}>
                    <CaretRightOutlined className='mr-2' />{' '}
                    {getTranslateText(
                        'teacher.dashboard.schedule.i_will_teach'
                    )}
                </a>
            )
        }
        if (
            booking?.status === EnumBookingStatus.TEACHING &&
            showFinishTeaching
        ) {
            return (
                <a onClick={finishTeach}>
                    <CaretRightOutlined className='mr-2' />
                    {getTranslateText(
                        'teacher.dashboard.schedule.finish_teaching'
                    )}
                </a>
            )
        }
    }

    const handleJoinClass = (type: EnumBookingMediumType) => {
        if (
            booking &&
            booking.learning_medium &&
            booking.learning_medium.info
        ) {
            if (booking.learning_medium.medium_type === type) {
                if (type === EnumBookingMediumType.SKYPE) {
                    window.open(booking.learning_medium.info.joinLink)
                } else if (booking.learning_medium?.info?.teacher_link) {
                    window.open(booking?.learning_medium?.info?.teacher_link)
                } else {
                    startTeaching(type)
                }
            } else {
                startTeaching(type)
            }
        } else {
            startTeaching(type)
            // window.open(
            //     `/meet?room=${booking.id}&idTeacher=${booking.teacher_id}&idStudent=${booking.student_id}&time=${booking.calendar.start_time}`
            // )
        }
    }

    const toggleModal = useCallback(
        (val: boolean) => {
            setVisibleModal(val)
        },
        [visibleModal]
    )

    const menuJoinClass = (
        <Menu>
            {booking.is_show_hmp && (
                <Menu.Item
                    key='0'
                    onClick={() =>
                        handleJoinClass(EnumBookingMediumType.HAMIA_MEET)
                    }
                >
                    <span className='pl-1'>Via Hamia Meet</span>
                    {booking?.learning_medium?.medium_type ===
                        EnumBookingMediumType.HAMIA_MEET && (
                        <CheckOutlined
                            className='ml-2 mb-1'
                            style={{
                                color: '#237804',
                                verticalAlign: 'middle'
                            }}
                        />
                    )}
                </Menu.Item>
            )}
            <Menu.Item
                key='1'
                onClick={() => handleJoinClass(EnumBookingMediumType.SKYPE)}
            >
                <span className='pl-1'>Via Skype</span>
                {booking?.learning_medium?.medium_type ===
                    EnumBookingMediumType.SKYPE && (
                    <CheckOutlined
                        className='ml-2 mb-1'
                        style={{ color: '#237804', verticalAlign: 'middle' }}
                    />
                )}
            </Menu.Item>
        </Menu>
    )

    const renderBookingType = () => {
        let cont = getTranslateText('booking.type.trial')
        if (booking?.ordered_package?.type === EnumOrderType.STANDARD) {
            cont = getTranslateText('booking.type.flexible')
        }
        if (booking?.ordered_package?.type === EnumOrderType.PREMIUM) {
            cont = getTranslateText('booking.type.regular')
        }

        return <span className={cn(styles.trial)}>{cont.toUpperCase()}</span>
    }

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

    const showListAudio = () => {
        if (booking?.unit?.audio && booking?.unit?.audio.length > 0) {
            if (
                !Array.isArray(booking?.unit?.audio) ||
                (Array.isArray(booking?.unit?.audio) &&
                    booking?.unit?.audio.length === 1)
            ) {
                return (
                    <div
                        className={`${cn(
                            styles.footTeachingSchedule_mid
                        )} col-4 p-2`}
                    >
                        <div
                            className={cn(styles.btnControl)}
                            onClick={() =>
                                onViewAudio(
                                    Array.isArray(booking?.unit?.audio)
                                        ? booking?.unit?.audio[0]
                                        : booking?.unit?.audio
                                )
                            }
                        >
                            <a>
                                <SoundOutlined className='mr-2' />
                                <span>{getTranslateText('view_audio')}</span>
                            </a>
                        </div>
                    </div>
                )
            }
            const menu = (
                <Menu>
                    {Array.isArray(booking?.unit?.audio) &&
                        booking?.unit?.audio?.length > 1 &&
                        booking?.unit?.audio.map((item: any, index: number) => (
                            <Menu.Item
                                key={index}
                                onClick={() => onViewAudio(item)}
                            >
                                <span className='pl-1'>
                                    {getTranslateText('view_audio')} {index + 1}
                                </span>
                            </Menu.Item>
                        ))}
                </Menu>
            )

            return (
                <Dropdown overlay={menu} trigger={['click']}>
                    <div
                        className={`${cn(
                            styles.footTeachingSchedule_mid
                        )} col-4 p-2`}
                    >
                        <div className={cn(styles.btnControl)}>
                            <a>
                                <SoundOutlined className='mr-2' />
                                <span>{getTranslateText('view_audio')}</span>
                            </a>
                        </div>
                    </div>
                </Dropdown>
            )
        }

        return <></>
    }

    const menu = (
        <Menu>
            <Menu.Item
                key='0'
                onClick={() => onViewDocument(booking?.unit?.teacher_document)}
            >
                <span className='pl-1'>
                    {getTranslateText('document_lesson')}
                </span>
            </Menu.Item>
            <Menu.Item
                key='1'
                onClick={() => onViewDocument(booking?.unit?.homework)}
            >
                <span className='pl-1'>{getTranslateText('homework')}</span>
            </Menu.Item>
            <Menu.Item
                key='2'
                onClick={() => onViewDocument(booking?.unit?.workbook)}
            >
                <span className='pl-1'>{getTranslateText('workbook')}</span>
            </Menu.Item>
        </Menu>
    )

    return (
        <>
            <div className={cn(styles.wrapTeachingScheduleItem)}>
                <div
                    style={{
                        height: `${isOpen ? `${heightItem}px` : '0'}`,
                        bottom: `${isOpen ? '0px' : '-2px'}`
                    }}
                    className={cn(styles.teachingScheduleItem)}
                >
                    <div className={cn(styles.headTeachingSchedule)}>
                        <span>
                            {getTranslateText('teacher.dashboard.schedule')}
                        </span>
                        <span />
                    </div>
                    <div className={cn(styles.headTeachingSchedule_content)}>
                        <Row className='m-0'>
                            <Col
                                span={8}
                                className={cn(
                                    styles.headTeachingSchedule_content_left
                                )}
                            >
                                <span>
                                    {booking
                                        ? moment(
                                              booking.calendar?.start_time
                                          ).calendar(null, calendar)
                                        : ''}
                                </span>
                                <span>
                                    {booking
                                        ? moment(
                                              booking.calendar?.start_time
                                          ).format('HH:mm')
                                        : ''}
                                </span>
                            </Col>
                            <Col span={8} className='p-0'>
                                <Row className='p-2'>
                                    <Col span={8} className='pl-2 pt-2'>
                                        {getTranslateText('common.course')}
                                    </Col>
                                    <Col
                                        span={16}
                                        className='pl-2 pt-2 text-primary'
                                    >
                                        {booking?.course?.name}
                                    </Col>
                                </Row>
                                <Row className='p-2'>
                                    <Col span={8} className='pl-2 pt-2'>
                                        {getTranslateText('booking.unit')}
                                    </Col>
                                    <Col
                                        span={16}
                                        className='pl-2 pt-2 text-primary'
                                    >
                                        {booking?.unit?.name}
                                    </Col>
                                </Row>
                                <Row className='p-2'>
                                    <Col span={8} className='pl-2 pt-2'>
                                        {booking?.teacher_note
                                            ? getTranslateText(
                                                  'teacher.note_for_teacher'
                                              )
                                            : ''}
                                    </Col>
                                    <Col
                                        span={16}
                                        className='pl-2 pt-2 text-primary text-truncate'
                                    >
                                        <Popover
                                            content={
                                                <p
                                                    style={{
                                                        maxWidth: '300px'
                                                    }}
                                                >
                                                    {booking?.teacher_note}
                                                </p>
                                            }
                                            placement='topLeft'
                                        >
                                            {booking?.teacher_note}
                                        </Popover>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8} className='p-0'>
                                <Row className='p-2'>
                                    <Col span={8} className='pl-2 pt-2'>
                                        {getTranslateText('common.type')}
                                    </Col>
                                    <Col
                                        span={16}
                                        className='pl-2 pt-2 text-primary'
                                    >
                                        <span
                                            className={cn(styles.bookingType)}
                                        >
                                            {renderBookingType()}
                                        </span>
                                    </Col>
                                </Row>
                                <Row className='p-2'>
                                    <Col span={8} className='pl-2 pt-2'>
                                        {getTranslateText('booking.student')}
                                    </Col>
                                    <Col
                                        span={16}
                                        className='pl-2 pt-2 text-primary'
                                    >
                                        {`${booking?.student?.full_name}`}
                                    </Col>
                                </Row>
                                <Row className='p-2'>
                                    <Col span={8} className='pl-2 pt-2'>
                                        {getTranslateText(
                                            'booking.student_skype'
                                        )}
                                    </Col>
                                    <Col
                                        span={16}
                                        className='pl-2 pt-2 text-primary'
                                    >
                                        {booking?.student?.skype_account
                                            ? booking?.student?.skype_account
                                            : getTranslateText(
                                                  'booking.via_skype_link'
                                              )}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <div className={cn(styles.footTeachingSchedule)}>
                        <Row className='m-0'>
                            <Col
                                span={8}
                                className={cn(styles.footTeachingSchedule_left)}
                            >
                                <span>#{booking?.id}</span>
                                {renderBookingStatus()}
                                <span>
                                    {booking
                                        ? moment(
                                              booking.calendar?.start_time
                                          ).format('DD-MM-YYYY')
                                        : ''}
                                </span>
                            </Col>
                            <Col span={16} className='h-100'>
                                <div className='m-0 d-flex flex-wrap w-100 h-100'>
                                    <div
                                        className={`${cn(
                                            styles.footTeachingSchedule_mid
                                        )} col-4 p-2`}
                                    >
                                        <Dropdown
                                            overlay={menu}
                                            trigger={['click']}
                                        >
                                            <div
                                                className={cn(
                                                    styles.btnControl
                                                )}
                                            >
                                                <a>
                                                    <EyeOutlined className='mr-2' />{' '}
                                                    {getTranslateText(
                                                        'view_document'
                                                    )}
                                                </a>
                                            </div>
                                        </Dropdown>
                                    </div>
                                    {showListAudio()}
                                    {booking?.status ===
                                        EnumBookingStatus.TEACHING && (
                                        <div
                                            className={`${cn(
                                                styles.footTeachingSchedule_mid
                                            )} col-4 p-2`}
                                        >
                                            <div
                                                className={cn(
                                                    styles.btnControl
                                                )}
                                            >
                                                <Dropdown
                                                    overlay={menuJoinClass}
                                                    trigger={['click']}
                                                >
                                                    <a>
                                                        <CaretRightOutlined className='mr-2' />
                                                        {getTranslateText(
                                                            'join_class'
                                                        )}
                                                    </a>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    )}

                                    {booking?.status ===
                                        EnumBookingStatus.TEACHING && (
                                        <div
                                            className={`${cn(
                                                styles.footTeachingSchedule_mid
                                            )} col-4 p-2`}
                                        >
                                            <div
                                                className={cn(
                                                    styles.btnControl
                                                )}
                                            >
                                                <a
                                                    onClick={() => {
                                                        openModal()
                                                    }}
                                                >
                                                    <WarningOutlined className='mr-2' />{' '}
                                                    {getTranslateText(
                                                        'student_absent'
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {(booking?.status ===
                                        EnumBookingStatus.CONFIRMED ||
                                        booking?.status ===
                                            EnumBookingStatus.PENDING) && (
                                        <div
                                            className={`${cn(
                                                styles.footTeachingSchedule_mid
                                            )} col-4 p-2`}
                                        >
                                            <div
                                                className={cn(
                                                    styles.btnControl
                                                )}
                                            >
                                                {loadingAbsent ? (
                                                    <Spin />
                                                ) : (
                                                    <a
                                                        onClick={() => {
                                                            toggleModal(true)
                                                        }}
                                                    >
                                                        <WarningOutlined className='mr-2' />{' '}
                                                        {getTranslateText(
                                                            'request_absent'
                                                        )}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(booking?.status ===
                                        EnumBookingStatus.CONFIRMED ||
                                        booking?.status ===
                                            EnumBookingStatus.PENDING ||
                                        booking?.status ===
                                            EnumBookingStatus.TEACHING) && (
                                        <div
                                            className={`${cn(
                                                styles.footTeachingSchedule_mid
                                            )} col-4 p-2`}
                                        >
                                            <div
                                                className={`${cn(
                                                    styles.footTeachingSchedule_right
                                                )} w-100`}
                                            >
                                                <div
                                                    className={cn(
                                                        styles.btnControl
                                                    )}
                                                >
                                                    {loadingWillTeach ? (
                                                        <Spin />
                                                    ) : (
                                                        renderDropDownBtn()
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div
                    onClick={() => {
                        setIndex(booking.id)
                    }}
                    style={{
                        height: `${isOpen ? `${heightItem}px` : 'auto'}`
                    }}
                    className={cn(styles.scheduleRectangleItem)}
                >
                    <Row className='m-0 align-items-center	'>
                        <Col span={8}>
                            <div
                                className={cn(
                                    styles.scheduleRectangleItem_left
                                )}
                            >
                                <span>#{booking?.id}</span>
                                {renderBookingStatus()}
                                <span>
                                    {booking
                                        ? moment(
                                              booking.calendar?.start_time
                                          ).format('DD-MM-YYYY HH:mm')
                                        : ''}
                                </span>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div
                                className={cn(styles.scheduleRectangleItem_mid)}
                            >
                                <span>{getTranslateText('common.course')}</span>
                                <span>{booking?.course?.name}</span>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div
                                className={cn(
                                    styles.scheduleRectangleItem_right
                                )}
                            >
                                <span>
                                    {getTranslateText('booking.student')}
                                </span>
                                <span>{`${booking?.student?.full_name}`}</span>
                                <div className={cn(styles.groupDot)}>
                                    <div className={cn(styles.dot)} />
                                    <div className={cn(styles.dot)} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Modal
                    maskClosable
                    centered
                    visible={visible}
                    title={getTranslateText('teacher.confirm_popup.absent')}
                    closeIcon={false}
                    closable={false}
                    onCancel={hiddenModal}
                    onOk={onOkeReason}
                >
                    <Form.Item
                        label={getTranslateText('booking.absent.reason')}
                        style={{ marginBottom: 0 }}
                    >
                        <TextArea ref={refInputReason} />
                    </Form.Item>
                </Modal>

                <AbsentRequestModal
                    visible={visibleModal}
                    toggleModal={toggleModal}
                    data={booking.calendar as any}
                    method={EnumModalType.ADD_NEW_ON_SCHEDULE}
                    refetchData={reload}
                />
            </div>
        </>
    )
}

export default memo(TeachingScheduleItem)
