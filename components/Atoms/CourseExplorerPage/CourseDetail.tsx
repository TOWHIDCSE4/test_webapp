import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'contexts/Auth'
import { Card, Row, Col, Empty, Layout, Table, notification } from 'antd'
import CourseAPI from 'api/CourseAPI'
import UserAPI from 'api/UserAPI'
import _ from 'lodash'
import { getTranslateText } from 'utils/translate-utils'
import { encodeFilenameFromLink } from 'utils/functions'

const { Header, Sider, Footer, Content } = Layout
const { Meta } = Card

export default function CourseDetail(props) {
    const { user } = useAuth()
    const router = useRouter()
    const [course, setCourse] = React.useState<any>({})
    const [loading, setLoading] = React.useState(true)
    const [isValuableUser, setIsValuableUser] = React.useState(false)
    const fetchCourse = useCallback((id) => {
        CourseAPI.getCoursePublicInfo(id)
            .then((res) => {
                setCourse(res)
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
    }, [])

    const checkValuable = useCallback(async () => {
        if (!_.isEmpty(user)) {
            const resp = await UserAPI.checkValuableUser()
            setIsValuableUser(resp.is_valuable)
        }
    }, [])

    useEffect(() => {
        const { id } = router.query
        if (id) {
            fetchCourse(id)
            checkValuable()
        }
    }, [router.query])
    return (
        <Card
            bordered={false}
            size='default'
            style={{ width: '80%', margin: '0 auto' }}
        >
            <Layout style={{ backgroundColor: 'white' }}>
                <Sider
                    style={{
                        height: '100%'
                    }}
                    width={300}
                >
                    <Card
                        bordered={false}
                        size='small'
                        style={{ width: 300, margin: '0 auto' }}
                        cover={
                            <a href={`/course-explorer/${course?.id}`}>
                                <img
                                    style={{ width: '300px', height: '400px' }}
                                    alt={course?.name}
                                    src={
                                        course?.image ||
                                        'https://cdn.ispeak.vn/file/ispeak/2016/07/ispeak_square_160726105336.png'
                                    }
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            'https://cdn.ispeak.vn/file/ispeak/2016/07/ispeak_square_160726105336.png'
                                    }}
                                />
                            </a>
                        }
                    >
                        <a href={`/course-explorer/${course?.id}`}>
                            <Meta
                                title={course?.name}
                                description={course?.description}
                            />
                        </a>
                    </Card>
                </Sider>
                <Content style={{ padding: '0 15px' }}>
                    <h3>{getTranslateText('home.menu.course_description')}</h3>
                    <p>{course?.description}</p>
                    <h3>{getTranslateText('home.menu.course_content')}</h3>
                    <Table
                        showHeader={false}
                        pagination={false}
                        columns={[
                            {
                                title: 'No',
                                dataIndex: 'id',
                                key: 'id',
                                fixed: 'left',
                                align: 'center',
                                render: (text, record, index) =>
                                    `Unit ${index + 1}`
                            },
                            {
                                title: 'Unit Name',
                                dataIndex: 'name',
                                key: 'name'
                            },
                            {
                                title: 'Time',
                                dataIndex: 'name',
                                key: 'name',
                                render: () => '30 mins'
                            },
                            !_.isEmpty(user) && isValuableUser
                                ? {
                                      title: 'Action',
                                      dataIndex: 'name',
                                      key: 'name',
                                      render: (index, record) => (
                                          <a
                                              href={`https://ispeak.vn/${
                                                  user?.role?.includes(1)
                                                      ? encodeFilenameFromLink(
                                                            record?.student_document
                                                        )
                                                      : encodeFilenameFromLink(
                                                            record?.teacher_document
                                                        )
                                              }`}
                                              target='_blank'
                                              rel='noreferrer'
                                          >
                                              Download
                                          </a>
                                      )
                                  }
                                : {}
                        ]}
                        dataSource={course?.units || []}
                    />
                </Content>
            </Layout>
        </Card>
    )
}
