/* eslint-disable react/no-danger */
import { useState, FC, useCallback, useEffect } from 'react'
import {
    Card,
    Table,
    Tag,
    Popover,
    Rate,
    Button,
    Col,
    Row,
    Checkbox
} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { FULL_DATE_FORMAT } from 'const'
import _ from 'lodash'
import moment from 'moment'

import { getTranslateText } from 'utils/translate-utils'
import { EnumRecommendStatus, EnumReportType } from 'types'
import ReportAPI from 'api/ReportAPI'
import EditTextModal from 'components/Atoms/EditTextModal'
import { notify } from 'contexts/Notification'
import DetailHtmlModal from './DetailHtmlModal'

type Props = {
    colorStatus: any
}
const Reports: FC<Props> = ({ colorStatus }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [total, setTotal] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [reports, setReports] = useState([])
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [selectedReport, setSelectedReport] = useState(null)
    const [detailModal, setDetailModal] = useState<boolean>(false)
    const [detailData, setDetailData] = useState([])

    const fetchData = (query?: {
        page_size?: number
        page_number?: number
        type?: EnumReportType
    }) => {
        setLoading(true)
        ReportAPI.getReports(query).then((res) => {
            setReports(res.data)
            setTotal(res.pagination.total)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData({ type: EnumReportType.REPORT })
    }, [])

    const handleChangePagination = useCallback(
        (_pageNumber, _pageSize) => {
            if (_pageNumber !== pageNumber) {
                setPageNumber(_pageNumber)
                fetchData({
                    page_size: pageSize,
                    page_number: _pageNumber,
                    type: EnumReportType.REPORT
                })
            }
            if (_pageSize !== pageSize) {
                setPageSize(_pageSize)
                fetchData({
                    page_size: _pageSize,
                    page_number: pageNumber,
                    type: EnumReportType.REPORT
                })
            }
        },
        [pageNumber, pageSize]
    )

    const toggleModal = useCallback(
        (v) => {
            setVisibleModal(!visibleModal)
            if (v) setSelectedReport(v)
        },
        [visibleModal, selectedReport]
    )

    const toggleDetailModal = useCallback(
        (val: boolean) => {
            setDetailModal(val)
        },
        [detailModal]
    )

    const updateFeedback = useCallback(
        (fb) => {
            ReportAPI.updateReport({
                report_teacher_feedback: fb.str_value,
                id: selectedReport.id
            }).then(() => {
                notify('success', getTranslateText('claims.close_claim'))
                fetchData({ type: EnumReportType.REPORT })
            })
            setVisibleModal(false)
        },
        [visibleModal, selectedReport]
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
            title: getTranslateText('table.header.created_time'),
            dataIndex: 'created_time',
            key: 'created_time',
            width: '10%',
            align: 'center',
            render: (text) => moment(text).format(FULL_DATE_FORMAT)
        },
        {
            title: getTranslateText('claims.booking'),
            dataIndex: 'booking',
            key: 'booking',
            width: '10%',
            align: 'center',
            render: (text) => text?.id
        },
        {
            title: getTranslateText('common.report'),
            dataIndex: 'report_content',
            key: 'report_content',
            width: '30%',
            align: 'center',
            render: (text) => (
                <Popover
                    content={
                        <div style={{ width: '500px' }}>
                            <Row gutter={[48, 24]}>
                                <Col span={12}>
                                    <h6>
                                        <b>Teacher</b>
                                    </h6>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.teacher.teaching_method'
                                            )}
                                            :
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={text?.teacher?.is_late}
                                            />
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col flex='auto'></Col>
                                        <Col flex='0'></Col>
                                    </Row> */}
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.teacher.punctuality'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={
                                                    text?.teacher
                                                        ?.not_enough_time
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.teacher.enthusiasm'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={
                                                    text?.teacher?.teaching
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.teacher.academic_knowledge'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={
                                                    text?.teacher?.bad_attitude
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div>
                                            {getTranslateText(
                                                'rating.report.comment'
                                            )}
                                            :{' '}
                                        </div>
                                        <p>{text?.teacher?.comment}</p>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <h6>
                                        <b>Material</b>
                                    </h6>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.document.bad_document'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={
                                                    text?.document?.bad_document
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.document.easy'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={text?.document?.easy}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.document.hard'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={text?.document?.hard}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col flex='auto'>
                                            {' '}
                                            {getTranslateText(
                                                'rating.report.document.normal'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={text?.document?.normal}
                                            />
                                        </Col>
                                    </Row>
                                    {getTranslateText('rating.report.comment')}:{' '}
                                    <p>{text?.document?.comment}</p>
                                    <br />
                                </Col>
                            </Row>
                            <Row gutter={[48, 24]}>
                                <Col span={12}>
                                    <h6>
                                        <b>Network</b>
                                    </h6>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.network.good'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={text?.network?.good}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.network.bad'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={text?.network?.bad}
                                            />
                                        </Col>
                                    </Row>
                                    {getTranslateText('rating.report.comment')}:{' '}
                                    <p>{text?.network?.comment}</p>
                                    <br />
                                </Col>
                                <Col span={12}>
                                    <h6>
                                        <b>Homework</b>
                                    </h6>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.homework.bad_homework'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={
                                                    text?.homework?.bad_homework
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.homework.easy'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={text?.homework?.easy}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.homework.hard'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={text?.homework?.hard}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col flex='auto'>
                                            {getTranslateText(
                                                'rating.report.homework.normal'
                                            )}
                                        </Col>
                                        <Col flex='0'>
                                            <Checkbox
                                                checked={text?.homework?.normal}
                                            />
                                        </Col>
                                    </Row>
                                    {getTranslateText('rating.report.comment')}
                                    <p>{text?.homework?.comment}</p>
                                    <br />
                                </Col>
                            </Row>
                        </div>
                    }
                >
                    <span>
                        <Rate value={text?.rating} disabled />
                    </span>
                </Popover>
            )
        },
        {
            title: getTranslateText('claims.teacher_feedback'),
            dataIndex: 'report_teacher_feedback',
            key: 'report_teacher_feedback',
            width: '10%',
            align: 'center',
            render: (text, record: any) => (
                <>
                    <Button
                        size='small'
                        onClick={() => {
                            setDetailModal(true)
                            setDetailData([
                                {
                                    title: 'Teacher Feedback',
                                    content: record?.report_teacher_feedback
                                }
                            ])
                        }}
                    >
                        Show
                    </Button>
                    <EditOutlined onClick={() => toggleModal(record)} />
                </>
            )
        },
        {
            title: getTranslateText('claims.admin_solution'),
            dataIndex: 'report_solution',
            key: 'report_solution',
            width: '10%',
            align: 'center',
            render: (text, record) => (
                <Button
                    size='small'
                    onClick={() => {
                        setDetailModal(true)
                        setDetailData([
                            {
                                title: 'table.header.solution',
                                content: text
                            }
                        ])
                    }}
                >
                    Show
                </Button>
            )
        },
        {
            title: getTranslateText('common.status'),
            dataIndex: 'recommend_status',
            key: 'recommend_status',
            width: '10%',
            align: 'center',
            render: (text) => (
                <Tag color={colorStatus(text)}>
                    {_.startCase(EnumRecommendStatus[text])}
                </Tag>
            )
        }
    ]

    return (
        <>
            <Card title={getTranslateText('claims.student_reports')}>
                <Table
                    dataSource={reports}
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
            <EditTextModal
                visible={visibleModal}
                toggleModal={toggleModal}
                title='Edit Teacher Feedback'
                onUpdate={updateFeedback}
                textValue={selectedReport?.report_teacher_feedback}
            />
            <DetailHtmlModal
                visible={detailModal}
                toggleModal={toggleDetailModal}
                data={detailData}
            />
        </>
    )
}

export default Reports
