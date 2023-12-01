import { IQuiz, IBooking, ICourse } from 'types'

export interface IExam {
    _id: string
    id: number
    name: string
    description: string
    quiz: IQuiz
    quiz_id: string
    course_id: string
    course: ICourse
    created_time?: Date
    updated_time?: Date
    booking?: IBooking
}
