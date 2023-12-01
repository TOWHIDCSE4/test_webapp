import ApiSender from './ApiSender'

export default class ExtensionAPI {
    public static getExtensionRequest(query?: {
        page_size?: number
        page_number?: number
        min_days?: string
        max_days?: string
    }) {
        const route = '/core/student/extension-requests'
        return ApiSender.get(route, query)
    }

    public static newExtension(payload?: {
        ordered_package_id: number
        student_note: string
    }) {
        const route = `/core/student/extension-requests`
        return ApiSender.post(route, payload)
    }

    public static async getFee(query?: { ordered_package_id?: number }) {
        const route = '/core/student/extension-requests/cost-preview'
        return ApiSender.get(route, query)
    }
}
