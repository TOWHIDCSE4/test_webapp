import React, { FC, memo, ReactNode, useState } from 'react'
import { Modal, Image } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import * as store from 'helpers/storage'

type Props = {
    src: string | ReactNode
}

const HolidayEvenPopup: FC<Props> = ({ src }) => {
    const [visible, setVisible] = useState(true)

    const closePopup = () => {
        setVisible(false)
        store.set('close_popup', true)
    }

    return (
        <>
            {visible && (
                <span
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 99999,
                        cursor: 'pointer'
                    }}
                    onClick={() => closePopup()}
                >
                    <CloseCircleOutlined
                        style={{ fontSize: '30px', color: '#1c1919' }}
                    />
                </span>
            )}
            <Modal
                centered
                maskClosable
                visible={visible}
                title={null}
                onCancel={() => closePopup()}
                closable={typeof src !== 'string'}
                footer={null}
                wrapClassName={typeof src === 'string' && 'holiday-popup'}
            >
                {typeof src === 'string' ? (
                    <Image preview={false} src={src} />
                ) : (
                    src
                )}
            </Modal>
        </>
    )
}

export default memo(HolidayEvenPopup)
