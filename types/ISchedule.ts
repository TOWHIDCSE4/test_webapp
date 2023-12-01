import { IBooking, ICalendar, IRegularCalendar } from 'types'

export interface ISchedule {
    available_schedule: ICalendar[]
    booked_schedule: IBooking[]
    available_regular_schedule: number[]
    registered_regular_schedule: IRegularCalendar[]
}
