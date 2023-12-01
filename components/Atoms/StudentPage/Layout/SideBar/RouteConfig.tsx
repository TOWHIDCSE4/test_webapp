import { ROLES_ENUM } from 'const/role'

const treeConfig = [
    {
        route: '/student/dashboard',
        title: 'sidebar.dashboard',
        icon: <i className='fas fa-home' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/my-booking',
        title: 'sidebar.my_booking',
        icon: <i className='fas fa-calendar-week' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/find-a-teacher',
        title: 'sidebar.find_a_teacher',
        icon: <i className='fas fa-chalkboard-teacher' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/homework',
        title: 'sidebar.homework',
        icon: <i className='fas fa-book-reader' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/exam',
        title: 'sidebar.examination',
        icon: <i className='fas fa-book-open' />,
        required: ROLES_ENUM.STUDENT
    },
    // {
    //     route: '/student/quiz',
    //     title: 'sidebar.quiz',
    //     icon: <i className='fas fa-book-reader' />,
    //     required: ROLES_ENUM.STUDENT
    // },
    {
        route: '/student/learning-history',
        title: 'sidebar.learn_history',
        icon: <i className='fas fa-book' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/learning-assessment-reports',
        title: 'sidebar.learn_assessment_reports',
        icon: <i className='fas fa-clipboard' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/admission-procedures',
        title: 'sidebar.admission_procedures',
        icon: <i className='fas fa-book-open' />,
        required: ROLES_ENUM.STUDENT
    },
    // {
    //     route: '/student/summary',
    //     title: 'sidebar.study_summary',
    //     icon: <i className='fab fa-leanpub' />,
    //     required: ROLES_ENUM.STUDENT
    // },
    {
        title: 'sidebar.my_package',
        route: '/student/my-packages',
        icon: <i className='fas fa-box-open' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/upgrade',
        title: 'sidebar.upgrade_package',
        icon: <i className='fas fa-truck-loading' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/claim-recommendation',
        title: 'teacher.sidebar.claims_recommendations',
        icon: <i className='fas fa-flag' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/leave-request',
        title: 'sidebar.leave_request',
        icon: <i className='fas fa-person-booth' />,
        required: ROLES_ENUM.STUDENT
    },
    {
        route: '/student/extension-request',
        title: 'student.sidebar.extension.title',
        icon: <i className='fas fa-save' />,
        required: ROLES_ENUM.STUDENT
    }
]

export default treeConfig
