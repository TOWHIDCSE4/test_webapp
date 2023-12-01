import { BOOKING_STATUS } from 'const'

export const renderColorStatus = (status: BOOKING_STATUS) => {
    switch (status) {
        case BOOKING_STATUS.COMPLETED:
            return '#20AC5C'
        case BOOKING_STATUS.STUDENT_ABSENT:
            return '#F63238'
        case BOOKING_STATUS.TEACHER_ABSENT:
            return '#F63238'
        case BOOKING_STATUS.CANCEL_BY_STUDENT:
            return '#9D9D9D'
        case BOOKING_STATUS.CANCEL_BY_TEACHER:
            return '#9D9D9D'
        case BOOKING_STATUS.CANCEL_BY_ADMIN:
            return '#F63238'
        case BOOKING_STATUS.PENDING:
            return '#faad14'
        case BOOKING_STATUS.CONFIRMED:
            return '#87e8de'
        case BOOKING_STATUS.TEACHING:
            return '#1890ff'
        default:
            break
    }
}
