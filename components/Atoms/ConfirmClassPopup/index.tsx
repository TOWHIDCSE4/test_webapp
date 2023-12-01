import React, { FC, memo, useState } from 'react'
import { Modal, Space, Button, Input } from 'antd'
import { IBooking } from 'types'
import BookingAPI from 'api/BookingAPI'
import { notify } from 'contexts/Notification'
import { getTranslateText } from 'utils/translate-utils'
import { BOOKING_STATUS } from 'const'

const { TextArea } = Input

type Props = {
    visible: boolean
    data: IBooking
    toggleModal: (val: boolean) => void
    refetchData: () => void
}

enum ACTION {
    COMPLETED = 1,
    MISSED,
    STUDENT_ABSENT
}

const ConfirmClassPopup: FC<Props> = ({
    visible,
    toggleModal,
    data = {},
    refetchData
}) => {
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)

    const onChangeNote = (e) => {
        const { value } = e.target
        setNote(value)
    }

    const onHandleClick = (type: ACTION) => {
        switch (type) {
            case ACTION.COMPLETED:
                setLoading(true)
                BookingAPI.endClass({
                    lesson_id: data.id,
                    status: BOOKING_STATUS.COMPLETED,
                    teacher_note: note
                })
                    .then((res) => {
                        notify(
                            'success',
                            getTranslateText('lesson_has_ended_success')
                        )
                        refetchData()
                        toggleModal(false)
                    })
                    .catch((err) => {
                        notify('error', err.message)
                    })
                    .finally(() => setLoading(false))
                break
            case ACTION.MISSED:
                setLoading(true)
                BookingAPI.absentBookingByTeacher({
                    lesson_id: data.id,
                    reason: getTranslateText('i_have_missed'),
                    teacher_note: note
                })
                    .then((res) => {
                        notify(
                            'success',
                            getTranslateText('lesson_has_missed_success')
                        )
                        refetchData()
                        toggleModal(false)
                    })
                    .catch((err) => {
                        notify('error', err.message)
                    })
                    .finally(() => setLoading(false))
                break
            case ACTION.STUDENT_ABSENT:
                setLoading(true)
                BookingAPI.endClass({
                    lesson_id: data.id,
                    status: BOOKING_STATUS.STUDENT_ABSENT,
                    teacher_note: note
                })
                    .then((res) => {
                        notify(
                            'success',
                            getTranslateText('lesson_has_ended_success')
                        )
                        refetchData()
                        toggleModal(false)
                    })
                    .catch((err) => {
                        notify('error', err.message)
                    })
                    .finally(() => setLoading(false))
                break
            default:
                notify('error', 'Action invalid')
        }
    }

    return (
        <>
            <Modal
                centered
                visible={visible}
                maskClosable
                title={getTranslateText('teacher.confirm_popup.title')}
                closable
                onCancel={() => toggleModal(false)}
                footer={null}
            >
                <TextArea
                    placeholder={getTranslateText('enter_note_here')}
                    value={note}
                    onChange={onChangeNote}
                    className='mb-4'
                />
                <Space size={15} className='flex justify-content-end'>
                    <Button
                        type='primary'
                        onClick={() => onHandleClick(ACTION.COMPLETED)}
                        loading={loading}
                    >
                        {getTranslateText('teacher.confirm_popup.completed')}
                    </Button>
                    <Button
                        type='default'
                        onClick={() => onHandleClick(ACTION.MISSED)}
                        loading={loading}
                    >
                        {getTranslateText('teacher.confirm_popup.missed')}
                    </Button>
                    <Button
                        type='primary'
                        danger
                        onClick={() => onHandleClick(ACTION.STUDENT_ABSENT)}
                        loading={loading}
                    >
                        {getTranslateText('teacher.confirm_popup.absent')}
                    </Button>
                </Space>
            </Modal>
        </>
    )
}

export default memo(ConfirmClassPopup)
