/* eslint-disable radix */
/* eslint-disable no-cond-assign */
export function getBrowser() {
    const ua = navigator.userAgent
    let tem
    let M =
        ua.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || []
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || []
        return { name: 'IE', version: tem[1] || '' }
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null) {
            return { name: 'Opera', version: tem[1] }
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1])
    }
    return {
        name: M[0],
        version: M[1]
    }
}

/**
 * Returns compatitle browser.
 *
 * @param {object} browser browser.name and browser.version.
 * @return {bool}
 */
export const checkBrowser = (browser) => {
    if (browser && browser.name) {
        if (
            (browser.name === 'Chrome' && parseInt(browser.version) > 80) ||
            (browser.name === 'Firefox' && parseInt(browser.version) > 80) ||
            browser.name === 'Opera' ||
            (browser.name === 'Safari' && parseInt(browser.version) > 14)
        ) {
            return true
        }
    }

    return false
}
