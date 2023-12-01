import React, { FC, memo, useEffect, useState } from 'react'
import { Modal, DatePicker, Form, Input, Button, Popconfirm } from 'antd'
import TeacherAPI from 'api/TeacherAPI'
import moment from 'moment'
import _ from 'lodash'
import { notify } from 'contexts/Notification'
import { EnumModalType, MINUTE_TO_MS } from 'const'
import { IAbsentRequest } from 'types'
import { getTranslateText } from 'utils/translate-utils'
import { useRouter } from 'next/router'

const { RangePicker } = DatePicker
const { TextArea } = Input

type AbsentRequestModalProps = {
    method?: EnumModalType
    visible: boolean
    data?: IAbsentRequest
    toggleModal: (visible: boolean) => void
    refetchData: () => void
}

const AbsentRequestModal: FC<AbsentRequestModalProps> = ({
    visible,
    method,
    data,
    toggleModal,
    refetchData
}) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [diffTime, setDiffTime] = useState(30)
    const onSubmitRequest = async (values) => {
        const payload = {
            teacher_note: values.teacher_note,
            start_time: moment(values.time[0])
                .set({
                    second: 0,
                    millisecond: 0
                })
                .valueOf(),
            end_time: moment(values.time[1])
                .set({
                    second: 0,
                    millisecond: 0
                })
                .valueOf()
        }
        if (
            method === EnumModalType.ADD_NEW ||
            method === EnumModalType.ADD_NEW_ON_SCHEDULE
        ) {
            setLoading(true)
            TeacherAPI.createAbsentRequests(payload)
                .then((res) => {
                    toggleModal(false)
                    refetchData()
                    form.resetFields()
                    notify(
                        'success',
                        getTranslateText('absent_request.success')
                    )
                    router.push('/teacher/absent-request')
                })
                .catch((err) => {
                    notify('error', err.message)
                })
                .finally(() => setLoading(false))
        } else if (method === EnumModalType.EDIT) {
            setLoading(true)
            TeacherAPI.editAbsentRequests(data.id, payload)
                .then((res) => {
                    toggleModal(false)
                    refetchData()
                    form.resetFields()
                })
                .catch((err) => {
                    notify('error', err.message)
                })
                .finally(() => setLoading(false))
        }
    }

    const onChangeDate = (value) => {
        if (value) {
            const minStartTime = moment(value[0])
                .set({
                    second: 0,
                    millisecond: 0
                })
                .valueOf()
            const maxEndTime = moment(value[1])
                .set({
                    second: 0,
                    millisecond: 0
                })
                .valueOf()
            const diff_time = (maxEndTime - minStartTime) / MINUTE_TO_MS
            console.log(diff_time)
            setDiffTime(diff_time)
        }
    }

    const onClose = () => {
        toggleModal(false)
        form.resetFields()
    }

    useEffect(() => {
        if (!_.isEmpty(data)) {
            form.setFieldsValue({
                teacher_note: '',
                time: [moment(data.start_time), moment(data.end_time)]
            })
        }
        console.log(method)
        if (visible && method === EnumModalType.EDIT) {
            if (!_.isEmpty(data)) {
                form.setFieldsValue({
                    teacher_note: data.teacher_note,
                    time: [moment(data.start_time), moment(data.end_time)]
                })
            }
        }
    }, [visible, method])
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 }
        }
    }

    const disabledDate = (current) =>
        // Can not select days before today and today
        current && current < moment()

    const renderBody = () => (
        <Form {...formItemLayout} form={form} onFinish={onSubmitRequest}>
            <Form.Item
                label={getTranslateText('common.time')}
                name='time'
                rules={[
                    {
                        type: 'array' as const,
                        required: true,
                        message: getTranslateText('select_time')
                    }
                ]}
                initialValue={[
                    moment().startOf('hours').add('minute', 30),
                    moment().startOf('hours').add('minute', 60)
                ]}
            >
                <RangePicker
                    allowClear={false}
                    showTime={{ format: 'HH:mm' }}
                    format='YYYY-MM-DD HH:mm'
                    disabledDate={disabledDate}
                    onChange={onChangeDate}
                    minuteStep={30}
                    disabled={method === EnumModalType.ADD_NEW_ON_SCHEDULE}
                />
            </Form.Item>
            <Form.Item
                label={getTranslateText('common.note')}
                name='teacher_note'
            >
                <TextArea />
            </Form.Item>
        </Form>
    )

    return (
        <Modal
            maskClosable
            centered
            closable
            visible={visible}
            onCancel={onClose}
            title={
                method === EnumModalType.ADD_NEW
                    ? getTranslateText('leave_request.new_request')
                    : method === EnumModalType.ADD_NEW_ON_SCHEDULE
                    ? getTranslateText('leave_request.close_regular_request')
                    : getTranslateText('leave_request.edit_request')
            }
            width={700}
            footer={[
                <Button key='back' type='default' onClick={onClose}>
                    {getTranslateText('cancel')}
                </Button>,
                method !== EnumModalType.ADD_NEW || diffTime < 90 ? (
                    <Button
                        key='submit'
                        type='primary'
                        onClick={form.submit}
                        loading={loading}
                    >
                        {getTranslateText('save')}
                    </Button>
                ) : (
                    diffTime >= 90 && (
                        <Popconfirm
                            placement='top'
                            title={getTranslateText('are_you_leave_request')}
                            onConfirm={form.submit}
                            okText={getTranslateText('ok')}
                            cancelText={getTranslateText('cancel')}
                        >
                            <Button
                                key='submit'
                                type='primary'
                                loading={loading}
                            >
                                {getTranslateText('save')}
                            </Button>
                        </Popconfirm>
                    )
                )
            ]}
        >
            <div
                style={{
                    color: '#FF4D4F',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    marginTop: '-15px',
                    marginBottom: '10px',
                    fontWeight: 600
                }}
            >
                {getTranslateText('teacher.absent_request.note')}
            </div>
            {renderBody()}
        </Modal>
    )
}

export default memo(AbsentRequestModal)
