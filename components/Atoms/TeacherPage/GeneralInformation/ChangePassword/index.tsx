import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Form, Input, Button, notification } from 'antd'
import AuthenticateAPI from 'api/AuthenticateAPI'
import { getTranslateText } from 'utils/translate-utils'
import styles from './ChangePassword.module.scss'

const ChangePassword = () => {
    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState(false)
    useEffect(() => {
        form.setFieldsValue({
            current_password: '',
            new_password: '',
            cf_password: ''
        })
    }, [])

    const layout = {
        labelCol: {
            span: 24
        },
        wrapperCol: {
            span: 24
        }
    }
    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16
        }
    }

    const onFinish = (values) => {
        if (
            values.current_password &&
            values.new_password &&
            values.cf_password
        ) {
            setLoading(true)
            AuthenticateAPI.changePassword({
                current_password: values.current_password,
                new_password: values.new_password
            })
                .then((res) => {
                    setLoading(false)
                    form.setFieldsValue({
                        current_password: '',
                        new_password: '',
                        cf_password: ''
                    })
                    notification.success({
                        message: 'Success',
                        description: getTranslateText(
                            'form.change_password.success'
                        )
                    })
                })
                .catch((err) => {
                    setLoading(false)
                    notification.error({
                        message: 'Error',
                        description: err.message
                    })
                })
        }
    }

    return (
        <div className={cn(styles.wrapChangePassword)}>
            <div className={cn(styles.title)}>
                {getTranslateText('change_password')}
            </div>
            <Form
                {...layout}
                name='basic'
                initialValues={{
                    remember: true
                }}
                onFinish={onFinish}
                size='large'
                className={cn(styles.formChangePassWord)}
            >
                <Form.Item
                    name='current_password'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText(
                                'form.change_password.error.input_old'
                            )
                        }
                    ]}
                >
                    <Input.Password
                        placeholder={getTranslateText('current_password')}
                    />
                </Form.Item>
                <Form.Item
                    name='new_password'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText(
                                'form.change_password.error.input_new'
                            )
                        }
                    ]}
                >
                    <Input.Password
                        placeholder={getTranslateText('new_password')}
                    />
                </Form.Item>
                <Form.Item
                    name='cf_password'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText(
                                'form.change_password.error.input_confirm'
                            )
                        }
                    ]}
                >
                    <Input.Password
                        placeholder={getTranslateText('confirm_password')}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        className={cn(styles.btnButtonForm)}
                        shape='round'
                        type='primary'
                        htmlType='submit'
                        disabled={isLoading}
                    >
                        {getTranslateText('update')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ChangePassword
