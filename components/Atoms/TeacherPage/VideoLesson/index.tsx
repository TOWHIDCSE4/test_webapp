import React, { useCallback, useEffect } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import { Table, Card, notification, Tag, Popover } from 'antd'
import { PhoneOutlined, SkypeOutlined } from '@ant-design/icons'
import moment from 'moment'
import _ from 'lodash'
import { ColumnsType } from 'antd/lib/table'
import { EnumOrderType, IBooking } from 'types'
import BookingAPI from 'api/BookingAPI'
import { useAuth } from 'contexts/Auth'
import { Logger } from 'utils/logger'

const VideoLesson = () => {
    const { teacherInfo } = useAuth()

    const [bookings, setBookings] = React.useState([])
    const [total, setTotal] = React.useState(0)
    const [pageNumber, setPageNumber] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const [isLoading, setIsLoading] = React.useState(false)

    const fetchVideos = useCallback(
        async (query?: { pageNumber?: number; pageSize?: number }) => {
            setIsLoading(true)
            BookingAPI.getBookingsByTeacher({
                page_number: query?.pageNumber,
                page_size: query?.pageSize,
                recorded: true
            })
                .then((res) => {
                    setBookings(res.data)
                    setTotal(res.pagination.total)
                })
                .catch((err) => {
                    Logger.error(err)
                })
                .finally(() => setIsLoading(false))
        },
        []
    )

    useEffect(() => {
        fetchVideos()
    }, [])

    const handleChangePagination = useCallback((page_number, page_size) => {
        setPageSize(page_size)
        setPageNumber(page_number)
        fetchVideos({
            pageSize: page_size,
            pageNumber: page_number
        })
    }, [])

    const columns: ColumnsType<IBooking> = [
        {
            title: getTranslateText('table.header.stt'),
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 80,
            render: (text, record, index) => index + 1
        },
        {
            title: getTranslateText('table.header.booking_id'),
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 120,
            render: (text) => text
        },
        {
            title: getTranslateText('common.time'),
            dataIndex: 'calendar',
            key: 'calendar',
            align: 'center',
            width: 150,
            render: (text, record) => (
                <>
                    <p>
                        {text &&
                            moment(text.start_time).format('HH:mm DD/MM/YYYY')}
                    </p>
                </>
            )
        },
        {
            title: getTranslateText('common.type'),
            dataIndex: 'calendar',
            key: 'calendar',
            align: 'center',
            width: 120,
            render: (text, record) => {
                if (record?.ordered_package?.type === EnumOrderType.TRIAL) {
                    return <Tag color='#87d068'>TRIAL</Tag>
                }
                if (record?.is_regular_booking) {
                    return <Tag color='#f50'>REGULAR</Tag>
                }
                return <Tag color='#108ee9'>FLEXIBLE</Tag>
            }
        },
        {
            title: getTranslateText('table.header.class'),
            dataIndex: 'teacher',
            key: 'teacher',
            align: 'left',
            width: 250,
            render: (text, record: any) => (
                <Popover
                    content={
                        <>
                            <b>Student:</b>
                            <span className='ml-1'>
                                {record.student &&
                                    `${record.student.full_name}`}
                            </span>
                            <br />
                            <PhoneOutlined className='mr-2' />
                            <span className='ml-1'>
                                {record.student && record.student.phone_number}
                            </span>
                            <br />
                            <SkypeOutlined className='mr-2' />
                            <span className='ml-1'>
                                {record.student && record.student.skype_account}
                            </span>
                        </>
                    }
                >
                    <Tag color='gold'>
                        <b>Student:</b>{' '}
                        {record.student && `${record.student.full_name}`}
                    </Tag>
                </Popover>
            )
        },
        {
            title: getTranslateText('common.course'),
            dataIndex: 'course',
            key: 'course',
            align: 'left',
            width: 250,
            render: (text, record: any) => (
                <Popover
                    title=''
                    content={
                        <>
                            <br />
                            <b>Course: {text && text.name}</b>
                            <br />
                            <b>Unit: {record.unit && record.unit.name}</b>
                        </>
                    }
                >
                    <span>{text && text.name}</span>
                </Popover>
            )
        },
        {
            title: 'Video',
            key: 'record_link',
            dataIndex: 'record_link',
            fixed: 'right',
            align: 'center',
            width: 120,
            render: (text, record) => (
                <a href={text} target='_blank' rel='noreferrer'>
                    Watch video
                </a>
            )
        }
    ]
    return (
        <Card title={getTranslateText('teacher.sidebar.video_lesson')}>
            <Table
                loading={isLoading}
                columns={columns}
                bordered
                dataSource={bookings.map((d, i) => ({ ...d, key: i }))}
                pagination={{
                    defaultCurrent: pageNumber,
                    pageSize,
                    total,
                    onChange: handleChangePagination
                }}
            />
        </Card>
    )
}

export default VideoLesson
