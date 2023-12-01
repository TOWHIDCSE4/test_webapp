import React, { useEffect, useReducer } from 'react'
import Layout from 'components/Atoms/HomePage/Layout'
// import listStyles from "../../styles/list";
import { useRouter } from 'next/router'
import {
    getInterpolationTransText,
    getTranslateText
} from 'utils/translate-utils'
import cn from 'classnames'
import { Button, Input } from 'antd'
import AuthenticateAPI from '../../api/AuthenticateAPI'
import { notify } from '../../contexts/Notification'
import styles from '../landing-page/Login.module.scss'

const ResetPassword = ({ data }) => {
    const router = useRouter()

    const { locale } = router

    const { key } = router.query

    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            isSuccess: false,
            username: '',
            email: '',
            new_password: '',
            isSuccessPassword: false
        }
    )

    useEffect(() => {
        setValues({
            username: '',
            email: ''
        })
    }, [])

    const onChangeForm = (key) => (e) => {
        const value =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setValues({ [key]: value })
    }

    const onSubmit = (e) => {
        if (values.username && values.email) {
            setValues({ isLoading: true })
            AuthenticateAPI.requestResetPassword({
                email: values.email,
                user_name: values.username
            })
                .then((res) => {
                    setValues({ isSuccess: true, isLoading: false })
                })
                .catch((err) => {
                    notify('error', err.message)
                    setValues({ isLoading: false })
                })
        }
    }

    const onNewPassword = (e) => {
        if (values.new_password) {
            setValues({ isLoading: true })
            AuthenticateAPI.resetPassword({
                new_password: values.new_password,
                token: key
            })
                .then((res) => {
                    setValues({ isSuccessPassword: true, isLoading: false })
                    router.replace(router.pathname)
                })
                .catch((err) => {
                    notify('error', err.message)
                    setValues({ isLoading: false })
                })
        }
    }
    return (
        <section>
            <div className={cn(styles.bg_login_screen)}>
                <div className={cn(styles.login_page)}>
                    <div className={cn(styles.login_box)}>
                        <div className={cn(styles.login_form)}>
                            <div className='mt-1 mb-3'>
                                <h4
                                    className={styles.headTitle}
                                    style={{ marginTop: '17vh' }}
                                >
                                    {key
                                        ? getTranslateText(
                                              'reset_password.title'
                                          )
                                        : values.isSuccess
                                        ? getTranslateText(
                                              'reset_password.check_mail'
                                          )
                                        : getTranslateText(
                                              'reset_password.forget_password'
                                          )}
                                </h4>
                            </div>
                            <div className={cn(styles.ResetPassword_note)}>
                                {key ? null : values.isSuccess ? (
                                    <span>
                                        {getInterpolationTransText(
                                            'reset_password.message',
                                            {
                                                '{{mail}}': values.email
                                            },
                                            locale
                                        )}
                                    </span>
                                ) : !values.isSuccessPassword ? (
                                    <span>
                                        {getTranslateText(
                                            'reset_password.enter_your_password'
                                        )}
                                    </span>
                                ) : (
                                    <></>
                                )}
                            </div>
                            {key ? (
                                <>
                                    <div
                                        className={cn(
                                            styles.ResetPassword_text_box
                                        )}
                                    >
                                        <Input.Password
                                            type='password'
                                            className={styles.customInput}
                                            style={{ margin: '10px 0' }}
                                            placeholder={getTranslateText(
                                                'reset_password.enter_new_password'
                                            )}
                                            id='new_password'
                                            autoComplete='off'
                                            onChange={onChangeForm(
                                                'new_password'
                                            )}
                                            value={values.new_password}
                                        />
                                    </div>
                                    <Button
                                        id='sumbit_btn'
                                        htmlType='button'
                                        className={cn(
                                            styles['landing-page-button']
                                        )}
                                        disabled={
                                            values.isLoading ||
                                            !values.new_password
                                        }
                                        onClick={onNewPassword}
                                    >
                                        {getTranslateText('common.submit')}
                                    </Button>
                                </>
                            ) : values.isSuccessPassword ? (
                                <div style={{ fontWeight: 600, fontSize: 15 }}>
                                    <span>
                                        {getTranslateText(
                                            'reset_password.message_success'
                                        )}
                                        :
                                    </span>{' '}
                                    <a
                                        className={styles.signupTT}
                                        href={`${
                                            locale === 'en'
                                                ? '/en/login'
                                                : '/vi/login'
                                        }`}
                                        style={{
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            color: '#1a61ae'
                                        }}
                                    >
                                        {getTranslateText('login')}
                                    </a>
                                </div>
                            ) : values.isSuccess ? (
                                <div className='text-bar'>
                                    <div className='text-li-title'>
                                        <span>
                                            {getTranslateText(
                                                'reset_password.receive_email'
                                            )}
                                        </span>
                                    </div>
                                    <li className='text-li'>
                                        <span>
                                            {getTranslateText(
                                                'reset_password.check_email'
                                            )}
                                        </span>
                                    </li>
                                    <li className='text-li text-li-blue'>
                                        <span
                                            id='result_message_text'
                                            style={{
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }}
                                            onClick={onSubmit}
                                        >
                                            <span>
                                                {getTranslateText(
                                                    'reset_password.resend_email'
                                                )}
                                            </span>
                                        </span>
                                    </li>
                                    <div className='text-send-success'>
                                        <span
                                            className={cn(
                                                styles.text_color_green
                                            )}
                                        >
                                            {getTranslateText(
                                                'reset_password.has_send_email'
                                            )}{' '}
                                            {`${values.email}`}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Input
                                        type='text'
                                        className={styles.customInput}
                                        style={{ marginBottom: '10px' }}
                                        placeholder={getTranslateText(
                                            'reset_password.enter_your_username'
                                        )}
                                        id='username'
                                        autoComplete='off'
                                        onChange={onChangeForm('username')}
                                        value={values.username}
                                    />
                                    <Input
                                        type='text'
                                        className={styles.customInput}
                                        style={{ marginBottom: '10px' }}
                                        placeholder={getTranslateText(
                                            'reset_password.enter_your_email'
                                        )}
                                        id='email_address'
                                        autoComplete='off'
                                        onChange={onChangeForm('email')}
                                        value={values.email}
                                    />
                                    <Button
                                        id='sumbit_btn'
                                        htmlType='button'
                                        className={cn(
                                            styles['landing-page-button']
                                        )}
                                        disabled={
                                            values.isLoading ||
                                            !values.username ||
                                            !values.email
                                        }
                                        onClick={onSubmit}
                                    >
                                        {getTranslateText('common.submit')}
                                    </Button>
                                </div>
                            )}
                            {/* <div
                                className='mt-2 small-secondary text-center'
                                style={{ marginTop: '10px' }}
                            >
                                <span className='mr-2 gray-3'>
                                    {getTranslateText('ready_have_an_account')}?
                                </span>{' '}
                                <a
                                    className={styles.signupTT}
                                    href='/login'
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    {getTranslateText('login')}
                                </a>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className={cn(styles.bg_login_right)}>
                    <div className={cn(styles.bg_title_right)}>
                        <div className={cn(styles.text_color_bg)}>
                            {getTranslateText(
                                'form.login.title_login.above_right'
                            )}
                        </div>
                        <div className={cn(styles.text_color_bg)}>
                            {getTranslateText(
                                'form.login.title_login.mid_right'
                            )}
                        </div>
                        <div className={cn(styles.text_color_green)}>
                            {getTranslateText(
                                'form.login.title_login.below_right'
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export const getStaticProps = async () => {
    const data = []
    return {
        props: { data } // will be passed to the page component as props
    }
}

export default ResetPassword
