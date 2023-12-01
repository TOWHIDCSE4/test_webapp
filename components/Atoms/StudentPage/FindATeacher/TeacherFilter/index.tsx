import { Row, Col, Input, Select, Form, DatePicker, Radio } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import LocationAPI from 'api/LocationAPI'
import SubjectAPI from 'api/SubjectAPI'
import cn from 'classnames'
import _, { lte } from 'lodash'
import { FC, useEffect, useState, memo } from 'react'
import { notify } from 'contexts/Notification'
import type { DatePickerProps } from 'antd'
import moment from 'moment'
import styles from './TeacherFilter.module.scss'

const { Option } = Select

export enum EnumTypeFilter {
    FIND_CLASS = 1,
    FIND_TEACHER_INFO = 2
}
export const PAGE_SIZE_FILTER_CALENDAR = 2000

type Props = {
    time: any
    setTime: any
    filter: any
    onFilter: (query) => void
}
const TeacherFilter: FC<Props> = ({ filter, onFilter, time, setTime }) => {
    const [form] = Form.useForm()

    const [locations, setLocations] = useState([])
    const [subjects, setSubjects] = useState([])
    const [typeFilter, setTypeFilter] = useState(EnumTypeFilter.FIND_CLASS)
    const [valueFilter, setValueFilter] = useState<any>({
        name1: '',
        name2: '',
        location_id: '',
        start_time: moment()
            .set('h', 7)
            .set('m', 30)
            .set('second', 0)
            .set('millisecond', 0)
    })

    const getLocations = () => {
        LocationAPI.getLocations()
            .then((res) => {
                setLocations(res.data)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const getSubjects = () => {
        SubjectAPI.getSubjects()
            .then((res) => {
                setSubjects(res.data)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const disabledDate = (current) =>
        current && current <= moment().startOf('day')

    const disabledDateTime = () => ({
        disabledHours: () => _.range(0, 7).concat([23])
    })

    useEffect(() => {
        getLocations()
        getSubjects()
    }, [])

    // useEffect(() => {
    // setTypeFilter(filter?.type_filter)
    // form.setFieldsValue({ ...filter })
    // }, [filter])

    const onValuesChange = (changedValues, allValues) => {
        if (!_.isEmpty(changedValues)) {
            let startTime = valueFilter.start_time
            let locationValue = valueFilter.location_id
            let name1Value = valueFilter.name1
            let name2Value = valueFilter.name2
            if (_.has(changedValues, 'start_time')) {
                startTime = _.get(changedValues, 'start_time')
                if (
                    startTime &&
                    startTime.minute() !== 0 &&
                    startTime.minute() !== 30
                ) {
                    startTime.set({ minute: 0, second: 0 })
                }
                startTime.set({ second: 0 })
                form.setFieldsValue({
                    start_time: 0
                })
                setTimeout(() => {
                    form.setFieldsValue({
                        start_time: startTime
                    })
                }, 100)
                setTime(startTime)
            }

            if (_.has(changedValues, 'location_id')) {
                locationValue = allValues.location_id
            }
            if (_.has(changedValues, 'name1')) {
                name1Value = allValues.name1
            }
            if (_.has(changedValues, 'name2')) {
                name2Value = allValues.name2
            }
            const value_filter = {
                type_filter: typeFilter,
                name1: name1Value,
                name2: name2Value,
                location_id: locationValue,
                start_time: startTime
            }
            setValueFilter({ ...value_filter })
            onFilter(value_filter)
            // console.log(value_filter)
            // console.log(valueFilter)
            // if (typeFilter === EnumTypeFilter.FIND_CLASS) {
            //     if (
            //         _.has(changedValues, 'start_time') ||
            //         _.has(changedValues, 'location_id') ||
            //         _.has(changedValues, 'name1')
            //     ) {
            //         onFilter(value_filter)
            //     }
            // } else if (
            //     _.has(changedValues, 'location_id') ||
            //     _.has(changedValues, 'name2')
            // ) {
            //     onFilter(value_filter)
            // }
        }
    }

    const chooseFilter = (value) => {
        // let arrCourse = []
        setTypeFilter(value)
        const value_filter = {
            ...valueFilter,
            type_filter: value
        }
        onFilter(value_filter)
    }

    const renderLocations = () =>
        locations.map((item, index) => (
            <Option key={index} value={item.id}>
                {item.name}
            </Option>
        ))

    // const renderSubjects = () =>
    //     subjects.map((item, index) => (
    //         <Option key={index} value={item.id}>
    //             {item.name}
    //         </Option>
    //     ))

    // const onChange: DatePickerProps['onChange'] = (date) => {
    //     setTime(date)
    // }

    return (
        <Form
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 22 }}
            className={cn(styles['teacher-filter'])}
            onValuesChange={_.debounce(onValuesChange, 250)}
            form={form}
            initialValues={{
                location_id: valueFilter.location_id,
                start_time: valueFilter.start_time
            }}
        >
            <Row
                gutter={[22, 0]}
                justify='start'
                style={{ marginTop: 15 }}
                className={cn(styles['teacher-filter'])}
            >
                <Col
                    xs={24}
                    sm={24}
                    md={6}
                    lg={4}
                    className={cn(styles['col-filter'])}
                >
                    <Form.Item name='location_id'>
                        <Select
                            placeholder={getTranslateText(
                                'student.find_a_teacher.country'
                            )}
                            className='border-rds-select-antd'
                        >
                            <Select.Option value=''>
                                {getTranslateText(
                                    'student.find_a_teacher.all_country'
                                )}
                            </Select.Option>
                            {renderLocations()}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                    <></>
                </Col>
            </Row>
            <Row
                gutter={[22, 0]}
                justify='start'
                style={{ marginBottom: 5 }}
                className={cn(styles['teacher-filter'])}
            >
                <Col
                    style={{ minWidth: 100 }}
                    onClick={() => chooseFilter(EnumTypeFilter.FIND_CLASS)}
                >
                    <Radio
                        value={EnumTypeFilter.FIND_CLASS}
                        checked={typeFilter === EnumTypeFilter.FIND_CLASS}
                    >
                        <strong style={{ color: '#076fd6' }}>
                            {getTranslateText(
                                'student.find_a_teacher.title_option_filter_schedule'
                            )}
                        </strong>
                    </Radio>
                </Col>
                <Col
                    style={{ minWidth: 150 }}
                    onClick={() =>
                        chooseFilter(EnumTypeFilter.FIND_TEACHER_INFO)
                    }
                >
                    <Radio
                        value={EnumTypeFilter.FIND_TEACHER_INFO}
                        checked={
                            typeFilter === EnumTypeFilter.FIND_TEACHER_INFO
                        }
                    >
                        <strong style={{ color: '#076fd6' }}>
                            {getTranslateText(
                                'student.find_a_teacher.title_option_filter_teacher'
                            )}
                        </strong>
                    </Radio>
                </Col>
            </Row>
            <Row
                gutter={[22, 0]}
                justify='start'
                className={cn(styles['teacher-filter'])}
            >
                {typeFilter === EnumTypeFilter.FIND_CLASS && (
                    <>
                        <Col
                            xs={24}
                            sm={24}
                            md={7}
                            lg={5}
                            className={cn(styles['col-filter'])}
                        >
                            <Form.Item
                                // label={getTranslateText(
                                //     'student.find_a_teacher.title_filter_schedule'
                                // )}
                                name='start_time'
                                rules={[
                                    {
                                        required: true,
                                        message: getTranslateText(
                                            'student.find_a_teacher.message_required_start_time'
                                        )
                                    }
                                ]}
                            >
                                <DatePicker
                                    format='YYYY-MM-DD HH:mm'
                                    placeholder={getTranslateText(
                                        'student.find_a_teacher.search_start_time'
                                    )}
                                    disabledDate={disabledDate}
                                    disabledTime={disabledDateTime}
                                    showTime={{ minuteStep: 30 }}
                                />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={8}
                            lg={6}
                            className={cn(styles['col-filter'])}
                        >
                            <Form.Item name='name1' style={{ marginBottom: 0 }}>
                                <Input
                                    placeholder={getTranslateText(
                                        'student.find_a_teacher.search'
                                    )}
                                    maxLength={255}
                                />
                            </Form.Item>
                            <div
                                className='note-student'
                                style={{ minWidth: 350 }}
                            >
                                Để trống tên giáo viên nếu muốn hiển thị tất cả
                                giáo viên
                            </div>
                        </Col>
                    </>
                )}
                {typeFilter === EnumTypeFilter.FIND_TEACHER_INFO && (
                    <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={6}
                        className={cn(styles['col-filter'])}
                    >
                        <Form.Item
                            name='name2'
                            // label={getTranslateText(
                            //     'student.find_a_teacher.title_filter_teacher'
                            // )}
                        >
                            <Input
                                placeholder={getTranslateText(
                                    'student.find_a_teacher.search'
                                )}
                                maxLength={255}
                            />
                        </Form.Item>
                    </Col>
                )}
            </Row>
            {/* <Row
                gutter={[22, 0]}
                justify='start'
                className={cn(styles['teacher-filter'])}
            >
                <Col xs={24} sm={24} md={5} lg={5}>
                    <DatePicker
                        style={{ width: '100%' }}
                        value={time}
                        onChange={onChange}
                    />
                </Col>
                <Col xs={24} sm={24} md={4} lg={4}>
                    <Form.Item name='subject_ids'>
                        <Select
                            mode='tags'
                            allowClear
                            placeholder={getTranslateText(
                                'student.find_a_teacher.subject'
                            )}
                            className='border-rds-select-antd'
                        >
                            {renderSubjects()}
                        </Select>
                    </Form.Item>
                </Col>
            </Row> */}
        </Form>
    )
}

export default memo(TeacherFilter)
