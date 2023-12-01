/* eslint-disable jsx-a11y/alt-text */
import { getTranslateText } from 'utils/translate-utils'

const Level = () => (
    <section className='color'>
        <div className='container'>
            <div className='row'>
                <div className='col-md-12 wow fadeInUp' data-wow-delay='.2s'>
                    <h3 className='title'>{getTranslateText('home.level')}</h3>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.4s'
                >
                    <div className='card level-card'>
                        <div className='level-name blue'>Pre-A1+</div>
                        <b>{getTranslateText('home.level.1')}</b>
                        <p>
                            {getTranslateText('home.level.lv')}{' '}
                            <strong>B, 1, 2</strong>
                        </p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.6s'
                >
                    <div className='card level-card'>
                        <div className='level-name red'>Pre-A1+</div>
                        <b>Starters</b>
                        <p>
                            Level <strong>B, 1, 2</strong>
                        </p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='.8s'
                >
                    <div className='card level-card'>
                        <div className='level-name yellow'>Pre-A1+</div>
                        <b>Starters</b>
                        <p>
                            Level <strong>B, 1, 2</strong>
                        </p>
                    </div>
                </div>
                <div
                    className='col-md-3 col-6 wow fadeInUp'
                    data-wow-delay='1s'
                >
                    <div className='card level-card'>
                        <div className='level-name purple'>Pre-A1+</div>
                        <b>Starters</b>
                        <p>
                            Level <strong>B, 1, 2</strong>
                        </p>
                    </div>
                </div>
                <div className='col-md-12 wow fadeInUp' data-wow-delay='1.2s'>
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

export default Level
