import { EnumTemplateType } from 'const'
import ApiSender from './ApiSender'

type QueryParams = {
    page_size?: number
    page_number?: number
    type?: EnumTemplateType | EnumTemplateType[]
    search?: string
    filter_type?: string
    fromDate?: any
    toDate?: any
}

export default class TemplateAPI {
    public static getTemplateFilters(query?: QueryParams) {
        const route = `/core/student/template-filters`
        return ApiSender.get(route, query)
    }

    public static getAllTemplateByStudent(query?: QueryParams) {
        const route = `/core/student/all-template`
        return ApiSender.get(route, query)
    }
}
