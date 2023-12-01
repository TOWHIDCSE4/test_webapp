import React from 'react'
import { NextRouter, useRouter } from 'next/router'
import { getTranslateText } from 'utils/translate-utils'
import { Popover } from 'antd'
import moment from 'moment'
import { LocaleSpec } from 'const'
import { setCookie } from 'helpers/cookie'

const SelectLanguage = () => {
    const router: NextRouter = useRouter()

    const { locale } = router

    const onSelectChange = (new_locale: string) => {
        moment.updateLocale(new_locale, LocaleSpec[new_locale])
        setCookie('locale', new_locale)
        router.push(router.asPath, router.asPath, {
            locale: new_locale,
            scroll: false
        })
    }

    const content = () => (
        <div>
            {router.locales &&
                router.locales.map((language) => (
                    <div
                        className='dropdown-item clickable'
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
                    </div>
                ))}
        </div>
    )
    return (
        <li>
            <Popover title={null} content={content()} placement='leftTop'>
                <a>
                    <img
                        src={`/static/img/lang/${locale}.png`}
                        alt={getTranslateText(locale)}
                        title={getTranslateText(locale)}
                        className='img-fluid'
                    />
                    <span className='ml-1'>{getTranslateText(locale)}</span>
                </a>
            </Popover>
        </li>
    )
}

export default SelectLanguage
