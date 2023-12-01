import React, { useEffect, useReducer, useState } from 'react'
import Layout from 'components/Atoms/HomePage/Layout'
// import listStyles from "../../styles/list";
import { useRouter } from 'next/router'
import {
    getInterpolationTransText,
    getTranslateText
} from 'utils/translate-utils'
import cn from 'classnames'
import { Statistic, Button, Input, Row, Col, notification, Result } from 'antd'
import { useAuth } from 'contexts/Auth'
import moment from 'moment'
import { HOUR_TO_MS } from 'const'
import { getCookie } from 'helpers/cookie'
import AuthenticateAPI from '../../api/AuthenticateAPI'
import { notify } from '../../contexts/Notification'
import styles from '../landing-page/Login.module.scss'
import UserAPI from '../../api/UserAPI'

const { Countdown } = Statistic

const VerifyPhone = ({ data }) => {
    const router = useRouter()
    const { user, goToDashboard } = useAuth()
    const [verify_phone, setVerifyPhone] = useState<boolean>(false)
    const locale = getCookie('locale')
    const [deadline, setDeadline] = useState<any>(moment().valueOf())
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            userData: user,
            isLoading: false,
            otp_code: '',
            otpExpired: false
        }
    )
    const fetchUser = async (userId) => {
        if (userId) {
            setValues({ isLoading: true })
            UserAPI.getUserById({
                user_id: userId
            })
                .then((res: any) => {
                    setValues({ isLoading: false })
                    if (res) {
                        if (res.is_verified_phone) {
                            setVerifyPhone(true)
                        }
                        setValues({
                            userData: res
                        })
                        const deadlineEffect =
                            res.otp_sent_time + 2 * HOUR_TO_MS
                        if (deadlineEffect < moment().valueOf()) {
                            setValues({ otpExpired: true })
                        }
                        setDeadline(deadlineEffect)
                    } else {
                        router.push('/')
                    }
                })
                .catch((err) => {
                    notify('error', err.message)
                    setValues({ isLoading: false })
                })
        } else {
            router.push('/')
        }
    }

    useEffect(() => {
        const { user_id } = router.query
        if (user_id) {
            fetchUser(user_id)
        }
    }, [router.query, verify_phone])

    const onChangeOtpCode = () => (e) => {
        const otpCode = e.target.value
        values.otpCode = otpCode
        setValues({ otp_code: otpCode })
    }

    const onSubmit = (e) => {
        if (values.otp_code) {
            setValues({ isLoading: true })
            UserAPI.verifyOtpPhone({
                otp_code: values.otp_code,
                user_id: values.userData?.id
            })
                .then((res) => {
                    setValues({ isLoading: false })
                    setVerifyPhone(true)
                    notification.success({
                        message: 'Success',
                        description: getTranslateText('verify_phone.success')
                    })
                })
                .catch((err) => {
                    notify('error', err.message)
                    setValues({ isLoading: false })
                })
        }
    }

    const resendOtpCode = () => {
        setValues({ isLoading: true })
        if (values.userData?.phone_number) {
            UserAPI.resentOTPCode({
                phone_number: values.userData?.phone_number,
                user_id: values.userData?.id
            })
                .then((res) => {
                    setValues({ isLoading: false })
                    if (res) {
                        setValues({
                            userData: res
                        })
                        const deadlineEffect =
                            res.otp_sent_time + 2 * HOUR_TO_MS
                        if (deadlineEffect < moment().valueOf()) {
                            setValues({ otpExpired: true })
                        }
                        setDeadline(deadlineEffect)
                    }
                    notification.success({
                        message: 'Success',
                        description: getTranslateText(
                            'verify_phone.resend_success'
                        )
                    })
                })
                .catch((err) => {
                    setValues({ isLoading: false })
                    notification.error({
                        message: 'Error',
                        description: err.message
                    })
                })
        } else {
            notification.error({
                message: 'Error',
                description: getTranslateText(
                    'verify_phone.error.phone_not_found'
                )
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
                                    style={{
                                        marginTop: '17vh',
                                        textAlign: 'center'
                                    }}
                                >
                                    {getTranslateText('verify_phone.title')}
                                </h4>
                            </div>
                            {verify_phone && (
                                <Result
                                    status='success'
                                    title={getTranslateText(
                                        'verify_phone.title_account_active'
                                    )}
                                    subTitle={getTranslateText(
                                        'verify_phone.note_verify_success'
                                    )}
                                    extra={[
                                        <Button
                                            type='primary'
                                            key='console'
                                            onClick={() =>
                                                locale === 'vi'
                                                    ? router.push('/vi/login')
                                                    : router.push('/login')
                                            }
                                        >
                                            {getTranslateText(
                                                'verify_phone.go_login'
                                            )}
                                        </Button>
                                    ]}
                                />
                            )}
                            {!verify_phone && (
                                <>
                                    <div
                                        className={cn(
                                            styles.ResetPassword_note
                                        )}
                                    >
                                        {getTranslateText(
                                            'verify_phone.text_note'
                                        )}
                                        :{' '}
                                        <span
                                            style={{
                                                color: '#1FC974',
                                                fontSize: 17
                                            }}
                                        >
                                            {values.userData?.phone_number}
                                        </span>
                                    </div>
                                    <div className='ResetPassword-text-box'>
                                        <Input
                                            type='text'
                                            className={styles.customInput}
                                            style={{ marginBottom: '10px' }}
                                            placeholder={getTranslateText(
                                                'input_otp'
                                            )}
                                            id='otp_code'
                                            autoComplete='off'
                                            onChange={onChangeOtpCode()}
                                            value={values.otp_code}
                                        />
                                    </div>
                                    <Row
                                        gutter={[48, 24]}
                                        style={{
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {!values.otpExpired && (
                                            <>
                                                <Col
                                                    span={12}
                                                    style={{
                                                        textAlign: 'right',
                                                        marginTop: 10,
                                                        paddingRight: 5
                                                    }}
                                                >
                                                    {getTranslateText(
                                                        'verify_phone.text_expired_otp'
                                                    )}
                                                    :
                                                </Col>
                                                <Col
                                                    span={12}
                                                    style={{
                                                        textAlign: 'left',
                                                        paddingLeft: 0
                                                    }}
                                                >
                                                    <Countdown
                                                        style={{
                                                            color: '#1FC974',
                                                            fontSize: 16
                                                        }}
                                                        value={
                                                            deadline ||
                                                            moment().valueOf()
                                                        }
                                                        onFinish={() =>
                                                            setValues({
                                                                otpExpired: true
                                                            })
                                                        }
                                                    />
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                    <Button
                                        id='sumbit_btn'
                                        htmlType='button'
                                        className={cn(
                                            styles['landing-page-button']
                                        )}
                                        disabled={
                                            values.isLoading || !values.otp_code
                                        }
                                        onClick={onSubmit}
                                    >
                                        {getTranslateText('confirm')}
                                    </Button>
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            marginTop: 15
                                        }}
                                    >
                                        {!values.otpExpired
                                            ? getTranslateText(
                                                  'verify_phone.text_not_reeceived_otp'
                                              )
                                            : getTranslateText(
                                                  'verify_phone.title_expired_otp'
                                              )}{' '}
                                        <span
                                            style={{
                                                color: '#1A61AE',
                                                fontSize: 17,
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }}
                                            onClick={resendOtpCode}
                                        >
                                            {getTranslateText(
                                                'verify_phone.send_again_now'
                                            )}
                                        </span>
                                    </div>
                                </>
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
        </section>
    )
}

export const getStaticProps = async () => {
    const data = []
    return {
        props: { data } // will be passed to the page component as props
    }
}

export default VerifyPhone
