import React, { useEffect, useState } from 'react'
import { notify } from 'contexts/Notification'
import {
    Image,
    Upload,
    notification,
    Form,
    Input,
    Select,
    DatePicker,
    Row,
    Col,
    InputNumber
} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import UploadAPI from 'api/UploadAPI'
import CountryAPI from 'api/CountryAPI'
import { DEFAULT_AVATAR_STUDENT } from 'const/common'
import _ from 'lodash'
import moment from 'moment'
import { getTranslateText } from 'utils/translate-utils'
import { useAuth } from 'contexts/Auth'
import UserAPI from 'api/UserAPI'
import { DATE_FORMAT, GENDER_ENUM, PATTERN_PHONE_NUMBER } from 'const'

const { Option } = Select
const { TextArea } = Input

const GeneralInformation = () => {
    const { user, fetchUserInfo } = useAuth()
    const [form] = Form.useForm()
    const [countries, setCountries] = useState([])
    const [timeZones, setTimeZones] = useState([])
    const [preview, setPreview] = useState(DEFAULT_AVATAR_STUDENT)
    const [fileUpload, setFileUpload] = useState()
    const [loading, setLoading] = useState(false)

    const getCountries = () => {
        CountryAPI.getCountries()
            .then((res: any) => setCountries(res))
            .catch((err: any) => notify('error', err.message))
    }

    const getTimeZones = () => {
        CountryAPI.getTimeZones()
            .then((res: any) => setTimeZones(res))
            .catch((err: any) => notify('error', err.message))
    }

    useEffect(() => {
        getCountries()
        getTimeZones()
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            ...user,
            date_of_birth: user.date_of_birth
                ? moment(user.date_of_birth)
                : null
        })
        setPreview(user?.avatar)
    }, [user])

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
            notification.error({
                message: 'Error',
                description: getTranslateText('can_upload_jpg_png')
            })
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            notification.error({
                message: 'Error',
                description: getTranslateText('image_2mb')
            })
        }
        return isJpgOrPng && isLt2M
    }

    const uploadButton = (
        <>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className='ml-1'>{getTranslateText('upload')}</div>
        </>
    )

    const onChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (imageUrl) => {
                setPreview(imageUrl)
                setLoading(false)
            })
            setFileUpload(info.file.originFileObj)
        }
    }

    const uploadAvatar = async (_file) => {
        const res = await UploadAPI.uploadImage(_file)
        return res
    }

    const onSaveProfile = async (_values) => {
        const payload = { ..._values }
        if (fileUpload) {
            try {
                const resUpload = await uploadAvatar(fileUpload)
                payload.avatar = resUpload
                setLoading(true)
                await UserAPI.editUserInfo(payload)
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
        } else {
            try {
                setLoading(true)
                await UserAPI.editUserInfo(payload)
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
        }
    }

    const renderCountry = () =>
        Object.keys(countries).map((item, index) => (
            <Option key={item} value={item}>
                {_.get(countries[item], 'name')}
            </Option>
        ))

    const renderCurrency = () =>
        Object.keys(countries).map((item, index) => (
            <Option key={item} value={_.get(countries[item], 'currency')}>
                {_.get(countries[item], 'currency')}
            </Option>
        ))

    const renderTimeZone = () =>
        timeZones.map((item: any, index) => (
            <Option key={index} value={item.vl}>
                {item.t}
            </Option>
        ))
    return (
        <>
            <strong className='block mb-3'>
                {getTranslateText('form.basic_info.update_personal_info')}
            </strong>
            <Form
                form={form}
                name='info-user'
                onFinish={onSaveProfile}
                labelAlign='right'
                layout='vertical'
                labelCol={{ span: 22 }}
                wrapperCol={{ span: 24 }}
                className='p-5'
            >
                <Upload
                    name='avatar'
                    listType='picture-card'
                    accept='image/gif,image/jpeg,image/png,image/jpg'
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                    className='d-flex justify-content-center'
                >
                    {preview ? (
                        <Image
                            src={preview}
                            fallback={DEFAULT_AVATAR_STUDENT}
                            preview={false}
                            width='100%'
                        />
                    ) : (
                        uploadButton
                    )}
                </Upload>
                <small
                    className='d-flex justify-content-center mb-3 mt-3'
                    style={{ color: '#ff4d4f', fontStyle: 'italic' }}
                >
                    {getTranslateText('form.warning_image')}
                </small>
                <Row gutter={[20, 20]}>
                    <Col span={12}>
                        <Form.Item
                            name='first_name'
                            label={getTranslateText(
                                'form.basic_info.first_name'
                            )}
                            rules={[
                                {
                                    required: true,
                                    message: `${getTranslateText(
                                        'form.basic_info.first_name'
                                    )} ${getTranslateText('is_required')}`
                                }
                            ]}
                        >
                            <Input
                                placeholder={getTranslateText(
                                    'form.basic_info.first_name'
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='last_name'
                            label={getTranslateText(
                                'form.basic_info.last_name'
                            )}
                            rules={[
                                {
                                    required: true,
                                    message: `${getTranslateText(
                                        'form.basic_info.last_name'
                                    )} ${getTranslateText('is_required')}`
                                }
                            ]}
                        >
                            <Input
                                placeholder={getTranslateText(
                                    'form.basic_info.last_name'
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[20, 20]}>
                    <Col span={12}>
                        <Form.Item
                            name='phone_number'
                            label={getTranslateText(
                                'form.basic_info.phone_number'
                            )}
                            rules={[
                                {
                                    required: true,
                                    message: `${getTranslateText(
                                        'form.basic_info.phone_number'
                                    )} ${getTranslateText('is_required')}`
                                },
                                {
                                    pattern: PATTERN_PHONE_NUMBER,
                                    message: `${getTranslateText(
                                        'form.basic_info.invalid_phone_number'
                                    )}`
                                }
                            ]}
                        >
                            <Input
                                placeholder={getTranslateText(
                                    'form.basic_info.phone_number'
                                )}
                                className='w-100'
                                disabled
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='date_of_birth'
                            label={getTranslateText(
                                'form.basic_info.date_of_birth'
                            )}
                            rules={[
                                {
                                    required: true,
                                    message: `${getTranslateText(
                                        'form.basic_info.date_of_birth'
                                    )} ${getTranslateText('is_required')}`
                                }
                            ]}
                        >
                            <DatePicker
                                placeholder={getTranslateText(
                                    'form.basic_info.date_of_birth'
                                )}
                                className='w-100'
                                format={DATE_FORMAT}
                                allowClear={false}
                                disabledDate={(current) =>
                                    current >= moment().subtract(5, 'years')
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[20, 20]}>
                    <Col span={12}>
                        <Form.Item
                            name='gender'
                            label={getTranslateText('form.basic_info.gender')}
                            rules={[
                                {
                                    required: true,
                                    message: `${getTranslateText(
                                        'form.basic_info.gender'
                                    )} ${getTranslateText('is_required')}`
                                }
                            ]}
                        >
                            <Select
                                placeholder={getTranslateText(
                                    'form.basic_info.choose_gender'
                                )}
                            >
                                <Option value={GENDER_ENUM.MALE}>
                                    {getTranslateText('common.gender.male')}
                                </Option>
                                <Option value={GENDER_ENUM.FEMALE}>
                                    {getTranslateText('common.gender.female')}
                                </Option>
                                <Option value={GENDER_ENUM.OTHER}>
                                    {getTranslateText('common.gender.other')}
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='skype_account'
                            label={getTranslateText('form.basic_info.skype')}
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: `${getTranslateText(
                            //             'form.basic_info.skype'
                            //         )} ${getTranslateText('is_required')}`
                            //     }
                            // ]}
                        >
                            <Input
                                disabled
                                // placeholder={getTranslateText(
                                //     'form.basic_info.skype'
                                // )}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name='country'
                    label={getTranslateText('form.basic_info.country')}
                    rules={[
                        {
                            required: true,
                            message: `${getTranslateText(
                                'form.basic_info.country'
                            )} ${getTranslateText('is_required')}`
                        }
                    ]}
                >
                    <Select
                        showSearch
                        placeholder={getTranslateText(
                            'form.basic_info.choose_country'
                        )}
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            _.isString(option.children) &&
                            option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {renderCountry()}
                    </Select>
                </Form.Item>
                <Form.Item
                    name='timezone'
                    label={getTranslateText('form.basic_info.time_zone')}
                    rules={[
                        {
                            required: true,
                            message: `${getTranslateText(
                                'form.basic_info.time_zone'
                            )} ${getTranslateText('is_required')}`
                        }
                    ]}
                >
                    <Select
                        showSearch
                        placeholder={getTranslateText(
                            'form.basic_info.choose_time_zone'
                        )}
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            _.isString(option.children) &&
                            option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {renderTimeZone()}
                    </Select>
                </Form.Item>
                <Form.Item
                    name='currency'
                    label={getTranslateText('form.basic_info.currency')}
                    rules={[
                        {
                            required: true,
                            message: `${getTranslateText(
                                'form.basic_info.currency'
                            )} ${getTranslateText('is_required')}`
                        }
                    ]}
                >
                    <Select
                        showSearch
                        placeholder={getTranslateText(
                            'form.basic_info.choose_currency'
                        )}
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            _.isString(option.children) &&
                            option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {renderCurrency()}
                    </Select>
                </Form.Item>
                <Form.Item
                    name='intro'
                    label={getTranslateText('form.basic_info.biography')}
                    rules={[
                        {
                            required: true,
                            message: `${getTranslateText(
                                'form.basic_info.biography'
                            )} ${getTranslateText('is_required')}`
                        }
                    ]}
                >
                    <TextArea
                        placeholder={getTranslateText(
                            'form.basic_info.biography'
                        )}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
                    <button
                        className='btn my-2 my-sm-0 big-bt card-shadow'
                        type='submit'
                        disabled={loading}
                    >
                        <span>{getTranslateText('save')}</span>
                        <img
                            src='/static/img/homepage/bt.png'
                            alt='Save button'
                        />
                    </button>
                </Form.Item>
            </Form>
        </>
    )
}

export default GeneralInformation
