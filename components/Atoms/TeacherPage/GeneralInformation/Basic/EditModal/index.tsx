import {
    Modal,
    Image,
    Form,
    Input,
    Button,
    Select,
    Upload,
    DatePicker,
    notification,
    UploadProps
} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import cn from 'classnames'
import { FC, useEffect, useState } from 'react'
import { GENDER_ENUM, GENDER } from 'const/gender'
import UserAPI from 'api/UserAPI'
import UploadAPI from 'api/UploadAPI'
import _ from 'lodash'
import { IUser } from 'types'
import moment from 'moment'
import { getTranslateText } from 'utils/translate-utils'
import { notify } from 'contexts/Notification'
import { PATTERN_PHONE_NUMBER } from 'const'
import styles from '../index.module.scss'

const { Option } = Select

type Props = {
    visible: boolean
    data: IUser
    toggleModal: (visible: boolean) => void
    refetchData: () => void
}

const dateFormat = 'DD-MM-YYYY'

const EditBasicInfoModal: FC<Props> = ({
    visible,
    data,
    toggleModal,
    refetchData
}: Props) => {
    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState(false)
    const [preview, setPreview] = useState<any>()
    const [fileUpload, setFileUpload] = useState<any>()

    useEffect(() => {
        form.setFieldsValue({
            ...data,
            date_of_birth: data.date_of_birth && moment(data.date_of_birth)
        })
        if (data.avatar) {
            setPreview(data.avatar)
        }
    }, [visible])

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }

    const beforeUpload = (file: any) => {
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
            {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className='ml-1'>Upload</div>
        </>
    )

    const onChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (imageUrl: any) => {
                setPreview(imageUrl)
                setLoading(false)
            })
            setFileUpload(info.file.originFileObj)
        }
    }

    const uploadAvatar = async (_file: any) => {
        const res = await UploadAPI.uploadImage(_file)
        return res
    }

    const onFinish = async (values: any) => {
        const payload = {
            ...values
        }
        if (fileUpload) {
            try {
                const resUpload = await uploadAvatar(fileUpload)
                payload.avatar = resUpload
                setLoading(true)
                await UserAPI.editUserInfo(payload)
                notify('success', 'Update successfully')
                toggleModal(false)
                await refetchData()
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
                toggleModal(false)
                await refetchData()
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

    return (
        <Modal
            maskClosable
            centered
            visible={visible}
            onCancel={() => toggleModal(false)}
            width={424}
            footer={null}
            className='modalProfile'
        >
            <div className={cn(styles.wrapFirstPage)}>
                <div className={cn(styles.title_popup)}>
                    <p>{getTranslateText('teacher.info')}</p>
                </div>
                <div className={cn(styles.avatar, styles.avatarPopup)}>
                    <Upload
                        name='avatar'
                        listType='picture-card'
                        accept='image/*'
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={onChange}
                    >
                        {preview ? (
                            <Image src={preview} preview={false} width='100%' />
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
                </div>
                <Form
                    form={form}
                    name='info-user'
                    onFinish={onFinish}
                    size='middle'
                    className={cn(styles.formInfoUser)}
                >
                    <div className={cn(styles.formInfoUser_Item)}>
                        <div className={cn(styles.labelFormInfoUser)}>
                            {getTranslateText('first_name')}
                        </div>
                        <div className={cn(styles.inputFrom)}>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name='first_name'
                                rules={[
                                    {
                                        required: true,
                                        message: `${getTranslateText(
                                            'form.basic_info.first_name'
                                        )} ${getTranslateText('is_required')}`
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </div>
                    <div className={cn(styles.formInfoUser_Item)}>
                        <div className={cn(styles.labelFormInfoUser)}>
                            {getTranslateText('last_name')}
                        </div>
                        <div className={cn(styles.inputFrom)}>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name='last_name'
                                rules={[
                                    {
                                        required: true,
                                        message: `${getTranslateText(
                                            'form.basic_info.last_name'
                                        )} ${getTranslateText('is_required')}`
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </div>
                    <div className={cn(styles.formInfoUser_Item)}>
                        <div className={cn(styles.labelFormInfoUser)}>
                            {getTranslateText('username')}
                        </div>
                        <div className={cn(styles.inputFrom)}>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name='username'
                            >
                                <Input disabled />
                            </Form.Item>
                        </div>
                    </div>
                    <div className={cn(styles.formInfoUser_Item)}>
                        <div className={cn(styles.labelFormInfoUser)}>
                            Email
                        </div>
                        <div className={cn(styles.inputFrom)}>
                            <Form.Item style={{ marginBottom: 0 }} name='email'>
                                <Input disabled />
                            </Form.Item>
                        </div>
                    </div>
                    <div className={cn(styles.formInfoUser_Item)}>
                        <div className={cn(styles.labelFormInfoUser)}>
                            {getTranslateText('gender')}
                        </div>
                        <div className={cn(styles.inputFrom)}>
                            <Form.Item
                                style={{ marginBottom: 0, width: '100%' }}
                                name='gender'
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
                                    placeholder='gender'
                                    allowClear
                                    style={{ width: '100%' }}
                                >
                                    {Object.keys(GENDER)
                                        .filter(
                                            (key: any) =>
                                                !isNaN(Number(GENDER[key]))
                                        )
                                        .map((key: any) => (
                                            <Option
                                                value={GENDER[key]}
                                                key={key}
                                            >
                                                {getTranslateText(
                                                    `common.gender.${key.toLowerCase()}`
                                                )}
                                            </Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    <div className={cn(styles.formInfoUser_Item)}>
                        <div className={cn(styles.labelFormInfoUser)}>
                            {getTranslateText('date_of_birth')}
                        </div>
                        <div className={cn(styles.inputFrom)}>
                            <Form.Item
                                style={{ marginBottom: 0, width: '100%' }}
                                name='date_of_birth'
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
                                    style={{ width: '100%' }}
                                    format={dateFormat}
                                    disabledDate={(current) =>
                                        current >=
                                        moment().subtract(17, 'years')
                                    }
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div className={cn(styles.formInfoUser_Item)}>
                        <div className={cn(styles.labelFormInfoUser)}>
                            {getTranslateText('phone_number')}
                        </div>
                        <div className={cn(styles.inputFrom)}>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name='phone_number'
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
                                <Input />
                            </Form.Item>
                        </div>
                    </div>
                    <div className={cn(styles.formInfoUser_Item)}>
                        <div className={cn(styles.labelFormInfoUser)}>
                            Skype
                        </div>
                        <div className={cn(styles.inputFrom)}>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                name='skype_account'
                                rules={[
                                    {
                                        required: true,
                                        message: `${getTranslateText(
                                            'form.basic_info.skype'
                                        )} ${getTranslateText('is_required')}`
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </div>

                    <div className='d-flex justify-content-end mt-2'>
                        <Button
                            className={cn(
                                'd-flex justify-content-end',
                                styles.btnFrom
                            )}
                            type='primary'
                            shape='round'
                            disabled={isLoading}
                            onClick={() => form.submit()}
                        >
                            {getTranslateText('update')}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    )
}

export default EditBasicInfoModal
