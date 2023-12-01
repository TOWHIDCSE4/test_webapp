import React, { FC, memo, useEffect, useState } from 'react'
import UnitAPI from 'api/UnitAPI'
import { notify } from 'contexts/Notification'
import cn from 'classnames'
import { Spin, Row, Col, Empty, Checkbox } from 'antd'
import { getTranslateText } from 'utils/translate-utils'
import { IUnit } from 'types'
import { CheckCircleOutlined } from '@ant-design/icons'
import styles from './ChooseUnit.module.scss'

type Props = {
    selectUnitId: number | string
    courseId: number | string
    onChangeUnit: (val: IUnit) => void
}

const ChooseUnit: FC<Props> = ({ selectUnitId, courseId, onChangeUnit }) => {
    const [loading, setLoading] = useState(false)
    const [units, setUnits] = useState<IUnit[]>([])
    const [learnt, setLearnt] = useState([])

    const getUnits = (course_id) => {
        setLoading(true)
        UnitAPI.getUnitsLearnt(course_id)
            .then((res) => {
                setUnits(res.data.allUnits)
                setLearnt(res.data.learntUnits)
            })
            .catch((err) => {
                notify('error', err.message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (courseId) {
            getUnits(courseId)
        }
    }, [courseId])

    const onChangeCheckUnit = (item: IUnit) => {
        if (item?.id !== selectUnitId) {
            onChangeUnit(item)
        }
    }

    const renderUnits = () => {
        if (units.length > 0) {
            return units.map((item, index) => (
                <Col offset={8} span={16} key={index}>
                    <Checkbox
                        onChange={() => onChangeCheckUnit(item)}
                        checked={selectUnitId === item.id}
                    >
                        {item.name}
                    </Checkbox>
                    {learnt.includes(item.id) && (
                        <CheckCircleOutlined
                            className={cn(styles['icon-learnt'])}
                        />
                    )}
                </Col>
            ))
        }
        return (
            <Col span={16}>
                <Empty description={getTranslateText('no_course_available')} />
            </Col>
        )
    }
    return (
        <Spin spinning={loading}>
            <Row
                gutter={[25, 20]}
                justify='center'
                className={cn(styles['scroll-courses'])}
            >
                {renderUnits()}
            </Row>
        </Spin>
    )
}

export default memo(ChooseUnit)
