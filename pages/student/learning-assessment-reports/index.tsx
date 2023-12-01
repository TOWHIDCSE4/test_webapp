import React, { useCallback, useReducer, useEffect } from 'react'
import Layout from 'components/Atoms/StudentPage/Layout'
import OrderAPI from 'api/OrderAPI'
import { Card, Space, Select, Table, Tag, Button, Tabs } from 'antd'
import moment from 'moment'
import { notify } from 'contexts/Notification'
import { getTranslateText } from 'utils/translate-utils'
import { ColumnsType } from 'antd/lib/table'
import { FULL_DATE_FORMAT, POINT_VND_RATE } from 'const'
import { useRouter } from 'next/router'
import _ from 'lodash'
import {
    EnumLAReportStatus,
    EnumLAReportType,
    textLAReportType
} from 'types/ILearningAssessmentReports'
import LearningAssessmentReportAPI from 'api/LearningAssessmentReportAPI'

const { Option } = Select
const { TabPane } = Tabs

export enum EnumTabType {
    DILIGENCE = 1,
    PERIODIC = 2,
    END_TERM = 3
}

const StudyReport = () => {
    const router = useRouter()
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            dataReports: [],
            page_size: 10,
            page_number: 1,
            total: 0,
            status: EnumLAReportStatus.PUBLISHED,
            tab_current: EnumTabType.DILIGENCE
        }
    )

    const getStudyReports = (query: {
        page_size?: number
        page_number?: number
        status: number
    }) => {
        setValues({ isLoading: true })
        let typeReport = EnumLAReportType.DILIGENCE
        if (values.tab_current === EnumTabType.PERIODIC) {
            typeReport = EnumLAReportType.PERIODIC
        } else if (values.tab_current === EnumTabType.END_TERM) {
            typeReport = EnumLAReportType.END_TERM
        }
        const filter: any = {
            page_size: query.page_size,
            page_number: query.page_number,
            status: query.status,
            type: typeReport
        }
        LearningAssessmentReportAPI.getAllReportPublish(filter)
            .then((res) => {
                setValues({ dataReports: res.data, isLoading: false })
                if (res.pagination && res.pagination.total >= 0) {
                    setValues({ total: res.pagination.total })
                }
            })
            .catch((err) => {
                notify('error', err.message)
                setValues({ isLoading: false })
            })
    }

    useEffect(() => {
        getStudyReports({ ...values })
    }, [])

    const onChangeTab = useCallback(
        (key) => {
            values.tab_current = Number(key)
            setValues({ tab_current: Number(key) })
            getStudyReports({ ...values, page_number: 1 })
        },
        [values]
    )

    const handleChangePagination = useCallback(
        (pageNumber, pageSize) => {
            setValues({ page_number: pageNumber, page_size: pageSize })
            getStudyReports({
                page_size: pageSize,
                page_number: pageNumber,
                status: values.status
            })
        },
        [values]
    )

    const columns: ColumnsType<any> = [
        {
            title: `${getTranslateText(
                'student.learning_assessment.report_id'
            )}`,
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 80
        },
        {
            title: `${getTranslateText('student.learning_assessment.date')}`,
            dataIndex: 'time_create',
            key: 'time_create',
            align: 'left',
            width: 140,
            render: (text: any, record: any) =>
                text && moment(new Date(text)).format(FULL_DATE_FORMAT)
        },
        {
            title: `${getTranslateText(
                'student.learning_assessment.report_type'
            )}`,
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: 140,
            render: (text: any, record: any) => {
                if (text === EnumLAReportType.DILIGENCE) {
                    return getTranslateText(textLAReportType.DILIGENCE)
                }
                if (text === EnumLAReportType.PERIODIC) {
                    return getTranslateText(textLAReportType.PERIODIC)
                }
                if (text === EnumLAReportType.OTHER) {
                    return getTranslateText(textLAReportType.OTHER)
                }
            }
        },
        {
            title: `${getTranslateText(
                'student.learning_assessment.duration'
            )}`,
            dataIndex: 'start_time',
            key: 'start_time',
            align: 'center',
            width: 250,
            render: (text: any, record: any) => (
                <>
                    {record &&
                        moment(record.start_time).format(
                            'HH:mm DD/MM/YYYY'
                        )}{' '}
                    -{' '}
                    {record &&
                        moment(record.end_time).format('HH:mm DD/MM/YYYY')}
                </>
            )
        },
        {
            title: `${getTranslateText(
                'student.learning_assessment.number_class'
            )}`,
            dataIndex: 'booking_ids',
            key: 'number_class',
            align: 'center',
            width: 120,
            render: (text, record) => text && text.length
        },
        {
            title: ``,
            dataIndex: 'type',
            key: 'is_show_report',
            align: 'center',
            width: 150,
            render: (text: any, record: any) => {
                if (text) {
                    return (
                        <a
                            href={`${router.pathname}/detail-report/${record.id}`}
                            target='_blank'
                            rel='noreferrer'
                        >
                            <div
                                style={{ color: '#08BF5A' }}
                                className='clickable'
                            >
                                {getTranslateText('common.view_detail')}
                            </div>
                        </a>
                    )
                }
                return ''
            }
        }
    ]

    const columns2: ColumnsType<any> = [
        {
            title: `${getTranslateText(
                'student.learning_assessment.report_id'
            )}`,
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 80
        },
        {
            title: `${getTranslateText('student.learning_assessment.date')}`,
            dataIndex: 'time_create',
            key: 'time_create',
            align: 'left',
            width: 140,
            render: (text: any, record: any) =>
                text && moment(new Date(text)).format(FULL_DATE_FORMAT)
        },
        {
            title: `${getTranslateText(
                'student.learning_assessment.report_type'
            )}`,
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: 140,
            render: (text: any, record: any) => {
                if (text === EnumLAReportType.DILIGENCE) {
                    return getTranslateText(textLAReportType.DILIGENCE)
                }
                if (text === EnumLAReportType.PERIODIC) {
                    return getTranslateText(textLAReportType.PERIODIC)
                }
                if (text === EnumLAReportType.OTHER) {
                    return getTranslateText(textLAReportType.OTHER)
                }
                if (text === EnumLAReportType.END_TERM) {
                    return getTranslateText(textLAReportType.END_TERM)
                }
            }
        },
        {
            title: `${getTranslateText('student.learning_assessment.package')}`,
            dataIndex: 'ordered_package',
            key: 'ordered_package',
            width: 250,
            render: (e) =>
                e ? (
                    <div className='text-truncate'>{e?.package_name}</div>
                ) : (
                    <></>
                )
        },
        {
            title: ``,
            dataIndex: 'type',
            key: 'is_show_report',
            align: 'center',
            width: 150,
            render: (text: any, record: any) => {
                if (text) {
                    return (
                        <a
                            href={`${router.pathname}/detail-report/${record.id}`}
                            target='_blank'
                            rel='noreferrer'
                        >
                            <div
                                style={{ color: '#08BF5A' }}
                                className='clickable'
                            >
                                {getTranslateText('common.view_detail')}
                            </div>
                        </a>
                    )
                }
                return ''
            }
        }
    ]

    const renderTable = (type: any) => (
        <Table
            dataSource={values.dataReports}
            columns={type === EnumTabType.DILIGENCE ? columns : columns2}
            pagination={{
                defaultCurrent: values.page_number,
                pageSize: values.page_size,
                total: values.total,
                onChange: handleChangePagination
            }}
            rowKey={(record) => record.id}
            loading={values.isLoading}
            scroll={{
                x: 500
            }}
        />
    )

    return (
        <Layout>
            <Card title={getTranslateText('student.learning_assessment.title')}>
                {/* <Space
                    size={16}
                    className='mb-4'
                    align='end'
                    direction='horizontal'
                > */}
                {/* <Select
                        placeholder='Choose status'
                        value={values.status}
                        onChange={onChangeStatus}
                        style={{ width: '150px' }}
                    >
                        <Option value='-1'>All</Option>
                        <Option value='active'>Active</Option>
                        <Option value='inactive'>Inactive</Option>
                        <Option value='expired'>Expired</Option>
                        {/* <Option value='finished'>Finished</Option> */}
                {/* </Select> */}
                {/* <ReloadOutlined
                        onClick={refetchData}
                        style={{
                            fontSize: '16px',
                            color: '#08c'
                        }}
                    /> */}
                {/* </Space> */}
                <Tabs
                    defaultActiveKey={`${values.tab_current}`}
                    activeKey={`${values.tab_current}`}
                    type='card'
                    onChange={onChangeTab}
                >
                    <TabPane
                        tab={getTranslateText(
                            'student.learning_assessment.diligence_report'
                        )}
                        key={EnumTabType.DILIGENCE}
                    >
                        {renderTable(EnumTabType.DILIGENCE)}
                    </TabPane>
                    <TabPane
                        tab={getTranslateText(
                            'student.learning_assessment.periodic_report'
                        )}
                        key={EnumTabType.PERIODIC}
                    >
                        {renderTable(EnumTabType.PERIODIC)}
                    </TabPane>
                    <TabPane
                        tab={getTranslateText(
                            'student.learning_assessment.final_report'
                        )}
                        key={EnumTabType.END_TERM}
                    >
                        {renderTable(EnumTabType.END_TERM)}
                    </TabPane>
                </Tabs>
            </Card>
        </Layout>
    )
}

export default StudyReport
