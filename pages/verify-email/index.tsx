import React, { useEffect, useState } from 'react'
import Layout from 'components/Atoms/HomePage/Layout'
import { Result, Button, Input, notification } from 'antd'
import { useRouter } from 'next/router'
import { VERIFY_EMAIL_STATUS } from 'const/status'
import { useAuth } from 'contexts/Auth'
import AuthenticateAPI from 'api/AuthenticateAPI'

const Index = () => {
    const router = useRouter()

    const { access_token, status } = router.query

    const { verifyEmail, goToDashboard } = useAuth()

    const [email, setEmail] = useState<string>('')
    const [isSended, setIsSended] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        async function verify() {
            setLoading(true)
            await verifyEmail(access_token as string)
            setLoading(false)
        }
        if (access_token && status === VERIFY_EMAIL_STATUS.SUCCESS) {
            verify()
        }
    }, [access_token, status])

    const onResendEmail = () => {
        if (email) {
            setLoading(true)
            AuthenticateAPI.resendVerifyEmail({ email })
                .then((res) => {
                    setIsSended(true)
                })
                .catch((err) => {
                    notification.error({
                        message: 'error',
                        description: err.message
                    })
                })
                .finally(() => setLoading(false))
        }
    }

    const showUI = () => {
        if (isSended) {
            ;<Result
                status='success'
                title='Resend Email Success'
                subTitle={
                    <span>
                        A verification link has been sent to{' '}
                        <a className='colorBlue4' href={`mailto:${email}`}>
                            {email}
                        </a>
                        . Please click on the link that has just been sent to
                        your email account to verify your email and continue the
                        registration process.
                    </span>
                }
            />
        }

        if (access_token && status === VERIFY_EMAIL_STATUS.SUCCESS) {
            return (
                <Result
                    status='success'
                    title='Verification Success'
                    subTitle='You email address has been verified. You can now proceed to you Dashboard.'
                    extra={[
                        <Button
                            type='primary'
                            key='console'
                            onClick={goToDashboard}
                        >
                            Go Dashboard
                        </Button>
                    ]}
                />
            )
        }

        if (status === VERIFY_EMAIL_STATUS.FAILURE) {
            return (
                <Result
                    status='error'
                    title='Verification Fail'
                    subTitle='Verify your email timeout. Please enter your email registered before to resend email.'
                    extra={
                        <>
                            <Input
                                placeholder='Enter your email'
                                style={{ width: '300px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button
                                type='primary'
                                key='console'
                                onClick={onResendEmail}
                                loading={isLoading}
                            >
                                Resend Email
                            </Button>
                        </>
                    }
                />
            )
        }

        return (
            <Result
                status='404'
                title='404'
                subTitle='Sorry, the page you visited does not exist.'
                extra={
                    <Button type='primary' onClick={() => router.push('/')}>
                        Back Home
                    </Button>
                }
            />
        )
    }

    return <Layout>{showUI()}</Layout>
}

export default Index
