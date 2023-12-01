import { EnumBookingSort } from 'const'
import { AnyARecord } from 'dns'
import { CreateTrialMemoBookingDTO, IOriginMemo } from 'types'
import ApiSender from './ApiSender'

export default class BookingAPI {
    // With role Student
    public static getBooking(query?: {
        page_size: number
        page_number: number
        status: number | number[]
        student_rated?: any
        min_start_time?: number
        max_end_time?: number
        exclude_status?: number[]
        sort?: EnumBookingSort
        ordered_package_id?: any
    }) {
        const route = '/core/student/bookings'
        return ApiSender.get(route, {
            ...query
        })
    }

    public static createBooking(payload: object) {
        const route = '/core/student/booking'
        return ApiSender.post(route, payload)
    }

    public static createBookingWithRegularCalendar(payload: object) {
        const route = '/core/student/booking/unmatched-regular'
        return ApiSender.post(route, payload)
    }

    public static getDetailLesson(id: number) {
        const route = `/core/lessons/${id}`
        return ApiSender.get(route)
    }

    public static absentOrCancelLesson(id: number, payload: object) {
        const route = `/core/student/lessons/${id}/absent-or-cancel`
        return ApiSender.put(route, payload)
    }

    public static editHomeworkBooking(id: number, payload: object) {
        const route = `/core/student/lessons/${id}/homework`
        return ApiSender.put(route, payload)
    }

    public static makeStudentAbsent(id: number, reason: string) {
        const route = `/core/teacher/bookings/student-absent`
        return ApiSender.post(route, { id, reason })
    }

    public static ratingLesson(id: number, payload: object) {
        const route = `/core/student/lessons/${id}/rating`
        return ApiSender.put(route, payload)
    }

    public static joinClass(id: number) {
        const route = `/core/student/bookings/${id}/class`
        return ApiSender.get(route, {})
    }

    // with role Teacher
    public static getBookingsByTeacher(query?: {
        page_size: number
        page_number: number
        status?: number[] | number
        search?: any
        upcoming?: boolean | number
        prev?: boolean
        memo?: boolean
        recorded?: boolean
    }) {
        const route = '/core/teacher/bookings'
        return ApiSender.get(route, {
            ...query
        })
    }

    public static getDetailTrialBooking(id: number) {
        const route = `/core/lessons/${id}`
        return ApiSender.get(route)
    }

    public static getAllBookingByIds(payload: any) {
        const route = '/core/student/bookings/all-booking-by-ids'
        return ApiSender.get(route, payload)
    }

    public static getTeachingBookingByStudent() {
        const route = `/core/student/count-booking-teaching`
        return ApiSender.get(route)
    }

    public static absentBookingByTeacher(payload: object) {
        const route = `/core/teacher/bookings/absent`
        return ApiSender.post(route, payload)
    }

    public static willTeach(payload: object) {
        const route = `/core/teacher/bookings/will-teach`
        return ApiSender.post(route, payload)
    }

    public static startClass(id: number, payload?: object) {
        const route = `/core/teacher/bookings/${id}/class`
        return ApiSender.post(route, payload)
    }

    public static endClass(payload: object) {
        const route = '/core/teacher/bookings/finish-teaching'
        return ApiSender.post(route, payload)
    }

    public static createMemoByTeacher(
        id: number,
        payload: {
            memo: IOriginMemo
        }
    ) {
        const route = `/core/teacher/bookings/${id}/memo`
        return ApiSender.put(route, payload)
    }

    public static updateRecordBooking(id: number, payload: object) {
        const route = `/core/teacher/bookings/${id}/record`
        return ApiSender.put(route, payload)
    }

    public static getMemoSuggestion(query?: {}) {
        const route = '/core/teacher/bookings/memo-suggestions'
        return ApiSender.get(route, query)
    }

    public static teacherGetReport(query?: {}) {
        const route = '/core/teacher/bookings/report'
        return ApiSender.get(route, query)
    }

    public static getTeacherSalary(query: any) {
        const route = '/core/teacher/salary'
        return ApiSender.get(route, query)
    }

    public static getTrialMemoSuggestion() {
        const route = '/core/teacher/trial-bookings/comment-suggestion-list'
        return ApiSender.get(route)
    }

    public static createTrialMemoBooking(
        booking_id: number,
        payload: {
            memo: IOriginMemo
        }
    ) {
        const route = `/core/teacher/bookings/trial/${booking_id}/memo`
        return ApiSender.put(route, payload)
    }

    public static getTeacherFines(query: {
        start_time: number
        end_time: number
    }) {
        const route = '/core/teacher/teacher-fines'
        return ApiSender.get(route, query)
    }

    public static uploadVideoByTeacher(payload: object) {
        const route = '/core/teacher/bookings/record-upload'
        return ApiSender.post(route, payload)
    }

    public static startTest(id: number, type: string) {
        const route = `/core/student/lessons/start-test`
        return ApiSender.post(route, { lesson_id: id, result_type: type })
    }

    public static editTestResultBooking(id: number, payload: object) {
        const route = `/core/student/lessons/update-test-result`
        return ApiSender.put(route, { lesson_id: id, ...payload })
    }

    public static getBookingOfDailyPackage(package_id: any) {
        const route = `/core/student/bookings/booking-of-daily-package`
        return ApiSender.post(route, { package_id })
    }
}
