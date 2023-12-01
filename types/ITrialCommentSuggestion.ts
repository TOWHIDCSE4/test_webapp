import { IMemoNote } from 'types'

export interface CreateTrialMemoBookingDTO {
    teacher_assessment: IMemoNote[]
    student_starting_level: any
}
export interface ITrialCommentSuggestion {
    keyword: string
    comments: string[]
    created_time?: Date
    updated_time?: Date
}
