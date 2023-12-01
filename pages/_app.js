// add bootstrap css and modules css
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'antd/dist/antd.css'
// own css files here
import 'styles/css/styles.css'
import 'styles/css/nprogress.css'
import 'styles/css/teacher-time-box.css'

import { useEffect } from 'react'
import Head from 'next/head'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'
import { BackTop } from 'antd'
import { NotificationProvider } from 'contexts/Notification'
import languageObject from 'modules/i18n'
import { AuthProvider, useAuth } from 'contexts/Auth'
import BookingProvider from 'contexts/Booking'
import * as store from 'helpers/storage'
import NProgress from 'nprogress'
import moment from 'moment'
import { LocaleSpec } from 'const'
import { setCookie, getCookie } from 'helpers/cookie'

const MyApp = ({ Component, pageProps }) => {
    const router = useRouter()

    const { locale } = router

    useEffect(() => {
        const store_locale = getCookie('locale')

        moment.updateLocale(store_locale, LocaleSpec[store_locale])
        if (!store_locale || store_locale !== locale) {
            setCookie('locale', locale)
        }
    }, [locale])

    useEffect(() => {
        if (window && typeof window !== 'undefined') {
            window.WOW = require('wowjs')
        }

        new WOW.WOW().init()

        router.events.on('routeChangeStart', (url) => {
            NProgress.start()
        })
        router.events.on('routeChangeComplete', () => {
            NProgress.done()
        })
        router.events.on('routeChangeError', () => {
            NProgress.done()
        })

        // khi logout ở 1 tab thì cũng cần reload các tab khác, tránh bug trên GUID vẫn lưu thông tin user đã logout
        const storageChange = (event) => {
            if(event.key === 'ispeak.user') {
                if (!event.newValue && document.hidden) { 
                    // kiểm tra user bị xóa trong storage và tab đang ẩn, 
                    // tab hiện tại đang active không cần reload)
                    window.location.reload();
                }
            }
        }
        window.addEventListener('storage', storageChange, false)

    }, [])

    return (
        <>
            <Head>
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
                    rel='stylesheet'
                    href='https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css'
                />
                <script src='https://code.jquery.com/jquery-3.5.1.js' />
                <script src='https://unpkg.com/@popperjs/core@2' />
            </Head>
            <IntlProvider locale={locale} messages={languageObject[locale]}>
                <AuthProvider>
                    <NotificationProvider>
                        <BookingProvider>
                            <Component {...pageProps} />
                            <BackTop
                                style={{ right: '15px', bottom: '25px' }}
                            />
                        </BookingProvider>
                    </NotificationProvider>
                </AuthProvider>
            </IntlProvider>
        </>
    )
}

export default MyApp
