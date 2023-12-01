import { BOOKING_STATUS } from 'const/status'
import {
    ITeacher,
    IStudent,
    IUnit,
    ICalendar,
    ICourse,
    IOrderedPackage,
    IOriginMemo
} from 'types'

export enum EnumBookingMediumType {
    HAMIA_MEET = 1,
    SKYPE = 2
}

export interface IBooking {
    id: number
    student_id: number
    teacher_id: number
    calendar: ICalendar
    course: ICourse
    unit: IUnit
    student: IStudent
    teacher: ITeacher
    status: BOOKING_STATUS
    student_rating: number
    student_note: string
    teacher_note: string
    is_regular_booking: boolean
    join_url: string
    is_done_homework?: boolean
    average?: number
    finished_at?: number
    ordered_package: IOrderedPackage
    record_link?: any
    memo?: IOriginMemo
    registered_class: number
    completed_class: number
    report?: any
    quiz?: any
    booking?: any // If trial booking
    learning_medium: {
        medium_type: EnumBookingMediumType
        info?: any
    }
    homework?: any
    test_topic_id?: number
    test_result_id?: number
    test_result_code?: string
    test_result?: any
    trial_test_url?: string
    homework_test_result?: any
    trial_test_ielts_result?: any
    teacher_info?: any
    is_show_hmp?: boolean
}
