import React, { FC, memo, useEffect, useState } from 'react'
import { Modal, Button, Input, Alert } from 'antd'
import AuthenticateAPI from 'api/AuthenticateAPI'
import { notify } from 'contexts/Notification'
import { getTranslateText } from 'utils/translate-utils'

type Props = {
    visible: boolean
    toggleModal: (val: boolean) => void
}

const ResendEmailModal: FC<Props> = ({ visible, toggleModal }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        setUsername('')
        setEmail('')
        setSuccess(false)
    }, [visible])
    const handleResendEmail = async () => {
        const payload = {
            user_name: username,
            email
        }
        setLoading(true)
        AuthenticateAPI.resendVerifyEmail(payload)
            .then(() => {
                setSuccess(true)
            })
            .catch((err: any) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    return (
        <Modal
            maskClosable
            centered
            visible={visible}
            title={getTranslateText('resend_email_title')}
            closable
            onCancel={() => toggleModal(false)}
            footer={null}
        >
            {success ? (
                <Alert
                    message={getTranslateText('please_verify_your_email')}
                    description={
                        <div>
                            {getTranslateText(
                                'please_verify_your_email.prefix'
                            )}
                            <a href={`mailto:${email}`} className='colorBlue4'>
                                <span> {email}</span>
                            </a>
                            <span>. </span>
                            {getTranslateText(
                                'please_verify_your_email.suffix'
                            )}
                        </div>
                    }
                    type='success'
                    showIcon
                    style={{ marginBottom: '1rem' }}
                />
            ) : (
                <>
                    <div>
                        <Input
                            placeholder={getTranslateText(
                                'enter_your_username'
                            )}
                            style={{ width: '300px', marginBottom: 20 }}
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value as string)
                            }
                        />
                        <Input
                            placeholder={getTranslateText('enter_your_email')}
                            style={{ width: '300px', marginBottom: 20 }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value as string)}
                        />
                    </div>
                    <Button
                        type='primary'
                        key='console'
                        onClick={handleResendEmail}
                        disabled={!username || !email}
                        loading={loading}
                    >
                        {getTranslateText('resend_email')}
                    </Button>
                </>
            )}
        </Modal>
    )
}

export default memo(ResendEmailModal)
