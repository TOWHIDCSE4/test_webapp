import { useEffect, useState, useCallback } from 'react'
import TeacherAPI from 'api/TeacherAPI'
import UserAPI from 'api/UserAPI'
import { notify } from 'contexts/Notification'
import _, { values } from 'lodash'
import { Empty, Pagination, Spin, Alert, DatePicker } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import { useRouter } from 'next/router'
import { LOCATION_ID_ASIAN, LOCATION_ID_VIETNAM, MAX_PAGE_SIZE } from 'const'
import OrderAPI from 'api/OrderAPI'
import moment from 'moment'
import PackageAPI from 'api/PackageAPI'
import Link from 'next/link'
import BlockHeader from '../BlockHeader'
import TeacherFilter, {
    EnumTypeFilter,
    PAGE_SIZE_FILTER_CALENDAR
} from './TeacherFilter'
import TeacherCard from './TeacherCard'

const queryString = require('query-string')

const FindATeacher = () => {
    const router = useRouter()

    const queryRoute = router.query
    const [time, setTime] = useState(moment())
    const [teachers, setTeachers] = useState([])
    const [packages, setPackages] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(PAGE_SIZE_FILTER_CALENDAR)
    const [total, setTotal] = useState(0)
    const [student, setStudent] = useState<any>({})
    const [filter, setFilter] = useState<any>({
        name1: '',
        name2: '',
        start_time: moment()
            .set('h', 7)
            .set('m', 30)
            .set('second', 0)
            .set('millisecond', 0),
        location_id: '',
        subject_ids: [],
        type_filter: EnumTypeFilter.FIND_CLASS
    })
    const [countOrder, setCountOrder] = useState<any>({
        count_premium: 0,
        count_standard: 0
    })
    // const [filter, setFilter] = useState({
    //     location_id: [],
    //     subject_ids: [],
    //     keyword: '',
    //     calendar: {
    //         start_time: '',
    //         end_time: '',
    //         hour_of_day: '',
    //         day_of_week: '',
    //         timezone_offset: -7
    //     }
    // })

    const getAllTeachers = (
        query?: {
            page_size?: number
            page_number?: number
        },
        payload?: {
            name1?: string
            name2?: string
            location_id?: number
            subject_ids?: number[]
            subject_skill?: number[]
            calendar?: any
            type_filter?: any
            start_time?: any
        }
    ) => {
        setLoading(true)
        let startTime = payload.start_time
        if (typeof payload.start_time === 'object') {
            startTime = payload.start_time.clone().valueOf()
        }
        let valueName = payload?.name1
        if (payload?.type_filter === EnumTypeFilter.FIND_TEACHER_INFO) {
            valueName = payload?.name2
        }
        const payloadData = {
            ...payload,
            start_time: startTime,
            name: valueName
        }
        TeacherAPI.getTeachers(
            {
                page_size: query.page_size,
                page_number: query.page_number
            },
            payloadData
        )
            .then((res) => {
                setTeachers(res.data)
                if (res.pagination && res.pagination.total >= 0) {
                    setTotal(res.pagination.total)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    const getStudentInfo = () => {
        UserAPI.getFullInfo()
            .then((res) => {
                setStudent(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const getCountOrder = () => {
        OrderAPI.countOrders()
            .then((res) => {
                if (res.count) {
                    setCountOrder(res.count)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const getPackages = () => {
        OrderAPI.getOrderedPackage({
            page_size: 999,
            page_number: 1,
            activated: true,
            finished: false
        })
            .then((res) => {
                if (res.data) {
                    setPackages(res.data)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const handleChangePagination = (_pageNumber, _pageSize) => {
        setPageNumber(_pageNumber)
        setPageSize(_pageSize)
        const newFilter = {
            ...filter,
            page_size: _pageSize,
            page_number: _pageNumber
        }
        const _query: any = {
            page_number: _pageNumber,
            page_size: _pageSize
        }
        getAllTeachers(_query, newFilter)
        // router.push({
        //     pathname: '/student/find-a-teacher',
        //     query: newFilter
        // })
    }

    useEffect(() => {
        getStudentInfo()
        getCountOrder()
        getPackages()
    }, [])

    useEffect(() => {
        const _query: any = {
            page_number: pageNumber,
            page_size: pageSize
        }
        const newFilter: any = {
            ...filter
        }
        console.log(queryRoute)
        if (queryRoute) {
            if (
                queryRoute.page_size &&
                !_.isNaN(Number(queryRoute.page_size)) &&
                _.toInteger(queryRoute.page_size) <= PAGE_SIZE_FILTER_CALENDAR
            ) {
                _query.page_size = queryRoute.page_size
                setPageSize(_query.page_size)
            }
            if (
                queryRoute.page_number &&
                !_.isNaN(Number(queryRoute.page_number)) &&
                _.toInteger(queryRoute.page_number)
            ) {
                _query.page_number = queryRoute.page_number
                setPageNumber(_query.page_number)
            }
            if (queryRoute.type_filter) {
                newFilter.type_filter = Number(queryRoute.type_filter)
            }
            if (queryRoute.start_time) {
                newFilter.start_time = queryRoute.start_time
            }
            if (queryRoute.name1) {
                newFilter.name1 = queryRoute.name1
            }
            if (queryRoute.name2) {
                newFilter.name2 = queryRoute.name2
            }
            if (queryRoute.location_id) {
                newFilter.location_id = _.isArray(queryRoute.location_id)
                    ? queryRoute.location_id?.map((x) => _.toInteger(x))
                    : [_.toInteger(queryRoute.location_id)]
            }
            if (queryRoute.subject_ids) {
                newFilter.subject_ids = _.isArray(queryRoute.subject_ids)
                    ? queryRoute.subject_ids?.map((x) => _.toInteger(x))
                    : [_.toInteger(queryRoute.subject_ids)]
            }
        }
        if (!_.isEmpty(newFilter)) setFilter(newFilter)
        getAllTeachers(_query, newFilter)
    }, [queryRoute])

    const onBookingModal = (teacher) => {
        const newFilter = {
            ...filter,
            page_size: pageSize,
            page_number: pageNumber
        }
        const redirect = `/student/find-a-teacher&${queryString.stringify(
            newFilter,
            {
                skipNull: true,
                skipEmptyString: true
            }
        )}`
        router.push(
            `/student/booking/${teacher.user_id}?redirect=${encodeURI(
                redirect
            )}&teacher_location_id=${teacher.location_id}`
        )
    }

    const handleFilter = useCallback(
        (_filter) => {
            setFilter({
                ...filter,
                ..._filter
            })
            const newFilter = {
                ...filter,
                ..._filter,
                page_number: 1
            }
            setPageNumber(1)
            let pageSizeValue = pageSize
            if (_filter.type_filter === EnumTypeFilter.FIND_CLASS) {
                setPageSize(PAGE_SIZE_FILTER_CALENDAR)
                pageSizeValue = PAGE_SIZE_FILTER_CALENDAR
            } else {
                setPageSize(10)
                pageSizeValue = 10
            }
            const _query: any = {
                page_number: 1,
                page_size: pageSizeValue
            }
            getAllTeachers(_query, newFilter)
            // router.push({
            //     pathname: '/student/find-a-teacher',
            //     query: newFilter
            // })
        },
        [pageSize]
    )
    const checkDisable = (teacher) => {
        const teacherLocation = Number(teacher.location_id)
        // eslint-disable-next-line no-restricted-syntax
        for (const iterator of packages) {
            const packageLocation = Number(iterator.package.location_id)
            if (
                packageLocation === LOCATION_ID_ASIAN &&
                (teacherLocation === LOCATION_ID_ASIAN ||
                    teacherLocation === LOCATION_ID_VIETNAM)
            ) {
                return true
            }
            if (
                packageLocation !== LOCATION_ID_ASIAN &&
                teacherLocation === packageLocation
            ) {
                return true
            }
        }

        return false
    }

    const renderTeacherCard = () => {
        if (isLoading) {
            return (
                <div className='mt-3 d-flex justify-content-center'>
                    <Spin spinning={isLoading} size='large' />
                </div>
            )
        }
        if (_.isEmpty(teachers)) {
            return <Empty />
        }

        return teachers.map((teacher, index) => {
            let disabledBtnBooking = true
            if (countOrder.count_standard !== 0) {
                disabledBtnBooking = !checkDisable(teacher)
            }
            return (
                <div key={index} className='mb-3'>
                    <TeacherCard
                        key={index}
                        data={teacher}
                        onBooking={onBookingModal}
                        disabledBtnBooking={disabledBtnBooking}
                        time={time}
                    />
                </div>
            )
        })
    }
    return (
        <>
            <BlockHeader title={getTranslateText('find_a_teacher')} />
            <div className='mb-3'>
                <TeacherFilter
                    time={time}
                    setTime={setTime}
                    onFilter={handleFilter}
                    filter={filter}
                />
            </div>

            {!isLoading && countOrder.count_standard === 0 && (
                <div className='mb-3'>
                    <Alert
                        message={getTranslateText('common.warning')}
                        description={
                            <>
                                {getTranslateText('warning_booking_standard')}{' '}
                                <Link href='/student/upgrade'>
                                    {getTranslateText('buy_now')}
                                </Link>
                            </>
                        }
                        type='warning'
                        showIcon
                    />
                </div>
            )}

            {renderTeacherCard()}

            {!isLoading && total > 0 && pageSize < 1000 && (
                <div className='mb-3 d-flex justify-content-end'>
                    <Pagination
                        defaultCurrent={pageNumber}
                        pageSize={pageSize}
                        total={total}
                        onChange={handleChangePagination}
                    />
                </div>
            )}
        </>
    )
}

export default FindATeacher
