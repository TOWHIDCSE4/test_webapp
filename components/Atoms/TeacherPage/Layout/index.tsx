import React, { useState, useEffect, FC } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ROLES } from 'const/role'
import _ from 'lodash'
import { Row, Col, Layout, Alert, Button } from 'antd'
import ContainerWrap from 'components/Atoms/TeacherPage/ContainerWrap'
import { useAuth } from 'contexts/Auth'
import UserAPI from 'api/UserAPI'
import TeacherAPI from 'api/TeacherAPI'
import { TEACHER_REVIEW_STATUS } from 'const/status'
import { getTranslateText } from 'utils/translate-utils'
import TestEquipmentButton from 'components/Atoms/TestEquipmentButton'
import cn from 'classnames'
import NavBar from './NavBar'
import Header from './Header'
import styles from './Layout.module.scss'

const Index: FC = (props: any) => {
    // const user = storage.get('user');
    const { user } = useAuth()
    const router = useRouter()
    const [isSticky, setIsSticky] = useState(true)
    const [style, setStyle] = useState({
        marginTop: 55,
        lineHeight: 1
    })
    const [openMenu, setOpenMenu] = useState(false)
    const [teacher, setTeacher] = useState<any>({})
    useEffect(() => {
        if (window.innerWidth <= 425) {
            if (
                router.pathname === '/teacher/teaching-history' ||
                router.pathname === '/teacher/schedules'
            ) {
                setIsSticky(false)
                setStyle({
                    ...style,
                    marginTop: 0
                })
            }
        }
    }, [])

    useEffect(() => {
        const id = user?.id
        if (!_.isEmpty(user) && id && user?.role?.includes(ROLES.TEACHER)) {
            UserAPI.getFullInfoByTeacher().then((res) => {
                setTeacher(res)
            })
            setStyle({ ...style })
        }
    }, [user])

    const OpenMenu = () => {
        if (openMenu === true) {
            setOpenMenu(false)
        } else setOpenMenu(true)
    }

    const handleRequestReview = () => {
        TeacherAPI.teacherRequestReview().then(() => {
            UserAPI.getFullInfoByTeacher().then((res) => {
                setTeacher(res)
            })
        })
    }

    const renderAlertWithReviewStatus = () => {
        if (
            !_.isEmpty(user) &&
            user?.role?.includes(ROLES.TEACHER) &&
            !_.isEmpty(teacher)
        ) {
            switch (teacher.is_reviewed) {
                case TEACHER_REVIEW_STATUS.REJECT:
                    return (
                        <Row>
                            <Col offset={4} span={20}>
                                <Alert
                                    message={getTranslateText('warning')}
                                    type='error'
                                    description={getTranslateText(
                                        'teacher.dashboard.alert.account_reject'
                                    )}
                                    showIcon
                                    action={
                                        <Button
                                            onClick={handleRequestReview}
                                            size='large'
                                            type='primary'
                                        >
                                            {getTranslateText(
                                                'teacher.dashboard.button.request_review'
                                            )}
                                        </Button>
                                    }
                                    className='mb-3'
                                />
                            </Col>
                        </Row>
                    )

                case TEACHER_REVIEW_STATUS.PENDING:
                    return (
                        <Row>
                            <Col offset={4} span={20}>
                                <Alert
                                    message={getTranslateText('warning')}
                                    type='warning'
                                    description={getTranslateText(
                                        'teacher.dashboard.alert.account_reviewing'
                                    )}
                                    showIcon
                                    className='mb-3'
                                />
                            </Col>
                        </Row>
                    )

                default:
                    break
            }
        }
    }

    let newStyle = {}
    if (
        !_.isEmpty(user) &&
        user?.role?.includes(ROLES.TEACHER) &&
        !_.isEmpty(teacher) &&
        !teacher.is_reviewed
    )
        newStyle = { top: '130px' }
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
                <link
                    href='/static/fonts/Teacher/font/stylesheet.css'
                    rel='stylesheet'
                />
                <link href='/static/css/Teacher/styles.css' rel='stylesheet' />
                <script type='text/javascript' src='/static/js/app.js' />
            </Head>
            <div className={`${isSticky && 'stickyHeader'}`}>
                <Header openMenuMobile={OpenMenu} />
            </div>
            <Layout className={styles.customLayout}>
                <main style={style}>
                    <ContainerWrap>
                        <div className={styles.backgroundCustom}>
                            {renderAlertWithReviewStatus()}
                            <Row>
                                <Col md={4}>
                                    <div
                                        className='stickyMenu'
                                        style={newStyle}
                                    >
                                        <NavBar OpenMenu={OpenMenu} />
                                        <div className={cn(styles.testEquip)}>
                                            <TestEquipmentButton />
                                        </div>
                                    </div>
                                </Col>
                                <Col md={20} xs={24}>
                                    {props.children}
                                </Col>
                            </Row>
                        </div>
                    </ContainerWrap>
                </main>
            </Layout>
        </>
    )
}

export default Index
