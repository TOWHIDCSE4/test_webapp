import moment from 'moment'
import { useRouter } from 'next/router'
import { FC, memo, useCallback } from 'react'
import { IBooking } from 'types'
import { getTranslateText } from 'utils/translate-utils'
import {
    EnumHomeworkDataType,
    EnumHomeworkResultType,
    EnumHomeworkType
} from 'const/common'
import cn from 'classnames'
import { Tooltip } from 'antd'
import _ from 'lodash'
import { HOUR_TO_MS, PIVOT_HOUR_FOR_AVG } from 'const'

type Props = {
    data: IBooking
    type: string
}
const HomeWorkCard: FC<Props> = ({ data, type }) => {
    const router = useRouter()

    const checkScoreValid = (time_booking_finished, submission_time) => {
        const allowTimeForHomeWork = PIVOT_HOUR_FOR_AVG * HOUR_TO_MS
        if (submission_time - time_booking_finished <= allowTimeForHomeWork) {
            return true
        }
        return false
    }

    const handleDoHomework = useCallback(() => {
        if (data?.unit?.homework || data?.unit?.homework2) {
            router.push(`/student/homework/${data.id}`)
        }
    }, [data])
    let textPoint = '0'
    if (type === EnumHomeworkType.v1) {
        if (
            data?.homework &&
            data?.homework?.sessions[0] &&
            data?.homework?.sessions[0]?.submit_time &&
            checkScoreValid(
                data?.calendar?.end_time,
                moment(data?.homework?.sessions[0]?.submit_time).valueOf()
            )
        ) {
            textPoint = Number(
                data?.homework?.sessions[0]?.user_score || 0
            ).toFixed(1)
        }
    } else if (type === EnumHomeworkType.v2) {
        if (
            data?.course?.course_type === EnumHomeworkDataType.COMMON &&
            data?.homework_test_result &&
            data?.homework_test_result[0]?.test_type ===
                EnumHomeworkResultType.COMMON &&
            data?.homework_test_result[0]?.test_result &&
            checkScoreValid(
                data?.calendar?.end_time,
                data?.homework_test_result[0]?.test_result?.submission_time
            )
        ) {
            textPoint = Number(
                data?.homework_test_result[0]?.test_result?.avg || 0
            ).toFixed(1)
        }
        if (
            data?.course?.course_type === EnumHomeworkDataType.IELTS &&
            data?.homework_test_result &&
            data?.homework_test_result[0]?.test_type ===
                EnumHomeworkResultType.IELTS &&
            data?.homework_test_result[0]?.test_result &&
            checkScoreValid(
                data?.calendar?.end_time,
                data?.homework_test_result[0]?.test_result?.submission_time
            )
        ) {
            textPoint = Number(
                data?.homework_test_result[0]?.test_result
                    ?.percent_correct_answers || 0
            ).toFixed(1)
        }
    }

    const renderStatusHomework = () => {
        if (type === EnumHomeworkType.v1) {
            if (data?.homework?.sessions[0]) {
                return (
                    <span className='label blue2'>
                        <strong>
                            <i>{getTranslateText('quiz.done')}</i>
                        </strong>
                    </span>
                )
            }
        } else if (
            (data?.course?.course_type === EnumHomeworkDataType.COMMON &&
                data?.homework_test_result[0]?.test_result?.avg) ||
            (data?.course?.course_type === EnumHomeworkDataType.IELTS &&
                data?.homework_test_result[0]?.test_result
                    ?.percent_correct_answers)
        ) {
            return (
                <span className='label blue2'>
                    <strong>
                        <i>{getTranslateText('quiz.done')}</i>
                    </strong>
                </span>
            )
        }

        return (
            <span className='label red2'>
                <strong>
                    <i>{getTranslateText('quiz.not_done')}</i>
                </strong>
            </span>
        )
    }

    return (
        <div className='card widget_7'>
            <div
                className={cn(
                    'header',
                    data?.is_done_homework ? 'blue' : 'red'
                )}
            >
                <strong style={{ fontSize: '1rem' }}>
                    {data?.calendar?.start_time &&
                        moment(data.calendar.start_time).format(
                            'DD/MM/YYYY HH:mm'
                        )}
                </strong>
                {renderStatusHomework()}
            </div>
            <div className='body'>
                <div className='row'>
                    <div className='col-4'>
                        <p>{getTranslateText('student.booking.course')}</p>
                    </div>
                    <div className='col-8'>
                        <p>
                            <strong>
                                <a href='#'>{data?.course?.name}</a>
                            </strong>
                        </p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4'>
                        <p>{getTranslateText('student.booking.unit')}</p>
                    </div>
                    <div className='col-8'>
                        <p>
                            <strong>
                                <a href='#'>{data?.unit?.name}</a>
                            </strong>
                        </p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4'>
                        <p>{getTranslateText('student.booking.teacher')}</p>
                    </div>
                    <div className='col-8'>
                        <p>
                            <strong>
                                <a href='#'>{data?.teacher?.full_name}</a>
                            </strong>
                        </p>
                    </div>
                </div>
                {data?.unit?.workbook && (
                    <div className='row'>
                        <div className='col-6'>
                            <a
                                href={data?.unit?.workbook}
                                target='_blank'
                                rel='noreferrer'
                            >
                                {getTranslateText(
                                    'student.booking.see_workbook'
                                )}
                            </a>
                        </div>
                    </div>
                )}
                <hr />
                <p className='text-center'>
                    {/* <Tooltip title={getTranslateText('quiz.desc_avg')}> */}
                    <strong>
                        {getTranslateText('quiz.start_case_point')}: {textPoint}{' '}
                        {type === EnumHomeworkType.v1 ||
                        (type === EnumHomeworkType.v2 &&
                            data?.course?.course_type ===
                                EnumHomeworkDataType.COMMON)
                            ? getTranslateText('quiz.point')
                            : '%'}
                    </strong>
                    {/* </Tooltip> */}
                </p>

                <button
                    className='btn my-2 my-sm-0 big-bt big-bt2'
                    type='button'
                    onClick={handleDoHomework}
                >
                    <span className='color-white'>
                        {getTranslateText('do_homework')}
                    </span>
                    <img src='/static/img/homepage/bt.png' alt='Do homework' />
                </button>
            </div>
        </div>
    )
}

export default memo(HomeWorkCard)
