import React, { memo, useCallback } from 'react'
import { Spin } from 'antd'
import cn from 'classnames'
import { SQUARE_TYPE } from 'const/calendar'
import styles from './SquareItem.module.scss'

const SquareItem = ({ type = 1, loading = false, editing = false }) => {
    const renderColor = useCallback(() => {
        if (
            [SQUARE_TYPE.REGISTERED_REGULAR, SQUARE_TYPE.REGULAR].includes(type)
        )
            return '#009144'
        if ([SQUARE_TYPE.FLEXIBLE].includes(type)) return '#9de1bd'
        if ([SQUARE_TYPE.CLOSE_REGULAR].includes(type)) return '#707070'
        if ([SQUARE_TYPE.REGULAR_BOOKED].includes(type)) return '#F63238'
        if ([SQUARE_TYPE.FLEXIBLE_BOOKED].includes(type)) return '#ff9999'
    }, [type])

    return (
        <div
            style={{
                backgroundColor: `${renderColor()}`,
                cursor: `${loading || !editing ? 'not-allowed' : 'pointer'}`
            }}
            className={cn(styles.squareItem)}
        >
            {loading ? (
                <Spin spinning={loading} />
            ) : (
                type === SQUARE_TYPE.REGISTERED_REGULAR && 'F'
            )}
        </div>
    )
}

export default memo(SquareItem)
