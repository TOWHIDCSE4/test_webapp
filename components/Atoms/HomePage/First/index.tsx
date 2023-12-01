import { getTranslateText } from 'utils/translate-utils'

const toggleModalComponent = (type) => {
    document.getElementById(type).click()
}

const First = () => (
    <section className='component-main-section bg-center_top_-2rem pt-6 mt-8 mb-0 bg-first util-fit-background laptop-px-10 laptop-flex-row laptop-pb-160px flex-column util-flex-between'>
        <div className='laptop-text-start util-w-fill text-center'>
            <div className='font-extrabold margin-auto laptop:text-[3.2rem] table:text-[3rem] text-[2.2rem] mobile-width-310px'>
                <div className='text-green mb-0 line-height-inherit line-height-inherit-mobile pb-1'>
                    {getTranslateText('home.banner.title_start')}
                </div>
                <div className='mb-0 line-height-inherit line-height-inherit-mobile pb-1 font-weight-500'>
                    {' '}
                    {getTranslateText('home.banner.title_middle')}{' '}
                    <span className='text-green laptop-hidden font-extrabold'>
                        {getTranslateText('home.banner.title_end')}
                    </span>
                </div>
                <div className='text-green mb-0 d-none laptop-block line-height-inherit line-height-inherit-mobile'>
                    {getTranslateText('home.banner.title_end')}
                </div>
            </div>

            <p className='text-grey laptop-text-black mt-6 laptop-mb-0 table-mb-0 laptop-fs-16 table-fs-22 mobile-fs-14 margin-auto mobile-width-280px mobile-mr'>
                {getTranslateText('home.banner.connect_teacher')} 🔥
            </p>

            <div className='d-flex laptop-space-x-4 tablet-mt-60px justify-content-center space-y-3 tablet-space-y-0 laptop-justify-start flex-column tablet-flex-row'>
                <div
                    onClick={() => toggleModalComponent('modal_login')}
                    aria-current='page'
                    className='btn-landing-page component-default-fontsize util-flex-center space-x-1 rounded-lg bg-green cursor-pointer text-white fs-18 px-7 h-60px'
                >
                    {getTranslateText('home.banner.btn_start')}
                </div>{' '}
                <a
                    href='#card_booking_free_trial'
                    aria-current='page'
                    className='btn-landing-page component-default-fontsize util-flex-center space-x-1 rounded-lg btn-landing-page-glass glass2-color laptop:ml-2 mobile:mt-2 px-7 fs-18 h-60px'
                >
                    <img
                        src='../assets/images/homepage/svgs/play.svg'
                        alt='Loup Search'
                        title='English Plus'
                    />
                    <span>{getTranslateText('home.button.trial_study')}</span>
                </a>
            </div>
        </div>
        <div className='animation-transform-svg component-full-main-section util-flex-center tablet-mt-10 laptop-mt-0 w-100 overflow-hidden'>
            <img
                className='w-100 wow zoomIn not-laptop-remove-fadeInUp mobile-mt-4 mobile-mb-4'
                data-wow-delay='.2s'
                src='../assets/images/homepage/svgs/first.svg'
                alt='Loup Search'
                title='English Plus'
            />
        </div>
    </section>
)

export default First
