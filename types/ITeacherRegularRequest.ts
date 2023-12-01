import { ITeacher } from 'types'

export interface ITeacherRegularRequest {
    id: number
    teacher_id: number
    old_regular_times: number[]
    regular_times: number[]
    status: number
    teacher: ITeacher
    admin_note?: string
    created_time?: Date
    updated_time?: Date
}
