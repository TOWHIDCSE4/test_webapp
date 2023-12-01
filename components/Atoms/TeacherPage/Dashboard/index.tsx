import cn from 'classnames'
import AlertEventNotice from 'components/Atoms/AlertEventNotice'
import SummaryInMonth from './SummaryInMonth'
import TeacherInfo from './TeacherInfo'
import styles from './Dashboard.module.scss'

const Dashboard = () => (
    <div className={cn(styles.wrapDashboard)}>
        <AlertEventNotice />
        <TeacherInfo />
        <SummaryInMonth isShow={true} />
    </div>
)

export default Dashboard
