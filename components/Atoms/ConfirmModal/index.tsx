import { Modal } from 'antd'
import { getTranslateText } from 'utils/translate-utils'

type Props = {
    title?: string
    content: string
    onOk: () => void
    rest?: any
}

const ConfirmModal = ({ title, content, onOk, ...rest }: Props) => {
    Modal.confirm({
        title: title || getTranslateText('confirm'),
        content,
        okText: getTranslateText('ok'),
        cancelText: getTranslateText('cancel'),
        onOk,
        ...rest
    })
}

export default ConfirmModal
