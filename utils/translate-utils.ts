/* eslint-disable react-hooks/rules-of-hooks */
import languageObject from 'modules/i18n'
import { LANGUAGE_CODE_DEFAULT } from 'const/i18n'
import { get, reduce } from 'lodash'
import { getCookie, setCookie } from 'helpers/cookie'

function getLang() {
    let langCode = LANGUAGE_CODE_DEFAULT
    try {
        const locale = getCookie('locale')
        if (locale) {
            langCode = locale
        } else {
            setCookie('locale', langCode)
        }
    } catch (error) {
        console.log(error)
    }
    return langCode
}
export const getTranslateText = (nestedString) => {
    const langCode = getLang()
    return get(languageObject[langCode], nestedString) ?? nestedString
}

export const getInterpolationTransText = (
    nestedString,
    interpolation = {},
    code
) => {
    if (code) {
        return reduce(
            interpolation,
            (acc, value, key) => acc.replace(key, value),
            get(languageObject[code], nestedString) ?? nestedString
        )
    }
    const langCode = getLang()
    return reduce(
        interpolation,
        (acc, value, key) => {
            acc.replace(key, value)
            return acc
        },
        get(languageObject[langCode], nestedString) ?? nestedString
    )
}
