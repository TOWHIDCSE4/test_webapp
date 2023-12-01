import React, { Component } from 'react'
import Slider from 'react-slick'
import { COMMENT_IN_HOMEPAGE } from 'const'
import { getTranslateText } from 'utils/translate-utils'
import SliderComment from '../SliderComment'

export default class PreviousNextMethods extends Component {
    slider: any

    constructor(props) {
        super(props)
        this.next = this.next.bind(this)
        this.previous = this.previous.bind(this)
    }

    next() {
        this.slider.slickNext()
    }

    previous() {
        this.slider.slickPrev()
    }

    renderSliderItem = () =>
        COMMENT_IN_HOMEPAGE.map((item, index) => (
            <div key={index}>
                <SliderComment
                    src={item.src}
                    name={item.name}
                    info={item.info}
                    content={item.content}
                    key={index}
                />
            </div>
        ))

    render() {
        const settings = {
            dots: false,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        }
        return (
            <div>
                <div
                    className='col-md-12 mb-4 p-0 flex justify-content-between'
                    // data-wow-delay='.2s'
                >
                    <h3 className='title-homepage mb-4 table-width-600px mobile-width-310px'>
                        {getTranslateText('home.comment.title')}
                        <span className='text-blue'>English</span>
                        <span className='text-green'>Plus?</span>
                    </h3>
                    <div className='flex justify-content-center action-comment-laptop'>
                        <div
                            className='action-comment p-2 rounded-full mr-2 cursor-pointer'
                            onClick={this.previous}
                        >
                            <img
                                src='../assets/images/homepage/svgs/comment_pres_arrow.svg'
                                alt='pres arrow'
                                title='English Plus'
                                className='arrow-comment'
                            />
                        </div>

                        <div
                            className='action-comment p-2 rounded-full cursor-pointer'
                            onClick={this.next}
                        >
                            <img
                                src='../assets/images/homepage/svgs/comment_next_arrow.svg'
                                alt='next arrow'
                                title='English Plus'
                                className='arrow-comment'
                            />
                        </div>
                    </div>
                </div>
                <Slider ref={(c) => (this.slider = c)} {...settings}>
                    {this.renderSliderItem()}
                </Slider>
                <div className='flex justify-content-center action-comment-mobile'>
                    <div
                        className='action-comment p-2 rounded-full flex align-center justify-content-center mr-2 cursor-pointer'
                        onClick={this.previous}
                    >
                        <img
                            src='../assets/images/homepage/svgs/comment_pres_arrow.svg'
                            alt='pres arrow'
                            title='English Plus'
                            className='arrow-comment'
                        />
                    </div>

                    <div
                        className='action-comment p-2 rounded-full flex align-center justify-content-center cursor-pointer'
                        onClick={this.next}
                    >
                        <img
                            src='../assets/images/homepage/svgs/comment_next_arrow.svg'
                            alt='next arrow'
                            title='English Plus'
                            className='arrow-comment'
                        />
                    </div>
                </div>
            </div>
        )
    }
}
