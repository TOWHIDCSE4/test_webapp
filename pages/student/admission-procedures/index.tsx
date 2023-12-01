import Layout from 'components/Atoms/StudentPage/Layout'
import React, { useCallback, useReducer, useEffect } from 'react'
import { Card, Space, Select, Table, Tag, Button, Tabs } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import { useRouter } from 'next/router'
import { ColumnsType } from 'antd/lib/table'
import AdviceLetterAPI from 'api/AdviceLetterAPI'
import { notify } from 'contexts/Notification'
import moment from 'moment'
import { FULL_DATE_FORMAT, POINT_VND_RATE } from 'const'

const { TabPane } = Tabs

export enum EnumTabType {
    ADVICE_LETTER = 1,
    CONTRACT = 2
}

const AdmissionProcedure = () => {
    const router = useRouter()
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            letters: [],
            page_size: 10,
            page_number: 1,
            total: 0,
            // status: EnumLAReportStatus.PUBLISHED,
            tab_current: EnumTabType.ADVICE_LETTER
        }
    )

    const onChangeTab = useCallback(
        (key) => {
            values.tab_current = Number(key)
            setValues({ tab_current: Number(key) })
            // getStudyReports({ ...values, page_number: 1 })
        },
        [values]
    )

    const getAdviceLetters = (query: {
        page_size?: number
        page_number?: number
    }) => {
        // setValues({ isLoading: true })
        const filter: any = {
            page_size: query.page_size,
            page_number: query.page_number
        }
        AdviceLetterAPI.getAllAdviceLetters(filter)
            .then((res) => {
                if (res.pagination && res.pagination.total >= 0) {
                    setValues({ total: res.pagination.total })
                }
                setValues({ letters: res.data })
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setValues({ isLoading: false }))
    }

    useEffect(() => {
        getAdviceLetters({ ...values })
    }, [])

    const columns: ColumnsType<any> = [
        {
            title: `${getTranslateText('student.admission_procedures.id')}`,
            dataIndex: '_id',
            key: '_id',
            align: 'center',
            width: 80,
            render: (text: any, record: any, index: any) => index + 1
        },
        {
            title: `${getTranslateText(
                'student.admission_procedures.file_name'
            )}`,
            dataIndex: 'file_name',
            key: 'file_name',
            align: 'center',
            width: 140
        },
        {
            title: `${getTranslateText(
                'student.admission_procedures.date_time'
            )}`,
            dataIndex: 'created_time',
            key: 'created_time',
            align: 'center',
            width: 140,
            render: (text: any, record: any) =>
                text && moment(new Date(text)).format(FULL_DATE_FORMAT)
        },
        {
            title: '',
            dataIndex: 'file',
            key: 'file',
            align: 'center',
            width: 140,
            render: (text, record) => (
                <a href={record.file} target='_blank' rel='noopener noreferrer'>
                    View file
                </a>
            )
        }
    ]

    const handleChangePagination = useCallback(
        (pageNumber, pageSize) => {
            setValues({ page_number: pageNumber, page_size: pageSize })
            getAdviceLetters({
                page_size: pageSize,
                page_number: pageNumber
            })
        },
        [values]
    )

    const renderTable = () => (
        <Table
            dataSource={values.letters}
            columns={columns}
            loading={values.isLoading}
            pagination={{
                defaultCurrent: values.page_number,
                pageSize: values.page_size,
                total: values.total,
                onChange: handleChangePagination
            }}
        />
    )

    return (
        <Layout>
            <Card
                title={getTranslateText('student.admission_procedures.title')}
            >
                <Tabs
                    defaultActiveKey={`${values.tab_current}`}
                    activeKey={`${values.tab_current}`}
                    type='card'
                    onChange={onChangeTab}
                >
                    <TabPane
                        tab={getTranslateText(
                            'student.admission_procedures.advice_letter'
                        )}
                        key={EnumTabType.ADVICE_LETTER}
                    >
                        {renderTable()}
                        {/* {renderTable()} */}
                    </TabPane>
                    <TabPane
                        tab={getTranslateText(
                            'student.admission_procedures.contract'
                        )}
                        key={EnumTabType.CONTRACT}
                    >
                        <h1>xyz</h1>
                        {/* {renderTable()} */}
                    </TabPane>
                </Tabs>
            </Card>
        </Layout>
    )
}

export default AdmissionProcedure
