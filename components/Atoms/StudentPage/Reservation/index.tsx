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
import ReservationAPI from 'api/Reservation'
import OrderAPI from 'api/OrderAPI'
import _ from 'lodash'
import moment from 'moment'
import { ColumnsType } from 'antd/lib/table'
import DebounceSelect from 'components/Atoms/DebounceSelect'
import { EnumStudentReservationRequestStatus } from 'const'

const Reservation = () => {
    const [loading, setLoading] = useState(false)
    const [visibleModal, setVisibleModal] = useState(false)
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [requests, setRequests] = useState([])
    const [form] = Form.useForm()
    const [formTotalDays, setFormTotalDay] = useState(0)
    const [formFee, setFormFee] = useState(0)

    const toggleModal = useCallback(
        (val: boolean) => {
            form.resetFields()
            setFormFee(0)
            setFormTotalDay(0)
            setVisibleModal(val)
        },
        [visibleModal]
    )

    const fetchData = (query: { page_size?: number; page_number?: number }) => {
        setLoading(true)
        ReservationAPI.getReservationRequest(query).then((res) => {
            setRequests(res.data)
            setTotal(res.pagination.total)
            setLoading(false)
        })
    }

    const refetchData = () => {
        fetchData({ page_size: pageSize, page_number: pageNumber })
    }

    useEffect(() => {
        fetchData({ page_size: pageSize, page_number: pageNumber })
    }, [])

    const createNewReservation = (data) => {
        ReservationAPI.newReservation({
            start_time: data.start_time.valueOf(),
            end_time: data.end_time.valueOf(),
            order_id: data.order,
            student_note: data.student_note
        })
            .then(() => {
                notify('success', 'Successfully create new reservation')
                toggleModal(false)
                refetchData()
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }
    function disabledStartDate(current) {
        // Can not select days before today and today
        return (
            (current && current < moment().endOf('day')) ||
            (form.getFieldValue('end_time') &&
                current &&
                current >
                    moment(form.getFieldValue('end_time').valueOf()).endOf(
                        'day'
                    ))
        )
    }

    function disabledEndDate(current) {
        return (
            current &&
            current <
                moment(form.getFieldValue('start_time')?.valueOf()).endOf('day')
        )
    }
    const changeStartEndTime = () => {
        const startDate = moment(
            form.getFieldValue('start_time')?.startOf('day').valueOf()
        )
        const endDate = moment(
            form.getFieldValue('end_time')?.startOf('day').valueOf()
        )
        const duration =
            startDate && endDate && moment.duration(endDate.diff(startDate))
        setFormTotalDay(duration.asDays())
    }

    const fetchOrders = async (val: string) => {
        const res = await OrderAPI.getOrdersWithTypes({
            page_number: 1,
            page_size: 100,
            status: 1,
            type: [1, 2]
        })
        return res.data.map((i) => ({
            label: i.package_name,
            value: i.id
        }))
    }

    const getFee = useCallback((id) => {
        ReservationAPI.getFee({
            order_id: id
        })
            .then((res) => {
                form.setFieldsValue({ price: res.price })
                setFormFee(res.price)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }, [])

    const onDeleteRequestClicked = async (item) => {
        ReservationAPI.deleteReservation(item.id)
            .then(() => {
                notify('success', 'Successfully cancel request')
                refetchData()
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }
    const renderModal = () => (
        <Form form={form} onFinish={createNewReservation}>
            <>
                <Row justify='center' gutter={[24, 24]}>
                    <h3
                        style={{
                            textAlign: 'center',
                            fontSize: '25px',
                            fontWeight: 500
                        }}
                    >
                        {getTranslateText(
                            'student.reservation.new_title'
                        ).toUpperCase()}
                    </h3>
                </Row>
                <Divider />
                <Row justify='start' gutter={[24, 24]}>
                    <Col span={6}>
                        <b>{getTranslateText('form.regular_times.time')}</b>
                    </Col>
                    <Col span={3}>
                        <p>{getTranslateText('table.header.from_date')}</p>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name='start_time'
                            rules={[
                                {
                                    required: true
                                }
                            ]}
                        >
                            <DatePicker
                                onChange={changeStartEndTime}
                                picker='date'
                                // eslint-disable-next-line react/jsx-no-bind
                                disabledDate={disabledStartDate}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <p>{getTranslateText('table.header.to_date')}</p>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name='end_time'
                            rules={[
                                {
                                    required: true
                                }
                            ]}
                        >
                            <DatePicker
                                onChange={changeStartEndTime}
                                picker='date'
                                // eslint-disable-next-line react/jsx-no-bind
                                disabledDate={disabledEndDate}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='start' gutter={[24, 24]}>
                    <Col span={6}>
                        <b>{getTranslateText('table.header.package')}</b>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='order'
                            rules={[
                                {
                                    required: true
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
                    <Col span={6}>
                        <b>{getTranslateText('table.header.student_note')}</b>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='student_note'
                            rules={[
                                {
                                    required: true
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='start' gutter={[24, 24]}>
                    <Col span={6}>
                        <b>{getTranslateText('table.header.total_date')}</b>
                    </Col>
                    <Col span={3}>
                        <Form.Item>
                            {/* <Input disabled /> */}
                            <Tag color='blue'>{formTotalDays}</Tag>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='start' gutter={[24, 24]}>
                    <Col span={6}>
                        <b>{getTranslateText('table.header.price')}</b>
                    </Col>
                    <Col span={3}>
                        <Form.Item>
                            <Tag color='red'>{formFee}</Tag>
                        </Form.Item>
                    </Col>
                </Row>
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
            case EnumStudentReservationRequestStatus.APPROVED:
                return 'success'
            case EnumStudentReservationRequestStatus.PENDING:
                return 'warning'
            case EnumStudentReservationRequestStatus.CANCEL:
                return 'error'
            case EnumStudentReservationRequestStatus.PAID:
                return 'processing'
            case EnumStudentReservationRequestStatus.REJECT_BY_ADMIN:
                return 'grey'
            default:
                break
        }
    }

    const columns: ColumnsType = [
        {
            title: getTranslateText('table.header.stt'),
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: '10%',
            align: 'center',
            render: (text, record, index) => index + 1
        },
        {
            title: getTranslateText('table.header.created_time'),
            dataIndex: 'created_time',
            key: 'created_time',
            width: '15%',
            align: 'center',
            render: (text) => moment(text).format('DD/MM/YYYY HH:mm')
        },
        {
            title: getTranslateText('table.header.package'),
            dataIndex: 'order',
            key: 'order',
            width: '15%',
            align: 'center',
            render: (text) => text.package_name
        },
        {
            title: getTranslateText('table.header.from_date'),
            dataIndex: 'start_time',
            key: 'start_time',
            width: '15%',
            align: 'center',
            render: (text) => moment(text).format('DD/MM/YYYY')
        },
        {
            title: getTranslateText('table.header.to_date'),
            dataIndex: 'end_time',
            key: 'end_time',
            width: '15%',
            align: 'center',
            render: (text) => moment(text).format('DD/MM/YYYY')
        },
        {
            title: getTranslateText('table.header.total_date'),
            dataIndex: 'start_time',
            key: 'start_date',
            width: '15%',
            align: 'center',
            render: (text, record: any) => {
                const startDate = moment(record.start_time)
                const endDate = moment(record.end_time)
                const duration = moment.duration(endDate.diff(startDate))
                return duration.asDays()
            }
        },
        {
            title: getTranslateText('table.header.student_note'),
            dataIndex: 'student_note',
            key: 'student_note',
            width: '15%',
            align: 'center',
            render: (text) => text
        },
        {
            title: getTranslateText('table.header.price'),
            dataIndex: 'price',
            key: 'price',
            width: '20%',
            align: 'center',
            render: (text, record: any) => (
                <>
                    {record.status !==
                    EnumStudentReservationRequestStatus.PAID ? (
                        <Tag color='error' className='mb-2'>
                            {text} Unpaid
                        </Tag>
                    ) : (
                        <>
                            <Tag color='success'>{text}</Tag>
                        </>
                    )}
                </>
            )
        },
        {
            title: getTranslateText('table.header.result'),
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            align: 'center',
            render: (text) => (
                <Tag color={colorStatus(text)}>
                    {_.startCase(EnumStudentReservationRequestStatus[text])}
                </Tag>
            )
        },
        {
            title: getTranslateText('table.header.admin_note'),
            dataIndex: 'admin_note',
            key: 'admin_note',
            width: '15%',
            align: 'center',
            render: (text) => text
        },
        {
            title: getTranslateText('leave_request.action'),
            dataIndex: 'id',
            key: 'id',
            width: '15%',
            align: 'center',
            render: (text, record: any) => (
                <Button
                    type='default'
                    size='small'
                    disabled={
                        record?.status !==
                        EnumStudentReservationRequestStatus.PENDING
                    }
                    style={{
                        color: '#fff',
                        backgroundColor: 'red',
                        borderColor: 'red'
                    }}
                    onClick={() => onDeleteRequestClicked(record)}
                >
                    X
                </Button>
            )
        }
    ]

    return (
        <Space direction='vertical' style={{ width: '100%' }}>
            <Card title={getTranslateText('student.sidebar.reservation.title')}>
                <div className='d-flex justify-content-end'>
                    <Space size={16} className='mb-3' wrap>
                        <Button
                            type='primary'
                            onClick={() => toggleModal(true)}
                        >
                            {getTranslateText('student.reservation.new')}
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
                    centered
                    title={getTranslateText('student.reservation.new')}
                    visible={visibleModal}
                    onCancel={() => toggleModal(false)}
                    className='modalProfile'
                    width={800}
                    footer={[
                        <Button
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

export default Reservation
