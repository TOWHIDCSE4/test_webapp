import React, { useCallback, useReducer, useEffect } from 'react'
import Layout from 'components/Atoms/StudentPage/Layout'
import OrderAPI from 'api/OrderAPI'
import { Card, Space, Select, Table, Tag, Button } from 'antd'
import moment from 'moment'
import { notify } from 'contexts/Notification'
import { getTranslateText } from 'utils/translate-utils'
import { ColumnsType } from 'antd/lib/table'
import { EnumOrderStatus, EnumOrderType, IOrderedPackage } from 'types'
import { FULL_DATE_FORMAT, POINT_VND_RATE } from 'const'
import { useRouter } from 'next/router'
import _ from 'lodash'
import WalletAPI from 'api/WalletAPI'
import ConfirmModal from 'components/Atoms/ConfirmModal'
import { ReloadOutlined } from '@ant-design/icons'
import { toReadablePrice } from 'utils/price-utils'

const { Option } = Select

const MyPackage = () => {
    const router = useRouter()
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            myBookings: [],
            page_size: 10,
            page_number: 1,
            total: 100,
            status: '-1'
        }
    )

    const getMyPackages = (query: {
        page_size?: number
        page_number?: number
        status: string
    }) => {
        setValues({ isLoading: true })
        const filter: any = {
            page_size: query.page_size,
            page_number: query.page_number,
            status: query.status
        }
        if (filter.status === 'active') {
            filter.activated = true
            filter.expired = false
            filter.finished = false
        } else if (filter.status === 'inactive') {
            filter.activated = false
        } else if (filter.status === 'expired') {
            filter.expired = true
        }
        OrderAPI.getOrderedPackage(
            _.pick(filter, [
                'page_size',
                'page_number',
                'activated',
                'expired',
                'finished'
            ])
        )
            .then((res) => {
                setValues({ myBookings: res.data, isLoading: false })
                if (res.pagination && res.pagination.total >= 0) {
                    setValues({ total: res.pagination.total })
                }
            })
            .catch((err) => {
                notify('error', err.message)
                setValues({ isLoading: false })
            })
    }

    const refetchData = useCallback(() => {
        getMyPackages({ ...values })
    }, [values])

    useEffect(() => {
        getMyPackages({ ...values })
    }, [])

    const onChangeStatus = (value) => {
        if (values.status !== value) {
            setValues({ status: value })
            getMyPackages({ ...values, status: value, page_number: 1 })
        }
    }

    const handleChangePagination = useCallback(
        (pageNumber, pageSize) => {
            setValues({ page_number: pageNumber, page_size: pageSize })
            getMyPackages({
                page_size: pageSize,
                page_number: pageNumber,
                status: values.status
            })
        },
        [values]
    )

    const columns: ColumnsType<IOrderedPackage> = [
        {
            title: `${getTranslateText('student.package.orderId')}`,
            dataIndex: 'order_id',
            key: 'order_id',
            align: 'center',
            width: 120
        },
        {
            title: (
                <p className='text-center m-0'>
                    {getTranslateText('student.package.package')}
                </p>
            ),
            dataIndex: 'package_name',
            key: 'package_name',
            width: 200
        },
        {
            title: `${getTranslateText('student.package.activationTime')}`,
            dataIndex: 'activation_date',
            key: 'activation_date',
            align: 'center',
            width: 180,
            render: (text: any, record: any) =>
                text && moment(new Date(text)).format(FULL_DATE_FORMAT)
        },
        {
            title: `${getTranslateText('student.package.expiredTime')}`,
            dataIndex: 'expired_date',
            key: 'expired_date',
            align: 'center',
            width: 180,
            render: (text: any, record: any) =>
                text && moment(new Date(text)).format(FULL_DATE_FORMAT)
        },
        {
            title: `${getTranslateText('student.package.usage')}`,
            dataIndex: 'number_class',
            key: 'number_class',
            align: 'center',
            width: 120,
            render: (text, record) =>
                `${
                    _.toInteger(record.original_number_class) -
                    _.toInteger(text)
                }/${record.original_number_class}`
        },
        {
            title: `${getTranslateText('table.header.paid_number_class')}`,
            dataIndex: 'paid_number_class',
            key: 'paid_number_class',
            align: 'center',
            width: 150,
            render: (text, record) => {
                if (
                    record?.order?.status === EnumOrderStatus.PAID &&
                    text &&
                    text > 0
                ) {
                    return text
                }
                if (
                    record?.order?.status === EnumOrderStatus.PAID &&
                    (text === 0 || !text)
                ) {
                    return record.original_number_class
                }
                return '-'
            }
        },
        {
            title: getTranslateText('common.type'),
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: 120,
            render: (text) => {
                if (text === EnumOrderType.STANDARD)
                    return <Tag color='#108ee9'>STANDARD</Tag>
                if (text === EnumOrderType.PREMIUM)
                    return <Tag color='#f50'>PREMIUM</Tag>
                if (text === EnumOrderType.TRIAL)
                    return <Tag color='#87d068'>TRIAL</Tag>
            }
        },
        {
            title: `${getTranslateText('common.status')}`,
            dataIndex: 'order',
            key: 'order',
            align: 'center',
            width: 120,
            render: (text, record) => {
                if (text && text?.status === EnumOrderStatus.PAID) {
                    if (
                        record?.activation_date &&
                        record?.expired_date &&
                        moment(record?.expired_date) < moment()
                    ) {
                        return <Tag color='error'>EXPIRED</Tag>
                    }
                    if (record.activation_date) {
                        return <Tag color='success'>ACTIVE</Tag>
                    }
                    return <Tag color='success'>INACTIVE</Tag>
                }
                if (text && text?.status === EnumOrderStatus.PENDING) {
                    return <Tag color='warning'>PENDING</Tag>
                }
                if (text && text?.status === EnumOrderStatus.CANCEL) {
                    return <Tag color='error'>CANCEL</Tag>
                }
            }
        },
        {
            title: `${getTranslateText('table.header.created_time')}`,
            dataIndex: 'order',
            key: 'order',
            align: 'center',
            width: 150,
            render: (text: any, record: any) =>
                record?.order?.created_time &&
                moment(new Date(record?.order?.created_time)).format(
                    FULL_DATE_FORMAT
                )
        },
        {
            title: ``,
            dataIndex: 'is_show_history',
            key: 'is_show_history',
            align: 'center',
            width: 150,
            render: (text: any, record: any) => {
                if (text && text === true) {
                    return (
                        <div
                            style={{ color: '#08BF5A' }}
                            className='clickable'
                            onClick={() => {
                                router.push(
                                    `${router.pathname}/lesson-history/${record.id}`
                                )
                            }}
                        >
                            {getTranslateText('common.history')}
                        </div>
                    )
                }
                return ''
            }
        }
    ]

    return (
        <Layout>
            <Card title={getTranslateText('student.package.title')}>
                <Space
                    size={16}
                    className='mb-4'
                    align='end'
                    direction='horizontal'
                >
                    <Select
                        placeholder='Choose status'
                        value={values.status}
                        onChange={onChangeStatus}
                        style={{ width: '150px' }}
                    >
                        <Option value='-1'>All</Option>
                        <Option value='active'>Active</Option>
                        <Option value='inactive'>Inactive</Option>
                        <Option value='expired'>Expired</Option>
                        {/* <Option value='finished'>Finished</Option> */}
                    </Select>
                    {/* <ReloadOutlined
                        onClick={refetchData}
                        style={{
                            fontSize: '16px',
                            color: '#08c'
                        }}
                    /> */}
                </Space>
                <Table
                    dataSource={values.myBookings}
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

export default MyPackage
