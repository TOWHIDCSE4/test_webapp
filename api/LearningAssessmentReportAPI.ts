import ApiSender from './ApiSender'

export default class LearningAssessmentReportAPI {
    public static getAllReportPublish(query?: any) {
        const route = '/core/learning-assessment/all-report-publish'
        return ApiSender.get(route, query)
    }

    public static getDetailReport(query?: {}) {
        const route = '/core/learning-assessment/detail-report'
        return ApiSender.get(route, query)
    }
}
