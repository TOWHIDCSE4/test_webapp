/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-danger */
import cn from 'classnames'
import { Row, Col, Card, Tabs, Button, Space, Avatar } from 'antd'
import { DEFAULT_AVATAR } from 'const/common'
import { getTranslateText } from 'utils/translate-utils'
import { FC, memo, useEffect, useState } from 'react'
import { nl2br } from 'utils/string-utils'
import { ITeacher } from 'types'
import _ from 'lodash'
import styles from './TeacherCard.module.scss'
import TeacherTimeBox from './TeacherTimeBox'

const { TabPane } = Tabs
type Props = {
    data: ITeacher
    onBooking: (item: ITeacher) => void
    disabledBtnBooking?: boolean
    time: any
}

const TeacherCard: FC<Props> = ({
    data,
    onBooking,
    disabledBtnBooking = false,
    time
}) => (
    <Card className={cn(styles['teacher-card'])}>
        <Row gutter={20}>
            <Col md={12}>
                <Row>
                    <Col md={12} sm={12} lg={8} span={8}>
                        <Space direction='vertical' align='center'>
                            <Avatar
                                src={data?.user_info?.avatar || DEFAULT_AVATAR}
                                alt='Avatar teacher'
                                size={{
                                    xs: 120,
                                    sm: 150,
                                    md: 80,
                                    lg: 100,
                                    xl: 120,
                                    xxl: 160
                                }}
                            />
                            {!disabledBtnBooking && (
                                <Button
                                    className={cn(styles['btn-book'])}
                                    onClick={() => onBooking(data)}
                                    disabled={disabledBtnBooking}
                                >
                                    {getTranslateText('home.how.booking')}
                                </Button>
                            )}
                        </Space>
                    </Col>
                    <Col md={12} sm={12} lg={16} span={16}>
                        <Card
                            bordered={false}
                            className={cn(styles['teacher-info'])}
                        >
                            <b className='blue3'>
                                {data?.user_info?.full_name}
                            </b>
                            <p className={cn(styles.from)}>
                                {getTranslateText(
                                    'student.find_a_teacher.from'
                                )}
                                <span className='ml-2'>
                                    {data?.location?.name}
                                </span>
                            </p>
                            {/* <b className={cn(styles.skill)}>
                                {getTranslateText(
                                    'student.find_a_teacher.skill'
                                )}
                            </b>
                            <span>English</span>
                            <br /> */}

                            {data && data.average_rating > 0 && (
                                <>
                                    <b className={cn(styles.rating)}>
                                        {getTranslateText(
                                            'student.find_a_teacher.rating'
                                        )}
                                    </b>
                                    <span className='yellow2'>
                                        {data
                                            ? _.round(data.average_rating, 2)
                                            : 0}
                                        <i className='zmdi zmdi-hc-fw ml-1'>
                                            
                                        </i>
                                    </span>
                                    <br />
                                </>
                            )}
                            <b>
                                {getTranslateText(
                                    'student.find_a_teacher.taught'
                                )}
                            </b>
                            <span>
                                {data ? data.total_lesson : 0}{' '}
                                {getTranslateText('lessons')}
                            </span>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col md={12}>
                <Tabs defaultActiveKey='1'>
                    <TabPane tab={getTranslateText('about')} key='1'>
                        {data.about_me && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: nl2br(data.about_me.slice(0, 255))
                                }}
                                className={cn(styles['about-me'])}
                            />
                        )}
                        <div>
                            <Row gutter={24}>
                                {data?.teaching_certificate?.tesol && (
                                    <Col
                                        md={12}
                                        sm={12}
                                        lg={8}
                                        xl={8}
                                        xxl={6}
                                        span={8}
                                    >
                                        <a
                                            href={
                                                data.teaching_certificate?.tesol
                                            }
                                            style={{ fontSize: 12 }}
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {getTranslateText(
                                                'student.find_a_teacher.tesol_certificate'
                                            )}
                                        </a>
                                    </Col>
                                )}
                                {data?.teaching_certificate?.tefl && (
                                    <Col
                                        md={12}
                                        sm={12}
                                        lg={8}
                                        xl={8}
                                        xxl={6}
                                        span={8}
                                    >
                                        <a
                                            href={
                                                data.teaching_certificate?.tefl
                                            }
                                            style={{ fontSize: 12 }}
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {getTranslateText(
                                                'student.find_a_teacher.tefl_certificate'
                                            )}
                                        </a>
                                    </Col>
                                )}
                                {data?.english_certificate?.ielts && (
                                    <Col md={12} sm={12} lg={8} xl={8} xxl={6}>
                                        <a
                                            href={
                                                data.english_certificate?.ielts
                                            }
                                            style={{ fontSize: 12 }}
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {getTranslateText(
                                                'student.find_a_teacher.ielts_certificate'
                                            )}
                                        </a>
                                    </Col>
                                )}
                                {data?.english_certificate?.toeic && (
                                    <Col md={12} sm={12} lg={8} xl={8} xxl={6}>
                                        <a
                                            href={
                                                data.english_certificate?.toeic
                                            }
                                            style={{ fontSize: 12 }}
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {getTranslateText(
                                                'student.find_a_teacher.toeic_certificate'
                                            )}
                                        </a>
                                    </Col>
                                )}
                                {data?.degree && (
                                    <Col md={12} sm={12} lg={8} xl={8} xxl={6}>
                                        <a
                                            href={data.degree}
                                            style={{ fontSize: 12 }}
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {getTranslateText(
                                                'student.find_a_teacher.degree'
                                            )}
                                        </a>
                                    </Col>
                                )}
                                {data?.intro_video && (
                                    <Col md={12} sm={12} lg={8} xl={8} xxl={6}>
                                        <a
                                            href={data.intro_video}
                                            style={{ fontSize: 12 }}
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {getTranslateText(
                                                'student.find_a_teacher.intro_video'
                                            )}
                                        </a>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </TabPane>
                    <TabPane tab={getTranslateText('schedule')} key='2'>
                        <TeacherTimeBox time={time} teacher={data?.user_info} />
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    </Card>
)

export default memo(TeacherCard)
