import { useEffect, memo, useState, FunctionComponent } from 'react'
import { Modal, Button, Form, Input, Row } from 'antd'
import _ from 'lodash'
import { getTranslateText } from 'utils/translate-utils'
import TextEditor from '../TextEditor'

const { TextArea } = Input

interface Props {
    visible: boolean
    title: string
    textValue: string
    onUpdate: (v) => void
    toggleModal: (visible: boolean) => void
}

const EditTextModal: FunctionComponent<Props> = memo((props) => {
    const { visible, toggleModal, onUpdate, title, textValue } = props
    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({ str_value: textValue || '' })
        }
    }, [visible])

    const renderBody = () => (
        <Form
            form={form}
            name={title}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdate}
        >
            <Form.Item noStyle name='str_value'>
                {/* <TextArea
                    style={{
                        width: '100%',
                        marginBottom: '10px',
                        height: '200px'
                    }}
                /> */}
                <TextEditor />
                {/* <br /> */}
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6 }} style={{ marginBottom: 0 }}>
                <Row justify='end'>
                    <Button
                        htmlType='submit'
                        type='primary'
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {getTranslateText('save')}
                    </Button>
                </Row>
            </Form.Item>
        </Form>
    )
    return (
        <Modal
            centered
            closable
            maskClosable
            visible={visible}
            onCancel={() => toggleModal(false)}
            title={title}
            footer={null}
            width={842}
        >
            {renderBody()}
        </Modal>
    )
})

export default EditTextModal
