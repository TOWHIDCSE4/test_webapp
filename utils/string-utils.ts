import { EnumScoreClassification } from 'const'
import sanitizeHtml from 'sanitize-html'

export function nl2br(str: string) {
    const regex = /\\n|\\r\\n|\\n\\r|\\r/g
    if (str) return str.replace(regex, '<br>')
    return str
}

export function makeStrId(length: number) {
    let result = ''
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

export function hasHTTPUrl(url: string) {
    if (url.indexOf('http') !== -1) return true
    return false
}

export function urlToFileName(url: string) {
    if (!url) return ''
    return url.slice(url.lastIndexOf('/') + 1)
}

export function calculateClassification(score: number) {
    if (score < EnumScoreClassification.POOR) {
        return 'Poor'
    }
    if (score < EnumScoreClassification.AVERAGE) {
        return 'Average'
    }
    if (score < EnumScoreClassification.GOOD) {
        return 'Good'
    }
    if (score < EnumScoreClassification.VERY_GOOD) {
        return 'Very good'
    }
    return 'Excellent'
}

export function sanitize(string: string) {
    return sanitizeHtml(string, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
        allowedSchemes: [...sanitizeHtml.defaults.allowedSchemes, 'data']
    })
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
