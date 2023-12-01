import ApiSender from './ApiSender'

export default class EventNoticeAPI {
    public static getEventNotices(query: {
        page_size: number
        page_number: number
    }) {
        const route = `/core/event-notices`
        return ApiSender.get(route, query)
    }
}
