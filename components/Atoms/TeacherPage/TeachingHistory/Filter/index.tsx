/* eslint-disable react/button-has-type */
import React, { useCallback, useState, memo } from 'react'
import cn from 'classnames'
import { Row, Col, Select, Input, Form } from 'antd'
import { SearchOutlined, FilterFilled } from '@ant-design/icons'
import _ from 'lodash'
import { EnumBookingStatusForTeachingHistory } from 'const'
import { getTranslateText } from 'utils/translate-utils'
import styles from './Filter.module.scss'

const { Option } = Select
// import Mess from '../Mess';

const { Search } = Input

const Filter = ({ onChangeStatus, total, get_search }) => {
    const [isOpenHeader, setIsOpenHeader] = React.useState(false)
    const [status, setStatus] = useState('')
    const [search, setSearch] = useState('')
    const handleChange = (key) => (value) => {
        switch (key) {
            case 'status':
                if (value) {
                    setStatus(value)
                    if (onChangeStatus) onChangeStatus(value)
                }
                break
            case 'search':
                setSearch(value)
                if (get_search) get_search(value)
                break
            default:
                break
        }
    }

    const handleClear = () => {
        setStatus('')
        if (onChangeStatus) {
            onChangeStatus([
                EnumBookingStatusForTeachingHistory.COMPLETED,
                EnumBookingStatusForTeachingHistory.CANCEL_BY_ADMIN,
                EnumBookingStatusForTeachingHistory.CANCEL_BY_STUDENT,
                EnumBookingStatusForTeachingHistory.CANCEL_BY_TEACHER,
                EnumBookingStatusForTeachingHistory.STUDENT_ABSENT,
                EnumBookingStatusForTeachingHistory.TEACHER_ABSENT,
                EnumBookingStatusForTeachingHistory.TEACHER_CONFIRM,
                EnumBookingStatusForTeachingHistory.CHANGE_TIME
            ])
        }
    }

    const OpenHeader = () => {
        setIsOpenHeader(!isOpenHeader)
    }

    const renderStatus = useCallback(
        () =>
            _.keys(EnumBookingStatusForTeachingHistory)
                .filter(
                    (key: any) =>
                        !isNaN(Number(EnumBookingStatusForTeachingHistory[key]))
                )
                .map((item, index) => (
                    <Option
                        key={index}
                        value={_.get(EnumBookingStatusForTeachingHistory, item)}
                    >
                        {_.startCase(item)}
                    </Option>
                )),
        []
    )

    return (
        <div className={cn(styles.wrapPrivateHistory)}>
            <div className={cn(styles.groupFilter)}>
                <button
                    onClick={OpenHeader}
                    className={cn(styles.buttonFilter)}
                >
                    <span>
                        <FilterFilled style={{ marginRight: 5 }} />
                        {getTranslateText('common.filter')}
                    </span>
                </button>
                {/* <div className={cn(styles.searchTemplate)}>
                    <form className={cn(styles.search)}>
                        <input
                            type='text'
                            name='search'
                            className='form-control form-search'
                        />
                        <button
                            style={{ height: 35 }}
                            className='btn form-control'
                            type='submit'
                        >
                            <SearchOutlined />
                        </button>
                    </form>
                </div> */}
            </div>
            <div
                className={`${cn(styles.header)} ${
                    isOpenHeader === false && cn(styles.closeHeader)
                }`}
            >
                <Row className={`${cn(styles.header_Row)} m-0`}>
                    <Col className={cn(styles.header_Col)} span={3}>
                        {total && (
                            <span>
                                {total} {getTranslateText('common.tickets')}
                            </span>
                        )}
                    </Col>
                    <Col className={cn(styles.header_Col)} span={8}>
                        <span>{getTranslateText('common.status')} :</span>{' '}
                        <span className='select'>
                            <Select
                                allowClear
                                value={status}
                                defaultValue={status}
                                className={cn(styles.select)}
                                onChange={handleChange('status')}
                                onClear={handleClear}
                            >
                                {renderStatus()}
                            </Select>
                        </span>
                    </Col>
                    <Col>
                        <Search
                            className={cn(styles.searchCourse)}
                            allowClear
                            onSearch={_.debounce(handleChange('search'), 250)}
                        />
                    </Col>
                    {/* <Col className={cn(styles.header_Col)} span={6}>
                        <span>Show by :</span>{' '}
                        <span className='select'>
                            <Select
                                defaultValue='New'
                                className={cn(styles.select)}
                            >
                                <Option value='Course'>Course</Option>
                                <Option value='New'>New</Option>
                                <Option value='Flexi'>Flexi</Option>
                            </Select>
                        </span>
                    </Col>
                    <Col className={cn(styles.header_Col)} span={6}>
                        <span>Type :</span>{' '}
                        <span className='select'>
                            <Select
                                defaultValue='Flexi'
                                className={cn(styles.select)}
                            >
                                <Option value='Course'>Course</Option>
                                <Option value='New'>New</Option>
                                <Option value='Flexi'>Flexi</Option>
                            </Select>
                        </span>
                    </Col> */}
                </Row>
            </div>
        </div>
    )
}

export default memo(Filter)
