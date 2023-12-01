import { IBooking } from './IBooking'
import { IOriginMemo } from './IMemo'

export interface ITrialBooking {
    booking_id: number
    booking: IBooking
    memo?: IOriginMemo
    created_time?: Date
    updated_time?: Date
}
