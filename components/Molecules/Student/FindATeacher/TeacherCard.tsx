/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useReducer } from 'react'
import moment from 'moment'
import { notify } from 'contexts/Notification'
import { getCurrentWeek } from '../../../../utils/datetime-utils'
import CalendarAPI from '../../../../api/CalendarAPI'
import { nl2br } from '../../../../utils/string-utils'

export default function TeacherCard({ ...props }) {
    const { teacher } = props

    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            tab: 'video',
            week_start: moment().valueOf(),
            week_end: moment().add(7, 'days').valueOf(),
            available_schedule: []
        }
    )

    const days = getCurrentWeek(values.week_start)

    const onSwitchTab = (tab) => {
        if (tab !== values.tab) {
            setValues({ tab })
        }
        if (tab === 'calendar') {
            _getSimpleSchedule(teacher.user_id)
        }
    }

    const _getSimpleSchedule = (teacher_id) => {
        setValues({ isLoading: true })
        CalendarAPI.getSimpleCalendarByStudent(teacher_id)
            .then((res) => {
                setValues({ available_schedule: res, isLoading: false })
            })
            .catch((err) => {
                notify('error', err.message)
                setValues({ isLoading: false })
            })
    }

    return (
        <div className='teacher-card'>
            <div className='teacher-card-left'>
                <div className='teacher-card-detail-top'>
                    <div>
                        <span className='ant-avatar ant-avatar-circle ant-avatar-image'>
                            <img
                                src={
                                    teacher.user && teacher.user.avatar
                                        ? teacher.user.avatar
                                        : 'https://class.ispeak.vn/uploads/2017/04/logo_170416055632.png'
                                }
                            />
                            <i className='ant-avatar-flag' />
                        </span>
                        <div className='teacher-card-rating'>
                            <div>
                                <div className='teacher-card-stars'>
                                    <div className='stars-box'>
                                        {new Array(5)
                                            .fill(0)
                                            .map((item, index) => (
                                                <svg
                                                    height='16'
                                                    viewBox='0 0 24 24'
                                                    width='16'
                                                    key={index}
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='#ffc400'
                                                >
                                                    <path d='M11.315 3.639a.8.8 0 011.37 0l2.596 4.314a.8.8 0 00.505.366l4.905 1.136a.8.8 0 01.424 1.304l-3.3 3.802a.8.8 0 00-.193.594l.435 5.015a.8.8 0 01-1.11.806l-4.635-1.964a.8.8 0 00-.624 0l-4.636 1.964a.8.8 0 01-1.109-.806l.435-5.015a.8.8 0 00-.192-.594l-3.3-3.802a.8.8 0 01.423-1.304L8.214 8.32a.8.8 0 00.505-.366z' />
                                                </svg>
                                            ))}
                                        <span className='ml-1 number'>{5}</span>
                                    </div>
                                </div>
                                <p>
                                    <span>{teacher.total_lesson} Lessons</span>
                                </p>
                            </div>
                            <div>
                                <button
                                    className='ant-btn ant-btn-secondary ant-btn-sm'
                                    onClick={() => props.bookingModal(teacher)}
                                >
                                    <span>Book</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        className='teacher-card-information'
                        style={{ marginLeft: '45px' }}
                        onClick={() =>
                            window.open(
                                `${window.location.origin}/student/teachers/${teacher.user_id}`
                            )
                        }
                    >
                        <h1>
                            <span>
                                {teacher.user && teacher.user.full_name
                                    ? teacher.user.full_name
                                    : ''}
                            </span>
                        </h1>
                        <p className='newteacher-card-introduce'>
                            <span>Professional Teacher</span>
                        </p>
                        <div className='teacher-card-divider' />
                        <p className='newteacher-card-introduce'>
                            <span>Skills</span>
                        </p>
                        <h2 className='teacher-card-tec-language'>
                            <div>
                                <span className='language'>
                                    <span className='badge badge-pill badge-primary'>
                                        IELTS
                                    </span>
                                </span>
                                <span className='tooltip-container-box'>
                                    <span className='tooltip-container'>
                                        <span className='tooltip-reference'>
                                            <div>
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                            </div>
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span className='language'>
                                    <span className='badge badge-pill badge-primary'>
                                        TOEFL
                                    </span>
                                </span>
                                <span className='tooltip-container-box'>
                                    <span className='tooltip-container'>
                                        <span className='tooltip-reference'>
                                            <div>
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                            </div>
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span className='language'>
                                    <span className='badge badge-pill badge-primary'>
                                        TOEIC
                                    </span>
                                </span>
                                <span className='tooltip-container-box'>
                                    <span className='tooltip-container'>
                                        <span className='tooltip-reference'>
                                            <div>
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                            </div>
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span className='language'>
                                    <span className='badge badge-pill badge-primary'>
                                        ENGLISH FOR KIDS
                                    </span>
                                </span>
                                <span className='tooltip-container-box'>
                                    <span className='tooltip-container'>
                                        <span className='tooltip-reference'>
                                            <div>
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                            </div>
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span className='language'>
                                    <span className='badge badge-pill badge-primary'>
                                        BUSINESS ENGLISH
                                    </span>
                                </span>
                                <span className='tooltip-container-box'>
                                    <span className='tooltip-container'>
                                        <span className='tooltip-reference'>
                                            <div>
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                                <span className='level level-color-2 level-color-3' />
                                            </div>
                                        </span>
                                    </span>
                                </span>
                            </div>
                        </h2>
                    </div>
                </div>
                <div className='teacher-card-detail-bottom'>
                    <div className='teacher-card-information'>
                        <p className='newteacher-card-introduce'>
                            <span>Experience</span>
                        </p>
                        <h2 className='teacher-card-tec-language'>
                            <span className='language'>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: nl2br(teacher.experience)
                                    }}
                                />
                            </span>
                        </h2>
                        {/* <div className="teacher-card-rate">
                            <div className="teacher-card-hourly">
                                <p className="newteacher-card-introduce">
                                    <span>Hourly Rate From</span>
                                </p>
                                <h2 className="teacher-price-rate">
                                    <span>VND 577,158.03</span>
                                </h2>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className='teacher-card-right'>
                <div className='teacher-card-tab-head'>
                    <div className='teacher-card-tabs'>
                        <div
                            className={`teacher-card-tab ${
                                values.tab === 'video' ? 'active' : ''
                            }`}
                            onClick={() => onSwitchTab('video')}
                        >
                            <p>
                                <span>Video</span>
                            </p>
                        </div>
                        <div
                            className={`teacher-card-tab ${
                                values.tab === 'intro' ? 'active' : ''
                            }`}
                            onClick={() => onSwitchTab('intro')}
                        >
                            <p>
                                <span>Intro</span>
                            </p>
                        </div>
                        <div
                            className={`teacher-card-tab ${
                                values.tab === 'calendar' ? 'active' : ''
                            }`}
                            onClick={() => onSwitchTab('calendar')}
                        >
                            <p>
                                <span>Calendar</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='teacher-card-tab-body'>
                    <div
                        className={`teacher-card-video ${
                            values.tab !== 'video'
                                ? 'teacher-card-video-hidden'
                                : ''
                        }`}
                    >
                        <div className='iframe-video'>
                            <div className='video-player video_bg_poster'>
                                {teacher.intro_video ? (
                                    <video
                                        controls
                                        autoPlay={false}
                                        controlsList='nodownload'
                                    >
                                        <source
                                            src={teacher.intro_video}
                                            type='video/mp4'
                                        />
                                    </video>
                                ) : (
                                    <div className='text-center'>
                                        No Intro Video
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {values.tab === 'intro' ? (
                        <div className='teacher-card-intro'>
                            <p>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: nl2br(
                                            teacher.about_me
                                                ? teacher.about_me.slice(0, 255)
                                                : ''
                                        )
                                    }}
                                />
                            </p>
                        </div>
                    ) : values.tab === 'calendar' ? null : null}
                </div>
            </div>
            <style jsx>{`
                .teacher-card,
                .teacher-card-tablet {
                    position: relative;
                    border-radius: 6px;
                }
                .teacher-card {
                    display: -webkit-flex;
                    display: flex;
                    margin-bottom: 20px;
                    background: #fff;
                    box-shadow: 0 2px 12px rgb(0 40 117 / 6%);
                    transition: all 0.25s ease-in;
                }
                .teacher-card-left {
                    position: relative;
                    padding: 25px 25px 20px;
                    width: 70%;
                    min-height: 284px;
                    cursor: pointer;
                }
                .teacher-card-avatar,
                .teacher-card-detail-bottom,
                .teacher-card-detail-top {
                    display: -webkit-flex;
                    display: flex;
                }
                .ant-avatar-image {
                    background: transparent;
                    width: 80px;
                    height: 80px;
                    line-height: 80px;
                    font-size: 18px;
                }
                .ant-avatar {
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    color: #4d4d4d;
                    font-size: 14px;
                    font-variant: normal;
                    line-height: 1.5715;
                    list-style: none;
                    -webkit-font-feature-settings: normal;
                    font-feature-settings: normal;
                    position: relative;
                    display: inline-block;
                    color: #fff;
                    white-space: nowrap;
                    text-align: center;
                    vertical-align: middle;
                    background: #ccc;
                    border: 1px solid #e9e9eb;
                    border-radius: 50%;
                }
                .ant-avatar > img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    -o-object-fit: cover;
                    object-fit: cover;
                    border-radius: 50%;
                }
                .ant-avatar-flag {
                    display: inline-block;
                    background-size: contain;
                    background-position: 50% center;
                    background-repeat: no-repeat;
                    border-radius: 50%;
                    border: 1px solid rgb(233, 233, 235);
                    right: 0px;
                    width: 24px;
                    height: 24px;
                    background-image: url(https://scdn.italki.com/orion/static/flags/us.svg);
                }
                .ant-avatar-flag {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
                .teacher-card-rating {
                    width: 100px;
                    text-align: center;
                    position: absolute;
                    margin-top: 28px;
                    margin-left: -8px;
                }
                .teacher-card-stars {
                    margin: -5px 0 10px;
                }
                .stars-box {
                    height: 12px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                }
                .teacher-card-rating p {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-weight: 300;
                    font-size: 12px;
                    line-height: 18px;
                }
                .ant-btn-secondary {
                    color: #fff;
                    background-color: #ff554b;
                    border-color: #ff554b;
                    text-shadow: none;
                    -webkit-box-shadow: none;
                    box-shadow: none;
                }
                .ant-btn-sm {
                    height: 32px;
                    padding: 8px 12px;
                }
                .ant-btn-lg,
                .ant-btn-sm {
                    min-width: 80px;
                    font-size: 14px;
                    border-radius: 4px;
                }
                .ant-btn {
                    position: relative;
                    display: inline-block;
                    font-weight: 500;
                    letter-spacing: 0.75px;
                    white-space: nowrap;
                    text-align: center;
                    background-image: none;
                    border: 1px solid transparent;
                    -webkit-box-shadow: none;
                    box-shadow: none;
                    cursor: pointer;
                    -webkit-transition: all 0.3s
                        cubic-bezier(0.645, 0.045, 0.355, 1);
                    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    -ms-touch-action: manipulation;
                    touch-action: manipulation;
                    text-transform: uppercase;
                    line-height: 1;
                    min-width: 80px;
                    height: 40px;
                    padding: 12px 16px;
                    font-size: 14px;
                    border-radius: 4px;
                }
                .ant-btn > i,
                .ant-btn > span {
                    display: inline-block;
                    -webkit-transition: margin-left 0.3s
                        cubic-bezier(0.645, 0.045, 0.355, 1);
                    transition: margin-left 0.3s
                        cubic-bezier(0.645, 0.045, 0.355, 1);
                    pointer-events: none;
                }
                .teacher-card-information {
                    margin-left: 30px;
                    -webkit-flex: 1 1;
                    flex: 1 1;
                }
                .teacher-card-header-tablet h1,
                .teacher-card-information h1 {
                    margin-bottom: 5px;
                    font-size: 23px;
                    font-weight: 400;
                }
                .teacher-card-information h1 > span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 256px;
                    white-space: nowrap;
                }
                .teacher-card-header-tablet p,
                .teacher-card-information p {
                    font-size: 12px;
                    font-weight: 300;
                    line-height: 18px;
                    color: #777;
                    text-transform: uppercase;
                }
                .newteacher-card-introduce > span {
                    font-style: normal;
                    font-weight: 300;
                    font-size: 12px;
                    line-height: 16px;
                    letter-spacing: 0.75px;
                    text-transform: uppercase;
                    color: #8c8c8c;
                    vertical-align: middle;
                }
                .teacher-card-divider {
                    margin: 12px 0;
                    width: 15px;
                    height: 2px;
                    border-radius: 1px;
                    background: #ff4338;
                }
                .teacher-card-header-tablet h2,
                .teacher-card-information h2 {
                    display: -webkit-flex;
                    display: flex;
                    min-height: 25px;
                    font-size: 16px;
                    font-weight: 400;
                    -webkit-flex-wrap: wrap;
                    flex-wrap: wrap;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .teacher-card-detail-bottom {
                    margin-left: 95px;
                }
                .teacher-card-tec-language div {
                    margin-right: 10px;
                }
                .teacher-card-left:after {
                    content: ' ';
                    width: 1px;
                    position: absolute;
                    top: 24px;
                    bottom: 24px;
                    background-color: #e9e9eb;
                    right: 0;
                }
                .teacher-card-right {
                    padding: 25px 20px 20px;
                    width: 386px;
                }
                .teacher-card-tab-head {
                    margin-bottom: 15px;
                }
                .teacher-card-tab-head,
                .teacher-card-tabs {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-justify-content: center;
                    justify-content: center;
                }
                .teacher-card-tabs {
                    position: relative;
                }
                .teacher-card-tab {
                    margin: 0 20px 10px 0;
                    cursor: pointer;
                }
                .teacher-card-tab > p {
                    font-size: 14px;
                    margin: 0;
                }
                .teacher-card-tab.active {
                    border-bottom: 2px solid #ff4338;
                }
                .iframe-video {
                    position: relative;
                    margin: 0 auto;
                    width: 343px;
                    height: 192px;
                    border-radius: 6px;
                    overflow: hidden;
                }
                .video_bg_poster {
                    background-size: cover;
                    background-repeat: no-repeat;
                }
                .video-player {
                    position: relative;
                    height: 192px;
                }
                .video-player video {
                    width: 100%;
                    height: 100%;
                    background: #000;
                    object-fit: cover;
                }
                .teacher-card-video-hidden {
                    display: none;
                }
            `}</style>
        </div>
    )
}
