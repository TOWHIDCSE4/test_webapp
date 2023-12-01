import RightBlock from 'components/Atoms/StudentPage/DetailLesson/RightBlock'
import LeftBlock from 'components/Atoms/StudentPage/DetailLesson/LeftBlock'
import { useState, useEffect, useCallback } from 'react'
import BookingAPI from 'api/BookingAPI'
import { notify } from 'contexts/Notification'
import { useRouter } from 'next/router'
import { Row, Col, Spin } from 'antd'
import { IBooking } from 'types'

const DetailLesson = () => {
    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false)
    const [lesson, setLesson] = useState<IBooking>(null)

    const getDetailLesson = (id) => {
        setLoading(true)
        BookingAPI.getDetailLesson(id)
            .then((res) => {
                setLesson(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        const { id } = router.query
        if (id) {
            getDetailLesson(id)
        }
    }, [router.query])

    const refetchData = useCallback(() => {
        const { id } = router.query
        if (id) {
            getDetailLesson(id)
        }
    }, [router.query])

    if (loading) {
        return <Spin spinning={loading} />
    }

    return (
        <Row gutter={[20, 10]}>
            <Col span={18}>
                <LeftBlock data={lesson} />
            </Col>
            <Col span={6}>
                <RightBlock data={lesson} refetchData={refetchData} />
            </Col>
        </Row>
    )
}

export default DetailLesson
