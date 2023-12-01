import ApiSender from './ApiSender'

export default class HomeworkAPI {
    public static getHomeworks(query?: {
        page_size: number
        page_number: number
        type: string
    }) {
        const route = '/core/quiz/homeworks'
        return ApiSender.get(route, query)
    }

    public static checkHistoryHomeworkV1(query) {
        const route = `/core/homework/check-has-homework-v1`
        return ApiSender.get(route, query)
    }
}
