import ApiSender from './ApiSender'

export default class ContactAPI {
    public static createContact(body: {}) {
        const route = '/core/public/signup-contract'
        return ApiSender.post(route, body)
    }
}
