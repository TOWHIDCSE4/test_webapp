import ApiSender from './ApiSender'

export default class UnitAPI {
    public static getUnitsByCourse(
        id: number,
        query?: {
            page_size: number
            page_number: number
        }
    ) {
        const route = '/core/courses'
        return ApiSender.get(route, query)
    }

    public static getUnitsLearnt(
        id: number,
        query?: {
            page_size: number
            page_number: number
        }
    ) {
        const route = `/core/student/courses/${id}/units/learnt`
        return ApiSender.get(route, query)
    }
}
