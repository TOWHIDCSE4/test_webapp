/* eslint-disable no-restricted-syntax */
import { AbsentRequestDto } from 'types'
import ApiSender from './ApiSender'

const queryString = require('query-string')

export default class TeacherAPI {
    public static getTeachers(
        query?: {
            page_size: number
            page_number: number
        },
        payload?: object
    ) {
        const route = `/core/teachers?${queryString.stringify(query, {
            skipNull: true,
            skipEmptyString: true
        })}`

        // const new_payload: any = {}
        // if (payload) {
        //     for (const [key, value] of Object.entries(payload)) {
        //         if (key === 'calendar') {
        //             const new_calendar = {}
        //             for (const [_key, _value] of Object.entries(value)) {
        //                 if (_value) {
        //                     new_calendar[_key] = _value
        //                 }
        //             }
        //             if (Object.keys(new_calendar).length > 0) {
        //                 new_payload.calendar = new_calendar
        //             }
        //         } else if (value && value.length > 0) {
        //             new_payload[key] = value
        //         }
        //     }
        // }

        return ApiSender.post(route, payload)
    }

    public static getFullInfoTeacher(id: number) {
        const route = `/core/teachers/${id}`
        return ApiSender.get(route)
    }

    public static submitRegularRequest({ regular_times }) {
        const route = `/core/teacher/regular-requests`
        return ApiSender.post(route, { regular_times })
    }

    public static getAllRegularRequests(query?: {
        page_size: number
        page_number: number
    }) {
        const route = '/core/teacher/regular-requests'
        return ApiSender.get(route, query)
    }

    public static teacherRequestReview() {
        const route = '/core/teacher/request-review'
        return ApiSender.post(route)
    }

    public static getAllAbsentRequests(query?: {
        page_size: number
        page_number: number
        status: number
    }) {
        const route = '/core/teacher/absent-requests'
        return ApiSender.get(route, query)
    }

    public static createAbsentRequests(payload: AbsentRequestDto) {
        const route = '/core/teacher/absent-requests'
        return ApiSender.post(route, payload)
    }

    public static editAbsentRequests(id: number, payload: AbsentRequestDto) {
        const route = `/core/teacher/absent-requests/${id}`
        return ApiSender.put(route, payload)
    }

    public static removeAbsentRequests(id: number) {
        const route = `/core/teacher/absent-requests/${id}`
        return ApiSender.delete(route)
    }

    public static getAllStudentsOfTeacher(query?: { search?: string }) {
        const route = '/core/teacher/students'
        return ApiSender.get(route, query)
    }

    public static getAllCoursesOfTeacher(query?: { search?: string }) {
        const route = '/core/teacher/courses'
        return ApiSender.get(route, query)
    }

    public static getALlReferredTeachers(query?: {
        search?: string
        page_number?: number
        page_size?: number
    }) {
        const route = '/core/teacher/referred-teachers'
        return ApiSender.get(route, query)
    }
}
