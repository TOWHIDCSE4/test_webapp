import { Button } from 'antd'
import cn from 'classnames'
import { useState } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import TestEquipmentModal from './TestEquipmentModal'
import styles from './index.module.scss'

const TestEquipmentButton = () => {
    const [visible, setVisible] = useState(false)
    const toggleModal = (val) => {
        setVisible(val)
    }
    return (
        <>
            <Button
                type='primary'
                onClick={() => toggleModal(true)}
                className={cn(styles.equipmentBtn)}
            >
                {getTranslateText('test_equipment')}
            </Button>
            <TestEquipmentModal show={visible} toggleModal={toggleModal} />
        </>
    )
}

export default TestEquipmentButton
