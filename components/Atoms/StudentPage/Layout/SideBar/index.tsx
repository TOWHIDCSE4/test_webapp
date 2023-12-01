import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Image } from 'antd'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useAuth } from 'contexts/Auth'
import { DEFAULT_AVATAR_STUDENT } from 'const/common'
import { getTranslateText } from 'utils/translate-utils'
import BookingAPI from 'api/BookingAPI'
import StudentAPI from 'api/StudentAPI'
import { IStudent } from 'types'
import _ from 'lodash'
import { STUDENT_LEVELS } from 'const'
import { notify } from 'contexts/Notification'
import { toReadablePrice } from 'utils/price-utils'
import WalletAPI from 'api/WalletAPI'
import treeConfig from './RouteConfig'
import styles from './SideBar.module.scss'

const SideBar = () => {
    const { user, logout, logoutHomePage } = useAuth()

    const router = useRouter()

    const [teachingCount, setTeachingCount] = useState(0)
    const [noRateCount, setNoRateCount] = useState(0)
    const [homeworkCount, setHomeworkCount] = useState(0)
    const [balance, setBalance] = useState(0)
    const [studentInfo, setStudentInfo] = useState<IStudent>()
    const fetchStudentInfo = () => {
        StudentAPI.getStudentInfo().then((res) => setStudentInfo(res))
    }

    const fetchBalance = useCallback(async () => {
        WalletAPI.getBalance()
            .then((res) => {
                setBalance(res.balance)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }, [balance])

    useEffect(() => {
        BookingAPI.getTeachingBookingByStudent().then((res) => {
            setTeachingCount(res.data.countTeaching)
            setNoRateCount(res.data.countNoRate)
            setHomeworkCount(res.data.countHomework)
        })
        fetchStudentInfo()
        fetchBalance()
    }, [])

    const renderNavBar = () =>
        // eslint-disable-next-line array-callback-return
        treeConfig.map((item: any, index) => (
            <li className='open nav-item' key={index}>
                <Link href={item.route} passHref>
                    <a
                        className={cn(
                            'nav-link',
                            `${router.pathname === item.route && 'active'} `
                        )}
                        title={getTranslateText(item.title)}
                    >
                        {item.title === 'sidebar.my_booking' && (
                            <div className='notify'>
                                {teachingCount > 0 && (
                                    <span className={styles['count-badge']}>
                                        {teachingCount}
                                    </span>
                                )}
                            </div>
                        )}
                        {item.title === 'sidebar.learn_history' && (
                            <div className='notify'>
                                {noRateCount > 0 && (
                                    <span className={styles['count-badge']}>
                                        {noRateCount}
                                    </span>
                                )}
                            </div>
                        )}
                        {item.title === 'sidebar.homework' && (
                            <div className='notify'>
                                {homeworkCount > 0 && (
                                    <span className={styles['count-badge']}>
                                        {homeworkCount > 99
                                            ? '99+'
                                            : homeworkCount}
                                    </span>
                                )}
                            </div>
                        )}
                        {item.icon}
                        <span>{getTranslateText(item.title)}</span>
                    </a>
                </Link>
            </li>
        ))

    return (
        <aside
            id='leftsidebar'
            className={`${cn('sidebar', styles.mobi)} sidebar2`}
        >
            <div className='navbar-brand'>
                <button className='btn-menu ls-toggle-btn' type='button'>
                    <i className='zmdi zmdi-menu' />
                </button>
                <a onClick={() => router.push('/')} title='Go to Homepage'>
                    <img src='/assets/images/logo_ispeak.png' alt='' />
                    <span className='m-l-10' />
                </a>
            </div>
            <div className='menu'>
                <ul className='list nav nav-tabs'>
                    <li>
                        <div className='user-info'>
                            <a
                                className='image'
                                onClick={() =>
                                    router.push('/student/dashboard')
                                }
                                title='Avatar User'
                            >
                                <Image
                                    src={user?.avatar || DEFAULT_AVATAR_STUDENT}
                                    fallback={DEFAULT_AVATAR_STUDENT}
                                    alt='Avatar User'
                                    width={40}
                                    preview={false}
                                />
                            </a>
                            <div className='detail'>
                                <h4 style={{ fontSize: '16px' }}>
                                    <b>{user?.full_name}</b>
                                </h4>
                                {/* <small>
                                    Level{' '}
                                    <b>
                                        {studentInfo?.student_level_id || 0}{' '}
                                        {
                                            _.find(
                                                STUDENT_LEVELS,
                                                (o) =>
                                                    o.id ===
                                                    (studentInfo?.student_level_id ||
                                                        0)
                                            ).name
                                        }
                                    </b>
                                </small> */}
                                <div className='d-flex align-items-center'>
                                    <small>
                                        {getTranslateText('wallet')}:{' '}
                                        <b>
                                            {toReadablePrice(balance)}{' '}
                                            {getTranslateText('ixu')}
                                        </b>
                                    </small>
                                    <Link href='/student/wallet'>
                                        <i className='zmdi zmdi-hc-fw text-primary clickable'>
                                            
                                        </i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </li>
                    {renderNavBar()}

                    <li className='open nav-item nav-item-mobile'>
                        <Link href='/student/wallet' passHref>
                            <a
                                className={cn(
                                    'nav-link',
                                    `${
                                        router.pathname === '/student/wallet' &&
                                        'active'
                                    } `
                                )}
                            >
                                <i className='zmdi zmdi-hc-fw'></i>
                                <span>{getTranslateText('wallet')}</span>
                            </a>
                        </Link>
                    </li>

                    <li className='open nav-item nav-item-mobile'>
                        <Link href='/student/profile' passHref>
                            <a
                                className={cn(
                                    'nav-link',
                                    `${
                                        router.pathname ===
                                            '/student/profile' && 'active'
                                    } `
                                )}
                            >
                                <i className='zmdi zmdi-hc-fw'></i>
                                <span>{getTranslateText('profile')}</span>
                            </a>
                        </Link>
                    </li>

                    <li
                        className='open nav-item nav-item-mobile clickable'
                        onClick={logoutHomePage}
                    >
                        <a className={cn('nav-link')}>
                            <i className='zmdi zmdi-power' />
                            <span>{getTranslateText('logout')}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default SideBar
