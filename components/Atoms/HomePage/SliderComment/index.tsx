import { FC, memo } from 'react'
import cn from 'classnames'
import { Card, Col, Image, Row } from 'antd'
import styles from './SliderItem.module.scss'

type Props = {
    src: string
    name: string
    info: string
    content: string
}

const SliderComment: FC<Props> = ({ src, name, info, content }) => (
    <div className='pb-12 pr-4 table-pr-0' style={{ borderRadius: '20px' }}>
        <Row gutter={[0, 0]}>
            <Col style={{ width: '65px' }}>
                <Image
                    src={src}
                    preview={false}
                    style={{
                        borderRadius: '50%',
                        width: '54px',
                        height: '54px'
                    }}
                />
            </Col>
            <Col xs={18} sm={19} md={19} lg={19} style={{ marginTop: '12px' }}>
                <strong className='commenter'>{name}</strong>
                {/* <div className='text-[0.9rem]' style={{ color: '#A5A8A9' }}>
                    {info}
                </div> */}
            </Col>
        </Row>
        <Row gutter={[0, 0]} className='box-content-comment'>
            <Image
                src={src}
                preview={false}
                style={{
                    borderRadius: '20px'
                }}
            />
            {/* <Col xs={5} sm={4} md={4} lg={4}>
                <img
                    src='../assets/images/homepage/svgs/quotation.svg'
                    alt='quotation'
                    title='English Plus'
                />
            </Col>
            <Col xs={19} sm={20} md={20} lg={20}>
                <div className='text-[0.9rem]'>{content}</div>
            </Col> */}
        </Row>
    </div>
)

export default memo(SliderComment)
