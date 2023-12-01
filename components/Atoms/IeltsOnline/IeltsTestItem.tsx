import { FC, memo } from 'react'
import { IIeltsTest } from 'types'
import { Card, Image } from 'antd'

const { Meta } = Card

type Props = {
    data: IIeltsTest
}

const IeltsOnlineItem: FC<Props> = ({ data }) => (
    <Card
        hoverable
        bordered
        cover={
            <Image
                alt='ielts-test'
                src='/static/img/common/ielts-test.png'
                preview={false}
                style={{ borderRadius: '5px', border: '1px solid #f0f0f0' }}
            />
        }
        style={{ borderRadius: '5px' }}
    >
        <Meta title={data.title} />
    </Card>
)

export default memo(IeltsOnlineItem)
