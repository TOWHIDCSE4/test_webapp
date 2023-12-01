import ApiSender from './ApiSender'

export default class ProfileAPI {
    public static getStudentFullInfo() {
        const route = '/core/student/me'
        return ApiSender.get(route)
    }

    public static editStudentInfo(payload: object) {
        const route = '/core/student'
        return ApiSender.put(route, payload)
    }

    public static getTeacherFullInfo() {
        const route = '/core/teacher/me'
        return ApiSender.get(route)
    }

    public static editTeacherInfo(payload: object) {
        const route = '/core/teacher'
        return ApiSender.put(route, payload)
    }
}
