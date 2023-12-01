import React, { useEffect, useReducer } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import {
    Collapse,
    DatePicker,
    Empty,
    notification,
    Select,
    Space,
    Card,
    Spin
} from 'antd'
import moment from 'moment'
import _ from 'lodash'
import ScheduledMemoAPI from 'api/ScheduledMemoAPI'
import { EnumScheduledMemoType } from 'types'
import { useAuth } from 'contexts/Auth'
import StudentItem from './StudentItem'

const { Option } = Select

const Students = () => {
    const { teacherInfo } = useAuth()

    const [state, setState] = useReducer(
        (curState, newState) => ({ ...curState, ...newState }),
        {
            isLoading: false,
            students: [],
            dateType: 'year',
            date: moment(),
            page_size: 100,
            page_number: 1,
            total: 0
        }
    )

    const fetch = async () => {
        setState({ isLoading: true })
        try {
            const res = await ScheduledMemoAPI.getScheduledMemos({
                type: EnumScheduledMemoType.MONTHLY_MEMO,
                month:
                    state.dateType === 'month'
                        ? state.date.get('month') + 1
                        : null,
                year: state.date.get('year'),
                page_number: state.page_number,
                page_size: state.page_size,
                sort: 'created_time:-1'
            })
            const memoGroups = _.groupBy(res.data, 'student_id')
            const students = []
            Object.values(memoGroups).forEach((memos) => {
                students.push({
                    student: memos[0].student,
                    memos
                })
            })
            setState({ students })
            if (res.pagination && res.pagination.total >= 0) {
                setState({ total: res.pagination.total })
            }
        } catch (err) {
            notification.error({
                message: 'Error',
                description: err.message
            })
        }
        setState({ isLoading: false })
    }
    useEffect(() => {
        fetch()
    }, [state.page_size, state.page_number, state.dateType, state.date])

    const renderStudent = () => {
        if (_.isEmpty(state.students)) return <Empty />
        return (
            <Collapse accordion>
                {state.students.map((item, index) => (
                    <Collapse.Panel
                        showArrow={false}
                        header={
                            <h5 className='mb-0'>{item.student.full_name}</h5>
                        }
                        key={item.student.id}
                    >
                        <StudentItem
                            student={item.student}
                            memos={item.memos}
                        />
                    </Collapse.Panel>
                ))}
            </Collapse>
        )
    }
    return (
        <Card title={getTranslateText('teacher.students.title')}>
            <div className='d-flex justify-content-end align-items-center mb-3'>
                <Space>
                    <Select
                        value={state.dateType}
                        onChange={(dateType) => setState({ dateType })}
                    >
                        <Option value='month'>
                            {getTranslateText('common.month')}
                        </Option>
                        <Option value='year'>
                            {getTranslateText('common.year')}
                        </Option>
                    </Select>
                    <DatePicker
                        picker={state.dateType}
                        style={{ width: 150 }}
                        value={state.date}
                        onChange={(date) => setState({ date })}
                    />
                </Space>
            </div>
            <div className='mt-3'>
                {state.isLoading ? (
                    <div className='mb-3 text-center'>
                        <Spin className='text-center' size='large' />
                    </div>
                ) : (
                    renderStudent()
                )}
            </div>
        </Card>
    )
}

export default Students
