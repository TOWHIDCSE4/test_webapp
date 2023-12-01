import React, { useEffect, useState, useCallback } from 'react'
import {
    Row,
    Col,
    Card,
    Table,
    Space,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Divider,
    Tag
} from 'antd'
import { notify } from 'contexts/Notification'
import { getTranslateText } from 'utils/translate-utils'
import ExtensionAPI from 'api/Extension'
import OrderAPI from 'api/OrderAPI'
import _ from 'lodash'
import moment from 'moment'
import { ColumnsType } from 'antd/lib/table'
import DebounceSelect from 'components/Atoms/DebounceSelect'
import { EnumStudentExtensionRequestStatus, POINT_VND_RATE } from 'const'
import ConfirmModal from 'components/Atoms/ConfirmModal'
import { toReadablePrice } from 'utils/price-utils'
import WalletAPI from 'api/WalletAPI'
import Link from 'next/link'

const Extension = () => {
    const [loading, setLoading] = useState(false)
    const [visibleModal, setVisibleModal] = useState(false)
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [requests, setRequests] = useState([])
    const [form] = Form.useForm()
    const [formTotalDays, setFormTotalDay] = useState(0)
    const [formFee, setFormFee] = useState(0)
    const [balance, setBalance] = useState(0.0)

    const toggleModal = useCallback(
        (val: boolean) => {
            form.resetFields()
            setFormFee(0)
            setFormTotalDay(0)
            setVisibleModal(val)
            fetchBalance()
        },
        [visibleModal]
    )

    const fetchData = (query: { page_size?: number; page_number?: number }) => {
        setLoading(true)
        ExtensionAPI.getExtensionRequest(query).then((res) => {
            setRequests(res.data)
            setTotal(res.pagination.total)
            setLoading(false)
        })
    }

    const fetchBalance = useCallback(async () => {
        WalletAPI.getBalance()
            .then((res) => {
                setBalance(res.balance)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }, [])

    const refetchData = () => {
        fetchData({ page_size: pageSize, page_number: pageNumber })
    }

    useEffect(() => {
        fetchData({ page_size: pageSize, page_number: pageNumber })
    }, [])

    const createNewExtension = (data) => {
        ExtensionAPI.newExtension({
            ordered_package_id: data.order,
            student_note: data.student_note
        })
            .then(() => {
                notify('success', 'Successfully create new extension')
                toggleModal(false)
                refetchData()
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const fetchOrders = async (val: string) => {
        const res = await OrderAPI.getOrderedPackage({
            page_number: 1,
            page_size: 100
        })
        return res.data.map((i) => ({
            label: `${i.package_name} - Expired At ${moment(
                i.expired_date
            ).format('DD/MM/YYYY')}`,
            value: i.id
        }))
    }

    const getFee = useCallback((id) => {
        ExtensionAPI.getFee({
            ordered_package_id: id
        })
            .then((res) => {
                form.setFieldsValue({ price: res.price })
                setFormFee(res.price / POINT_VND_RATE)
                setFormTotalDay(res.number_of_days)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }, [])

    const renderModal = () => (
        <Form form={form} onFinish={createNewExtension}>
            <>
                <Row justify='start' gutter={[24, 24]}>
                    <Col span={8}>
                        <b>{getTranslateText('table.header.package')}</b>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            name='order'
                            rules={[
                                {
                                    required: true,
                                    message: getTranslateText('select_package')
                                }
                            ]}
                        >
                            <DebounceSelect
                                fetchOptions={fetchOrders}
                                showSearch={false}
                                onChange={getFee}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='start' gutter={[24, 24]}>
                    <Col span={8}>
                        <b>{getTranslateText('table.header.student_note')}</b>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            name='student_note'
                            rules={[
                                {
                                    required: true,
                                    message: getTranslateText('input_text')
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify='start' gutter={[24, 24]}>
                    <Col span={8}>
                        <b>
                            {getTranslateText(
                                'student.extension.table.total_days'
                            )}
                        </b>
                    </Col>
                    <Col span={16}>
                        <Form.Item>
                            {/* <Input disabled /> */}
                            <Tag color='blue'>{formTotalDays}</Tag>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='start' gutter={[24, 24]}>
                    <Col span={8}>
                        <b>{getTranslateText('wallet.balance')}</b>
                    </Col>
                    <Col span={16}>
                        <Form.Item>
                            <Tag color='success'>
                                {Intl.NumberFormat('en-US').format(balance)}{' '}
                                {getTranslateText('point')}
                            </Tag>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='start' gutter={[24, 24]}>
                    <Col span={8}>
                        <b>{getTranslateText('table.header.price')}</b>
                    </Col>
                    <Col span={16}>
                        <Form.Item>
                            <Tag color='red'>
                                {Intl.NumberFormat('en-US').format(formFee)}{' '}
                                {getTranslateText('point')}
                            </Tag>
                        </Form.Item>
                    </Col>
                </Row>
                {formFee > balance ? (
                    <Row justify='start' gutter={[24, 24]}>
                        <Col span={24}>
                            <p className='text-danger'>
                                {getTranslateText('wallet.not_enough')}
                                <Link href='/student/wallet'>
                                    <a className='ml-1'>
                                        {getTranslateText('wallet.deposit_now')}
                                    </a>
                                </Link>
                            </p>
                        </Col>
                    </Row>
                ) : (
                    <></>
                )}
            </>
        </Form>
    )

    const handleChangePagination = useCallback(
        (_pageNumber, _pageSize) => {
            if (_pageNumber !== pageNumber) {
                setPageNumber(_pageNumber)
                fetchData({
                    page_size: pageSize,
                    page_number: _pageNumber
                })
            }
            if (_pageSize !== pageSize) {
                setPageSize(_pageSize)
                fetchData({
                    page_size: _pageSize,
                    page_number: pageNumber
                })
            }
        },
        [pageNumber, pageSize]
    )

    const colorStatus = (_status: number) => {
        switch (_status) {
            case EnumStudentExtensionRequestStatus.APPROVED:
                return 'success'
            case EnumStudentExtensionRequestStatus.PENDING:
                return 'warning'
            case EnumStudentExtensionRequestStatus.REJECTED:
                return 'error'
            default:
                break
        }
    }

    const columns: ColumnsType = [
        {
            title: getTranslateText('table.header.stt'),
            dataIndex: 'id',
            key: 'id',
            width: 70,
            align: 'center',
            render: (text, record, index) => index + 1
        },
        {
            title: getTranslateText('table.header.created_time'),
            dataIndex: 'created_time',
            key: 'created_time',
            width: 150,
            align: 'center',
            render: (text) => moment(text).format('DD/MM/YYYY HH:mm')
        },
        {
            title: getTranslateText('table.header.package'),
            dataIndex: 'ordered_package',
            key: 'ordered_package',
            width: 150,
            align: 'center',
            render: (text) => text.package_name
        },
        {
            title: getTranslateText('student.extension.table.total_days'),
            dataIndex: 'number_of_days',
            key: 'number_of_days',
            width: 150,
            align: 'center',
            render: (text, record: any) => text
        },
        {
            title: getTranslateText('table.header.student_note'),
            dataIndex: 'student_note',
            key: 'student_note',
            width: 150,
            align: 'center',
            render: (text) => text
        },
        {
            title: getTranslateText('table.header.price'),
            dataIndex: 'price',
            key: 'price',
            width: 150,
            align: 'center',
            render: (text, record: any) => (
                <>
                    <Tag color='success'>
                        {toReadablePrice(text / POINT_VND_RATE)}{' '}
                        {getTranslateText('point')}
                    </Tag>
                </>
            )
        },
        {
            title: getTranslateText('table.header.result'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (text) => (
                <Tag color={colorStatus(text)}>
                    {_.startCase(EnumStudentExtensionRequestStatus[text])}
                </Tag>
            )
        },
        {
            title: getTranslateText('table.header.admin_note'),
            dataIndex: 'admin_note',
            key: 'admin_note',
            width: 150,
            align: 'center',
            render: (text) => text
        }
    ]

    return (
        <Space direction='vertical' style={{ width: '100%' }}>
            <Card title={getTranslateText('student.sidebar.extension.title')}>
                <div className='d-flex justify-content-end'>
                    <Space size={16} className='mb-3' wrap>
                        <Button
                            type='primary'
                            onClick={() => toggleModal(true)}
                        >
                            {getTranslateText('student.extension.new')}
                        </Button>
                        <Button type='primary' onClick={refetchData}>
                            {getTranslateText('refresh')}
                        </Button>
                    </Space>
                </div>
                <Table
                    dataSource={requests}
                    columns={columns}
                    pagination={{
                        defaultCurrent: pageNumber,
                        current: pageNumber,
                        pageSize,
                        total,
                        onChange: handleChangePagination
                    }}
                    rowKey={(record: any) => record.id}
                    loading={loading}
                    scroll={{
                        x: 500,
                        y: 768
                    }}
                    bordered
                />
                <Modal
                    maskClosable
                    title={getTranslateText('student.extension.new')}
                    visible={visibleModal}
                    onCancel={() => toggleModal(false)}
                    className='modalProfile'
                    centered
                    width={600}
                    footer={[
                        <Button
                            disabled={formFee > balance}
                            key='submit'
                            type='primary'
                            onClick={form.submit}
                            loading={loading}
                        >
                            {getTranslateText('send')}
                        </Button>
                    ]}
                >
                    {renderModal()}
                </Modal>
            </Card>
        </Space>
    )
}

export default Extension
