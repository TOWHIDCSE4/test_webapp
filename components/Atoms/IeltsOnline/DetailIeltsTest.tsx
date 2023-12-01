import { FC, memo } from 'react'
import { IIeltsTest } from 'types'
import { Card } from 'antd'
import { sanitize } from 'utils/string-utils'

type Props = {
    data: IIeltsTest
}

const DetailIeltsTest: FC<Props> = ({ data }) => (
    <Card hoverable bordered title={null} style={{ borderRadius: '5px' }}>
        <div
            dangerouslySetInnerHTML={{
                __html: sanitize(data?.article)
            }}
        />
    </Card>
)

export default memo(DetailIeltsTest)
