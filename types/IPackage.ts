import { ILocation } from 'types'

export enum EnumPackageType {
    STANDARD = 1,
    PREMIUM = 2,
    TRIAL = 3
}

export enum EnumFrequencyType {
    NORMAL = 1,
    DAILY = 2
}

export interface IPackage {
    id: number
    location_id: number
    type: EnumPackageType
    subject_id: number
    name: string
    alias: string
    slug: string
    description?: string
    price: number
    number_class: number
    day_of_use: number
    discount: number
    is_active: boolean
    is_support: boolean
    image: string
    expired_time: Date
    location: ILocation
    created_time?: Date
    updated_time?: Date
    amount?: number
    learning_frequency_type?: number
    is_show_on_student_page?: boolean
}
