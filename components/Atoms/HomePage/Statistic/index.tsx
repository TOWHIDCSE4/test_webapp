import { useCallback, useState, FC, useEffect } from 'react'
import Slider from 'react-slick'
import { getTranslateText } from 'utils/translate-utils'
import { Image, Row, Col, Button } from 'antd'
import { AUTH_TYPES } from 'const'
import AuthModal from 'components/Molecules/AuthModal'

const Statistic = () => {
    const settings = {}
    const [isShown, setShown] = useState(true)
    const [authType, setAuthType] = useState('become_a_teacher')

    const toggleModalComponent = (type) => {
        document.getElementById(type).click()
    }

    return (
        <section className='bg-2colors mb-0'>
            <div className='component-main-section p-0'>
                <div className='col-md-12 area-statistic-new util-fit-background h-auto w-full text-white p-[20px_16px_16px] tablet:p-[60px_24px]'>
                    <div className='laptop:hidden tablet:text-start text-center table-ml-60px'>
                        <div className='font-weight-bold text-[3rem]  tablet:text-[3.5rem]'>
                            {getTranslateText('home.statistic.plus_five_year')}
                        </div>{' '}
                        <span className='font-medium text-[1.5rem] tablet:text-[2.2rem]'>
                            {getTranslateText('home.statistic.title')}
                        </span>
                    </div>
                    <div className='text-[3rem] res-hidden laptop:block text-center flex justify-content-center'>
                        <span className='font-extrabold'>
                            {getTranslateText('home.statistic.plus_five_year')}
                        </span>
                        &nbsp;{getTranslateText('home.statistic.title')}
                    </div>
                    <div className='flex flex-col table:hidden laptop:flex-row mt-[68px] table-mt-35px'>
                        <div className='util-flex-between flex-1'>
                            <div className='flex-1'>
                                <div className='font-extrabold text-[1.8rem] mobile-mini-text-[1.6rem] tablet:text-[3rem] text-center'>
                                    +<span>142</span>
                                </div>{' '}
                                <div className='text-[0.9rem] tablet:text-[1.1rem] text-center mt-2'>
                                    {getTranslateText('home.statistic.teacher')}
                                </div>
                            </div>{' '}
                            <div className='laptop:block w-px h-full bg-white' />{' '}
                            <div className='tablet:flex-1'>
                                <div className='font-extrabold text-[1.8rem] mobile-mini-text-[1.6rem] tablet:text-[3rem] text-center'>
                                    +<span>17,473</span>
                                </div>{' '}
                                <div className=' text-[0.9rem] tablet:text-[1.1rem] text-center mt-2'>
                                    {getTranslateText('home.statistic.member')}
                                </div>
                            </div>
                        </div>{' '}
                        <div className='laptop:block w-px h-auto bg-white' />{' '}
                        <div className='util-flex-between laptop:mt-0 flex-1 mt-10'>
                            <div className='flex-1'>
                                <div className='font-extrabold text-[1.8rem] mobile-mini-text-[1.6rem] tablet:text-[3rem] text-center'>
                                    +<span>289,125</span>
                                </div>{' '}
                                <div className='text-[0.9rem] tablet:text-[1.1rem] text-center mt-2'>
                                    {getTranslateText(
                                        'home.statistic.class_took'
                                    )}
                                </div>
                            </div>{' '}
                            <div className='laptop:block w-px h-full bg-white' />{' '}
                            <div className='tablet:flex-1'>
                                <div className='font-extrabold text-[1.8rem] mobile-mini-text-[1.6rem] tablet:text-[3rem] text-center'>
                                    +600-800
                                </div>{' '}
                                <div className=' text-[0.9rem] tablet:text-[1.1rem] text-center mt-2'>
                                    {getTranslateText(
                                        'home.statistic.class_of_day'
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col laptop:hidden  laptop:flex-row mt-[68px]'>
                        <div className='util-flex-between flex-1'>
                            <div className='tablet:flex-1'>
                                <div className='font-extrabold text-[1.8rem] mobile-mini-text-[1.6rem] tablet:text-[3rem] text-center'>
                                    +<span>17,473</span>
                                </div>{' '}
                                <div className=' text-[0.9rem] tablet:text-[1.1rem] text-center mt-2 mobile-mini-fs-13'>
                                    {getTranslateText('home.statistic.member')}
                                </div>
                            </div>
                            <div className='flex-1'>
                                <div className='font-extrabold text-[1.8rem] mobile-mini-text-[1.6rem] tablet:text-[3rem] text-center'>
                                    +<span>289,125</span>
                                </div>{' '}
                                <div className='text-[0.9rem] tablet:text-[1.1rem] text-center mt-2 mobile-mini-fs-13'>
                                    {getTranslateText(
                                        'home.statistic.class_took'
                                    )}
                                </div>
                            </div>{' '}
                        </div>{' '}
                        <div className='util-flex-between laptop:mt-0 flex-1 mt-10'>
                            <div className='flex-1'>
                                <div className='font-extrabold text-[1.8rem] mobile-mini-text-[1.6rem] tablet:text-[3rem] text-center'>
                                    +<span>142</span>
                                </div>{' '}
                                <div className='text-[0.9rem] tablet:text-[1.1rem] text-center mt-2 mobile-mini-fs-13'>
                                    {getTranslateText('home.statistic.teacher')}
                                </div>
                            </div>{' '}
                            <div className='tablet:flex-1'>
                                <div className='font-extrabold text-[1.8rem] mobile-mini-text-[1.6rem] tablet:text-[3rem] text-center'>
                                    +600-800
                                </div>{' '}
                                <div className=' text-[0.9rem] tablet:text-[1.1rem] text-center mt-2 mobile-mini-fs-13'>
                                    {getTranslateText(
                                        'home.statistic.class_of_day'
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-[60px] tablet:mt-[80px] flex tablet:space-x-4 justify-content-center flex-col tablet:flex-row space-y-2 tablet:space-y-0'>
                        <div
                            aria-current='page'
                            onClick={() =>
                                toggleModalComponent('modal_become_a_teacher')
                            }
                            className='component-default-fontsize util-flex-center space-x-1 rounded-lg nuxt-link-exact-active nuxt-link-active bg-green cursor-pointer text-white px-7 h-[40px] table-h-70px hover:opacity[0.7]'
                        >
                            {/* {getTranslateText('become_a_teacher')} */}
                            Trở thành giáo viên
                        </div>{' '}
                        <a
                            href='/'
                            aria-current='page'
                            className='component-default-fontsize util-flex-center space-x-1 rounded-lg nuxt-link-exact-active nuxt-link-active bg-transparent text-white hover:bg-[rgba(255,255,255,0.3)] px-7 h-[40px] table-h-70px'
                        >
                            <span className='mr-1'>
                                {getTranslateText(
                                    'home.statistic.looking_more'
                                )}
                            </span>{' '}
                            <img
                                src='../assets/images/homepage/svgs/icon_arrow_right.svg'
                                alt='icon arrow right'
                                title='English Plus'
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Statistic
