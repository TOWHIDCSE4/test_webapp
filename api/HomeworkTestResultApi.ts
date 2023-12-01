import ApiSender from './ApiSender'

export default class HomeworkTestResultApi {
    public static getSessionHomeworkTestIelts(query: {
        page_number?: number
        page_size?: number
        booking_id?: number
    }) {
        const route = `/core/student/homework/get-homework-test-result`
        return ApiSender.get(route, query)
    }

    public static startTest(id: number) {
        const route = `/core/student/homework/start-test`
        return ApiSender.post(route, { lesson_id: id })
    }
}
