import ApiSender from './ApiSender'

export default class SubjectAPI {
    public static getSubjects(query?: {
        page_size: number
        page_number: number
    }) {
        const route = '/core/subjects'
        return ApiSender.get(route, query)
    }
}
