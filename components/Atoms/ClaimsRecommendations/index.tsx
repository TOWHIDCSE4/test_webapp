/* eslint-disable react/no-danger */
import { Card, Space, Button, Table, Tag, Select, Popover, Modal } from 'antd'
import { useEffect, FC, useCallback, useState } from 'react'
import _ from 'lodash'
import { getTranslateText } from 'utils/translate-utils'
import { ColumnsType } from 'antd/lib/table'
import {
    EnumRecommendSection,
    EnumRecommendStatus,
    EnumReportType,
    EnumTeacherAbsentRequestStatus
} from 'types'
import moment from 'moment'
import { FULL_DATE_FORMAT } from 'const'
import { notify } from 'contexts/Notification'
import ClaimsAndReportModal from 'components/Atoms/ClaimsAndReportModal'
import ReportAPI from 'api/ReportAPI'
import cn from 'classnames'
import { useAuth } from 'contexts/Auth'
import Reports from './reports'
import styles from './ClaimsRecommendations.module.scss'
import DetailHtmlModal from './DetailHtmlModal'

type Props = {
    type?: number
}

const { Option } = Select
const ClaimsRecommendations: FC<Props> = ({ type }) => {
    const { teacherInfo } = useAuth()
    const [loading, setLoading] = useState(false)
    const [visibleModal, setVisibleModal] = useState(false)
    const [claimsAndReports, setClaimsAndReports] = useState([])
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [detailModal, setDetailModal] = useState(false)
    const [detailData, setDetailData] = useState([])

    const toggleModal = useCallback(
        (val: boolean) => {
            setVisibleModal(val)
        },
        [visibleModal]
    )
    const toggleDetailModal = useCallback(
        (val: boolean) => {
            setDetailModal(val)
        },
        [detailModal]
    )

    const fetchData = (query: {
        page_size?: number
        page_number?: number
        type?: EnumReportType
    }) => {
        setLoading(true)
        ReportAPI.getReports(query).then((res) => {
            setClaimsAndReports(res.data)
            setTotal(res.pagination.total)
            setLoading(false)
        })
    }
    const closeReport = useCallback((report) => {
        ReportAPI.updateReport({
            recommend_status: 5,
            id: report.id
        }).then(() => {
            notify('success', getTranslateText('claims.close_claim'))
            fetchData({ type: EnumReportType.RECOMMEND })
        })
    }, [])

    const reOpenReport = useCallback((report) => {
        ReportAPI.updateReport({
            recommend_status: 1,
            id: report.id
        }).then(() => {
            notify('success', getTranslateText('claims.desc'))
            fetchData({ type: EnumReportType.RECOMMEND })
        })
    }, [])

    const refetchData = () => {
        fetchData({ type: EnumReportType.RECOMMEND })
    }

    useEffect(() => {
        fetchData({ type: EnumReportType.RECOMMEND })
    }, [])

    const handleChangePagination = useCallback(
        (_pageNumber, _pageSize) => {
            if (_pageNumber !== pageNumber) {
                setPageNumber(_pageNumber)
                fetchData({
                    page_size: pageSize,
                    page_number: _pageNumber,
                    type: EnumReportType.RECOMMEND
                })
            }
            if (_pageSize !== pageSize) {
                setPageSize(_pageSize)
                fetchData({
                    page_size: _pageSize,
                    page_number: pageNumber,
                    type: EnumReportType.RECOMMEND
                })
            }
        },
        [pageNumber, pageSize]
    )

    const colorStatus = (_status: number) => {
        switch (_status) {
            case EnumRecommendStatus.COMPLETED:
                return 'success'
            case EnumRecommendStatus.PENDING:
                return 'warning'
            case EnumRecommendStatus.CANCELED:
                return 'error'
            case EnumRecommendStatus.PROCESSING:
                return 'processing'
            case EnumRecommendStatus.CLOSED:
                return 'grey'
            default:
                break
        }
    }

    const columns: ColumnsType<any> = [
        {
            title: getTranslateText('table.header.stt'),
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: 60,
            align: 'center',
            render: (text, record, index) => index + 1
        },
        {
            title: getTranslateText('table.header.created_time'),
            dataIndex: 'created_time',
            key: 'created_time',
            align: 'center',
            width: 180,
            render: (text) => moment(text).format(FULL_DATE_FORMAT)
        },
        {
            title: getTranslateText('table.header.section'),
            dataIndex: 'recommend_section',
            key: 'recommend_section',
            align: 'center',
            width: 250,
            render: (text: any, record: any) =>
                _.startCase(EnumRecommendSection[text])
        },
        // {
        //     title: getTranslateText('table.header.content'),
        //     dataIndex: 'recommend_content',
        //     key: 'recommend_content',
        //     align: 'center',
        //     width: 100,
        //     className: cn(styles['content-html']),
        //     render: (val) => (
        //         <Popover
        //             content={
        //                 <div
        //                     dangerouslySetInnerHTML={{ __html: sanitize(val) }}
        //                 />
        //             }
        //         >
        //             <Tag>Preview</Tag>
        //         </Popover>
        //     )
        // },
        // {
        //     title: getTranslateText('table.header.solution'),
        //     dataIndex: 'report_solution',
        //     key: 'report_solution',
        //     align: 'center',
        //     width: 100,
        //     className: cn(styles['content-html']),
        //     render: (val) => (
        //         <Popover
        //             content={
        //                 <div
        //                     dangerouslySetInnerHTML={{ __html: sanitize(val) }}
        //                 />
        //             }
        //         >
        //             <Tag>Preview</Tag>
        //         </Popover>
        //     )
        // },
        {
            title: getTranslateText('table.header.resolve_user'),
            dataIndex: 'resolve_user',
            key: 'resolve_user',
            align: 'center',
            width: 200,
            render: (text, record) => <span>{text?.fullname}</span>
        },
        {
            title: getTranslateText('table.header.in_charge'),
            dataIndex: 'recommend_status',
            key: 'recommend_status',
            align: 'center',
            width: 150,
            render: (text: any, record: any) => (
                <Tag color={colorStatus(text)}>
                    {_.startCase(EnumRecommendStatus[text])}
                </Tag>
            )
        },
        {
            title: getTranslateText('...'),
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 100,
            render: (text, record) => (
                <Button size='small' onClick={() => toggleDetailModal(true)}>
                    {getTranslateText('common.detail')}
                </Button>
            )
        },
        {
            title: getTranslateText('leave_request.action'),
            dataIndex: 'recommend_status',
            key: 'recommend_status',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (text: any, record: any) =>
                text === 1 || text === 2 ? (
                    <Button type='primary' onClick={() => closeReport(record)}>
                        {getTranslateText('common.close')}
                    </Button>
                ) : (
                    <Button
                        type='primary'
                        // color='success'
                        style={{
                            backgroundColor: '#00cc44',
                            borderColor: '#00cc44'
                        }}
                        onClick={() => reOpenReport(record)}
                    >
                        {getTranslateText('claims.reopen')}
                    </Button>
                )
        }
    ]
    return (
        <>
            <Space direction='vertical' style={{ width: '100%' }}>
                <Card title={getTranslateText('claims.title')}>
                    <div className='d-flex justify-content-end'>
                        <Space size={16} className='mb-3' wrap>
                            <Button
                                type='primary'
                                onClick={() => toggleModal(true)}
                            >
                                {getTranslateText('claims.open_claim')}
                            </Button>
                        </Space>
                    </div>
                    <Table
                        onRow={(record) => ({
                            onClick: () =>
                                setDetailData([
                                    {
                                        title: 'table.header.content',
                                        content: record.recommend_content
                                    },
                                    {
                                        title: 'table.header.solution',
                                        content: record.report_solution
                                    }
                                ])
                        })}
                        dataSource={claimsAndReports}
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
                    <ClaimsAndReportModal
                        type={type}
                        visible={visibleModal}
                        toggleModal={toggleModal}
                        refetchData={refetchData}
                    />
                    <DetailHtmlModal
                        visible={detailModal}
                        toggleModal={toggleDetailModal}
                        data={detailData}
                    />
                </Card>
                {type === 2 ? <Reports colorStatus={colorStatus} /> : null}
            </Space>
        </>
    )
}

export default ClaimsRecommendations
