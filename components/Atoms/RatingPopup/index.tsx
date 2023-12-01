import React, { FC, memo, useCallback, useEffect } from 'react'
import {
    Modal,
    Rate,
    Input,
    Row,
    Col,
    Button,
    Form,
    Checkbox,
    Divider
} from 'antd'
import ReportAPI from 'api/ReportAPI'
import { notify } from 'contexts/Notification'
import cn from 'classnames'
import { getTranslateText } from 'utils/translate-utils'
import { useRouter } from 'next/router'
import styles from './RatingPopup.module.scss'

type Props = {
    visible: boolean
    data: any
    bookingData: any
    toggleModal: (val: boolean) => void
    refetchData: () => void
    isHideReport?: boolean
}

const RatingPopup: FC<Props> = ({
    visible,
    toggleModal,
    data,
    bookingData,
    refetchData,
    isHideReport = false
}) => {
    const [form] = Form.useForm()
    const router = useRouter()

    useEffect(() => {
        console.log(data)
        if (!data) {
            data = {
                rating: 5,
                teacher: {
                    is_late: true
                },
                document: {
                    normal: true
                },
                network: {
                    good: true
                },
                homework: {
                    normal: true
                }
            }
        }
        if (visible && data) {
            form.setFieldsValue({
                ...data,
                student_rating: data.student_rating ?? 5
            })
        }
    }, [visible, data])

    const onFinish = useCallback(
        async (formData) => {
            ReportAPI.ratingLesson({
                report_content: formData,
                type: 2,
                report_teacher_id: bookingData.teacher_id,
                booking_id: bookingData.id
            })
                .then((res) => {
                    notify('success', 'Rating successfully')
                    toggleModal(false)
                    refetchData()
                })
                .catch((err) => {
                    notify('error', err.message)
                })
        },
        [data, form]
    )

    const onCancel = () => {
        toggleModal(false)
        form.resetFields()
    }

    return (
        <>
            <Modal
                maskClosable
                visible={visible}
                title={null}
                closeIcon
                closable={false}
                onCancel={onCancel}
                centered
                footer={[
                    <Button key='cancel' onClick={onCancel} shape='round'>
                        {getTranslateText('cancel')}
                    </Button>,
                    <Button
                        key='rating'
                        onClick={form.submit}
                        type='primary'
                        shape='round'
                        className='mr-2'
                    >
                        {getTranslateText('rating.button')}
                    </Button>
                ]}
                width={800}
            >
                <div
                    style={{ marginBottom: '15px' }}
                    className={cn('mb-3', styles['title-rating'])}
                >
                    <h3>{getTranslateText('rating.title')}</h3>
                </div>
                <Divider />

                <Form
                    form={form}
                    onFinish={onFinish}
                    labelCol={{ flex: 'auto' }}
                    wrapperCol={{ flex: '0' }}
                    labelAlign='left'
                    colon={false}
                >
                    <Form.Item
                        label={
                            <h5
                                className='mb-0'
                                style={{ fontSize: '1.37em', marginBottom: 0 }}
                            >
                                {getTranslateText('rating.rating_label')}
                            </h5>
                        }
                        name='rating'
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        className='text-center'
                    >
                        <Rate style={{ marginRight: 75 }} />
                    </Form.Item>
                    {!isHideReport ? (
                        <>
                            <Divider>
                                {getTranslateText('rating.report_label')}
                            </Divider>
                            <Row gutter={[48, 24]}>
                                <Col span={24} md={12}>
                                    <h5>
                                        <b>
                                            {getTranslateText(
                                                'rating.report.teacher'
                                            )}
                                        </b>
                                    </h5>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.teacher.teaching_method'
                                        )}
                                        name={['teacher', 'is_late']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.teacher.punctuality'
                                        )}
                                        name={['teacher', 'not_enough_time']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.teacher.enthusiasm'
                                        )}
                                        name={['teacher', 'teaching']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.teacher.academic_knowledge'
                                        )}
                                        name={['teacher', 'bad_attitude']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.comment'
                                        )}
                                        labelCol={{ flex: '0 0 auto' }}
                                        wrapperCol={{ flex: 'auto' }}
                                        name={['teacher', 'comment']}
                                        className='mb-0'
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col
                                    span={24}
                                    md={12}
                                    style={{ paddingRight: 40 }}
                                >
                                    <h5>
                                        <b>
                                            {getTranslateText(
                                                'rating.report.document'
                                            )}
                                        </b>
                                    </h5>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.document.normal'
                                        )}
                                        name={['document', 'normal']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.document.easy'
                                        )}
                                        name={['document', 'easy']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.document.hard'
                                        )}
                                        name={['document', 'hard']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.document.bad_document'
                                        )}
                                        name={['document', 'bad_document']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.comment'
                                        )}
                                        labelCol={{ flex: '0 0 auto' }}
                                        wrapperCol={{ flex: 'auto' }}
                                        name={['document', 'comment']}
                                        className='mb-0'
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <h5>
                                        <b>
                                            {getTranslateText(
                                                'rating.report.network'
                                            )}
                                        </b>
                                    </h5>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.network.good'
                                        )}
                                        name={['network', 'good']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.network.bad'
                                        )}
                                        name={['network', 'bad']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.comment'
                                        )}
                                        labelCol={{ flex: '0 0 auto' }}
                                        wrapperCol={{ flex: 'auto' }}
                                        name={['network', 'comment']}
                                        className='mb-0'
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col
                                    span={22}
                                    md={12}
                                    style={{ paddingRight: 40 }}
                                >
                                    <h5>
                                        <b>
                                            {getTranslateText(
                                                'rating.report.homework'
                                            )}
                                        </b>
                                    </h5>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.homework.normal'
                                        )}
                                        name={['homework', 'normal']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.homework.easy'
                                        )}
                                        name={['homework', 'easy']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.homework.hard'
                                        )}
                                        name={['homework', 'hard']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.homework.bad_homework'
                                        )}
                                        name={['homework', 'bad_homework']}
                                        valuePropName='checked'
                                        className='mb-0'
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                    <Form.Item
                                        label={getTranslateText(
                                            'rating.report.comment'
                                        )}
                                        labelCol={{ flex: '0 0 auto' }}
                                        wrapperCol={{ flex: 'auto' }}
                                        name={['homework', 'comment']}
                                        className='mb-0'
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <p className={styles.thankyou}>
                            {getTranslateText('rating.thankyou')}
                            <a
                                href='#'
                                onClick={() =>
                                    router.push(
                                        `/student/learning-history/${bookingData?.id}?toggle_rating=true`
                                    )
                                }
                            >
                                {getTranslateText('rating.here')}
                            </a>
                        </p>
                    )}
                </Form>
            </Modal>
        </>
    )
}

export default memo(RatingPopup)
