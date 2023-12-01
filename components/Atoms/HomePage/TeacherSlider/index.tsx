import Slider from 'react-slick'
import { getTranslateText } from 'utils/translate-utils'
import { TEACHERS_TEAM } from 'const'
import NextArrow from '../NextArrow'
import PrevArrow from '../PrevArrow'
import SliderItem from '../SliderItem'

const TeacherSlider = () => {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    const renderSliderItem = () =>
        TEACHERS_TEAM.map((item, index) => (
            <div className='owl-item' key={index}>
                <SliderItem
                    src={item.src}
                    name={item.name}
                    location={`${item.location}`}
                    key={index}
                />
            </div>
        ))
    return (
        <section>
            <div className='container'>
                <div className='row'>
                    <div
                        className='col-md-12 wow fadeInUp'
                        data-wow-delay='.2s'
                    >
                        <h3 className='section-title'>
                            {getTranslateText('home.teachers').toUpperCase()}
                        </h3>
                    </div>
                    <div
                        className='col-md-12 wow fadeInUp'
                        data-wow-delay='.4s'
                    >
                        <Slider {...settings}>{renderSliderItem()}</Slider>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TeacherSlider
