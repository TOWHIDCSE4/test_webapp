import BlockHeader from 'components/Atoms/StudentPage/BlockHeader'
import { Row, Col, Card, Divider, Empty } from 'antd'
import ProgressSkill from 'components/Atoms/StudentPage/ProgressSkill'
import cn from 'classnames'
import { getTranslateText } from 'utils/translate-utils'
import AlertEventNotice from 'components/Atoms/AlertEventNotice'
import { useEffect, useState } from 'react'
import NotificationAPI from 'api/NotificationAPI'
import { INotification, IStudent } from 'types'
import { FULL_DATE_FORMAT, STUDENT_LEVELS } from 'const'
import moment from 'moment'
import { sanitize } from 'utils/string-utils'
import _ from 'lodash'
import StudentAPI from 'api/StudentAPI'
import { sanitizeMessage } from 'utils/notification'
import styles from './Dashboard.module.scss'

const Dashboard = () => {
    const [notifications, setNotifications] = useState<INotification[]>([])
    const [studentInfo, setStudentInfo] = useState<IStudent>()

    const fetchNotifications = async (query: {
        page_size: number
        page_number: number
    }) => {
        const result = await NotificationAPI.getNotifications(query)
        const newNotis = [...notifications, ...result.data]
        setNotifications(newNotis)
    }

    const fetchStudentInfo = () => {
        StudentAPI.getStudentInfo().then((res) => setStudentInfo(res))
    }

    useEffect(() => {
        fetchNotifications({ page_number: 1, page_size: 20 })
        fetchStudentInfo()
    }, [])

    const renderNoti = () => {
        if (notifications.length > 0) {
            return notifications.map((item, index) => (
                <div key={index}>
                    <a href='#'>
                        <a
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: sanitizeMessage(item)
                            }}
                        />
                    </a>
                    <span
                        title={moment(item.created_time).format(
                            FULL_DATE_FORMAT
                        )}
                        style={{ cursor: 'default' }}
                    >
                        {item.created_time &&
                            moment(item.created_time).fromNow()}
                    </span>
                    <Divider className={cn(styles.diver)} />
                </div>
            ))
        }

        return <Empty />
    }

    return (
        <>
            <AlertEventNotice />
            {/* <BlockHeader title={getTranslateText('student.dashboard')} /> */}
            <div>
                {/* <Row gutter={[30, 30]}>
                    <Col md={12} lg={8} span={12}>
                        <ProgressSkill
                            title={getTranslateText(
                                'student.dashboard.vocab'
                            )}
                            percent={45}
                            color='#42CED5'
                        />
                    </Col>
                    <Col md={12} lg={8} span={12}>
                        <ProgressSkill
                            title={getTranslateText(
                                'student.dashboard.grammar'
                            )}
                            percent={55}
                            color='#FC7166'
                        />
                    </Col>
                    <Col md={12} lg={8} span={12}>
                        <ProgressSkill
                            title={getTranslateText(
                                'student.dashboard.listen'
                            )}
                            percent={75}
                            color='#FDC265'
                        />
                    </Col>
                    <Col md={12} lg={8} span={12}>
                        <ProgressSkill
                            title={getTranslateText(
                                'student.dashboard.speak'
                            )}
                            percent={100}
                            color='#7550BD'
                        />
                    </Col>
                    <Col md={12} lg={8} span={12}>
                        <ProgressSkill
                            title={getTranslateText(
                                'student.dashboard.read'
                            )}
                            percent={68}
                        />
                    </Col>
                    <Col md={12} lg={8} span={12}>
                        <ProgressSkill
                            title={getTranslateText(
                                'student.dashboard.write'
                            )}
                            percent={65}
                            color='#31b46a'
                        />
                    </Col>
                </Row> */}
                <Row gutter={30}>
                    <Col style={{ width: '-webkit-fill-available' }}>
                        <div className={cn(styles.header)}>
                            <h2>
                                <strong>
                                    {getTranslateText(
                                        'student.dashboard.notice'
                                    )}
                                </strong>
                            </h2>
                        </div>
                        <Card
                            className={cn(styles.card, styles['notice-body'])}
                        >
                            {renderNoti()}
                        </Card>
                    </Col>
                    {/* <Col md={7} lg={7} sm={24}>
                        <div className={cn(styles.header)}>
                            <h2>
                                <strong>
                                    {getTranslateText(
                                        'student.dashboard.homework'
                                    )}
                                </strong>
                            </h2>
                        </div>
                        <Card
                            className={cn(styles.card, styles['card-disable'])}
                        >
                            <p>
                                {getTranslateText(
                                    'student.dashboard.homework.done'
                                )}
                                <span className='blue2 float-right'>+43%</span>
                            </p>
                            <Divider className={cn(styles.diver)} />
                            <p>
                                {getTranslateText(
                                    'student.dashboard.homework.pending'
                                )}
                                <span className='red2 float-right'>+43%</span>
                            </p>
                            <Divider className={cn(styles.diver)} />
                            <p>
                                {getTranslateText(
                                    'student.dashboard.homework.new'
                                )}
                                <span className='yellow2 float-right'>
                                    +43%
                                </span>
                            </p>
                        </Card>
                    </Col>
                    <Col md={7} lg={7} sm={24}>
                        <div className={cn(styles.header)}>
                            <h2>
                                <strong>
                                    {getTranslateText(
                                        'student.dashboard.exam'
                                    )}
                                </strong>
                            </h2>
                        </div>
                        <Card
                            className={cn(styles.card, styles['card-disable'])}
                        >
                            <p>
                                {getTranslateText(
                                    'student.dashboard.exam.done'
                                )}
                                <span className='blue2 float-right'>+43%</span>
                            </p>
                            <Divider className={cn(styles.diver)} />
                            <p>
                                {getTranslateText(
                                    'student.dashboard.exam.notReached'
                                )}
                                <span className='red2 float-right'>+43%</span>
                            </p>
                            <Divider className={cn(styles.diver)} />
                            <p>
                                {getTranslateText(
                                    'student.dashboard.exam.reached'
                                )}
                                <span className='yellow2 float-right'>
                                    +43%
                                </span>
                            </p>
                        </Card>
                    </Col> */}
                </Row>
                {/* <Row>
                    <Col span={24}>
                        <div className={cn(styles.header)}>
                            <h2>
                                <strong>
                                    {getTranslateText(
                                        'student.dashboard.statistic'
                                    )}
                                </strong>
                            </h2>
                        </div>
                        <Card
                            className={cn(styles.card, styles['card-disable'])}
                        >
                            <p>
                                {getTranslateText(
                                    'student.dashboard.statistic.charthere'
                                )}
                            </p>
                        </Card>
                    </Col>
                </Row> */}
                <Row>
                    <Col span={24}>
                        <div className={cn(styles.header)}>
                            <h2>
                                <strong>
                                    {getTranslateText(
                                        'student.dashboard.achievement'
                                    )}
                                </strong>
                            </h2>
                        </div>
                        <Card className={cn(styles.card)}>
                            <Row>
                                <Col md={8}>
                                    <p>
                                        <i className='zmdi zmdi-hc-fw'></i>{' '}
                                        {getTranslateText(
                                            'student.dashboard.achievement.level'
                                        )}{' '}
                                        <strong>
                                            {studentInfo?.student_level_id || 0}{' '}
                                            {
                                                _.find(
                                                    STUDENT_LEVELS,
                                                    (o) =>
                                                        o.id ===
                                                        (studentInfo?.student_level_id ||
                                                            0)
                                                ).name
                                            }
                                        </strong>
                                    </p>
                                    <p>
                                        <i className='zmdi zmdi-hc-fw'></i>{' '}
                                        {getTranslateText(
                                            'student.dashboard.achievement.star'
                                        )}{' '}
                                        <strong>99</strong>
                                    </p>
                                </Col>
                                <Col md={8}>
                                    <p>
                                        <i className='zmdi zmdi-hc-fw'></i>{' '}
                                        {getTranslateText(
                                            'student.dashboard.achievement.needMore'
                                        )}{' '}
                                        <strong>
                                            1612{' '}
                                            {getTranslateText(
                                                'student.dashboard.achievement.point'
                                            )}
                                        </strong>{' '}
                                        {getTranslateText(
                                            'student.dashboard.achievement.toUp'
                                        )}
                                    </p>
                                    <p>
                                        <i className='zmdi zmdi-hc-fw'></i>{' '}
                                        {getTranslateText(
                                            'student.dashboard.achievement.candy'
                                        )}{' '}
                                        <strong>1620</strong>
                                    </p>
                                </Col>
                                <Col md={8}>
                                    <p>
                                        <i className='zmdi zmdi-hc-fw'></i>{' '}
                                        {getTranslateText(
                                            'student.dashboard.achievement.point'
                                        )}{' '}
                                        <strong>33.542</strong>
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Dashboard
