import Layout from 'components/Atoms/StudentPage/Layout'
import { useEffect } from 'react'
import { Alert } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import Examination from 'components/Atoms/StudentPage/Examination'

const Index = () => {
    useEffect(() => {}, [])

    return (
        <Layout>
            <Examination />
        </Layout>
    )
}

export default Index
