import ApiSender from './ApiSender'

export default class UserAPI {
    public static getFullInfo() {
        const route = '/core/user/me'
        return ApiSender.get(route)
    }

    public static editUserInfo(payload: object) {
        const route = '/core/user/update'
        return ApiSender.put(route, payload)
    }

    public static getRegularTimes() {
        const route = '/core/user/regular_times'
        return ApiSender.get(route)
    }

    public static testConnect() {
        const route = '/core/health'
        return ApiSender.get(route)
    }

    public static getFullInfoByTeacher() {
        const route = '/core/teacher/me'
        return ApiSender.get(route)
    }

    public static getRegularCalendars(query?: {
        page_size: number
        page_number: number
    }) {
        const route = '/core/user/regular-calendars'
        return ApiSender.get(route, query)
    }

    public static editTeacherInfo(payload: object) {
        return ApiSender.put('/core/teacher', payload)
    }

    public static updateBankAccount(payload: object) {
        return ApiSender.put('/core/user/update-bank-account', payload)
    }

    public static getBankList() {
        return ApiSender.get('/core/public/bank-list')
    }

    public static checkValuableUser() {
        return ApiSender.get(`/core/user/is-valuable-user`)
    }

    public static confirmReceivedSalary(circle?: any) {
        return ApiSender.put(`/core/teacher/teacher-salaries/confirm`, {
            _id: circle._id
        })
    }

    public static rejectReceivedSalary(circle?: any) {
        return ApiSender.put(`/core/teacher/teacher-salaries/reject`, {
            _id: circle._id
        })
    }

    public static getUserById(payload?: any) {
        return ApiSender.put(`/core/user/get-user-by-id`, payload)
    }

    public static getDataUserCrmCache(query?: { crm_user_id_cache: string }) {
        const route = '/core/user/get-data-cache-for-register'
        return ApiSender.get(route, query)
    }

    public static verifyOtpPhone(payload?: any) {
        return ApiSender.put(`/core/user/verify-otp-phone`, payload)
    }

    public static resentOTPCode(payload?: any) {
        return ApiSender.put(`/core/user/resend-otp-code`, payload)
    }
}
