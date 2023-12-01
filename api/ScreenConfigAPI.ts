import ApiSender from './ApiSender'

export default class ScreenConfigAPI {
    public static getScreenConfig(query?: any) {
        const route = '/core/student/screen-config/get-one'
        return ApiSender.get(route, query)
    }
}
