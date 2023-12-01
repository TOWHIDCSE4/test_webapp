export enum EnumLAReportStatus {
    PRIVATE = 1,
    PUBLISHED = 2
}

export enum textLAReportStatus {
    PRIVATE = 'Private',
    PUBLISHED = 'Publish'
}

export enum EnumLAReportType {
    OTHER = 1,
    DILIGENCE = 2,
    PERIODIC = 3,
    END_TERM = 4
}

export enum textLAReportType {
    OTHER = 'student.learning_assessment.type_other',
    DILIGENCE = 'student.learning_assessment.type_diligence',
    PERIODIC = 'student.learning_assessment.type_periodic',
    END_TERM = 'student.learning_assessment.type_end_term'
}

export enum EnumLAReportSource {
    SYSTEM = 1,
    ADMIN = 2
}

export enum EnumLAModalType {
    NEW = 1,
    EDIT = 2,
    VIEW = 3
}

export interface ILocation {
    id: number
    start_time: number
    end_time: number
    status: EnumLAReportStatus
    type: EnumLAReportType
    prompt_obj_id?: string
    prompt_template?: any
    memo?: string
    booking_ids?: number[]
    source?: EnumLAReportSource
    note?: any
    created_time?: Date
    updated_time?: Date
}
