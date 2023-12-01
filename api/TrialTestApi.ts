import ApiSender from './ApiSender'

export default class TrialTestApi {
    public static getSessionTest(payload: object) {
        const route = `/core/get-session-test`
        return ApiSender.get(route, payload)
    }
}
