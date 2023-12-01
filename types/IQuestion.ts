export interface IAnswers {
    text?: string
    label?: string
    _id: string
    content: string
    is_correct: boolean
}

export interface IQuestion {
    _id: string
    id: number
    name: string
    description?: string
    answers: IAnswers[]
    quiz_id: number
    display_order: number
    is_correct?: boolean
    created_time?: Date
    updated_time?: Date
    image?: string
    video?: string
    audio?: string
}
