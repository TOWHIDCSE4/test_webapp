import { useCallback, useState, FC, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import _ from 'lodash'
import { Avatar, Menu as LanguageMenu, Dropdown, Tooltip, Drawer } from 'antd'
import {
    PoweroffOutlined,
    SearchOutlined,
    QuestionCircleOutlined,
    SnippetsOutlined,
    SolutionOutlined
} from '@ant-design/icons'
import { HOT_LINE, DEFAULT_AVATAR_STUDENT, DEFAULT_AVATAR } from 'const/common'
import { AUTH_TYPES } from 'const/auth-type'
import { ROLES_ENUM } from 'const/role'
import { useAuth } from 'contexts/Auth'
import AuthModal from 'components/Molecules/AuthModal'
import { getTranslateText } from 'utils/translate-utils'
import ResendEmailModal from 'components/Atoms/ResendEmailModal'
import { ROUTERS } from './RouterConfig'
import styles from './Menu.module.scss'

const Menu: FC = () => {
    const { isLoading, user, goToDashboard, logout } = useAuth()
    const router = useRouter()
    const { pathname, locale } = router
    const [isShown, setShown] = useState(false)
    const [isLoadingAvatar, setLoadingAvatar] = useState(true)
    const [loadAvatarFailed, setLoadAvatarFailed] = useState(false)
    const [authType, setAuthType] = useState('')
    const [visibleResendEmail, setVisibleResendEmail] = useState(false)
    const [visibleDrawer, setVisibleDrawer] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setLoadingAvatar(false)
        }, 5000)
    }, [])

    const toggleModal = useCallback((value: boolean, type?: string) => {
        setShown(value)
        if (type) setAuthType(type)
    }, [])

    const showDrawer = () => {
        setVisibleDrawer(true)
    }

    const onCloseDrawer = () => {
        setVisibleDrawer(false)
    }

    const toggleResendEmailModal = useCallback(
        (val: boolean) => {
            setVisibleResendEmail(val)
        },
        [visibleResendEmail]
    )

    const renderIcon = (_route: string) => {
        switch (_route) {
            case '/find-a-teachers':
                return <SearchOutlined />
            case '/faq':
                return <QuestionCircleOutlined />
            case '/course-explorer':
                return <SnippetsOutlined />
            default:
                break
        }
    }

    const renderMbMenu = () => {
        let filteredRouters = [...ROUTERS]
        if (user.role?.find((r: number) => r === ROLES_ENUM.TEACHER))
            filteredRouters = ROUTERS.filter(
                (rt) => rt.route !== '/find-a-teachers'
            )
        return filteredRouters.map((item, index) => (
            <LanguageMenu.Item key={item.route} icon={renderIcon(item.route)}>
                <Link href={item.route} key={index}>
                    <a href='#about'>{getTranslateText(item.title)}</a>
                </Link>
            </LanguageMenu.Item>
        ))
    }

    const renderMenu = () => {
        let filteredRouters = [...ROUTERS]
        if (user.role?.find((r: number) => r === ROLES_ENUM.TEACHER))
            filteredRouters = ROUTERS.filter(
                (rt) => rt.route !== '/find-a-teachers'
            )
        return filteredRouters.map((item, index) => (
            <Link href={item.route} key={index}>
                <li
                    className={cn(
                        'nav-item',
                        pathname === item.route && 'active'
                    )}
                >
                    <a className='nav-link' href='#about'>
                        {getTranslateText(item.title)}
                    </a>
                </li>
            </Link>
        ))
    }

    const onChangeLanguage = ({ key }) => {
        router.push(router.asPath, router.asPath, {
            locale: key,
            scroll: false
        })
    }

    const languageDropdown = () => (
        <LanguageMenu onClick={onChangeLanguage}>
            <LanguageMenu.Item key='en'>
                <div style={{ width: 50 }}>
                    <img
                        src='assets/images/homepage/en.png'
                        alt=''
                        title=''
                        className='img-fluid mr-2'
                    />{' '}
                    EN
                </div>
            </LanguageMenu.Item>
            <LanguageMenu.Item key='vi'>
                <div style={{ width: 50 }}>
                    <img
                        src='assets/images/homepage/vn.png'
                        alt=''
                        title=''
                        className='img-fluid mr-2'
                    />{' '}
                    VN
                </div>
            </LanguageMenu.Item>
        </LanguageMenu>
    )

    const welcomeTooltip = () => (
        <div className='welcome-text mr-1'>{`Welcome ${user.full_name}`}</div>
    )

    return (
        <header className='mt-2'>
            <div className='container' style={{ maxWidth: '1500px' }}>
                <div className='row'>
                    <nav className='navbar navbar-expand-lg navbar-light'>
                        <Link href='/'>
                            <a className='navbar-brand' id='logo'>
                                <img
                                    style={{ height: '50px' }}
                                    src='../assets/images/homepage/englishplus.png'
                                    alt='Logo English Plus'
                                    title='English Plus'
                                    className='img-fluid'
                                />
                            </a>
                        </Link>
                        <button
                            onClick={showDrawer}
                            className='navbar-toggler'
                            type='button'
                            data-toggle='collapse'
                            data-target='#navbarSupportedContent'
                            aria-controls='navbarSupportedContent'
                            aria-expanded='false'
                            aria-label='Toggle navigation'
                        >
                            <span className='navbar-toggler-icon' />
                        </button>
                        <div
                            className='collapse navbar-collapse'
                            id='navbarSupportedContent'
                        >
                            <p className='phone'>
                                <i className='fas fa-phone-alt' />
                                {HOT_LINE.split(' - ')[0]}
                            </p>
                            <ul className='navbar-nav ml-auto'>
                                {renderMenu()}
                                {_.isEmpty(user) && (
                                    <li
                                        className={cn('nav-item')}
                                        onClick={() =>
                                            toggleModal(
                                                true,
                                                AUTH_TYPES.BECOME_A_TEACHER
                                            )
                                        }
                                    >
                                        <a className='nav-link'>
                                            {getTranslateText(
                                                'become_a_teacher'
                                            )}
                                        </a>
                                    </li>
                                )}
                                <li className='nav-item'>
                                    <Dropdown
                                        overlay={languageDropdown}
                                        trigger={['click']}
                                    >
                                        <a
                                            className='nav-link dropdown-toggle'
                                            href='#'
                                            id='navbarDropdown'
                                            role='button'
                                            data-toggle='dropdown'
                                            aria-haspopup='true'
                                            aria-expanded='false'
                                            style={{ width: 50 }}
                                        >
                                            {getTranslateText(locale)}
                                        </a>
                                    </Dropdown>
                                </li>
                            </ul>
                            {!isLoading && user && !_.isEmpty(user) ? (
                                <>
                                    <Tooltip
                                        title={welcomeTooltip}
                                        placement='right'
                                        className={
                                            styles[
                                                'header-menu__user-avatar__tooltip'
                                            ]
                                        }
                                        color='white'
                                        getPopupContainer={(node) => node}
                                    >
                                        <div onClick={goToDashboard}>
                                            {(isLoadingAvatar ||
                                                loadAvatarFailed) && (
                                                <Avatar
                                                    src={
                                                        user?.role?.includes(
                                                            ROLES_ENUM.TEACHER
                                                        )
                                                            ? DEFAULT_AVATAR
                                                            : DEFAULT_AVATAR_STUDENT
                                                    }
                                                    className='clickable'
                                                />
                                            )}
                                            <Avatar
                                                src={user.avatar}
                                                className={cn('clickable', {
                                                    hidden:
                                                        isLoadingAvatar ||
                                                        loadAvatarFailed,
                                                    'position-absolute':
                                                        isLoadingAvatar ||
                                                        loadAvatarFailed
                                                })}
                                                onError={() => {
                                                    setLoadingAvatar(false)
                                                    setLoadAvatarFailed(true)

                                                    return true
                                                }}
                                                icon={
                                                    <Avatar
                                                        src={
                                                            user?.role?.includes(
                                                                ROLES_ENUM.TEACHER
                                                            )
                                                                ? DEFAULT_AVATAR
                                                                : DEFAULT_AVATAR_STUDENT
                                                        }
                                                        style={{
                                                            marginTop: -6
                                                        }}
                                                    />
                                                }
                                            />
                                        </div>
                                    </Tooltip>
                                    <PoweroffOutlined
                                        className={cn(
                                            styles['logout-icon'],
                                            'clickable',
                                            'ml-2'
                                        )}
                                        onClick={logout}
                                    />
                                </>
                            ) : (
                                <>
                                    <Link href='/register'>
                                        <a
                                            className='btn btn-primary btn-outline'
                                            type='button'
                                        >
                                            {getTranslateText('sign_up')}
                                        </a>
                                    </Link>
                                    <Link href='/login'>
                                        <a
                                            className='btn btn-primary btn-normal login'
                                            type='button'
                                        >
                                            {getTranslateText('login')}
                                        </a>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
            <AuthModal
                show={isShown}
                onClose={() => toggleModal(false)}
                authType={authType}
                setAuthType={setAuthType}
                toggleResendEmail={toggleResendEmailModal}
            />
            <ResendEmailModal
                visible={visibleResendEmail}
                toggleModal={toggleResendEmailModal}
            />
            <Drawer
                title='EnglishPlus'
                placement='right'
                closable={false}
                onClose={onCloseDrawer}
                visible={visibleDrawer}
                key='right'
                width={300}
            >
                <div className={cn(styles['mobile-menu'])}>
                    <LanguageMenu
                        style={{ width: '100%', border: 'none' }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode='vertical'
                        theme='light'
                    >
                        {renderMbMenu()}
                        {_.isEmpty(user) && (
                            <LanguageMenu.Item icon={<SolutionOutlined />}>
                                <a
                                    href='#'
                                    onClick={() =>
                                        toggleModal(
                                            true,
                                            AUTH_TYPES.BECOME_A_TEACHER
                                        )
                                    }
                                >
                                    {getTranslateText('become_a_teacher')}
                                </a>
                            </LanguageMenu.Item>
                        )}
                    </LanguageMenu>
                    <div className={cn(styles['fix-btn-bottom'])}>
                        <div className=''>
                            <button
                                className='btn btn-primary'
                                type='button'
                                onClick={() =>
                                    toggleModal(true, AUTH_TYPES.SIGNUP)
                                }
                            >
                                {getTranslateText('sign_up')}
                            </button>
                        </div>
                        <div>
                            <button
                                className='btn btn-primary btn-normal login'
                                type='button'
                                onClick={() =>
                                    toggleModal(true, AUTH_TYPES.LOGIN)
                                }
                            >
                                {getTranslateText('login')}
                            </button>
                        </div>
                    </div>
                </div>
            </Drawer>
        </header>
    )
}

export default Menu
