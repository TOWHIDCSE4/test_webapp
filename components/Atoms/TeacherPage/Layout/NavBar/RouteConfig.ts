/* eslint-disable no-restricted-syntax */
import { ROLES_ENUM } from 'const/role'

export const treeConfig = [
    // Routes for teacher
    {
        title: 'teacher.sidebar.overview',
        children: [
            {
                route: '/teacher/dashboard',
                title: 'teacher.sidebar.dashboard',
                icon_active: '/static/img/teacher/navbar/dashboard-on.svg',
                icon_inactive: '/static/img/teacher/navbar/dashboard-off.svg',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/profile',
                title: 'teacher.sidebar.general_info',
                icon_active: '/static/img/teacher/navbar/my-infor-on.svg',
                icon_inactive: '/static/img/teacher/navbar/my-infor-off.svg',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/notices',
                title: 'teacher.sidebar.notices',
                icon_active: '/static/img/teacher/navbar/noti-on.svg',
                icon_inactive: '/static/img/teacher/navbar/noti-off.svg',
                required: ROLES_ENUM.TEACHER
            }
            // {
            //     route: '/teacher/meet',
            //     title: 'teacher.sidebar.notices',
            //     icon_active: '/static/img/teacher/navbar/noti-on.svg',
            //     icon_inactive: '/static/img/teacher/navbar/noti-off.svg',
            //     required: ROLES_ENUM.TEACHER
            // }
        ]
    },
    {
        title: 'teacher.sidebar.teaching_management',
        children: [
            {
                route: '/teacher/schedules',
                title: 'teacher.sidebar.schedules',
                icon_active: '/static/img/teacher/navbar/schedule-on.png',
                icon_inactive: '/static/img/teacher/navbar/schedule-off.png',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/regular-request',
                title: 'teacher.sidebar.regular_request',
                icon_active: '/static/img/teacher/navbar/schedule-on.png',
                icon_inactive: '/static/img/teacher/navbar/schedule-off.png',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/absent-request',
                title: 'teacher.sidebar.leave_request',
                icon_active: '/static/img/teacher/navbar/schedule-on.png',
                icon_inactive: '/static/img/teacher/navbar/schedule-off.png',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/teaching-history',
                title: 'teacher.sidebar.teaching_history',
                icon_active:
                    '/static/img/teacher/navbar/teaching-history-on.svg',
                icon_inactive:
                    '/static/img/teacher/navbar/teaching-history-off.svg',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/teaching-summary',
                title: 'teacher.sidebar.teaching_summary',
                icon_active:
                    '/static/img/teacher/navbar/teaching-summary-on.svg',
                icon_inactive:
                    '/static/img/teacher/navbar/teaching-summary-off.svg',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/students',
                title: 'teacher.sidebar.students',
                icon_active: '/static/img/teacher/navbar/schedule-on.png',
                icon_inactive: '/static/img/teacher/navbar/schedule-off.png',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/student-homework',
                title: 'teacher.sidebar.student_homework',
                icon_active:
                    '/static/img/teacher/navbar/student-home-work-on.svg',
                icon_inactive:
                    '/static/img/teacher/navbar/student-home-work-off.svg',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/claims',
                title: 'teacher.sidebar.claims_recommendations',
                icon_active: '/static/img/teacher/navbar/claim-on.svg',
                icon_inactive: '/static/img/teacher/navbar/claim-off.svg',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/referral',
                title: 'teacher.sidebar.teacher_referral',
                icon_active:
                    '/static/img/teacher/navbar/teacher-referral-on.svg',
                icon_inactive:
                    '/static/img/teacher/navbar/teacher-referral-off.svg',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/video-lesson',
                title: 'teacher.sidebar.video_lesson',
                icon_active: '/static/img/teacher/navbar/video-lesson-on.svg',
                icon_inactive:
                    '/static/img/teacher/navbar/video-lesson-off.svg',
                required: ROLES_ENUM.TEACHER
            }
        ]
    },
    {
        title: 'teacher.sidebar.teacher_materials',
        children: [
            {
                route: 'http://ispeakenglish.online/',
                title: 'teacher.sidebar.service_agreement',
                icon_active: '/static/img/teacher/navbar/schedule-on.png',
                icon_inactive: '/static/img/teacher/navbar/schedule-off.png',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/teacher-handbook',
                title: 'teacher.sidebar.teacher_handbook',
                icon_active:
                    '/static/img/teacher/navbar/teaching-history-on.svg',
                icon_inactive:
                    '/static/img/teacher/navbar/teaching-history-off.svg',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/sign-agreement',
                title: 'teacher.sidebar.sign_agreement',
                icon_active:
                    '/static/img/teacher/navbar/teaching-summary-on.svg',
                icon_inactive:
                    '/static/img/teacher/navbar/teaching-summary-off.svg',
                required: ROLES_ENUM.TEACHER
            },
            {
                route: '/teacher/references',
                title: 'teacher.sidebar.references',
                icon_active:
                    '/static/img/teacher/navbar/student-home-work-on.svg',
                icon_inactive:
                    '/static/img/teacher/navbar/student-home-work-off.svg',
                required: ROLES_ENUM.TEACHER
            }
        ]
    }
]

export function filterConfigByPerms(_treeConfig, role) {
    const config = []
    if (!role) return []
    for (const c of _treeConfig) {
        if (c.required && role.includes(c.required)) {
            config.push(c)
        } else if (!c.required) {
            config.push(c)
        }
    }

    return config
}

export default treeConfig
