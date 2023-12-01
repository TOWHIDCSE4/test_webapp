export interface INotification {
    _id: string
    receiver: string
    message: string
    seen: boolean
    extra_info: any
    created_time: Date
    updated_time: Date
}
