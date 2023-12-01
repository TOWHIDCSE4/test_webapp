import Modal from 'antd/lib/modal/Modal'
import React, { memo, useCallback, useState, FC, useEffect } from 'react'
import { Col, Row, Button, Spin, Alert, Input } from 'antd'

import _ from 'lodash'
import { getTranslateText } from 'utils/translate-utils'
import { IScheduledMemo, EnumScheduledMemoType } from 'types'
import { notify } from 'contexts/Notification'
import cn from 'classnames'
import { ROLES } from 'const'
import { useAuth } from 'contexts/Auth'
import HeadingMemo from 'components/Atoms/TeacherPage/HeadingMemo'
import EditableTableMemo from 'components/Atoms/EditableMemo'
import ScheduledMemoAPI from 'api/ScheduledMemoAPI'
import styles from './ScheduledMemoModal.module.scss'

const { TextArea } = Input

type Props = {
    visible: boolean
    disabled?: boolean
    toggleModal: (val: boolean) => void
    data: IScheduledMemo
    memoType: EnumScheduledMemoType
    refetchData: () => void
}

const ScheduledMemoModal: FC<Props> = ({
    visible,
    disabled = false,
    data,
    toggleModal,
    memoType,
    refetchData
}) => {
    const readOnlyModal = disabled // TODO khi học thuật duyệt memo thì sẽ k cho sửa nữa
    const [loading, setLoading] = useState<boolean>(false)
    const { user } = useAuth()
    const [assessment, setAssessment] = useState({})
    const [teacherNote, setTeacherNote] = useState('')

    useEffect(() => {
        if (visible) {
            setTeacherNote(data?.teacher_note)
        }
    }, [visible])

    const onClose = useCallback(() => {
        toggleModal(false)
        setTeacherNote('')
        setAssessment({})
    }, [])

    const onSubmit = useCallback(() => {
        if (data?.id) {
            const memoPayload = {
                teacher_note: teacherNote,
                attendance_comment: _.get(
                    _.find(assessment, (o: any) => o?.key === 'attendance'),
                    'comment'
                ),
                attitude_comment: _.get(
                    _.find(assessment, (o: any) => o?.key === 'attitude'),
                    'comment'
                ),
                homework_comment: _.get(
                    _.find(assessment, (o: any) => o?.key === 'homework'),
                    'comment'
                )
            }
            setLoading(true)
            ScheduledMemoAPI.editScheduledMemo(data.id, memoPayload)
                .then((res) => {
                    notify('success', getTranslateText('trial_memo.success'))
                    refetchData()
                    onClose()
                })
                .catch((err) => {
                    notify('error', err.message)
                })
                .finally(() => setLoading(false))
        }
    }, [data, assessment, teacherNote])

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            maskClosable
            width={1024}
            title={data && `${data?.student?.full_name}`}
            centered
            wrapClassName={cn(styles.trialMemoModal)}
            footer={
                !disabled &&
                !data?.teacher_commented &&
                _.isArray(user?.role) &&
                user?.role?.includes(ROLES.TEACHER) && [
                    <Button
                        key='submit'
                        type='primary'
                        shape='round'
                        disabled={loading || disabled}
                        onClick={onSubmit}
                    >
                        {getTranslateText('trial_memo.submit')}
                    </Button>
                ]
            }
        >
            <Spin spinning={loading}>
                <HeadingMemo data={data} min={1} max={10} memoType={memoType} />
                <EditableTableMemo
                    data={data}
                    onChangeAssessment={setAssessment}
                    memoType={memoType}
                />
                <TextArea
                    placeholder={getTranslateText('memo.another_comment')}
                    className='mt-4'
                    onChange={(e: any) => setTeacherNote(e.currentTarget.value)}
                    value={teacherNote}
                    readOnly={data?.teacher_commented}
                    style={{ height: 120 }}
                />
                {_.isArray(user?.role) &&
                    user?.role?.includes(ROLES.TEACHER) &&
                    readOnlyModal && (
                        <Row className='mb-4'>
                            <Col span={24}>
                                <Alert
                                    message={getTranslateText(
                                        'trial_memo.warning'
                                    )}
                                    type='warning'
                                    showIcon
                                />
                            </Col>
                        </Row>
                    )}
            </Spin>
        </Modal>
    )
}

export default memo(ScheduledMemoModal)
