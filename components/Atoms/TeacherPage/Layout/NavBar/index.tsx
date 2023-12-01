/* eslint-disable import/no-named-as-default */
import React, { useEffect } from 'react'
import { Nav } from 'react-bootstrap'
import Link from 'next/link'
import { Image, Row, Col } from 'antd'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { CloseCircleOutlined } from '@ant-design/icons'
import { useAuth } from 'contexts/Auth'
import { getTranslateText } from 'utils/translate-utils'
import styles from './NavBar.module.scss'
import treeConfig from './RouteConfig'

const NavBar = ({ OpenMenu }) => {
    const { user } = useAuth()
    const router = useRouter()

    const renderNavBarChild = (child) =>
        child.map((item, index) => (
            <Link href={item.route} passHref key={index}>
                <Nav.Link className={cn(styles.menuItem, 'p-0 mb-2')}>
                    <Row className='m-0'>
                        <Col
                            span={4}
                            className='iconNav p-0 d-flex m-0 justify-content-flex-start'
                        >
                            <div
                                className='inactive'
                                style={{
                                    display: `${
                                        router.pathname === item.route
                                            ? 'none'
                                            : 'block'
                                    } `
                                }}
                            >
                                <Image
                                    preview={false}
                                    className={cn(styles.img)}
                                    src={item.icon_inactive}
                                />
                            </div>
                            <div
                                className='active'
                                style={{
                                    display: `${
                                        router.pathname === item.route
                                            ? 'block'
                                            : 'none'
                                    } `
                                }}
                            >
                                <Image
                                    preview={false}
                                    className={cn(styles.img)}
                                    src={item.icon_active}
                                />
                            </div>
                        </Col>
                        <Col span={20} className='p-0'>
                            <span
                                className={`${cn(styles.menuSpan)} + " " + ${
                                    router.pathname === item.route
                                        ? cn(styles.active)
                                        : ''
                                }`}
                            >
                                {getTranslateText(item.title)}
                            </span>
                        </Col>
                    </Row>
                </Nav.Link>
            </Link>
        ))

    const renderNavBar = () =>
        treeConfig.map((item, index) => (
            <div className={cn(styles.wrapItem)} key={index}>
                <Nav defaultActiveKey='/' className='flex-column'>
                    <span className={cn(styles.tittleMenu)}>
                        {getTranslateText(item.title)}
                    </span>
                    {renderNavBarChild(item.children)}
                </Nav>
            </div>
        ))

    return (
        <>
            <div className={cn(styles.header_menuMobile)}>
                <div className={cn(styles.notiIcon)}>
                    <Image
                        src='/static/img/teacher/header/icon-1.png'
                        preview={false}
                    />
                    <span className={cn(styles.number)}>3</span>
                </div>
                <div className={`${cn(styles.desc)}`}>
                    <h4 className={cn(styles.name)}>
                        {user && `${user.full_name}`}
                    </h4>
                    <p className={cn(styles.level)}>Hourly rate: 120</p>
                </div>
                <div onClick={OpenMenu} className={cn(styles.btnClose)}>
                    <CloseCircleOutlined style={{ fontSize: 30 }} />
                </div>
            </div>
            {renderNavBar()}
            <div className={cn(styles.logOutMobile)}>LOG OUT</div>
        </>
    )
}

export default NavBar
