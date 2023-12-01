import React from 'react'
import { NextRouter, useRouter } from 'next/router'
import { getTranslateText } from 'utils/translate-utils'
import moment from 'moment'
import { LocaleSpec } from 'const'
import { Menu, Dropdown } from 'antd'

const SelectLanguageTeacherSite = () => {
    const router: NextRouter = useRouter()
    const { locale } = router

    const onSelectChange = (new_locale: string) => {
        moment.updateLocale(new_locale, LocaleSpec[new_locale])

        router.push(router.asPath, router.asPath, {
            locale: new_locale,
            scroll: false
        })
        setTimeout(() => {
            router.reload()
        }, 0)
    }

    const menu = (
        <Menu
            style={{
                width: '100px',
                border: '1px solid rgba(0,0,0,.15)',
                borderRadius: '0.25rem'
            }}
        >
            {router.locales &&
                router.locales.map((language) => (
                    <Menu.Item
                        key={language}
                        onClick={() => onSelectChange(language)}
                    >
                        <img
                            src={`/static/img/lang/${language}.png`}
                            alt={getTranslateText(language)}
                            title={getTranslateText(language)}
                            className='img-fluid'
                        />
                        <span className='ml-1'>
                            {getTranslateText(language)}
                        </span>
                    </Menu.Item>
                ))}
        </Menu>
    )

    return (
        <li className='nav-item dropdown'>
            <Dropdown
                overlay={menu}
                trigger={['click']}
                align={{ offset: [0, 10] }}
            >
                <div className='clickable' onClick={(e) => e.preventDefault()}>
                    <img
                        src={`/static/img/lang/${locale}.png`}
                        alt={getTranslateText(locale)}
                        title={getTranslateText(locale)}
                        className='img-fluid'
                    />
                    <span className='ml-1'>{getTranslateText(locale)}</span>
                </div>
            </Dropdown>
        </li>
    )
}

export default SelectLanguageTeacherSite
