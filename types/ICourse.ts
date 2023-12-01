import { IPackage } from './IPackage'

export enum EnumCourseTag {
    HOT = 'hot',
    POPULAR = 'popular',
    NEW = 'new',
    SPECIAL_OFFER = 'special_offer'
}
export interface ICourse {
    total_lessons: number
    id: number
    _id?: string
    is_active: boolean
    subject_id: number
    package_id: number
    name: string
    alias: string
    description?: string
    slug?: string
    image?: string
    created_time?: Date
    updated_time?: Date
    package?: IPackage
    tags?: EnumCourseTag[]
    course_type?: string
}
