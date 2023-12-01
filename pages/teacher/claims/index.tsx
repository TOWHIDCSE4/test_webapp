import Layout from 'components/Atoms/TeacherPage/Layout'
import { useEffect } from 'react'
import ClaimsRecommendations from 'components/Atoms/ClaimsRecommendations'
import { ROLES_ENUM } from 'const/role'

const Index = () => {
    useEffect(() => {}, [])

    return (
        <Layout>
            <ClaimsRecommendations type={ROLES_ENUM.TEACHER} />
        </Layout>
    )
}

export default Index
