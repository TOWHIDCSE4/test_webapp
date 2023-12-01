import { EnumCommentType } from 'types/ICommentSuggestion'
import _ from 'lodash'
import ApiSender from './ApiSender'

type QueryParams = {
    page_size?: number
    page_number?: number
    type?: EnumCommentType
    keyword?: string | string[]
    point?: number
}
export default class CommentSuggestionAPI {
    public static getRandomCommentSuggestion(query?: QueryParams) {
        const route = `/core/teacher/comment-suggestion`
        return ApiSender.get(route, query)
    }

    public static getCommentSuggestions(query?: QueryParams) {
        const route = `/core/teacher/comment-suggestions`
        return ApiSender.get(route, query)
    }
}
