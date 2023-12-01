import { Card, Divider } from 'antd'
import { useEffect, useState } from 'react'
import OrderAPI from 'api/OrderAPI'
import { notify } from 'contexts/Notification'
import GeneralInformation from './GeneralInformation'
import ChangePassword from './ChangePassword'
import RegularTime from './RegularTime'

const RightBlock = () => {
    const [countOrder, setCountOrder] = useState<any>({
        count_premium: 0,
        count_standard: 0
    })

    const getCountOrder = () => {
        OrderAPI.countOrders()
            .then((res) => {
                if (res.count) {
                    setCountOrder(res.count)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    useEffect(() => {
        getCountOrder()
    }, [])
    return (
        <Card>
            <GeneralInformation />
            <Divider />
            {countOrder.count_premium > 0 && (
                <>
                    <RegularTime />
                    <Divider />
                </>
            )}
            <ChangePassword />
        </Card>
    )
}
export default RightBlock
