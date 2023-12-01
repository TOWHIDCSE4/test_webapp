import ApiSender from './ApiSender'

export default class ReservationAPI {
    public static getReservationRequest(query?: {
        page_size?: number
        page_number?: number
        start_time?: string
        end_time?: string
    }) {
        const route = '/core/student/reservation-requests'
        return ApiSender.get(route, query)
    }

    public static updateReservation(payload?: {
        start_time?: string
        end_time?: string
        order_id?: number
        student_note?: string
        id: number
    }) {
        const route = `/core/student/reservation-requests/${payload.id}`
        return ApiSender.put(route, payload)
    }

    public static newReservation(payload?: {
        start_time: string
        end_time: string
        order_id: number
        student_note: string
    }) {
        const route = `/core/student/reservation-requests`
        return ApiSender.post(route, payload)
    }

    public static deleteReservation(id: number) {
        const route = `/core/student/reservation-requests/${id}`
        return ApiSender.delete(route)
    }

    public static async getFee(query?: { order_id?: number }) {
        const route = '/core/student/reservation-requests/cost-preview'
        return ApiSender.get(route, query)
    }
}
