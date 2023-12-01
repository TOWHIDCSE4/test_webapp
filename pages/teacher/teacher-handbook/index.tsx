import React from 'react'
import { Tabs } from 'antd'
import { HandbookHeader } from 'components/Atoms/TeacherPage/TeacherHandbook'
import {
    Handbook,
    Agreement,
    TrialClassesGuidelines
} from 'components/Molecules/TeacherHandbook'

const { TabPane } = Tabs
const tabKeys = {
    handbook: 'handbook',
    agreement: 'agreement',
    guidelines: 'guidelines'
}

const TeacherHandbook = () => (
    <div>
        <HandbookHeader />
        <Tabs tabBarStyle={{ padding: '0px 10px' }}>
            <TabPane
                tab={<div style={{ fontSize: 18 }}>Handbook</div>}
                key={tabKeys.handbook}
            >
                <Handbook />
            </TabPane>
            <TabPane
                tab={<div style={{ fontSize: 18 }}>Agreement</div>}
                key={tabKeys.agreement}
            >
                <Agreement />
            </TabPane>
            <TabPane
                tab={
                    <div style={{ fontSize: 18 }}>Trial Classes Guidelines</div>
                }
                key={tabKeys.guidelines}
            >
                <TrialClassesGuidelines />
            </TabPane>
        </Tabs>
    </div>
)

export default TeacherHandbook
