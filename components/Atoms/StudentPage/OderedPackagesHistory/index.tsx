import React, { useCallback, useReducer, useEffect } from 'react'
import Layout from 'components/Atoms/StudentPage/Layout'
import OrderAPI from 'api/OrderAPI'
import { Card, Space, Select, Table, Tag, Button, notification } from 'antd'
import moment from 'moment'
import { notify } from 'contexts/Notification'
import { getTranslateText } from 'utils/translate-utils'
import { ColumnsType } from 'antd/lib/table'
import { EnumOrderStatus, EnumOrderType, IOrderedPackage } from 'types'
import {
    EnumBookingSort,
    EnumBookingStatus,
    FULL_DATE_FORMAT,
    POINT_VND_RATE
} from 'const'
import { useRouter } from 'next/router'
import _ from 'lodash'
import BookingAPI from 'api/BookingAPI'

const { Option } = Select

const OrderedPackageHistory = () => {
    const router = useRouter()
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            bookings: [],
            page_size: 10,
            page_number: 1,
            total: 0,
            ordered_package_id: '',
            package_name: ''
        }
    )

    const getBookingHistory = (query: {
        page_size?: number
        page_number?: number
        ordered_package_id?: any
    }) => {
        setValues({ isLoading: true })
        BookingAPI.getBooking({
            page_number: query.page_number,
            page_size: query.page_size,
            status: [
                EnumBookingStatus.COMPLETED,
                EnumBookingStatus.CONFIRMED,
                EnumBookingStatus.STUDENT_ABSENT
            ],
            ordered_package_id: query.ordered_package_id,
            sort: EnumBookingSort.UPCOMING
        })
            .then((res) => {
                setValues({
                    bookings: res.data,
                    package_name: res.data[0]?.ordered_package.package_name
                })
                if (res.pagination && res.pagination.total >= 0) {
                    setValues({ total: res.pagination.total })
                }
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
            .finally(() => setValues({ isLoading: false }))
    }

    const refetchData = useCallback(() => {
        getBookingHistory({
            page_number: values.page_number,
            page_size: values.page_size,
            ordered_package_id: values.ordered_package_id
        })
    }, [values])

    useEffect(() => {
        const { id } = router.query
        if (id) {
            setValues({ ordered_package_id: id })
            getBookingHistory({
                page_number: values.page_number,
                page_size: values.page_size,
                ordered_package_id: id
            })
        }
    }, [router.query])

    const handleChangePagination = useCallback(
        (pageNumber, pageSize) => {
            setValues({ page_number: pageNumber, page_size: pageSize })
            getBookingHistory({
                page_number: pageNumber,
                page_size: pageSize,
                ordered_package_id: values.ordered_package_id
            })
        },
        [values]
    )

    const columns: ColumnsType<IOrderedPackage> = [
        {
            title: `${getTranslateText(
                'student.packages_history.header_index'
            )}`,
            dataIndex: 'index',
            key: 'stt',
            fixed: 'left',
            align: 'center',
            width: 70,
            render: (text, record, index) =>
                values.page_size * (values.page_number - 1) + index + 1
        },
        {
            title: `${getTranslateText(
                'student.packages_history.header_start_time'
            )}`,
            dataIndex: 'calendar',
            key: 'start_time',
            align: 'center',
            width: 180,
            render: (text: any, record: any) =>
                text &&
                moment(new Date(text?.start_time)).format(FULL_DATE_FORMAT)
        },
        {
            title: `${getTranslateText(
                'student.packages_history.header_teacher'
            )}`,
            dataIndex: 'teacher',
            key: 'teacher',
            align: 'left',
            width: 180,
            render: (text: any, record: any) => text && text.full_name
        },
        {
            title: `${getTranslateText(
                'student.packages_history.header_status'
            )}`,
            dataIndex: 'status',
            key: 'status',
            align: 'left',
            width: 120,
            render: (text, record) => {
                if (text === EnumBookingStatus.COMPLETED) {
                    return <Tag color='success'>COMPLETED</Tag>
                }
                if (text === EnumBookingStatus.CONFIRMED) {
                    return <Tag color='warning'>UPCOMING</Tag>
                }
                if (text === EnumBookingStatus.STUDENT_ABSENT) {
                    return <Tag color='error'>STUDENT ABSENT</Tag>
                }
            }
        }
    ]

    return (
        <Layout>
            <Card title={getTranslateText('student.packages_history.title')}>
                <div className='mb-3'>
                    {getTranslateText('student.packages_history.package_name')}{' '}
                    : {values.package_name}
                </div>
                <Table
                    dataSource={values.bookings}
                    columns={columns}
                    pagination={{
                        defaultCurrent: values.page_number,
                        pageSize: values.page_size,
                        total: values.total,
                        onChange: handleChangePagination
                    }}
                    rowKey={(record) => record.id}
                    loading={values.isLoading}
                    scroll={{
                        x: 500
                    }}
                />
            </Card>
        </Layout>
    )
}

export default OrderedPackageHistory
