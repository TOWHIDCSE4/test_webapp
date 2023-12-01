export const DEFAULT_AVATAR = '/static/img/common/teacher.png'

export const DEFAULT_AVATAR_STUDENT = '/static/img/common/hv.png'

export const DEFAULT_COURSE_PREVIEW = '/static/img/common/course.png'

export const DEFAULT_PACKAGE_PREVIEW = '/static/img/common/package.png'
export const DEFAULT_DISCOUNT_PREVIEW = '/static/img/common/discount.png'
export const DEFAULT_SALE_OFF_PREVIEW = '/static/img/common/sale_off.png'

export const HOT_LINE = '19002095'

export const EMAIL_COMPANY = 'info@ispeak.vn'

export const MAX_PAGE_SIZE = 100

export const TEACHER_ALLOWED_ABSENCE_CLASS = 4

export const PAGE_SIZE = 20

export const LOCATION_ID_VIETNAM = 168
export const LOCATION_ID_ASIAN = 170

export enum EnumBookingSort {
    UPCOMING = 'upcoming',
    PREV = 'prev'
}

export const PATTERN_PHONE_NUMBER = /^0[0-9]{9,14}$/

export const TYPE_COURSE = [
    {
        path: '/assets/images/homepage/svgs/icon_course_kid.svg',
        title: 'Cho bé',
        value: 'Kid'
    },
    {
        path: '/assets/images/homepage/svgs/icon_course_communicate.svg',
        title: 'Cho giao tiếp',
        value: 'Communicate'
    },
    {
        path: '/assets/images/homepage/svgs/icon_course_highschool.svg',
        title: 'Cho trung học',
        value: 'High School'
    },
    {
        path: '/assets/images/homepage/svgs/icon_course_study_aboard.svg',
        title: 'Cho du học',
        value: 'Study Abroad'
    },
    {
        path: '/assets/images/homepage/svgs/icon_course_worker.svg',
        title: 'Cho đi làm',
        value: 'Worker'
    },
    {
        path: '/assets/images/homepage/svgs/icon_course_practice_exam.svg',
        title: 'Cho luyện thi',
        value: 'Practice Exam'
    }
]

export enum EnumHomeworkType {
    v1 = 'self-study-v1',
    v2 = 'self-study-v2'
}

export enum EnumHomeworkDataType {
    COMMON = 'EN_COMMON',
    IELTS = 'IELTS'
}

export enum EnumHomeworkResultType {
    COMMON = 1,
    IELTS = 2
}

export enum EnumTemplateType {
    EMAIL = 1,
    NOTIFICATION = 2,
    EVENT = 3,
    PDF = 4,
    ZALOOA = 5
}
