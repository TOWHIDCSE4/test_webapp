import moment from 'moment'
import cn from 'classnames'
import { Card, Avatar, Rate, Dropdown, Col, Menu } from 'antd'
import { FC, memo, useCallback } from 'react'
import { IBooking } from 'types'
import { DEFAULT_AVATAR_STUDENT } from 'const'
import { getTranslateText } from 'utils/translate-utils'
import { hasHTTPUrl } from 'utils/string-utils'
import { notify } from 'contexts/Notification'
import { renderColorStatus } from 'utils/color'
import { useRouter } from 'next/router'
import { encodeFilenameFromLink } from 'utils/functions'
import styles from './LeftBlock.module.scss'
import { SoundOutlined } from '@ant-design/icons'

type Props = {
    data: IBooking
}

const LeftBlock: FC<Props> = ({ data }) => {
    const router = useRouter()

    const TitleCard = () => (
        <div>
            <div className='d-flex'>
                <div className={cn(styles.calendar)}>
                    {data?.calendar &&
                        moment(data?.calendar.start_time).format(
                            'ddd, MMM DD YYYY'
                        )}
                </div>
                <div className={cn(styles.bookingId)}>
                    <span>{getTranslateText('lesson_id')}</span>: {data?.id}
                </div>
            </div>
            <div className={cn(styles.time)}>
                <span>
                    {data?.calendar &&
                        moment(data.calendar.start_time).format('HH:mm')}
                    <span className='ml-4 mr-4'>-</span>
                    {data?.calendar &&
                        moment(data.calendar.end_time).format('HH:mm')}
                </span>
                {data?.report?.report_content?.rating && (
                    <span className={cn(styles.rating)}>
                        <Rate
                            value={data.report.report_content.rating}
                            disabled
                        />
                    </span>
                )}
            </div>
        </div>
    )
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
        [data]
    )

    const doHomework = () => {
        if (data?.unit?.homework || data?.unit?.homework2) {
            router.push(`/student/homework/${data.id}`)
        }
    }

    const onViewVideo = () => {
        const recordLink = data?.record_link
        if (recordLink) {
            if (typeof recordLink === 'string') {
                window.open(encodeFilenameFromLink(recordLink), '_blank')
            } else {
                for (const iterator of recordLink as any) {
                    window.open(encodeFilenameFromLink(iterator), '_blank')
                }
            }
        }
    }

    const showListAudio = () => {
        if (
            !Array.isArray(data?.unit?.audio) ||
            (Array.isArray(data?.unit?.audio) && data?.unit?.audio.length === 1)
        ) {
            return (
                <p>
                    <b>{getTranslateText('student.booking.audioLesson')}:</b>
                    <a
                        className='ml-2 clickable'
                        href='#'
                        onClick={() =>
                            onViewDocument(
                                Array.isArray(data?.unit?.audio)
                                    ? data?.unit?.audio[0]
                                    : data?.unit?.audio
                            )
                        }
                    >
                        {getTranslateText('student.booking.viewAudio')}
                    </a>
                </p>
            )
        }
        const menu = (
            <Menu>
                {Array.isArray(data?.unit?.audio) &&
                    data?.unit?.audio.length > 1 &&
                    data?.unit?.audio.map((item: any, index: number) => (
                        <Menu.Item
                            key={index}
                            onClick={() => onViewDocument(item)}
                        >
                            <span className='pl-1'>
                                {getTranslateText('student.booking.viewAudio')}{' '}
                                {index + 1}
                            </span>
                        </Menu.Item>
                    ))}
            </Menu>
        )

        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <p>
                    <a className='ml-2 clickable' href='#'>
                        {getTranslateText('student.booking.viewAudio')}
                    </a>
                </p>
            </Dropdown>
        )
    }

    return (
        <Card
            title={<TitleCard />}
            headStyle={{
                backgroundImage: `linear-gradient(270deg, ${renderColorStatus(
                    data?.status
                )}, ${renderColorStatus(data?.status)})`,
                borderRadius: '10px 10px 0 0'
            }}
            style={{ borderRadius: '10px' }}
        >
            <div className='d-flex'>
                <Avatar
                    src={data?.teacher?.avatar || DEFAULT_AVATAR_STUDENT}
                    alt='Avatar'
                    size={50}
                />
                <span className={cn('ml-3', styles.teacherInfo)}>
                    <p>{data?.teacher && data?.teacher.full_name}</p>
                    <p>{getTranslateText('student.booking.teacher')}</p>
                </span>
            </div>
            <div className='ml-5 mt-5 mb-5'>
                <p className={cn(styles.info)}>
                    <b>{getTranslateText('student.booking.course')}: </b>
                    <strong className='ml-2'>{data?.course?.name}</strong>
                </p>
                <p className={cn(styles.info)}>
                    <b>{getTranslateText('student.booking.unit')}:</b>
                    <strong className='ml-2'>{data?.unit?.name}</strong>
                </p>
                {data?.unit?.student_document && (
                    <p>
                        <b>
                            {getTranslateText('student.booking.documentLesson')}
                            :
                        </b>
                        <a
                            className='ml-2 clickable'
                            href='#'
                            onClick={() =>
                                onViewDocument(data?.unit?.student_document)
                            }
                        >
                            {getTranslateText('student.booking.viewDocument')}
                        </a>
                    </p>
                )}
                {data?.unit?.audio && data?.unit?.audio.length > 0 && (
                    <p style={{ display: 'flex' }}>
                        <b>
                            {getTranslateText('student.booking.audioLesson')}:
                        </b>
                        {showListAudio()}
                    </p>
                )}
                {data?.unit?.workbook && (
                    <p>
                        <b>{getTranslateText('student.booking.workbook')}:</b>
                        <a
                            className='ml-2 clickable'
                            href={encodeFilenameFromLink(data?.unit?.workbook)}
                            style={{ color: '#1890ff' }}
                            target='_blank'
                            rel='noreferrer'
                        >
                            {getTranslateText('student.booking.viewWorkbook')}
                        </a>
                    </p>
                )}
                {data?.record_link && (
                    <p>
                        <b>
                            {getTranslateText('teacher.sidebar.video_lesson')}:
                        </b>
                        <a
                            className='ml-2 clickable'
                            onClick={onViewVideo}
                            target='_blank'
                            style={{ color: '#1890ff' }}
                            rel='noreferrer'
                        >
                            {getTranslateText('student.booking.viewVideo')}
                        </a>
                    </p>
                )}
                {(data?.unit?.homework_id || data?.unit?.homework2_id) && (
                    <div className='d-flex justify-content-start'>
                        <button
                            className='btn my-2 my-sm-0 big-bt big-bt2'
                            type='button'
                            onClick={doHomework}
                        >
                            <span className='color-white'>
                                {getTranslateText('do_homework')}
                            </span>
                            <img
                                src='/static/img/homepage/bt.png'
                                alt={getTranslateText('do_homework')}
                            />
                        </button>
                    </div>
                )}
            </div>
            {/* <Memo data={data} /> */}
        </Card>
    )
}

export default memo(LeftBlock)
