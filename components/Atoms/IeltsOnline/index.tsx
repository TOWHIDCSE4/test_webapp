import React, { useCallback, useEffect, useState } from 'react'
import {
    Card,
    Col,
    Pagination,
    Row,
    Input,
    Menu,
    notification,
    Spin,
    Empty,
    PageHeader
} from 'antd'
import _ from 'lodash'
import cn from 'classnames'
import IeltsTestAPI from 'api/IeltsTestAPI'
import { IIeltsCategory, IIeltsTest } from 'types'
import styles from './IeltsOnline.module.scss'
import IeltsTestItem from './IeltsTestItem'
import DetailIeltsTest from './DetailIeltsTest'

const { Search } = Input

export default function IeltsOnline(props) {
    const [loading, setLoading] = useState(false)
    const [ieltsOnlineList, setIeltsOnlineList] = useState<IIeltsTest[]>([])
    const [total, setTotal] = useState(1)
    const [pageSize, setPageSize] = useState(15)
    const [pageNumber, setPageNumber] = useState(1)
    const [search, setSearch] = useState('')
    const [categories, setCategories] = useState<IIeltsCategory[]>([])
    const [categoryId, setCategoryId] = useState(null)
    const [selectedIelts, setSelectedIelts] = useState<IIeltsTest>()

    const fetchCategories = () => {
        IeltsTestAPI.getCategories({ page_number: 1, page_size: 100 })
            .then((res) => {
                setCategories(res.data)
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
    }

    const fetchIeltsOnline = useCallback(
        (query?: {
            page_size: number
            page_number: number
            search?: string
            category_id?: number
        }) => {
            setLoading(true)
            IeltsTestAPI.getIeltsOnline(query)
                .then((res) => {
                    setIeltsOnlineList(res.data)
                    setTotal(res.pagination.total)
                })
                .catch((err) => {
                    notification.error({
                        message: 'Error',
                        description: err.message
                    })
                })
                .finally(() => setLoading(false))
        },
        []
    )

    useEffect(() => {
        if (categories.length > 0) {
            const filter = {
                page_number: pageNumber,
                page_size: pageSize,
                category_id: categories[0].id
            }
            fetchIeltsOnline(filter)
            setCategoryId(categories[0].id.toString())
        }
    }, [categories])

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleChangePagination = useCallback(
        (_pageNumber, _pageSize) => {
            const filter = {
                page_number: _pageNumber,
                page_size: _pageSize,
                category_id: categoryId
            }
            if (_pageNumber !== pageNumber) {
                setPageNumber(_pageNumber)
                fetchIeltsOnline(filter)
            }
            if (_pageSize !== pageSize) {
                setPageSize(_pageSize)
                fetchIeltsOnline(filter)
            }
        },
        [pageNumber, pageSize, categoryId]
    )

    const handleChangeSearch = useCallback(
        (e) => {
            setSearch(e.target.value)
            setPageNumber(1)
            fetchIeltsOnline({
                search: e.target.value,
                page_number: 1,
                page_size: pageSize,
                category_id: categoryId
            })
        },
        [search, categoryId]
    )

    const renderMenuCategories = () => {
        if (categories.length > 0) {
            return categories.map((c, index) => (
                <Menu.Item key={c.id.toString()}>{c.title}</Menu.Item>
            ))
        }
    }
    const renderIeltsTest = () => {
        if (ieltsOnlineList.length > 0) {
            return ieltsOnlineList.map((item, index) => (
                <Col
                    key={index}
                    span={8}
                    onClick={() => setSelectedIelts(item)}
                >
                    <IeltsTestItem data={item} />
                </Col>
            ))
        }
        return (
            <div className='w-100 d-flex justify-content-center'>
                <Empty description='IELTS Test empty' />
            </div>
        )
    }

    const onChangeCategory = (e) => {
        setCategoryId(e.key)
        const filter = {
            category_id: e.key,
            page_size: pageSize,
            page_number: 1
        }
        fetchIeltsOnline(filter)
        setPageNumber(1)
        setSelectedIelts(null)
    }

    const onBack = () => {
        setSelectedIelts(null)
    }
    return (
        <Card
            bordered={false}
            size='default'
            style={{ width: '80%', margin: '0 auto' }}
        >
            <Row>
                <Col span={6}>
                    <Menu
                        style={{ width: 256 }}
                        defaultSelectedKeys={['1']}
                        selectedKeys={[categoryId]}
                        mode='inline'
                        theme='light'
                        onClick={onChangeCategory}
                    >
                        {renderMenuCategories()}
                    </Menu>
                </Col>

                <Col span={18}>
                    <Row gutter={[16, 16]} style={{ padding: '16px' }}>
                        {/* <Col span={8}>
                            <Search
                                onChange={_.debounce(handleChangeSearch, 1000)}
                                placeholder='Enter text to search'
                                className={cn(styles.searchCourse)}
                            />
                        </Col> */}
                        <PageHeader
                            className='site-page-header'
                            onBack={onBack}
                            title={
                                _.find(
                                    categories,
                                    (o) => o.id.toString() === categoryId
                                )?.title
                            }
                            subTitle={selectedIelts?.title}
                        />
                    </Row>
                    {selectedIelts ? (
                        <DetailIeltsTest data={selectedIelts} />
                    ) : (
                        <>
                            <div className='site-card-wrapper'>
                                <Spin spinning={loading}>
                                    <Row
                                        gutter={[25, 25]}
                                        style={{ padding: '16px' }}
                                    >
                                        {renderIeltsTest()}
                                    </Row>
                                </Spin>
                            </div>
                            {ieltsOnlineList.length > 0 && (
                                <Row
                                    gutter={[16, 16]}
                                    style={{ padding: '16px' }}
                                    className={cn(styles['paging-end'])}
                                >
                                    <Pagination
                                        defaultCurrent={pageNumber}
                                        total={total}
                                        pageSize={pageSize}
                                        onChange={handleChangePagination}
                                        showSizeChanger={false}
                                    />
                                </Row>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Card>
    )
}
