import React from 'react'
import Head from 'next/head'
import HomeMenu from 'components/Atoms/HomePage/Menu'
import Banner from 'components/Atoms/HomePage/Banner'

export default function Layout(props) {
    return (
        <div className='home'>
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
                    content={`${process.env.NEXT_PUBLIC_DOMAIN}/assets/images/homepage/svgs/brand_englishPlus.png`}
                />
                <title>EnglishPlus - Tiếng Anh trực tuyến 1 thầy 1 trò</title>
                <link
                    href='/static/css/HomePage/styles.css?v5'
                    rel='stylesheet'
                />
            </Head>
            <HomeMenu />
            {/* <Banner /> */}
            {props.children}
        </div>
    )
}
