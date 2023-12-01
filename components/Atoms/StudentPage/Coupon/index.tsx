import CouponAPI from 'api/CouponAPI'
import { notify } from 'contexts/Notification'
import { useEffect, useState } from 'react'
import { ICoupon } from 'types'
import { Col, Row, Pagination } from 'antd'
import CouponItem from '../CouponItem'

const Coupon = () => {
    const [loading, setLoading] = useState(false)
    const [coupons, setCoupons] = useState<ICoupon[]>([])
    const [total, setTotal] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const fetchCoupons = (query: {
        page_size: number
        page_number: number
    }) => {
        setLoading(true)
        CouponAPI.getCoupons(query)
            .then((res) => {
                setCoupons(res.data)
                setTotal(res?.pagination?.total)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchCoupons({ page_number: pageNumber, page_size: pageSize })
    }, [])

    const renderCouponItem = () =>
        coupons.map((item, index) => (
            <Col key={index} xs={24} sm={24} md={24} lg={12}>
                <CouponItem data={item} key={index} />
            </Col>
        ))

    const handleChangePagination = (_pageNumber, _pageSize) => {
        if (_pageNumber !== pageNumber) {
            setPageNumber(_pageNumber)
        }
    }
    return (
        <div>
            <Row gutter={[20, 20]}>{renderCouponItem()}</Row>
            {!loading && total > 0 && (
                <div className='mt-3 mb-3 d-flex justify-content-end'>
                    <Pagination
                        defaultCurrent={pageNumber}
                        pageSize={pageSize}
                        total={total}
                        onChange={handleChangePagination}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    )
}

export default Coupon
