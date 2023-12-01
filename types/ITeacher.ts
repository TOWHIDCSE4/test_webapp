import { ILocation, IUser, ITeacherLevel } from 'types'

export interface ITeacher {
    id: number
    user_id: number
    user: IUser
    average_rating: number
    about_me: string
    experience: string
    intro_video: string
    level: ITeacherLevel
    location: ILocation
    total_lesson: number
    full_name: string
    email: string
    avatar: string
    hourly_rate: number
    cv: string
    degree: string
    english_certificate: EnglishCertificate
    teaching_certificate: TeachingCertificate
    ref_code: string
    ref_by_teacher: refTeacherObject
    user_info: IUser
    is_reviewed: boolean
    skype_account: string
}

type refTeacherObject = {
    id: number
    full_name?: string
    email?: string
    mobile?: string
    ref_date: Date
}

type EnglishCertificate = {
    ielts?: string
    toeic?: string
}
type TeachingCertificate = {
    tesol?: string
    tefl?: string
}
