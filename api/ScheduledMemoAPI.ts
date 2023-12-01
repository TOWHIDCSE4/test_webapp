import { EditScheduledMemoDTO, EnumScheduledMemoType } from 'types'
import ApiSender from './ApiSender'

export default class ScheduledMemoAPI {
    public static getScheduledMemos(query: {
        page_size: number
        page_number: number
        type: EnumScheduledMemoType
        month?: number
        year?: number
        course_id?: number
        teacher_commented?: boolean
        sort?: string
    }) {
        const route = `/core/user/scheduled-memos`
        return ApiSender.get(route, query)
    }

    public static editScheduledMemo(id: number, diff: EditScheduledMemoDTO) {
        const route = `/core/teacher/scheduled-memos/${id}`
        return ApiSender.put(route, diff)
    }
}
