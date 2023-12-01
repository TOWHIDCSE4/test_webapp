import React, { useCallback, useEffect } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import {
    notification,
    Space,
    Spin,
    Card,
    Table,
    Tag,
    Col,
    Row,
    Tooltip
} from 'antd'
import { BookOutlined } from '@ant-design/icons'
import moment from 'moment'
import _ from 'lodash'
import HomeworkAPI from 'api/HomeworkAPI'
import { ColumnsType } from 'antd/lib/table'
import DebounceSelect from 'components/Atoms/DebounceSelect'
import TeacherAPI from 'api/TeacherAPI'
import { useAuth } from 'contexts/Auth'
import HomeworkHistory from './modal/HomeworkHistory'

const StudentHomework = () => {
    const { teacherInfo } = useAuth()
    const [bookings, setBookings] = React.useState([])
    const [total, setTotal] = React.useState(0)
    const [pageNumber, setPageNumber] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const [isLoading, setIsLoading] = React.useState(false)
    const [visibleHistory, setVisibleHistory] = React.useState(false)
    const [selectedBooking, setSelectedBooking] = React.useState(null)
    const [studentId, setStudentId] = React.useState(null)
    const [courseId, setCourseId] = React.useState(null)

    const fetchBookings = useCallback(
        async (query?: {
            pageNumber?: number
            pageSize?: number
            studentId?: number
            courseId?: number
        }) => {
            // setIsLoading(true)
            // HomeworkAPI.getStudentHomeworks({
            //     page_number: query?.pageNumber,
            //     page_size: query?.pageSize,
            //     student_id: query?.studentId,
            //     course_id: query?.courseId
            // })
            //     .then((res) => {
            //         setBookings(res.data)
            //         setTotal(res.pagination.total)
            //     })
            //     .catch((err) => {
            //         setIsLoading(false)
            //         notification.error({
            //             message: err.message,
            //             description: err.description
            //         })
            //     })
            //     .finally(() => setIsLoading(false))
        },
        []
    )

    useEffect(() => {
        fetchBookings()
    }, [])

    const handleChangePagination = useCallback(
        (page_number, page_size) => {
            setPageSize(page_size)
            setPageNumber(page_number)
            fetchBookings({
                pageSize: page_size,
                pageNumber: page_number,
                studentId,
                courseId
            })
        },
        [studentId, courseId]
    )

    const handleSearchStudent = useCallback(
        (student_id) => {
            setStudentId(student_id)
            fetchBookings({
                pageSize,
                pageNumber: 1,
                studentId: student_id,
                courseId
            })
        },
        [pageSize, pageNumber, courseId]
    )

    const handleSearchCourse = useCallback(
        (course_id) => {
            setCourseId(course_id)
            fetchBookings({
                pageSize,
                pageNumber: 1,
                studentId,
                courseId: course_id
            })
        },
        [pageSize, pageNumber, studentId]
    )
    const toggleViewHistory = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        (visible: boolean, selectedBooking?: any) => {
            setVisibleHistory(visible)
            setSelectedBooking(selectedBooking)
        },
        [visibleHistory]
    )

    const fetchStudents = async (val: string) => {
        const res = await TeacherAPI.getAllStudentsOfTeacher({
            search: val
        })
        return res.data.map((i) => ({
            label: i.full_name,
            value: i.id
        }))
    }

    const fetchCourses = async (val: string) => {
        const res = await TeacherAPI.getAllCoursesOfTeacher({
            search: val
        })
        return res.data.map((i) => ({
            label: i.name,
            value: i.id
        }))
    }

    const columns: ColumnsType<any> = [
        {
            title: getTranslateText('table.header.stt'),
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1
        },
        {
            title: getTranslateText('homework.classtime'),
            dataIndex: 'calendar',
            key: 'calendar',
            align: 'center',
            width: 120,
            render: (text, record) =>
                text && moment(text?.start_time).format('HH:mm DD/MM/YYYY')
        },
        {
            title: getTranslateText('homework.student'),
            dataIndex: 'student',
            key: 'student',
            render: (text, record) => (
                <Tag color='cyan'>{record.student.full_name}</Tag>
            )
        },
        {
            title: getTranslateText('common.course'),
            dataIndex: 'course',
            key: 'course',
            render: (text, record) => text.name
        },
        {
            title: getTranslateText('homework.lesson'),
            dataIndex: 'quiz',
            key: 'quiz',
            render: (text, record) => text.name
        },
        {
            title: getTranslateText('homework.first_finish_time'),
            dataIndex: 'first_time_do_homework',
            key: 'first_time_do_homework',
            align: 'center',
            width: 150,
            render: (text, record: any) => {
                if (text) {
                    if (
                        moment(text).diff(
                            moment(record?.calendar?.start_time)
                        ) >
                        48 * 60 * 60 * 1000
                    ) {
                        return (
                            <Tag color='#f50'>
                                {moment(text).format('HH:mm DD/MM/YYYY')}
                            </Tag>
                        )
                    }
                    return (
                        <Tag color='blue'>
                            {moment(text).format('HH:mm DD/MM/YYYY')}
                        </Tag>
                    )
                }
            }
        },
        {
            title: getTranslateText('homework.last_finish_time'),
            dataIndex: 'last_time_do_homework',
            key: 'last_time_do_homework',
            align: 'center',
            width: 150,
            render: (text, record) =>
                text && moment(text).format('HH:mm DD/MM/YYYY')
        },
        {
            title: getTranslateText('homework.total_times'),
            dataIndex: 'total_quiz_session',
            key: 'total_quiz_session',
            align: 'center',
            width: 150,
            render: (text, record) => <span>{text && text}</span>
        },
        {
            title: getTranslateText('homework.average_score'),
            dataIndex: 'average',
            key: 'average',
            align: 'center',
            width: 120,
            render: (text, record) => (
                <Tooltip title={getTranslateText('quiz.desc_avg')}>
                    {text}
                </Tooltip>
            )
        },
        {
            title: getTranslateText('common.status'),
            dataIndex: 'is_done_homework',
            key: 'is_done_homework',
            align: 'center',
            width: 250,
            render: (text, record: any) =>
                text ? (
                    moment(record.first_time_do_homework).diff(
                        moment(record?.calendar?.start_time)
                    ) >
                    48 * 60 * 60 * 1000 ? (
                        <Tag color='green'>Done After 48h</Tag>
                    ) : (
                        <Tag color='green'>Done</Tag>
                    )
                ) : (
                    <Tag color='#f50'>Haven't Test</Tag>
                )
        },
        {
            title: getTranslateText('homework.detail'),
            key: 'history',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (text, record: any) => (
                <Space size='middle'>
                    <BookOutlined
                        style={{ color: '#1890ff' }}
                        type='button'
                        onClick={() => toggleViewHistory(true, record)}
                        title='History homework result'
                    />
                </Space>
            )
        }
    ]
    return (
        <Card title={getTranslateText('teacher.sidebar.student_homework')}>
            <Row className='mb-4' justify='end' gutter={[16, 16]}>
                <Col span={8}>
                    <DebounceSelect
                        placeholder={getTranslateText(
                            'homework.select_student'
                        )}
                        fetchOptions={fetchStudents}
                        allowClear
                        style={{ width: '100%' }}
                        onChange={(v) => handleSearchStudent(v)}
                    />
                </Col>
                <Col span={8}>
                    <DebounceSelect
                        placeholder={getTranslateText('homework.select_course')}
                        fetchOptions={fetchCourses}
                        allowClear
                        style={{ width: '100%' }}
                        onChange={(v) => handleSearchCourse(v)}
                    />
                </Col>
            </Row>

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
            <HomeworkHistory
                visible={visibleHistory}
                toggleModal={toggleViewHistory}
                booking={selectedBooking}
            />
        </Card>
    )
}

export default StudentHomework
