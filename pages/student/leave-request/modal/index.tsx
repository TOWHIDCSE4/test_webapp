import React, { FC, memo, useEffect, useState } from 'react'
import { Modal, DatePicker, Form, Input, Button, Popconfirm } from 'antd'
import TeacherAPI from 'api/TeacherAPI'
import moment from 'moment'
import _ from 'lodash'
import { notify } from 'contexts/Notification'
import { EnumModalType } from 'const'
import { getTranslateText } from 'utils/translate-utils'
import { useRouter } from 'next/router'
import { IStudentLeaveRequest } from 'types/IStudentLeaveRequest'
import StudentAPI from 'api/StudentAPI'

const { RangePicker } = DatePicker
const { TextArea } = Input

type LeaveRequestModalProps = {
    method?: EnumModalType
    visible: boolean
    data?: IStudentLeaveRequest
    toggleModal: (visible: boolean) => void
    dataSetting?: any
    refetchData: () => void
}

const StudentLeaveRequestModal: FC<LeaveRequestModalProps> = ({
    visible,
    method,
    data,
    toggleModal,
    dataSetting,
    refetchData
}) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const onSubmitRequest = async (values) => {
        const payload = {
            reason: values.reason,
            start_time: moment(values.start_time)
                .set({
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0
                })
                .valueOf(),
            end_time: moment(values.end_time)
                .set({
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 0
                })
                .valueOf()
        }
        if (dataSetting) {
            if (payload.start_time > payload.end_time) {
                notify(
                    'error',
                    getTranslateText(
                        'student.leave_request_modal.message_error_time'
                    )
                )
                return
            }
        }
        if (method === EnumModalType.ADD_NEW) {
            setLoading(true)
            StudentAPI.createLeaveRequests(payload)
                .then((res) => {
                    toggleModal(false)
                    form.resetFields()
                    refetchData()
                    notify(
                        'success',
                        getTranslateText('absent_request.success')
                    )
                })
                .catch((err) => {
                    notify('error', err.message)
                })
                .finally(() => setLoading(false))
        }
        //  else if (method === EnumModalType.EDIT) {
        //     setLoading(true)
        //     TeacherAPI.editLeaveRequests(data.id, payload)
        //         .then((res) => {
        //             toggleModal(false)
        //             refetchData()
        //             form.resetFields()
        //         })
        //         .catch((err) => {
        //             notify('error', err.message)
        //         })
        //         .finally(() => setLoading(false))
        // }
    }

    const onClose = () => {
        toggleModal(false)
        form.resetFields()
    }

    useEffect(() => {
        if (!_.isEmpty(data)) {
            form.setFieldsValue({
                reason: '',
                start_time: moment(data.start_time),
                end_time: moment(data.end_time)
            })
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

    const renderBody = () => (
        <Form {...formItemLayout} form={form} onFinish={onSubmitRequest}>
            <Form.Item
                label={getTranslateText(
                    'student.leave_request_modal.start_time'
                )}
                name='start_time'
                rules={[
                    {
                        required: true,
                        message: getTranslateText('select_time')
                    }
                ]}
                initialValue={
                    dataSetting?.config?.start_time
                        ? moment(dataSetting?.config?.start_time)
                        : moment().startOf('day')
                }
            >
                <DatePicker
                    format='DD-MM-YYYY'
                    allowClear={false}
                    disabledDate={(current) =>
                        current < moment(dataSetting?.config?.start_time)
                    }
                />
            </Form.Item>
            <Form.Item
                label={getTranslateText('student.leave_request_modal.end_time')}
                name='end_time'
                rules={[
                    {
                        required: true,
                        message: getTranslateText('select_time')
                    }
                ]}
                initialValue={
                    dataSetting?.config?.start_time
                        ? moment(dataSetting?.config?.start_time).add(1, 'day')
                        : moment().startOf('day').add(1, 'day')
                }
            >
                <DatePicker
                    format='DD-MM-YYYY'
                    allowClear={false}
                    disabledDate={(current) =>
                        current > moment(dataSetting?.config?.end_time)
                    }
                />
            </Form.Item>
            <Form.Item
                label={getTranslateText('student.leave_request_modal.reason')}
                name='reason'
                rules={[
                    {
                        required: true,
                        message: getTranslateText(
                            'student.leave_request_modal.reason_message_required'
                        )
                    }
                ]}
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
                    ? getTranslateText(
                          'student.leave_request_modal.title_add_request'
                      )
                    : getTranslateText('leave_request.edit_request')
            }
            width={700}
            footer={[
                <Button key='back' type='default' onClick={onClose}>
                    {getTranslateText('cancel')}
                </Button>,
                <Popconfirm
                    placement='top'
                    title={getTranslateText(
                        'student.leave_request_modal.message_confirm'
                    )}
                    onConfirm={form.submit}
                    okText={getTranslateText('ok')}
                    cancelText={getTranslateText('cancel')}
                >
                    <Button key='submit' type='primary' loading={loading}>
                        {getTranslateText('save')}
                    </Button>
                </Popconfirm>
            ]}
        >
            {renderBody()}
        </Modal>
    )
}

export default memo(StudentLeaveRequestModal)
