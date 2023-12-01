import { IUser, ICourse, IUnit } from 'types'

export interface Assessment {
    point: number
    comment?: string
}

export enum EnumScheduledMemoType {
    MONTHLY_MEMO = 1,
    COURSE_MEMO = 2,
    NORMAL_MEMO = 3 // Not in schema, only use filter client
}

export interface IScheduledMemo {
    id: number
    student_id: number
    type: EnumScheduledMemoType
    month?: number
    year?: number
    course_id?: number
    teacher_id?: number
    registered_class: number
    completed_class: number
    attendance: Assessment
    attitude: Assessment
    homework: Assessment
    exam_result: number
    segments?: SegmentPoint[]
    teacher_note?: string
    admin_note?: string
    teacher_commented: boolean
    student: IUser
    teacher?: IUser
    course?: ICourse
    unit?: IUnit
    student_start_level: number
    created_time?: Date
    updated_time?: Date
}

export interface EditScheduledMemoDTO {
    attendance_comment: string
    attitude_comment: string
    homework_comment: string
    teacher_note: string
}

export interface SegmentPoint {
    start_time: number
    end_time: number
    attendance_point?: number
    attitude_point?: number
    homework_point?: number
    exam_result?: number
}
