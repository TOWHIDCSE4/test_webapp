import { ICourse } from './ICourse'
import { IQuiz } from './IQuiz'

export interface IUnit {
    id: number
    course_id: number
    name: string
    student_document: string
    teacher_document: string
    audio: any
    homework: IQuiz
    workbook: string
    note?: string
    preview?: string
    course: ICourse
    created_time?: Date
    updated_time?: Date
    homework_id?: number
    homework2?: any
    homework2_id?: number
    test_topic?: any
    test_topic_id?: number
    unit_type?: string
}

export enum EnumUnitType {
    EN_COMMON = 'EN_COMMON',
    IELTS_GRAMMAR = 'IELTS_GRAMMAR',
    IELTS_4_SKILLS = 'IELTS_4_SKILLS'
}
