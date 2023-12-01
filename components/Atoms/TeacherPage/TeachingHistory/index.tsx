/* eslint-disable react/button-has-type */
import React, { useCallback, useState, useRef } from 'react'
import cn from 'classnames'
import { SearchOutlined } from '@ant-design/icons'
import { getTranslateText } from 'utils/translate-utils'
import { EnumBookingStatusForTeachingHistory } from 'const'
import { Card } from 'antd'
import OpenClassHistory from './OpenClassHistory'
import PrivateClassHistory from './PrivateClassHistory'
import Filter from './Filter'
import styles from './TeachingHistory.module.scss'

const TeachingHistory = () => {
    const [isSticky, setIsSticky] = useState<boolean>(false)
    const [key, setKey] = useState<number>(1)
    const [status, setStatus] = useState<number[]>([
        EnumBookingStatusForTeachingHistory.COMPLETED,
        EnumBookingStatusForTeachingHistory.CANCEL_BY_ADMIN,
        EnumBookingStatusForTeachingHistory.CANCEL_BY_STUDENT,
        EnumBookingStatusForTeachingHistory.CANCEL_BY_TEACHER,
        EnumBookingStatusForTeachingHistory.STUDENT_ABSENT,
        EnumBookingStatusForTeachingHistory.TEACHER_ABSENT,
        EnumBookingStatusForTeachingHistory.TEACHER_CONFIRM,
        EnumBookingStatusForTeachingHistory.CHANGE_TIME
    ])
    const [total, setTotal] = useState<number>(0)
    const [search, setSearch] = useState<string>('')

    const triggerStatus = useCallback((value) => {
        setStatus(value)
    }, [])

    const triggerTotal = useCallback((value) => {
        setTotal(value)
    }, [])

    const triggerSearch = useCallback((value) => {
        setSearch(value)
    }, [])

    return (
        <Card>
            <div className={cn(styles.wrapTabHistory)}>
                <div
                    className={`${cn(styles.tabNav)} ${
                        isSticky === true && 'nav-teaching-history'
                    }`}
                >
                    <div className={cn(styles.groupButton)}>
                        <button
                            className={`${key === 1 && cn(styles.active)}`}
                            onClick={() => {
                                setKey(1)
                            }}
                        >
                            {getTranslateText('private_class_history')}
                        </button>
                        <button
                            className={`${key === 2 && cn(styles.active)}`}
                            onClick={() => {
                                setKey(2)
                            }}
                        >
                            {getTranslateText('open_class_history')}
                        </button>
                    </div>
                    {/* <div className={cn(styles.searchTemplate)}> */}
                    {/* <form className={cn(styles.search)}>
                            <input
                                type='text'
                                name='search'
                                className='form-control form-search'
                            />
                            <button className='btn form-control' type='submit'>
                                <SearchOutlined />
                            </button>
                        </form> */}
                    {/* </div> */}
                </div>
                <div
                    className={`${cn(styles.wrapFilter)} ${
                        isSticky === true && 'filter'
                    }`}
                >
                    <Filter
                        onChangeStatus={triggerStatus}
                        total={total}
                        get_search={triggerSearch}
                    />
                </div>
                <div className={cn(styles.tabContent)}>
                    <div style={{ display: `${key === 1 ? 'block' : 'none'}` }}>
                        <PrivateClassHistory
                            status={status}
                            onChangeTotal={triggerTotal}
                            search={search}
                        />
                    </div>
                    <div style={{ display: `${key === 2 ? 'block' : 'none'}` }}>
                        <OpenClassHistory status={status} />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default TeachingHistory
