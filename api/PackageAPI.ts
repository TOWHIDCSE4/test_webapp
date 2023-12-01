import ApiSender from './ApiSender'

export default class PackageAPI {
    public static getPackages(query?: {
        page_size: number
        page_number: number
    }) {
        const route = '/core/packages'
        return ApiSender.get(route, query)
    }

    public static buyPackage(payload: object) {
        const route = '/core/packages'
        return ApiSender.post(route, payload)
    }
}
