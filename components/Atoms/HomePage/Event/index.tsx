import { Modal } from 'antd'
import moment from 'moment'
import React, { FC, FunctionComponent, useEffect, useState } from 'react'

const EventModal: FC = () => {
    const [visible, setVisible] = useState(false)
    const toggleModal = (val) => {
        setVisible(val)
    }

    const onClose = () => {
        toggleModal(false)
    }

    useEffect(() => {
        const time = moment()
        let lastShow: any = localStorage.getItem('last-show-event')
        if (!lastShow) {
            localStorage.setItem(
                'last-show-event',
                moment().valueOf().toString()
            )
            toggleModal(true)
        } else {
            lastShow = moment(Number(lastShow))
            const duration = moment.duration(time.diff(lastShow))
            const hours = duration.asHours()
            if (hours > 1) {
                localStorage.setItem(
                    'last-show-event',
                    moment().valueOf().toString()
                )
                toggleModal(true)
            }
        }
    }, [])

    return (
        <div>
            <Modal
                visible={false}
                onCancel={() => onClose()}
                centered
                closable={null}
                footer={null}
                className='ant-modal-content-transparent flex justify-content-center modal-event'
            >
                {/* <a
                    href='https://event.englishplus.vn'
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={() => onClose()}
                > */}

                <button
                    type='button'
                    onClick={() => onClose()}
                    aria-label='Close'
                    className='ant-modal-close'
                    style={{ color: 'white', top: '10px', right: '10px' }}
                >
                    <span className='ant-modal-close-x'>
                        <span
                            role='img'
                            aria-label='close'
                            className='anticon anticon-close ant-modal-close-icon'
                        >
                            <svg
                                viewBox='64 64 896 896'
                                focusable='false'
                                data-icon='close'
                                width='1.5em'
                                height='1.5em'
                                fill='currentColor'
                                aria-hidden='true'
                            >
                                <path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z' />
                            </svg>
                        </span>
                    </span>
                </button>
                <img
                    src='/assets/images/homepage/events/new_year_holiday_v1.jpg'
                    alt=''
                    sizes=''
                    style={{ maxWidth: '100%' }}
                />
                {/* </a> */}
            </Modal>
        </div>
    )
}

export default EventModal
