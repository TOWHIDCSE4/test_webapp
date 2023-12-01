/* eslint-disable global-require */
import { getCookie } from 'helpers/cookie'
import { useEffect, FC } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import { OUR_PROGRAMS } from './ProgramsConfig'

const Programming: FC = () => {
    const renderOurPrograms = () => {
        const ourPrograms = [...OUR_PROGRAMS]
        const locale = getCookie('locale')

        return ourPrograms.map((item, index) => (
            <div
                className='util-fit-background tablet-pt-100 rounded-2xl group position-relative w-100 h-220px tablet-h-0 overflow-hidden wow fadeInUp not-laptop-remove-fadeInUp'
                data-wow-delay={item.delay}
                key={index}
                style={{
                    backgroundImage: `url(/assets/images/homepage/${item.image}.png)`
                }}
            >
                <div className='-bottom-82 -mobile-bottom-75 transition-all duration-700 laptop-group-hover-bottom-0 position-absolute left-0 w-100 h-100 bg-black opacity-50' />
                <div className='position-absolute transition-all duration-700 laptop-group-hover-bottom-0 -bottom-82 -mobile-bottom-75 left-0 w-100 h-100 px-6 custom-pt-3 laptop-group-hover-pt-6 pb-8 d-flex flex-column'>
                    <p className='text-1_3rem font-weight-bold mb-0 table-mt--3px'>
                        {item.title}
                    </p>

                    <p className='component-default-fontsize custom-mt-4 mb-0'>
                        {item.description}
                    </p>
                    <div className='d-flex mt-auto'>
                        <a
                            href={`${
                                locale === 'en'
                                    ? '/en/register'
                                    : '/vi/register'
                            }`}
                            aria-current='page'
                            className='component-default-fontsize util-flex-center rounded-lg flex-1 bg-green text-white px-7 h-40px'
                        >
                            Đăng ký
                        </a>{' '}
                        <a
                            href='/course-explorer'
                            aria-current='page'
                            className='component-default-fontsize util-flex-center rounded-lg flex-1 bg-transparent hover-bg-rgba-255_255_255_0_3 px-7 h-40px text-white ml-2'
                        >
                            <span>Tìm hiểu</span>{' '}
                            <img
                                className='ml-1'
                                src='assets/images/homepage/svgs/arrow_right.svg'
                                alt='Arrow right'
                                title=''
                            />
                        </a>
                    </div>
                </div>
            </div>
        ))
    }

    useEffect(() => {
        try {
            window.jQuery = require('jquery')

            window.jQuery(window).scroll(() => {
                const hT = window.jQuery('#component-programming').offset().top
                const hH = window.jQuery('#component-programming').innerHeight()
                // const wH = window.jQuery(window).height()
                const { pageYOffset, innerWidth } = window
                if (
                    innerWidth < 768 &&
                    pageYOffset > 40 &&
                    pageYOffset < hT + hH
                ) {
                    window
                        .jQuery('.mobile-component-btn-free-trial')
                        .removeClass('d-block')
                    window
                        .jQuery('.mobile-component-btn-free-trial')
                        .addClass('d-block')
                } else {
                    window
                        .jQuery('.mobile-component-btn-free-trial')
                        .removeClass('d-block')
                }
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    return (
        <section
            id='component-programming'
            className='component-main-section component-default-mb-section'
        >
            <h5 className='font-weight-bold title-homepage laptop-text-center table-width-400px mobile-width-230px mb-0'>
                {getTranslateText('home.course.title')}{' '}
                <span className='text-blue'>
                    {' '}
                    English<span className='text-green'>Plus</span>
                </span>
            </h5>
            <div className='laptop-grid-cols-3 tablet-gap-6 laptop-px-10 tablet-grid-cols-2 grid laptop-gap-3 mt-10 text-white mobile-mt-4'>
                {renderOurPrograms()}
            </div>
            <div className='d-none mobile-component-btn-free-trial position-fixed-left-0-bottom-0 z-120 h-80px bg-white width:100vw p-12-15-26-15'>
                <a
                    href='#card_booking_free_trial'
                    aria-current='page'
                    className='component-default-fontsize util-flex-center space-x-1 rounded-lg bg-green px-7 h-40px'
                >
                    <img
                        src='../assets/images/homepage/svgs/white_play.svg'
                        alt='Loup Search'
                        title='English Plus'
                    />
                    <span className='text-white'>
                        {getTranslateText('home.button.trial_study')}
                    </span>
                </a>
            </div>
        </section>
    )
}

export default Programming
