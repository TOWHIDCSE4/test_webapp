import { useCallback, useEffect, useState } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import { Tabs, Button, Table, Tag } from 'antd'
import { useRouter } from 'next/router'
import ExamAPI from 'api/ExamAPI'
import QuizAPI from 'api/QuizAPI'
import _ from 'lodash'
import moment from 'moment'
import { notify } from 'contexts/Notification'
import { IExam } from 'types'
import { ColumnsType } from 'antd/lib/table'
import { BOOKING_STATUS, EnumExamType } from 'const'

const { TabPane } = Tabs

const Examination = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [page_number, setPageNumber] = useState(1)
    const [page_size, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const router = useRouter()
    const [type, setType] = useState('TEST')

    const getTestExam = useCallback(
        async (pageNum, pageSize, mType) => {
            setLoading(true)
            QuizAPI.getExams({
                page_number: pageNum,
                page_size: pageSize,
                type: mType
            })
                .then((res) => {
                    setData(res.data)
                    if (res.pagination?.total > 0) {
                        setTotal(res.pagination.total)
                    }
                })
                .catch((err) => {
                    notify('error', err.message)
                })
                .finally(() => setLoading(false))
        },
        [page_number, page_size, type]
    )

    useEffect(() => {
        getTestExam(page_number, page_size, type)
    }, [])

    const handleChangePagination = useCallback(
        (pageNumber, pageSize) => {
            setPageNumber(pageNumber)
            setPageSize(pageSize)
            getTestExam(pageNumber, pageSize, type)
        },
        [page_number, page_size, type]
    )

    const handleDoExam = useCallback((exam) => {
        if (exam) {
            router.push(`/student/${type.toLowerCase()}/${exam.id}`)
        }
    }, [])

    const onChangeTab = useCallback(
        (key) => {
            setData([])
            // setPageNumber(1)
            // setPageSize(10)
            setType(key)
            getTestExam(page_number, page_size, key)
        },
        [type]
    )

    const columns: ColumnsType = [
        // {
        //     title: getTranslateText('common.status'),
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (text, record) => (
        //         <span>
        //             {text === 1 ? (
        //                 <Tag color='#87d068'>PASSED</Tag>
        //             ) : text === 2 ? (
        //                 <Tag color='#f50'>FAILED</Tag>
        //             ) : text === 3 ? (
        //                 <Tag color='#108ee9'>DOING</Tag>
        //             ) : (
        //                 <Tag color='#ffc53d'>NOT DONE</Tag>
        //             )}
        //         </span>
        //     )
        // },
        {
            title: getTranslateText('student.booking.course'),
            dataIndex: 'course',
            key: 'course',
            render: (text: any, record: any) => <span>{text?.name}</span>
        },
        {
            title: getTranslateText('quiz.exam.name'),
            dataIndex: 'unit',
            key: 'unit',
            render: (text: any, record: any) => <span>{text?.exam?.name}</span>
        },
        {
            title: getTranslateText('quiz.exam.time'),
            dataIndex: 'unit',
            key: 'unit',
            align: 'center',
            render: (text: any, record: any) => (
                <span>
                    {(text?.exam?.time_limit / 60)
                        .toFixed(2)
                        .replace(/\.00$/, '')}
                </span>
            )
        },
        {
            title: getTranslateText('quiz.exam.type'),
            dataIndex: 'unit',
            key: 'unit',
            align: 'center',
            render: (text: any, record: any) => (
                <span>{EnumExamType[text?.exam_type]}</span>
            )
        },
        {
            title: getTranslateText('quiz.exam.last_score'),
            dataIndex: 'quiz',
            key: 'quiz',
            align: 'center',
            render: (text: any, record: any) => (
                <span>
                    {record.user_score}/{text?.score}
                </span>
            )
        },
        {
            title: getTranslateText('common.action'),
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (text: any, record: any) => {
                if (type === 'TEST') {
                    return (
                        <Button
                            type='primary'
                            onClick={() => handleDoExam(record)}
                        >
                            {record?.doing
                                ? getTranslateText('quiz.exam.continue')
                                : getTranslateText('quiz.exam.start')}
                        </Button>
                    )
                }
                if (record?.status === BOOKING_STATUS.TEACHING) {
                    return (
                        <Button
                            type='primary'
                            onClick={() => handleDoExam(record)}
                        >
                            {record?.doing
                                ? getTranslateText('quiz.exam.continue')
                                : getTranslateText('quiz.exam.start')}
                        </Button>
                    )
                }
                if (record?.calendar?.start_time >= moment()) {
                    return `${getTranslateText('quiz.exam.start')} ${moment(
                        record?.calendar?.start_time
                    ).fromNow()}`
                }
                return <span>{getTranslateText('done')}</span>

                // return (
                //     <Button type='primary' onClick={() => handleDoExam(record)}>
                //         {record?.doing
                //             ? getTranslateText('quiz.exam.continue')
                //             : getTranslateText('quiz.exam.start')}
                //     </Button>
                // )
            }
        }
    ]

    const columnsExam = [...columns]
    columnsExam.splice(
        3,
        0,
        {
            title: getTranslateText('student.booking.unit'),
            dataIndex: 'unit',
            key: 'unit',
            render: (text: any, record: any) => <span>{text?.name}</span>
        },
        {
            title: getTranslateText('quiz.start_time'),
            dataIndex: 'unit',
            key: 'unit',
            render: (text: any, record: any) => (
                <span>
                    {moment(record?.calendar?.start_time).format(
                        'HH:mm DD-MM-YYYY'
                    )}
                </span>
            )
        }
    )

    function renderTestExam() {
        return (
            <>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record: IExam) => record._id + Math.random()}
                    loading={loading}
                    pagination={{
                        defaultCurrent: page_number,
                        pageSize: page_size,
                        total,
                        onChange: handleChangePagination
                    }}
                    bordered
                    sticky
                />
            </>
        )
    }

    function renderExam() {
        return (
            <>
                <Table
                    columns={columnsExam}
                    dataSource={data}
                    rowKey={(record: IExam) => record._id + Math.random()}
                    loading={loading}
                    pagination={{
                        defaultCurrent: page_number,
                        pageSize: page_size,
                        total,
                        onChange: handleChangePagination
                    }}
                    bordered
                    sticky
                />
            </>
        )
    }

    return (
        <>
            <Tabs
                type='card'
                defaultActiveKey='TEST'
                onChange={onChangeTab}
                tabBarStyle={{ marginBottom: '24px' }}
            >
                <TabPane tab={_.startCase(getTranslateText('test'))} key='TEST'>
                    {renderTestExam()}
                </TabPane>
                <TabPane tab={getTranslateText('examination')} key='EXAM'>
                    {renderExam()}
                </TabPane>
            </Tabs>
        </>
    )
}
export default Examination
