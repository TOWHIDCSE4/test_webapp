/* eslint-disable jsx-a11y/alt-text */
import { getTranslateText } from 'utils/translate-utils'

const WhyLearn = () => (
    <section>
        <div className='container'>
            <div className='row'>
                <div className='col-md-3 wow fadeInUp' data-wow-delay='.1s'>
                    <div className='card why-card'>
                        <h3 className='title' style={{ textAlign: 'left' }}>
                            {getTranslateText('home.whyLearn')}
                        </h3>
                        <p>{getTranslateText('home.whyLearn.reason')}</p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.2s'
                >
                    <div className='card why-card'>
                        <img src='assets/images/homepage/g1.png' />
                        <b>{getTranslateText('home.whyLearn.1v1')}</b>
                        <p>{getTranslateText('home.whyLearn.1v1.desc')}</p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.3s'
                >
                    <div className='card why-card'>
                        <img src='assets/images/homepage/g2.png' />
                        <b>{getTranslateText('home.whyLearn.studyFromHome')}</b>
                        <p>
                            {getTranslateText(
                                'home.whyLearn.studyFromHome.desc'
                            )}
                        </p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.4s'
                >
                    <div className='card why-card'>
                        <img src='assets/images/homepage/g3.png' />
                        <b>{getTranslateText('home.whyLearn.support')}</b>
                        <p>{getTranslateText('home.whyLearn.support.desc')}</p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.5s'
                >
                    <div className='card why-card'>
                        <img src='assets/images/homepage/g7.png' />
                        <b>
                            {getTranslateText('home.whyLearn.courseSchedule')}
                        </b>
                        <p>
                            {getTranslateText(
                                'home.whyLearn.courseSchedule.desc'
                            )}
                        </p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.6s'
                >
                    <div className='card why-card'>
                        <img src='assets/images/homepage/g6.png' />
                        <b>{getTranslateText('home.whyLearn.tuition')}</b>
                        <p>{getTranslateText('home.whyLearn.tuition.desc')}</p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.7s'
                >
                    <div className='card why-card'>
                        <img src='assets/images/homepage/g4.png' />
                        <b>{getTranslateText('home.whyLearn.skills')}</b>
                        <p>{getTranslateText('home.whyLearn.skills.desc')}</p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.8s'
                >
                    <div className='card why-card'>
                        <img src='assets/images/homepage/g7.png' />
                        <b>{getTranslateText('home.whyLearn.1v1')}</b>
                        <p>{getTranslateText('home.whyLearn.1v1.desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

export default WhyLearn
