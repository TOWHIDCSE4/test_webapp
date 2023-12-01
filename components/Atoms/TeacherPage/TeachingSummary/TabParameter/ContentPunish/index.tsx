import React, { FC, useCallback, useState } from 'react'
import cn from 'classnames'
import { getTranslateText } from 'utils/translate-utils'
import { toReadablePrice } from 'utils/price-utils'
import styles from '../TabParameter.module.scss'
import DetailPunishModal from '../ModalDetail'
import DetailPunishModalRegular from '../ModalRegular'

type Props = {
    data: any
}

const ContentPaneLeft: FC<Props> = ({ data }) => {
    const [visibleModal, setVisibleModal] = useState(false)
    const [visibleModalRegular, setVisibleModalRegular] = useState(false)

    const [selectedData, setSelectedData] = useState([])

    const toggleModal = (val: boolean) => {
        setVisibleModal(val)
    }
    const toggleModalRegular = (val: boolean) => {
        setVisibleModalRegular(val)
    }

    return (
        <>
            <div className={cn(styles.table)}>
                <div className={cn(styles.headTable)}>
                    <div className={cn(styles.tableItem)}>
                        <div>{getTranslateText('teacher.summary.no')}</div>
                        <div>{getTranslateText('teacher.summary.item')}</div>
                        <div>{getTranslateText('teacher.summary.formula')}</div>
                        <div>
                            {getTranslateText('teacher.summary.quantity')}
                        </div>
                        <div>{getTranslateText('teacher.summary.amount')}</div>
                    </div>
                </div>
                <div className={cn(styles.contentTable)}>
                    <div className={cn(styles.tableItem)}>
                        <div>1</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_trial'
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
                        ${data?.percent_absent_punish_trial} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish?.list_absent_trial?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish?.list_absent_trial
                                        )
                                        toggleModal(true)
                                    }
                                }}
                            >
                                {data?.punish?.list_absent_trial?.length}
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish?.total_punish_absent_trial
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>2</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_first_3_slot'
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
                        ${data?.percent_absent_punish_first_3_slot} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish?.list_absent_first_3_slot
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_first_3_slot
                                        )
                                        toggleModal(true)
                                    }
                                }}
                            >
                                {data?.punish?.list_absent_first_3_slot?.length}
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_first_3_slot
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>3</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_without_leave'
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
                        ${data?.percent_absent_punish} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish?.list_absent_without_leave
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_without_leave
                                        )
                                        toggleModal(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish?.list_absent_without_leave
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_without_leave
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>4</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_with_leave_1h'
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
                        ${data?.percent_absent_punish_1h} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish?.list_absent_with_leave_1h
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_with_leave_1h
                                        )
                                        toggleModal(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish?.list_absent_with_leave_1h
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_with_leave_1h
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>5</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_with_leave_2h'
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
                        ${data?.percent_absent_punish_2h} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish?.list_absent_with_leave_2h
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_with_leave_2h
                                        )
                                        toggleModal(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish?.list_absent_with_leave_2h
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_with_leave_2h
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>6</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_with_leave_3h'
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
                        ${data?.percent_absent_punish_3h} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish?.list_absent_with_leave_3h
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_with_leave_3h
                                        )
                                        toggleModal(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish?.list_absent_with_leave_3h
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_with_leave_3h
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>7</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_with_leave_greater_3h'
                                )}
                            </p>
                        </div>
                        <div>
                            {`
                        [ ${getTranslateText('teacher.summary.quantity')} ] *
                        ${toReadablePrice(data?.absent_punish_greater_3h)}  ${
                                data?.currency
                            }
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish
                                            ?.list_absent_with_leave_greater_3h
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_with_leave_greater_3h
                                        )
                                        toggleModal(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish
                                        ?.list_absent_with_leave_greater_3h
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_with_leave_greater_3h
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>8</div>
                        <div>
                            <p>
                                {getTranslateText('teacher.summary.over_limit')}
                            </p>
                        </div>
                        <div>
                            {`
                        [ ${getTranslateText('teacher.summary.quantity')} ] *
                        ${toReadablePrice(data?.over_limit_punish)}  ${
                                data?.currency
                            }
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (data?.punish?.list_over_limit?.length) {
                                        setSelectedData(
                                            data?.punish?.list_over_limit
                                        )
                                        toggleModal(true)
                                    }
                                }}
                            >
                                {data?.punish?.list_over_limit?.length}
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish?.total_punish_with_over_limit
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>9</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_regular_first_3_slot'
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
                        ${data?.percent_absent_punish_first_3_slot} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish
                                            ?.list_absent_regular_first_3_slot
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_regular_first_3_slot
                                        )
                                        toggleModalRegular(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish
                                        ?.list_absent_regular_first_3_slot
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_regular_first_3_slot
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>10</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_regular_with_leave_1h'
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
                        ${data?.percent_absent_punish_1h} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish
                                            ?.list_absent_regular_with_leave_1h
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_regular_with_leave_1h
                                        )
                                        toggleModalRegular(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish
                                        ?.list_absent_regular_with_leave_1h
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_regular_with_leave_1h
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>11</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_regular_with_leave_2h'
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
                        ${data?.percent_absent_punish_2h} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish
                                            ?.list_absent_regular_with_leave_2h
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_regular_with_leave_2h
                                        )
                                        toggleModalRegular(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish
                                        ?.list_absent_regular_with_leave_2h
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_regular_with_leave_2h
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>12</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_regular_with_leave_3h'
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
                        ${data?.percent_absent_punish_3h} %
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish
                                            ?.list_absent_regular_with_leave_3h
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_regular_with_leave_3h
                                        )
                                        toggleModalRegular(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish
                                        ?.list_absent_regular_with_leave_3h
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_regular_with_leave_3h
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>13</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.punish_absent_regular_with_leave_greater_3h'
                                )}
                            </p>
                        </div>
                        <div>
                            {`
                        [ ${getTranslateText('teacher.summary.quantity')} ] *
                        ${toReadablePrice(data?.absent_punish_greater_3h)}  ${
                                data?.currency
                            }
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish
                                            ?.list_absent_regular_with_leave_greater_3h
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_absent_regular_with_leave_greater_3h
                                        )
                                        toggleModalRegular(true)
                                    }
                                }}
                            >
                                {
                                    data?.punish
                                        ?.list_absent_regular_with_leave_greater_3h
                                        ?.length
                                }
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_absent_regular_with_leave_greater_3h
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>14</div>
                        <div>
                            <p>
                                {getTranslateText('teacher.summary.over_limit')}
                            </p>
                        </div>
                        <div>
                            {`
                        [ ${getTranslateText('teacher.summary.quantity')} ] *
                        ${toReadablePrice(data?.over_limit_punish)}  ${
                                data?.currency
                            }
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (
                                        data?.punish?.list_regular_over_limit
                                            ?.length
                                    ) {
                                        setSelectedData(
                                            data?.punish
                                                ?.list_regular_over_limit
                                        )
                                        toggleModalRegular(true)
                                    }
                                }}
                            >
                                {data?.punish?.list_regular_over_limit?.length}
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish
                                        ?.total_punish_regular_with_over_limit
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem)}>
                        <div>15</div>
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.late_memo_punish'
                                )}
                            </p>
                            <small>
                                {getTranslateText(
                                    'teacher.summary.late_memo_punish_desc1'
                                )}
                            </small>
                            <br />
                            <small>
                                {' '}
                                {getTranslateText(
                                    'teacher.summary.late_memo_punish_desc2'
                                )}
                            </small>
                        </div>
                        <div>
                            {`
                        [ ${getTranslateText('teacher.summary.quantity')} ] *
                        ${toReadablePrice(data?.late_memo_punish)}  ${
                                data?.currency
                            }
                        `}
                        </div>
                        <div>
                            <a
                                className='text-primary'
                                onClick={() => {
                                    if (data?.punish?.list_late_memo?.length) {
                                        setSelectedData(
                                            data?.punish?.list_late_memo
                                        )
                                        toggleModal(true)
                                    }
                                }}
                            >
                                {data?.punish?.list_late_memo?.length}
                            </a>
                        </div>
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish?.total_punish_with_late_memo
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>

                    <div className={cn(styles.tableItem, styles.totalSalary)}>
                        <div />
                        <div>
                            <p>
                                {getTranslateText(
                                    'teacher.summary.total_punish'
                                )}
                            </p>
                        </div>
                        <div>
                            [1] + [2] + [3] + [4] + [5] + [6] + [7] + [8] + [9]
                            + [10] + [11] + [12] + [13] + [14] + [15]
                        </div>
                        <div />
                        <div>
                            <span>
                                {`${toReadablePrice(
                                    data?.punish?.total_punish
                                )} ${data?.currency}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <DetailPunishModal
                toggleModal={toggleModal}
                visible={visibleModal}
                data={selectedData}
            ></DetailPunishModal>

            <DetailPunishModalRegular
                toggleModal={toggleModalRegular}
                visible={visibleModalRegular}
                data={selectedData}
            ></DetailPunishModalRegular>
        </>
    )
}

export default ContentPaneLeft
