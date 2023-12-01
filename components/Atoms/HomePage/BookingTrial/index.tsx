/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/media-has-caption */
import {
    Button,
    Checkbox,
    Row,
    Radio,
    Col,
    Form,
    Input,
    notification
} from 'antd'
import ContactAPI from 'api/ContactAPI'
import { PATTERN_PHONE_NUMBER, TYPE_COURSE } from 'const'
import { useEffect, useState } from 'react'
import { getTranslateText } from 'utils/translate-utils'
// eslint-disable-next-line import/no-duplicates
import cn from 'classnames'
import styles from '../../Form/Login/Login.module.scss'

const { TextArea } = Input

const BookingTrial = () => {
    const [isShown, toggleVideo] = useState(false)
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

    const chooseCourse = (value) => {
        // let arrCourse = []
        const arrCourse: any =
            document.getElementsByClassName('area-type-course')
        for (let i = 0; i < arrCourse.length; i++) {
            arrCourse[i].style.backgroundColor = '#ffffff'
        }
        const myCourse: any = document.getElementById(value)
        myCourse.style.backgroundColor = '#dddddd'
    }

    const closeVideo = () => {
        const myVideo: any = document.getElementById('video-study-trial')
        myVideo.src = 'https://www.youtube.com/embed/1DrptEL2ys8'
        toggleVideo(false)
        // myVideo.pause()
    }

    const openVideo = () => {
        const myVideo: any = document.getElementById('video-study-trial')
        toggleVideo(true)
        // myVideo.play()
    }

    const renderTypeCourse = () =>
        TYPE_COURSE.map((item, index) => (
            <Col
                id={`course_${index}`}
                onClick={() => chooseCourse(`course_${index}`)}
                className='mb-2 p-1 align-items-center area-type-course cursor-pointer w-50vw pl-2'
            >
                <Radio value={item.value} className={styles.radioStudyTrial}>
                    <div className='flex justify-content-between align-items-center mobile-width-40px'>
                        <div>
                            <img className='mobile:hidden' src={item.path} />
                        </div>

                        <div className='ml-4 mobile-ml-0 mr-auto font-weight-bold text-black mb-0 text-[0.9rem] mobile-mini-fs-13'>
                            {item.title}
                        </div>
                    </div>
                </Radio>
            </Col>
        ))

    return (
        <section
            style={{ background: '#F4F5F6' }}
            className=' pt-8 pd-12 mobile-mb-4 mobile-pt-4 mobile-pb-8'
        >
            <div
                className='component-main-section p-0 wow fadeInUp not-laptop-remove-fadeInUp'
                data-wow-delay='.4s'
            >
                <div className='laptop-flex flex-row'>
                    <div
                        className='flex align-center position-relative bg-black border-radius-20 laptop:w-7/12 laptop-mr-4 table-mb-8 mobile-mb-4'
                        style={{ height: 'auto' }}
                    >
                        <iframe
                            className='w-full h-full border-radius-20 iframe-youtube pointer-events-none table:min-h-70vw'
                            src='https://www.youtube.com/embed/1DrptEL2ys8'
                            title='YouTube video player'
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                        />
                        <div className='bg-image-trial util-fit-background w-100 h-100 position-absolute rounded-3xl top-0'>
                            <div
                                className='top-1_2 left-1_2 position-absolute wus-translate-x-1_2 wus-translate-y-1_2 cursor-pointer text-center'
                                onClick={() => openVideo()}
                            >
                                <img
                                    className='mx-auto'
                                    src='assets/images/homepage/svgs/play_video.svg'
                                    alt=''
                                    title=''
                                />
                                <p className='mt-2 text-white font-extrabold'>
                                    {getTranslateText(
                                        'home.booking.free_trial.play_video'
                                    )}
                                </p>
                            </div>
                        </div>
                        <div
                            className={`position-fixed top-0 left-0 z-150 w-screen h-screen ${
                                isShown ? 'd-block' : 'd-none'
                            }`}
                        >
                            <div
                                className='w-100 h-100 bg-black opacity-50'
                                // onClick={() => closeVideo()}
                            />

                            <div className='top-1_2 laptop:h-80 table:h-70 laptop:w-80 left-1_2 rounded-2xl w-11_12 position-absolute wus-translate-x-1_2 wus-translate-y-1_2'>
                                <div className='position-relative w-100 h-100'>
                                    <div className='rounded-2xl h-100 overflow-hidden'>
                                        <iframe
                                            id='video-study-trial'
                                            className='w-full h-full border-radius-20 iframe-youtube'
                                            src='https://www.youtube.com/embed/1DrptEL2ys8'
                                            title='YouTube video player'
                                            frameBorder='0'
                                            allow='autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                            allowFullScreen
                                        />
                                    </div>

                                    <div
                                        className='-right-4 -top-2 position-absolute custom-p-4 bg-white rounded-full cursor-pointer line-height-0'
                                        onClick={() => closeVideo()}
                                    >
                                        <img
                                            src='assets/images/homepage/svgs/close.svg'
                                            alt=''
                                            title=''
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        id='card_booking_free_trial'
                        className='card-booking-free-trial border-radius-20 pb-2 pt-4 pl-4 pr-4 flex-1'
                    >
                        <h3 className='title-homepage'>
                            {getTranslateText('home.booking.free_trial.title')}
                        </h3>
                        <Form
                            name='contactForm'
                            onFinish={formSubmit}
                            form={form}
                            className='form-sp'
                        >
                            <div>
                                <span
                                    className={cn(
                                        styles['landing-page-label-form']
                                    )}
                                >
                                    {getTranslateText(
                                        'home.booking.free_trial.name'
                                    )}
                                </span>
                                <span className={styles.requiredField}>*</span>
                            </div>
                            <Form.Item
                                className='form-booking-trial'
                                name='contact_name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Xin hãy nhập tên của bạn'
                                    }
                                ]}
                            >
                                <Input
                                    type='text'
                                    // placeholder={getTranslateText(
                                    //     'home.booking.free_trial.place_holder.name'
                                    // )}
                                    className={styles.customInput}
                                />
                            </Form.Item>
                            <div>
                                <span
                                    className={cn(
                                        styles['landing-page-label-form']
                                    )}
                                >
                                    {getTranslateText(
                                        'home.booking.free_trial.phone'
                                    )}
                                </span>
                                <span className={styles.requiredField}>*</span>
                            </div>
                            <Form.Item
                                className=' form-booking-trial'
                                name='phone'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Xin hãy nhập số điện thoại'
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
                                    // placeholder={getTranslateText(
                                    //     'home.booking.free_trial.place_holder.phone'
                                    // )}
                                    className={styles.customInput}
                                />
                            </Form.Item>
                            <div>
                                <span
                                    className={cn(
                                        styles['landing-page-label-form']
                                    )}
                                >
                                    {getTranslateText(
                                        'home.booking.free_trial.email'
                                    )}
                                </span>
                                <span className={styles.requiredField}>*</span>
                            </div>
                            <Form.Item
                                className='form-booking-trial'
                                name='email'
                                rules={[
                                    {
                                        type: 'email',
                                        message:
                                            'Email bạn nhập vào không đúng định dạng'
                                    },
                                    {
                                        required: true,
                                        message: 'Xin hãy nhập email của bạn'
                                    }
                                ]}
                            >
                                <Input
                                    type='text'
                                    // placeholder={getTranslateText(
                                    //     'home.booking.free_trial.place_holder.email'
                                    // )}
                                    className={styles.customInput}
                                />
                            </Form.Item>
                            <div>
                                <span
                                    className={cn(
                                        styles['landing-page-label-form']
                                    )}
                                >
                                    {getTranslateText(
                                        'home.booking.free_trial.type_course'
                                    )}
                                </span>
                                <span className={styles.requiredField}>*</span>
                            </div>
                            <div className=' mt-2'>
                                <Form.Item
                                    className='flex form-booking-trial mb-0'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Xin hãy chọn khóa học'
                                        }
                                    ]}
                                    name='course'
                                >
                                    <Radio.Group>
                                        <div className='gap-3 grid grid-cols-2 gap-0.8'>
                                            {renderTypeCourse()}
                                        </div>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                            <div>
                                <span
                                    className={cn(
                                        styles['landing-page-label-form']
                                    )}
                                >
                                    {getTranslateText(
                                        'home.booking.free_trial.content'
                                    )}
                                </span>
                                <span className={styles.requiredField}>*</span>
                            </div>
                            <Form.Item
                                className='form-booking-trial'
                                name='content'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Xin hãy nhập nội dung'
                                    }
                                ]}
                            >
                                <TextArea
                                    className={styles.customInput}
                                    id='exampleFormControlTextarea1'
                                    rows={3}
                                    // placeholder={getTranslateText(
                                    //     'home.booking.free_trial.place_holder.content'
                                    // )}
                                />
                            </Form.Item>
                            <div className='clear' />
                            <Form.Item>
                                <Button
                                    htmlType='submit'
                                    className='landing-page-button-booking-trial'
                                >
                                    {getTranslateText(
                                        'home.booking.free_trial.register'
                                    )}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BookingTrial
