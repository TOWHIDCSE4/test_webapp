/* eslint-disable react/no-danger */
import { Card, Space, Button, Table, Tag, Select, Popover, Modal } from 'antd'
import { useEffect, FC, useCallback, useState } from 'react'
import _ from 'lodash'
import { getTranslateText } from 'utils/translate-utils'
import { ColumnsType } from 'antd/lib/table'
import TeacherAPI from 'api/TeacherAPI'
import moment from 'moment'
import { FULL_DATE_FORMAT } from 'const'
import { notify } from 'contexts/Notification'

type Props = {
    type?: number
}

const TeacherReferral: FC<Props> = ({ type }) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)

    const fetchData = (query: { page_size?: number; page_number?: number }) => {
        setLoading(true)
        TeacherAPI.getALlReferredTeachers(query).then((res) => {
            setData(res.data)
            setTotal(res.pagination.total)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData({ page_size: pageSize, page_number: pageNumber })
    }, [])

    const handleChangePagination = useCallback(
        (_pageNumber, _pageSize) => {
            if (_pageNumber !== pageNumber) {
                setPageNumber(_pageNumber)
                fetchData({
                    page_size: pageSize,
                    page_number: _pageNumber
                })
            }
            if (_pageSize !== pageSize) {
                setPageSize(_pageSize)
                fetchData({
                    page_size: _pageSize,
                    page_number: pageNumber
                })
            }
        },
        [pageNumber, pageSize]
    )

    const columns: ColumnsType<any> = [
        {
            title: getTranslateText('table.header.stt'),
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: '5%',
            align: 'center',
            render: (text, record, index) => index + 1
        },
        {
            title: getTranslateText('table.header.teacher'),
            dataIndex: 'user_info',
            key: 'user_info',
            fixed: 'left',
            width: '10%',
            align: 'center',
            render: (text) => text?.full_name
        },
        {
            title: getTranslateText('table.header.email'),
            dataIndex: 'user_info',
            key: 'user_info',
            fixed: 'left',
            width: '10%',
            align: 'center',
            render: (text) => text?.email
        },
        {
            title: getTranslateText('table.header.mobile'),
            dataIndex: 'user_info',
            key: 'user_info',
            fixed: 'left',
            width: '10%',
            align: 'center',
            render: (text) => text?.phone_number
        },
        {
            title: getTranslateText('table.header.date_referral'),
            dataIndex: 'ref_by_teacher',
            key: 'ref_by_teacher',
            fixed: 'left',
            width: '10%',
            align: 'center',
            render: (text) => moment(text?.ref_date).format(FULL_DATE_FORMAT)
        },
        {
            title: getTranslateText('table.header.launch_date'),
            dataIndex: 'first_booking',
            key: 'first_booking',
            fixed: 'left',
            width: '10%',
            align: 'center',
            render: (text) =>
                text ? moment(text).format(FULL_DATE_FORMAT) : ''
        },
        {
            title: getTranslateText('table.header.CV'),
            dataIndex: 'cv',
            key: 'cv',
            fixed: 'left',
            width: '10%',
            align: 'center',
            render: (text) =>
                text ? (
                    <a href={text} target='_blank' rel='noreferrer'>
                        <Button size='small' type='primary'>
                            View
                        </Button>
                    </a>
                ) : null
        }
    ]
    return (
        <>
            <Space direction='vertical' style={{ width: '100%' }}>
                <Card
                    title={getTranslateText('teacher.sidebar.teacher_referral')}
                >
                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{
                            defaultCurrent: pageNumber,
                            current: pageNumber,
                            pageSize,
                            total,
                            onChange: handleChangePagination
                        }}
                        rowKey={(record) => record.id}
                        loading={loading}
                        scroll={{
                            x: 500,
                            y: 768
                        }}
                        bordered
                    />
                </Card>
            </Space>
        </>
    )
}

export default TeacherReferral
