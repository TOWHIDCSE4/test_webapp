/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
    Form,
    Input,
    Button,
    notification,
    Select,
    Space,
    Image,
    Tooltip,
    Alert
} from 'antd'
import cn from 'classnames'
import { FC, memo, useState, useEffect } from 'react'
import { useAuth } from 'contexts/Auth'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { ISignUp } from 'types'
import { AUTH_TYPES } from 'const/auth-type'
import LocationAPI from 'api/LocationAPI'
import { useGoogleLogin } from 'react-google-login'
import { getTranslateText } from 'utils/translate-utils'
import { PATTERN_PHONE_NUMBER } from 'const'
import * as store from 'helpers/storage'
import { getCookie } from 'helpers/cookie'
import UserAPI from 'api/UserAPI'
import { useRouter } from 'next/router'
import styles from '../Login/Login.module.scss'

const { Option } = Select
const CLIENT_ID: any = process.env.NEXT_PUBLIC_CLIENT_ID
/**
 * Note to IS-115: Please update accordingly
 */
const LOCATIONS_LOCALE_MAPPING = {
    '172': 'United Kingdom, American, Canada',
    '170': 'Asia',
    '171': 'Europe',
    '168': 'Vietnam',
    '1': 'Other'
}

interface Props {
    toLogIn: () => void
    authType: string
}

const SignUp: FC<Props> = (props) => {
    const { toLogIn, authType } = props
    const {
        isLoading,
        signUp,
        becomeATeacher,
        becomeATeacherByGoogle,
        onFailure
    } = useAuth()
    const [locations, setLocations] = useState([])
    const [message, setMessage] = useState('')
    const [userCrm, setDataUserCrm] = useState(null)
    const [form] = Form.useForm()
    const locale = getCookie('locale')
    const router = useRouter()

    form.setFieldsValue({ ref_code: store.get('ref_code') })

    const getLocations = () => {
        LocationAPI.getLocations()
            .then((res) => {
                /**
                 * Note to IS-115: Please update accordingly
                 */
                const translatedLocations = (res.data || []).map(
                    (location) => ({
                        ...location,
                        name: LOCATIONS_LOCALE_MAPPING[location.id] || ''
                    })
                )
                setLocations(translatedLocations)
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
    }

    const onSuccessSignGoogleTeacher = async (response: any) => {
        const location: any = locations?.find(
            (l: any) => l?.name?.includes('US') || l?.name?.includes('Anh')
        )
        const location_id = location?.id || locations[0] || null
        becomeATeacherByGoogle &&
            becomeATeacherByGoogle({
                id_token: response?.tokenId,
                location_id
            })
    }

    const { signIn } = useGoogleLogin({
        onSuccess: onSuccessSignGoogleTeacher,
        clientId: CLIENT_ID,
        onFailure
    })

    const getDataUserCrm = (crm_user_id: string) => {
        const crm_user_id_cache = crm_user_id
        UserAPI.getDataUserCrmCache({ crm_user_id_cache })
            .then((res) => {
                if (res.data) {
                    setDataUserCrm(res.data)
                    form.setFieldValue('first_name', res.data.first_name)
                    form.setFieldValue('last_name', res.data.last_name)
                    form.setFieldValue('username', res.data.username)
                    form.setFieldValue('email', res.data.email)
                    form.setFieldValue('phone_number', res.data.phone_number)
                    form.setFieldValue('password', res.data.password)
                }
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const crmUserId: any = router.query.crm_user_id
        if (crmUserId && authType === AUTH_TYPES.SIGNUP) {
            getDataUserCrm(crmUserId)
        }
        if (authType === AUTH_TYPES.BECOME_A_TEACHER) getLocations()
    }, [authType, router.query])

    const handleSignUp = async (values: ISignUp) => {
        if (authType === AUTH_TYPES.SIGNUP && signUp) {
            // nếu url chứa username user crm thỳ đăng ký thêm info user crm
            if (userCrm && router.query.crm_user_id) {
                values.crm_user_id = userCrm.crm_user_id
            }
            const data = await signUp(values)
            // eslint-disable-next-line @typescript-eslint/no-shadow
            let message = ''
            if (data && data.user) {
                message = `Register successfuly.`
                // notification.success({
                //     message: 'Success',
                //     description: getTranslateText('auth.register_success')
                // })
            }
            if (data && data.user && !data.user.is_verify_phone) {
                if (locale === 'vi') {
                    router.push(`/vi/verify-phone?user_id=${data.user.id}`)
                } else {
                    router.push(`/verify-phone?user_id=${data.user.id}`)
                }
                // message = `A verification link has been sent to your email. Please click on the link that has just been sent to your email account to verify your email and continue the registration process`
            }
            setMessage(message)
        }
        if (authType === AUTH_TYPES.BECOME_A_TEACHER && becomeATeacher)
            await becomeATeacher(values)
    }

    const renderLocations = () =>
        locations.map((item: any, index) => (
            <Option key={index} value={item.id}>
                {item.name}
            </Option>
        ))

    return (
        <>
            <Form
                name='signUpForm'
                className={cn(styles['register-form'])}
                onFinish={handleSignUp}
                form={form}
            >
                {message ? (
                    <Alert
                        message='Success'
                        description={<span>{message}</span>}
                        type='success'
                        showIcon
                        style={{ marginBottom: '1rem' }}
                    />
                ) : (
                    <></>
                )}
                <div>
                    <span className={cn(styles['landing-page-label-form'])}>
                        {getTranslateText('register.label.first_name')}
                    </span>
                    <span className={styles.requiredField}>*</span>
                </div>
                <Form.Item
                    name='first_name'
                    className='mb-4'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText('input_first_name')
                        }
                    ]}
                >
                    <Input className={styles.customInput} />
                </Form.Item>

                <div>
                    <span className={cn(styles['landing-page-label-form'])}>
                        {getTranslateText('register.label.last_name')}
                    </span>
                    <span className={styles.requiredField}>*</span>
                </div>
                <Form.Item
                    name='last_name'
                    className='mb-4'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText('input_last_name')
                        }
                    ]}
                >
                    <Input className={styles.customInput} />
                </Form.Item>

                <div>
                    <span className={cn(styles['landing-page-label-form'])}>
                        {getTranslateText('register.label.user_name')}
                    </span>
                    <span className={styles.requiredField}>*</span>
                </div>
                <Form.Item
                    name='username'
                    className='mb-4'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText('input_username')
                        }
                    ]}
                >
                    <Input className={styles.customInput} />
                </Form.Item>

                <div>
                    <span className={cn(styles['landing-page-label-form'])}>
                        {getTranslateText('register.label.email')}
                    </span>
                    <span className={styles.requiredField}>*</span>
                </div>
                <Form.Item
                    name='email'
                    className='mb-4'
                    rules={[
                        {
                            type: 'email',
                            message: getTranslateText('input_not_valid_email')
                        },
                        {
                            required: true,
                            message: getTranslateText('input_email')
                        }
                    ]}
                >
                    <Input className={styles.customInput} type='email' />
                </Form.Item>

                <div>
                    <span className={cn(styles['landing-page-label-form'])}>
                        {getTranslateText('register.label.phone')}
                    </span>
                    <span className={styles.requiredField}>*</span>
                </div>
                <Form.Item
                    name='phone_number'
                    className='mb-4'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText('input_phone')
                        },
                        {
                            pattern: PATTERN_PHONE_NUMBER,
                            message: `${getTranslateText(
                                'form.basic_info.invalid_phone_number'
                            )}`
                        }
                    ]}
                >
                    <Input className={styles.customInput} />
                </Form.Item>

                <div>
                    <span className={cn(styles['landing-page-label-form'])}>
                        {getTranslateText('register.label.password')}
                    </span>
                    <span className={styles.requiredField}>*</span>
                </div>
                <Form.Item
                    name='password'
                    className='mb-4'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText('input_password')
                        }
                    ]}
                >
                    <Input.Password
                        className={styles.customInputPassword}
                        type='password'
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>
                <div>
                    <span className={cn(styles['landing-page-label-form'])}>
                        {getTranslateText('register.label.confirm_password')}
                    </span>
                    <span className={styles.requiredField}>*</span>
                </div>
                <Form.Item
                    name='confirm_password'
                    className='mb-4'
                    rules={[
                        {
                            required: true,
                            message: getTranslateText('input_confirm_password')
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('password') === value
                                ) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(
                                    new Error(
                                        getTranslateText(
                                            'input_confirm_password_not_match'
                                        )
                                    )
                                )
                            }
                        })
                    ]}
                >
                    <Input.Password
                        className={styles.customInputPassword}
                        type='password'
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                {authType === AUTH_TYPES.BECOME_A_TEACHER && (
                    <>
                        <div>
                            <span
                                className={cn(
                                    styles['landing-page-label-form']
                                )}
                            >
                                {getTranslateText('register.label.location')}
                            </span>
                            <span className={styles.requiredField}>*</span>
                        </div>
                        <Form.Item
                            name='location_id'
                            className='mb-4'
                            rules={[
                                {
                                    required: true,
                                    message: getTranslateText('input_location')
                                }
                            ]}
                        >
                            <Select
                                className={
                                    styles['register-form__select-location']
                                }
                            >
                                {renderLocations()}
                            </Select>
                        </Form.Item>

                        <div>
                            <span
                                className={cn(
                                    styles['landing-page-label-form']
                                )}
                            >
                                {getTranslateText(
                                    'register.label.referral_code'
                                )}
                            </span>
                        </div>
                        <Form.Item name='ref_code' className='mb-4'>
                            <Input className={styles.customInput} />
                        </Form.Item>
                    </>
                )}
                <div
                    className={cn(
                        styles.PolicyNote,
                        styles['PolicyNote-desktop']
                    )}
                >
                    <span className={cn(styles['PolicyNote-note'])}>
                        <span
                            className='text-black font-weight-bold fs-12'
                            style={{ fontWeight: 'bold', fontSize: '12px' }}
                        >
                            {getTranslateText('register.desc')}
                            <a
                                target='_blank'
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    color: '#1FC974'
                                }}
                                rel='noreferrer'
                                href='https://class.ispeak.vn/quyen-loi'
                            >
                                {' '}
                                {getTranslateText('register.terms_of_service')}
                            </a>{' '}
                            {getTranslateText('and')}{' '}
                            <a
                                target='_blank'
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    color: '#1FC974'
                                }}
                                rel='noreferrer'
                                href='https://class.ispeak.vn/bao-mat'
                            >
                                {getTranslateText('register.privacy_policy')}
                            </a>
                        </span>
                    </span>
                </div>
                <Form.Item className='mb-3'>
                    <Button
                        htmlType='submit'
                        className={cn(styles['landing-page-button'])}
                        loading={isLoading}
                    >
                        {getTranslateText('register.sign_up')}
                    </Button>
                </Form.Item>
            </Form>
            {authType === AUTH_TYPES.BECOME_A_TEACHER ? (
                <div className='mb-3 small-secondary text-center'>
                    <span
                        className='mr-2 gray-3'
                        style={{ fontWeight: 'bold' }}
                    >
                        {getTranslateText('ready_have_an_account')}?
                    </span>{' '}
                    <span
                        role='button'
                        className={styles.signupTT}
                        onClick={toLogIn}
                        style={{
                            cursor: 'pointer',
                            color: '#1a61ae',
                            fontWeight: 'bold'
                        }}
                    >
                        {getTranslateText('login_now')}
                    </span>
                </div>
            ) : (
                <div className='mb-3 small-secondary text-center'>
                    <span
                        className='mr-2 gray-3'
                        style={{ fontWeight: 'bold' }}
                    >
                        {getTranslateText('ready_have_an_account')}?
                    </span>{' '}
                    <a
                        href={`${locale === 'en' ? '/en/login' : '/vi/login'}`}
                        className={styles.signupTT}
                        style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: '#1a61ae'
                        }}
                    >
                        {getTranslateText('login_now')}
                    </a>
                </div>
            )}

            {/* {authType === AUTH_TYPES.BECOME_A_TEACHER && (
                <div className={cn('text-center')}>
                    <Space size={24}>
                        <Image
                            src='/static/img/teacher/dashboard/google.svg'
                            width={40}
                            preview={false}
                            style={{ cursor: 'pointer' }}
                            className='clickable'
                            onClick={signIn}
                        />
                    </Space>
                </div>
            )} */}
        </>
    )
}

export default memo(SignUp)
