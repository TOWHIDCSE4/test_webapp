import React, { FunctionComponent } from 'react'

const Banner: FunctionComponent = () => (
    <div className='home-banner'>
        <div className='container'>
            <div className='row'>
                <div className='col-md-5'>
                    <div className='text-container'>
                        <h1 className='typing'>
                            <span style={{ color: '#42D698' }}>Study</span>{' '}
                            English
                            <br />
                            <span style={{ color: '#B2E1F5' }}>
                                with your
                                <br />
                                online teacher
                            </span>
                        </h1>
                        <div className='hiders'>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-7'>
                    <div className='banner-img-container'>
                        <img
                            src='../assets/images/homepage/b2.png'
                            alt=''
                            title=''
                            className='img-fluid wow swing'
                            data-wow-delay='.2s'
                        />
                        <img
                            src='../assets/images/homepage/b1.png'
                            alt=''
                            title=''
                            className='img-fluid wow swing'
                            data-wow-delay='.4s'
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default Banner
