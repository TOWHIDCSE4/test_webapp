import ApiSender from './ApiSender'

export default class ExamAPI {
    public static getExams(query?: {
        page_size: number
        page_number: number
        type: string
    }) {
        const route = '/core/exams'
        return ApiSender.get(route, query)
    }

    public static getDetailExam(id: number) {
        const route = `/core/exams/${id}`
        return ApiSender.get(route)
    }

    public static startDoExam(
        id: number,
        _id: string,
        quiz_id: string,
        course_id: string,
        quizIntId: number
    ) {
        const route = `/core/exams/start-do-exam/${id}`
        return ApiSender.post(route, { _id, quiz_id, course_id, quizIntId })
    }

    public static getDetailExamSession(id: number) {
        const route = `/core/exams/exam-session/${id}`
        return ApiSender.get(route)
    }

    public static getHistoryExam(
        id: number,
        query: {
            student_id: number
            page_size: number
            page_number: number
        }
    ) {
        const route = `/core/exams/${id}/history`
        return ApiSender.get(route, query)
    }
}
