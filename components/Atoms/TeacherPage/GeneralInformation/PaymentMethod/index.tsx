/* eslint-disable no-template-curly-in-string */
import React, { FC } from 'react'
import cn from 'classnames'
import { Form, Input, Button, Select, Divider } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import UserAPI from 'api/UserAPI'
import { notify } from 'contexts/Notification'
import styles from './PaymentMethod.module.scss'

const layout = {
    labelCol: {
        span: 24
    },
    wrapperCol: {
        span: 24
    }
}

type Props = {
    data: any
    bank_list: Array<any>
}

const PaymentMethod: FC<Props> = ({ data, bank_list }) => {
    const [form] = Form.useForm()

    form.setFieldsValue({
        bankName: data?.bank_name,
        accountNumber: data?.account_number,
        accountName: data?.account_name,
        paypalEmail: data?.paypal_email,
        note: data?.note
    })

    const validateMessages = {
        required: '${label} is required!',
        types: {
            number: '${label} is not a valid number!'
        }
    }

    const onFinish = (values) => {
        const bank_account = {
            bank_name: values.bankName,
            account_number: values.accountNumber,
            account_name: values.accountName,
            paypal_email: values.paypalEmail, // 1: bank, 2: paypal, 3: visa, 4: mastercard
            note: values.note
        }
        UserAPI.updateBankAccount({ bank_account }).then(() => {
            notify(
                'success',
                getTranslateText('teacher.info.payment.update_success')
            )
        })
    }
    return (
        <div className={cn(styles.wrapPaymentMethod)}>
            <div className={cn(styles.title)}>
                {getTranslateText('teacher.info.payment')}
            </div>
            <Form
                {...layout}
                name='info-user-bank'
                onFinish={onFinish}
                validateMessages={validateMessages}
                size='large'
                className={cn(styles.formInfoBank)}
                form={form}
            >
                <div className={cn(styles.notiFrom)}>
                    {getTranslateText('teacher.info.payment.fill')}
                </div>

                <Form.Item
                    name='bankName'
                    label={getTranslateText('teacher.info.payment.bankname')}
                    rules={[
                        {
                            required: true
                        }
                    ]}
                >
                    {/* <Select showSearch style={{ width: '100%' }}>
                        {bank_list.map((item, key) => (
                            <Select.Option value={item.id} key={key}>
                                {item.name} ({item.short_name})
                            </Select.Option>
                        ))}
                    </Select> */}
                    <Input />
                </Form.Item>
                <Form.Item
                    name='accountNumber'
                    label={getTranslateText('teacher.info.payment.account')}
                    rules={[
                        {
                            required: true
                            // type: 'number'
                        },
                        {
                            pattern: /[0-9]$/,
                            message: `${getTranslateText(
                                'teacher.info.payment.invalid_account'
                            )}`
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='accountName'
                    label={getTranslateText('teacher.info.payment.accountName')}
                    rules={[
                        {
                            required: true
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Divider />
                <Form.Item
                    name='paypalEmail'
                    label={getTranslateText(
                        'teacher.info.payment.paypal_email'
                    )}
                    rules={[
                        {
                            type: 'email',
                            message: getTranslateText('input_not_valid_email')
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='note'
                    label={getTranslateText('teacher.info.payment.paymentNote')}
                    rules={[
                        {
                            // required: true
                        }
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                    <Button
                        className={cn(styles.btnFrom)}
                        type='primary'
                        htmlType='submit'
                        shape='round'
                    >
                        {getTranslateText('teacher.info.payment.update')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default PaymentMethod
