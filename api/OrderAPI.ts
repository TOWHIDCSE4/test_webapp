import { EnumOrderType, EnumOrderStatus } from 'types'
import ApiSender from './ApiSender'

export default class OrderAPI {
    public static getOrders(query?: {
        page_size: number
        page_number: number
        status: EnumOrderStatus
        type?: EnumOrderType
    }) {
        const route = '/core/orders'
        return ApiSender.get(route, query)
    }

    public static getOrdersWithTypes(query?: {
        page_size: number
        page_number: number
        status: EnumOrderStatus
        type: EnumOrderType[]
    }) {
        const route = '/core/orders'
        return ApiSender.get(route, query)
    }

    public static createOrder(payload: object) {
        const route = '/core/orders'
        return ApiSender.post(route, payload)
    }

    public static countOrders() {
        const route = '/core/count-active-ordered-packages'
        return ApiSender.get(route)
    }

    public static getOrderedPackage(query?: {
        page_size: number
        page_number: number
        activated?: boolean
        expired?: boolean
        finished?: boolean
        type?: EnumOrderType
        teacher_location_id?: number
    }) {
        const route = '/core/ordered-packages'
        return ApiSender.get(route, query)
    }

    public static cancelOrder(id: number) {
        const route = `/core/orders/${id}/cancel`
        return ApiSender.put(route)
    }
}
