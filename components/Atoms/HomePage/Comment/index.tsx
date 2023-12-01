import Slider from 'react-slick'
import { getTranslateText } from 'utils/translate-utils'
import { COMMENT_IN_HOMEPAGE } from 'const'
import SliderComment from '../SliderComment'
import PreviousNextMethods from './previousNextMethods'

const Comment = () => {
    const settings = {}

    return (
        <section style={{ marginBottom: '30px !important' }}>
            <div className='component-main-section p-0'>
                <div className='row m-0'>
                    <div
                        className='col-md-12 wow fadeInUp p-0 not-laptop-remove-fadeInUp'
                        data-wow-delay='.4s'
                    >
                        <PreviousNextMethods />
                        {/* <Slider {...settings}>{renderSliderItem()}</Slider> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Comment
