/* eslint-disable react/no-danger */
import React, { FC, memo } from 'react'
import { Image, Modal } from 'antd'
import { EnumEventNoticeType, IEventNotice } from 'types'
import { sanitize } from 'utils/string-utils'

type Props = {
    visible: boolean
    toggleModal: (visible: boolean) => void
    data: IEventNotice
}

const DetailEventNoticeModal: FC<Props> = ({ visible, toggleModal, data }) => {
    const onClose = () => {
        toggleModal(false)
    }
    const renderBody = () => (
        <>
            {data?.type === EnumEventNoticeType.HOLIDAY_EVENT ? (
                <Image preview={false} src={data.image} />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'auto'
                    }}
                    dangerouslySetInnerHTML={{
                        __html: sanitize(data?.content)
                    }}
                />
            )}
        </>
    )

    return (
        <Modal
            centered
            closable
            visible={visible}
            onCancel={onClose}
            title={data?.title}
            width={700}
            footer={null}
        >
            {renderBody()}
        </Modal>
    )
}

export default memo(DetailEventNoticeModal)
