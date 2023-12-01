import { EnumCourseTag } from 'types'
import ApiSender from './ApiSender'

export default class CourseAPI {
    public static getCoursesByPackage(query: {
        page_size: number
        page_number: number
        package_ids: number[]
        search?: string
        tags?: EnumCourseTag[]
    }) {
        const route = `/core/courses`
        return ApiSender.get(route, query)
    }

    public static getRecentLearnt(query?: {}) {
        const route = '/core/student/courses/recent-learnt'
        return ApiSender.get(route, query)
    }

    public static getCoursePublic(query?: {}) {
        const route = '/core/public/courses'
        return ApiSender.get(route, query)
    }

    public static getCoursePublicInfo(id: number) {
        const route = `/core/public/courses/${id}`
        return ApiSender.get(route)
    }
}
