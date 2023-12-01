/* eslint-disable jsx-a11y/alt-text */
import moment from 'moment'
import { getTranslateText } from 'utils/translate-utils'
import { toReadableDatetime } from '../../../../utils/datetime-utils'
import { nl2br } from '../../../../utils/string-utils'

export default function TeacherLeft({ ...props }) {
    const { teacher } = props
    return (
        <div className='Teacher-main'>
            <div
                className='TeacherInfoCard teacherCard-box1 TeacherInfoCard-desktop'
                id='teacher_profile_nav_aboutme'
            >
                <div className='teacherCard'>
                    <div className='teacherCard-left'>
                        <span className='ant-avatar ant-avatar-circle ant-avatar-image'>
                            <img
                                src={
                                    teacher.user_info.avatar ||
                                    'https://class.ispeak.vn/uploads/2017/04/logo_170416055632.png'
                                }
                            />
                            <i className='ant-avatar-flag' />
                        </span>
                        <div className='Online'>
                            <span>Online</span>
                        </div>
                    </div>
                    <div className='teacherCard-body'>
                        <div className='teacherCard-part1'>
                            <div className='teacherCard-middle'>
                                <div className='teacherCard-name'>
                                    {teacher.user_info
                                        ? teacher.user_info.full_name
                                        : ''}
                                </div>
                                <div className='teacherCard-personalInfo'>
                                    <div>
                                        <span>
                                            {getTranslateText(
                                                'professional_teacher'
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        {/* {
                                            teacher.location_id !== -1 ? <span>From {teacher.location.name}</span> : null
                                        } */}
                                    </div>
                                    <div>
                                        <span>
                                            Living in Potchefstroom, South
                                            Africa
                                        </span>
                                        <span className='teacherCard-time'>
                                            &nbsp;(11:19&nbsp;
                                            <span className='user-based-timezone'>
                                                UTC+02:00
                                            </span>
                                            )
                                        </span>
                                    </div>
                                </div>
                                <div className='redbar' />
                            </div>
                            <div className='teacherCard-right'>
                                <div
                                    id='teacher_profile_icons_anchor'
                                    className='teacherCard-right-icon'
                                >
                                    <div className='flex items-center justify-center'>
                                        <svg
                                            height='24'
                                            viewBox='0 0 24 24'
                                            width='24'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='#333'
                                        >
                                            <g
                                                clipRule='evenodd'
                                                fillRule='evenodd'
                                            >
                                                <path d='M5 4c-.69 0-1.25.56-1.25 1.25V20.5H16a4.25 4.25 0 004.25-4.25v-4a.75.75 0 011.5 0v4A5.75 5.75 0 0116 22H3a.75.75 0 01-.75-.75v-16A2.75 2.75 0 015 2.5h7A.75.75 0 0112 4z' />
                                                <path d='M18.066 2.22a.75.75 0 00-1.06 1.06l2.219 2.22H17a6.75 6.75 0 00-6.75 6.75v2a.75.75 0 001.5 0v-2C11.75 9.35 14.1 7 17 7h2.296l-2.29 2.29a.75.75 0 101.06 1.061L21.6 6.816a.75.75 0 000-1.06z' />
                                            </g>
                                        </svg>
                                    </div>
                                    <svg
                                        height='24'
                                        viewBox='0 0 24 24'
                                        width='24'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='#333'
                                        className='Favourite'
                                    >
                                        <path
                                            clipRule='evenodd'
                                            d='M14.298 3.688a5.75 5.75 0 016.267 9.38s0-.001 0 0l-8.035 8.034a.75.75 0 01-1.06 0l-8.036-8.035a5.75 5.75 0 018.133-8.132l.433.433.433-.433a5.751 5.751 0 011.865-1.247zM16.5 4.75a4.25 4.25 0 00-3.005 1.245l-.964.964a.75.75 0 01-1.06 0l-.964-.964a4.25 4.25 0 10-6.011 6.011L12 19.511l7.505-7.505a4.25 4.25 0 00-3.006-7.256z'
                                            fillRule='evenodd'
                                        />
                                    </svg>
                                    <div className='share-teacher-wrapper'>
                                        <div className='TagMenu TagMenu-desktop TagMenu-rerotate90'>
                                            <div className='chat-send-attachment-btn h-6 w-6'>
                                                <svg
                                                    fill='#333'
                                                    height='24'
                                                    viewBox='0 0 24 24'
                                                    width='24'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <g>
                                                        <circle
                                                            cx='5'
                                                            cy='12'
                                                            r='1.5'
                                                        />
                                                        <circle
                                                            cx='12'
                                                            cy='12'
                                                            r='1.5'
                                                        />
                                                        <circle
                                                            cx='19'
                                                            cy='12'
                                                            r='1.5'
                                                        />
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className='TagMenu-menu TagMenu-menu-bottom-right TagMenu-hidden'>
                                                <div
                                                    className='TagMenu-menu-option'
                                                    data-value='5'
                                                >
                                                    {getTranslateText(
                                                        'switch_to_user_profile'
                                                    )}
                                                </div>
                                                <div
                                                    className='TagMenu-menu-option'
                                                    data-value='2'
                                                >
                                                    {getTranslateText(
                                                        'report_this_teacher'
                                                    )}
                                                </div>
                                                <div
                                                    className='TagMenu-menu-option'
                                                    data-value='3'
                                                >
                                                    {getTranslateText(
                                                        'block_this_teacher'
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='teacherCard-right-body'>
                                    <div className='teacherCard-stars'>
                                        <div className='stars-box'>
                                            <svg
                                                height='16'
                                                viewBox='0 0 24 24'
                                                width='16'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='#ffc400'
                                            >
                                                <path d='M11.315 3.639a.8.8 0 011.37 0l2.596 4.314a.8.8 0 00.505.366l4.905 1.136a.8.8 0 01.424 1.304l-3.3 3.802a.8.8 0 00-.193.594l.435 5.015a.8.8 0 01-1.11.806l-4.635-1.964a.8.8 0 00-.624 0l-4.636 1.964a.8.8 0 01-1.109-.806l.435-5.015a.8.8 0 00-.192-.594l-3.3-3.802a.8.8 0 01.423-1.304L8.214 8.32a.8.8 0 00.505-.366z' />
                                            </svg>
                                            <svg
                                                height='16'
                                                viewBox='0 0 24 24'
                                                width='16'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='#ffc400'
                                            >
                                                <path d='M11.315 3.639a.8.8 0 011.37 0l2.596 4.314a.8.8 0 00.505.366l4.905 1.136a.8.8 0 01.424 1.304l-3.3 3.802a.8.8 0 00-.193.594l.435 5.015a.8.8 0 01-1.11.806l-4.635-1.964a.8.8 0 00-.624 0l-4.636 1.964a.8.8 0 01-1.109-.806l.435-5.015a.8.8 0 00-.192-.594l-3.3-3.802a.8.8 0 01.423-1.304L8.214 8.32a.8.8 0 00.505-.366z' />
                                            </svg>
                                            <svg
                                                height='16'
                                                viewBox='0 0 24 24'
                                                width='16'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='#ffc400'
                                            >
                                                <path d='M11.315 3.639a.8.8 0 011.37 0l2.596 4.314a.8.8 0 00.505.366l4.905 1.136a.8.8 0 01.424 1.304l-3.3 3.802a.8.8 0 00-.193.594l.435 5.015a.8.8 0 01-1.11.806l-4.635-1.964a.8.8 0 00-.624 0l-4.636 1.964a.8.8 0 01-1.109-.806l.435-5.015a.8.8 0 00-.192-.594l-3.3-3.802a.8.8 0 01.423-1.304L8.214 8.32a.8.8 0 00.505-.366z' />
                                            </svg>
                                            <svg
                                                height='16'
                                                viewBox='0 0 24 24'
                                                width='16'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='#ffc400'
                                            >
                                                <path d='M11.315 3.639a.8.8 0 011.37 0l2.596 4.314a.8.8 0 00.505.366l4.905 1.136a.8.8 0 01.424 1.304l-3.3 3.802a.8.8 0 00-.193.594l.435 5.015a.8.8 0 01-1.11.806l-4.635-1.964a.8.8 0 00-.624 0l-4.636 1.964a.8.8 0 01-1.109-.806l.435-5.015a.8.8 0 00-.192-.594l-3.3-3.802a.8.8 0 01.423-1.304L8.214 8.32a.8.8 0 00.505-.366z' />
                                            </svg>
                                            <svg
                                                height='16'
                                                viewBox='0 0 24 24'
                                                width='16'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='#ffc400'
                                            >
                                                <path d='M11.315 3.639a.8.8 0 011.37 0l2.596 4.314a.8.8 0 00.505.366l4.905 1.136a.8.8 0 01.424 1.304l-3.3 3.802a.8.8 0 00-.193.594l.435 5.015a.8.8 0 01-1.11.806l-4.635-1.964a.8.8 0 00-.624 0l-4.636 1.964a.8.8 0 01-1.109-.806l.435-5.015a.8.8 0 00-.192-.594l-3.3-3.802a.8.8 0 01.423-1.304L8.214 8.32a.8.8 0 00.505-.366z' />
                                            </svg>
                                            <span className='ml-1 number'>
                                                5.0
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span>17 LESSONS</span>
                                    </div>
                                    <div>
                                        <span>16 STUDENTS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='teacherCard-part2'>
                            <div>
                                <div className='teacherCard-teaches'>
                                    <div className='teacherCard-teaches-title'>
                                        <span>Teaches</span>
                                    </div>
                                    <div className='teacherCard-teaches-languages'>
                                        <div>
                                            <span className='language'>
                                                <span>English</span>
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
                                    </div>
                                </div>
                                {/* <div className="teacherCard-teaches">
                                    <span className="teacherCard-teaches-title">
                                        <span>Also speaks</span>
                                    </span>
                                    <div className="teacherCard-teaches-languages">
                                        <div>
                                            <span className="language">
                                                <span>Sotho</span>
                                            </span>
                                            <span className="tooltip-container-box" gap="5">
                                                <span className="tooltip-container" placement="bottom">
                                                    <span className="tooltip-reference">
                                                        <div>
                                                            <span className="level level-color-2"></span>
                                                            <span className="level level-color-2"></span>
                                                            <span className="level level-color-2"></span>
                                                            <span className="level level-color-2"></span>
                                                            <span className="level level-color-2"></span>
                                                        </div>
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                        <div>
                                            <span className="language">
                                                <span>Afrikaans</span>
                                            </span>
                                            <span className="tooltip-container-box" gap="5">
                                                <span className="tooltip-container" placement="bottom">
                                                    <span className="tooltip-reference">
                                                        <div>
                                                            <span className="level level-color-2"></span>
                                                            <span className="level level-color-2"></span>
                                                            <span className="level level-color-2"></span>
                                                            <span className="level level-color-2"></span>
                                                            <span className="level level-color-1"></span>
                                                        </div>
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                        <div>
                                            <span className="language">
                                                <span>Other</span>
                                            </span>
                                            <span className="tooltip-container-box" gap="5">
                                                <span className="tooltip-container" placement="bottom">
                                                    <span className="tooltip-reference">
                                                        <div>
                                                            <span className="level level-color-1"></span>
                                                            <span className="level level-color-1"></span>
                                                            <span className="level level-color-1"></span>
                                                            <span className="level level-color-1"></span>
                                                            <span className="level level-color-1"></span>
                                                        </div>
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='aboutMe'>
                    <div />
                    <div className='aboutMeReadMore'>
                        <h2 className='cardTitle'>
                            <span>About Me</span>
                            <span className='aboutMeTime'>
                                <span>
                                    EnglishPlus teacher since{' '}
                                    {teacher.created_time
                                        ? toReadableDatetime(
                                              teacher.created_time
                                          ).date
                                        : null}
                                </span>
                            </span>
                        </h2>
                        <div className='aboutMe-content'>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: nl2br(teacher.about_me)
                                }}
                            />
                        </div>
                    </div>
                    <div className='aboutMeReadMore'>
                        <h2 className='cardTitle'>
                            <span>Experience</span>
                        </h2>
                        <div className='aboutMe-content'>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: nl2br(teacher.experience)
                                }}
                            />
                        </div>
                    </div>
                    {/* <div className="aboutMeReadMore">
                        <h2 className="cardTitle">
                            <span>My Lessons &amp; Teaching Style</span>
                        </h2>
                        <div className="aboutMe-content">I use the delegator style, as I believe the classroom is a place for all to participate. The classroom is a shared 50/50 between the teacher and student.  I believe to learn one has to fully participate and be present and engaging during class. Never be afraid to ask any question, there's no such thing as a stupid question.
I tailor make my lessons based on the students individual needs and goals. Visuals and Audio are commonly used in my classroom.</div>
                    </div> */}
                    <div className='teachingMaterial'>
                        <h2 className='cardTitle'>
                            <span>Skills</span>
                        </h2>
                        <ul>
                            <li>
                                <span>IELTS</span>
                            </li>
                            <li>
                                <span>TOEIC</span>
                            </li>
                            <li>
                                <span>ENGLISH FOR KIDS</span>
                            </li>
                            <li>
                                <span>BUSINESS ENGLISH</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .Teacher-main,
                .Teacher-mobile .Teacher-main,
                .Teacher-tablet .Teacher-main {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    width: 75%;
                }
                .Teacher-main {
                    margin-right: 20px;
                }
                .teacherCard-box1,
                .Teacher-mobile .teacherCard-box1,
                .Teacher-tablet .teacherCard-box1 {
                    // width: 752px;
                    margin-bottom: 21px;
                    border-radius: 6px;
                    background-color: #fff;
                    box-shadow: 0 7px 25px 0 rgb(0 0 0 / 10%);
                    overflow: hidden;
                }
                .Teacher-main > div,
                .Teacher-desktop .teacher-right-absolute > div,
                .Teacher-desktop .teacher-right-fixed > div,
                .Teacher-desktop .teacher-right > div {
                    box-shadow: 0 2px 12px rgb(0 40 117 / 6%);
                    border-radius: 4px;
                }
                .TeacherInfoCard-desktop .teacherCard,
                .TeacherInfoCard-mobile .teacherCard,
                .TeacherInfoCard-tablet .teacherCard {
                    margin-bottom: 40px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: flex-start;
                    justify-content: flex-start;
                    -webkit-align-items: flex-start;
                    align-items: flex-start;
                }
                .TeacherInfoCard-desktop .teacherCard {
                    margin-bottom: 30px;
                }
                .TeacherInfoCard-desktop .teacherCard-left,
                .TeacherInfoCard-mobile .teacherCard-left,
                .TeacherInfoCard-tablet .teacherCard-left {
                    padding: 30px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    -webkit-justify-content: flex-start;
                    justify-content: flex-start;
                    -webkit-align-items: center;
                    align-items: center;
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
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    border-radius: 50%;
                }
                .ant-avatar-image {
                    background: transparent;
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    font-size: 18px;
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
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    display: inline-block;
                    background-size: contain;
                    background-position: 50% center;
                    background-repeat: no-repeat;
                    border-radius: 50%;
                    border: 1px solid rgb(233, 233, 235);
                    right: 0px;
                    width: 24px;
                    height: 24px;
                    background-image: url(https://scdn.italki.com/orion/static/flags/za.svg);
                }
                .TeacherInfoCard-desktop .Online,
                .TeacherInfoCard-mobile .Online,
                .TeacherInfoCard-tablet .Online {
                    margin-top: 15px;
                    font-size: 11px;
                    color: #777;
                }
                .TeacherInfoCard-desktop .Online:before,
                .TeacherInfoCard-mobile .Online:before,
                .TeacherInfoCard-tablet .Online:before {
                    content: '';
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    margin-right: 5px;
                    border-radius: 4px;
                    background-color: #5ebd5e;
                }
                .TeacherInfoCard-desktop .teacherCard-body,
                .TeacherInfoCard-mobile .teacherCard-body,
                .TeacherInfoCard-tablet .teacherCard-body {
                    width: 100%;
                }
                .TeacherInfoCard-desktop .teacherCard-part1,
                .TeacherInfoCard-mobile .teacherCard-part1,
                .TeacherInfoCard-tablet .teacherCard-part1 {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                    -webkit-align-items: flex-start;
                    align-items: flex-start;
                }
                .TeacherInfoCard-desktop .teacherCard-middle,
                .TeacherInfoCard-mobile .teacherCard-middle,
                .TeacherInfoCard-tablet .teacherCard-middle {
                    padding-top: 30px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    -webkit-justify-content: flex-start;
                    justify-content: flex-start;
                    -webkit-align-items: flex-start;
                    align-items: flex-start;
                }
                .TeacherInfoCard-desktop .teacherCard-name,
                .TeacherInfoCard-mobile .teacherCard-name,
                .TeacherInfoCard-tablet .teacherCard-name {
                    margin-bottom: 3px;
                    font-size: 23px;
                    font-weight: 500;
                    color: #333;
                }
                .TeacherInfoCard-desktop .teacherCard-personalInfo,
                .TeacherInfoCard-mobile .teacherCard-personalInfo,
                .TeacherInfoCard-tablet .teacherCard-personalInfo {
                    margin-bottom: 15px;
                    font-size: 14px;
                    font-weight: 300;
                    font-style: normal;
                    font-stretch: normal;
                    line-height: 25px;
                    letter-spacing: normal;
                    text-align: left;
                    color: #777;
                }
                .Teacher-desktop .redbar,
                .Teacher-mobile .redbar,
                .Teacher-tablet .redbar {
                    width: 15px;
                    border-bottom: 2px solid #ff4338;
                    border-radius: 1px;
                }
                .TeacherInfoCard-desktop .teacherCard-right,
                .TeacherInfoCard-mobile .teacherCard-right,
                .TeacherInfoCard-tablet .teacherCard-right {
                    width: 150px;
                    padding-top: 20px;
                    padding-right: 30px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    -webkit-justify-content: center;
                    justify-content: center;
                    -webkit-align-items: flex-end;
                    align-items: flex-end;
                }
                .TeacherInfoCard-desktop .teacherCard-right-icon,
                .TeacherInfoCard-mobile .teacherCard-right-icon,
                .TeacherInfoCard-tablet .teacherCard-right-icon {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: center;
                    justify-content: center;
                    -webkit-align-items: center;
                    align-items: center;
                    cursor: pointer;
                }
                .flex {
                    display: -webkit-flex;
                    display: flex;
                }
                .items-center {
                    -webkit-align-items: center;
                    align-items: center;
                }
                .justify-center {
                    -webkit-justify-content: center;
                    justify-content: center;
                }
                .share-teacher-wrapper {
                    margin-left: 16px;
                    position: relative;
                }
                .TagMenu-desktop,
                .TagMenu-mobile,
                .TagMenu-tablet {
                    position: relative;
                    top: 0;
                    left: 0;
                    font-size: 13px;
                }
                .TagMenu-desktop.TagMenu-rerotate90 > div:first-child,
                .TagMenu-mobile.TagMenu-rerotate90 > div:first-child,
                .TagMenu-tablet.TagMenu-rerotate90 > div:first-child {
                    transition: all 0.2s;
                }
                .TagMenu-desktop .TagMenu-menu,
                .TagMenu-mobile .TagMenu-menu,
                .TagMenu-tablet .TagMenu-menu {
                    position: absolute;
                    top: 40px;
                    right: 0;
                    min-width: 210px;
                    padding: 5px;
                    border-radius: 4px;
                    background-color: #fff;
                    box-shadow: 0 5px 15px 0 rgb(0 0 0 / 10%);
                    z-index: 99;
                }
                .TagMenu-desktop .TagMenu-menu.TagMenu-hidden,
                .TagMenu-mobile .TagMenu-menu.TagMenu-hidden,
                .TagMenu-tablet .TagMenu-menu.TagMenu-hidden {
                    display: none;
                }
                .TeacherInfoCard-desktop .teacherCard-right-body,
                .TeacherInfoCard-mobile .teacherCard-right-body,
                .TeacherInfoCard-tablet .teacherCard-right-body {
                    margin-top: 10px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    -webkit-justify-content: flex-start;
                    justify-content: flex-start;
                    -webkit-align-items: flex-end;
                    align-items: flex-end;
                    line-height: 26px;
                    font-size: 12px;
                    color: #333;
                }
                .TeacherInfoCard-desktop .teacherCard-stars,
                .TeacherInfoCard-mobile .teacherCard-stars,
                .TeacherInfoCard-tablet .teacherCard-stars {
                    margin-top: 6px;
                    margin-bottom: 6px;
                }
                .stars-box {
                    height: 12px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .TeacherInfoCard-desktop .teacherCard-part2,
                .TeacherInfoCard-mobile .teacherCard-part2,
                .TeacherInfoCard-tablet .teacherCard-part2 {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                }
                .TeacherInfoCard-desktop .teacherCard-teaches,
                .TeacherInfoCard-mobile .teacherCard-teaches,
                .TeacherInfoCard-tablet .teacherCard-teaches {
                    margin-top: 20px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: flex-start;
                    justify-content: flex-start;
                    -webkit-align-items: flex-start;
                    align-items: flex-start;
                }
                .TeacherInfoCard-desktop .teacherCard-teaches-title,
                .TeacherInfoCard-mobile .teacherCard-teaches-title,
                .TeacherInfoCard-tablet .teacherCard-teaches-title {
                    margin-top: 4px;
                    margin-right: 15px;
                    white-space: nowrap;
                    font-size: 11px;
                    font-weight: 300;
                    color: #777;
                    text-transform: uppercase;
                }
                .TeacherInfoCard-desktop .teacherCard-teaches-languages,
                .TeacherInfoCard-mobile .teacherCard-teaches-languages,
                .TeacherInfoCard-tablet .teacherCard-teaches-languages {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: flex-start;
                    justify-content: flex-start;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-flex-wrap: wrap;
                    flex-wrap: wrap;
                }
                .language {
                    font-size: 16px;
                    text-align: left;
                    color: #333;
                }
                .TeacherInfoCard-desktop
                    .teacherCard-teaches-languages
                    > div
                    .language,
                .TeacherInfoCard-mobile
                    .teacherCard-teaches-languages
                    > div
                    .language,
                .TeacherInfoCard-tablet
                    .teacherCard-teaches-languages
                    > div
                    .language {
                    text-transform: capitalize;
                }
                .TeacherInfoCard-desktop .aboutMe,
                .TeacherInfoCard-mobile .aboutMe,
                .TeacherInfoCard-tablet .aboutMe {
                    margin: 0 30px 40px;
                    padding-top: 40px;
                    border-top: 1px solid #ddd;
                    white-space: pre-wrap;
                }
                .TeacherInfoCard-desktop .aboutMe {
                    margin-bottom: 30px;
                    padding-top: 30px;
                }
                .TeacherInfoCard-desktop .aboutMeReadMore,
                .TeacherInfoCard-mobile .aboutMeReadMore,
                .TeacherInfoCard-tablet .aboutMeReadMore {
                    margin-bottom: 40px;
                }
                .Teacher-desktop .cardTitle,
                .Teacher-mobile .cardTitle,
                .Teacher-tablet .cardTitle {
                    height: 27px;
                    margin-top: 0;
                    margin-bottom: 40px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                    -webkit-align-items: center;
                    align-items: center;
                    font-size: 23px;
                    font-weight: 500;
                    color: #333;
                }
                .TeacherInfoCard-desktop .aboutMe .cardTitle,
                .TeacherInfoCard-mobile .aboutMe .cardTitle,
                .TeacherInfoCard-tablet .aboutMe .cardTitle {
                    margin-bottom: 20px;
                }
                .TeacherInfoCard-desktop .aboutMe .aboutMeTime,
                .TeacherInfoCard-mobile .aboutMe .aboutMeTime,
                .TeacherInfoCard-tablet .aboutMe .aboutMeTime {
                    font-size: 14px;
                    font-weight: 400;
                    color: #777;
                    float: right;
                }
                .TeacherInfoCard-desktop .aboutMe .aboutMe-content,
                .TeacherInfoCard-mobile .aboutMe .aboutMe-content,
                .TeacherInfoCard-tablet .aboutMe .aboutMe-content {
                    line-height: 21px;
                    word-break: break-word;
                }
            `}</style>
        </div>
    )
}
