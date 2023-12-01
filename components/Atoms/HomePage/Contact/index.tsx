/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { Form, Input, Button, message, notification, Select } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import { PATTERN_PHONE_NUMBER } from 'const'
import ContactAPI from 'api/ContactAPI'

const { TextArea } = Input

const Contact = () => {
    const [form] = Form.useForm()
    const formSubmit = () => {
        const values = form.getFieldsValue()
        ContactAPI.createContact(values)
            .then((res) => {
                notification.success({
                    message: 'Success',
                    description: getTranslateText('thank_your_mess')
                })
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
    }
    return (
        <section>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6'>
                        <img
                            src='assets/images/homepage/big.png'
                            className='img-fluid'
                        />
                    </div>
                    <div className='col-md-6'>
                        <br />
                        <br />
                        <h3
                            className='section-title wow fadeInUp'
                            data-wow-delay='.2s'
                        >
                            {getTranslateText('home.trial_reg')}
                        </h3>
                        <Form
                            name='contactForm'
                            onFinish={formSubmit}
                            form={form}
                            className='form-sp'
                        >
                            <Form.Item
                                className='form-group'
                                name='contact_name'
                                rules={[
                                    {
                                        required: true,
                                        message: getTranslateText('input_name')
                                    }
                                ]}
                            >
                                <Input
                                    type='text'
                                    placeholder={getTranslateText(
                                        'home.contact.name'
                                    )}
                                    className='input'
                                />
                            </Form.Item>
                            <Form.Item
                                className='form-group'
                                name='phone'
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
                                <Input
                                    type='text'
                                    placeholder={getTranslateText(
                                        'home.contact.phone'
                                    )}
                                    className='input'
                                />
                            </Form.Item>
                            <Form.Item
                                className='form-group'
                                name='email'
                                rules={[
                                    {
                                        type: 'email',
                                        message: getTranslateText(
                                            'input_not_valid_email'
                                        )
                                    },
                                    {
                                        required: true,
                                        message: getTranslateText('input_email')
                                    }
                                ]}
                            >
                                <Input
                                    type='text'
                                    placeholder={getTranslateText(
                                        'home.contact.email'
                                    )}
                                    className='input'
                                />
                            </Form.Item>
                            <Form.Item
                                className='form-group'
                                name='course'
                                rules={[
                                    {
                                        required: true,
                                        message: getTranslateText('input_text')
                                    }
                                ]}
                            >
                                <Select
                                    placeholder='Interested'
                                    className='interest-select'
                                    size='large'
                                >
                                    <Select.Option value='Children'>
                                        Children (age of 4-15)
                                    </Select.Option>
                                    <Select.Option value='Adult'>
                                        Adult
                                    </Select.Option>
                                    <Select.Option value='Learning, IELTS Training'>
                                        Learning, IELTS Training
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                className='form-group'
                                name='content'
                                rules={[
                                    {
                                        required: true,
                                        message: getTranslateText('input_text')
                                    }
                                ]}
                            >
                                <TextArea
                                    className='form-control input input3'
                                    id='exampleFormControlTextarea1'
                                    rows={3}
                                    placeholder={getTranslateText(
                                        'home.contact.content'
                                    )}
                                />
                            </Form.Item>
                            <div className='clear' />
                            <Form.Item>
                                <button
                                    className='btn my-2 my-sm-0 big-bt card-shadow'
                                    type='submit'
                                >
                                    <span>
                                        {getTranslateText(
                                            'home.contact.register'
                                        )}
                                    </span>
                                    <img src='assets/images/homepage/bt.png' />
                                </button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact
