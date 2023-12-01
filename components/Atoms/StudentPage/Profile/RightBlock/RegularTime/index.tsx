import React, { useEffect, useState } from 'react'
import {
    DAY_TO_MS,
    HOUR_TO_MS,
    MINUTE_TO_MS,
    DAYS_OF_WEEK
} from 'const/date-time'
import { nanoid } from 'nanoid'
import _ from 'lodash'
import moment from 'moment'
import {
    Table,
    Button,
    TimePicker,
    Form,
    Select,
    Row,
    Col,
    Popconfirm
} from 'antd'
import {
    EditOutlined,
    CheckSquareOutlined,
    CloseOutlined,
    DeleteOutlined
} from '@ant-design/icons'
import { notify } from 'contexts/Notification'
import {
    moduloTimestamp,
    getTimestampInWeekToLocal,
    getTimestampInWeekToUTC,
    formatTimestamp
} from 'utils/datetime-utils'
import { getTranslateText } from 'utils/translate-utils'
import UserAPI from 'api/UserAPI'
import { ColumnsType } from 'antd/lib/table'
import { IRegularCalendar } from 'types'

const { Option } = Select

const RegularTime = () => {
    const [form] = Form.useForm()

    const [loading, setLoading] = useState<boolean>(false)
    const [regularTimes, setRegularTimes] = useState([])
    const [isAddMore, setAddMore] = useState<boolean>(false)
    const [editRegularTimeId, setEditRegularTimeId] = useState<number>(-1)
    const [regularCalendars, setRegularCalendars] = useState<
        IRegularCalendar[]
    >([])

    const getRegularTimes = () => {
        setLoading(true)

        UserAPI.getRegularTimes()
            .then((res) => {
                const regularTimesLocal = res
                    ? _.clone(res).map((t) => getTimestampInWeekToLocal(t))
                    : []
                setRegularTimes(regularTimesLocal)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    const getRegularCalendars = () => {
        setLoading(true)

        UserAPI.getRegularCalendars({ page_size: 100, page_number: 1 }) // get all regular calendars of student
            .then((res) => {
                setRegularCalendars(res.data)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getRegularTimes()
        getRegularCalendars()
    }, [])

    const onReset = () => {
        setLoading(false)
        setAddMore(false)
        setEditRegularTimeId(-1)
    }

    const onSaveRegularTime = async (_values: any) => {
        const cloneForm = _.clone(_values)
        const { day_of_week, time } = cloneForm

        const hours = time.clone().hour()
        const minutes = time.clone().minutes()
        const _time =
            day_of_week * DAY_TO_MS +
            hours * HOUR_TO_MS +
            minutes * MINUTE_TO_MS

        if (hours < 7) {
            notify('error', 'You need select time greater 7 hours')
            return
        }
        if (hours > 22) {
            notify('error', 'You need select time less 22 hours')
            return
        }
        if (editRegularTimeId === -1 && regularTimes.includes(_time)) {
            notify('error', 'You have regular time with same time')
            return
        }

        let diff = [...regularTimes, _time]

        if (editRegularTimeId > 0) {
            const new_regular_times = [...regularTimes]
            new_regular_times[_.indexOf(new_regular_times, editRegularTimeId)] =
                _time
            diff = new_regular_times
        }

        try {
            setLoading(true)

            const convertToUtc = _.clone(diff).map((t) =>
                getTimestampInWeekToUTC(t)
            )
            await UserAPI.editUserInfo({ regular_times: convertToUtc })
            setRegularTimes(diff)
            onReset()
            notify('success', 'Successfully')
            getRegularTimes()
        } catch (err) {
            notify('error', err.message)
        } finally {
            setLoading(false)
        }
    }

    const onRemoveRegularTime = async (item) => {
        const diff = [...regularTimes]
        _.remove(diff, (o) => o === item)
        const convertToUtc = _.clone(diff).map((t) =>
            getTimestampInWeekToUTC(t)
        )

        try {
            setLoading(true)
            await UserAPI.editUserInfo({ regular_times: convertToUtc })
            setRegularTimes(diff)
            onReset()
            notify('success', 'Successfully')
            getRegularTimes()
        } catch (err) {
            notify('error', err.message)
        } finally {
            setLoading(false)
        }
    }

    const renderDaysOfWeek = () =>
        Object.keys(DAYS_OF_WEEK)
            .filter((key: any) => !isNaN(Number(DAYS_OF_WEEK[key])))
            .map((key: any) => (
                <Option value={DAYS_OF_WEEK[key]} key={nanoid()}>
                    {getTranslateText(key.toString().toLowerCase())}
                </Option>
            ))

    const getDisabledHours = () => [0, 1, 2, 3, 4, 5, 6, 23, 24] // disable if hour < 7 or hour > 22

    const renderRegularTimes = () => {
        if (regularTimes.length > 0) {
            const newRegularTimes = regularTimes.filter(
                (i) =>
                    !regularCalendars
                        .map((x) =>
                            getTimestampInWeekToLocal(x.regular_start_time)
                        )
                        .includes(i)
            )
            return newRegularTimes.map((item, index) => {
                const parseTime = moduloTimestamp(item)
                const disabled = item !== editRegularTimeId
                return (
                    <Form
                        key={nanoid()}
                        onFinish={onSaveRegularTime}
                        layout='vertical'
                        labelCol={{ span: 22 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{
                            day_of_week: parseTime.day,
                            time: moment(
                                `${parseTime.hour}:${parseTime.minute}`,
                                'HH:mm'
                            )
                        }}
                    >
                        <Row gutter={[20, 10]}>
                            <Col sm={24} md={8}>
                                <Form.Item
                                    name='day_of_week'
                                    rules={[
                                        {
                                            required: true,
                                            message: `${getTranslateText(
                                                'form.regular_times.day_of_week'
                                            )} ${getTranslateText(
                                                'is_required'
                                            )}`
                                        }
                                    ]}
                                >
                                    <Select
                                        disabled={disabled}
                                        placeholder='Choose day'
                                    >
                                        {renderDaysOfWeek()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col sm={12} md={4}>
                                <Form.Item
                                    name='time'
                                    rules={[
                                        {
                                            required: true,
                                            message: `${getTranslateText(
                                                'form.regular_times.time'
                                            )} ${getTranslateText(
                                                'is_required'
                                            )}`
                                        }
                                    ]}
                                >
                                    <TimePicker
                                        format='HH:mm'
                                        minuteStep={30}
                                        disabled={disabled}
                                        disabledHours={getDisabledHours}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12} md={8}>
                                <Form.Item>
                                    <>
                                        {editRegularTimeId !== -1 &&
                                        item === editRegularTimeId ? (
                                            <>
                                                <Button
                                                    htmlType='submit'
                                                    icon={
                                                        <CheckSquareOutlined />
                                                    }
                                                    className='ml-3 border-0'
                                                />
                                                <Popconfirm
                                                    placement='top'
                                                    title={getTranslateText(
                                                        'are_you_remove'
                                                    )}
                                                    onConfirm={() =>
                                                        onRemoveRegularTime(
                                                            item
                                                        )
                                                    }
                                                    okText={getTranslateText(
                                                        'ok'
                                                    )}
                                                    cancelText={getTranslateText(
                                                        'cancel'
                                                    )}
                                                >
                                                    <Button
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                        className='ml-3 border-0'
                                                    />
                                                </Popconfirm>

                                                <Button
                                                    icon={<CloseOutlined />}
                                                    className='ml-3 border-0'
                                                    onClick={() => onReset()}
                                                />
                                            </>
                                        ) : (
                                            editRegularTimeId === -1 && (
                                                <Button
                                                    icon={<EditOutlined />}
                                                    className='ml-3 border-0'
                                                    onClick={() =>
                                                        setEditRegularTimeId(
                                                            item
                                                        )
                                                    }
                                                />
                                            )
                                        )}
                                    </>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )
            })
        }
    }

    const columns: ColumnsType = [
        {
            title: `${getTranslateText('teacher.summary.no')}`,
            dataIndex: 'index',
            key: 'index',
            width: 70,
            render: (text, record, index) => index + 1
        },
        {
            title: `${getTranslateText('student.booking.teacher')}`,
            dataIndex: 'teacher',
            key: 'teacher',
            width: 200,
            render: (text, record) => text && `${text.full_name}`
        },
        {
            title: `${getTranslateText('student.booking.student')}`,
            dataIndex: 'student',
            key: 'student',
            width: 200,
            render: (text, record) => text && `${text.full_name} `
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
            width: 250,
            render: (text, record) => text && text.name
        },
        {
            title: getTranslateText('regular_time'),
            dataIndex: 'regular_start_time',
            key: 'regular_start_time',
            width: 200,
            fixed: 'right',
            render: (text, record) => {
                const convertToLocal = getTimestampInWeekToLocal(text)
                return formatTimestamp(convertToLocal)
            }
        }
    ]

    return (
        <>
            <strong>{getTranslateText('regular_time')}</strong>
            <div className='pr-5 pl-5 pt-4'>
                <small
                    className='d-flex mb-3'
                    style={{ color: '#ff4d4f', fontStyle: 'italic' }}
                >
                    {getTranslateText('form.note_regular_time')}
                </small>
                {regularCalendars.length > 0 && (
                    <Table
                        bordered
                        dataSource={regularCalendars}
                        columns={columns}
                        pagination={{
                            defaultCurrent: 1,
                            pageSize: 10,
                            total: regularCalendars.length
                        }}
                        rowKey={(record: IRegularCalendar) => record?._id}
                        scroll={{
                            x: 300,
                            y: 300
                        }}
                    />
                )}

                {renderRegularTimes()}
                {isAddMore && (
                    <Form
                        form={form}
                        onFinish={onSaveRegularTime}
                        layout='vertical'
                        labelCol={{ span: 22 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{
                            time: moment().set('h', 7).set('m', 30)
                        }}
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={8}>
                                <Form.Item
                                    name='day_of_week'
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                getTranslateText(
                                                    'select_day_in_week'
                                                )
                                        }
                                    ]}
                                >
                                    <Select placeholder='Choose day'>
                                        {renderDaysOfWeek()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item
                                    name='time'
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                getTranslateText('select_time')
                                        }
                                    ]}
                                >
                                    <TimePicker
                                        name='time'
                                        format='HH:mm'
                                        minuteStep={30}
                                        disabledHours={getDisabledHours}
                                        className='w-100'
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item>
                                    <>
                                        <Button
                                            htmlType='submit'
                                            icon={<CheckSquareOutlined />}
                                            className='ml-3 border-0'
                                        />
                                        <Button
                                            icon={<CloseOutlined />}
                                            className='border-0'
                                            onClick={() => onReset()}
                                        />
                                    </>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </div>
            {!isAddMore && editRegularTimeId === -1 && (
                <Row>
                    <Col offset={9}>
                        <button
                            type='button'
                            className='btn my-2 my-sm-0 big-bt card-shadow'
                            disabled={loading}
                            onClick={() => setAddMore(true)}
                        >
                            <span>{getTranslateText('add_more')}</span>
                            <img
                                src='/static/img/homepage/bt.png'
                                alt='Save button'
                            />
                        </button>
                    </Col>
                </Row>
            )}
        </>
    )
}

export default RegularTime
