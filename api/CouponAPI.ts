import ApiSender from './ApiSender'

export default class CouponAPI {
    public static getCoupons(query: {
        page_size: number
        page_number: number
    }) {
        const route = `/core/coupons`
        return ApiSender.get(route, query)
    }

    public static checkCoupon(query: { code: string }) {
        const route = `/core/coupons/check/${query.code}`
        return ApiSender.get(route, query)
    }
}
