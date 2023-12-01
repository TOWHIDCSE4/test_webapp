import { Button, Card } from 'antd'
import { FC, memo, useCallback, useEffect, useState } from 'react'
import { IBooking } from 'types'
import { BOOKING_STATUS } from 'const'
import _ from 'lodash'
import { renderColorStatus } from 'utils/color'
import cn from 'classnames'
import RatingPopup from 'components/Atoms/RatingPopup'
import { useRouter } from 'next/router'
import { getTranslateText } from 'utils/translate-utils'
import styles from './RightBlock.module.scss'

type Props = {
    data: IBooking
    refetchData: () => void
}

const RightBlock: FC<Props> = ({ data, refetchData }) => {
    const router = useRouter()

    const queryRoute = router.query

    const [visibleRating, setVisibleRating] = useState<boolean>(false)

    const toggleRating = useCallback(
        (val: boolean) => {
            setVisibleRating(val)
        },
        [visibleRating]
    )

    useEffect(() => {
        if (queryRoute) {
            if (queryRoute?.toggle_rating) {
                setVisibleRating(true)
            }
        }
    }, [queryRoute])

    const TitleCard = () => (
        <div className={cn('d-flex justify-content-center', styles.titleCard)}>
            {_.startCase(_.findKey(BOOKING_STATUS, (o) => o === data?.status))}
        </div>
    )

    return (
        <Card
            title={<TitleCard />}
            headStyle={{
                backgroundImage: `linear-gradient(270deg, ${renderColorStatus(
                    data?.status
                )}, ${renderColorStatus(data?.status)})`,
                borderRadius: '10px 10px 0 0'
            }}
            style={{ borderRadius: '10px' }}
        >
            {data?.status === BOOKING_STATUS.COMPLETED && (
                <div>
                    <p>
                        <span>
                            The lesson has been completed. Please send to Ispeak
                            rating & report (If there was a problem with the
                            lesson)
                        </span>
                    </p>
                    <div className='d-flex justify-content-center'>
                        <Button
                            onClick={() => toggleRating(true)}
                            className={cn(styles['btn-rating'])}
                        >
                            {data?.report?.report_content
                                ? getTranslateText('rating.view_title')
                                : getTranslateText('rating.title')}
                        </Button>
                    </div>
                </div>
            )}

            {data?.id && data?.teacher?.id && (
                <RatingPopup
                    visible={visibleRating}
                    data={data?.report?.report_content}
                    toggleModal={toggleRating}
                    refetchData={refetchData}
                    bookingData={{ id: data?.id, teacher_id: data?.teacher.id }}
                />
            )}
        </Card>
    )
}

export default memo(RightBlock)
