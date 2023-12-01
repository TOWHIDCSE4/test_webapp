import React, { useCallback, useEffect, useState } from 'react'
import {
    Card,
    Col,
    Pagination,
    Row,
    Input,
    Empty,
    notification,
    Select
} from 'antd'
import _ from 'lodash'
import CourseAPI from 'api/CourseAPI'
import { EnumCourseTag } from 'types'
import cn from 'classnames'
import CourseCard from './CourseCard'
import styles from './CourseExplorerPage.module.scss'

const { Search } = Input

export default function Index(props) {
    const [courses, setCourses] = React.useState([])
    const [total, setTotal] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(12)
    const [pageNumber, setPageNumber] = React.useState(1)
    const [search, setSearch] = React.useState('')
    const [tags, setTags] = useState<EnumCourseTag[]>([])

    const fetchCourses = useCallback(
        async (query?: {
            page_size: number
            page_number: number
            search?: string
            tags?: EnumCourseTag[]
        }) => {
            CourseAPI.getCoursePublic(query)
                .then((res) => {
                    setCourses(res.data)
                    setTotal(res.pagination.total)
                })
                .catch((err) => {
                    notification.error({
                        message: 'Error',
                        description: err.message
                    })
                })
        },
        []
    )

    useEffect(() => {
        fetchCourses()
    }, [])

    const renderCourseCard = () => {
        if (_.isEmpty(courses)) return <Empty />
        return courses.map((item, index) => (
            <Col key={index} className='mb-3' span={8}>
                <CourseCard key={index} course={item} />
            </Col>
        ))
    }

    const handleChangePagination = useCallback(
        (_pageNumber, _pageSize) => {
            if (_pageNumber !== pageNumber) {
                setPageNumber(_pageNumber)
                fetchCourses({
                    page_size: _pageSize,
                    page_number: _pageNumber
                })
            }
            if (_pageSize !== pageSize) {
                setPageSize(_pageSize)
                fetchCourses({
                    page_size: _pageSize,
                    page_number: _pageNumber
                })
            }
        },
        [pageNumber, pageSize]
    )

    const onChangeTag = (val) => {
        setTags(val)
        setPageNumber(1)
        fetchCourses({
            page_number: 1,
            page_size: pageSize,
            search,
            tags: val
        })
    }

    const handleChangeSearch = useCallback(
        (e) => {
            setSearch(e.target.value)
            setPageNumber(1)
            fetchCourses({
                search: e.target.value,
                page_number: 1,
                page_size: pageSize
            })
        },
        [search]
    )

    const renderTags = () =>
        Object.keys(EnumCourseTag).map((key, index) => (
            <Select.Option value={EnumCourseTag[key]} key={index}>
                {_.startCase(EnumCourseTag[key])}
            </Select.Option>
        ))

    return (
        <Card
            bordered={false}
            size='default'
            style={{ width: '80%', margin: '0 auto' }}
        >
            <Row gutter={[16, 16]} justify='end' style={{ padding: '16px' }}>
                <Col span={4}>
                    <Select
                        style={{ width: '100%' }}
                        value={tags}
                        onChange={onChangeTag}
                        placeholder='Filter by tags'
                        className='border-rds-select-antd'
                        mode='tags'
                    >
                        {renderTags()}
                    </Select>
                </Col>
                <Col span={8}>
                    <Search
                        onChange={_.debounce(handleChangeSearch, 1000)}
                        placeholder='Search course by name'
                        className={cn(styles.searchCourse)}
                    />
                </Col>
            </Row>
            <div className='site-card-wrapper'>
                <Row gutter={[16, 16]} style={{ padding: '16px' }}>
                    {renderCourseCard()}
                </Row>
            </div>
            <Row gutter={[16, 16]} style={{ padding: '16px' }}>
                <Col span={12} />
                <Col span={12}>
                    <Pagination
                        defaultCurrent={pageNumber}
                        total={total}
                        pageSize={pageSize}
                        onChange={handleChangePagination}
                    />
                </Col>
            </Row>
        </Card>
    )
}
