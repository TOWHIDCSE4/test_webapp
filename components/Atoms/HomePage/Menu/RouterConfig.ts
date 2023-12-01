export const NEW_ROUTERS = [
    {
        id: '1',
        title: 'home.menu.ielts_test',
        path: '/ielts-test'
    },
    {
        id: '2',
        title: 'home.menu.course_explorer',
        extraRouters: [
            {
                title: 'Tiếng anh cho bé',
                description: 'Nulla Lorem mollit cupidatat irure.',
                icon: 'icon_dropbar_for_kid',
                path: '/course-explorer'
            },
            {
                title: 'Tiếng anh cho giao tiếp',
                description: 'Nulla Lorem mollit cupidatat irure.',
                icon: 'icon_dropbar_for_communicate',
                path: '/course-explorer'
            },
            {
                title: 'Tiếng anh cho trung học',
                description: 'Nulla Lorem mollit cupidatat irure.',
                icon: 'icon_dropbar_for_highschool',
                path: '/course-explorer'
            },
            {
                title: 'Tiếng anh cho du học',
                description: 'Nulla Lorem mollit cupidatat irure.',
                icon: 'icon_dropbar_for_study_aboard',
                path: '/course-explorer'
            },
            {
                title: 'Tiếng anh cho đi làm',
                description: 'Nulla Lorem mollit cupidatat irure.',
                icon: 'icon_dropbar_for_worker',
                path: '/course-explorer'
            },
            {
                title: 'Tiếng anh cho luyện thi',
                description: 'Nulla Lorem mollit cupidatat irure.',
                icon: 'icon_dropbar_for_practice_exam',
                path: '/course-explorer'
            }
        ]
    },
    {
        id: '3',
        title: 'become_a_teacher',
        path: '/become-teacher'
    }
]

export const ROUTERS = [
    // {
    //     route: '/find-a-teachers',
    //     title: 'home.menu.find_a_teacher'
    // },
    // {
    //     route: '/community',
    //     title: 'Community'
    // },
    // {
    //     route: '/service',
    //     title: 'home.menu.service'
    // },
    // {
    //     route: '/faq',
    //     title: 'home.menu.faq'
    // },
    {
        route: '/ielts-test',
        title: 'home.menu.ielts_test'
    },
    {
        route: '/course-explorer',
        title: 'home.menu.course_explorer'
    }
]
