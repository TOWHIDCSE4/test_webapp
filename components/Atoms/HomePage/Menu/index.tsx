import { useCallback, useState, FC, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import _ from 'lodash'
import {
    Avatar,
    Menu as LanguageMenu,
    Dropdown,
    Tooltip,
    Drawer,
    Col,
    Row
} from 'antd'
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
import { ROUTERS, NEW_ROUTERS } from './RouterConfig'
import styles from './Menu.module.scss'
import Column from 'antd/lib/table/Column'

const Menu: FC = () => {
    const { isLoading, user, goToDashboard, logout, logoutHomePage } = useAuth()
    const router = useRouter()
    const { pathname, locale } = router
    const [isShown, setShown] = useState(false)
    const [isDropBarDisplayed, setBarDisplay] = useState(false)
    const [dropdownSubMenu, setDropdownSubMenu] = useState(false)
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

    const toggleDropBar = useCallback((value: boolean) => {
        console.log(value)
        setBarDisplay(value)
        if (value) {
            document.getElementById('body_home_page').style.display = 'none'
            document
                .getElementById('footer_home_page')
                .classList.add('toggle-margin-footer')
        } else {
            document.getElementById('body_home_page').style.display = 'block'
            document
                .getElementById('footer_home_page')
                .classList.remove('toggle-margin-footer')
        }
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

    const renderSubMenu = (extraRouters) => {
        if (!extraRouters) {
            return <></>
        }

        return extraRouters.map((itemSub, indexSub) => (
            <li key={indexSub}>
                <a
                    href={itemSub.path}
                    className='hover-bg-grey--light d-flex align-items-center p-1rem space-x-3 rounded-lg'
                >
                    <div className='util-flex-center bg-f6f1f1c9 w-52px h-52px rounded-lg'>
                        <img
                            src={`../assets/images/homepage/svgs/${itemSub.icon}.svg`}
                            alt={itemSub.icon}
                            title='English Plus'
                        />
                    </div>
                    <div className='ml-2'>
                        <p className='text-1_1rem font-semibold text-black m-0'>
                            {itemSub.title}
                        </p>
                        {/* <span className='text-0_75rem text-777D7E font-medium'>
                            {itemSub.description}
                        </span> */}
                    </div>
                </a>
            </li>
        ))
    }

    const renderNavSubMenu = (extraRouters) => (
        <nav className='nav-sub-menu top-full -left-1_2 position-absolute_important z-50 w-auto'>
            <ul className='rounded-2xl box-shadow w-max grid grid-cols-2 p-6 mt-1rem bg-white'>
                {renderSubMenu(extraRouters)}
            </ul>
        </nav>
    )

    const renderMenu = () => {
        const filteredRouters = [...NEW_ROUTERS]
        return filteredRouters.map((item, index) => (
            <li
                key={index}
                className='group position-relative group-hover-text-green text-grey component-default-fontsize p-0 d-flex align-items-center cursor-pointer'
            >
                {item?.extraRouters ? (
                    <>
                        <Dropdown
                            overlay={renderNavSubMenu(item?.extraRouters)}
                            trigger={['hover']}
                        >
                            <div className='group-hover-text-green text-grey d-flex align-items-center p-0 cursor-pointer p-lr-1rem'>
                                <p className='component-default-fontsize m-0'>
                                    {getTranslateText(item.title)}
                                </p>
                                <img
                                    src='../assets/images/homepage/svgs/caret_down_drop.svg'
                                    alt='Caret Down Drop'
                                    title='English Plus'
                                />
                            </div>
                        </Dropdown>
                    </>
                ) : item?.title === 'become_a_teacher' ? (
                    <>
                        <div
                            id='modal_become_a_teacher'
                            onClick={() =>
                                toggleModal(true, AUTH_TYPES.BECOME_A_TEACHER)
                            }
                        >
                            <p className='m-0 p-lr-1rem'>
                                {getTranslateText(item.title)}
                            </p>
                        </div>
                    </>
                ) : (
                    <Link href={item.path} key={index}>
                        <p className='m-0 p-lr-1rem'>
                            {getTranslateText(item.title)}
                        </p>
                    </Link>
                )}
            </li>
        ))
    }

    const renderSubMenuTablet = (extraRouters) => {
        if (!extraRouters) {
            return <></>
        }

        return extraRouters.map((itemSub, indexSub) => (
            <li key={indexSub}>
                <a href={itemSub.path}>
                    <p className='tablet-text-1_5rem font-semibold opacity-80 text-black mb-0'>
                        {itemSub.title}
                    </p>
                </a>
            </li>
        ))
    }

    const renderNavSubMenuTablet = (extraRouters) => (
        <nav
            className={`border-grey--light py-2 pl-3 mt-0 border-l-2 mobile-mt-0 ${
                dropdownSubMenu ? 'd-block' : 'd-none'
            }`}
        >
            <ul className='gap-y-4 grid grid-cols-2 pl-0 pt-0 mobile-line-height-28 mobile-block'>
                {renderSubMenuTablet(extraRouters)}
            </ul>
        </nav>
    )

    const renderMenuTablet = () => {
        const filteredRouters = [...NEW_ROUTERS]
        return filteredRouters.map((item, index) => (
            <li key={index}>
                {item?.extraRouters ? (
                    <>
                        <div>
                            <div
                                onClick={() =>
                                    setDropdownSubMenu(!dropdownSubMenu)
                                }
                                className='d-flex align-items-center space-x-1 cursor-pointer mt-4'
                            >
                                <p
                                    className={`text-1_1rem menu-tablet-1_3rem font-weight-bold text-grey m-0 ${
                                        dropdownSubMenu ? 'text-black' : ''
                                    }`}
                                >
                                    {getTranslateText(item.title)}
                                </p>
                                <img
                                    src='assets/images/homepage/svgs/caret_down_drop.svg'
                                    alt=''
                                    title=''
                                    className={`ml-2 ${
                                        dropdownSubMenu ? 'rotate-180' : ''
                                    }`}
                                />
                            </div>

                            {renderNavSubMenuTablet(item?.extraRouters)}
                        </div>
                    </>
                ) : item?.title === 'become_a_teacher' ? (
                    <>
                        <div
                            onClick={() =>
                                toggleModal(true, AUTH_TYPES.BECOME_A_TEACHER)
                            }
                        >
                            <p className='menu-tablet-1_3rem text-1_1rem font-weight-bold text-grey m-0 mt-4'>
                                {getTranslateText(item.title)}
                            </p>
                        </div>
                    </>
                ) : (
                    <Link href={item.path}>
                        <p className='menu-tablet-1_3rem text-1_1rem font-weight-bold text-grey m-0'>
                            {getTranslateText(item.title)}
                        </p>
                    </Link>
                )}
            </li>
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
                <div>
                    <img
                        src='assets/images/homepage/lang_en.png'
                        alt='Language English'
                        title='Language English'
                        className='img-fluid mr-2 w-5 h-5'
                    />{' '}
                    EN
                    {locale === 'en' && (
                        <img
                            src='assets/images/homepage/svgs/stick.svg'
                            alt=''
                            title=''
                            className='img-fluid ml-2'
                        />
                    )}
                </div>
            </LanguageMenu.Item>
            <LanguageMenu.Item key='vi'>
                <div>
                    <img
                        src='assets/images/homepage/lang_vi.png'
                        alt='Language Vietnam'
                        title='Language Vietnam'
                        className='img-fluid mr-2 w-5 h-5'
                    />{' '}
                    VI
                    {locale === 'vi' && (
                        <img
                            src='assets/images/homepage/svgs/stick.svg'
                            alt=''
                            title=''
                            className='img-fluid ml-2'
                        />
                    )}
                </div>
            </LanguageMenu.Item>
        </LanguageMenu>
    )

    const welcomeTooltip = () => (
        <div className='welcome-text mr-1'>{`Welcome ${user.full_name}`}</div>
    )

    return (
        <header className='h-54px bg-white header-shadow position-relative z-index-100'>
            <section className='container component-main-section d-flex align-items-center h-100'>
                <Link href='/'>
                    <a id='logo' className='d-flex'>
                        <img
                            className='table-width-80px'
                            src='../assets/images/homepage/svgs/logo_color.svg'
                            alt='Logo English Plus'
                            title='English Plus'
                        />
                        <span className='brand-text d-none text-blue font-extrabold f-size-16 ml-1'>
                            {' '}
                            English<span className='text-green'>Plus</span>
                        </span>
                    </a>
                </Link>
                <div className='menu-h-line d-none h-7 min-w-px bg-grey--light ml-10 mr-1rem' />
                <nav className='nav-menu d-none'>
                    <ul className='flex items-center m-0'>{renderMenu()}</ul>
                </nav>

                <div className='d-flex align-items-center ml-auto'>
                    <Dropdown overlay={languageDropdown} trigger={['click']}>
                        <a
                            className='a-language-dropdown nav-link dropdown-toggle text-black rounded-lg'
                            href='#'
                            id='navbarDropdown'
                            role='button'
                            style={{ margin: '0 6px', padding: '0.5rem' }}
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                        >
                            <img
                                src={
                                    locale === 'en'
                                        ? 'assets/images/homepage/lang_en.png'
                                        : 'assets/images/homepage/lang_vi.png'
                                }
                                alt=''
                                title=''
                                className='img-fluid mr-2 w-5 h-5'
                            />{' '}
                            {getTranslateText(locale)}
                        </a>
                    </Dropdown>
                    {/* <div className='menu-search d-none w-200px position-relative ml-4 mr-3'>
                        <div className='top-1_2 left-2 position-absolute -translate-y-1_2'>
                            <img
                                src='../assets/images/homepage/svgs/loup_search.svg'
                                alt='Loup Search'
                                title='English Plus'
                            />
                        </div>
                        <input
                            className='bg-grey--light rounded-lg text-0_8rem font-medium custom-py-3 outline-none pl-10 w-100 border-0'
                            placeholder='Tìm kiếm...'
                        />
                    </div> */}

                    {!isLoading && user && !_.isEmpty(user) ? (
                        <>
                            <Tooltip
                                title={welcomeTooltip}
                                placement='right'
                                className={
                                    styles['header-menu__user-avatar__tooltip']
                                }
                                color='white'
                                getPopupContainer={(node) => node}
                            >
                                <div onClick={goToDashboard}>
                                    {(isLoadingAvatar || loadAvatarFailed) && (
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
                                style={{
                                    color: '#0b71d7'
                                }}
                                onClick={logoutHomePage}
                            />
                        </>
                    ) : (
                        <div
                            id='modal_login'
                            onClick={() => toggleModal(true, AUTH_TYPES.LOGIN)}
                            className='btn-landing-page component-default-fontsize util-flex-center space-x-1 rounded-lg ml-3 bg-green text-white h-40px px-7 mobile-px-2 mobile-ml-0 min-width-90px cursor-pointer table-fs-18px mobile-fs-14px'
                        >
                            {getTranslateText('login')}
                        </div>
                    )}

                    <div
                        onClick={() => toggleDropBar(!isDropBarDisplayed)}
                        className='menu-toggle block laptop-ml-4 mobile-ml-2 cursor-pointer'
                    >
                        <img
                            src={
                                !isDropBarDisplayed
                                    ? 'assets/images/homepage/svgs/humburger_nav.svg'
                                    : 'assets/images/homepage/svgs/close_drop_bar.svg'
                            }
                            alt=''
                            title=''
                        />
                    </div>
                </div>
            </section>

            <section
                className={`${
                    isDropBarDisplayed ? 'd-block' : 'd-none'
                } bg-white top-52px position-absolute left-0 w-100 h-calc-100vh-52px z-50 p-1rem tablet-p-6`}
            >
                <div className='position-relative w-100'>
                    <div className='top-1_2 left-2 position-absolute -translate-y-1_2'>
                        <img
                            src='../assets/images/homepage/svgs/loup_search.svg'
                            alt='Loup Search'
                            title='English Plus'
                        />
                    </div>
                    <input
                        className='bg-grey--light rounded-lg text-0_8rem font-medium custom-py-3 outline-none pl-10 w-100 border-0'
                        placeholder='Tìm kiếm...'
                    />
                </div>

                <nav className='mt-8'>
                    <ul className='d-flex flex-column space-y-5 pl-0'>
                        {renderMenuTablet()}
                    </ul>
                </nav>

                <div className='bg-grey--light w-100 h-px mt-8' />
                <div
                    style={
                        user?.role?.includes(ROLES_ENUM.STUDENT)
                            ? { display: 'block' }
                            : { display: 'none' }
                    }
                >
                    <div onClick={goToDashboard} style={{ marginTop: '15px' }}>
                        <img
                            className='avatar-mobile'
                            src={
                                user.avatar
                                    ? `${user.avatar}`
                                    : user?.role?.includes(ROLES_ENUM.TEACHER)
                                    ? DEFAULT_AVATAR
                                    : DEFAULT_AVATAR_STUDENT
                            }
                            alt=''
                            title=''
                        />
                        <span className='font-weight-bold cursor-pointer table-fs-20px mobile-fs-18px'>
                            {user.full_name}
                        </span>
                    </div>
                    <div>
                        <div className='col-lg-5 col-md-12 col-12 row mt-2'>
                            <div className='col-lg-5 col-md-5 col-12 mt-3 p-0'>
                                <a
                                    href={
                                        locale === 'en'
                                            ? '/en/student/profile'
                                            : '/vi/student/profile'
                                    }
                                    className='font-weight-bold cursor-pointer text-grey m-0 table-fs-18px mobile-fs-16px'
                                >
                                    Hồ sơ
                                </a>
                            </div>
                            <div className='col-lg-5 col-md-5 col-12 mt-3 p-0'>
                                <a
                                    href={
                                        locale === 'en'
                                            ? '/en/student/learning-history'
                                            : '/vi/student/learning-history'
                                    }
                                    className='font-weight-bold cursor-pointer text-grey m-0 table-fs-18px mobile-fs-16px'
                                >
                                    Lịch sử học tập
                                </a>
                            </div>
                        </div>
                        <div className='col-lg-5 col-md-12 col-12 row'>
                            <div className='col-lg-5 col-md-5 col-12 mt-3 p-0'>
                                <a
                                    href={
                                        locale === 'en'
                                            ? '/en/student/my-booking'
                                            : '/vi/student/my-booking'
                                    }
                                    className='font-weight-bold cursor-pointer text-grey m-0 table-fs-18px mobile-fs-16px'
                                >
                                    Khóa học của tôi
                                </a>
                            </div>
                            {/* <div className='col-lg-5 col-md-5 col-12 mt-3 p-0'>
                                <a
                                    href={
                                        locale === 'en'
                                            ? '/en/student/summary'
                                            : '/vi/student/summary'
                                    }
                                    className='font-weight-bold cursor-pointer text-grey m-0 table-fs-18px mobile-fs-16px'
                                >
                                    Kết quả học tập
                                </a>
                            </div> */}
                        </div>
                    </div>
                    <div className='bg-grey--light w-100 h-px mt-8' />
                    <Row className='mt-3'>
                        <Col span={8}>
                            <span
                                onClick={logoutHomePage}
                                className='font-weight-bold cursor-pointer text-red m-0 table-fs-18px mobile-fs-16px'
                            >
                                Đăng xuất
                            </span>
                        </Col>
                    </Row>
                </div>
            </section>

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
