import { Card, Space, Button, Table, Tag, Select, Modal } from 'antd'
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons'
import { blue, red } from '@ant-design/colors'
import { useEffect, FC, useCallback, useState } from 'react'
import TeacherAPI from 'api/TeacherAPI'
import _ from 'lodash'
import { getTranslateText } from 'utils/translate-utils'
import { ColumnsType } from 'antd/lib/table'
import { EnumTeacherAbsentRequestStatus, IAbsentRequest } from 'types'
import moment from 'moment'
import { EnumModalType, FULL_DATE_FORMAT } from 'const'
import { notify } from 'contexts/Notification'
import { Logger } from 'utils/logger'
import AbsentRequestModal from './modal'

const { Option } = Select

const AbsentRequest: FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [absentRequests, setAbsentRequests] = useState([])
    const [total, setTotal] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [status, setStatus] = useState(null)
    const [modalType, setModalType] = useState<EnumModalType>(null)
    const [selectedItem, setSelectedItem] = useState<IAbsentRequest>(null)

    const toggleModal = useCallback(
        (val: boolean, method?: EnumModalType) => {
            setVisibleModal(val)
            setModalType(method)
        },
        [visibleModal]
    )

    const getTeacherAbsentRequests = (query: {
        page_size?: number
        page_number?: number
        status: number
    }) => {
        setLoading(true)
        TeacherAPI.getAllAbsentRequests({
            page_size: query.page_size,
            page_number: query.page_number,
            status: query.status
        })
            .then((res) => {
                setAbsentRequests(res.data)
                if (res.pagination && res.pagination.total > 0) {
                    setTotal(res.pagination.total)
                }
            })
            .catch((err) => {
                Logger.error(err)
            })
            .finally(() => setLoading(false))
    }

    const refetchData = () => {
        getTeacherAbsentRequests({ status })
    }

    useEffect(() => {
        getTeacherAbsentRequests({ status })
    }, [])

    const handleChangePagination = useCallback(
        (_pageNumber, _pageSize) => {
            if (_pageNumber !== pageNumber) {
                setPageNumber(_pageNumber)
                getTeacherAbsentRequests({
                    page_size: pageSize,
                    page_number: _pageNumber,
                    status
                })
            }
            if (_pageSize !== pageSize) {
                setPageSize(_pageSize)
                getTeacherAbsentRequests({
                    page_size: _pageSize,
                    page_number: pageNumber,
                    status
                })
            }
        },
        [pageNumber, pageSize]
    )

    const colorStatus = (_status: number) => {
        switch (_status) {
            case EnumTeacherAbsentRequestStatus.APPROVED:
                return 'success'
            case EnumTeacherAbsentRequestStatus.PENDING:
                return 'warning'
            case EnumTeacherAbsentRequestStatus.REJECT_BY_ADMIN:
                return 'error'
            case EnumTeacherAbsentRequestStatus.WITHDRAWN_BY_TEACHER:
                return 'processing'
            default:
                break
        }
    }

    const onEdit = useCallback(
        (item) => {
            setSelectedItem(item)
            setVisibleModal(true)
            setModalType(EnumModalType.EDIT)
        },
        [modalType, visibleModal, selectedItem]
    )

    const removeCourse = useCallback((id: number) => {
        setLoading(true)
        TeacherAPI.removeAbsentRequests(id)
            .then((res) => {
                notify('success', res.message)
                refetchData()
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }, [])

    const onRemove = useCallback((item) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure to remove item?`,
            onOk() {
                removeCourse(item.id)
            }
        })
    }, [])

    const columns: ColumnsType<IAbsentRequest> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: 80,
            align: 'center'
        },
        {
            title: getTranslateText('common.time'),
            dataIndex: 'start_time',
            key: 'start_time',
            align: 'center',
            width: 300,
            render: (text, record) => (
                <span>
                    <strong>{getTranslateText('leave_request.from')}:</strong>{' '}
                    {moment(text).format(FULL_DATE_FORMAT)}
                    <strong> - {getTranslateText('leave_request.to')}: </strong>
                    {moment(record.end_time).format(FULL_DATE_FORMAT)}
                </span>
            )
        },
        {
            title: getTranslateText('common.status'),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 200,
            render: (text: any, record: any) => (
                <Tag color={colorStatus(text)}>
                    {_.startCase(
                        _.findKey(
                            EnumTeacherAbsentRequestStatus,
                            (o) => o === text
                        )
                    )}
                </Tag>
            )
        },
        {
            title: getTranslateText('common.note'),
            dataIndex: 'teacher_note',
            key: 'teacher_note',
            align: 'center',
            width: 250
        },
        {
            title: getTranslateText('leave_request.admin_note'),
            dataIndex: 'admin_note',
            key: 'admin_note',
            align: 'center',
            width: 250
        },
        {
            title: getTranslateText('leave_request.created_time'),
            dataIndex: 'created_time',
            key: 'created_time',
            align: 'center',
            width: 200,
            render: (text) => moment(text).format(FULL_DATE_FORMAT)
        },
        {
            title: getTranslateText('leave_request.action'),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 150,
            fixed: 'right',
            render: (text, record) => {
                if (text === EnumTeacherAbsentRequestStatus.PENDING) {
                    return (
                        <Space size='middle'>
                            <EditOutlined
                                style={{ color: blue.primary }}
                                type='button'
                                onClick={() => onEdit(record)}
                                title='Edit'
                            />
                            <DeleteOutlined
                                style={{ color: red.primary }}
                                type='button'
                                onClick={() => onRemove(record)}
                                title='Remove'
                            />
                        </Space>
                    )
                }
                // TODO: Confirm from BA
                // if (text === EnumTeacherAbsentRequestStatus.APPROVED) {
                //     return (
                //         <Button type='primary' shape='round'>
                //             {getTranslateText('leave_request.withdrawn')}
                //         </Button>
                //     )
                // }
            }
        }
    ]

    const renderStatus = useCallback(
        () =>
            _.keys(EnumTeacherAbsentRequestStatus)
                .filter(
                    (key: any) =>
                        !isNaN(Number(EnumTeacherAbsentRequestStatus[key]))
                )
                .map((item, index) => (
                    <Option
                        key={index}
                        value={_.get(EnumTeacherAbsentRequestStatus, item)}
                    >
                        {_.startCase(item)}
                    </Option>
                )),
        []
    )

    const onChangeStatus = (val) => {
        setStatus(val)
        setPageNumber(1)
        getTeacherAbsentRequests({
            page_number: 1,
            page_size: pageSize,
            status: val
        })
    }
    return (
        <Card title={getTranslateText('leave_request.title')}>
            <div className='d-flex justify-content-end'>
                <Space size={16} className='mb-3' wrap>
                    <Select
                        value={status}
                        defaultValue={status}
                        onChange={onChangeStatus}
                        style={{ width: '150px' }}
                    >
                        <Option value={null}>ALL STATUS</Option>
                        {renderStatus()}
                    </Select>
                    <Button
                        type='primary'
                        onClick={() => toggleModal(true, EnumModalType.ADD_NEW)}
                    >
                        {getTranslateText('leave_request.open_request')}
                    </Button>
                </Space>
            </div>
            <div className='table-wrapper'>
                <Table
                    dataSource={absentRequests}
                    columns={columns}
                    pagination={{
                        defaultCurrent: pageNumber,
                        current: pageNumber,
                        pageSize,
                        total,
                        onChange: handleChangePagination
                    }}
                    rowKey={(record) => record.id}
                    loading={loading}
                    scroll={{
                        x: 500,
                        y: 768
                    }}
                    bordered
                    sticky
                />
            </div>

            <AbsentRequestModal
                visible={visibleModal}
                toggleModal={toggleModal}
                data={selectedItem}
                method={modalType}
                refetchData={refetchData}
            />
        </Card>
    )
}

export default AbsentRequest
