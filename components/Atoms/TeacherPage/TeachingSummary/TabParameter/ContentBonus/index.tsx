import React, { FC, useState } from 'react'
import cn from 'classnames'
import { getTranslateText } from 'utils/translate-utils'
import { ITeacherSalary } from 'types'
import { toReadablePrice } from 'utils/price-utils'
import styles from '../TabParameter.module.scss'
import ModalDetail from '../ModalDetail'
import ModalDetailConversion from '../ModalConversion'
import ModalDetailReferral from '../ModalReferral'

type Props = {
    data: any
}

const ContentPaneLeft: FC<Props> = ({ data }) => {
    const [visibleModal, setVisibleModal] = useState(false)
    const [visibleModalConversion, setVisibleModalConversion] = useState(false)
    const [visibleModalReferral, setVisibleModalReferral] = useState(false)

    const [selectedData, setSelectedData] = useState([])

    const toggleModal = (val: boolean) => {
        setVisibleModal(val)
    }
    const toggleModalConversion = (val: boolean) => {
        setVisibleModalConversion(val)
    }
    const toggleModalReferral = (val: boolean) => {
        setVisibleModalReferral(val)
    }

    return (
        <div className={cn(styles.table)}>
            <div className={cn(styles.headTable)}>
                <div className={cn(styles.tableItem)}>
                    <div>{getTranslateText('teacher.summary.no')}</div>
                    <div>{getTranslateText('teacher.summary.item')}</div>
                    <div>{getTranslateText('teacher.summary.formula')}</div>
                    <div>{getTranslateText('teacher.summary.quantity')}</div>
                    <div>{getTranslateText('teacher.summary.amount')}</div>
                </div>
            </div>
            <div className={cn(styles.contentTable)}>
                <div className={cn(styles.tableItem)}>
                    <div>1</div>
                    <div>
                        <p>
                            {getTranslateText('teacher.summary.bonus_weekend')}
                        </p>
                    </div>
                    <div>
                        [ {getTranslateText('teacher.summary.quantity')} ] *{' '}
                        {`${toReadablePrice(data?.weekend_bonus)} ${
                            data?.currency
                        }`}
                    </div>
                    <div>
                        <a
                            className='text-primary'
                            onClick={() => {
                                if (data?.bonus?.list_slot_weekend?.length) {
                                    setSelectedData(
                                        data?.bonus?.list_slot_weekend
                                    )
                                    toggleModal(true)
                                }
                            }}
                        >
                            {data?.bonus?.list_slot_weekend?.length}
                        </a>
                    </div>
                    <div>
                        <span>
                            {`${toReadablePrice(
                                data?.bonus?.total_bonus_weekend
                            )} ${data?.currency}`}
                        </span>
                    </div>
                </div>

                <div className={cn(styles.tableItem)}>
                    <div>2</div>
                    <div>
                        <p>
                            {getTranslateText(
                                'teacher.summary.bonus_attendance'
                            )}
                        </p>
                    </div>
                    <div>
                        {`${toReadablePrice(data?.attendance_bonus)} ${
                            data?.currency
                        }`}
                    </div>
                    <div>{data?.bonus?.list_slot_attendance?.length}</div>
                    <div>
                        <span>
                            {`${toReadablePrice(
                                data?.bonus?.total_bonus_attendance
                            )} ${data?.currency}`}
                        </span>
                    </div>
                </div>

                <div className={cn(styles.tableItem)}>
                    <div>3</div>
                    <div>
                        <p>
                            {getTranslateText(
                                'teacher.summary.bonus_conversion'
                            )}
                        </p>
                    </div>
                    <div>
                        [ {getTranslateText('teacher.summary.quantity')} ] *{' '}
                        {`${toReadablePrice(data?.conversion_bonus)} ${
                            data?.currency
                        }`}
                    </div>
                    <div>
                        <a
                            className='text-primary'
                            onClick={() => {
                                if (data?.bonus?.list_conversion?.length) {
                                    setSelectedData(
                                        data?.bonus?.list_conversion
                                    )
                                    toggleModalConversion(true)
                                }
                            }}
                        >
                            {data?.bonus?.list_conversion?.length}
                        </a>
                    </div>
                    <div>
                        <span>
                            {`${toReadablePrice(
                                data?.bonus?.total_bonus_conversion
                            )} ${data?.currency}`}
                        </span>
                    </div>
                </div>

                <div className={cn(styles.tableItem)}>
                    <div>4</div>
                    <div>
                        <p>
                            {getTranslateText('teacher.summary.bonus_referral')}
                        </p>
                    </div>
                    <div>
                        [ {getTranslateText('teacher.summary.quantity')} ] *{' '}
                        {`${toReadablePrice(data?.referral_bonus)} ${
                            data?.currency
                        }`}
                    </div>
                    <div>
                        <a
                            className='text-primary'
                            onClick={() => {
                                if (data?.bonus?.list_referral?.length) {
                                    setSelectedData(data?.bonus?.list_referral)
                                    toggleModalReferral(true)
                                }
                            }}
                        >
                            {data?.bonus?.list_referral?.length}
                        </a>
                    </div>
                    <div>
                        <span>
                            {`${toReadablePrice(
                                data?.bonus?.total_bonus_referral
                            )} ${data?.currency}`}
                        </span>
                    </div>
                </div>

                <div className={cn(styles.tableItem)}>
                    <div>5</div>
                    <div>
                        <p>
                            {getTranslateText(
                                'teacher.summary.bonus_substitute_class'
                            )}
                        </p>
                    </div>
                    <div>
                        {`
                        [ ${getTranslateText('teacher.summary.quantity')} ] *
                        [ ${getTranslateText(
                            'teacher.summary.salary_slot'
                        )} (${toReadablePrice(data?.salary_slot)} ${
                            data?.currency
                        })] *
                        ${data?.percent_substitute_bonus} %
                        `}
                    </div>
                    <div>
                        <a
                            className='text-primary'
                            onClick={() => {
                                if (
                                    data?.bonus?.list_slot_substitute_class
                                        ?.length
                                ) {
                                    setSelectedData(
                                        data?.bonus?.list_slot_substitute_class
                                    )
                                    toggleModal(true)
                                }
                            }}
                        >
                            {data?.bonus?.list_slot_substitute_class?.length}
                        </a>
                    </div>
                    <div>
                        <span>
                            {`${toReadablePrice(
                                data?.bonus?.total_bonus_substitute_class
                            )} ${data?.currency}`}
                        </span>
                    </div>
                </div>

                <div className={cn(styles.tableItem, styles.totalSalary)}>
                    <div></div>
                    <div>
                        <p>{getTranslateText('teacher.summary.total_bonus')}</p>
                    </div>
                    <div>[1] + [2] + [3] + [4] + [5]</div>
                    <div></div>
                    <div>
                        <span>
                            {`${toReadablePrice(data?.bonus?.total_bonus)} ${
                                data?.currency
                            }`}
                        </span>
                    </div>
                </div>
                <ModalDetail
                    toggleModal={toggleModal}
                    visible={visibleModal}
                    data={selectedData}
                ></ModalDetail>
                <ModalDetailConversion
                    toggleModal={toggleModalConversion}
                    visible={visibleModalConversion}
                    data={selectedData}
                ></ModalDetailConversion>
                <ModalDetailReferral
                    toggleModal={toggleModalReferral}
                    visible={visibleModalReferral}
                    data={selectedData}
                ></ModalDetailReferral>
            </div>
        </div>
    )
}

export default ContentPaneLeft
