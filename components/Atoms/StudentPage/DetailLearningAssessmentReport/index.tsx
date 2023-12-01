import React, { useCallback, useReducer, useEffect } from 'react'
import Layout from 'components/Atoms/StudentPage/Layout'
import {
    Card,
    Select,
    Table,
    Tag,
    Button,
    notification,
    Row,
    Col,
    Input
} from 'antd'
import moment from 'moment'
import { notify } from 'contexts/Notification'
import { getTranslateText } from 'utils/translate-utils'
import { useRouter } from 'next/router'
import _ from 'lodash'
import LearningAssessmentReportAPI from 'api/LearningAssessmentReportAPI'
import {
    EnumLAReportStatus,
    EnumLAReportType
} from 'types/ILearningAssessmentReports'
import { ENUM_BOOKING_STATUS, EnumBookingStatus } from 'const'
import sanitizeHtml from 'sanitize-html'

function sanitize(string: string) {
    return sanitizeHtml(string, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img']
    })
}

const { Column, ColumnGroup } = Table

const DetailLearningAssessmentReport = () => {
    const router = useRouter()
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            dataReport: [],
            reportId: '',
            bookings: [],
            number_lesson: 0,
            number_completed: 0,
            number_absent: 0,
            number_homework: 0,
            number_homework_completed: 0,
            type_report: ''
        }
    )

    const getDataReport = (query: { reportId?: any }) => {
        setValues({ isLoading: true })
        LearningAssessmentReportAPI.getDetailReport({
            report_id: query.reportId,
            status: EnumLAReportStatus.PUBLISHED
        })
            .then((res) => {
                setValues({
                    dataReport: res.data,
                    bookings: res.bookings ?? [],
                    number_lesson: res.bookings ? res.bookings.length : 0,
                    type_report: res.data?.type
                })
                values.type_report = res.data?.type
                let countLessonCompleted = 0
                let countLessonAbsent = 0
                let countHomework = 0
                let countHomeworkCompleted = 0

                if (res.bookings) {
                    // eslint-disable-next-line array-callback-return
                    res.bookings.map((value, index) => {
                        if (value?.status === ENUM_BOOKING_STATUS.COMPLETED) {
                            countLessonCompleted++
                            if (
                                value?.unit?.homework_id ||
                                value?.unit?.homework2_id
                            ) {
                                countHomework++
                            }
                            const homework = value?.homework?.sessions
                                ? value?.homework?.sessions[0]?.user_score
                                : value?.homework_test_result?.test_result
                                      ?.avg ??
                                  value?.homework_test_result?.test_result
                                      ?.percent_correct_answers ??
                                  null
                            if (homework || homework === 0) {
                                countHomeworkCompleted++
                            }
                        }
                        if (
                            value?.status === ENUM_BOOKING_STATUS.STUDENT_ABSENT
                        ) {
                            countLessonAbsent++
                        }
                    })
                    setValues({
                        number_completed: countLessonCompleted,
                        number_absent: countLessonAbsent,
                        number_homework: countHomework,
                        number_homework_completed: countHomeworkCompleted
                    })
                }
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
            .finally(() => setValues({ isLoading: false }))
    }

    useEffect(() => {
        const { id } = router.query
        if (id) {
            setValues({ reportId: id })
            getDataReport({
                reportId: id
            })
        }
    }, [router.query.id])

    const colorStatus = (_status) => {
        switch (_status) {
            case ENUM_BOOKING_STATUS.COMPLETED:
                return 'success'
            case ENUM_BOOKING_STATUS.PENDING:
                return 'warning'
            case ENUM_BOOKING_STATUS.UPCOMING:
                return 'cyan'
            case ENUM_BOOKING_STATUS.TEACHING:
                return 'processing'
            case ENUM_BOOKING_STATUS.STUDENT_ABSENT:
                return 'error'
            case ENUM_BOOKING_STATUS.TEACHER_ABSENT:
                return 'error'
            case ENUM_BOOKING_STATUS.CANCEL_BY_STUDENT:
                return 'error'
            case ENUM_BOOKING_STATUS.CANCEL_BY_TEACHER:
                return 'error'
            default:
                break
        }
    }

    return (
        <Layout>
            {values.type_report &&
            values.type_report === EnumLAReportType.DILIGENCE ? (
                <Card>
                    <Row className='mb-4'>
                        <Col span={24} className='d-flex justify-content-start'>
                            <img
                                src='/assets/images/logo_ispeak_report.png'
                                alt='Ispeak VN'
                                style={{ width: '16%' }}
                                title='Ispeak VN'
                            />
                            <b
                                style={{
                                    margin: 'auto',
                                    paddingRight: '15%',
                                    fontWeight: 600,
                                    color: '#1890FF',
                                    fontSize: 22
                                }}
                            >
                                {`${getTranslateText(
                                    'student.detail_learning_assessment.title'
                                )} `}
                            </b>
                        </Col>
                        <Col
                            span={24}
                            className='d-flex justify-content-center'
                        >
                            <b style={{ fontSize: 19 }}>
                                {`${moment(
                                    values.dataReport?.start_time
                                ).format('DD/MM/YYYY')} - ${moment(
                                    values.dataReport?.end_time
                                ).format('DD/MM/YYYY')}`}
                            </b>
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col span={5} style={{ minWidth: 220 }}>
                            <b>
                                {getTranslateText(
                                    'student.detail_learning_assessment.student_label'
                                )}
                                :
                            </b>
                        </Col>
                        <Col span={15}>
                            <b>{values.bookings[0]?.student?.full_name}</b>
                        </Col>
                        <Col span={5} style={{ minWidth: 220 }}>
                            <b>
                                {getTranslateText(
                                    'student.detail_learning_assessment.number_lesson_label'
                                )}
                                :
                            </b>
                        </Col>
                        <Col span={15}>
                            <b>{values.number_lesson}</b>
                        </Col>
                        <Col span={5} style={{ minWidth: 220 }}>
                            <b>
                                {getTranslateText(
                                    'student.detail_learning_assessment.number_completed_label'
                                )}
                                :
                            </b>
                        </Col>
                        <Col span={15}>
                            <b>{values.number_completed}</b>
                        </Col>
                        <Col span={5} style={{ minWidth: 220 }}>
                            <b>
                                {getTranslateText(
                                    'student.detail_learning_assessment.number_absent_label'
                                )}
                                :
                            </b>
                        </Col>
                        <Col span={15}>
                            <b>{values.number_absent}</b>
                        </Col>
                        <Col span={5} style={{ minWidth: 220 }}>
                            <b>
                                {getTranslateText(
                                    'student.detail_learning_assessment.number_homework_completed_label'
                                )}
                                :
                            </b>
                        </Col>
                        <Col span={15}>
                            <b>
                                {values.number_homework_completed} /{' '}
                                {values.number_homework}
                            </b>
                        </Col>
                    </Row>
                    <Table
                        dataSource={values.bookings}
                        pagination={false}
                        // pagination={{
                        //     defaultCurrent: values.page_number,
                        //     pageSize: values.page_size,
                        //     total: values.total,
                        //     onChange: handleChangePagination
                        // }}
                        rowKey={(record) => record.id}
                        loading={values.isLoading}
                        scroll={{
                            x: 500
                        }}
                    >
                        <Column
                            title={getTranslateText(
                                'student.detail_learning_assessment.stt_title_table'
                            )}
                            dataIndex='stt'
                            key='stt'
                            width={60}
                            fixed
                            align='center'
                            render={(text: any, record: any, index) => (
                                <div>{index + 1}</div>
                            )}
                        />
                        <Column
                            title={getTranslateText(
                                'student.detail_learning_assessment.start_time_title_table'
                            )}
                            dataIndex='calendar'
                            key='calendar'
                            width={150}
                            align='center'
                            render={(text: any, record: any) =>
                                text ? (
                                    moment(text.start_time).format(
                                        'HH:mm DD-MM-YYYY'
                                    )
                                ) : (
                                    <></>
                                )
                            }
                        />
                        <Column
                            title={getTranslateText(
                                'student.detail_learning_assessment.teacher_title_table'
                            )}
                            dataIndex='teacher'
                            key='teacher'
                            width={140}
                            align='left'
                            render={(text: any, record: any) =>
                                text && text.full_name ? (
                                    <div>{text.full_name}</div>
                                ) : (
                                    <></>
                                )
                            }
                        />
                        <Column
                            title={getTranslateText(
                                'student.detail_learning_assessment.content_title_table'
                            )}
                            dataIndex='course'
                            key='course'
                            width={240}
                            align='left'
                            render={(text: any, record: any) =>
                                record ? (
                                    <>
                                        <div>
                                            Course: {record?.course?.name}
                                        </div>
                                        <div>Lesson: {record?.unit?.name}</div>
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        />
                        <Column
                            title={getTranslateText(
                                'student.detail_learning_assessment.status_title_table'
                            )}
                            dataIndex='status'
                            key='status'
                            width={170}
                            align='center'
                            render={(text: any, record: any) => (
                                <Tag color={colorStatus(text)}>
                                    {ENUM_BOOKING_STATUS[text]}
                                </Tag>
                            )}
                        />
                        <Column
                            title={getTranslateText(
                                'student.detail_learning_assessment.homework_title_table'
                            )}
                            dataIndex='homework'
                            key='homework'
                            width={130}
                            align='center'
                            render={(text: any, record: any) => {
                                if (
                                    (record?.unit?.homework_id ||
                                        record?.unit?.homework2_id) &&
                                    record?.status ===
                                        ENUM_BOOKING_STATUS.COMPLETED
                                ) {
                                    if (
                                        (record?.homework?.sessions &&
                                            record?.homework?.sessions[0]
                                                ?.user_score) ||
                                        record?.homework_test_result
                                            ?.test_result?.avg ||
                                        record?.homework_test_result
                                            ?.test_result
                                            ?.percent_correct_answers
                                    ) {
                                        return (
                                            <div
                                                style={{
                                                    color: '#52C41A'
                                                }}
                                            >
                                                {getTranslateText(
                                                    'student.detail_learning_assessment.status_done_homework'
                                                )}
                                            </div>
                                        )
                                    }
                                    return (
                                        <div
                                            style={{
                                                color: '#FF0D0D'
                                            }}
                                        >
                                            {getTranslateText(
                                                'student.detail_learning_assessment.status_not_done_homework'
                                            )}
                                        </div>
                                    )
                                }
                                return <></>
                            }}
                        />

                        <ColumnGroup
                            title={getTranslateText(
                                'student.detail_learning_assessment.teacher_comment_title_table'
                            )}
                        >
                            <Column
                                title={getTranslateText(
                                    'student.detail_learning_assessment.attention_title_table'
                                )}
                                dataIndex='memo'
                                key='attention'
                                width={130}
                                align='center'
                                render={(text: any, record: any) => {
                                    if (
                                        text?.other &&
                                        text?.other?.length > 0
                                    ) {
                                        const dataMemo = text?.other.find(
                                            (x: any) =>
                                                x.keyword === 'attention'
                                        )
                                        return dataMemo?.comment
                                    }
                                    return <></>
                                }}
                            />
                            <Column
                                title={getTranslateText(
                                    'student.detail_learning_assessment.comprehension_title_table'
                                )}
                                dataIndex='memo'
                                key='comprehension'
                                width={140}
                                align='center'
                                render={(text: any, record: any) => {
                                    if (
                                        text?.other &&
                                        text?.other?.length > 0
                                    ) {
                                        const dataMemo = text?.other.find(
                                            (x: any) =>
                                                x.keyword === 'comprehension'
                                        )
                                        return dataMemo?.comment
                                    }
                                    return <></>
                                }}
                            />
                            <Column
                                title={getTranslateText(
                                    'student.detail_learning_assessment.performance_title_table'
                                )}
                                dataIndex='memo'
                                key='performance'
                                width={150}
                                align='center'
                                render={(text: any, record: any) => {
                                    if (
                                        text?.other &&
                                        text?.other?.length > 0
                                    ) {
                                        const dataMemo = text?.other.find(
                                            (x: any) =>
                                                x.keyword === 'performance'
                                        )
                                        return dataMemo?.comment
                                    }
                                    return <></>
                                }}
                            />
                        </ColumnGroup>
                    </Table>
                    {values.dataReport?.memo && (
                        <Row className='mt-4'>
                            <Col span={4}>
                                <b>
                                    {getTranslateText(
                                        'student.detail_learning_assessment.assessment_summary'
                                    )}
                                    :
                                </b>
                            </Col>
                            <Col span={24}>
                                {/* <TextArea
                                value={values.dataReport?.memo}
                                rows={15}
                            /> */}
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: sanitize(
                                            values.dataReport?.memo
                                        )
                                    }}
                                />
                            </Col>
                        </Row>
                    )}
                </Card>
            ) : (
                values.type_report &&
                values.dataReport?.file_upload && (
                    // eslint-disable-next-line jsx-a11y/iframe-has-title
                    <iframe
                        src={values.dataReport?.file_upload}
                        allow='camera; microphone'
                        key='file_report'
                        width='100%'
                        style={{ height: '95vh' }}
                    />
                )
            )}
        </Layout>
    )
}

export default DetailLearningAssessmentReport
