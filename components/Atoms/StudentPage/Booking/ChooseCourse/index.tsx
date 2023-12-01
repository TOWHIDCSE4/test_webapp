import React, { FC, memo, useEffect, useState } from 'react'
import CourseAPI from 'api/CourseAPI'
import OrderAPI from 'api/OrderAPI'
import { notify } from 'contexts/Notification'
import cn from 'classnames'
import { Spin, Row, Col, Select, Empty, Button, Input } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import {
    EnumCourseTag,
    EnumFrequencyType,
    EnumOrderType,
    ICourse,
    IOrderedPackage
} from 'types'
import _ from 'lodash'
import { useRouter } from 'next/router'
import moment from 'moment'
import BookingAPI from 'api/BookingAPI'
import styles from './ChooseCourse.module.scss'
import CourseCard from './CourseCard'

const { Option } = Select
const { Search } = Input

type Props = {
    selectCourseId: number | string
    TimeChoose: any
    onChangeOrder: (val: IOrderedPackage) => void
    onChangeCourse: (val: ICourse) => void
    setShowErrorChooseTime: (val: boolean) => void
    setShowErrorChooseTime2: (val: boolean) => void
}

const ChooseCourse: FC<Props> = ({
    selectCourseId,
    TimeChoose,
    onChangeCourse,
    onChangeOrder,
    setShowErrorChooseTime,
    setShowErrorChooseTime2
}) => {
    const [studentPackages, setStudentPackage] = useState<IOrderedPackage[]>([])
    const [courses, setCourses] = useState<ICourse[]>([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [packageId, setPackageId] = useState<number>() // goi hoc phi ma hoc vien chon
    const [orderId, setOrderId] = useState<number>() // goi hoc phi ma hoc vien chon
    const [total_lessons, settotalLessons] = useState<number>()
    const [recentLearnt, setRecentLearnt] = useState<ICourse>()
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState('')
    const [tags, setTags] = useState<EnumCourseTag[]>([])
    const [showErrorDailyChoosePackage, setShowErrorDailyChoosePackage] =
        useState(false)
    const [showErrorChooseDailyPackage2, setShowErrorDailyChoosePackage2] =
        useState(false)
    const router = useRouter()

    const current_date_start_time = moment().startOf('day').valueOf()
    const current_date_end_time = moment().endOf('day').valueOf()

    const getMyPackages = async () => {
        let my_packages = []
        try {
            const res = await OrderAPI.getOrderedPackage({
                activated: true,
                expired: false,
                finished: false,
                type: EnumOrderType.STANDARD,
                page_number: 1,
                page_size: 20,
                teacher_location_id: Number(router.query.teacher_location_id)
            })
            setStudentPackage(res.data)
            my_packages = res.data
        } catch (err) {
            notify('error', err.message)
        } finally {
            setLoading(false)
        }
        return my_packages
    }

    const getCourses = (
        package_id,
        query?: {
            page_size: number
            page_number: number
            search?: string
            tags?: EnumCourseTag[]
        }
    ) => {
        setLoading(true)
        CourseAPI.getCoursesByPackage({ ...query, package_ids: [package_id] })
            .then((res) => {
                let newCourse = []
                if (query?.page_number > 1) {
                    newCourse = [...courses, ...res.data]
                } else {
                    newCourse = [...res.data]
                }
                setCourses(newCourse)
                setTotal(res.pagination.total)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    const checkBookingOfDailyPackage = (package_id) => {
        BookingAPI.getBookingOfDailyPackage(package_id)
            .then((res) => {
                if (res?.data && res?.data?.student_id) {
                    setShowErrorDailyChoosePackage2(true)
                    setShowErrorChooseTime2(true)
                    setShowErrorChooseTime(false)
                    setShowErrorDailyChoosePackage(false)
                } else {
                    setShowErrorDailyChoosePackage2(false)
                    setShowErrorChooseTime2(false)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally()
    }

    // TODO: Backend need fix getRecentLearnt thi chi tra ve du lieu cua nhung buoi hoc thuoc orderType STANDARD
    const getRecentLearnt = async () => {
        try {
            setLoading(true)
            const _studentPackages = await getMyPackages()
            const recentLearntRes = await CourseAPI.getRecentLearnt()
            if (!_.isEmpty(recentLearntRes)) {
                setRecentLearnt(recentLearntRes.course)
                if (recentLearntRes.total_lessons) {
                    settotalLessons(recentLearntRes.total_lessons)
                } else {
                    settotalLessons(0)
                }
                if (
                    _studentPackages.length > 0 &&
                    _studentPackages
                        .filter((x) => x.id)
                        .includes(recentLearntRes.ordered_package_id)
                ) {
                    setOrderId(recentLearntRes.ordered_package_id)
                    onChangeOrder(recentLearntRes.ordered_package)
                    setPackageId(recentLearntRes.package_id)
                }
            }
        } catch (err) {
            notify('error', err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (
            !_.isEmpty(studentPackages) &&
            _.isEmpty(courses) &&
            _.isEmpty(recentLearnt) &&
            !orderId &&
            !packageId
        ) {
            setOrderId(studentPackages[0].id)
            setPackageId(studentPackages[0].package_id)
            getCourses(studentPackages[0].package_id)
            onChangeOrder(studentPackages[0])
            if (
                studentPackages[0].package.learning_frequency_type ===
                EnumFrequencyType.DAILY
            ) {
                if (
                    TimeChoose < current_date_start_time ||
                    TimeChoose > current_date_end_time
                ) {
                    setShowErrorChooseTime(true)
                    setShowErrorDailyChoosePackage(true)
                    setShowErrorDailyChoosePackage2(false)
                    setShowErrorChooseTime2(false)
                } else {
                    checkBookingOfDailyPackage(studentPackages[0].id)
                }
            }
        }
    }, [studentPackages])

    useEffect(() => {
        getMyPackages()
        getRecentLearnt()
    }, [])

    const onChangePackage = (val) => {
        setShowMore(true)
        if (val !== orderId) {
            setOrderId(val)
            setCourses([])
            const order = _.find(
                studentPackages,
                (p) => p.id === _.toInteger(val)
            )
            if (order) {
                onChangeOrder(order)
                setPackageId(order.package_id)
                getCourses(order.package_id)
                if (
                    order.package.learning_frequency_type ===
                    EnumFrequencyType.DAILY
                ) {
                    if (
                        TimeChoose < current_date_start_time ||
                        TimeChoose > current_date_end_time
                    ) {
                        setShowErrorChooseTime(true)
                        setShowErrorDailyChoosePackage(true)
                        setShowErrorDailyChoosePackage2(false)
                        setShowErrorChooseTime2(false)
                    } else {
                        checkBookingOfDailyPackage(order.id)
                    }
                } else {
                    setShowErrorDailyChoosePackage2(false)
                    setShowErrorChooseTime2(false)
                    setShowErrorChooseTime(false)
                    setShowErrorDailyChoosePackage(false)
                }
            }
        }
    }

    const onChangeTag = (val) => {
        setTags(val)
        setPageNumber(1)
        setShowMore(true)
        getCourses(packageId, {
            page_number: 1,
            page_size: pageSize,
            search,
            tags: val
        })
    }

    const renderPackages = () =>
        studentPackages.map((item, index) => (
            <Option value={item.id} key={index}>
                {`${item.package_name} [ ${getTranslateText('remain')}: ${
                    item.number_class
                } ${getTranslateText('turn').toLowerCase()} ]`}
            </Option>
        ))

    const renderCourses = () => {
        if (courses.length > 0) {
            return courses.map((item, index) => (
                <Col key={index} span={16}>
                    <CourseCard
                        data={item}
                        total_lessons={0}
                        handleClick={() => onChangeCourse(item)}
                        active={item.id === selectCourseId}
                    />
                </Col>
            ))
        }
        return (
            <Col span={16}>
                <Empty description={getTranslateText('no_course_available')} />
            </Col>
        )
    }

    const renderTags = () =>
        Object.keys(EnumCourseTag).map((key, index) => (
            <Option value={EnumCourseTag[key]} key={index}>
                {_.startCase(EnumCourseTag[key])}
            </Option>
        ))

    const handleSearch = (val: string) => {
        setSearch(val)
        setPageNumber(1)
        setShowMore(true)
        getCourses(packageId, {
            page_number: 1,
            page_size: pageSize,
            search: val
        })
    }

    const handleShowMore = () => {
        setShowMore(true)
        if (packageId) {
            let _pageNumber = pageNumber
            if (courses.length >= pageSize) {
                _pageNumber = pageNumber + 1
            }
            setPageNumber(_pageNumber)
            getCourses(packageId, {
                page_number: _pageNumber,
                page_size: pageSize,
                search
            })
        }
    }

    return (
        <Spin spinning={loading}>
            <Row gutter={[0, 20]} justify='center' className='mb-4'>
                <Col span={16}>
                    <Select
                        style={{ width: '100%' }}
                        value={orderId}
                        onChange={onChangePackage}
                        placeholder={getTranslateText('choose_your_package')}
                        className={cn(styles.choosePackage)}
                    >
                        {renderPackages()}
                    </Select>
                    {showErrorDailyChoosePackage && (
                        <div
                            style={{
                                color: '#FF4D4F',
                                fontSize: '13px',
                                marginTop: '10px',
                                fontWeight: 600
                            }}
                        >
                            Gói học này chỉ được đặt lịch học trong ngày hôm
                            nay. Vui lòng chọn gói học khác hoặc chọn lại thời
                            gian học trong ngày ở bước 1.
                        </div>
                    )}
                    {showErrorChooseDailyPackage2 && (
                        <div
                            style={{
                                color: '#FF4D4F',
                                fontSize: '13px',
                                marginTop: '10px',
                                fontWeight: 600
                            }}
                        >
                            Bạn đã có 1 lịch học trong ngày với gói học hàng
                            ngày này. Vui lòng chọn gói học khác
                        </div>
                    )}
                </Col>
            </Row>
            <Row gutter={[20, 20]} justify='center' className='mb-4'>
                <Col span={12}>
                    <Search
                        placeholder='Search by course name'
                        loading={loading}
                        className={cn(styles.searchCourse)}
                        onSearch={_.debounce(handleSearch, 250)}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        style={{ width: '100%' }}
                        value={tags}
                        onChange={onChangeTag}
                        placeholder={getTranslateText('Filter by tags')}
                        className={cn(styles.choosePackage)}
                        mode='tags'
                    >
                        {renderTags()}
                    </Select>
                </Col>
            </Row>

            <Row
                gutter={[25, 20]}
                justify='center'
                className={cn(styles['scroll-courses'])}
            >
                {!_.isEmpty(recentLearnt) && !showMore ? (
                    <Col span={16}>
                        <p className={cn(styles['prev-title'])}>
                            <b>{getTranslateText('previous_course')}</b>
                        </p>
                        <CourseCard
                            data={recentLearnt}
                            total_lessons={total_lessons}
                            handleClick={() => onChangeCourse(recentLearnt)}
                            active={recentLearnt?.id === selectCourseId}
                        />
                    </Col>
                ) : (
                    renderCourses()
                )}
                <Col span={16} className='d-flex justify-content-center'>
                    {((!loading &&
                        total > 0 &&
                        pageNumber * pageSize < total) ||
                        (!loading &&
                            !_.isEmpty(recentLearnt) &&
                            !showMore)) && (
                        <Button
                            type='primary'
                            loading={loading}
                            onClick={handleShowMore}
                            shape='round'
                        >
                            {getTranslateText('show_more')}
                        </Button>
                    )}
                </Col>
            </Row>
        </Spin>
    )
}

export default memo(ChooseCourse)
