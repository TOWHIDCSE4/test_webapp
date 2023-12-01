import React, { memo, useEffect, FC } from 'react'
import { Modal, Alert, Divider, Image, Space, Tag } from 'antd'
import cn from 'classnames'
import { useAuth } from 'contexts/Auth'
import Login from 'components/Atoms/Form/Login'
import SignUp from 'components/Atoms/Form/SignUp'
import { AUTH_TYPES } from 'const/auth-type'
import { useGoogleLogin } from 'react-google-login'
import { getTranslateText } from 'utils/translate-utils'
import _ from 'lodash'
import { EMAIL_NOT_VERIFY_CODE } from 'const'
import styles from './AuthModal.module.scss'

const CLIENT_ID: any = process.env.NEXT_PUBLIC_CLIENT_ID

type Props = {
    show: boolean
    onClose: () => void
    authType: string
    setAuthType: (authType: string) => void
    toggleResendEmail: (val: boolean) => void
}

const AuthModal: FC<Props> = ({
    show,
    onClose,
    authType,
    setAuthType,
    toggleResendEmail
}) => {
    const { onFailure, onSuccess, error, user, resetState, signUpSuccess } =
        useAuth()

    const { signIn } = useGoogleLogin({
        onSuccess,
        clientId: CLIENT_ID,
        onFailure
    })

    useEffect(() => {
        if (error && resetState) resetState()
    }, [authType])

    const handleClose = () => {
        if (resetState) resetState()
        onClose()
    }

    const onResendEmail = () => {
        resetState()
        onClose()
        toggleResendEmail(true)
    }

    const renderAlert = () => {
        const codeError = _.get(error, 'code')
        if (codeError && codeError === EMAIL_NOT_VERIFY_CODE) {
            return (
                <Alert
                    message={getTranslateText('common.error')}
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
                message={getTranslateText('common.error')}
                description={error}
                type='error'
                showIcon
                style={{ marginBottom: '1rem' }}
            />
        )
    }

    const renderBody = () => (
        <>
            {error && renderAlert()}
            {authType === AUTH_TYPES.LOGIN ? (
                <Login toSignUp={() => setAuthType(AUTH_TYPES.SIGNUP)} />
            ) : (
                (authType === AUTH_TYPES.SIGNUP ||
                    authType === AUTH_TYPES.BECOME_A_TEACHER) && (
                    <SignUp
                        toLogIn={() => setAuthType(AUTH_TYPES.LOGIN)}
                        authType={authType}
                    />
                )
            )}
        </>
    )

    return (
        <Modal
            maskClosable
            centered
            className={styles.customModal}
            closable
            visible={show}
            onCancel={handleClose}
            title={
                authType === AUTH_TYPES.LOGIN ? (
                    <div className={styles.title}>
                        {/* <Image
                            src='/static/img/student/navbar/logo.png'
                            width={120}
                            preview={false}
                            className='clickable'
                        /> */}
                        <div className='mt-1 mb-3'>
                            <h4 className={styles.headTitle}>
                                {getTranslateText('form.login.title')}
                            </h4>
                        </div>
                    </div>
                ) : authType === AUTH_TYPES.SIGNUP ? (
                    <div className={styles.title}>
                        {/* <Image
                            src='/static/img/student/navbar/logo.png'
                            width={120}
                            preview={false}
                            className='clickable'
                        /> */}
                        <div className='mt-1'>
                            <h4 className={styles.headTitle}>
                                {getTranslateText('get_started')}
                            </h4>
                        </div>
                    </div>
                ) : authType === AUTH_TYPES.FORGOT_PASSWORD ? (
                    <div className={styles.title}>
                        {/* <Image
                            src='/static/img/student/navbar/logo.png'
                            width={120}
                            preview={false}
                            className='clickable'
                        /> */}
                        <div className='mt-1'>
                            <h4 className={styles.headTitle}>
                                {getTranslateText('forgot_password')}
                            </h4>
                        </div>
                    </div>
                ) : (
                    authType === AUTH_TYPES.BECOME_A_TEACHER && (
                        <div className={styles.title}>
                            {/* <Image
                                src='/static/img/student/navbar/logo.png'
                                width={120}
                                preview={false}
                                className='clickable'
                            /> */}
                            <div className='mt-1'>
                                <h4 className={styles.headTitle}>
                                    {getTranslateText('become_a_teacher')}
                                </h4>
                            </div>
                        </div>
                    )
                )
            }
            footer={null}
            width={signUpSuccess ? 758 : 500}
        >
            {signUpSuccess ? (
                <Alert
                    message={
                        user?.is_verified_email === false
                            ? getTranslateText('please_verify_your_email')
                            : getTranslateText('auth.register_success')
                    }
                    description={
                        user?.is_verified_email === false ? (
                            <div>
                                {getTranslateText(
                                    'please_verify_your_email.prefix'
                                )}
                                <a
                                    href={`mailto:${user && user.email}`}
                                    className='colorBlue4'
                                >
                                    <span> {user && user.email}</span>
                                </a>
                                <span>. </span>
                                {getTranslateText(
                                    'please_verify_your_email.suffix'
                                )}
                            </div>
                        ) : (
                            <div>{getTranslateText('auth.register_desc')}</div>
                        )
                    }
                    type='success'
                    showIcon
                    style={{ marginBottom: '1rem' }}
                />
            ) : (
                renderBody()
            )}
        </Modal>
    )
}

export default memo(AuthModal)
