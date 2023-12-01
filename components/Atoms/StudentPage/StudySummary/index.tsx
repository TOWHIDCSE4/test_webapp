import React, { useEffect, memo, useReducer } from 'react'
import { notification, Select, DatePicker, Tabs } from 'antd'
import moment from 'moment'
import { EnumScheduledMemoType } from 'types'
import ScheduledMemoAPI from 'api/ScheduledMemoAPI'
import MonthlySummary from './MonthlySummary'
import CourseSummary from './CourseSummary'
import AllSummary from './AllSummary'

const { Option } = Select

const StudySummary = () => {
    const [state, setState] = useReducer(
        (curState, newState) => ({ ...curState, ...newState }),
        {
            tab: 'monthly',
            month: moment(),
            loadingCourses: false,
            memoId: null,
            courseMemo: null,
            courseMemos: []
        }
    )

    const getCourseMemos = async () => {
        setState({ loadingCourses: true })
        try {
            const res = await ScheduledMemoAPI.getScheduledMemos({
                page_number: 1,
                page_size: 100,
                type: EnumScheduledMemoType.COURSE_MEMO,
                sort: 'created_time:-1'
            })
            setState({ courseMemos: res.data })
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message
            })
        }
        setState({ loadingCourses: false })
    }
    useEffect(() => {
        if (state.tab !== 'course' || state.courseMemos.length) return
        getCourseMemos()
    }, [state.tab, state.courseMemos])

    const onChangeCourseMemo = (id) => {
        setState({
            memoId: id,
            courseMemo: state.courseMemos.find((c) => c.id === id)
        })
    }

    const tabbarExtra =
        state.tab === 'monthly' ? (
            <DatePicker
                picker='month'
                value={state.month}
                onChange={(month) => setState({ month })}
                disabledDate={(date) => date > moment()}
            />
        ) : (
            state.tab === 'course' && (
                <Select
                    style={{ width: 300 }}
                    value={state.memoId}
                    onChange={onChangeCourseMemo}
                    placeholder='Select a course'
                    showSearch
                    loading={state.loadingCourses}
                >
                    {state.courseMemos.map((courseMemo) => (
                        <Option key={courseMemo.id} value={courseMemo.id}>
                            {courseMemo.course.name}
                        </Option>
                    ))}
                </Select>
            )
        )
    return (
        <>
            <Tabs
                activeKey={state.tab}
                onChange={(tab) => setState({ tab })}
                tabBarExtraContent={tabbarExtra}
            >
                <Tabs.TabPane
                    tab='Báo cáo tháng'
                    key='monthly'
                    style={{ fontFamily: 'Times New Roman' }}
                >
                    <MonthlySummary month={state.month} />
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab='Báo cáo khoá'
                    key='course'
                    style={{ fontFamily: 'Times New Roman' }}
                >
                    <CourseSummary data={state.courseMemo} />
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab='Báo cáo tổng hợp'
                    key='summary'
                    style={{ fontFamily: 'Times New Roman' }}
                >
                    <AllSummary />
                </Tabs.TabPane>
            </Tabs>
        </>
    )
}

export default memo(StudySummary)
