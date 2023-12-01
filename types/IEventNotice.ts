export enum EnumEventNoticeType {
    HAPPY_BIRTHDAY_EVENT = 'BACKEND.HAPPY_BIRTHDAY_EVENT',
    HOLIDAY_EVENT = 'HOLIDAY_EVENT',
    UPDATE_SYSTEM_EVENT = 'UPDATE_SYSTEM_EVENT',
    OTHER_EVENT = 'OTHER_EVENT'
}

export interface IEventNotice {
    type: EnumEventNoticeType
    title: string
    content?: string
    start_time_shown: number
    end_time_shown: number
    status: boolean
    image?: string
    created_time?: Date
    updated_time?: Date
}
