import Layout from 'components/Atoms/TeacherPage/Layout'
import { useEffect } from 'react'
import { Alert } from 'antd'
import StudentHomework from 'components/Atoms/TeacherPage/StudentHomework'

const Index = () => {
    useEffect(() => {}, [])

    return (
        <Layout>
            <StudentHomework />
        </Layout>
    )
}

export default Index
