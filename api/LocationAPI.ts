import ApiSender from './ApiSender'

export default class LocationAPI {
    public static getLocations(query?: {}) {
        const route = '/core/locations'
        return ApiSender.get(route, query)
    }
}
