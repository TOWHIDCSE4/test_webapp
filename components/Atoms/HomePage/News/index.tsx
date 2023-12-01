import { getTranslateText } from 'utils/translate-utils'

const News = () => (
    <section>
        <div className='container'>
            <div className='row'>
                <div className='col-md-12 wow fadeInUp' data-wow-delay='.2s'>
                    <h3 className='section-title'>
                        {getTranslateText('home.sampleVideo').toUpperCase()}
                    </h3>
                </div>
                <div
                    className='col-lg-6 col-md-6 col-sm-12 col-12 wow fadeInUp'
                    data-wow-delay='.4s'
                >
                    <iframe
                        className='video-hoc-mau'
                        src='https://www.youtube.com/embed/1DrptEL2ys8'
                        title='YouTube video player'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        style={{
                            width: '100%',
                            minHeight: '315px',
                            borderRadius: '10px'
                        }}
                    />
                </div>
                <div
                    className='col-lg-6 col-md-6 col-sm-12 col-12 wow fadeInUp'
                    data-wow-delay='.4s'
                >
                    <iframe
                        className='video-hoc-mau'
                        src='https://www.youtube.com/embed/JPYxWiqjh-k'
                        title='YouTube video player'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        style={{
                            width: '100%',
                            minHeight: '315px',
                            borderRadius: '10px'
                        }}
                    />
                </div>
            </div>
        </div>
    </section>
)

export default News
