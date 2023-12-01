import React, { FC, memo } from 'react'
import { Modal } from 'antd'
import RegularTimeRequest from 'components/Atoms/RegularTimeRequest2'
import TeacherAPI from 'api/TeacherAPI'
import { getTranslateText } from 'utils/translate-utils'

export enum Method {
    ADD_AND_EDIT = 'Create Regular Request',
    CLOSE = 'Close Regular Request'
}

type RegularRequestModalProps = {
    method: Method
    visible: boolean
    data: any
    toggleModal: (visible: boolean) => void
    refetchData: () => void
}

const RegularRequestModal: FC<RegularRequestModalProps> = ({
    visible,
    method,
    data,
    toggleModal,
    refetchData
}) => {
    const onSubmitRequest = async (regular_times: any[]) =>
        TeacherAPI.submitRegularRequest({ regular_times }).then((res) => {
            toggleModal(false)
            refetchData()
        })

    const renderBody = () => (
        <RegularTimeRequest
            regularTimes={data}
            onSave={onSubmitRequest}
            method={method}
        />
    )

    return (
        <Modal
            maskClosable
            centered
            closable
            visible={visible}
            onCancel={() => toggleModal(false)}
            // title={
            //     method === Method.ADD_AND_EDIT
            //         ? 'Create Regular Request'
            //         : 'Close Regular Request'
            // }
            title={getTranslateText('regular_request.update')}
            width={700}
            footer={null}
        >
            {renderBody()}
        </Modal>
    )
}

export default memo(RegularRequestModal)
