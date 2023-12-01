import { Form, Input, Button, Checkbox } from 'antd'
import {
    UserOutlined,
    LockOutlined,
    EyeTwoTone,
    EyeInvisibleOutlined
} from '@ant-design/icons'
import cn from 'classnames'
import { useCallback, memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from 'contexts/Auth'
import * as store from 'helpers/storage'
import { getTranslateText } from 'utils/translate-utils'
import { useRouter } from 'next/router'
import { getCookie } from 'helpers/cookie'
import styles from './Login.module.scss'

const Login = ({ toSignUp, isMeeting = false }) => {
    const { isLoading, login, getRememberValues } = useAuth()
    const [form] = Form.useForm()
    const [remember, setRemember] = useState(false)
    const router = useRouter()
    const { zalo_id } = router.query

    useEffect(() => {
        setRemember(store.get('remember'))
        form.setFieldsValue(getRememberValues())
    }, [])

    const handleLogin = useCallback(
        async (values) => {
            await login({
                email: values.email,
                password: values.password,
                remember,
                zalo_id: zalo_id || ''
            })
        },
        [remember, zalo_id]
    )

    const locale = getCookie('locale')

    return (
        <>
            <Form name='loginForm' onFinish={handleLogin} form={form}>
                <div>
                    <span className={cn(styles['landing-page-label-form'])}>
                        {getTranslateText('username_email')}
                    </span>
                    <span className={styles.requiredField}>*</span>
                </div>
                <Form.Item
                    className='mb-4'
                    name='email'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText('input_u_e')
                        }
                    ]}
                >
                    <Input
                        // prefix={
                        //     <UserOutlined className='site-form-item-icon' />
                        // }
                        size='large'
                        className={styles.customInput}
                    />
                </Form.Item>
                <div
                    className='flex justify-content-between items-center'
                    style={{
                        justifyContent: 'space-between'
                    }}
                >
                    <div>
                        <span className={cn(styles['landing-page-label-form'])}>
                            {getTranslateText('password')}
                        </span>
                        <span className={styles.requiredField}>*</span>
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <a
                            href={`${
                                locale === 'en'
                                    ? '/en/reset-password'
                                    : '/vi/reset-password'
                            }`}
                            style={{ color: '#1a61ae', fontWeight: 'bold' }}
                        >
                            {getTranslateText('form.login.forgot_password')}
                        </a>
                    </div>
                </div>
                <Form.Item
                    className='mb-3'
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText('input_password')
                        }
                    ]}
                >
                    <Input.Password
                        // prefix={
                        //     <LockOutlined className='site-form-item-icon' />
                        // }
                        type='password'
                        size='large'
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        className={styles.customInputPassword}
                    />
                </Form.Item>
                {!isMeeting && (
                    <div
                        className='flex justify-content-between items-center mb-3 font-weight-bold'
                        style={{
                            marginBottom: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        <Checkbox
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        >
                            {getTranslateText('form.login.remember_me')}
                        </Checkbox>
                        {/* <Link href='/reset-password'>
                            {getTranslateText('form.login.forgot_password')}
                        </Link> */}
                    </div>
                )}
                <Form.Item className='mb-3'>
                    <Button
                        htmlType='submit'
                        className={cn(styles['landing-page-button'])}
                        loading={isLoading}
                    >
                        {getTranslateText('login')}
                    </Button>
                </Form.Item>
            </Form>
            {!isMeeting && (
                <div className='mb-3 small-secondary text-center font-wight-bold'>
                    <span
                        className='mr-2 gray-3 text-black'
                        style={{ fontWeight: 'bold' }}
                    >
                        {getTranslateText('form.login.no_account')}?
                    </span>{' '}
                    <a
                        className={cn('clickable', styles.signUpTt)}
                        style={{ fontWeight: 'bold' }}
                        href={`${
                            locale === 'en' ? '/en/register' : '/vi/register'
                        }`}
                    >
                        {getTranslateText('sign_up_now')}
                    </a>
                </div>
            )}
        </>
    )
}

export default memo(Login)
