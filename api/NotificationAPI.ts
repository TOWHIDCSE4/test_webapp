import ApiSender from './ApiSender'

type QueryParams = {
    page_size?: number
    page_number?: number
    seen?: boolean
    is_alert?: boolean
    type?: string
    template_obj_id?: any
    fromDate?: any
    toDate?: any
}

export default class NotificationAPI {
    public static getNotifications(query: QueryParams) {
        const route = '/noti/notifications'
        return ApiSender.get(route, query)
    }

    public static markNotificationsAsSeen(payload: QueryParams = {}) {
        const route = '/noti/notifications/mark-seen'
        return ApiSender.put(route, payload)
    }

    public static markNotification(payload: { ids: any[]; seen: boolean }) {
        const route = '/noti/notifications/mark-noti'
        return ApiSender.post(route, payload)
    }

    public static markSeenById(payload) {
        const route = `/noti/notifications/mark-seen-by-id`
        return ApiSender.put(route, payload)
    }

    public static getNotificationsForView(query: QueryParams) {
        return ApiSender.get('/noti/notifications-for-view', query)
    }
}
