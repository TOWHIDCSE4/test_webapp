import { Card, Space, Button, Table, notification, Tag, Popover } from 'antd'
import { useReducer, useEffect, FC, useCallback } from 'react'
import moment from 'moment'
import {
    formatTimestamp,
    getTimestampInWeekToLocal
} from 'utils/datetime-utils'
import TeacherAPI from 'api/TeacherAPI'
import UserAPI from 'api/UserAPI'
import _ from 'lodash'
import RegularRequestModal, {
    Method
} from 'components/Molecules/RegularRequestModal'
import { getTranslateText } from 'utils/translate-utils'
import {
    REGULAR_REQUEST_STATUS,
    REGULAR_REQUEST_TYPES,
    FULL_DATE_FORMAT
} from 'const'
import { ColumnsType } from 'antd/lib/table'
import { ITeacherRegularRequest } from 'types'
import { useAuth } from 'contexts/Auth'
import { Logger } from 'utils/logger'

const HistoryRegularRequest: FC = () => {
    const { teacherInfo } = useAuth()

    const [values, setValues] = useReducer(
        (state: any, newState: any) => ({ ...state, ...newState }),
        {
            isLoading: false,
            visibleRegularModal: false,
            week_start: moment().startOf('week').valueOf(),
            schedule: {
                available_schedule: [],
                booked: []
            },
            method: null,
            regular_times: [],
            teacher_regular_requests: [],
            page_size: 10,
            page_number: 1,
            total: 0
        }
    )

    const toggleModal = useCallback(
        (visible: boolean, method?: Method) => {
            setValues({ visibleRegularModal: visible, method })
        },
        [values.visibleRegularModal]
    )

    const getTeacherRegularRequests = (
        page_size?: number,
        page_number?: number
    ) => {
        setValues({ isLoading: true })
        TeacherAPI.getAllRegularRequests({ page_size, page_number })
            .then((res) => {
                setValues({
                    teacher_regular_requests: res.data
                })
                if (res.pagination && res.pagination.total > 0) {
                    setValues({ total: res.pagination.total })
                }
            })
            .catch((err: any) => {
                Logger.error(err)
            })
            .finally(() => setValues({ isLoading: false }))
    }

    const getRegularTimes = () => {
        setValues({ isLoading: true })
        UserAPI.getRegularTimes()
            .then((res: any) => {
                setValues({ regular_times: res })
            })
            .catch((err: any) => {
                Logger.error(err)
            })
            .finally(() => setValues({ isLoading: false }))
    }

    const refetchData = () => {
        getTeacherRegularRequests()
    }

    useEffect(() => {
        getTeacherRegularRequests()
        getRegularTimes()
    }, [])

    const handleChangePagination = useCallback(
        (pageNumber, pageSize) => {
            setValues({ page_number: pageNumber, page_size: pageSize })
            getTeacherRegularRequests(pageSize, pageNumber)
        },
        [values]
    )

    const colorStatus = (status: number) => {
        switch (status) {
            case REGULAR_REQUEST_STATUS.CONFIRMED:
                return 'success'
            case REGULAR_REQUEST_STATUS.PENDING:
                return 'warning'
            case REGULAR_REQUEST_STATUS.CANCELED:
                return 'error'
            default:
                break
        }
    }

    const renderAllRegularTimes = (_regular_times: any[]) => (
        <ul style={{ height: '250px', overflow: 'auto' }} className='pr-3'>
            {_regular_times.map((item, index) => {
                const convertToLocal = getTimestampInWeekToLocal(item)
                return <li key={index}>{formatTimestamp(convertToLocal)}</li>
            })}
        </ul>
    )

    const columns: ColumnsType<ITeacherRegularRequest> = [
        {
            title: getTranslateText('table.header.stt'),
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 80,
            render: (text, record, index) => index + 1
        },
        {
            title: getTranslateText('regular_request.current'),
            dataIndex: 'old_regular_times',
            key: 'old_regular_times',
            align: 'center',
            width: 200,
            render: (text: any, record: any) => (
                <ul style={{ paddingInlineStart: '1em' }}>
                    {text &&
                        text
                            .filter((x, index) => index < 2)
                            .map((x, _index) => {
                                const convertToLocal =
                                    getTimestampInWeekToLocal(x)
                                return (
                                    <li key={_index}>
                                        {formatTimestamp(convertToLocal)}
                                    </li>
                                )
                            })}
                    {text.length > 2 && (
                        <Popover content={renderAllRegularTimes(text)}>
                            <a href='#'>See more...</a>
                        </Popover>
                    )}
                </ul>
            )
        },
        {
            title: getTranslateText('regular_request.new_req'),
            dataIndex: 'regular_times',
            key: 'regular_times',
            align: 'center',
            width: 200,
            render: (text: any, record: any) => (
                <ul style={{ paddingInlineStart: '1em' }}>
                    {text &&
                        text
                            .filter((x, index) => index < 2)
                            .map((x, _index) => {
                                const convertToLocal =
                                    getTimestampInWeekToLocal(x)
                                return (
                                    <li key={_index}>
                                        {formatTimestamp(convertToLocal)}
                                    </li>
                                )
                            })}
                    {text.length > 2 && (
                        <Popover content={renderAllRegularTimes(text)}>
                            <a href='#'>See more...</a>
                        </Popover>
                    )}
                </ul>
            )
        },
        {
            title: getTranslateText('common.type'),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 180,
            render: (text: any, record: any) => {
                if (
                    record.old_regular_times.length ===
                    record.regular_times.length
                ) {
                    return (
                        <Tag color='gold'>
                            {REGULAR_REQUEST_TYPES.EDIT.toUpperCase()}
                        </Tag>
                    )
                }
                if (
                    record.old_regular_times.length <
                    record.regular_times.length
                ) {
                    return (
                        <Tag color='processing'>
                            {REGULAR_REQUEST_TYPES.NEW.toUpperCase()}
                        </Tag>
                    )
                }
                if (
                    record.old_regular_times.length >
                    record.regular_times.length
                ) {
                    return (
                        <Tag color='error'>
                            {REGULAR_REQUEST_TYPES.CLOSE.toUpperCase()}
                        </Tag>
                    )
                }
            }
        },
        {
            title: getTranslateText('common.status'),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 150,
            render: (text: any, record: any) => (
                <Tag color={colorStatus(text)}>
                    {_.startCase(
                        _.findKey(REGULAR_REQUEST_STATUS, (o) => o === text)
                    )}
                </Tag>
            )
        },
        {
            title: getTranslateText('common.note'),
            dataIndex: 'admin_note',
            key: 'admin_note',
            align: 'center',
            width: 180
        },
        {
            title: getTranslateText('regular_request.created_time'),
            dataIndex: 'created_time',
            key: 'created_time',
            align: 'center',
            width: 150,
            render: (text) => moment(text).format(FULL_DATE_FORMAT)
        },
        {
            title: getTranslateText('regular_request.approved_time'),
            dataIndex: 'updated_time',
            key: 'updated_time',
            align: 'center',
            width: 150,
            render: (text: any, record: any) => {
                if (record.status === REGULAR_REQUEST_STATUS.CONFIRMED) {
                    return moment(text).format(FULL_DATE_FORMAT)
                }
            }
        }
    ]

    return (
        <Card title={getTranslateText('regular_request')}>
            <Space size={16} className='mb-4'>
                {/* <Button
                    type='primary'
                    onClick={() => toggleModal(true, Method.ADD_AND_EDIT)}
                >
                    {getTranslateText('open_regular')}
                </Button>
                <Button
                    type='primary'
                    onClick={() => toggleModal(true, Method.CLOSE)}
                >
                    {getTranslateText('close_regular')}
                </Button> */}
                <Button
                    type='primary'
                    onClick={() => toggleModal(true, Method.ADD_AND_EDIT)}
                >
                    {getTranslateText('update_regular')}
                </Button>
            </Space>
            <div className='table-wrapper'>
                <Table
                    dataSource={values.teacher_regular_requests}
                    columns={columns}
                    pagination={{
                        defaultCurrent: values.page_number,
                        pageSize: values.page_size,
                        total: values.total,
                        onChange: handleChangePagination
                    }}
                    rowKey={(record) => record.id}
                    loading={values.isLoading}
                    bordered
                    scroll={{
                        x: 500,
                        y: 768
                    }}
                    sticky
                />
            </div>
            <RegularRequestModal
                visible={values.visibleRegularModal}
                toggleModal={toggleModal}
                data={values.regular_times}
                method={values.method}
                refetchData={refetchData}
            />
        </Card>
    )
}

export default HistoryRegularRequest
