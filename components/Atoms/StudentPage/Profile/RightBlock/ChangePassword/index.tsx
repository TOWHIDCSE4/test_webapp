import React, { useState } from 'react'
import { notify } from 'contexts/Notification'
import { Form, Input } from 'antd'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { getTranslateText } from 'utils/translate-utils'
import AuthenticateAPI from 'api/AuthenticateAPI'

const ChangePassword = () => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const onChangePassword = (values) => {
        setLoading(true)
        AuthenticateAPI.changePassword(values)
            .then((res) => {
                notify('success', res.message || 'Change password successfully')
                form.resetFields()
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }
    return (
        <>
            <strong>{getTranslateText('change_password')}</strong>
            <Form
                form={form}
                name='change-password'
                onFinish={onChangePassword}
                labelAlign='right'
                layout='vertical'
                labelCol={{ span: 22 }}
                wrapperCol={{ span: 24 }}
                className='pr-5 pl-5 pt-4'
            >
                <Form.Item
                    name='current_password'
                    label={getTranslateText(
                        'form.change_password.current_password'
                    )}
                    rules={[
                        {
                            required: true,
                            message: `${getTranslateText(
                                'form.change_password.current_password'
                            )} ${getTranslateText('is_required')}`
                        }
                    ]}
                >
                    <Input.Password
                        type='password'
                        placeholder={getTranslateText(
                            'form.change_password.current_password'
                        )}
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>
                <Form.Item
                    name='new_password'
                    label={getTranslateText(
                        'form.change_password.new_password'
                    )}
                    rules={[
                        {
                            required: true,
                            message: `${getTranslateText(
                                'form.change_password.new_password'
                            )} ${getTranslateText('is_required')}`
                        }
                    ]}
                >
                    <Input.Password
                        type='password'
                        placeholder={getTranslateText(
                            'form.change_password.new_password'
                        )}
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>
                <Form.Item
                    name='cf_password'
                    label={getTranslateText('form.change_password.cf_password')}
                    rules={[
                        {
                            required: true,
                            message: `${getTranslateText(
                                'form.change_password.cf_password'
                            )} ${getTranslateText('is_required')}`
                        }
                    ]}
                >
                    <Input.Password
                        type='password'
                        placeholder={getTranslateText(
                            'form.change_password.cf_password'
                        )}
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
                    <button
                        className='btn my-2 my-sm-0 big-bt card-shadow'
                        type='submit'
                        disabled={loading}
                    >
                        <span>{getTranslateText('save')}</span>
                        <img
                            src='/static/img/homepage/bt.png'
                            alt='Save button'
                        />
                    </button>
                </Form.Item>
            </Form>
        </>
    )
}

export default ChangePassword
