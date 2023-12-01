import { EnumPackageOrderType } from 'types'

export enum EnumOrderStatus {
    PAID = 1,
    PENDING = 2,
    CANCEL = 3
}
export interface IOrder {
    id: number
    code?: string
    type: EnumPackageOrderType
    price: number
    discount: number
    total_bill: number
    coupon_id: number
    status: EnumOrderStatus
    admin_note: string
    user_id: number
    created_time?: Date
    updated_time?: Date
}
