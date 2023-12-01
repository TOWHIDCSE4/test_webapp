import Slider from 'react-slick'
import { getTranslateText } from 'utils/translate-utils'
import { Image, Row, Col } from 'antd'
import NextArrow from '../NextArrow'
import PrevArrow from '../PrevArrow'

const Feedback = () => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    }

    return (
        <section>
            <div className='container'>
                <div className='row margin-0'>
                    <div
                        className='col-md-12 wow fadeInUp'
                        data-wow-delay='.2s'
                    >
                        <h2 className='title-feedback'>
                            {getTranslateText('home.feedback')}
                        </h2>
                    </div>
                    <div
                        className='col-md-12 wow fadeInUp'
                        data-wow-delay='.4s'
                    >
                        <Slider {...settings}>
                            <div className='owl-item'>
                                <Row gutter={[0, 0]}>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Image
                                            src='assets/images/homepage/feedback/FB 1.jpg'
                                            preview={false}
                                            style={{
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </Col>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Image
                                            src='assets/images/homepage/feedback/fb2.jpg'
                                            preview={false}
                                            style={{
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div className='owl-item'>
                                <Row gutter={[0, 0]}>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Image
                                            src='assets/images/homepage/feedback/fb5.jpg'
                                            preview={false}
                                            style={{
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </Col>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Image
                                            src='assets/images/homepage/feedback/fb6.jpg'
                                            preview={false}
                                            style={{
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div className='owl-item'>
                                <Row gutter={[0, 0]}>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Image
                                            src='assets/images/homepage/feedback/fb3.jpg'
                                            preview={false}
                                            style={{
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </Col>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Image
                                            src='assets/images/homepage/feedback/fb4.jpg'
                                            preview={false}
                                            style={{
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Feedback
