import { getCookie } from 'helpers/cookie'
import { FC, useState } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import { REASONS } from './ReasonsConfig'

const WhyUsSpecial: FC = () => {
    const [isShown, toggleVideo] = useState(false)
    const locale = getCookie('locale')
    const closeVideo = () => {
        const myVideo: any = document.getElementById('video-contruction')
        toggleVideo(false)
        myVideo.src = 'https://www.youtube.com/embed/jlHhiEcmxWM'
        // myVideo.pause()
    }

    const openVideo = () => {
        const myVideo: any = document.getElementById('video-contruction')
        toggleVideo(true)
        // myVideo.play()
    }

    const renderReasons = () => {
        const reasons = [...REASONS]
        return reasons.map((item, index) => (
            <div
                key={index}
                className={`util-flex-center laptop:space-x-4 flex-column flex-1 text-center ${
                    index !== 0 ? 'not-laptop:mr-top' : ''
                }`}
            >
                <img
                    style={{ width: '42px' }}
                    src={`assets/images/homepage/svgs/${item.icon}.svg`}
                    alt=''
                    title=''
                />
                <p className='font-weight-bold text-2_1rem laptop-text-1_1rem custom-mt-4 mb-0'>
                    {item.title}
                </p>
                <p className='font-semibold laptop-text-0_85rem custom-mt-2 w-360px laptop-w-auto mb-0 pl-2 pr-2'>
                    {item.description}
                </p>
            </div>
        ))
    }

    const renderReasonsMobile = () => {
        const reasons = [...REASONS]
        return reasons.map((item, index) => (
            <div
                key={index}
                className={`util-flex-center laptop:space-x-4 rounded-2xl box-has-border flex-column flex-1 px-12 py-6 custom-mt-4 text-center ${
                    index !== 0 ? 'not-laptop:mr-top' : ''
                }`}
            >
                <img
                    style={{ width: '42px' }}
                    src={`assets/images/homepage/svgs/${item.icon}.svg`}
                    alt=''
                    title=''
                />
                <p className='font-weight-bold text-1_5rem custom-mt-4 mb-0 mobile-width-310px'>
                    {item.title}
                </p>
                <p className='font-semibold laptop-text-0_9rem mobile-width-80vw custom-mt-2 mb-0'>
                    {item.description}
                </p>
            </div>
        ))
    }

    return (
        <section
            id='component_reason'
            className='component-default-mb-section tablet-mb-800px laptop-mb-160px position-relative'
        >
            <div className='component-main-section'>
                <h5 className='font-weight-bold title-homepage laptop-text-center table-width-600px mobile-width-340px'>
                    {getTranslateText('home.special.title_start')}{' '}
                    <span className='text-blue'>
                        English<span className='text-green'>Plus</span>
                    </span>{' '}
                    {getTranslateText('home.special.title_end')}?
                </h5>

                <div className='d-block tablet-hidden custom-mt-4'>
                    {renderReasonsMobile()}
                </div>
            </div>
            <div className='laptop-h-600px position-relative bg-black mt-8'>
                <iframe
                    className='w-full h-full iframe-youtube pointer-events-none'
                    src='https://www.youtube.com/embed/jlHhiEcmxWM?controls=0&autoplay=0'
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                />
                <div className='bg-image-intro util-fit-background w-100 h-100 not-laptop:min-h-70vw position-absolute top-0'>
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
                        <p className='mt-2 text-white f-size-16 font-extrabold'>
                            XEM VIDEO GIỚI THIỆU
                        </p>
                    </div>
                </div>
            </div>

            <div className='d-none mobile-block component-main-section mt-3'>
                <a
                    href={`${
                        locale === 'en' ? '/en/register' : '/vi/register'
                    }`}
                    aria-current='page'
                    className='component-default-fontsize mobile-fs-14 util-flex-center space-x-1 rounded-lg bg-green text-white px-7 h-40px'
                >
                    Đăng ký
                </a>{' '}
                <a
                    href='#card_booking_free_trial'
                    aria-current='page'
                    className='component-default-fontsize mobile-fs-14 util-flex-center space-x-1 rounded-lg btn-landing-page-glass glass2-color color-inherit laptop:ml-2 mobile:mt-3 px-7 p-0 h-40px'
                >
                    <img
                        src='../assets/images/homepage/svgs/play.svg'
                        alt='Loup Search'
                        title='English Plus'
                    />
                    <span>{getTranslateText('home.button.trial_study')}</span>
                </a>
            </div>

            <div className='top-full -translate-y-20 laptop--translate-y-1_2 position-absolute left-0 w-100 d-none tablet-block'>
                <div className='component-main-section tablet-component-main-section'>
                    <div
                        className='rounded-2xl box-has-shadow box-has-border laptop-flex-row d-flex flex-column table:mb-statistic p-8 bg-white wow fadeInUp'
                        data-wow-delay='.2s'
                    >
                        {renderReasons()}
                    </div>
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

                <div className='top-1_2 laptop:h-80 table:h-60 laptop:w-80 left-1_2 rounded-2xl w-11_12 position-absolute wus-translate-x-1_2 wus-translate-y-1_2'>
                    <div className='position-relative w-100 h-100'>
                        <div className='rounded-2xl h-100 overflow-hidden'>
                            <iframe
                                id='video-contruction'
                                className='w-full h-full border-radius-20 iframe-youtube'
                                src='https://www.youtube.com/embed/jlHhiEcmxWM'
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
        </section>
    )
}

export default WhyUsSpecial
