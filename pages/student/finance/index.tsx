import Layout from 'components/Atoms/StudentPage/Layout'
import { useEffect } from 'react'
import { Alert } from 'antd'
import { getTranslateText } from 'utils/translate-utils'

const Index = () => {
    useEffect(() => {}, [])

    return (
        <Layout>
            <Alert
                message={getTranslateText('system.developing')}
                description={getTranslateText('system.try_again')}
                type='info'
                showIcon
            />
        </Layout>
    )
}

export default Index
