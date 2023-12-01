/* eslint-disable jsx-a11y/alt-text */
import { getTranslateText } from 'utils/translate-utils'

const LearnFor = () => (
    <section>
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h3
                        className='section-title wow fadeInUp'
                        data-wow-delay='.2s'
                    >
                        {getTranslateText('home.wantLearnAbout').toUpperCase()}
                    </h3>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.4s'
                >
                    <a href='#'>
                        <div className='card card-shadow shadow-black learn1-card'>
                            <img src='assets/images/homepage/s1.png' />
                            <div>
                                {getTranslateText(
                                    'home.wantLearnAbout.children'
                                )}
                            </div>
                        </div>
                    </a>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.6s'
                >
                    <a href='#'>
                        <div className='card card-shadow shadow-black learn1-card'>
                            <img src='assets/images/homepage/s2.png' />
                            <div>
                                {getTranslateText('home.wantLearnAbout.adult')}
                            </div>
                        </div>
                    </a>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.8s'
                >
                    <a href='#'>
                        <div className='card card-shadow shadow-black learn1-card'>
                            <img src='assets/images/homepage/s3.png' />
                            <div>IELTS</div>
                        </div>
                    </a>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='1s'
                >
                    <a href='#'>
                        <div className='card card-shadow shadow-black learn1-card'>
                            <img src='assets/images/homepage/s4.png' />
                            <div>TOEIC</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </section>
)

export default LearnFor
