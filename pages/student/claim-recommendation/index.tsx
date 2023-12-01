import { useEffect } from 'react'
import Layout from 'components/Atoms/StudentPage/Layout'
import ClaimsRecommendations from 'components/Atoms/ClaimsRecommendations'
import { ROLES_ENUM } from 'const/role'

const Index = () => {
    useEffect(() => {}, [])

    return (
        <Layout>
            <ClaimsRecommendations type={ROLES_ENUM.STUDENT} />
        </Layout>
    )
}

export default Index
