import { useCallback, useEffect, useState } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import { Spin, Pagination, Empty, Row, Col, Tabs } from 'antd'
import _ from 'lodash'
import HomeworkAPI from 'api/HomeworkAPI'
import { notify } from 'contexts/Notification'
import { IBooking } from 'types'
import QuizAPI from 'api/QuizAPI'
import { EnumQuizSessionType } from 'const/quiz'
import { EnumHomeworkType } from 'const/common'
import BlockHeader from '../BlockHeader'
import HomeWorkCard from './HomeWorkCard'

const { TabPane } = Tabs

const HomeWork = () => {
    const [loading, setLoading] = useState(false)
    const [homeworks, setHomeWorks] = useState<IBooking[]>([])
    const [total, setTotal] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(9)
    const [isShowSelfStudyV1, setShowSelfStudyV1] = useState(true)
    const [data, setData] = useState([])
    const [type, setType] = useState(EnumHomeworkType.v1)

    const getHomeworks = (query: {
        page_size: number
        page_number: number
        type: string
    }) => {
        setLoading(true)
        HomeworkAPI.getHomeworks(query)
            .then((res) => {
                setHomeWorks(res.data)
                if (res.pagination && res.pagination.total > 0) {
                    setTotal(res.pagination.total)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    const getHistoryDoHomework = (query?: {}) => {
        HomeworkAPI.checkHistoryHomeworkV1(query)
            .then((res) => {
                if (res.data && res.data[0]) {
                    setShowSelfStudyV1(true)
                    getHomeworks({
                        page_size: pageSize,
                        page_number: pageNumber,
                        type: EnumHomeworkType.v1
                    })
                } else {
                    setShowSelfStudyV1(false)
                    setType(EnumHomeworkType.v2)
                    getHomeworks({
                        page_size: pageSize,
                        page_number: pageNumber,
                        type: EnumHomeworkType.v2
                    })
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    useEffect(() => {
        getHistoryDoHomework()
    }, [])

    const handleChangePagination = (_pageNumber, _pageSize) => {
        if (_pageSize !== pageSize) {
            setPageSize(_pageSize)
        }
        if (_pageNumber !== pageNumber) {
            setPageNumber(_pageNumber)
            getHomeworks({
                page_size: _pageSize,
                page_number: _pageNumber,
                type
            })
        }
    }

    const onChangeTab = useCallback(
        (key) => {
            setData([])
            setPageNumber(1)
            // setPageSize(10)
            setType(key)
            setTotal(0)
            getHomeworks({
                page_size: pageSize,
                page_number: 1,
                type: key
            })
        },
        [type]
    )

    const renderTeacherCard = () => {
        if (_.isEmpty(homeworks)) {
            return <Empty style={{ margin: '20px auto' }} />
        }

        return homeworks.map((item, index) => (
            <Col key={index} className='mb-3' span={8}>
                <HomeWorkCard key={index} data={item} type={type} />
            </Col>
        ))
    }

    return (
        <>
            {/* <BlockHeader title={getTranslateText('homework')} /> */}
            <Tabs
                type='card'
                defaultActiveKey={type}
                onChange={onChangeTab}
                tabBarStyle={{ marginBottom: '24px' }}
            >
                {isShowSelfStudyV1 && (
                    <TabPane
                        tab={
                            <strong>
                                {getTranslateText('homework.self_study_v1')}
                            </strong>
                        }
                        key={EnumHomeworkType.v1}
                    >
                        {/* <div className='mb-3'>
                        <TeacherFilter onFilter={handleFilter} filter={filter} />
                    </div> */}
                        <div
                            style={{
                                color: '#FF4D4F',
                                fontSize: '13px',
                                fontStyle: 'italic',
                                marginTop: '-10px',
                                marginBottom: '10px',
                                fontWeight: 600
                            }}
                        >
                            Điểm bài tập chỉ tính lần nộp bài đầu tiên trong
                            vòng 72h từ lúc kết thúc lớp học.
                        </div>
                        {loading ? (
                            <div className='mt-3 d-flex justify-content-center'>
                                <Spin spinning={loading} size='large' />
                            </div>
                        ) : (
                            <Row gutter={[20, 20]}>{renderTeacherCard()}</Row>
                        )}

                        {!loading && total > 0 && (
                            <div className='mb-3 d-flex justify-content-end'>
                                <Pagination
                                    defaultCurrent={pageNumber}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={handleChangePagination}
                                />
                            </div>
                        )}
                    </TabPane>
                )}
                <TabPane
                    tab={
                        <strong>
                            {getTranslateText('homework.self_study_v2')}
                        </strong>
                    }
                    key={EnumHomeworkType.v2}
                >
                    <div
                        style={{
                            color: '#FF4D4F',
                            fontSize: '13px',
                            fontStyle: 'italic',
                            marginTop: '-10px',
                            marginBottom: '10px',
                            fontWeight: 600
                        }}
                    >
                        Điểm bài tập chỉ tính lần nộp bài đầu tiên trong vòng
                        72h từ lúc kết thúc lớp học.
                    </div>
                    {loading ? (
                        <div className='mt-3 d-flex justify-content-center'>
                            <Spin spinning={loading} size='large' />
                        </div>
                    ) : (
                        <Row gutter={[20, 20]}>{renderTeacherCard()}</Row>
                    )}

                    {!loading && total > 0 && (
                        <div className='mb-3 d-flex justify-content-end'>
                            <Pagination
                                defaultCurrent={pageNumber}
                                pageSize={pageSize}
                                total={total}
                                onChange={handleChangePagination}
                            />
                        </div>
                    )}
                </TabPane>
            </Tabs>
        </>
    )
}
export default HomeWork
