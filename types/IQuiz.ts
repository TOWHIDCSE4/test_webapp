import { EnumQuizSessionStatus } from 'const'
import { IQuestion } from 'types'

export interface IQuiz {
    id: number
    _id?: string
    name: string
    price: number
    time_limit: number
    score: number
    passed_minimum: number
    number_of_question: number
    user_score?: number
    status?: EnumQuizSessionStatus
    instruction?: string
    questions?: IQuestion[]
    start_time?: Date
    end_time?: Date
    created_time?: Date
    updated_time?: Date
    doing_quiz_session: IQuiz
    quiz?: IQuiz
    submit_time?: Date
}
