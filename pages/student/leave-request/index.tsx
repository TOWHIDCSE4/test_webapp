import { Card, Space, Button, Table, Tag, Select, Modal } from 'antd'
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons'
import { blue, red } from '@ant-design/colors'
import { useEffect, FC, useCallback, useState, useReducer } from 'react'
import _ from 'lodash'
import { getTranslateText } from 'utils/translate-utils'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import Layout from 'components/Atoms/StudentPage/Layout'
import { EnumModalType, FULL_DATE_FORMAT } from 'const'
import { notify } from 'contexts/Notification'
import { Logger } from 'utils/logger'
import StudentAPI from 'api/StudentAPI'
import {
    EnumStudentLeaveRequestStatus,
    IStudentLeaveRequest
} from 'types/IStudentLeaveRequest'
import ScreenConfigAPI from 'api/ScreenConfigAPI'
import { EnumScreenType, serverScreenConfig } from 'types/IScreenConfig'
import StudentLeaveRequestModal from './modal'

const { Option } = Select

const LeaveRequest: FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [LeaveRequests, setLeaveRequests] = useState([])
    const [total, setTotal] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [status, setStatus] = useState(EnumStudentLeaveRequestStatus.APPROVED)
    const [modalType, setModalType] = useState<EnumModalType>(null)
    const [selectedItem, setSelectedItem] = useState<IStudentLeaveRequest>(null)

    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            dataSetting: null
        }
    )

    const toggleModal = useCallback(
        (val: boolean, method?: EnumModalType) => {
            setVisibleModal(val)
            setModalType(method)
        },
        [visibleModal]
    )

    const getStudentLeaveRequests = (query: {
        page_size?: number
        page_number?: number
        status: number
    }) => {
        setLoading(true)
        StudentAPI.getAllLeaveRequests({
            page_size: query.page_size,
            page_number: query.page_number,
            status: query.status
        })
            .then((res) => {
                setLeaveRequests(res.data)
                if (res.pagination && res.pagination.total > 0) {
                    setTotal(res.pagination.total)
                }
            })
            .catch((err) => {
                Logger.error(err)
            })
            .finally(() => setLoading(false))
    }

    const getScreenConfig = () => {
        setLoading(true)
        ScreenConfigAPI.getScreenConfig({
            server: serverScreenConfig.WEBAPP,
            screen: EnumScreenType.student_leave_request
        })
            .then((dataRes) => {
                setValues({ dataSetting: dataRes })
                values.dataSetting = dataRes
            })
            .catch((err) => {
                Logger.error(err)
            })
            .finally(() => setLoading(false))
    }
    const refetchData = () => {
        getStudentLeaveRequests({
            page_size: pageSize,
            page_number: pageNumber,
            status
        })
    }

    useEffect(() => {
        getStudentLeaveRequests({
            page_size: pageSize,
            page_number: pageNumber,
            status
        })
        getScreenConfig()
    }, [])

    const handleChangePagination = useCallback(
        (_pageNumber, _pageSize) => {
            if (_pageNumber !== pageNumber) {
                setPageNumber(_pageNumber)
                getStudentLeaveRequests({
                    page_size: pageSize,
                    page_number: _pageNumber,
                    status
                })
            }
            if (_pageSize !== pageSize) {
                setPageSize(_pageSize)
                getStudentLeaveRequests({
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
            case EnumStudentLeaveRequestStatus.APPROVED:
                return 'success'
            case EnumStudentLeaveRequestStatus.PENDING:
                return 'warning'
            case EnumStudentLeaveRequestStatus.REJECT_BY_ADMIN:
                return 'error'
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

    const columns: ColumnsType<IStudentLeaveRequest> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: 80,
            align: 'center'
        },
        {
            title: getTranslateText('student.leave_request.time_off'),
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
            title: getTranslateText('student.leave_request.reason'),
            dataIndex: 'reason',
            key: 'reason',
            align: 'center',
            width: 250
        },
        {
            title: getTranslateText('student.leave_request.create_time'),
            dataIndex: 'created_time',
            key: 'created_time',
            align: 'center',
            width: 200,
            render: (text) => moment(text).format(FULL_DATE_FORMAT)
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
                            EnumStudentLeaveRequestStatus,
                            (o) => o === text
                        )
                    )}
                </Tag>
            )
        }
        // {
        // title: getTranslateText('leave_request.action'),
        // dataIndex: 'status',
        // key: 'status',
        // align: 'center',
        // width: 150,
        // fixed: 'right',
        // render: (text, record) => {
        //     if (text === EnumTeacherLeaveRequestStatus.PENDING) {
        //         return (
        //             <Space size='middle'>
        //                 <EditOutlined
        //                     style={{ color: blue.primary }}
        //                     type='button'
        //                     onClick={() => onEdit(record)}
        //                     title='Edit'
        //                 />
        //             </Space>
        //         )
        //     }
        // TODO: Confirm from BA
        // if (text === EnumTeacherLeaveRequestStatus.APPROVED) {
        //     return (
        //         <Button type='primary' shape='round'>
        //             {getTranslateText('leave_request.withdrawn')}
        //         </Button>
        //     )
        // }
        // }
        // }
    ]

    // const renderStatus = useCallback(
    //     () =>
    //         _.keys(EnumTeacherLeaveRequestStatus)
    //             .filter(
    //                 (key: any) =>
    //                     !isNaN(Number(EnumTeacherLeaveRequestStatus[key]))
    //             )
    //             .map((item, index) => (
    //                 <Option
    //                     key={index}
    //                     value={_.get(EnumTeacherLeaveRequestStatus, item)}
    //                 >
    //                     {_.startCase(item)}
    //                 </Option>
    //             )),
    //     []
    // )

    // const onChangeStatus = (val) => {
    //     setStatus(val)
    //     setPageNumber(1)
    //     getStudentLeaveRequests({
    //         page_number: 1,
    //         page_size: pageSize,
    //         status: val
    //     })
    // }
    return (
        <Layout>
            <Card title={getTranslateText('student.leave_request.title')}>
                <div className='d-flex justify-content-end'>
                    <Space size={16} className='mb-3' wrap>
                        {/* <Select
                            value={status}
                            defaultValue={status}
                            onChange={onChangeStatus}
                            style={{ width: '150px' }}
                        >
                            <Option value={null}>ALL STATUS</Option>
                            {renderStatus()}
                        </Select> */}
                        {values?.dataSetting?.is_show && (
                            <Button
                                type='primary'
                                onClick={() =>
                                    toggleModal(true, EnumModalType.ADD_NEW)
                                }
                            >
                                {getTranslateText(
                                    'student.leave_request.add_request'
                                )}
                            </Button>
                        )}
                    </Space>
                </div>
                <div className='table-wrapper'>
                    <Table
                        dataSource={LeaveRequests}
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

                <StudentLeaveRequestModal
                    visible={visibleModal}
                    toggleModal={toggleModal}
                    data={selectedItem}
                    method={modalType}
                    dataSetting={values.dataSetting}
                    refetchData={refetchData}
                />
            </Card>
        </Layout>
    )
}

export default LeaveRequest
