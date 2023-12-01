/* eslint-disable @typescript-eslint/no-shadow */
import React, {
    useEffect,
    useReducer,
    memo,
    useState,
    FC,
    useCallback
} from 'react'
import cn from 'classnames'
import BookingAPI from 'api/BookingAPI'
import { Empty, Pagination, Spin } from 'antd'
import _ from 'lodash'
import ConfirmClassPopup from 'components/Atoms/ConfirmClassPopup'
import { EnumOrderType, IBooking } from 'types'
import { Logger } from 'utils/logger'
import TeachingHistoryItem from './TeachingHistoryItem'
import MemoModal from '../../Dashboard/MemoModal'

type Props = {
    status: number[]
    onChangeTotal: (val: number) => void
    search: string
}

const PrivateClassHistory: FC<Props> = ({ status, onChangeTotal, search }) => {
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            private_class: [],
            page_size: 10,
            page_number: 1,
            total: 0
        }
    )

    const [visibleConfirmClass, setVisibleConfirmClass] =
        useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<IBooking>(null)
    const [selectedTrialBooking, setSelectedTrialBooking] =
        useState<IBooking>(null)
    const [selectedRegularBooking, setSelectedRegularBooking] =
        useState<IBooking>(null)

    const getPrivateClass = (query?: {
        page_size: number
        page_number: number
        status: number[]
        search: string
    }) => {
        setValues({ isLoading: true })
        BookingAPI.getBookingsByTeacher({
            page_number: query.page_number,
            page_size: query.page_size,
            status: query.status,
            prev: true,
            search: query.search
        })
            .then((res) => {
                setValues({ private_class: res.data })
                if (res.pagination && res.pagination.total >= 0) {
                    setValues({ total: res.pagination.total })
                }
                if (onChangeTotal) onChangeTotal(res.pagination.total)
            })
            .catch((err) => {
                Logger.error(err)
            })
            .finally(() => setValues({ isLoading: false }))
    }

    useEffect(() => {
        getPrivateClass({
            page_size: values.page_size,
            status,
            page_number: 1,
            search
        })
        setValues({ page_number: 1 })
    }, [status, search])

    const openMemoModal = useCallback((booking) => {
        if (!booking) {
            return
        }

        if (booking.ordered_package?.type === EnumOrderType.TRIAL) {
            setSelectedTrialBooking(booking)
            return
        }

        setSelectedRegularBooking(booking)
    }, [])

    const handleChangePagination = (pageNumber, pageSize) => {
        setValues({ page_size: pageSize, page_number: pageNumber })
        getPrivateClass({
            ...values,
            page_number: pageNumber,
            page_size: pageSize,
            status,
            search
        })
    }

    const toggleConfirmClass = (val: boolean, selected?: IBooking) => {
        setVisibleConfirmClass(val)
        setSelectedItem(selected)
    }

    const refetchData = () => {
        getPrivateClass({
            page_size: values.page_size,
            status,
            page_number: values.page_number,
            search
        })
    }

    const renderTeachingHistory = () => {
        if (_.isEmpty(values.private_class)) {
            return <Empty />
        }

        const refetchItem = (data: any) => {
            const newPClass = values.private_class.map((item: IBooking) => {
                if (item.id === data.id) {
                    return {
                        ...item,
                        ...data
                    }
                }
                return item
            })
            setValues({ private_class: newPClass })
        }

        return values.private_class.map((item, index) => (
            <div className={cn('mt-3 mb-3')} key={index}>
                <TeachingHistoryItem
                    item={item}
                    openMemoModal={openMemoModal}
                    openConfirmClass={toggleConfirmClass}
                    refetchItem={refetchItem}
                />
            </div>
        ))
    }
    return (
        <>
            <div className={cn('mt-3')}>
                {values.isLoading ? (
                    <div className='mb-3 text-center'>
                        <Spin className='text-center' size='large' />
                    </div>
                ) : (
                    renderTeachingHistory()
                )}
                {!values.isLoading && values.total > 0 && (
                    <div className='mb-3 flex justify-content-end'>
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
                    getPrivateClass({ ...values, status, search })
                }}
            />

            <MemoModal
                type='other'
                visible={!!selectedRegularBooking}
                close={() => setSelectedRegularBooking(null)}
                data={selectedRegularBooking}
                callback={() => {
                    getPrivateClass({ ...values, status, search })
                }}
            />

            <ConfirmClassPopup
                visible={visibleConfirmClass}
                data={selectedItem}
                toggleModal={toggleConfirmClass}
                refetchData={refetchData}
            />
        </>
    )
}

export default memo(PrivateClassHistory)
