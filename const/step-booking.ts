export const STEPS_IN_BOOKING = [
    {
        id: 0,
        name: 'Schedule your lessons',
        title: 'choose_time'
    },
    {
        id: 1,
        name: 'Select Unit',
        title: 'choose_course'
    },
    {
        id: 2,
        name: 'Select Unit',
        title: 'choose_unit'
    },
    {
        id: 3,
        name: 'Done',
        title: 'done'
    }
]

export const STEPS_IN_BOOKING_ENUM = {
    SCHEDULE_LESSON: 1,
    SELECT_LESSON: 2,
    SELECT_UNIT: 3
}

export enum EnumStepsBooking {
    CHOOSE_SCHEDULE_TIME = 0,
    CHOOSE_COURSE,
    CHOOSE_UNIT,
    DONE
}
