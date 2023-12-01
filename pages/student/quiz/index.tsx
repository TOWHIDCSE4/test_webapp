import Layout from 'components/Atoms/StudentPage/Layout'
import { useEffect } from 'react'
import Quiz from 'components/Atoms/StudentPage/Quiz'

const Index = () => {
    useEffect(() => {}, [])

    return (
        <Layout>
            <Quiz />
        </Layout>
    )
}

export default Index
