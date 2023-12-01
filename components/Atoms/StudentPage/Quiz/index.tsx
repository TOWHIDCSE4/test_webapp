import { useCallback, useEffect, useState } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import { Tabs, Button, Table, Tag } from 'antd'
import { useRouter } from 'next/router'
import QuizAPI from 'api/QuizAPINEW'
import _ from 'lodash'
import moment from 'moment'
import { notify } from 'contexts/Notification'
import { IExam } from 'types'
import { ColumnsType } from 'antd/lib/table'
import { BOOKING_STATUS } from 'const'

enum EnumQuizLevel {
    ALL_LEVEL = -1,
    BEGINNER = 1,
    ELEMENTARY = 2,
    INTERMEDIATE = 3,
    UPPER_INTER = 4,
    ADVANCED = 4,
    EXPERT = 5
}

enum EnumQuizType {
    HOMEWORK = 1,
    TEST = 2,
    MIDTERM = 3,
    FINAL = 4
}

const { TabPane } = Tabs

const Quiz = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [page_number, setPageNumber] = useState(1)
    const [page_size, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const router = useRouter()
    const [type, setType] = useState('TEST')

    const getTestExam = useCallback(
        async (pageNum, pageSize, mType) => {
            setLoading(true)
            QuizAPI.getQuizzes({
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

    const handleDoExam = useCallback((quiz) => {
        if (quiz) {
            router.push(`/student/quiz/${quiz.id}`)
        }
    }, [])

    const onChangeTab = useCallback(
        (key) => {
            setData([])
            setPageNumber(1)
            setPageSize(10)
            setType(key)
            getTestExam(page_number, page_size, key)
        },
        [type]
    )

    const columns: ColumnsType = [
        {
            title: getTranslateText('quiz.exam.name'),
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => <span>{text}</span>
        },
        {
            title: 'Instructions',
            dataIndex: 'instruction',
            key: 'instruction',
            render: (text: any, record: any) => <span>{text}</span>
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            render: (text: any, record: any) =>
                _.startCase(_.findKey(EnumQuizLevel, (o) => o === text))
        },
        {
            title: 'Total Questions',
            dataIndex: 'questions',
            key: 'questions',
            align: 'center',
            render: (text: any, record: any) => text?.length
        },
        {
            title: getTranslateText('quiz.exam.time'),
            dataIndex: 'time_limit',
            key: 'time_limit',
            align: 'center',
            render: (text: any, record: any) => (
                <span>{_.toInteger(text / 60)}</span>
            )
        },
        {
            title: 'Passed Score',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (text: any, record: any) =>
                `${record?.passed_minimum}/${record?.score}`
        },
        // {
        //     title: getTranslateText('quiz.exam.last_score'),
        //     dataIndex: 'quiz',
        //     key: 'quiz',
        //     align: 'center',
        //     render: (text: any, record: any) => (
        //         <span>
        //             {record.user_score}/{text?.score}
        //         </span>
        //     )
        // },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (text: any, record: any) => {
                if (record.booking) {
                    if (record?.booking?.status === BOOKING_STATUS.TEACHING) {
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
                    if (record?.booking?.calendar?.start_time >= moment()) {
                        return `${getTranslateText('quiz.exam.start')} ${moment(
                            record?.booking?.calendar?.start_time
                        ).fromNow()}`
                    }
                    return <span>Finished</span>
                }

                return (
                    <Button type='primary' onClick={() => handleDoExam(record)}>
                        {record?.doing
                            ? getTranslateText('quiz.exam.continue')
                            : getTranslateText('quiz.exam.start')}
                    </Button>
                )
            }
        }
    ]

    const columnsExam = [...columns]
    columnsExam.splice(3, 0, {
        title: getTranslateText('student.booking.unit'),
        dataIndex: 'unit',
        key: 'unit',
        render: (text: any, record: any) => <span>{text?.name}</span>
    })

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
                defaultActiveKey='Quiz'
                onChange={onChangeTab}
                tabBarStyle={{ marginBottom: '24px' }}
            >
                <TabPane tab={_.startCase(getTranslateText('quiz'))} key='Quiz'>
                    {renderTestExam()}
                </TabPane>
                {/* <TabPane tab={getTranslateText('examination')} key='EXAM'>
                    {renderExam()}
                </TabPane> */}
            </Tabs>
        </>
    )
}
export default Quiz
