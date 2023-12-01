import React from 'react'
import Layout from 'components/Atoms/HomePage/Layout'
import { Alert } from 'antd'
import { getTranslateText } from 'utils/translate-utils'

const Community = () => (
    <Layout>
        <Alert
            message={getTranslateText('feature_is_under_development')}
            description={getTranslateText('feature_is_under_development_desc')}
            type='info'
            showIcon
        />
    </Layout>
)

export default Community
