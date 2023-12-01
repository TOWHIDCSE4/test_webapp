import { EnumReportType } from 'types'
import ApiSender from './ApiSender'

export default class ReportAPI {
    public static getReports(query?: {
        page_size?: number
        page_number?: number
        type?: EnumReportType
    }) {
        // if (!query || !query.type) query.type = EnumReportType.RECOMMEND
        const route = '/core/report/claim/list'
        return ApiSender.get(route, query)
    }

    public static newReport(payload?: {
        recommend_content?: string
        recommend_section?: number
    }) {
        const route = `/core/report/claim/new`
        return ApiSender.post(route, payload)
    }

    public static ratingLesson(payload) {
        const route = `/core/report/rating`
        return ApiSender.post(route, payload)
    }

    public static updateReport(payload?: {
        recommend_status?: number
        report_teacher_feedback?: string
        id?: number
    }) {
        const route = `/core/report/claim/update/${payload.id}`
        return ApiSender.put(route, payload)
    }
}
