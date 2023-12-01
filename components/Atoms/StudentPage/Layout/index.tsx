import React, { FC, useEffect } from 'react'
import Head from 'next/head'
import _ from 'lodash'
import { Alert, Button, Layout, notification } from 'antd'
import { useAuth } from 'contexts/Auth'
import { getTranslateText } from 'utils/translate-utils'
import Link from 'next/link'
import AuthenticateAPI from 'api/AuthenticateAPI'
import SideBar from './SideBar'
import RightSideBar from './RightSideBar'
import TestEquipmentButton from '../../TestEquipmentButton'

const Index: FC = (props: any) => {
    const { user } = useAuth()
    const validateInfo = () => {
        if (user.first_name && user.date_of_birth && user.phone_number)
            return true
    }
    const onResendEmail = () => {
        if (user && user.email) {
            AuthenticateAPI.resendVerifyEmail({
                user_name: user.username,
                email: user.email
            })
                .then((res) => {
                    notification.success({
                        message: 'Success',
                        description: getTranslateText(
                            'student.notice_verify_your_email'
                        )
                    })
                })
                .catch((err) => {
                    notification.error({
                        message: 'error',
                        description: err.message
                    })
                })
                .finally()
        }
    }
    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <meta
                    property='og:title'
                    content='EnglishPlus - Tiếng Anh trực tuyến 1 thầy 1 trò'
                />
                <meta property='og:site_name' content='EnglishPlus' />
                <meta
                    property='og:url'
                    content={`${process.env.NEXT_PUBLIC_DOMAIN}/`}
                />
                <meta property='og:description' content='' />
                <meta property='og:type' content='website' />
                <meta
                    property='og:image'
                    content={`${process.env.NEXT_PUBLIC_DOMAIN}/assets/images/homepage/brand_englishPlus.png`}
                />
                <title>EnglishPlus - Tiếng Anh trực tuyến 1 thầy 1 trò</title>
                <link
                    href='/static/css/HomePage/bootstrap.min.css'
                    rel='stylesheet'
                />
                <link href='/static/css/Student/all.css' rel='stylesheet' />
                <link
                    href='/static/css/Student/assets/css/style.min.css'
                    rel='stylesheet'
                />
                <link
                    href='/static/css/Student/style.css?v=1684462336000'
                    rel='stylesheet'
                />
                <script src='https://raw.github.com/rochal/jQuery-slimScroll/master/jquery.slimscroll.min.js' />
                {/* <script src='/static/css/Student/assets/bundles/libscripts.bundle.js' /> */}
                <script src='/static/css/Student/assets/bundles/vendorscripts.bundle.js' />
                {/* <script src='/static/css/Student/assets/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js' /> */}
                {/* <script src='/static/css/Student/assets/plugins/jquery-inputmask/jquery.inputmask.bundle.js' /> */}
                <script src='/static/css/Student/assets/bundles/sparkline.bundle.js' />
                <script src='/static/css/Student/assets/bundles/c3.bundle.js' />
                <script src='/static/css/Student/assets/bundles/mainscripts.bundle.js' />
                <script src='/static/css/Student/assets/js/pages/index.js' />
                <script src='/static/css/Student/assets/js/all.js' />
                {/* <script src='/static/css/Student/assets/js/pages/charts/c3.js' /> */}
                {/* <script src='/static/css/Student/assets/js/pages/forms/advanced-form-elements.js' /> */}
            </Head>
            <>
                <div className='theme-blush'>
                    <RightSideBar />
                    <SideBar />
                    <section className='content content-mobile'>
                        <div className='container-fluid'>
                            {!_.isEmpty(user) &&
                                (!validateInfo() ||
                                    !user.is_verified_email) && (
                                    <Alert
                                        message={getTranslateText(
                                            'common.warning'
                                        )}
                                        description={
                                            <>
                                                {!validateInfo() && (
                                                    <div>
                                                        {getTranslateText(
                                                            'student.warning_update_info'
                                                        )}
                                                        <span> </span>
                                                        <Link href='/student/profile'>
                                                            {getTranslateText(
                                                                'student.update_now'
                                                            )}
                                                        </Link>
                                                    </div>
                                                )}
                                                {!user?.is_verified_email && (
                                                    <div>
                                                        {getTranslateText(
                                                            'student.warning_verify_email'
                                                        )}
                                                        <span> </span>
                                                        <span
                                                            style={{
                                                                color: '#1890ff',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={
                                                                onResendEmail
                                                            }
                                                        >
                                                            {getTranslateText(
                                                                'student.verify_now'
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        }
                                        type='warning'
                                        showIcon
                                        className='mb-3'
                                    />
                                )}
                            {props.children}
                            <div
                                style={{
                                    position: 'fixed',
                                    bottom: '1rem',
                                    left: '1.5rem',
                                    zIndex: 99999
                                }}
                            >
                                <TestEquipmentButton />
                            </div>
                        </div>
                    </section>
                </div>
            </>
        </>
    )
}

export default Index
