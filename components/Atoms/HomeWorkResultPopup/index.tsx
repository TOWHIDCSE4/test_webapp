import React, { FC, memo } from 'react'
import { Modal, Descriptions, Tag } from 'antd'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'
import _ from 'lodash'
import { EnumQuizSessionStatus } from 'const'
import { useAuth } from 'contexts/Auth'
import moment from 'moment'
import styles from './HomeWorkResultPopup.module.scss'

type Props = {
    visible: boolean
    data: any
    toggleModal: (val: boolean) => void
}

const HomeWorkResultPopup: FC<Props> = ({
    visible,
    toggleModal,
    data = {}
}) => {
    const { user } = useAuth()
    return (
        <>
            <Modal
                centered
                maskClosable
                visible={visible}
                title={null}
                closable={false}
                onCancel={() => toggleModal(false)}
                footer={null}
            >
                <p className={cn(styles.topTitle)}>
                    <FormattedMessage
                        id='homework_result.top_title'
                        values={{ name: <span>{user?.full_name}</span> }}
                    />
                </p>
                <p className={cn(styles.title)}>
                    <FormattedMessage id='homework_result.title' />
                </p>
                <Descriptions title={null} bordered>
                    <Descriptions.Item
                        label={
                            <span className={cn(styles.key)}>
                                <FormattedMessage id='homework_result.name' />
                            </span>
                        }
                        span={4}
                    >
                        <span className={cn(styles.content)}>
                            {data?.quiz?.name}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <span className={cn(styles.key)}>
                                <FormattedMessage id='homework_result.total_question' />
                            </span>
                        }
                        span={4}
                    >
                        <span className={cn(styles.content)}>
                            {data?.quiz?.questions?.length}
                        </span>
                    </Descriptions.Item>
                    {/* <Descriptions.Item
                        label={
                            <span className={cn(styles.key)}>
                                <FormattedMessage id='homework_result.sentences_correct' />
                            </span>
                        }
                        span={4}
                    >
                        <span className={cn(styles.content)}>
                            {_.isArray(data?.questions) &&
                                data?.questions.filter(
                                    (x) => x.is_correct === true
                                ).length}
                        </span>
                    </Descriptions.Item> */}
                    <Descriptions.Item
                        label={
                            <span className={cn(styles.key)}>
                                <FormattedMessage id='homework_result.result' />
                            </span>
                        }
                        span={4}
                    >
                        <span className={cn(styles.content)}>
                            {data?.user_score >= data?.quiz?.passed_minimum ? (
                                <Tag color='#36cb7c'>PASS</Tag>
                            ) : data?.user_score <
                              data?.quiz?.passed_minimum ? (
                                <Tag color='#f15179'>FAIL</Tag>
                            ) : moment(data?.end_time) > moment() ? (
                                <Tag color='#076fd6'>DOING</Tag>
                            ) : null}
                        </span>
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    )
}

export default memo(HomeWorkResultPopup)
