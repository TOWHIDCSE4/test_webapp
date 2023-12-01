import { Image } from 'antd'

const Star = ({ active, width = 20 }) => (
    <Image
        src={
            active
                ? '/static/img/teacher/dashboard/star.svg'
                : '/static/img/teacher/dashboard/star-fill.svg'
        }
        width={width}
        preview={false}
        alt='Rating'
    />
)

export default Star
