/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/style-prop-object */
/* eslint-disable new-cap */
import { Card, Table, Popover } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import ScheduledMemoAPI from 'api/ScheduledMemoAPI'
import { notify } from 'contexts/Notification'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { EnumScheduledMemoType, IScheduledMemo } from 'types'
import { getTranslateText } from 'utils/translate-utils'
import ViewReport from './modal/ViewReport'

const AllSummary = () => {
    const [loading, setLoading] = useState(false)
    const [monthMemo, setMonthMemo] = useState([])
    const [courseMemo, setCourseMemo] = useState([])
    const [visibleModal, setVisibleModal] = useState(false)
    const [reportType, setReportType] = useState<EnumScheduledMemoType>()
    const [selectedItem, setSelectedItem] = useState<IScheduledMemo>()
    const toggleModal = useCallback(
        (val: boolean, type?: EnumScheduledMemoType, item?: IScheduledMemo) => {
            setVisibleModal(val)
            if (type) {
                setReportType(type)
            }
            if (item) {
                setSelectedItem(item)
            }
        },
        [visibleModal]
    )
    const fetchScheduledMemo = (type: EnumScheduledMemoType) => {
        setLoading(true)
        ScheduledMemoAPI.getScheduledMemos({
            type,
            page_number: 1,
            page_size: 20
        })
            .then((res) => {
                if (type === EnumScheduledMemoType.MONTHLY_MEMO) {
                    setMonthMemo(_.sortBy(res.data, ['year', 'month']))
                } else {
                    setCourseMemo(res.data)
                }
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchScheduledMemo(EnumScheduledMemoType.MONTHLY_MEMO)
        fetchScheduledMemo(EnumScheduledMemoType.COURSE_MEMO)
    }, [])

    const columns: ColumnsType<IScheduledMemo> = [
        {
            title: getTranslateText('common.time'),
            dataIndex: 'time',
            key: 'time',
            width: 100,
            align: 'center',
            fixed: 'left',
            render: (text, record) => {
                if (record.type === EnumScheduledMemoType.MONTHLY_MEMO)
                    return `${record.month}-${record.year}`
            }
        },
        {
            title: getTranslateText('table.header.report_type'),
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: 200,
            fixed: 'left',
            render: (text, record) => (
                <div>
                    {_.startCase(_.get(EnumScheduledMemoType, text))}
                    {text === EnumScheduledMemoType.COURSE_MEMO && (
                        <p
                            style={{
                                fontSize: '12px',
                                marginBottom: 0,
                                color: '#076fd6'
                            }}
                        >
                            {record?.course?.name}
                        </p>
                    )}
                </div>
            )
        },
        {
            title: getTranslateText('table.header.registered_class'),
            dataIndex: 'registered_class',
            key: 'registered_class',
            align: 'center',
            width: 150
        },
        {
            title: getTranslateText('table.header.completed_class'),
            dataIndex: 'completed_class',
            key: 'completed_class',
            align: 'center',
            width: 150
        },
        {
            title: getTranslateText('table.header.attitude'),
            dataIndex: ['attitude', 'point'],
            key: 'attitude',
            align: 'center',
            width: 120
        },
        {
            title: getTranslateText('table.header.attendance'),
            dataIndex: ['attendance', 'point'],
            align: 'center',
            key: 'attendance',
            width: 120
        },
        {
            title: getTranslateText('table.header.homework'),
            dataIndex: ['homework', 'point'],
            align: 'center',
            key: 'homework',
            width: 120
        },
        {
            title: getTranslateText('table.header.exam_result'),
            align: 'center',
            children: [
                {
                    title: getTranslateText('table.header.listening'),
                    dataIndex: 'listening',
                    key: 'listening',
                    align: 'center',
                    width: 100
                },
                {
                    title: getTranslateText('table.header.speaking'),
                    dataIndex: 'speaking',
                    key: 'speaking',
                    align: 'center',
                    width: 100
                },
                {
                    title: getTranslateText('table.header.reading'),
                    dataIndex: 'reading',
                    key: 'reading',
                    align: 'center',
                    width: 100
                },
                {
                    title: getTranslateText('table.header.writing'),
                    dataIndex: 'writing',
                    key: 'writing',
                    align: 'center',
                    width: 100
                }
            ]
        },
        {
            title: getTranslateText('table.header.avg_monthly'),
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 100
        },
        {
            title: getTranslateText('table.header.comment'),
            dataIndex: 'teacher_note',
            key: 'teacher_note',
            align: 'center',
            width: 200,
            render: (text) => (
                <Popover content={<div style={{ width: '500px' }}>{text}</div>}>
                    {text && text.substring(0, 50)}
                </Popover>
            )
        },
        {
            title: getTranslateText('table.header.study_report'),
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: 150,
            fixed: 'right',
            render: (text, record) => {
                if (text === EnumScheduledMemoType.MONTHLY_MEMO)
                    return (
                        <a
                            style={{
                                fontSize: '12px',
                                marginBottom: 0,
                                color: '#076fd6'
                            }}
                            onClick={() =>
                                toggleModal(
                                    true,
                                    EnumScheduledMemoType.MONTHLY_MEMO,
                                    record
                                )
                            }
                        >
                            {getTranslateText('study_summary.monthly_report')}
                        </a>
                    )
                return (
                    <a
                        style={{
                            fontSize: '12px',
                            marginBottom: 0,
                            color: '#076fd6'
                        }}
                        onClick={() =>
                            toggleModal(
                                true,
                                EnumScheduledMemoType.COURSE_MEMO,
                                record
                            )
                        }
                    >
                        {getTranslateText('study_summary.course_report')}
                    </a>
                )
            }
        }
    ]

    return (
        <Card title={null} loading={loading}>
            <Table
                columns={columns}
                dataSource={[...monthMemo, ...courseMemo]}
                bordered
                scroll={{ x: 500, y: 768 }}
            />
            <ViewReport
                visible={visibleModal}
                toggleModal={toggleModal}
                type={reportType}
                data={selectedItem}
            />
        </Card>
    )
}

export default AllSummary
