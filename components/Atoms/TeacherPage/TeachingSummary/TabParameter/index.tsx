import React, { FC, useState } from 'react'
import { Nav, Tab } from 'react-bootstrap'
import cn from 'classnames'
import { toReadablePrice } from 'utils/price-utils'
import { getTranslateText } from 'utils/translate-utils'
import styles from './TabParameter.module.scss'
import ContentSalary from './ContentSalary/index'
import ContentBonus from './ContentBonus'
import ContentPunish from './ContentPunish'

type Props = {
    data: any
}

const TabParameter: FC<Props> = ({ data }) => {
    const [keyTab, setKeyTab] = useState('left')

    return (
        <div className={cn(styles.wrapTab)}>
            <Tab.Container id='TabsParamaster' defaultActiveKey='left'>
                <Nav className={cn(styles.NavPill)} variant='pills'>
                    <Nav.Item
                        onClick={() => {
                            setKeyTab('left')
                        }}
                    >
                        <Nav.Link
                            style={{
                                borderTopLeftRadius: '15px',
                                borderBottomLeftRadius: '15px',
                                borderTopRightRadius: '0px',
                                borderBottomRightRadius: '0px',
                                backgroundColor: `${
                                    keyTab !== 'left' ? '#FFF' : '#0170D7'
                                }`,
                                color: `${
                                    keyTab === 'left' ? '#FFF' : '#0170D7'
                                }`
                            }}
                            eventKey='left'
                        >
                            <div className={cn(styles.btnTab)}>
                                <div>
                                    {getTranslateText(
                                        'teacher.summary.calculated_wage'
                                    )}
                                </div>
                                <div
                                    style={{
                                        backgroundColor: `${
                                            keyTab !== 'left'
                                                ? '#0170D7'
                                                : '#FFF'
                                        }`
                                    }}
                                    className={cn(styles.line)}
                                />
                                <div>
                                    {toReadablePrice(data?.total_salary)}
                                    <span> {data?.currency}</span>
                                </div>
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                        onClick={() => {
                            setKeyTab('mid')
                        }}
                    >
                        <Nav.Link
                            style={{
                                borderRadius: '0px',
                                backgroundColor: `${
                                    keyTab !== 'mid' ? '#FFF' : '#0170D7'
                                }`,
                                color: `${
                                    keyTab === 'mid' ? '#FFF' : '#0170D7'
                                }`
                            }}
                            eventKey='mid'
                        >
                            <div className={cn(styles.btnTab)}>
                                <div>
                                    {getTranslateText(
                                        'teacher.dashboard.summary.bonus'
                                    )}
                                </div>
                                <div
                                    style={{
                                        backgroundColor: `${
                                            keyTab !== 'mid'
                                                ? '#0170D7'
                                                : '#FFF'
                                        }`
                                    }}
                                    className={cn(styles.line)}
                                />
                                <div>
                                    {toReadablePrice(data?.bonus?.total_bonus)}
                                    <span> {data?.currency}</span>
                                </div>
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                        onClick={() => {
                            setKeyTab('right')
                        }}
                    >
                        <Nav.Link
                            style={{
                                borderTopLeftRadius: '0px',
                                borderBottomLeftRadius: '0px',
                                borderTopRightRadius: '15px',
                                borderBottomRightRadius: '15px',
                                backgroundColor: `${
                                    keyTab !== 'right' ? '#FFF' : '#0170D7'
                                }`,
                                color: `${
                                    keyTab === 'right' ? '#FFF' : '#0170D7'
                                }`
                            }}
                            eventKey='right'
                        >
                            <div className={cn(styles.btnTab)}>
                                <div>
                                    {getTranslateText(
                                        'teacher.dashboard.summary.punish'
                                    )}
                                </div>
                                <div
                                    style={{
                                        backgroundColor: `${
                                            keyTab !== 'right'
                                                ? '#0170D7'
                                                : '#FFF'
                                        }`
                                    }}
                                    className={cn(styles.line)}
                                />
                                <div>
                                    {toReadablePrice(
                                        data?.punish?.total_punish
                                    )}
                                    <span> {data?.currency}</span>
                                </div>
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey='left'>
                        <ContentSalary data={data} />
                    </Tab.Pane>
                    <Tab.Pane eventKey='mid'>
                        <ContentBonus data={data} />
                    </Tab.Pane>
                    <Tab.Pane eventKey='right'>
                        <ContentPunish data={data} />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}

export default TabParameter
