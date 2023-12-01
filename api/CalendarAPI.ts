import ApiSender from './ApiSender'

export default class CalendarAPI {
    public static getCalendarByStudent(id: number, query?: {}) {
        const route = `/core/teacher/${id}/schedule`
        return ApiSender.get(route, query)
    }

    public static getSimpleCalendarByStudent(id: number, query?: {}) {
        const route = `/core/teacher/${id}/simple-schedule`
        return ApiSender.get(route, query)
    }

    public static getCalendarsActive(query?: {}) {
        const route = '/core/teacher/schedules'
        return ApiSender.get(route, query)
    }

    public static createSchedule(payload: object) {
        const route = '/core/teacher/schedule'
        return ApiSender.post(route, payload)
    }

    public static editSchedule(id: number) {
        const route = `/core/teacher/schedule/${id}`
        return ApiSender.put(route)
    }
}
