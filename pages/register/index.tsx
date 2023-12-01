import { Alert, Button, Checkbox, Form, Input, Tag } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import Login from 'components/Atoms/Form/Login'
import { getTranslateText } from 'utils/translate-utils'
import { useAuth } from 'contexts/Auth'
import { AUTH_TYPES, EMAIL_NOT_VERIFY_CODE } from 'const'
import SignUp from 'components/Atoms/Form/SignUp'
import _ from 'lodash'
import ResendEmailModal from 'components/Atoms/ResendEmailModal'
import styles from '../landing-page/Login.module.scss'

const LoginPage = () => {
    const { onFailure, onSuccess, error, user, resetState, signUpSuccess } =
        useAuth()

    const [authType, setAuthType] = useState(AUTH_TYPES.SIGNUP)
    const [visibleResendEmail, setVisibleResendEmail] = useState(false)

    const toggleResendEmail = useCallback(
        (val: boolean) => {
            setVisibleResendEmail(val)
        },
        [visibleResendEmail]
    )

    const onResendEmail = () => {
        resetState()
        toggleResendEmail(true)
    }

    const renderAlert = () => {
        const codeError = _.get(error, 'code')
        if (codeError && codeError === EMAIL_NOT_VERIFY_CODE) {
            return (
                <Alert
                    message='Error'
                    description={
                        <span>
                            {_.get(error, 'message')}
                            <span>. </span>
                            <span className='clickable' onClick={onResendEmail}>
                                <Tag color='processing'>
                                    {getTranslateText('resend_email')}
                                </Tag>
                            </span>
                        </span>
                    }
                    type='error'
                    showIcon
                    style={{ marginBottom: '1rem' }}
                />
            )
        }
        return (
            <Alert
                message='Error'
                description={error}
                type='error'
                showIcon
                style={{ marginBottom: '1rem' }}
            />
        )
    }

    useEffect(() => {
        if (error && resetState) resetState()
    }, [authType])

    return (
        <section>
            <div className={cn(styles.bg_login_screen)}>
                <div className={cn(styles.login_page)}>
                    <div className={cn(styles.login_box)}>
                        <div className={cn(styles.login_form)}>
                            <div className='mt-1 mb-3 '>
                                {authType === AUTH_TYPES.LOGIN ? (
                                    <h4
                                        className={styles.headTitle}
                                        style={{ marginTop: '17vh' }}
                                    >
                                        {getTranslateText('form.login.title')}
                                    </h4>
                                ) : (
                                    <h4
                                        className={styles.headTitle}
                                        style={{ marginTop: '4vh' }}
                                    >
                                        {getTranslateText('register.title')}
                                    </h4>
                                )}
                            </div>
                            {error && renderAlert()}
                            {authType === AUTH_TYPES.LOGIN ? (
                                <Login
                                    toSignUp={() =>
                                        setAuthType(AUTH_TYPES.SIGNUP)
                                    }
                                />
                            ) : (
                                (authType === AUTH_TYPES.SIGNUP ||
                                    authType ===
                                        AUTH_TYPES.BECOME_A_TEACHER) && (
                                    <SignUp
                                        toLogIn={() =>
                                            setAuthType(AUTH_TYPES.LOGIN)
                                        }
                                        authType={authType}
                                    />
                                )
                            )}
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
            <ResendEmailModal
                visible={visibleResendEmail}
                toggleModal={toggleResendEmail}
            />
        </section>
    )
}

export default LoginPage
