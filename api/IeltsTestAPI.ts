import ApiSender from './ApiSender'

export default class IeltsTestAPI {
    public static getCategories(query?: {
        page_size: number
        page_number: number
        search?: string
    }) {
        const route = '/quiz-svc/public/ielts-test-categories'
        return ApiSender.get(route, query)
    }

    public static getIeltsOnline(query?: {
        page_size: number
        page_number: number
        category_id?: number
        search?: string
    }) {
        const route = '/quiz-svc/public/ielts-tests'
        return ApiSender.get(route, query)
    }
}
