import React, { useEffect, useState, memo } from 'react'
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
import BookingItem from 'components/Atoms/StudentPage/BookingItem'
import { LESSON_STATUS, LESSON_STATUS_ENUM } from 'const/lesson-status'
import { BOOKING_STATUS, DATE_FORMAT, EnumBookingSort } from 'const'
import { EnumOrderType, IBooking } from 'types'
import { useBookingContext } from 'contexts/Booking'
import MemoModal from 'components/Atoms/TeacherPage/Dashboard/MemoModal'

const { Option } = Select
const { RangePicker } = DatePicker

const LearningHistory = () => {
    const exclude_status = [
        LESSON_STATUS_ENUM.PENDING,
        LESSON_STATUS_ENUM.UPCOMING,
        LESSON_STATUS_ENUM.CANCEL_BY_ADMIN
    ]

    const { rangePickerValue, setRangePickerValue } = useBookingContext()

    const [bookings, setBookings] = useState<IBooking[]>([])
    const [isLoading, setLoading] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [status, setStatus] = useState(LESSON_STATUS[9].id)
    const [min_start_time, setMinTime] = useState(null)
    const [max_end_time, setMaxTime] = useState(null)
    const [isRating, setIsRating] = useState(null)
    const [selectedTrialBooking, setSelectedTrialBooking] =
        useState<IBooking>(null)
    const [selectedRegularBooking, setSelectedRegularBooking] =
        useState<IBooking>(null)

    const getLearningHistory = (query: {
        page_size?: number
        page_number?: number
        status: any
        student_rated?: any
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
            student_rated: query.student_rated,
            exclude_status,
            sort: EnumBookingSort.PREV
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

    useEffect(() => {
        getLearningHistory({
            status,
            student_rated: isRating,
            min_start_time,
            max_end_time
        })
    }, [])

    const handleChangePagination = (_pageNumber, _pageSize) => {
        setPageNumber(_pageNumber)
        setPageSize(_pageSize)
        getLearningHistory({
            page_number: _pageNumber,
            page_size: _pageSize,
            status,
            student_rated: isRating,
            min_start_time,
            max_end_time
        })
    }

    const refetchData = () => {
        getLearningHistory({
            page_size: pageSize,
            page_number: pageNumber,
            status,
            student_rated: isRating,
            min_start_time,
            max_end_time
        })
    }

    const onChangeStatus = (value) => {
        if (value.status !== value) {
            setStatus(value)
            setPageNumber(1)
            getLearningHistory({
                page_size: pageSize,
                page_number: 1,
                status: value,
                student_rated: isRating,
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
                student_rated: isRating,
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
                student_rated: isRating,
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

    const onChangeSearchRate = (val, e) => {
        setIsRating(e.value)
        setPageNumber(1)
        getLearningHistory({
            page_size: pageSize,
            page_number: pageNumber,
            status,
            student_rated: e.value,
            min_start_time,
            max_end_time
        })
    }

    const renderFilter = () => (
        <Space direction='horizontal' size={20}>
            <Select
                defaultValue={LESSON_STATUS[9].id}
                style={{ width: 200 }}
                onChange={onChangeStatus}
            >
                {LESSON_STATUS.filter(
                    (item, index) => !exclude_status.includes(item.id)
                ).map((item, index) => (
                    <Option value={item.id} key={index}>
                        {item.name}
                    </Option>
                ))}
            </Select>
            <Select
                allowClear
                defaultValue={null}
                onChange={onChangeSearchRate}
                style={{ minWidth: 150, width: 'auto' }}
                placeholder='Choose Condition'
            >
                <Select.Option value={null}>All</Select.Option>
                <Select.Option value='true'>Rating</Select.Option>
                <Select.Option value='false'>No Rating</Select.Option>
            </Select>

            <RangePicker format={DATE_FORMAT} onChange={onChangeDate} />
        </Space>
    )

    const renderLearningHistory = () => {
        if (_.isEmpty(bookings)) {
            return <Empty style={{ marginTop: 40 }} />
        }
        return bookings.map((item, index) => (
            <div className={cn('mt-3 mb-3')} key={index}>
                <BookingItem
                    data={item}
                    refetchData={refetchData}
                    openMemoModal={openMemoModal}
                    showHomework={item.status === BOOKING_STATUS.COMPLETED}
                />
            </div>
        ))
    }

    return (
        <>
            <div className={cn('mt-3')}>
                {renderFilter()}
                {isLoading ? (
                    <div className='mb-3 d-flex justify-content-center'>
                        <Spin size='large' />
                    </div>
                ) : (
                    renderLearningHistory()
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

export default memo(LearningHistory)
