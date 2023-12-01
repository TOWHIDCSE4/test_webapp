import React, { useEffect, useState, memo, useRef } from 'react'
import cn from 'classnames'
import BookingAPI from 'api/BookingAPI'
import {
    Empty,
    Pagination,
    Spin,
    notification,
    Select,
    DatePicker,
    Space
} from 'antd'
import _ from 'lodash'
import moment from 'moment'
import BookingItem from 'components/Atoms/StudentPage/BookingItem'
import { LESSON_STATUS, LESSON_STATUS_ENUM } from 'const/lesson-status'
import { DATE_FORMAT, EnumBookingSort } from 'const'
import { EnumOrderType, IBooking } from 'types'
import { useBookingContext } from 'contexts/Booking'
import MemoModal from 'components/Atoms/TeacherPage/Dashboard/MemoModal'
import UtilsAPI from 'api/UtilsAPI'
import { notify } from 'contexts/Notification'

const { Option } = Select
const { RangePicker } = DatePicker
let idInterval: any = 0
let idIntervalReGetTimeServer: any = 0

const exclude_status: number[] = [
    LESSON_STATUS_ENUM.COMPLETED,
    LESSON_STATUS_ENUM.STUDENT_ABSENT,
    LESSON_STATUS_ENUM.TEACHER_ABSENT,
    LESSON_STATUS_ENUM.CANCEL_BY_STUDENT,
    LESSON_STATUS_ENUM.CANCEL_BY_TEACHER,
    LESSON_STATUS_ENUM.CANCEL_BY_ADMIN,
    LESSON_STATUS_ENUM.TEACHER_CONFIRM
]
const MyBooking = () => {
    const { rangePickerValue, setRangePickerValue } = useBookingContext()

    const memoModalRef = useRef()

    const [bookings, setBookings] = useState<IBooking[]>([])
    const [isLoading, setLoading] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [status, setStatus] = useState(-1)
    const [selectedTrialBooking, setSelectedTrialBooking] =
        useState<IBooking>(null)
    const [selectedRegularBooking, setSelectedRegularBooking] =
        useState<IBooking>(null)
    const [min_start_time, setMinTime] = useState(
        moment().startOf('day').valueOf()
    )
    const [max_end_time, setMaxTime] = useState(
        moment().add(7, 'days').endOf('day').valueOf()
    )
    const [timestampNow, setTimestampNow] = useState<number>(null)

    const getLearningHistory = (query: {
        page_size?: number
        page_number?: number
        status: any
        min_start_time: number
        max_end_time: number
    }) => {
        setLoading(true)
        BookingAPI.getBooking({
            page_number: query.page_number,
            page_size: query.page_size,
            status: query.status !== -1 ? query.status : '',
            min_start_time: query.min_start_time,
            max_end_time: query.max_end_time,
            exclude_status,
            sort: EnumBookingSort.UPCOMING
        })
            .then((res) => {
                setBookings(res.data)
                if (res.pagination && res.pagination.total >= 0) {
                    setTotal(res.pagination.total)
                }
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
            .finally(() => setLoading(false))
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

    const handleChangePagination = (_pageNumber, _pageSize) => {
        setPageNumber(_pageNumber)
        setPageSize(_pageSize)
        getLearningHistory({
            page_number: _pageNumber,
            page_size: _pageSize,
            status,
            min_start_time,
            max_end_time
        })
    }

    const refetchData = () => {
        getLearningHistory({
            page_size: pageSize,
            page_number: pageNumber,
            status,
            min_start_time,
            max_end_time
        })
    }
    useEffect(() => {
        getLearningHistory({
            page_number: pageNumber,
            page_size: pageSize,
            status,
            min_start_time,
            max_end_time
        })
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

    const onChangeStatus = (value) => {
        if (value.status !== value) {
            setStatus(value)
            setPageNumber(1)
            getLearningHistory({
                page_size: pageSize,
                page_number: 1,
                status: value,
                max_end_time,
                min_start_time
            })
        }
    }

    const onChangeDate = (value) => {
        if (value) {
            const minStartTime = value[0]
            const maxEndTime = value[1]
            setRangePickerValue([
                minStartTime.startOf('day').valueOf(),
                maxEndTime.endOf('day').valueOf()
            ])

            if (minStartTime.startOf('day').valueOf() !== min_start_time) {
                setMinTime(minStartTime.startOf('day').valueOf())
            }

            if (maxEndTime.startOf('day').valueOf() !== max_end_time) {
                setMaxTime(maxEndTime.endOf('day').valueOf())
            }
            setPageNumber(1)
            getLearningHistory({
                page_size: pageSize,
                page_number: 1,
                status,
                max_end_time: maxEndTime.endOf('day').valueOf(),
                min_start_time: minStartTime.startOf('day').valueOf()
            })
        } else {
            setMinTime(null)
            setMaxTime(null)
            setPageNumber(1)
            getLearningHistory({
                page_size: pageSize,
                page_number: 1,
                status,
                max_end_time: null,
                min_start_time: null
            })
        }
    }

    const openMemoModal = (booking) => {
        if (!booking) {
            return
        }

        if (booking.ordered_package?.type === EnumOrderType.TRIAL) {
            setSelectedTrialBooking(booking)
            return
        }
        setSelectedRegularBooking(booking)
    }

    const disabledDate = (current) =>
        // Can not select days before today and today
        current && current < moment().endOf('day')

    const renderFilter = () => (
        <Space direction='horizontal' size={20}>
            <Select
                defaultValue={-1}
                style={{ width: 200 }}
                onChange={onChangeStatus}
            >
                {LESSON_STATUS.filter(
                    (item, index) =>
                        !exclude_status.includes(item.id) &&
                        item.id !== LESSON_STATUS_ENUM.PENDING
                ).map((item, index) => (
                    <Option value={item.id} key={index}>
                        {item.name}
                    </Option>
                ))}
            </Select>

            <RangePicker
                defaultValue={[moment(min_start_time), moment(max_end_time)]}
                format={DATE_FORMAT}
                onChange={onChangeDate}
                disabledDate={disabledDate}
            />
        </Space>
    )

    const renderMyBookings = () => {
        if (_.isEmpty(bookings)) {
            return <Empty style={{ marginTop: 40 }} />
        }

        return bookings.map((item, index) => (
            <div className={cn('mt-3 mb-3')} key={index}>
                <BookingItem
                    data={item}
                    refetchData={refetchData}
                    openMemoModal={openMemoModal}
                    showHomework={false}
                    timestampNow={timestampNow}
                />
            </div>
        ))
    }

    return (
        <>
            <div className={cn('mt-3')}>
                {renderFilter()}
                <div
                    style={{
                        color: '#FF4D4F',
                        fontSize: '13px',
                        fontStyle: 'italic',
                        marginTop: '10px',
                        fontWeight: 600
                    }}
                >
                    Đối với học viên có lịch học cố định: lớp học sẽ hiển thị từ
                    trước lịch học 3 ngày
                </div>
                {isLoading ? (
                    <div className='mb-3 d-flex justify-content-center'>
                        <Spin size='large' />
                    </div>
                ) : (
                    renderMyBookings()
                )}
                {!isLoading && total > 0 && (
                    <div className='mb-3 d-flex justify-content-end'>
                        <Pagination
                            defaultCurrent={pageNumber}
                            pageSize={pageSize}
                            total={total}
                            onChange={handleChangePagination}
                        />
                    </div>
                )}
            </div>

            <MemoModal
                type='trial'
                visible={!!selectedTrialBooking}
                close={() => setSelectedTrialBooking(null)}
                data={selectedTrialBooking}
            />

            <MemoModal
                type='other'
                visible={!!selectedRegularBooking}
                close={() => setSelectedRegularBooking(null)}
                data={selectedRegularBooking}
            />
        </>
    )
}

export default memo(MyBooking)
