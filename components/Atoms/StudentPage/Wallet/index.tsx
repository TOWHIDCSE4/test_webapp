import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import BlockHeader from 'components/Atoms/StudentPage/BlockHeader'
import { getTranslateText } from 'utils/translate-utils'
import {
    Row,
    Col,
    Spin,
    Card,
    Button,
    Modal,
    Alert,
    Form,
    Input,
    InputNumber,
    Table,
    Tag,
    Tooltip
} from 'antd'
import { useAuth } from 'contexts/Auth'
import WalletAPI from 'api/WalletAPI'
import * as store from 'helpers/storage'
import { notify } from 'contexts/Notification'
import { PlusOutlined, ReloadOutlined, CopyOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import {
    EnumTransactionType,
    EnumTransactionStatus,
    EnumWalletHistoryType,
    EnumWalletHistoryStatus,
    POINT_VND_RATE,
    WalletPayment
} from 'const'
import cn from 'classnames'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styles from './wallet.module.scss'

const Wallet = () => {
    const [form] = Form.useForm()
    const { isLoading } = useAuth()
    const router = useRouter()
    const [visibleAddFundModal, setVisibleAddFundModal] = useState(false)
    const [visibleQRModal, setVisibleQRModal] = useState(false)
    const [point, setPoint] = useState(0)
    const [balance, setBalance] = useState(0.0)
    const [tableLoading, setTableLoading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [selectedPayment, setSelectedPayment] = useState(
        WalletPayment.CC_APPOTAPAY
    )
    const [bankAccount, setBankAccount] = useState({} as any)
    const [loadingDeposit, setLoadingDeposit] = useState(false)
    const arrDeposit = [
        100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 15000000,
        20000000
    ]

    const toggleModal = useCallback(
        (val: boolean) => {
            form.setFieldsValue({ price: 5000000 })
            setPoint(5000000 / POINT_VND_RATE)
            setVisibleAddFundModal(val)
        },
        [point, visibleAddFundModal]
    )

    const fetchBalance = useCallback(async () => {
        WalletAPI.getBalance()
            .then((res) => {
                setBalance(res.balance)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }, [])

    const fetchBankAccount = useCallback(async () => {
        WalletAPI.getBankAccount()
            .then((res) => {
                setBankAccount(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }, [])

    const fetchTransactionHistory = useCallback(
        async (query: { page_size?: number; page_number?: number }) => {
            setTableLoading(true)
            WalletAPI.getTransactionHistory(query)
                .then((res) => {
                    setTransactions(res.data)
                    setTotal(res.pagination.total)
                    setTableLoading(false)
                })
                .catch((err) => {
                    notify('error', err.message)
                    setTableLoading(false)
                })
                .finally(() => setTableLoading(false))
        },
        [tableLoading, transactions, total]
    )

    const reFetchBalance = useCallback(() => {
        fetchBalance()
        fetchTransactionHistory({
            page_size: pageSize,
            page_number: pageNumber
        })
    }, [])

    const doCheckout = useCallback(
        async (order_code?: string) => {
            try {
                const price = form.getFieldValue('price')
                if (price > 1000000000) {
                    return notify(
                        'error',
                        getTranslateText('wallet.max_amount')
                    )
                }
                setLoadingDeposit(true)
                if (selectedPayment === WalletPayment.BANK) {
                    setVisibleAddFundModal(false)
                    setVisibleQRModal(true)
                    const res = await WalletAPI.deposit({
                        source_data: { ...bankAccount, AMOUNT: price },
                        price,
                        coin: price / POINT_VND_RATE,
                        description: '',
                        source: selectedPayment
                    })
                    if (res) {
                        const id = res._id
                        setBankAccount({
                            ...bankAccount,
                            id,
                            AMOUNT: price,
                            DESCRIPTION: res.code
                        })
                    }
                }
                if (selectedPayment === WalletPayment.VISA) {
                    const data = await WalletAPI.getUrlConnectVisa()
                    toggleModal(false)
                    reFetchBalance()
                    if (data && data.status) {
                        if (data.url) location.href = data.url
                        if (data.card) {
                            const res = await WalletAPI.deposit({
                                source_data: { ...data.card, AMOUNT: price },
                                price,
                                coin: price / POINT_VND_RATE,
                                description: '',
                                source: selectedPayment
                            })
                            if (res.checkoutUrl) {
                                location.href = res.checkoutUrl
                            }
                            setTimeout(() => {
                                reFetchBalance()
                            }, 1000)
                        }
                    }
                }
                if (
                    [
                        WalletPayment.ATM_APPOTAPAY,
                        WalletPayment.BANK_APPOTAPAY,
                        WalletPayment.EWALLET_APPOTAPAY,
                        WalletPayment.CC_APPOTAPAY
                    ].includes(selectedPayment)
                ) {
                    setVisibleAddFundModal(false)
                    const res = await WalletAPI.deposit({
                        source_data: { AMOUNT: price },
                        price,
                        coin: price / POINT_VND_RATE,
                        description: '',
                        source: selectedPayment
                    })
                    if (res?.paymentUrl) location.href = res.paymentUrl
                }
            } catch (e) {
                notify('error', e.message)
            }
            setLoadingDeposit(false)
        },
        [visibleAddFundModal, visibleQRModal, bankAccount, selectedPayment]
    )

    const handleRequestDepositBank = async () => {
        try {
            WalletAPI.markPaid({
                _id: bankAccount.id
            }).then(() => {
                reFetchBalance()
                setVisibleQRModal(false)
                notify(
                    'success',
                    getTranslateText('wallet.deposit_submit_success')
                )
            })
        } catch (e) {
            notify('error', e.message)
        }
    }

    const handleCancelDepositBank = async () => {
        try {
            WalletAPI.cancelDeposit({
                _id: bankAccount.id
            }).then(() => {
                reFetchBalance()
                setVisibleQRModal(false)
            })
        } catch (e) {
            notify('error', e.message)
        }
    }

    const onChange = useCallback(
        (value) => {
            setPoint(value / POINT_VND_RATE)
        },
        [point]
    )

    const handleChangePagination = useCallback(
        (_pageNumber, _pageSize) => {
            setPageNumber(_pageNumber)
            setPageSize(_pageSize)
            fetchTransactionHistory({
                page_size: _pageSize,
                page_number: _pageNumber
            })
        },
        [pageNumber, pageSize]
    )

    const checkStatusOrderAppotapay = async (orderId: string) => {
        WalletAPI.checkStatusOrderAppotapay({ orderId })
            .then((res) => {
                fetchBalance()
                fetchTransactionHistory({
                    page_size: pageSize,
                    page_number: pageNumber
                })
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    useEffect(() => {
        const query = router.query
        const { errorCode, cancel, checksum, partnerCode, orderId } = query
        console.log(query)
        if (errorCode && cancel && errorCode === '000' && cancel === 'false') {
            setTimeout(() => {
                notify(
                    'success',
                    getTranslateText('wallet.connect_visa_success')
                )
            }, 2000)
        }
        if (errorCode == '0' || checksum) {
            setTimeout(() => {
                fetchBalance()
                notify('success', getTranslateText('wallet.deposit_success'))
            }, 2000)
        }
        if (partnerCode && errorCode != '0') {
            checkStatusOrderAppotapay(orderId as string)
        }
        fetchBankAccount()
        fetchBalance()
        fetchTransactionHistory({
            page_size: pageSize,
            page_number: pageNumber
        })
    }, [router])

    const columns: ColumnsType = [
        {
            title: getTranslateText('common.time'),
            dataIndex: 'updated_time',
            key: 'updated_time',
            width: 120,
            align: 'center',
            render: (text) => moment(text).format('DD/MM/YYYY HH:mm')
        },
        {
            title: getTranslateText('table.header.transaction_type'),
            dataIndex: 'type',
            key: 'type',
            width: 100,
            align: 'center',
            render: (text) => EnumTransactionType[text]
        },
        {
            title: getTranslateText('table.header.amount'),
            dataIndex: 'price',
            key: 'price',
            width: 120,
            align: 'center',
            render: (text, record: any) => (
                <Tag
                    color={
                        record.status !== EnumTransactionStatus.DONE
                            ? 'grey'
                            : record.type === EnumTransactionType.IN
                            ? 'green'
                            : 'red'
                    }
                >
                    {record.status !== EnumTransactionStatus.DONE
                        ? ''
                        : record.type === EnumTransactionType.IN
                        ? '+'
                        : '-'}{' '}
                    {Intl.NumberFormat('en-US').format(text / POINT_VND_RATE)}{' '}
                    {getTranslateText('point')}
                </Tag>
            )
        },
        {
            title: getTranslateText('common.status'),
            dataIndex: 'status',
            key: 'status',
            width: 100,
            align: 'center',
            render: (text, record: any) => EnumTransactionStatus[text]
        },
        {
            title: getTranslateText('common.note'),
            dataIndex: 'description',
            key: 'description',
            width: 200,
            align: 'center',
            render: (text) => text
        },
        {
            title: getTranslateText('common.note'),
            dataIndex: 'description',
            key: 'description',
            width: 200,
            align: 'center',
            render: (text, record: any) =>
                record.type === EnumTransactionType.IN
                    ? 'Nạp iXu vào ví'
                    : 'Thanh toán Order'
        }
    ]

    return (
        <div className='mb-4'>
            <BlockHeader title={getTranslateText('wallet')} />
            {isLoading ? (
                <div className='d-flex justify-content-center mt-5'>
                    <Spin spinning tip='Loading...' />
                </div>
            ) : (
                <>
                    <div className='row'>
                        <div className='col-12 col-md-4 mb-2'>
                            <Card>
                                <div className='text-center'>
                                    <h3>
                                        <strong>
                                            <Form.Item
                                                style={{
                                                    fontSize: '24px',
                                                    color: '#08c'
                                                }}
                                            >
                                                <div className='d-flex justify-content-center'>
                                                    <span className='mr-3'>
                                                        {Intl.NumberFormat(
                                                            'en-US'
                                                        ).format(balance)}
                                                        <span className='ml-2'>
                                                            {getTranslateText(
                                                                'point'
                                                            )}
                                                        </span>
                                                    </span>
                                                    <ReloadOutlined
                                                        onClick={reFetchBalance}
                                                        style={{
                                                            fontSize: '16px',
                                                            color: '#08c'
                                                        }}
                                                        className='align-self-center'
                                                        title='Reload'
                                                    />
                                                </div>
                                            </Form.Item>
                                        </strong>
                                    </h3>
                                    {/* <p
                                        style={{ color: '#0E2D63' }}
                                        className='text-center'
                                    >
                                        <span> </span>
                                        <Button
                                            type='primary'
                                            onClick={() => toggleModal(true)}
                                            shape='round'
                                            loading={loadingDeposit}
                                        >
                                            {getTranslateText('wallet.deposit')}
                                        </Button>
                                        <span> </span>
                                    </p> */}
                                </div>
                            </Card>
                        </div>

                        <div className='col-12  mb-2'>
                            <Card
                                title={getTranslateText('wallet.transaction')}
                            >
                                <Table
                                    dataSource={transactions}
                                    columns={columns}
                                    pagination={{
                                        defaultCurrent: pageNumber,
                                        current: pageNumber,
                                        pageSize,
                                        total,
                                        onChange: handleChangePagination
                                    }}
                                    rowKey={(record: any) => record._id}
                                    loading={tableLoading}
                                    scroll={{
                                        x: 500,
                                        y: 768
                                    }}
                                    bordered
                                />
                            </Card>
                        </div>
                    </div>

                    <Modal
                        maskClosable
                        centered
                        closable
                        visible={visibleAddFundModal}
                        onCancel={() => {
                            toggleModal(false)
                            reFetchBalance()
                        }}
                        title={getTranslateText('wallet.deposit')}
                        width={530}
                        footer={[
                            <Button
                                key='submit'
                                type='primary'
                                onClick={form.submit}
                            >
                                {getTranslateText('wallet.deposit')}
                            </Button>
                        ]}
                    >
                        <Form form={form} onFinish={() => doCheckout()}>
                            <Alert
                                message={getTranslateText(
                                    'wallet.warning_message'
                                )}
                                type='info'
                                showIcon
                                className='mb-4'
                            />
                            <div className='row mb-4'>
                                <div className='col-12 '>
                                    <b>
                                        {getTranslateText('wallet.amount')}
                                        (VNĐ)
                                    </b>
                                    <Form.Item name='price'>
                                        <InputNumber
                                            className='text-danger'
                                            style={{ width: '100%' }}
                                            formatter={(value) =>
                                                `${value}`.replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                )
                                            }
                                            parser={(value) =>
                                                value.replace(/\$\s?|(,*)/g, '')
                                            }
                                            min={10000}
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onChange={onChange}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-12  d-flex flex-wrap justify-content-between'>
                                    {arrDeposit.map((e) => (
                                        <Button
                                            type={
                                                point * POINT_VND_RATE === e
                                                    ? 'primary'
                                                    : 'text'
                                            }
                                            className='mb-1 mr-1'
                                            onClick={() => {
                                                form.setFieldsValue({
                                                    price: e
                                                })
                                                setPoint(e / POINT_VND_RATE)
                                            }}
                                        >
                                            {Intl.NumberFormat('en-US').format(
                                                e
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className='row mb-4'>
                                <div className='col-12 text-center '>
                                    <div className='border py-5'>
                                        <h6>
                                            {' '}
                                            {getTranslateText(
                                                'wallet.you_will_get'
                                            )}
                                        </h6>
                                        <h4 className='mb-0'>
                                            <b style={{ color: 'red' }}>
                                                {Intl.NumberFormat(
                                                    'en-US'
                                                ).format(point)}{' '}
                                                {getTranslateText('point')}
                                            </b>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col-12 mb-2'>
                                    <b>
                                        {' '}
                                        {getTranslateText(
                                            'wallet.payment_method'
                                        )}
                                    </b>
                                </div>
                                <div className={cn(styles.payment, 'col-12')}>
                                    {/* <div
                                        className={cn(
                                            styles['item-payment'],
                                            selectedPayment ===
                                                WalletPayment.BANK
                                                ? styles.active
                                                : ''
                                        )}
                                        onClick={() => {
                                            setSelectedPayment(
                                                WalletPayment.BANK
                                            )
                                        }}
                                    >
                                        <i className='fa fa-university ' />
                                        <p className='text-center'>
                                            {getTranslateText(
                                                'wallet.bank_transfer'
                                            )}
                                        </p>
                                        <p>{getTranslateText('wallet.qr')}</p>
                                    </div>
                                    <div
                                        className={cn(
                                            styles['item-payment'],
                                            selectedPayment ===
                                                WalletPayment.VISA
                                                ? styles.active
                                                : ''
                                        )}
                                        onClick={() => {
                                            setSelectedPayment(
                                                WalletPayment.VISA
                                            )
                                        }}
                                    >
                                        <i className='fa fa-credit-card' />
                                        <p>
                                            {getTranslateText(
                                                'wallet.master_card'
                                            )}
                                        </p>
                                        <p>{getTranslateText('wallet.visa')}</p>
                                    </div> */}
                                    {/* APPOTAPAY */}
                                    <div
                                        className={cn(
                                            styles['item-payment'],
                                            selectedPayment ===
                                                WalletPayment.CC_APPOTAPAY
                                                ? styles.active
                                                : ''
                                        )}
                                        onClick={() => {
                                            setSelectedPayment(
                                                WalletPayment.CC_APPOTAPAY
                                            )
                                        }}
                                    >
                                        <i className='fa fa-credit-card' />
                                        <p>{getTranslateText('wallet.visa')}</p>
                                    </div>
                                    <div
                                        className={cn(
                                            styles['item-payment'],
                                            selectedPayment ===
                                                WalletPayment.ATM_APPOTAPAY
                                                ? styles.active
                                                : ''
                                        )}
                                        onClick={() => {
                                            setSelectedPayment(
                                                WalletPayment.ATM_APPOTAPAY
                                            )
                                        }}
                                    >
                                        <i className='fas fa-money-check-alt' />
                                        <p>{getTranslateText('wallet.atm')}</p>
                                    </div>
                                    <div
                                        className={cn(
                                            styles['item-payment'],
                                            selectedPayment ===
                                                WalletPayment.BANK_APPOTAPAY
                                                ? styles.active
                                                : ''
                                        )}
                                        onClick={() => {
                                            setSelectedPayment(
                                                WalletPayment.BANK_APPOTAPAY
                                            )
                                        }}
                                    >
                                        <i className='fa fa-university' />
                                        <p>
                                            {getTranslateText(
                                                'wallet.bank_transfer'
                                            )}
                                        </p>
                                    </div>
                                    <div
                                        className={cn(
                                            styles['item-payment'],
                                            selectedPayment ===
                                                WalletPayment.EWALLET_APPOTAPAY
                                                ? styles.active
                                                : ''
                                        )}
                                        onClick={() => {
                                            setSelectedPayment(
                                                WalletPayment.EWALLET_APPOTAPAY
                                            )
                                        }}
                                    >
                                        <i className='fas fa-wallet'></i>
                                        <p>EWallet</p>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Modal>
                    <Modal
                        maskClosable
                        centered
                        closable
                        visible={visibleQRModal}
                        onCancel={() => {
                            reFetchBalance()
                            setVisibleQRModal(false)
                        }}
                        title={getTranslateText('wallet.bank_qr')}
                        width={700}
                        footer={[
                            <Button
                                key='submit'
                                type='default'
                                onClick={handleCancelDepositBank}
                            >
                                {getTranslateText('wallet.cancel')}
                            </Button>,
                            <Button
                                key='submit'
                                type='primary'
                                onClick={handleRequestDepositBank}
                            >
                                {getTranslateText('wallet.button_paid')}
                            </Button>
                        ]}
                    >
                        <div className='row mb-2 d-flex justify-content-center align-items-center'>
                            <div className='col-12 mb-2'>
                                <Alert
                                    message={getTranslateText(
                                        'wallet.bank_message'
                                    )}
                                    type='info'
                                    showIcon
                                    className='mb-4'
                                />
                            </div>
                            <div className='col-6 mb-2'>
                                <img
                                    src={`https://img.vietqr.io/image/${bankAccount?.BANK_ID}-${bankAccount?.ACCOUNT_NO}-${bankAccount?.TEMPLATE}?amount=${bankAccount?.AMOUNT}&addInfo=${bankAccount?.DESCRIPTION}`}
                                />
                            </div>
                            <div className='col-6 mb-2 h-100'>
                                <div className='mb-2'>
                                    {getTranslateText('wallet.bank')} :{' '}
                                    <Input.Group className='d-flex'>
                                        <Input
                                            disabled
                                            value={bankAccount.BANK_ID}
                                            style={{
                                                background: 'unset',
                                                color: 'unset'
                                            }}
                                        />
                                    </Input.Group>
                                </div>
                                <div className='mb-2'>
                                    {getTranslateText('wallet.account_no')}:
                                    <Input.Group className='d-flex'>
                                        <Input
                                            disabled
                                            value={bankAccount.ACCOUNT_NO}
                                            style={{
                                                background: 'unset',
                                                color: 'unset'
                                            }}
                                        />
                                        <Tooltip title='copy'>
                                            <CopyToClipboard
                                                text={bankAccount.ACCOUNT_NO}
                                            >
                                                <Button
                                                    icon={<CopyOutlined />}
                                                />
                                            </CopyToClipboard>
                                        </Tooltip>
                                    </Input.Group>
                                </div>
                                <div className='mb-2'>
                                    {getTranslateText('wallet.account_name')}:
                                    <Input.Group className='d-flex'>
                                        <Input
                                            disabled
                                            value={bankAccount.ACCOUNT_NAME}
                                            style={{
                                                background: 'unset',
                                                color: 'unset'
                                            }}
                                        />
                                        <Tooltip title='copy'>
                                            <CopyToClipboard
                                                text={bankAccount.ACCOUNT_NAME}
                                            >
                                                <Button
                                                    icon={<CopyOutlined />}
                                                />
                                            </CopyToClipboard>
                                        </Tooltip>
                                    </Input.Group>
                                </div>
                                <div className='mb-2'>
                                    {getTranslateText('wallet.amount2')}:
                                    <Input.Group className='d-flex'>
                                        <InputNumber
                                            disabled
                                            value={bankAccount.AMOUNT}
                                            style={{
                                                background: 'unset',
                                                color: 'unset',
                                                width: '100%'
                                            }}
                                            formatter={(value) =>
                                                `${value}`.replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                )
                                            }
                                        />
                                        <Tooltip title='copy'>
                                            <CopyToClipboard
                                                text={bankAccount.AMOUNT}
                                            >
                                                <Button
                                                    icon={<CopyOutlined />}
                                                />
                                            </CopyToClipboard>
                                        </Tooltip>
                                    </Input.Group>
                                </div>
                                <div className='mb-2'>
                                    {getTranslateText('wallet.code')}:
                                    <Input.Group className='d-flex'>
                                        <Input
                                            disabled
                                            value={bankAccount.DESCRIPTION}
                                            style={{
                                                background: 'unset',
                                                color: 'unset'
                                            }}
                                        />

                                        <Tooltip title='copy'>
                                            <CopyToClipboard
                                                text={bankAccount.DESCRIPTION}
                                            >
                                                <Button
                                                    icon={<CopyOutlined />}
                                                />
                                            </CopyToClipboard>
                                        </Tooltip>
                                    </Input.Group>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    )
}

export default Wallet
