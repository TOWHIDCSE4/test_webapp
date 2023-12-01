import React, { FC, memo, useState } from 'react'
import { Modal, Radio, Form, Input, Button, Alert } from 'antd'
import _ from 'lodash'
import { notify } from 'contexts/Notification'
import { getTranslateText } from 'utils/translate-utils'
import { EnumRecommendSection } from 'types'
import ReportAPI from 'api/ReportAPI'
import { ROLES_ENUM } from 'const/role'
import TextEditor from '../TextEditor'

type Props = {
    visible: boolean
    type?: number
    toggleModal: (visible: boolean) => void
    refetchData: () => void
}

const ClaimsAndReportModal: FC<Props> = ({
    type,
    visible,
    toggleModal,
    refetchData
}) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const onClose = () => {
        toggleModal(false)
        form.resetFields()
    }
    const onSubmitRequest = async (values) => {
        const payload = {
            recommend_content: values.content,
            recommend_section: values.section
        }
        ReportAPI.newReport(payload)
            .then(() => {
                notify('success', getTranslateText('claims.desc'))
                onClose()
                refetchData()
            })
            .catch((err) => {
                notify('error', getTranslateText('common.error'))
            })
    }

    const renderBody = () => (
        <Form form={form} onFinish={onSubmitRequest} layout='vertical'>
            <Alert
                message={getTranslateText('claims.desc')}
                type='info'
                showIcon
                className='mb-4'
            />
            <Form.Item
                name='section'
                rules={[
                    {
                        required: true,
                        message: getTranslateText('select_report_type')
                    }
                ]}
                className='justify-content-center'
            >
                <Radio.Group>
                    {type === 2 ? (
                        <>
                            <Radio
                                value={
                                    EnumRecommendSection.TEACHER_SYSTEM_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    System
                                </strong>
                            </Radio>
                            <Radio
                                value={
                                    EnumRecommendSection.TEACHER_STUDENT_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    Student
                                </strong>
                            </Radio>
                            <Radio
                                value={
                                    EnumRecommendSection.TEACHER_WAGE_RULE_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    Wages/Rules
                                </strong>
                            </Radio>
                            <Radio
                                value={
                                    EnumRecommendSection.TEACHER_MATERIAL_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    Materials
                                </strong>
                            </Radio>
                            <Radio
                                value={
                                    EnumRecommendSection.TEACHER_OTHER_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    Other
                                </strong>
                            </Radio>
                        </>
                    ) : (
                        <>
                            <Radio
                                value={
                                    EnumRecommendSection.STUDENT_SYSTEM_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    System
                                </strong>
                            </Radio>
                            <Radio
                                value={
                                    EnumRecommendSection.STUDENT_TEACHER_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    Teacher
                                </strong>
                            </Radio>
                            <Radio
                                value={
                                    EnumRecommendSection.STUDENT_SUPPORT_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    Customer Support
                                </strong>
                            </Radio>
                            <Radio
                                value={
                                    EnumRecommendSection.STUDENT_LEARNING_DOCUMENT_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    Materials
                                </strong>
                            </Radio>
                            <Radio
                                value={
                                    EnumRecommendSection.STUDENT_OTHER_REPORT
                                }
                            >
                                <strong style={{ color: '#076fd6' }}>
                                    Other
                                </strong>
                            </Radio>
                        </>
                    )}
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label='Content'
                name='content'
                rules={[
                    {
                        required: true,
                        message: getTranslateText('enter_your_content')
                    }
                ]}
            >
                <TextEditor />
            </Form.Item>
        </Form>
    )

    return (
        <Modal
            centered
            closable
            maskClosable
            visible={visible}
            onCancel={onClose}
            title={getTranslateText('claims.title')}
            width={700}
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
            {renderBody()}
        </Modal>
    )
}

export default memo(ClaimsAndReportModal)
