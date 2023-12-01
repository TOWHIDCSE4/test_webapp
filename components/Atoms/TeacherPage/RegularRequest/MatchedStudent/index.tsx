import { useEffect, FC, useState } from 'react'
import { Table, Card } from 'antd'
import UserAPI from 'api/UserAPI'
import _ from 'lodash'
import { IRegularCalendar } from 'types'
import {
    formatTimestamp,
    getTimestampInWeekToLocal
} from 'utils/datetime-utils'
import { getTranslateText } from 'utils/translate-utils'
import cn from 'classnames'
import { Logger } from 'utils/logger'
import styles from './MatchedStudent.module.scss'

const MatchedStudent: FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [pageSize, setPageSize] = useState<number>(10)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [regularCalendars, setRegularCalendars] = useState<
        IRegularCalendar[]
    >([])

    const getAllRegularCalendar = (query?: {
        page_size?: number
        page_number?: number
    }) => {
        setLoading(true)
        UserAPI.getRegularCalendars({
            page_number: query.page_number,
            page_size: query.page_size
        })
            .then((res) => {
                const diff = _.sortBy(res.data, [
                    'student_id',
                    'course_id',
                    'regular_start_time'
                ])

                const arr = []

                const temp = diff.map((cur, idx) => {
                    const index = arr.findIndex(
                        (i) => i.student_id === cur.student_id
                    )
                    if (index > -1) {
                        cur.index = index
                    } else {
                        cur.index = arr.length

                        arr.push(cur)
                    }

                    return cur
                })
                setRegularCalendars(temp)

                if (res.pagination && res.pagination.total >= 0) {
                    setTotal(res.pagination.total)
                }
            })
            .catch((err) => {
                Logger.error(err)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getAllRegularCalendar({
            page_size: pageSize,
            page_number: pageNumber
        })
    }, [])

    const handleChangePagination = (_pageNumber, _pageSize) => {
        if (pageSize !== _pageSize) {
            setPageSize(_pageSize)
            getAllRegularCalendar({
                page_number: pageNumber,
                page_size: _pageSize
            })
        } else if (pageNumber !== _pageNumber) {
            setPageNumber(_pageNumber)
            getAllRegularCalendar({
                page_number: _pageNumber,
                page_size: pageSize
            })
        }
    }

    const columns: any = [
        {
            title: getTranslateText('table.header.stt'),
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 80,
            render: (text) => text + 1,
            onCell: (record, index) => {
                const _index = _.findIndex(regularCalendars, {
                    student_id: record.student_id
                })
                if (index === _index) {
                    return {
                        rowSpan: regularCalendars.filter(
                            (x) => x.student_id === record.student_id
                        ).length
                    }
                }
                return { rowSpan: 0 }
            }
        },
        {
            title: getTranslateText('booking.student'),
            dataIndex: 'student',
            key: 'student',
            align: 'center',
            render: (text) => text && `${text.full_name}`,
            onCell: (record, index) => {
                const _index = _.findIndex(regularCalendars, {
                    student_id: record.student_id
                })
                if (index === _index) {
                    return {
                        rowSpan: regularCalendars.filter(
                            (x) => x.student_id === record.student_id
                        ).length
                    }
                }
                return { rowSpan: 0 }
            }
        },
        {
            title: getTranslateText('student.booking.course'),
            dataIndex: 'course',
            key: 'course',
            align: 'center',
            render: (text) => text && text.name
            // onCell: (record, index) => {
            //     const _index = _.findIndex(regularCalendars, {
            //         course_id: record.course_id
            //     })
            //     if (index === _index) {
            //         return {
            //             rowSpan: regularCalendars.filter(
            //                 (x) => x.course_id === record.course_id
            //             ).length
            //         }
            //     }
            //     return { rowSpan: 0 }
            // }
        },
        {
            title: getTranslateText('regular_time'),
            dataIndex: 'regular_start_time',
            key: 'regular_start_time',
            align: 'center',
            render: (text) => {
                const convertToLocal = getTimestampInWeekToLocal(text)
                return formatTimestamp(convertToLocal)
            }
        }
    ]

    return (
        <Card title={getTranslateText('regular_request.tabs.matched_student')}>
            <div className={cn('table-wrapper', styles.table)}>
                <Table
                    bordered
                    dataSource={regularCalendars}
                    columns={columns}
                    loading={loading}
                    pagination={{
                        defaultCurrent: pageNumber,
                        pageSize,
                        total,
                        onChange: handleChangePagination
                    }}
                    rowKey={(record) => record?.id}
                    scroll={{
                        x: 500,
                        y: 768
                    }}
                    sticky
                />
            </div>
        </Card>
    )
}

export default MatchedStudent
