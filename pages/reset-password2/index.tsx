import React, { useEffect, useReducer } from 'react'
import Layout from 'components/Atoms/HomePage/Layout'
// import listStyles from "../../styles/list";
import { useRouter } from 'next/router'
import {
    getInterpolationTransText,
    getTranslateText
} from 'utils/translate-utils'
import AuthenticateAPI from '../../api/AuthenticateAPI'
import { notify } from '../../contexts/Notification'

const ResetPassword2 = ({ data }) => {
    const router = useRouter()

    const { locale } = router

    const { key } = router.query

    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            isSuccess: false,
            email: '',
            new_password: '',
            isSuccessPassword: false
        }
    )

    useEffect(() => {}, [])

    const onChangeForm = (key) => (e) => {
        const value =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setValues({ [key]: value })
    }

    const onSubmit = (e) => {
        if (values.email) {
            setValues({ isLoading: true })
            AuthenticateAPI.requestResetPassword({ email: values.email })
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
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='ResetPassword ResetPassword-desktop'>
                        <div className='ResetPassword-box ResetPassword-box-email '>
                            <div className='ResetPassword-title'>
                                <span>
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
                                </span>
                            </div>
                            <div className='ResetPassword-note'>
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
                                ) : (
                                    <span>
                                        {getTranslateText(
                                            'reset_password.enter_your_password'
                                        )}
                                    </span>
                                )}
                            </div>
                            {key ? (
                                <>
                                    <div className='ResetPassword-text-box'>
                                        <input
                                            type='password'
                                            className='text-common undefined ResetPassword-text'
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
                                    <button
                                        id='sumbit_btn'
                                        type='button'
                                        className='ResetPassword-button btn btn-big btn-main btn-gradient'
                                        disabled={
                                            values.isLoading ||
                                            !values.new_password
                                        }
                                        onClick={onNewPassword}
                                    >
                                        <span>
                                            {getTranslateText(
                                                'common.submit'
                                            ).toUpperCase()}
                                        </span>
                                    </button>
                                </>
                            ) : values.isSuccessPassword ? (
                                <div className='text-send-success'>
                                    <span>
                                        {getTranslateText(
                                            'reset_password.message_success'
                                        )}
                                    </span>
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
                                        <span>
                                            {getTranslateText(
                                                'reset_password.has_send_email'
                                            )}{' '}
                                            {`${values.email}`}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className='ResetPassword-text-box'>
                                        <input
                                            type='text'
                                            className='text-common undefined ResetPassword-text'
                                            placeholder={getTranslateText(
                                                'reset_password.enter_your_email'
                                            )}
                                            id='email_address'
                                            autoComplete='off'
                                            onChange={onChangeForm('email')}
                                            value={values.email}
                                        />
                                    </div>
                                    <button
                                        id='sumbit_btn'
                                        type='button'
                                        className='ResetPassword-button btn btn-big btn-main btn-gradient'
                                        disabled={
                                            values.isLoading || !values.email
                                        }
                                        onClick={onSubmit}
                                    >
                                        <span>
                                            {getTranslateText('common.submit')}
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .container .row {
                    margin-top: 100px;
                    display: flex;
                    justify-content: center;
                }
                .ResetPassword-desktop,
                .ResetPassword-mobile,
                .ResetPassword-tablet {
                    padding-top: 10px;
                    padding-bottom: 40px;
                    font-size: 14px;
                    color: #333;
                }
                .ResetPassword-desktop .ResetPassword-box,
                .ResetPassword-mobile .ResetPassword-box,
                .ResetPassword-tablet .ResetPassword-box {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    -webkit-justify-content: flex-start;
                    justify-content: flex-start;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .ResetPassword-desktop .ResetPassword-title,
                .ResetPassword-mobile .ResetPassword-title,
                .ResetPassword-tablet .ResetPassword-title {
                    width: 640px;
                    padding-bottom: 30px;
                    margin-bottom: 30px;
                    border-bottom: 1px solid #ddd;
                    font-size: 23px;
                    line-height: 1.3;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: center;
                    justify-content: center;
                    -webkit-align-items: flex-start;
                    align-items: flex-start;
                }
                .ResetPassword-desktop .ResetPassword-note,
                .ResetPassword-mobile .ResetPassword-note,
                .ResetPassword-tablet .ResetPassword-note {
                    width: 580px;
                    margin-bottom: 20px;
                    font-size: 16px;
                    line-height: 1.5;
                    color: #777;
                }
                .ResetPassword-desktop
                    .ResetPassword-box-email
                    .ResetPassword-text-box,
                .ResetPassword-mobile
                    .ResetPassword-box-email
                    .ResetPassword-text-box,
                .ResetPassword-tablet
                    .ResetPassword-box-email
                    .ResetPassword-text-box {
                    margin-bottom: 20px;
                }
                .text-common {
                    display: inline-block;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                    height: 42px;
                    padding: 13px 15px;
                    border: 1px solid #ccc;
                    outline: none;
                    color: #333;
                }
                .error {
                    border: 1px solid #cb242b;
                }
                .ResetPassword-desktop
                    .ResetPassword-box-email
                    .ResetPassword-text,
                .ResetPassword-mobile
                    .ResetPassword-box-email
                    .ResetPassword-text,
                .ResetPassword-tablet
                    .ResetPassword-box-email
                    .ResetPassword-text {
                    width: 580px;
                    height: 42px;
                    margin-bottom: 5px;
                }
                .errorMsg {
                    font-size: 13px;
                    color: #cb242b;
                    margin-top: 5px;
                }
                .btn-gradient {
                    color: #fff;
                    background-image: linear-gradient(90deg, #007dea, #007dea);
                }
                .btn-big {
                    min-height: 42px;
                    padding: 8px 12px;
                    font-size: 14px;
                }
                .ResetPassword-desktop .ResetPassword-button,
                .ResetPassword-mobile .ResetPassword-button,
                .ResetPassword-tablet .ResetPassword-button {
                    width: 580px;
                    text-transform: uppercase;
                }
                .ResetPassword-desktop .text-bar,
                .ResetPassword-mobile .text-bar,
                .ResetPassword-tablet .text-bar {
                    width: 580px;
                }
                .ResetPassword-desktop .text-li-title,
                .ResetPassword-mobile .text-li-title,
                .ResetPassword-tablet .text-li-title {
                    margin-bottom: 5px;
                    font-size: 18px;
                    line-height: 1.67;
                }
                .ResetPassword-desktop .text-li,
                .ResetPassword-mobile .text-li,
                .ResetPassword-tablet .text-li {
                    list-style: none;
                    margin: 0;
                    padding-left: 20px;
                    position: relative;
                    top: 0;
                    left: 0;
                    font-size: 16px;
                    line-height: 1.5;
                    color: #777;
                }
                .ResetPassword-desktop .text-li:before,
                .ResetPassword-mobile .text-li:before,
                .ResetPassword-tablet .text-li:before {
                    content: '';
                    width: 4px;
                    height: 4px;
                    border-radius: 4px;
                    position: absolute;
                    top: 10px;
                    left: 0;
                    display: inline-block;
                    background-color: #777;
                }
                .ResetPassword-desktop .text-li-blue span,
                .ResetPassword-mobile .text-li-blue span,
                .ResetPassword-tablet .text-li-blue span {
                    color: #0071b9;
                    cursor: pointer;
                }
                .ResetPassword-desktop .text-send-fail,
                .ResetPassword-desktop .text-send-success,
                .ResetPassword-mobile .text-send-fail,
                .ResetPassword-mobile .text-send-success,
                .ResetPassword-tablet .text-send-fail,
                .ResetPassword-tablet .text-send-success {
                    margin-top: 5px;
                    padding-left: 20px;
                    font-size: 13px;
                    line-height: 1.5;
                    color: #5ebd5e;
                }
            `}</style>
            {/* <style jsx>{listStyles}</style> */}
        </Layout>
    )
}

export const getStaticProps = async () => {
    const data = []
    return {
        props: { data } // will be passed to the page component as props
    }
}

export default ResetPassword2
