import _ from 'lodash'
import ApiSender from './ApiSender'

export default class UtilsAPI {
    public static getServerTime() {
        const route = `/core/public/util/server-time`
        return ApiSender.get(route, null)
    }
}
