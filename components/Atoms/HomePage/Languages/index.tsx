/* eslint-disable jsx-a11y/alt-text */
import { getTranslateText } from 'utils/translate-utils'

const Languages = () => (
    <section>
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h3 className='title wow fadeInUp' data-wow-delay='.1s'>
                        {getTranslateText('home.wantLearnLanguage')}
                    </h3>
                </div>
                <div
                    className='col-md-2 col-6 wow fadeInUp'
                    data-wow-delay='.2s'
                >
                    <a href='#'>
                        <div className='card card-shadow shadow-black learn2-card'>
                            <img src='assets/images/homepage/s21.png' />
                            <div>Mandarin</div>
                        </div>
                    </a>
                </div>
                <div
                    className='col-md-2 col-6 wow fadeInUp'
                    data-wow-delay='.3s'
                >
                    <a href='#'>
                        <div className='card card-shadow shadow-black learn2-card'>
                            <img src='assets/images/homepage/s22.png' />
                            <div>Japanese</div>
                        </div>
                    </a>
                </div>
                <div
                    className='col-md-2 col-6 wow fadeInUp'
                    data-wow-delay='.4s'
                >
                    <a href='#'>
                        <div className='card card-shadow shadow-black learn2-card'>
                            <img src='assets/images/homepage/s23.png' />
                            <div>Francis</div>
                        </div>
                    </a>
                </div>
                <div
                    className='col-md-2 col-6 wow fadeInUp'
                    data-wow-delay='.5s'
                >
                    <a href='#'>
                        <div className='card card-shadow shadow-black learn2-card'>
                            <img src='assets/images/homepage/s24.png' />
                            <div>Germany</div>
                        </div>
                    </a>
                </div>
                <div
                    className='col-md-2 col-6 wow fadeInUp'
                    data-wow-delay='.6s'
                >
                    <a href='#'>
                        <div className='card card-shadow shadow-black learn2-card'>
                            <img src='assets/images/homepage/s25.png' />
                            <div>Spanis</div>
                        </div>
                    </a>
                </div>
                <div
                    className='col-md-2 col-6 wow fadeInUp'
                    data-wow-delay='.7s'
                >
                    <a href='#'>
                        <div className='card card-shadow learn2-card'>
                            <img src='assets/images/homepage/s26.png' />
                            <div>{getTranslateText('home.more')}</div>
                        </div>
                    </a>
                </div>
                <div className='col-md-12 wow fadeInUp' data-wow-delay='.8s'>
                    <br />
                    <button
                        className='btn my-2 my-sm-0 big-bt card-shadow'
                        type='submit'
                    >
                        <span>{getTranslateText('home.viewMore')}</span>
                        <img src='assets/images/homepage/bt.png' />
                    </button>
                </div>
            </div>
        </div>
    </section>
)

export default Languages
