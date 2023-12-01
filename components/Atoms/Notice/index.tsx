/* eslint-disable react/no-danger */
import { useCallback, useEffect, useReducer, useState } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import {
    Pagination,
    Card,
    Tabs,
    List,
    Menu,
    Dropdown,
    DatePicker,
    Form,
    Row,
    Col,
    Button,
    notification,
    Badge,
    Table
} from 'antd'
import _ from 'lodash'
import { notify } from 'contexts/Notification'
import { IEventNotice, INotification } from 'types'
import NotificationAPI from 'api/NotificationAPI'
import moment from 'moment'
import cn from 'classnames'
import { DATE_FORMAT, FULL_DATE_FORMAT, ROLES } from 'const'
import { useAuth } from 'contexts/Auth'
import EventNoticeAPI from 'api/EventNoticeAPI'
import { sanitize } from 'utils/string-utils'
import TemplateAPI from 'api/TemplateAPI'
import { sanitizeMessage } from 'utils/notification'
import BlockHeader from '../StudentPage/BlockHeader'
import styles from './Notice.module.scss'
import Coupon from '../StudentPage/Coupon'
import DetailEventNoticeModal from './modals/DetailEventNoticeModal'

const { RangePicker } = DatePicker
const { TabPane } = Tabs

const NotiCe = () => {
    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState<INotification[]>([])
    const [eventNotices, setEventNotices] = useState<IEventNotice[]>([])
    const [total, setTotal] = useState(0)
    const { user } = useAuth()
    const [visibleModal, setVisibleModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState<IEventNotice>()
    const [form] = Form.useForm()

    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            data: [],
            isLoading: false,
            page_size: 10,
            page_number: 1,
            total: 0,
            tab_key: '',
            template_filters: [],
            type: '',
            template_filter_obj_ids: [],
            objectSearch: {
                fromDate: moment().subtract(6, 'd').startOf('d'),
                toDate: moment().endOf('d')
            }
        }
    )

    const toggleModal = useCallback(
        (val: boolean, item?: IEventNotice) => {
            setVisibleModal(val)
            setSelectedItem(item)
        },
        [visibleModal]
    )
    // const getAllNotifications = (query: {
    //     page_size: number
    //     page_number: number
    //     seen?: boolean
    // }) => {
    //     setLoading(true)
    //     NotificationAPI.getNotifications(query)
    //         .then((res) => {
    //             setNotifications(res.data)
    //             setTotal(res.pagination.total)
    //         })
    //         .catch((err) => {
    //             notify('error', err.message)
    //         })
    //         .finally(() => setLoading(false))
    // }

    const getNotifications = useCallback(
        ({ page_size, page_number, type, template_obj_id }) => {
            setValues({ isLoading: true })

            const { fromDate, toDate } = values.objectSearch

            const searchData = {
                page_size,
                page_number,
                fromDate,
                toDate,
                type,
                template_obj_id
            }
            NotificationAPI.getNotificationsForView(searchData)
                .then((res: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    let { total } = values
                    if (res.pagination && res.pagination.total >= 0) {
                        total = res.pagination.total
                    }

                    setValues({ data: res.data, total })
                })
                .catch((err: any) => {
                    notification.error({
                        message: 'Error',
                        description: err.message
                    })
                })
                .finally(() => setValues({ isLoading: false }))
        },
        [values]
    )

    const getTemplateFilters = useCallback(() => {
        const { fromDate, toDate } = values.objectSearch
        TemplateAPI.getTemplateFilters({
            fromDate,
            toDate
        })
            .then((res) => {
                if (res && res.length > 0) {
                    let type = 'user'
                    let templateObjId = res?.[0].obj_id
                    let tabKey = templateObjId
                    if (values.type && values.tab_key) {
                        type = values.type
                        templateObjId = values.tab_key
                        tabKey = templateObjId
                    }
                    const template_filter_obj_ids = res.map((e) => e.obj_id)
                    const index = template_filter_obj_ids.indexOf('other')
                    if (index !== -1) {
                        template_filter_obj_ids.splice(index, 1)
                    }
                    if (tabKey === 'other') {
                        type = 'other'

                        templateObjId = template_filter_obj_ids
                    }
                    setValues({
                        template_filters: res,
                        tab_key: tabKey,
                        type,
                        template_filter_obj_ids
                    })
                    getNotifications({
                        page_number: values.page_number,
                        page_size: values.page_size,
                        type,
                        template_obj_id: templateObjId
                    })
                } else {
                    setValues({
                        data: [],
                        total: 0,
                        tab_key: '',
                        template_filters: [],
                        type: '',
                        template_filter_obj_ids: []
                    })
                }
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
    }, [values])

    const fetchEventNotices = (query?: {
        page_size: number
        page_number: number
    }) => {
        setLoading(true)
        EventNoticeAPI.getEventNotices(query)
            .then((res) => {
                setEventNotices(res.data)
                setTotal(res.pagination.total)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    // const handleMarkNotifications = (seen: boolean) => {
    //     const payload = {
    //         ids: notifications.map((x) => x._id),
    //         seen
    //     }
    //     NotificationAPI.markNotification(payload)
    //         .then((res) => {
    //             const queryParams: any = {
    //                 page_size: values.page_size,
    //                 page_number: values.page_number
    //             }
    //             if (values.tab_key === 'unread') {
    //                 queryParams.seen = false
    //             }
    //             return getAllNotifications(queryParams)
    //         })
    //         .catch((err) => {
    //             notify('error', err.message)
    //         })
    //         .finally(() => setLoading(false))
    // }

    const handleChangeDate = (value) => {
        if (value && value.length) {
            setValues({
                objectSearch: {
                    fromDate: moment(value[0]).startOf('d'),
                    toDate: moment(value[1]).endOf('d')
                },
                page_number: 1
            })
        }
    }

    const seenNotification = (objId = null) => {
        if (objId) {
            NotificationAPI.markSeenById({ objId })
                .then(() => {
                    getTemplateFilters()
                })
                .catch((err: any) => {
                    notification.error({
                        message: 'Error',
                        description: err.message
                    })
                })
        } else {
            const { fromDate, toDate } = values.objectSearch
            let templateObjId = values.tab_key
            if (values.tab_key === 'other') {
                templateObjId = values.template_filter_obj_ids
            }

            NotificationAPI.markNotificationsAsSeen({
                type: values.type,
                template_obj_id: templateObjId,
                fromDate,
                toDate
            })
                .then(() => {
                    getTemplateFilters()
                })
                .catch((err: any) => {
                    notification.error({
                        message: 'Error',
                        description: err.message
                    })
                })
        }
    }

    const onSearch = (valuesForm: any) => {
        setValues({
            page_number: 1,
            objectSearch: { ...values.objectSearch, ...valuesForm }
        })
        getTemplateFilters()
    }

    useEffect(() => {
        const queryParams: any = {
            page_size: values.page_number,
            page_number: values.page_size
        }
        if (values.tab_key === 'unread') {
            queryParams.seen = false
        }
        if (values.tab_key === 'event_notice') {
            fetchEventNotices({ page_number: 1, page_size: values.page_size })
            setValues({ page_number: 1 })
        } else {
            form.setFieldsValue({
                ...values.objectSearch
            })
            getTemplateFilters()
            // getAllNotifications(queryParams)
        }
    }, [values.page_number, values.page_size, values.tab_key])

    const handleChangePagination = (page_number, page_size) => {
        setValues({ page_number, page_size })
        getNotifications({
            page_number,
            page_size,
            type: values.type,
            template_obj_id:
                values.type === 'other'
                    ? values.template_filter_obj_ids
                    : values.tab_key
        })
    }

    const onChangeTab = useCallback(
        (key) => {
            if (key === 'event_notice') {
                fetchEventNotices({
                    page_number: 1,
                    page_size: values.page_size
                })
                setValues({ page_number: 1 })
            } else if (key === 'other') {
                setValues({
                    data: [],
                    type: 'other',
                    tab_key: key,
                    page_number: 1
                })
                getNotifications({
                    page_size: values.page_size,
                    page_number: 1,
                    type: 'other',
                    template_obj_id: values.template_filter_obj_ids
                })
            } else {
                setValues({
                    data: [],
                    type: 'user',
                    tab_key: key,
                    page_number: 1
                })
                getNotifications({
                    page_size: values.page_size,
                    page_number: 1,
                    type: 'user',
                    template_obj_id: key
                })
            }
        },
        [values]
    )

    const columns: any = [
        {
            title: getTranslateText('notification.title_column.stt'),
            key: 'STT',
            width: 120,
            align: 'center',
            hidden: false,
            fixed: true,
            render: (text: any, record: any, index) =>
                record && record.seen ? (
                    index + (values.page_number - 1) * values.page_size + 1
                ) : (
                    <b>
                        {index +
                            (values.page_number - 1) * values.page_size +
                            1}
                    </b>
                )
        },
        {
            title: getTranslateText('notification.title_column.time'),
            dataIndex: 'created_time',
            key: 'created_time',
            align: 'left',
            width: 200,
            render: (e, record: any) =>
                record && record.created_time ? (
                    <div>
                        {record.seen ? (
                            moment(record?.created_time).format(
                                'YYYY-MM-DD HH:mm:ss'
                            )
                        ) : (
                            <b>
                                {moment(record?.created_time).format(
                                    'YYYY-MM-DD HH:mm:ss'
                                )}
                            </b>
                        )}
                    </div>
                ) : (
                    <></>
                )
        },
        {
            title: getTranslateText('notification.title_column.content'),
            dataIndex: 'message',
            key: 'message',
            align: 'left',
            render: (e, record: any) =>
                record ? (
                    record.seen ? (
                        <div>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeMessage(record)
                                }}
                            />
                            {record.operation_issue_id && record?.user && (
                                <div className='text-primary pt-3'>
                                    <span>
                                        {record?.user?.fullname} -{' '}
                                        {record?.user?.username}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <b>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeMessage(record)
                                    }}
                                />
                            </b>
                            {record.operation_issue_id && record?.user && (
                                <div className='text-primary pt-3'>
                                    <span>
                                        {record?.user?.fullname} -{' '}
                                        {record?.user?.username}
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <></>
                )
        },
        {
            title: getTranslateText('notification.title_column.action'),
            key: 'action',
            width: 150,
            fixed: 'right',
            align: 'center',
            render: (text, record: any) =>
                record && record.seen ? (
                    <></>
                ) : (
                    <div>
                        <div>
                            <Button
                                type='primary'
                                style={{
                                    minWidth: 90
                                }}
                                onClick={() => seenNotification(record._id)}
                            >
                                {getTranslateText(
                                    'notification.action.watched'
                                )}
                            </Button>
                        </div>
                    </div>
                )
        }
    ]

    const menu = (
        <Menu>
            {/* <Menu.Item key='1' onClick={() => handleMarkNotifications(false)}>
                {getTranslateText('mark_as_unread')}
            </Menu.Item>
            <Menu.Item key='2' onClick={() => handleMarkNotifications(true)}>
                {getTranslateText('mark_as_read')}
            </Menu.Item> */}
        </Menu>
    )

    const renderTitleCard = () => (
        <div className='d-flex justify-content-end'>
            <Dropdown.Button overlay={menu} placement='bottomRight' />
        </div>
    )
    const renderFilter = () => (
        <Form
            name='basic'
            layout='vertical'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 22 }}
            form={form}
            onFinish={onSearch}
        >
            <Row className='mb-4 justify-content-start' gutter={10}>
                <Col className='mb-2' span={16}>
                    <Row className='w-100 d-flex align-items-center'>
                        <Col span={4}>
                            {getTranslateText('notification.search_title')}
                        </Col>
                        <Col span={15}>
                            <Form.Item name='rangeDate' className='mb-0 w-100'>
                                <RangePicker
                                    allowClear={false}
                                    defaultValue={[
                                        values.objectSearch.fromDate,
                                        values.objectSearch.toDate
                                    ]}
                                    style={{ width: '100%' }}
                                    clearIcon={false}
                                    onChange={handleChangeDate}
                                    disabled={values.isLoading}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Button
                                type='primary'
                                htmlType='submit'
                                disabled={values.isLoading}
                            >
                                {getTranslateText('notification.search')}
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    )

    const renderAllNoti = () => (
        <Card title={renderTitleCard()}>
            <List
                itemLayout='horizontal'
                dataSource={notifications}
                loading={loading}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={
                                item.seen ? (
                                    <span
                                        className={cn(
                                            styles['notification-item']
                                        )}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: sanitize(
                                                    _.template(item.message)({
                                                        ...item.extra_info,
                                                        start_time: item
                                                            ?.extra_info
                                                            ?.booking?.calendar
                                                            ?.start_time
                                                            ? moment(
                                                                  item
                                                                      ?.extra_info
                                                                      ?.booking
                                                                      ?.calendar
                                                                      ?.start_time
                                                              ).format(
                                                                  FULL_DATE_FORMAT
                                                              )
                                                            : '',
                                                        regular_start_time: item
                                                            ?.extra_info
                                                            ?.regular_start_time
                                                            ? moment(
                                                                  item
                                                                      ?.extra_info
                                                                      ?.regular_start_time
                                                              ).format(
                                                                  'dddd HH:mm'
                                                              )
                                                            : ''
                                                    })
                                                )
                                            }}
                                        />
                                    </span>
                                ) : (
                                    <span
                                        className={cn(
                                            styles['notification-item--new']
                                        )}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: sanitize(
                                                    _.template(item.message)({
                                                        ...item.extra_info,
                                                        start_time: item
                                                            ?.extra_info
                                                            ?.booking?.calendar
                                                            ?.start_time
                                                            ? moment(
                                                                  item
                                                                      ?.extra_info
                                                                      ?.booking
                                                                      ?.calendar
                                                                      ?.start_time
                                                              ).format(
                                                                  FULL_DATE_FORMAT
                                                              )
                                                            : '',
                                                        regular_start_time: item
                                                            ?.extra_info
                                                            ?.regular_start_time
                                                            ? moment(
                                                                  item
                                                                      ?.extra_info
                                                                      ?.regular_start_time
                                                              ).format(
                                                                  'dddd HH:mm'
                                                              )
                                                            : ''
                                                    })
                                                )
                                            }}
                                        />
                                    </span>
                                )
                            }
                            description={
                                item.created_time && (
                                    <span
                                        title={moment(item.created_time).format(
                                            FULL_DATE_FORMAT
                                        )}
                                        style={{ cursor: 'default' }}
                                    >
                                        {moment(item.created_time).fromNow()}
                                    </span>
                                )
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    )

    const renderEventNotices = () => (
        <Card title={null}>
            <List
                itemLayout='horizontal'
                dataSource={eventNotices}
                loading={loading}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <a
                                key='list-loadmore-more'
                                onClick={() => toggleModal(true, item)}
                            >
                                Detail
                            </a>
                        ]}
                    >
                        <List.Item.Meta
                            title={
                                <span
                                    className={cn(styles['notification-item'])}
                                >
                                    {item.title}
                                </span>
                            }
                            description={
                                item.created_time && (
                                    <span
                                        title={moment(item.created_time).format(
                                            FULL_DATE_FORMAT
                                        )}
                                        style={{ cursor: 'default' }}
                                    >
                                        {moment(item.created_time).fromNow()}
                                    </span>
                                )
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    )

    const renderNotification = () => {
        if (values.template_filters && values.template_filters.length > 0) {
            return values.template_filters.map((data, i) => (
                <TabPane
                    tab={
                        <>
                            {getTranslateText(data.label)}
                            <Badge
                                className='badge-noti ml-1'
                                count={data.total_unseen}
                            />
                        </>
                    }
                    key={`${data.obj_id}`}
                >
                    <div className='text-right mb-4'>
                        <Button onClick={() => seenNotification()}>
                            {getTranslateText(
                                'notification.action.watched_all'
                            )}
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={values.data}
                        pagination={{
                            defaultCurrent: values.page_number,
                            pageSize: values.page_size,
                            total: values.total,
                            onChange: handleChangePagination,
                            current: values.page_number
                        }}
                        scroll={{
                            x: 500,
                            y: 400
                        }}
                        loading={values.isLoading}
                        sticky
                        rowKey={(record: any) => record._id}
                    />
                </TabPane>
            ))
        }
    }
    return (
        <>
            <BlockHeader title={getTranslateText('notifications')} />
            {renderFilter()}
            <Tabs
                defaultActiveKey={values.tab_key}
                type='card'
                onChange={onChangeTab}
            >
                {/* <TabPane tab={getTranslateText('tabs.all')} key='all'>
                    {renderAllNoti()}
                </TabPane>
                <TabPane tab={getTranslateText('tabs.unread')} key='unread'>
                    {renderAllNoti()}
                </TabPane> */}
                <TabPane
                    tab={getTranslateText('tabs.event_notice')}
                    key='event_notice'
                >
                    {renderEventNotices()}
                </TabPane>
                {/* {user && user?.role?.includes(ROLES.STUDENT) && (
                    <TabPane tab={getTranslateText('tabs.coupon')} key='coupon'>
                        <Coupon />
                    </TabPane>
                )} */}
                {renderNotification()}
            </Tabs>

            {!loading && total > 0 && values.tab_key === 'event_notice' && (
                <div className='mt-3 mb-3 d-flex justify-content-end'>
                    <Pagination
                        defaultCurrent={values.page_number}
                        pageSize={values.page_size}
                        total={total}
                        onChange={handleChangePagination}
                    />
                </div>
            )}
            <DetailEventNoticeModal
                data={selectedItem}
                visible={visibleModal}
                toggleModal={toggleModal}
            />
        </>
    )
}
export default NotiCe
