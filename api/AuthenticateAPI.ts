import ApiSender from './ApiSender'

export default class AuthenticateAPI {
    public static login(payload: object) {
        const route = '/core/user/login'
        return ApiSender.post(route, payload)
    }

    public static register(payload: object) {
        const route = '/core/user/register'
        return ApiSender.post(route, payload)
    }

    public static registerStudent(payload: object) {
        const route = '/core/user/student/register'
        return ApiSender.post(route, payload)
    }

    public static loginByGoogle(payload: object) {
        const route = '/core/user/student/google-auth'
        return ApiSender.post(route, payload)
    }

    public static changePassword(payload: object) {
        const route = '/core/user/change-password'
        return ApiSender.put(route, payload)
    }

    public static requestResetPassword(payload: object) {
        const route = '/core/user/send-reset-url'
        return ApiSender.post(route, payload)
    }

    public static resetPassword(payload: object) {
        const route = '/core/user/reset-password'
        return ApiSender.post(route, payload)
    }

    public static resendVerifyEmail(payload: object) {
        const route = '/core/user/resend-verify-email'
        return ApiSender.post(route, payload)
    }

    public static becomeATeacher(payload: object) {
        const route = '/core/user/teacher/register'
        return ApiSender.post(route, payload)
    }

    public static becomeATeacherByGoogle(payload: object) {
        const route = '/core/user/teacher/registerGoogle'
        return ApiSender.post(route, payload)
    }
}
