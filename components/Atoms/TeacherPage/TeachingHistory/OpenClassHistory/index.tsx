/* eslint-disable @typescript-eslint/no-shadow */
import React, { useReducer, useState } from 'react'
import cn from 'classnames'
import { Empty, Pagination } from 'antd'
import _ from 'lodash'
import { IBooking } from 'types/IBooking'
import { EnumOrderType } from 'types/IOrderedPackage'
import TeachingHistoryItem from '../PrivateClassHistory/TeachingHistoryItem'
import MemoModal from '../../Dashboard/MemoModal'

const OpenClassHistory = ({ status }) => {
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            open_class: [],
            page_size: 10,
            page_number: 1,
            total: 0,
            status: -1
        }
    )

    const [selectedTrialBooking, setSelectedTrialBooking] =
        useState<IBooking>(null)
    const [selectedRegularBooking, setSelectedRegularBooking] =
        useState<IBooking>(null)

    const getOpenClass = ({ page_size, page_number, status }) => {}

    const handleChangePagination = (pageNumber, pageSize) => {
        setValues({ page_size: pageSize, page_number: pageNumber })
        getOpenClass({
            ...values,
            page_number: pageNumber,
            page_size: pageSize
        })
    }

    const openMemoModal = (booking) => {
        if (!booking) {
            return
        }

        if (booking.ordered_package?.type === EnumOrderType.TRIAL) {
            setSelectedTrialBooking(booking)
            return
        }

        setSelectedRegularBooking(booking)
    }

    const renderTeachingHistory = () => {
        if (_.isEmpty(values.open_class)) return <Empty />
        return values.open_class.map((item, index) => (
            <div className={cn('mt-3 mb-3')} key={index}>
                <TeachingHistoryItem
                    item={item}
                    openMemoModal={openMemoModal}
                    openConfirmClass={() => {}}
                />
            </div>
        ))
    }
    return (
        <>
            <div className={cn('mt-3')}>
                {renderTeachingHistory()}
                {values.total > 0 && (
                    <div className='mb-3'>
                        <Pagination
                            defaultCurrent={values.page_number}
                            pageSize={values.page_size}
                            total={values.total}
                            onChange={handleChangePagination}
                        />
                    </div>
                )}
            </div>

            <MemoModal
                type='trial'
                visible={!!selectedTrialBooking}
                close={() => setSelectedTrialBooking(null)}
                data={selectedTrialBooking}
                callback={() => {
                    getOpenClass({ ...values, status })
                }}
            />

            <MemoModal
                type='other'
                visible={!!selectedRegularBooking}
                close={() => setSelectedRegularBooking(null)}
                data={selectedRegularBooking}
                callback={() => {
                    getOpenClass({ ...values, status })
                }}
            />
        </>
    )
}

export default OpenClassHistory
