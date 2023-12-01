import ApiSender from './ApiSender'

export default class QuizAPI {
    public static getDetailQuiz(quiz_id: number) {
        const route = `/quiz-svc/user/quiz/${quiz_id}`
        return ApiSender.get(route)
    }

    public static getDetailQuizSession(_id) {
        const route = `/core/quiz-session/${_id}`
        return ApiSender.get(route)
    }

    public static startDoHomework(payload: { quiz_id: number; type?: number }) {
        const route = `/quiz-svc/user/quiz/start-do-quiz`
        return ApiSender.post(route, payload)
    }

    public static submitResultHomework(payload: {
        quiz_session_id: number
        user_answers: any[]
    }) {
        const route = `/quiz-svc/user/quiz/submit`
        return ApiSender.post(route, payload)
    }

    public static getHistoryDoHomework(query?: {
        page_size: number
        page_number: number
        quiz_id: number
    }) {
        const route = `/quiz-svc/user/quiz-sessions`
        return ApiSender.get(route, query)
    }

    public static calculateAvgHomework(
        quiz_id: number,
        booking_finished_at: number
    ) {
        const route = `/quiz-svc/user/quiz/calculate-avg-point`
        return ApiSender.post(route, { quiz_id, booking_finished_at })
    }

    public static getHomeworks(query?: {
        page_size: number
        page_number: number
    }) {
        const route = '/core/quiz/homeworks'
        return ApiSender.get(route, query)
    }

    public static getExams(query?: {
        page_size: number
        page_number: number
        type?: string
    }) {
        const route = '/core/quiz/exams'
        return ApiSender.get(route, query)
    }
}
