import React, {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react'
import _ from 'lodash'
import cn from 'classnames'
import Panel from 'components/Atoms/TeacherPage/Panel'
import BookingAPI from 'api/BookingAPI'
import { Pagination, Spin, Select, DatePicker, Form, Empty, Badge } from 'antd'
import {
    EnumOrderType,
    EnumScheduledMemoType,
    IBooking,
    IScheduledMemo
} from 'types'
import ScheduledMemoAPI from 'api/ScheduledMemoAPI'
import moment from 'moment'
import { getTranslateText } from 'utils/translate-utils'
import CourseAPI from 'api/CourseAPI'
import { MAX_HOUR_MEMO, MAX_HOUR_TRIAL_MEMO, MINUTE_TO_MS } from 'const'
import { Logger } from 'utils/logger'
import styles from './TeachingScheduleList.module.scss'
import TeachingScheduleItem from './TeachingScheduleItem'
import TeachingMemoItem from './TeachingMemoItem'
import MemoModal from '../../MemoModal'
import ScheduledMemoModal from '../../ScheduledMemoModal'

const { Option } = Select

const TeachingScheduleList = ({
    keyPane,
    setKeyPane,
    onChangeCounter,
    timestampNow
}) => {
    const [form] = Form.useForm()

    const [memos, setMemos] = useReducer(
        (prev, newState) => ({ ...prev, ...newState }),
        {
            page_size: 5,
            page_number: 1,
            total: 0,
            data: [],
            year: 0,
            month: 0,
            course_id: '',
            teacher_commented: false
        }
    )
    const [bookings, setBookings] = useReducer(
        (prev, newState) => ({ ...prev, ...newState }),
        {
            page_size: 5,
            page_number: 1,
            total: 0,
            data: []
        }
    )
    const [courses, setCourses] = useReducer(
        (prev, newState) => ({ ...prev, ...newState }),
        {
            page_size: 20,
            page_number: 1,
            total: 0,
            data: [],
            search: '',
            isFetching: false
        }
    )

    const [loading, setLoading] = useState(false)
    const [indexCollapse, setIndexCollapse] = useState(0)
    const [visibleTrialMemo, setVisibleTrialMemo] = useState(false)
    const [visibleMemo, setVisibleMemo] = useState(false)

    const [selectedBooking, setSelectedBooking] = useState<IBooking>(null)
    const [selectedScheduledMemo, setSelectedScheduledMemo] =
        useState<IScheduledMemo>(null)
    const [visibleScheduledMemo, setVisibleScheduledMemo] = useState(false)
    // const [time, setTime] = useState(moment().valueOf())

    const toggleModalTrialMemo = useCallback(
        (value: boolean) => {
            setVisibleTrialMemo(value)
        },
        [visibleTrialMemo]
    )

    const toggleModalMemo = useCallback(
        (value: boolean) => {
            setVisibleMemo(value)
        },
        [visibleMemo]
    )

    const toggleScheduledModal = useCallback(
        (value: boolean) => {
            setVisibleScheduledMemo(value)
        },
        [visibleScheduledMemo]
    )

    const getBookingByTeacher = useCallback(
        async (page_number) => {
            setLoading(true)
            return BookingAPI.getBookingsByTeacher({
                page_number: page_number || bookings?.page_number || 1,
                page_size: bookings?.page_size || 5,
                upcoming: 2
            })
                .then((res) => {
                    setBookings({
                        data: res.data,
                        page_number: res?.pagination?.page_number || 1,
                        total: res?.pagination?.total || 0
                    })
                    if (res?.pagination?.total) {
                        onChangeCounter({ schedules: res.pagination.total })
                    }
                    return res
                })
                .catch((err) => {
                    Logger.error(err)
                })
                .finally(() => setLoading(false))
        },
        [bookings]
    )

    const getCourses = (query?: {
        page_size: number
        page_number: number
        search?: string
    }) => {
        CourseAPI.getCoursesByPackage({
            page_size: query.page_size,
            page_number: query.page_number,
            package_ids: [],
            search: query?.search
        })
            .then((res) => {
                let newCourses = [...res.data]
                if (query.page_number > 1) {
                    newCourses = [...courses.data, ...res.data]
                }
                setCourses({ data: newCourses, total: res.pagination.total })
            })
            .catch((err) => {
                Logger.error(err)
            })
    }

    const loadMore = () => {
        if (courses.page_number * courses.page_size < courses.total) {
            getCourses({
                page_size: courses.page_size,
                page_number: courses.page_number + 1,
                search: courses.search
            })
            setCourses({ page_number: courses.page_number + 1 })
        }
    }

    const onSearch = (val) => {
        getCourses({
            page_size: courses.page_size,
            page_number: 1,
            search: val
        })
        setCourses({ page_number: 1, search: val })
    }
    const getMemoByTeacher = useCallback(
        async (page_number) => {
            setLoading(true)
            return BookingAPI.getBookingsByTeacher({
                page_number: page_number || memos.page_number || 1,
                page_size: 5,
                memo: true,
                prev: true
            })
                .then((res) => {
                    setMemos({
                        data: res.data,
                        page_number: res?.pagination?.page_number,
                        total: res?.pagination?.total
                    })
                    if (res?.pagination?.total) {
                        onChangeCounter({ memo: res.pagination.total })
                    }
                    return res
                })
                .catch((err) => {
                    Logger.error(err)
                })
                .finally(() => setLoading(false))
        },
        [memos]
    )

    const getScheduledMemoByTeacher = useCallback(
        (query?: {
            page_size: number
            page_number: number
            type: number
            month?: number
            year?: number
            course_id?: number
            teacher_commented?: boolean
        }) => {
            setLoading(true)
            ScheduledMemoAPI.getScheduledMemos(query)
                .then((res) => {
                    setMemos({
                        data: res.data,
                        page_number: res?.pagination?.page_number,
                        total: res?.pagination?.total
                    })
                    if (res?.pagination?.total) {
                        onChangeCounter({ memo: res.pagination.total })
                    }
                })
                .catch((err) => {
                    Logger.error(err)
                })
                .finally(() => setLoading(false))
        },
        [memos]
    )

    const refetchScheduledMemo = () => {
        if (form.getFieldValue('type') === EnumScheduledMemoType.MONTHLY_MEMO) {
            getScheduledMemoByTeacher({
                page_number: 1,
                page_size: memos.page_size,
                month:
                    form.getFieldValue('month') &&
                    form.getFieldValue('month').get('month') + 1,
                year:
                    form.getFieldValue('month') &&
                    form.getFieldValue('month').get('year'),
                teacher_commented: form.getFieldValue('teacher_commented'),
                type: form.getFieldValue('type')
            })
        } else if (
            form.getFieldValue('type') === EnumScheduledMemoType.COURSE_MEMO
        ) {
            getScheduledMemoByTeacher({
                page_number: 1,
                page_size: memos.page_size,
                teacher_commented: form.getFieldValue('teacher_commented'),
                course_id: form.getFieldValue('course_id'),
                type: form.getFieldValue('type')
            })
        }
    }
    useEffect(() => {
        getBookingByTeacher(bookings.page_number).then((res) => {
            if (res?.data && _.isArray(res.data) && res.data.length > 0) {
                const id = res.data[0]?.id
                if (id) setIndexCollapse(id)
            }
        })
        getMemoByTeacher(memos.page_number)
        getCourses({
            page_size: courses.page_size,
            page_number: courses.page_number
        })
    }, [])

    const onChangePagination = useCallback(
        (page, pageSize) => {
            if (keyPane === 'schedules') {
                getBookingByTeacher(page)
            } else {
                getMemoByTeacher(page)
            }
        },
        [keyPane]
    )

    const onMemo = useCallback(
        (booking) => {
            if (booking) {
                if (
                    form.getFieldValue('type') ===
                    EnumScheduledMemoType.NORMAL_MEMO
                ) {
                    if (booking.ordered_package.type === EnumOrderType.TRIAL) {
                        toggleModalTrialMemo(true)
                        setSelectedBooking(booking)
                    } else {
                        setSelectedBooking(booking)
                        toggleModalMemo(true)
                    }
                } else {
                    toggleScheduledModal(true)
                    setSelectedScheduledMemo(booking)
                }
            }
        },
        [selectedBooking, visibleTrialMemo]
    )

    const onFormChange = (changedValues, allValues) => {
        if (_.keys(changedValues).includes('type')) {
            if (
                _.get(changedValues, 'type') ===
                EnumScheduledMemoType.NORMAL_MEMO
            ) {
                getMemoByTeacher(1)
                setMemos({ page_number: 1 })
            } else if (
                _.get(changedValues, 'type') ===
                EnumScheduledMemoType.MONTHLY_MEMO
            ) {
                getScheduledMemoByTeacher({
                    page_number: 1,
                    page_size: memos.page_size,
                    month:
                        form.getFieldValue('month') &&
                        form.getFieldValue('month').get('month') + 1,
                    year:
                        form.getFieldValue('month') &&
                        form.getFieldValue('month').get('year'),
                    teacher_commented: form.getFieldValue('teacher_commented'),
                    type: _.get(changedValues, 'type')
                })
            } else {
                getScheduledMemoByTeacher({
                    page_number: 1,
                    page_size: memos.page_size,
                    teacher_commented: form.getFieldValue('teacher_commented'),
                    course_id: form.getFieldValue('course_id'),
                    type: _.get(changedValues, 'type')
                })
            }
        } else if (
            _.get(changedValues, 'type') === EnumScheduledMemoType.NORMAL_MEMO
        ) {
            getMemoByTeacher(1)
            setMemos({ page_number: 1 })
        } else if (
            _.get(changedValues, 'type') === EnumScheduledMemoType.MONTHLY_MEMO
        ) {
            getScheduledMemoByTeacher({
                page_number: 1,
                page_size: memos.page_size,
                month:
                    form.getFieldValue('month') &&
                    form.getFieldValue('month').get('month') + 1,
                year:
                    form.getFieldValue('month') &&
                    form.getFieldValue('month').get('year'),
                teacher_commented: _.get(allValues, 'teacher_commented'),
                type: _.get(allValues, 'type')
            })
        } else {
            getScheduledMemoByTeacher({
                page_number: 1,
                page_size: memos.page_size,
                course_id: _.get(allValues, 'course_id'),
                teacher_commented: _.get(allValues, 'teacher_commented'),
                type: _.get(allValues, 'type')
            })
        }
    }

    const renderSchedulesBooking = () => {
        if (_.isEmpty(bookings?.data)) {
            return <Empty />
        }

        return bookings?.data?.map((booking) => (
            <TeachingScheduleItem
                key={booking.id}
                setIndex={setIndexCollapse}
                isOpen={indexCollapse === booking.id}
                booking={booking}
                reload={getBookingByTeacher}
                showStartTeaching={
                    timestampNow - booking.calendar.start_time > -600_000 &&
                    timestampNow - booking.calendar.start_time < 600_000
                }
                showFinishTeaching={
                    booking.calendar.end_time - timestampNow < 300000
                }
            />
        ))
    }

    const renderMemos = () => {
        if (_.isEmpty(memos?.data)) {
            return <Empty />
        }

        return memos?.data?.map((book, index) => {
            if (
                form.getFieldValue('type') === EnumScheduledMemoType.NORMAL_MEMO
            ) {
                const endTimeBooking = book?.calendar?.end_time
                const startTimeValid = moment()
                    .subtract(1)
                    .startOf('day')
                    .valueOf()
                const endTimeValid = moment().subtract(1).endOf('day').valueOf()
                const MAX_HOUR =
                    book?.ordered_package?.type === EnumOrderType.TRIAL
                        ? MAX_HOUR_TRIAL_MEMO
                        : MAX_HOUR_MEMO
                if (
                    (endTimeBooking >= startTimeValid &&
                        endTimeBooking <= endTimeValid &&
                        moment() > moment().add('h', MAX_HOUR)) ||
                    endTimeBooking < startTimeValid
                ) {
                    return (
                        <Badge.Ribbon
                            key={index}
                            color='red'
                            text={
                                <span className='mr-2'>
                                    Too late to write memo
                                </span>
                            }
                        >
                            <TeachingMemoItem
                                key={index}
                                setIndex={setIndexCollapse}
                                index={book.id}
                                isOpen={
                                    indexCollapse === book.id ? 'true' : 'false'
                                }
                                booking={book}
                                onMemo={onMemo}
                                memoType={form.getFieldValue('type')}
                            />
                        </Badge.Ribbon>
                    )
                }
                return (
                    <TeachingMemoItem
                        key={index}
                        setIndex={setIndexCollapse}
                        index={book.id}
                        isOpen={indexCollapse === book.id ? 'true' : 'false'}
                        booking={book}
                        onMemo={onMemo}
                        memoType={form.getFieldValue('type')}
                    />
                )
            }
            return (
                <TeachingMemoItem
                    key={index}
                    setIndex={setIndexCollapse}
                    index={book.id}
                    isOpen={indexCollapse === book.id ? 'true' : 'false'}
                    booking={book}
                    onMemo={onMemo}
                    memoType={form.getFieldValue('type')}
                />
            )
        })
    }

    const renderCourses = () =>
        courses.data.map((item, index) => (
            <Option value={item.id} key={item.id}>
                {item.name}
            </Option>
        ))

    const state = keyPane === 'schedules' ? bookings : memos
    return (
        <Panel
            isOpen={
                keyPane === 'schedules' || keyPane === 'schedulesMemo'
                    ? 'true'
                    : 'false'
            }
        >
            <Spin spinning={loading}>
                {keyPane === 'schedules' ? (
                    <div className={cn(styles.teachingSchedule)}>
                        {renderSchedulesBooking()}
                    </div>
                ) : keyPane === 'schedulesMemo' ? (
                    <div className={cn(styles.teachingSchedule)}>
                        <div className='d-flex justify-content-end mb-2'>
                            <Form
                                form={form}
                                layout='inline'
                                onValuesChange={onFormChange}
                                initialValues={{
                                    type: EnumScheduledMemoType.NORMAL_MEMO,
                                    month: null,
                                    teacher_commented: 'false'
                                }}
                            >
                                <Form.Item name='type' className='mb-3'>
                                    <Select
                                        style={{
                                            width: '180px',
                                            borderRadius: '10px'
                                        }}
                                        className={cn(styles.filterMemo)}
                                    >
                                        <Option
                                            value={
                                                EnumScheduledMemoType.NORMAL_MEMO
                                            }
                                        >
                                            {getTranslateText('memo.normal')}
                                        </Option>
                                        <Option
                                            value={
                                                EnumScheduledMemoType.MONTHLY_MEMO
                                            }
                                        >
                                            {getTranslateText('memo.monthly')}
                                        </Option>
                                        <Option
                                            value={
                                                EnumScheduledMemoType.COURSE_MEMO
                                            }
                                        >
                                            {getTranslateText('memo.course')}
                                        </Option>
                                    </Select>
                                </Form.Item>
                                {[
                                    EnumScheduledMemoType.COURSE_MEMO,
                                    EnumScheduledMemoType.MONTHLY_MEMO
                                ].includes(form.getFieldValue('type')) && (
                                    <>
                                        {EnumScheduledMemoType.MONTHLY_MEMO ===
                                            form.getFieldValue('type') && (
                                            <Form.Item
                                                name='month'
                                                className='mb-3'
                                            >
                                                <DatePicker
                                                    picker='month'
                                                    className={cn(
                                                        styles.filterMemo
                                                    )}
                                                    style={{
                                                        width: '180px'
                                                    }}
                                                    disabledDate={(current) =>
                                                        current > moment()
                                                    }
                                                />
                                            </Form.Item>
                                        )}

                                        {EnumScheduledMemoType.COURSE_MEMO ===
                                            form.getFieldValue('type') && (
                                            <Form.Item
                                                name='course_id'
                                                className='mb-3'
                                            >
                                                <Select
                                                    style={{
                                                        width: '250px',
                                                        borderRadius: '10px'
                                                    }}
                                                    className={cn(
                                                        styles.filterMemo
                                                    )}
                                                    placeholder='Filter by course'
                                                    showSearch
                                                    autoClearSearchValue
                                                    allowClear
                                                    filterOption={false}
                                                    loading={courses.isFetching}
                                                    onPopupScroll={loadMore}
                                                    onSearch={_.debounce(
                                                        onSearch,
                                                        300
                                                    )}
                                                >
                                                    {renderCourses()}
                                                    {courses.isFetching && (
                                                        <Option
                                                            key='loading'
                                                            value=''
                                                        >
                                                            <Spin size='small' />
                                                        </Option>
                                                    )}
                                                </Select>
                                            </Form.Item>
                                        )}
                                        <Form.Item
                                            name='teacher_commented'
                                            className='mb-3'
                                        >
                                            <Select
                                                style={{
                                                    width: '180px',
                                                    borderRadius: '10px'
                                                }}
                                                className={cn(
                                                    styles.filterMemo
                                                )}
                                                placeholder='Filter by commented'
                                            >
                                                <Option value='true'>
                                                    {getTranslateText(
                                                        'memo.commented'
                                                    )}
                                                </Option>
                                                <Option value='false'>
                                                    {getTranslateText(
                                                        'memo.non_commented'
                                                    )}
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                    </>
                                )}
                            </Form>
                        </div>
                        {renderMemos()}
                    </div>
                ) : null}
            </Spin>
            <MemoModal
                type='other'
                visible={visibleMemo}
                close={() => toggleModalMemo(false)}
                data={selectedBooking}
                callback={getMemoByTeacher}
            />
            <MemoModal
                type='trial'
                visible={visibleTrialMemo}
                close={() => toggleModalTrialMemo(false)}
                data={selectedBooking}
            />
            <ScheduledMemoModal
                visible={visibleScheduledMemo}
                toggleModal={toggleScheduledModal}
                data={selectedScheduledMemo}
                memoType={form.getFieldValue('type')}
                refetchData={refetchScheduledMemo}
            />
            {Math.ceil(state.total / state.page_size) > 1 && (
                <div className='d-flex justify-content-end m-3'>
                    <Pagination
                        current={state.page_number}
                        pageSize={state.page_size}
                        total={state.total}
                        onChange={onChangePagination}
                    />
                </div>
            )}
        </Panel>
    )
}

export default TeachingScheduleList
