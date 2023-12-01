import React, { FunctionComponent } from 'react'
import { HOT_LINE, EMAIL_COMPANY } from 'const/common'
import { RightOutlined } from '@ant-design/icons'
import cn from 'classnames'
import styles from './Footer.module.scss'

const Footer: FunctionComponent = () => (
    <footer id='footer_home_page' className={styles.colorContainer}>
        <div className='component-main-section font-weight-bold'>
            <div className='row'>
                <div className='col-lg-3 col-md-12 col-12 row m-0'>
                    <a
                        className='col-lg-12 col-md-6 col-12 footer-logo pl-0'
                        href='/'
                    >
                        <img
                            className='footer-logo'
                            src='/assets/images/logo_ispeak.png'
                            alt='logo footer'
                            title='English Plus'
                        />
                    </a>
                    <div className='col-lg-12 col-md-5 col-9 footer-desc pl-0 pr-0 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'>
                        <b className='mt-3 table-mt-0 mobile-mt-2'>
                            Công ty Cổ phần Công nghệ và Đào tạo trực tuyến
                            HAMIA
                        </b>
                        <div className='mt-1'>©2022 englishplus.vn</div>
                    </div>
                </div>
                <hr className={styles.hrStyle} />
                <div className='col-lg-2 col-md-5 col-12'>
                    <div className={styles.title_footer}>KHÓA HỌC</div>
                    <div className='row hover_a'>
                        <a
                            className='col-lg-12 col-md-12 col-5 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                            href='/course-explorer'
                        >
                            Tiếng Anh cho bé
                        </a>
                        <a
                            className='col-lg-12 col-md-12 col-6 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                            href='/course-explorer'
                        >
                            Tiếng Anh trung học
                        </a>
                        <a
                            className='col-lg-12 col-md-12 col-5 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                            href='/course-explorer'
                        >
                            Tiếng Anh đi làm
                        </a>
                        <a
                            className='col-lg-12 col-md-12 col-6 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                            href='/course-explorer'
                        >
                            Tiếng Anh giao tiếp
                        </a>
                        <a
                            className='col-lg-12 col-md-12 col-5 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                            href='/course-explorer'
                        >
                            Tiếng Anh du học
                        </a>
                        <a
                            className='col-lg-12 col-md-12 col-6 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                            href='/course-explorer'
                        >
                            Tiếng Anh luyện thi
                        </a>
                    </div>
                </div>
                <hr className={styles.hrStyleMobile} />
                <div className='col-lg-3 col-md-7 col-12 footer-icon'>
                    <div className={styles.title_footer}>
                        CHÍNH SÁCH & QUY ĐỊNH
                    </div>
                    <div className='row hover_a'>
                        <a
                            href='https://ispeak.vn/bao-mat'
                            className='col-12 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                        >
                            {/* <RightOutlined
                                style={{ fontSize: '11px' }}
                                className='footer-icon'
                            /> */}
                            Chính sách bảo mật thông tin
                        </a>
                        <a
                            href='https://ispeak.vn/hoan-phi'
                            className='col-12 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                        >
                            {/* <RightOutlined
                                style={{ fontSize: '11px' }}
                                className='footer-icon'
                            /> */}
                            Chính sách hoàn phí
                        </a>
                        {/* <a href='https://ispeak.vn/giao-nhan'>
                            <RightOutlined
                                style={{ fontSize: '11px' }}
                                className='footer-icon'
                            />
                            Chính sách giao nhận
                        </a>
                        <a href='https://ispeak.vn/bao-hanh'>
                            <RightOutlined
                                style={{ fontSize: '11px' }}
                                className='footer-icon'
                            />
                            Chính sách bảo hành
                        </a> */}
                        <a
                            href='https://ispeak.vn/thanh-toan'
                            className='col-12 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                        >
                            {/* <RightOutlined
                                style={{ fontSize: '11px' }}
                                className='footer-icon'
                            /> */}
                            Quy định và hình thức thanh toán
                        </a>
                        <a
                            href='https://ispeak.vn/nq.pdf'
                            className='col-12 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                        >
                            {' '}
                            {/* <RightOutlined
                                style={{ fontSize: '11px' }}
                                className='footer-icon'
                            /> */}
                            Nội quy học tập
                        </a>
                    </div>
                </div>
                <hr className={styles.hrStyle} />
                <div className='col-lg-4 col-md-12 col-12'>
                    <div className={styles.title_footer}>LIÊN HỆ</div>
                    <div className='mb-2'>
                        <a
                            href={`tel:${HOT_LINE}`}
                            style={{ textDecoration: 'underline' }}
                            className='hover_a mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                        >
                            <i className='fas fa-phone-alt pr-1 mr-1' />
                            {HOT_LINE}
                        </a>
                        <a
                            href={`mailto:${EMAIL_COMPANY}`}
                            style={{ textDecoration: 'underline' }}
                            className='hover_a mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'
                        >
                            <i className='fas fa-envelope pr-1 mr-1' />
                            {EMAIL_COMPANY}
                        </a>
                        {/* <i className='fas fa-clock pr-1' />
                        Thời gian làm việc: 8:00 - 22:00 */}
                    </div>
                    <div className='mb-2 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'>
                        VP Hà Nội: Số 66 Trương Công Giai P.Dịch Vọng, Q.Cầu
                        Giấy, TP.Hà Nội
                    </div>
                    <div className='mb-2 mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'>
                        VP Đà Nẵng: 457/61 Tôn Đức Thắng, Q. Liên Chiểu, TP .Đà
                        Nẵng
                    </div>
                    <div className='mobile-fs-14 mobile-mini-fs-13 mobile-mini-fs-12'>
                        VP Philippines: Elizabeth setion school, bf Resort
                        drive, bf Resort village, Las Pinas city, metro Manila,
                        Philippines
                    </div>
                </div>
                <hr className={styles.hrStyleLaptop} />
                <div className='flex col-md-12 align-items-center justify-content-between'>
                    <div>
                        <a href='http://online.gov.vn/Home/WebDetails/49621'>
                            <img
                                className='mobile:w-90%'
                                style={{ width: '30%' }}
                                alt=''
                                title=''
                                src='http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png'
                            />
                        </a>
                    </div>
                    <div className={styles.dns_footer}>
                        <a
                            href='https://www.youtube.com/@iSpeakOnlineEnglishSchool'
                            target='_blank'
                            rel='noreferrer'
                        >
                            <img
                                src='../assets/images/homepage/svgs/icon_youtube.svg'
                                alt='logo youtube'
                                title='English Plus'
                            />
                        </a>
                        <a
                            href='https://www.facebook.com/ispeakvietnam'
                            target='_blank'
                            rel='noreferrer'
                        >
                            <img
                                src='../assets/images/homepage/svgs/icon_facebook.svg'
                                alt='logo facebook'
                                title='English Plus'
                            />
                        </a>
                        <a
                            href='https://zalo.me/166612478943843417'
                            target='_blank'
                            rel='noreferrer'
                        >
                            <img
                                src='../assets/images/homepage/svgs/icon_zalo.svg'
                                alt='logo zalo'
                                title='English Plus'
                            />
                        </a>
                    </div>
                    {/* <a href='#'>
                        <img
                            src='../assets/images/homepage/f2.png'
                            alt='f2.png'
                        />
                    </a>
                    <a href='#'>
                        <img
                            src='../assets/images/homepage/f3.png'
                            alt='f3.png'
                        />
                    </a> */}
                </div>
            </div>
        </div>
    </footer>
)

export default Footer
