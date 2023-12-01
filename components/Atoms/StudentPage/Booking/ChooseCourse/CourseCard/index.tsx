import { Image, Card, Badge } from 'antd'
import { FC, memo } from 'react'
import { EnumCourseTag, ICourse } from 'types'
import cn from 'classnames'
import _ from 'lodash'
import { DEFAULT_COURSE_PREVIEW } from 'const'
import { getTranslateText } from 'utils/translate-utils'
import styles from './CourseCard.module.scss'

type Props = {
    data: ICourse
    total_lessons: number
    active?: boolean
    handleClick: () => void
}

const CourseCard: FC<Props> = ({
    data,
    total_lessons,
    active,
    handleClick
}) => {
    const parseColor = (val) => {
        switch (val) {
            case EnumCourseTag.HOT:
                return 'red'
            case EnumCourseTag.NEW:
                return 'cyan'
            case EnumCourseTag.SPECIAL_OFFER:
                return 'purple'
            default:
                break
        }
    }
    let totalLesson = 0
    if (total_lessons) {
        totalLesson = total_lessons
    }

    const renderTags = () => {
        if (data?.tags && data?.tags.length > 0) {
            return data?.tags.map((item, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: `${0 + index * 30}px`
                    }}
                >
                    <Badge.Ribbon
                        text={_.startCase(item)}
                        color={parseColor(item)}
                    />
                </div>
            ))
        }
    }

    return (
        <Card
            className={cn(
                'clickable',
                styles.courseCard,
                active && styles.active
            )}
            onClick={handleClick}
        >
            <div className='body'>
                <div className='row'>
                    <div className='col-2'>
                        <div className='preview preview-pic tab-content'>
                            <div className='tab-pane active' id=''>
                                <Image
                                    src={data?.image || DEFAULT_COURSE_PREVIEW}
                                    fallback={DEFAULT_COURSE_PREVIEW}
                                    className={cn(styles['img-fluid'])}
                                    alt={data?.name}
                                    preview={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-8'>
                        <div className='product details'>
                            <h3
                                className={cn(
                                    'product-title mb-0',
                                    styles['course-title']
                                )}
                            >
                                {data?.name}
                            </h3>
                            <p className='product-description mt-1 mb-1'>
                                <span>{data?.description}</span>
                            </p>
                            <p className='product-description mt-1 mb-1'>
                                <span>
                                    {getTranslateText('common.general')}:{' '}
                                </span>
                                <a href='#' className='m-l-5'>
                                    <b>
                                        {data?.total_lessons || totalLesson}{' '}
                                        lessons
                                    </b>
                                </a>
                            </p>
                        </div>
                    </div>
                    {renderTags()}
                </div>
            </div>
        </Card>
    )
}

export default memo(CourseCard)
