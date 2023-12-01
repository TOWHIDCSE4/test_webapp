import ApiSender from './ApiSender'

export default class QuizAPI {
    public static getQuizzes(query?: any) {
        const route = `/quiz-svc/user/quizzes`
        return ApiSender.get(route, query)
    }

    public static getDetailQuiz(id: number) {
        const route = `/quiz-svc/user/quiz/${id}`
        return ApiSender.get(route)
    }

    public static startDoQuiz(id: number) {
        const route = `/quiz-svc/user/quiz/start-do-quiz`
        return ApiSender.post(route, { quiz_id: id })
    }

    public static getDetailQuizSession(id: number) {
        const route = `/quiz-svc/user/quiz-session/${id}`
        return ApiSender.get(route)
    }

    public static getQuizSessions(query?: any) {
        const route = `/quiz-svc/user/quiz-sessions`
        return ApiSender.get(route, query)
    }

    public static userSubmitResult(payload?: any) {
        const route = `/quiz-svc/user/quiz/submit`
        return ApiSender.post(route, payload)
    }
}
