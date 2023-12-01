import React from 'react'
import { Card, Col, Badge } from 'antd'
import { EnumCourseTag } from 'types'
import _ from 'lodash'

const { Meta } = Card

export default function CourseCard(props) {
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
    const renderTags = () => {
        if (props?.course?.tags && props?.course?.tags.length > 0) {
            return props?.course?.tags.map((item, index) => (
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
        <Col span={8}>
            <Card
                bordered
                size='small'
                style={{ width: 300, margin: '0 auto' }}
                cover={
                    <a
                        href={`/course-explorer/${props?.course?.id}`}
                        style={{ border: '1px solid #f0f0f0' }}
                    >
                        <img
                            style={{ width: '100%', height: '400px' }}
                            alt={props?.course?.name}
                            src={
                                props?.course?.image ||
                                'https://cdn.ispeak.vn/file/ispeak/2016/07/ispeak_square_160726105336.png'
                            }
                            onError={(e) => {
                                e.currentTarget.src =
                                    'https://cdn.ispeak.vn/file/ispeak/2016/07/ispeak_square_160726105336.png'
                            }}
                        />
                    </a>
                }
            >
                <a href={`/course-explorer/${props?.course?.id}`}>
                    <Meta
                        title={props?.course?.name}
                        description={props?.course?.description}
                    />
                </a>
                {renderTags()}
            </Card>
        </Col>
    )
}
