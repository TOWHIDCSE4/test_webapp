import ApiSender from './ApiSender'

export default class WalletAPI {
    public static getUrlConnectVisa(query?: any) {
        const route = '/core/student/wallet/get-url-connect-visa'
        return ApiSender.get(route, query)
    }

    public static getBalance() {
        const route = '/core/student/wallet/get-balance'
        return ApiSender.get(route)
    }

    public static getTransactionHistory(query?: any) {
        const route = '/core/student/wallet/get-transaction-history'
        return ApiSender.get(route, query)
    }

    public static getWalletHistory(query?: any) {
        const route = '/core/student/wallet/history'
        return ApiSender.get(route, query)
    }

    public static checkStatusOrderAppotapay(query?: any) {
        const route = '/core/student/wallet/history/check-order-appotapay'
        return ApiSender.get(route, query)
    }

    public static deposit(query?: any) {
        const route = `/core/student/wallet/deposit`
        return ApiSender.post(route, query)
    }

    public static markPaid(query?: any) {
        const route = `/core/student/wallet/deposit`
        return ApiSender.put(route, query)
    }

    public static cancelDeposit(data?: any) {
        const route = `/core/student/wallet/deposit/cancel`
        return ApiSender.put(route, data)
    }

    public static getBankAccount(query?: any) {
        const route = '/core/public/bank-account'
        return ApiSender.get(route, query)
    }
}
