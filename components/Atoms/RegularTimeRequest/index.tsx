import React, { useReducer, useEffect, FC } from 'react'
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
    Button,
    TimePicker,
    Checkbox,
    notification,
    Select,
    Form,
    Row,
    Col,
    Empty
} from 'antd'
import {
    EditOutlined,
    CheckSquareOutlined,
    CloseOutlined
} from '@ant-design/icons'
import {
    getTimestampInWeekToLocal,
    getTimestampInWeekToUTC,
    moduloTimestamp
} from 'utils/datetime-utils'
import { Method } from 'components/Molecules/RegularRequestModal'
import { getTranslateText } from 'utils/translate-utils'

const { Option } = Select
type RegularTimeRequestProps = {
    regularTimes: any[]
    onSave: (new_regular_times: any) => void
    method: Method
}

const RegularTimeRequest: FC<RegularTimeRequestProps> = ({
    regularTimes,
    onSave,
    method
}) => {
    const [values, setValues] = useReducer(
        (state: any, newState: any) => ({ ...state, ...newState }),
        {
            regular_times: [],
            isAddMore: false,
            editRegularTimeId: -1,
            isLoading: false,
            close_regular_times: []
        }
    )
    const [form] = Form.useForm()

    useEffect(() => {
        const regularTimesLocal = _.clone(regularTimes).map((t) =>
            getTimestampInWeekToLocal(t)
        )
        setValues({ regular_times: regularTimesLocal })
    }, [regularTimes])

    const onChangeCheckBox = (value: any) => {
        if (values.close_regular_times.includes(value)) {
            const new_close = [...values.close_regular_times]
            _.pull(new_close, value)
            setValues({ close_regular_times: new_close })
        } else {
            setValues({
                close_regular_times: [...values.close_regular_times, value]
            })
        }
    }

    const onReset = () => {
        setValues({
            isLoading: false,
            isAddMore: false,
            editRegularTimeId: -1,
            close_regular_times: []
        })
    }

    const onSaveRegularTime = (_values: any) => {
        const { editRegularTimeId } = values
        const cloneForm = _.clone(_values)
        const { day_of_week, time } = cloneForm
        const hours = time.clone().hour()
        const minutes = time.clone().minutes()
        const _time =
            day_of_week * DAY_TO_MS +
            hours * HOUR_TO_MS +
            minutes * MINUTE_TO_MS
        if (hours < 7) {
            notification.error({
                message: 'Error',
                description: getTranslateText('select_time_greater_7_hours')
            })
        } else if (hours > 22) {
            notification.error({
                message: 'Error',
                description: getTranslateText('select_time_less_22_hours')
            })
        } else if (
            editRegularTimeId === -1 &&
            values.regular_times.includes(_time)
        ) {
            notification.error({
                message: 'Error',
                description: getTranslateText(
                    'have_regular_time_with_same_time'
                )
            })
        } else {
            let diff = [...values.regular_times, _time]
            if (editRegularTimeId > 0) {
                const new_regular_times = [...values.regular_times]
                new_regular_times[
                    _.indexOf(new_regular_times, editRegularTimeId)
                ] = _time
                diff = new_regular_times
            }
            setValues({ regular_times: diff })
            onReset()
        }
    }

    const onSendRequest = async () => {
        setValues({ isLoading: true })
        const { regular_times, close_regular_times } = values
        const new_regular_times = [...regular_times]
        if (!_.isEmpty(close_regular_times)) {
            _.pullAll(new_regular_times, close_regular_times)
        }
        if (method === Method.ADD_AND_EDIT && _.isEmpty(new_regular_times)) {
            notification.error({
                message: 'Error',
                description: getTranslateText('no_time_to_request')
            })
        } else {
            try {
                const convertToUtc = _.clone(new_regular_times).map((t) =>
                    getTimestampInWeekToUTC(t)
                )
                await onSave(convertToUtc)
                onReset()
                notification.success({
                    message: 'Success',
                    description: getTranslateText('submit_request_successfully')
                })
            } catch (err) {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            } finally {
                setValues({ isLoading: false })
            }
        }
    }
    const renderDaysOfWeek = () =>
        Object.keys(DAYS_OF_WEEK)
            .filter((key: any) => !isNaN(Number(DAYS_OF_WEEK[key])))
            .map((key: any) => (
                <Option value={DAYS_OF_WEEK[key]} key={nanoid()}>
                    {_.capitalize(key)}
                </Option>
            ))

    const getDisabledHours = () => [0, 1, 2, 3, 4, 5, 6, 23, 24] // disable if hour < 7 or hour > 22

    const renderRegularTimes = () => {
        if (values.regular_times && values.regular_times.length > 0) {
            return values.regular_times.map((item: any, index: number) => {
                const parseTime = moduloTimestamp(item)
                const disabled = item !== values.editRegularTimeId
                return (
                    <Form
                        key={nanoid()}
                        onFinish={onSaveRegularTime}
                        layout='horizontal'
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
                        initialValues={{
                            day_of_week: parseTime.day,
                            time: moment(
                                `${parseTime.hour}:${parseTime.minute}`,
                                'HH:mm'
                            )
                        }}
                    >
                        <Row>
                            {method === Method.CLOSE && (
                                <Col span={2}>
                                    <Form.Item>
                                        <Checkbox
                                            onChange={() =>
                                                onChangeCheckBox(item)
                                            }
                                            checked={values.close_regular_times.includes(
                                                item
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                            )}

                            <Col span={8}>
                                <Form.Item
                                    name='day_of_week'
                                    label={getTranslateText(
                                        'form.regular_times.day_of_week'
                                    )}
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
                                    <Select disabled={disabled}>
                                        {renderDaysOfWeek()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='time'
                                    label={getTranslateText(
                                        'form.regular_times.time'
                                    )}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                getTranslateText('select_time')
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
                            <Col span={6}>
                                <Form.Item>
                                    {method === Method.ADD_AND_EDIT && (
                                        <>
                                            {values.editRegularTimeId !== -1 &&
                                            item ===
                                                values.editRegularTimeId ? (
                                                <div className='d-flex'>
                                                    <Button
                                                        htmlType='submit'
                                                        icon={
                                                            <CheckSquareOutlined />
                                                        }
                                                        className='ml-3 border-0'
                                                    />
                                                    <Button
                                                        icon={<CloseOutlined />}
                                                        className='border-0'
                                                        onClick={() =>
                                                            onReset()
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                values.editRegularTimeId ===
                                                    -1 && (
                                                    <Button
                                                        icon={<EditOutlined />}
                                                        className='ml-3 border-0'
                                                        onClick={() =>
                                                            setValues({
                                                                editRegularTimeId:
                                                                    item
                                                            })
                                                        }
                                                    />
                                                )
                                            )}
                                        </>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )
            })
        }
    }

    return (
        <>
            <div style={{ overflow: 'auto', maxHeight: '500px' }}>
                {renderRegularTimes()}
                {values.isAddMore && (
                    <Form
                        form={form}
                        onFinish={onSaveRegularTime}
                        layout='horizontal'
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 12 }}
                    >
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    name='day_of_week'
                                    label={getTranslateText(
                                        'form.regular_times.day_of_week'
                                    )}
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
                                    <Select>{renderDaysOfWeek()}</Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name='time'
                                    label={getTranslateText(
                                        'form.regular_times.time'
                                    )}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                getTranslateText('select_time')
                                        }
                                    ]}
                                >
                                    <TimePicker
                                        format='HH:mm'
                                        minuteStep={30}
                                        disabledHours={getDisabledHours}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item>
                                    <div className='d-flex'>
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
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </div>
            {!values.isAddMore &&
                values.editRegularTimeId === -1 &&
                method === Method.ADD_AND_EDIT && (
                    <div className='pl-3 py-2'>
                        <Button
                            type='primary'
                            onClick={() => setValues({ isAddMore: true })}
                        >
                            <span className='mr-2'>+</span>
                            <span>{getTranslateText('add_more')}</span>
                        </Button>
                    </div>
                )}
            {!_.isEmpty(values.regular_times) ? (
                <div className='d-flex justify-content-end m-3'>
                    <Button type='primary' onClick={onSendRequest}>
                        {getTranslateText('send_request')}
                    </Button>
                </div>
            ) : (
                method === Method.CLOSE && (
                    <Empty>{getTranslateText('no_regular_time')}</Empty>
                )
            )}
        </>
    )
}

export default RegularTimeRequest
