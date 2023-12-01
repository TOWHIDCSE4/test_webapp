export enum REGULAR_REQUEST_STATUS {
    CONFIRMED = 1,
    PENDING,
    CANCELED
}

export enum REGULAR_REQUEST_TYPES {
    NEW = 'New regular time',
    EDIT = 'Edit regular time',
    CLOSE = 'Close regular time'
}

export enum BOOKING_STATUS {
    COMPLETED = 1,
    PENDING = 2,
    CONFIRMED = 3,
    TEACHING = 4,
    STUDENT_ABSENT = 5,
    TEACHER_ABSENT = 6,
    CANCEL_BY_STUDENT = 7,
    CANCEL_BY_TEACHER = 8,
    CANCEL_BY_ADMIN = 9,
    TEACHER_CONFIRMED = 10,
    CHANGE_TIME = 11
}

export enum BOOKING_STATUS_TITLE {
    COMPLETED = 1,
    PENDING = 2,
    UPCOMING = 3,
    TEACHING = 4,
    STUDENT_ABSENT = 5,
    TEACHER_ABSENT = 6,
    CANCEL_BY_STUDENT = 7,
    CANCEL_BY_TEACHER = 8,
    CANCEL_BY_ADMIN = 9,
    TEACHER_CONFIRM = 10,
    CHANGE_TIME = 11
}

export enum TEACHER_REVIEW_STATUS {
    REJECT = -1,
    PENDING = 0,
    CONFIRMED = 1
}

export enum VERIFY_EMAIL_STATUS {
    SUCCESS = '10000',
    FAILURE = '10001'
}

export const EMAIL_NOT_VERIFY_CODE = '10004'

export enum EnumQuizSessionStatus {
    PASS = 1,
    FAIL = 2,
    DOING = 3
}

export const EnumBookingStatus = {
    COMPLETED: 1,
    PENDING: 2,
    CONFIRMED: 3,
    TEACHING: 4,
    STUDENT_ABSENT: 5,
    TEACHER_ABSENT: 6,
    CANCEL_BY_STUDENT: 7,
    CANCEL_BY_TEACHER: 8
}

export enum ENUM_BOOKING_STATUS {
    COMPLETED = 1,
    PENDING = 2,
    UPCOMING = 3,
    TEACHING = 4,
    STUDENT_ABSENT = 5,
    TEACHER_ABSENT = 6,
    CANCEL_BY_STUDENT = 7,
    CANCEL_BY_TEACHER = 8,
    CANCEL_BY_ADMIN = 9,
    TEACHER_CONFIRM = 10,
    CHANGE_TIME = 11
}

export enum EnumBookingStatusForTeachingHistory {
    COMPLETED = 1,
    STUDENT_ABSENT = 5,
    TEACHER_ABSENT = 6,
    CANCEL_BY_STUDENT = 7,
    CANCEL_BY_TEACHER = 8,
    CANCEL_BY_ADMIN = 9,
    TEACHER_CONFIRM = 10,
    CHANGE_TIME = 11
}

export enum EnumModalType {
    ADD_NEW_ON_SCHEDULE,
    ADD_NEW,
    EDIT
}

export enum ERROR_REPORT_TYPES {
    SERVER = 1,
    NETWORK = 2
}

export enum TEST_TYPE {
    NORMAL = 1,
    STAFF_PRE_TEST = 2
}
