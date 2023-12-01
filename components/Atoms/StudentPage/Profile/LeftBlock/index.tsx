import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Card, Avatar, Image, Form, Switch, notification, Popover } from 'antd'
import StudentAPI from 'api/StudentAPI'
import UserAPI from 'api/UserAPI'
import {
    GENDER,
    DEFAULT_AVATAR_STUDENT,
    STUDENT_LEVELS,
    GENDER_ENUM
} from 'const'
import { useAuth } from 'contexts/Auth'
import { notify } from 'contexts/Notification'
import _ from 'lodash'
import moment from 'moment'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { IStudent } from 'types'
import { getTranslateText } from 'utils/translate-utils'

const LeftBlock = () => {
    const [form] = Form.useForm()
    const { user, fetchUserInfo } = useAuth()
    const [studentInfo, setStudentInfo] = useState<IStudent>()
    const [loading, setLoading] = useState(false)
    const fetchStudentInfo = () => {
        StudentAPI.getStudentInfo().then((res) => setStudentInfo(res))
    }
    useEffect(() => {
        fetchStudentInfo()
    }, [])

    useEffect(() => {
        if (user) {
            form.setFieldValue(
                'enable_send_email',
                user?.is_enable_receive_mail
            )
        }
    }, [user])

    const updateToggleSendMail = useCallback(async (v) => {
        try {
            setLoading(true)
            await UserAPI.editUserInfo({ is_enable_receive_mail: v })
            notify('success', 'Update successfully')
            await fetchUserInfo()
        } catch (err) {
            notification.error({
                message: 'Error',
                description: err.message
            })
        } finally {
            setLoading(false)
        }
    }, [])

    return (
        <>
            <Card>
                <div className='text-center'>
                    <Avatar
                        alt={user.full_name}
                        size={85}
                        src={
                            <Image
                                src={user?.avatar || DEFAULT_AVATAR_STUDENT}
                                fallback={DEFAULT_AVATAR_STUDENT}
                                alt={user.full_name}
                                width={85}
                                preview={false}
                            />
                        }
                    />
                </div>
                <h4
                    className='m-t-10 text-center'
                    style={{ marginBottom: '0px', color: '#0E2D63' }}
                >
                    <strong>{user?.full_name}</strong>
                </h4>
                <p style={{ color: '#0E2D63' }} className='text-center'>
                    {getTranslateText('student.dashboard.achievement.level')}
                    <span> </span>
                    <strong>
                        {studentInfo?.student_level_id || 0}{' '}
                        {
                            _.find(
                                STUDENT_LEVELS,
                                (o) =>
                                    o.id ===
                                    (studentInfo?.student_level_id || 0)
                            ).name
                        }
                    </strong>
                </p>
                <div className='row'>
                    <div className='col-12'>
                        <ul
                            className='social-links list-unstyled d-flex justify-content-center'
                            style={{ marginBottom: 0 }}
                        >
                            <li className='mr-2'>
                                <a title='facebook' href='#'>
                                    <i className='zmdi zmdi-facebook' />
                                </a>
                            </li>
                            <li className='ml-2'>
                                <a title={user?.skype_account} href='#'>
                                    <i className='zmdi zmdi-hc-fw'></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='align-left'>
                    <hr />
                    <small className='text-muted'>
                        {getTranslateText('username')}
                    </small>
                    <p>{user?.username}</p>
                    <hr />
                    <small className='text-muted'>
                        {getTranslateText('email')}{' '}
                        {user && user.is_verified_email && (
                            <span
                                style={{
                                    color: '#52C41A',
                                    fontSize: 16,
                                    marginLeft: 8
                                }}
                            >
                                <Popover
                                    content={getTranslateText(
                                        'student.verified_email'
                                    )}
                                >
                                    <CheckCircleOutlined />
                                </Popover>
                            </span>
                        )}
                    </small>
                    <div>{user.email}</div>
                    {user && !user.is_verified_email && (
                        <div style={{ color: '#ff4d4f' }}>
                            <WarningOutlined />{' '}
                            <span>
                                {getTranslateText('student.email_not_verify')}
                            </span>
                        </div>
                    )}
                    <hr />
                    <small className='text-muted'>
                        {getTranslateText('phone_number')}
                    </small>
                    <p>{user.phone_number}</p>
                    <hr />
                    <small className='text-muted'>
                        {getTranslateText('gender')}
                    </small>
                    <p>
                        {user?.gender === GENDER_ENUM.MALE
                            ? getTranslateText('common.gender.male')
                            : user?.gender === GENDER_ENUM.FEMALE
                            ? getTranslateText('common.gender.female')
                            : user?.gender === GENDER_ENUM.OTHER
                            ? getTranslateText('common.gender.other')
                            : ''}
                    </p>
                    <hr />
                    <small className='text-muted'>
                        {getTranslateText('date_of_birth')}
                    </small>
                    <p>
                        {user?.date_of_birth &&
                            moment(user.date_of_birth).format('DD-MM-YYYY')}
                    </p>

                    {user?.trial_class_skype_url?.joinLink &&
                        !user?.skype_account && (
                            <>
                                <hr />
                                <small className='text-muted'>
                                    {getTranslateText('skype_link')}
                                </small>
                                <p>
                                    <a
                                        href={
                                            user?.trial_class_skype_url.joinLink
                                        }
                                        rel='noreferrer'
                                    >
                                        {user?.trial_class_skype_url.joinLink}
                                    </a>
                                </p>
                            </>
                        )}
                </div>
                {user && user.is_verified_email && (
                    <>
                        <hr />
                        <small className='text-muted'>
                            {getTranslateText(
                                'student.label_toggle_disable_send_email'
                            )}
                        </small>
                        <Form
                            name='basic'
                            layout='vertical'
                            form={form}
                            initialValues={{
                                disable_send_email: user?.is_enable_receive_mail
                            }}
                        >
                            <Form.Item
                                labelAlign='left'
                                name='enable_send_email'
                                valuePropName='checked'
                            >
                                <Switch onChange={updateToggleSendMail} />
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Card>
        </>
    )
}

export default LeftBlock
