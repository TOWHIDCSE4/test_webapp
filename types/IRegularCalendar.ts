import { ICourse, IUser } from 'types'

export interface IRegularCalendar {
    _id: string
    id: number
    student_id: number
    teacher_id: number
    course_id: number
    ordered_package_id: number
    regular_start_time: number
    status: number
    communicate_tool?: number
    cancel_reason?: string
    admin_note?: string
    student: IUser
    teacher: IUser
    course: ICourse
    created_time?: Date
    updated_time?: Date
}
