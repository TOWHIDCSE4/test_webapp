import cn from 'classnames'
import { CALENDAR_TYPE } from 'const/calendar'
import { Image } from 'antd'
import { FC } from 'react'
import styles from './Flag.module.scss'

type Props = {
    type: number
}

const Flag: FC<Props> = (props) => {
    const { type = 3 } = props
    const renderColor = () => {
        switch (type) {
            case CALENDAR_TYPE.FIXED_CLASS:
                return '#f63238'
            case CALENDAR_TYPE.OPEN_CLASS:
                return '#F67900'
            case CALENDAR_TYPE.PRIVATE_CLASS:
                return '#009144'
            default:
                break
        }
    }

    const renderImage = () => {
        switch (type) {
            case CALENDAR_TYPE.FIXED_CLASS:
                return (
                    <Image
                        src='/static/img/teacher/schedules/fixed-calendar.svg'
                        width={20}
                        height={20}
                        preview={false}
                    />
                )
            case CALENDAR_TYPE.OPEN_CLASS:
                return (
                    <Image
                        src='/static/img/teacher/schedules/open-class.svg'
                        width={20}
                        height={20}
                        preview={false}
                    />
                )
            case CALENDAR_TYPE.PRIVATE_CLASS:
                return (
                    <Image
                        src='/static/img/teacher/schedules/private-class.svg'
                        width={20}
                        height={20}
                        preview={false}
                    />
                )
            default:
                break
        }
    }

    return (
        <div
            className={cn(styles.flag)}
            style={{ backgroundColor: `${renderColor()}` }}
        >
            <div className={cn(styles.icon)}>{renderImage()}</div>
        </div>
    )
}

export default Flag
