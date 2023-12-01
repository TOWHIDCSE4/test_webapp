import { ROLES } from 'const'
import { ILocation } from 'types'

export interface IUser {
    _id: string
    id: number
    username: string
    email: string
    phone_number: string
    first_name: string
    last_name: string
    full_name: string
    avatar: string
    country: string
    timezone: string
    currency: string
    role: ROLES[]
    date_of_birth: Date
    gender: number
    skype_account: string
    location: ILocation
    hourly_rate?: number
    is_verified_email?: boolean
    is_verified_phone?: boolean
    otp_code?: string
    otp_sent_time?: number
    trial_class_skype_url?: any
    is_enable_receive_mail?: boolean
}

// export enum EnumLearningMediumType {
//     HMP = 1, // Hamia Meet Plus
//     SKYPE = 2
// }
