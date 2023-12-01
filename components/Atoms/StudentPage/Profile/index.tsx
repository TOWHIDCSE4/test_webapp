import BlockHeader from 'components/Atoms/StudentPage/BlockHeader'
import { getTranslateText } from 'utils/translate-utils'
import { Row, Col, Spin } from 'antd'
import { useAuth } from 'contexts/Auth'
import LeftBlock from './LeftBlock'
import RightBlock from './RightBlock'

const Profile = () => {
    const { isLoading } = useAuth()
    return (
        <div className='mb-4'>
            <BlockHeader title={getTranslateText('profile')} />
            {isLoading ? (
                <div className='d-flex justify-content-center mt-5'>
                    <Spin spinning tip='Loading...' />
                </div>
            ) : (
                <Row gutter={[25, 10]}>
                    <Col sm={24} md={8}>
                        <LeftBlock />
                    </Col>
                    <Col sm={24} md={16}>
                        <RightBlock />
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default Profile
