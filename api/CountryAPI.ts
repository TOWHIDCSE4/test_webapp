import ApiSender from './ApiSender'

export default class CountryAPI {
    public static getCountries() {
        const route = '/core/countries'
        return ApiSender.get(route)
    }

    public static getTimeZones() {
        const route = '/core/timezone'
        return ApiSender.get(route)
    }
}
