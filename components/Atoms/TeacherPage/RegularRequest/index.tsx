import { Tabs } from 'antd'
import { FC } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import HistoryRegularRequest from './HistoryRegularRequest'
import MatchedStudent from './MatchedStudent'

const { TabPane } = Tabs

const RegularRequest: FC = () => (
    <Tabs type='card' style={{ overflow: 'unset' }}>
        <TabPane tab={getTranslateText('regular_request.tabs.request')} key='1'>
            <HistoryRegularRequest />
        </TabPane>
        <TabPane
            tab={getTranslateText('regular_request.tabs.matched_student')}
            key='2'
        >
            <MatchedStudent />
        </TabPane>
    </Tabs>
)

export default RegularRequest
