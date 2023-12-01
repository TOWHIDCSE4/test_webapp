import ApiSender from './ApiSender'

export default class StudentAPI {
    public static getStudentInfo() {
        const route = '/core/student/me'
        return ApiSender.get(route)
    }

    public static getAllLeaveRequests(query?: {
        page_size: number
        page_number: number
        status: number
    }) {
        const route = '/core/student/leave-requests'
        return ApiSender.get(route, query)
    }

    public static createLeaveRequests(payload: any) {
        const route = '/core/student/leave-requests'
        return ApiSender.post(route, payload)
    }
}
