import { Row, Col, Button } from 'antd'
import cn from 'classnames'
import { FC } from 'react'
import styles from './BlockHeader.module.scss'

type Props = {
    title: string
}

const BlockHeader: FC<Props> = ({ title }) => (
    <div className={cn(styles['block-header'])}>
        <Row>
            <Col sm={24} md={12} lg={14}>
                <h2>{title}</h2>
                {/* <Button className='btn-icon mobile_menu'>
                    <i className='zmdi zmdi-sort-amount-desc' />
                </Button> */}
            </Col>
            {/* <Col sm={24} md={12} lg={10}>
                <Button className='btn-icon float-right right_icon_toggle_btn'>
                    <i className='zmdi zmdi-arrow-right' />
                </Button>
            </Col> */}
        </Row>
    </div>
)

export default BlockHeader
