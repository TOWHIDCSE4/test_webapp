import Slider from 'react-slick'
import { getTranslateText } from 'utils/translate-utils'
import { Image, Row, Col, Button } from 'antd'
import { getCookie } from 'helpers/cookie'
import NextArrow from '../NextArrow'
import PrevArrow from '../PrevArrow'

const FindCourse = () => {
    const locale = getCookie('locale')

    return (
        <section>
            <div>
                <div className='container-find-course'>
                    <div className='col-md-12 area-find-course util-fit-background pr-0'>
                        <div className='bg-content-find-course'>
                            <div className='content-find-course'>
                                <div className='text-top font-extrabold opacity-60 table:fs-24px'>
                                    {getTranslateText(
                                        'home.find_course.text_top'
                                    ).toUpperCase()}
                                </div>
                                <div className='text-main-find-course font-weight-bold'>
                                    <div className='text-start-find-course table:mb--20px'>
                                        <span style={{ marginBottom: '-15px' }}>
                                            {getTranslateText(
                                                'home.find_course.text_start'
                                            )}
                                        </span>
                                        <span style={{ color: '#1FC974' }}>
                                            {getTranslateText(
                                                'home.find_course.text_end'
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='laptop:flex area-btn-find-course'>
                                <a
                                    className='btn-landing-page font-weight-bold btn-landing-page-success mobile:flex alight-center justify-content-center btn-find-course table:fs-22px table:h-60px '
                                    href={`${
                                        locale === 'en'
                                            ? '/en/register'
                                            : '/vi/register'
                                    }`}
                                >
                                    Đăng ký
                                </a>
                                <a
                                    className='btn-landing-page font-weight-bold text-white laptop:text-inherit btn-find-course btn-landing-page-glass ml-3 mobile:ml-0 
                                        mobile:mt-4 mobile:flex alight-center justify-content-center align-items-center table:fs-22px table:h-60px'
                                    href='#card_booking_free_trial'
                                >
                                    <img
                                        src='../assets/images/homepage/svgs/trial_study.svg'
                                        alt='trial study'
                                        title='English Plus'
                                    />
                                    {getTranslateText(
                                        'home.button.trial_study'
                                    )}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FindCourse
