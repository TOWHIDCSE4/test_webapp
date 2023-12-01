import React, { memo } from 'react'
import cn from 'classnames'
import ReactTooltip from 'react-tooltip'
import { BOOKING_STATUS, BOOKING_STATUS_TITLE } from 'const'
import _ from 'lodash'
import {
    CheckCircleOutlined,
    FieldTimeOutlined,
    CarryOutOutlined
} from '@ant-design/icons'
import { Image } from 'antd'
import styles from './TagStatus.module.scss'

const TagStatus = ({ status }) => {
    const renderColor = () => {
        switch (status) {
            case BOOKING_STATUS.COMPLETED:
                return '#20ac5c'
            case BOOKING_STATUS.STUDENT_ABSENT:
                return '#F63238'
            case BOOKING_STATUS.TEACHER_ABSENT:
                return '#F63238'
            case BOOKING_STATUS.CANCEL_BY_STUDENT:
                return '#9D9D9D'
            case BOOKING_STATUS.CANCEL_BY_TEACHER:
                return '#9D9D9D'
            case BOOKING_STATUS.CANCEL_BY_ADMIN:
                return '#F63238'
            case BOOKING_STATUS.PENDING:
                return '#faad14'
            case BOOKING_STATUS.CONFIRMED:
                return '#87e8de'
            case BOOKING_STATUS.TEACHING:
                return '#1890ff'
            case BOOKING_STATUS.CHANGE_TIME:
                return '#b522b0'
            default:
                break
        }
    }

    const renderImageStatus = () => {
        switch (status) {
            case BOOKING_STATUS.COMPLETED:
                return <CheckCircleOutlined />
            case BOOKING_STATUS.STUDENT_ABSENT:
                return (
                    <Image
                        src='/static/img/teacher/teaching-history/teacher-absent.svg'
                        width={16}
                        height={16}
                        preview={false}
                    />
                )
            case BOOKING_STATUS.TEACHER_ABSENT:
                return (
                    <Image
                        src='/static/img/teacher/teaching-history/teacher-absent.svg'
                        width={16}
                        height={16}
                        preview={false}
                    />
                )
            case BOOKING_STATUS.CANCEL_BY_STUDENT:
                return (
                    <Image
                        src='/static/img/teacher/teaching-history/cancel-by-student.svg'
                        width={16}
                        height={16}
                        preview={false}
                    />
                )
            case BOOKING_STATUS.CANCEL_BY_TEACHER:
                return (
                    <Image
                        src='/static/img/teacher/teaching-history/cancel-by-student.svg'
                        width={16}
                        height={16}
                        preview={false}
                    />
                )
            case BOOKING_STATUS.CANCEL_BY_ADMIN:
                return (
                    <Image
                        src='/static/img/teacher/teaching-history/cancel-by-admin.svg'
                        width={16}
                        height={16}
                        preview={false}
                    />
                )
            case BOOKING_STATUS.PENDING:
                return <FieldTimeOutlined style={{ fontSize: '16px' }} />
            case BOOKING_STATUS.CONFIRMED:
                return <CarryOutOutlined style={{ fontSize: '16px' }} />
            case BOOKING_STATUS.TEACHING:
                return (
                    <i
                        className='fas fa-chalkboard-teacher'
                        style={{ fontSize: '14px' }}
                    />
                )
            case BOOKING_STATUS.TEACHER_CONFIRMED:
                return (
                    <Image
                        src='/static/img/teacher/teaching-history/wait-for-confirm.svg'
                        width={16}
                        height={16}
                        preview={false}
                    />
                )
            default:
                break
        }
    }

    return (
        <>
            <ReactTooltip
                className={cn(styles.messStatus)}
                id={_.findKey(BOOKING_STATUS, (o) => o === status)}
                place='right'
                type='success'
                backgroundColor={renderColor()}
            />
            <div className={cn(styles.titleMobile)}>
                <span>Teacher Absent</span>
                {renderImageStatus()}
            </div>
            <div className={cn(styles['wrap-tag'])}>
                <div
                    data-for={_.findKey(BOOKING_STATUS, (o) => o === status)}
                    data-tip={_.startCase(
                        _.findKey(BOOKING_STATUS_TITLE, (o) => o === status)
                    )}
                >
                    <div
                        style={{ backgroundColor: `${renderColor()}` }}
                        className={cn(styles['tag-status'])}
                    >
                        {renderImageStatus()}
                        <div className={cn(styles['status-desc'])}>
                            {_.startCase(
                                _.findKey(
                                    BOOKING_STATUS_TITLE,
                                    (o) => o === status
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(TagStatus)
