import { useEffect, memo, useState, FunctionComponent } from 'react'
import { Modal, Button, Form, Input, Row, Table } from 'antd'
import _ from 'lodash'
import { getTranslateText } from 'utils/translate-utils'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import { EnumPackageOrderType } from 'types'

const { TextArea } = Input

interface Props {
    visible: boolean
    toggleModal: (visible: boolean) => void
    data: any
}

const EditTextModal: FunctionComponent<Props> = memo((props) => {
    const { visible, toggleModal, data } = props
    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        console.log(data)
    }, [visible])

    const columns: ColumnsType<any> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: '100px',
            align: 'center',
            render: (text, record) => text
        },
        {
            title: getTranslateText('table.header.type'),
            dataIndex: 'type',
            key: 'type',
            fixed: 'left',
            align: 'center',
            render: (text, record) => EnumPackageOrderType[text]
        },
        {
            title: getTranslateText('table.header.student'),
            dataIndex: 'full_name',
            key: 'full_name',
            fixed: 'left',
            align: 'center',
            render: (text, record) => text
        },
        {
            title: getTranslateText('table.header.course'),
            dataIndex: 'course',
            key: 'course',
            fixed: 'left',
            align: 'center',
            render: (text, record) => text
        },
        {
            title: getTranslateText('table.header.time'),
            dataIndex: 'time',
            key: 'time',
            fixed: 'left',
            align: 'center',
            render: (text, record) => (
                <>
                    <p>{`${moment(record.start_time).format(
                        'HH:mm DD/MM/YYYY'
                    )}`}</p>
                </>
            )
        },
        {
            title: getTranslateText('table.header.memo_time'),
            dataIndex: 'time',
            key: 'time',
            fixed: 'left',
            align: 'center',
            render: (text, record) => (
                <>
                    {record.memo_time && (
                        <p>{`${moment(record.memo_time).format(
                            'HH:mm DD/MM/YYYY'
                        )}`}</p>
                    )}
                </>
            )
        }
    ]

    return (
        <Modal
            centered
            closable
            maskClosable
            visible={visible}
            onCancel={() => toggleModal(false)}
            title={'List booking'}
            footer={null}
            width={800}
        >
            <Table
                dataSource={data}
                columns={columns}
                rowKey={(record) => record.id}
                scroll={{
                    x: 500,
                    y: 768
                }}
                bordered
            />
        </Modal>
    )
})

export default EditTextModal
