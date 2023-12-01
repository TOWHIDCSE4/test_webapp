/* eslint-disable jsx-a11y/alt-text */
import { getTranslateText } from 'utils/translate-utils'

const HowItWorks = () => (
    <section className='color'>
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h3
                        className='title wow fadeInUp'
                        data-wow-delay='.2s'
                        style={{ color: '#fff' }}
                    >
                        {getTranslateText('home.how')}
                    </h3>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.4s'
                >
                    <div className='card how-card'>
                        <img src='assets/images/homepage/h1.png' />
                        <b>{getTranslateText('home.how.register')}</b>
                        <p>{getTranslateText('home.how.registerDesc')}</p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.6s'
                >
                    <div className='card how-card'>
                        <img src='assets/images/homepage/h2.png' />
                        <b>{getTranslateText('home.how.booking')}</b>
                        <p>{getTranslateText('home.how.bookingDesc')}</p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.8s'
                >
                    <div className='card how-card'>
                        <img src='assets/images/homepage/h3.png' />
                        <b>{getTranslateText('home.how.learn')}</b>
                        <p>{getTranslateText('home.how.learnDesc')}</p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='1s'
                >
                    <div className='card how-card'>
                        <img src='assets/images/homepage/h4.png' />
                        <b>{getTranslateText('home.how.review')}</b>
                        <p>{getTranslateText('home.how.reviewDesc')}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

export default HowItWorks
