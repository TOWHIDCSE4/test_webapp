import { useCallback, useEffect, useState, useReducer } from 'react'
import cn from 'classnames'
import moment from 'moment'
import { DAY_BETWEEN_CIRCLE } from 'const'
import BookingAPI from 'api/BookingAPI'
import { notify } from 'contexts/Notification'
import { EnumFinesType, ITeacherFines, ITeacherSalary } from 'types'
import _ from 'lodash'
import { parseTimeAndCircleSalary } from 'utils/datetime-utils'
import { useAuth } from 'contexts/Auth'
import { Logger } from 'utils/logger'
import styles from './TeachingSummary.module.scss'
import SummaryInMonth from '../Dashboard/SummaryInMonth'
import TabParameter from './TabParameter'
import { Alert } from 'antd'
import { getTranslateText } from 'utils/translate-utils'

const TeachingSummary = () => {
    const [teacherSummary, setTeachersSummary] = useState(null)

    useEffect(() => {}, [])

    const setData = (data) => {
        setTeachersSummary(data)
        console.log(data)
    }

    return (
        <div className={cn(styles.wrap)}>
            <SummaryInMonth setData={setData}></SummaryInMonth>

            <TabParameter data={teacherSummary} />
        </div>
    )
}

export default TeachingSummary
