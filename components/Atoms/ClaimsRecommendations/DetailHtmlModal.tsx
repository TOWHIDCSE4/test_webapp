/* eslint-disable react/no-danger */
import React, { FC, memo } from 'react'
import { Modal, Divider } from 'antd'
import _ from 'lodash'
import { getTranslateText } from 'utils/translate-utils'
import { sanitize } from 'utils/string-utils'

type Props = {
    visible: boolean
    toggleModal: (visible: boolean) => void
    data: any[]
}

const DetailModal: FC<Props> = ({ visible, toggleModal, data }) => {
    const onClose = () => {
        toggleModal(false)
    }
    // const data = [
    //     { title: 'Test', content: 'Test' },
    //     { title: 'Test 2 ', content: 'Test 2' },
    //     { title: 'Test 3', content: 'Test 3' }
    // ]

    const renderBody = () => (
        <>
            {_.map(data, (item, index) => (
                <>
                    <Divider key={index}>
                        {getTranslateText(item?.title)}
                    </Divider>
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'auto'
                        }}
                        dangerouslySetInnerHTML={{
                            __html: sanitize(item?.content)
                        }}
                    />
                </>
            ))}
        </>
    )

    return (
        <Modal
            centered
            closable
            maskClosable
            visible={visible}
            onCancel={onClose}
            title={getTranslateText('common.detail')}
            width={700}
            footer={null}
        >
            {renderBody()}
        </Modal>
    )
}

export default memo(DetailModal)
