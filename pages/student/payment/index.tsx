/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-prototype-builtins */
import React, { useRef, useReducer, useEffect, useState } from 'react'
import Layout from 'components/Atoms/StudentPage/Layout'
import swal from 'sweetalert'
import { useRouter } from 'next/router'
import { IPackage } from 'types'
import _, { debounce } from 'lodash'
import { InputNumber, Modal, Input, notification, Button } from 'antd'
import { POINT_VND_RATE } from 'const'
import ConfirmModal from 'components/Atoms/ConfirmModal'
import { getTranslateText } from 'utils/translate-utils'
import CouponAPI from 'api/CouponAPI'
import WalletAPI from 'api/WalletAPI'
import { notify } from 'contexts/Notification'
import Link from 'next/link'
import OrderAPI from '../../../api/OrderAPI'
import * as store from '../../../helpers/storage'
import { toReadablePrice } from '../../../utils/price-utils'

const Payment = ({ ...props }) => {
    const router = useRouter()
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isLoading: false,
            payment_method: '',
            promo_code: '',
            selected_package: {},
            total_bill: 0,
            is_success: true,
            coupon: null
        }
    )

    const [selectedPackages, setSelectedPackages] = useState<IPackage[]>([])
    const [subTotal, setSubTotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [balance, setBalance] = useState(0.0)

    useEffect(() => {
        const selected_package = store.get('selected_package')
        if (selected_package && selected_package.length > 0) {
            const boughtPackages = []
            _.forEach(selected_package, (p) => {
                const checkExists = _.findIndex(
                    boughtPackages,
                    (o) => o.package_id === p.id
                )
                if (checkExists >= 0) {
                    boughtPackages[checkExists].amount++
                } else {
                    boughtPackages.push({
                        package_id: p.id,
                        ...p,
                        amount: 1
                    })
                }
            })
            setSelectedPackages(boughtPackages)
            setSubTotal(selected_package.reduce((s, v) => (s += v.price), 0))
        }
        fetchBalance()
    }, [])

    useEffect(() => {
        setValues({
            total_bill: subTotal / POINT_VND_RATE - discount / POINT_VND_RATE
        })
    }, [subTotal, discount])

    const onSelectPaymentMethod = (value) => {
        setValues({ payment_method: value })
    }
    const onPay = () => {
        const order_info = {
            package_list: selectedPackages,
            coupon_code: values.coupon?.code
        }
        setValues({ isLoading: true })
        OrderAPI.createOrder(order_info)
            .then((res) => {
                setValues({ isLoading: false })
                swal({
                    title: getTranslateText('payment.purchase_success'),
                    text: getTranslateText(
                        'payment.purchase_success_description'
                    ),
                    icon: 'success',
                    closeOnClickOutside: false
                }).then((value) => {
                    store.clear('selected_package')
                    router.push('/student/my-packages')
                })
            })
            .catch((err) => {
                setValues({ isLoading: false })
                swal({
                    title: getTranslateText('payment.purchase_fail'),
                    text: err.message,
                    icon: 'error',
                    closeOnClickOutside: false
                })
            })
    }

    const fetchBalance = async () => {
        WalletAPI.getBalance()
            .then((res) => {
                setBalance(res.balance)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const onChangeAmount = (id, type) => {
        if (type === 'UP') {
            const _index = _.findIndex(selectedPackages, (o) => o.id === id)
            if (_index >= 0) {
                const newSelected = [...selectedPackages]
                newSelected[_index].amount++
                setSelectedPackages(newSelected)
                setSubTotal(
                    newSelected.reduce((s, v) => (s += v.price * v.amount), 0)
                )
                store.set('selected_package', newSelected)
            }
        }
        if (type === 'DOWN') {
            const _index = _.findIndex(selectedPackages, (o) => o.id === id)
            if (_index >= 0) {
                const newSelected = [...selectedPackages]
                if (newSelected[_index].amount > 0) {
                    newSelected[_index].amount--
                }
                if (newSelected[_index].amount === 0) {
                    Modal.confirm({
                        title: 'Confirm',
                        content: 'Are you sure remove item in your cart?',
                        okText: 'Ok',
                        cancelText: 'Cancel',
                        onOk: () => {
                            _.remove(newSelected, (o) => o.amount === 0)
                            setSelectedPackages(newSelected)
                            setSubTotal(
                                newSelected.reduce(
                                    (s, v) => (s += v.price * v.amount),
                                    0
                                )
                            )
                            store.set('selected_package', newSelected)
                        }
                    })
                } else {
                    setSelectedPackages(newSelected)
                    setSubTotal(
                        newSelected.reduce(
                            (s, v) => (s += v.price * v.amount),
                            0
                        )
                    )
                    store.set('selected_package', newSelected)
                }
            }
        }
    }
    const onRemove = (id) => {
        const _index = _.findIndex(selectedPackages, (o) => o.id === id)
        if (_index >= 0) {
            const newSelected = [...selectedPackages]
            newSelected[_index].amount = 0
            Modal.confirm({
                title: 'Confirm',
                content: 'Are you sure remove item in your cart?',
                okText: 'Ok',
                cancelText: 'Cancel',
                onOk: () => {
                    _.remove(newSelected, (o) => o.amount === 0)
                    setSelectedPackages(newSelected)
                    setSubTotal(
                        newSelected.reduce(
                            (s, v) => (s += v.price * v.amount),
                            0
                        )
                    )
                    store.set('selected_package', newSelected)
                }
            })
        }
    }
    const renderListPackage = () => {
        if (setSelectedPackages.length > 0) {
            return selectedPackages.map((item, index) => (
                <div
                    className='ispeak-pannel payCredit banker-wrap'
                    key={item.id}
                >
                    <div className='banker-item'>
                        <div className='banker-item-left'>
                            <span>
                                <strong>
                                    {getTranslateText('payment.package_name')}
                                </strong>
                            </span>
                        </div>
                        <div className='banker-item-right'>{item.name}</div>
                    </div>
                    <div className='banker-item'>
                        <div className='banker-item-left'>
                            <span>
                                <strong>
                                    {getTranslateText('payment.price')}
                                </strong>
                            </span>
                        </div>
                        <div className='banker-item-right'>
                            {toReadablePrice(item.price / POINT_VND_RATE)}{' '}
                            {getTranslateText('point')}
                        </div>
                    </div>
                    <div className='banker-item'>
                        <div className='banker-item-left'>
                            <span>
                                <strong>
                                    {getTranslateText('payment.discount')}
                                </strong>
                            </span>
                        </div>
                        <div className='banker-item-right'>
                            {item.discount} %
                        </div>
                    </div>
                    <div className='banker-item'>
                        <div className='banker-item-left'>
                            <span>
                                <strong>
                                    {getTranslateText(
                                        'payment.learn_with_teacher'
                                    )}
                                </strong>
                            </span>
                        </div>
                        <div className='banker-item-right'>
                            {item.location_id === -1
                                ? getTranslateText('payment.all_teacher')
                                : item.location.name}
                        </div>
                    </div>
                    <div className='banker-item'>
                        <div className='banker-item-left'>
                            <span>
                                <strong>
                                    {getTranslateText('payment.duration')}
                                </strong>
                            </span>
                        </div>
                        <div className='banker-item-right'>
                            {item.day_of_use} {getTranslateText('payment.days')}
                        </div>
                    </div>
                    <div className='banker-item'>
                        <div className='banker-item-left'>
                            <span>
                                <strong>
                                    {getTranslateText('payment.amount')}
                                </strong>
                            </span>
                        </div>
                        <div className='banker-item-right'>
                            <InputNumber
                                addonBefore={
                                    <span
                                        className='clickable w-100 p-2'
                                        onClick={() =>
                                            onChangeAmount(item.id, 'DOWN')
                                        }
                                    >
                                        -
                                    </span>
                                }
                                addonAfter={
                                    <span
                                        className='clickable  w-100 p-2'
                                        onClick={() =>
                                            onChangeAmount(item.id, 'UP')
                                        }
                                    >
                                        +
                                    </span>
                                }
                                min={1}
                                max={10}
                                defaultValue={item.amount}
                                value={item.amount}
                                style={{ width: '100px' }}
                                controls={false}
                            />
                        </div>
                    </div>
                    <div className='banker-item'>
                        <div className='banker-item-left'></div>
                        <div className='banker-item-right'>
                            <Button
                                type='default'
                                onClick={() => onRemove(item.id)}
                            >
                                {getTranslateText('Remove')}
                            </Button>
                        </div>
                    </div>
                </div>
            ))
        }
    }

    const checkCoupon = async (v) => {
        CouponAPI.checkCoupon({ code: v })
            .then((data) => {
                notification.success({
                    message: 'Success',
                    description: getTranslateText('payment.valid_coupon')
                })
                setValues({ coupon: data })
            })
            .catch((err) => {
                notification.error({
                    message: 'Error',
                    description: err.message
                })
            })
    }

    const applyCoupon = async () => {
        setDiscount((subTotal * values.coupon.percentage_off) / 100)
    }

    return (
        <Layout>
            <div className='payment_container'>
                {selectedPackages.length > 0 ? (
                    <>
                        <div className='payment_left'>
                            {renderListPackage()}
                            <div className='ispeak-pannel Coupon-desktop'>
                                <div className='ant-radio-group ant-radio-group-outline'>
                                    <div className='flex-row-between promo-code'>
                                        <div className='conpon-radio h5'>
                                            <span>
                                                {getTranslateText(
                                                    'payment.promo_code'
                                                )}
                                            </span>
                                        </div>
                                        <div className='promo-code-container'>
                                            <div className='promo-redeem border-gray5'>
                                                <div className='promo-redeem-input'>
                                                    <div className='undefined Text-container'>
                                                        <Input
                                                            type='text'
                                                            className='text-common undefined text-noBorder h-10 undefined'
                                                            placeholder='Please enter your code'
                                                            autoComplete='off'
                                                            onChange={debounce(
                                                                (e) =>
                                                                    checkCoupon(
                                                                        e.target
                                                                            .value
                                                                    ),
                                                                500
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        applyCoupon()
                                                    }
                                                    type='button'
                                                    className='ant-btn ant-btn-default border-none'
                                                >
                                                    <span>
                                                        {getTranslateText(
                                                            'payment.apply'
                                                        )}
                                                    </span>
                                                </button>
                                            </div>
                                            <div className='promo-code-error mt-1' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='payment_right'>
                            <div className='ispeak-pannel payment_payTotal'>
                                <div className='total_section'>
                                    <div className='total_product'>
                                        <svg
                                            width='48'
                                            height='48'
                                            viewBox='0 0 82 82'
                                        >
                                            <title>
                                                {getTranslateText(
                                                    'payment.group'
                                                )}
                                            </title>
                                            <desc>
                                                {getTranslateText(
                                                    'payment.created_with_sketch'
                                                )}
                                            </desc>
                                            <defs />
                                            <g
                                                id='6.-BOOKING-FLOW'
                                                stroke='none'
                                                strokeWidth='1'
                                                fill='none'
                                                fillRule='evenodd'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            >
                                                <g
                                                    id='6.5.Confirmation---buy-credits-normal-case---desktop'
                                                    transform='translate(-599.000000, -157.000000)'
                                                    stroke='#333333'
                                                    strokeWidth='1.5'
                                                >
                                                    <g
                                                        id='Group'
                                                        transform='translate(600.000000, 158.000000)'
                                                    >
                                                        <path
                                                            d='M80,40 C80,62.0906667 62.0906667,80 40,80 C17.9093333,80 0,62.0906667 0,40 C0,17.9093333 17.9093333,0 40,0 C62.0906667,0 80,17.9093333 80,40 Z'
                                                            id='Stroke-1'
                                                        />
                                                        <path
                                                            d='M62.5573333,15.1666667 C63.552,16.068 64.488,17.0306667 65.368,18.0466667'
                                                            id='Stroke-3'
                                                        />
                                                        <path
                                                            d='M73.548,40 C73.548,58.528 58.5293333,73.5493333 39.9986667,73.5493333 C21.4706667,73.5493333 6.452,58.528 6.452,40 C6.452,21.472 21.4706667,6.45066667 39.9986667,6.45066667 C45.3773333,6.45066667 50.46,7.71733333 54.964,9.96533333'
                                                            id='Stroke-5'
                                                        />
                                                        <path
                                                            d='M48.1704,28.5624 C48.1704,24.0504 44.5117333,20.3917333 39.9997333,20.3917333 C35.4877333,20.3917333 31.8317333,24.0504 31.8317333,28.5624 C31.8317333,31.2024 33.1784,33.4290667 35.0237333,35.0424 C37.7384,37.4157333 42.6370667,42.7330667 45.2717333,45.1970667 C46.9677333,46.7810667 48.1704,48.9357333 48.1704,51.4370667 C48.1704,55.9517333 44.5117333,59.6077333 39.9997333,59.6077333 C35.4877333,59.6077333 31.8317333,55.9517333 31.8317333,51.4370667'
                                                            id='Stroke-7'
                                                        />
                                                        <path
                                                            d='M40,20.392 L40,16.4693333'
                                                            id='Stroke-9'
                                                        />
                                                        <path
                                                            d='M40,63.5298667 L40,59.6072'
                                                            id='Stroke-11'
                                                        />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                        <div className='total_productInfo '>
                                            <p className='callout-small total_productTitle'>
                                                <span>
                                                    {getTranslateText(
                                                        'payment.englishplus_credits'
                                                    )}
                                                </span>
                                            </p>
                                            <div className='ispeak-blackbar' />
                                        </div>
                                    </div>
                                </div>

                                <div className='total_priceInfo'>
                                    <div className='total_item'>
                                        <p className='callout-small'>
                                            <span>
                                                {getTranslateText(
                                                    'payment.avaiable_balance'
                                                )}
                                            </span>
                                        </p>
                                        <p className='total_number'>
                                            {toReadablePrice(balance)}{' '}
                                            {getTranslateText('point')}
                                        </p>
                                    </div>
                                    <div className='total_item'>
                                        <p className='callout-small'>
                                            <span>
                                                {getTranslateText(
                                                    'payment.sub_total'
                                                )}
                                            </span>
                                        </p>
                                        <p className='total_number'>
                                            {toReadablePrice(
                                                subTotal / POINT_VND_RATE
                                            )}{' '}
                                            {getTranslateText('point')}
                                        </p>
                                    </div>
                                    <div className='total_item'>
                                        <p className='callout-small'>
                                            <span>
                                                {getTranslateText(
                                                    'payment.discount'
                                                )}
                                            </span>
                                        </p>
                                        <p className='total_number'>
                                            {toReadablePrice(
                                                discount / POINT_VND_RATE
                                            )}{' '}
                                            {getTranslateText('point')}
                                        </p>
                                    </div>
                                </div>
                                <div className='total_total'>
                                    <p className='callout-small'>
                                        <span>
                                            {getTranslateText('payment.total')}
                                        </span>
                                    </p>
                                    <p className='total_totalNumber'>
                                        {toReadablePrice(values.total_bill)}{' '}
                                        {getTranslateText('point')}
                                    </p>
                                </div>
                                {values.total_bill > balance ? (
                                    <div className='total_total'>
                                        <p className='text-danger'>
                                            {getTranslateText(
                                                'wallet.not_enough'
                                            )}
                                            <Link href='/student/wallet'>
                                                <a className='ml-1'>
                                                    {getTranslateText(
                                                        'wallet.deposit_now'
                                                    )}
                                                </a>
                                            </Link>
                                        </p>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <div className='payBtn_btn'>
                                    <button
                                        disabled={
                                            values.isLoading ||
                                            values.total_bill > balance
                                        }
                                        type='button'
                                        className='ant-btn ant-btn-danger'
                                        // onClick={onPay}
                                        onClick={() =>
                                            ConfirmModal({
                                                content: `${getTranslateText(
                                                    'payment.confirm_order'
                                                )} ${toReadablePrice(
                                                    (subTotal - discount) /
                                                        POINT_VND_RATE
                                                )} ${getTranslateText(
                                                    'point'
                                                )}`,
                                                onOk: onPay
                                            })
                                        }
                                    >
                                        <span>
                                            {getTranslateText(
                                                'payment.make_order'
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='row m-auto'>
                        <div
                            className='alert alert-warning alert-outline-coloured alert-dismissible'
                            role='alert'
                        >
                            <div className='alert-icon'>
                                <i className='far fa-fw fa-bell' />
                            </div>
                            <div
                                className='alert-message'
                                style={{ width: 200 }}
                            >
                                <strong>
                                    {getTranslateText('payment.no_item')}
                                </strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style jsx global>{`
                .payment_container {
                    position: relative;
                    display: -webkit-flex;
                    display: flex;
                    margin: 0 auto;
                    padding: 0 15px 250px;
                    max-width: 1160px;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    padding-bottom: 0;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                }
                .payment_left {
                    margin-top: 3px;
                    width: 100%;
                }
                @media (min-width: 1199px) {
                    .payment_left {
                        margin-top: 0;
                        max-width: 752px;
                    }
                }
                .ispeak-pannel {
                    margin-bottom: 25px;
                    padding: 0 30px;
                    background: #fff;
                    box-shadow: 0 1px 8px rgb(0 0 0 / 10%);
                    border-radius: 8px;
                }
                .payCredit {
                    padding-top: 20px;
                    padding-bottom: 20px;
                }
                .payment_left > div {
                    box-shadow: 0 2px 12px rgb(0 40 117 / 6%);
                    border-radius: 4px;
                }
                .payCredit .creditTitle {
                    margin-bottom: 10px;
                    font-size: 18px;
                    font-weight: 300;
                }
                @media (min-width: 767px) {
                    .payCredit .creditTitle {
                        margin: 10px 0 25px;
                        font-size: 23px;
                        text-align: center;
                    }
                }
                .ant-radio-group {
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    color: #4d4d4d;
                    font-size: 14px;
                    font-variant: normal;
                    line-height: 1.5715;
                    list-style: none;
                    -webkit-font-feature-settings: normal;
                    font-feature-settings: normal;
                    display: inline-block;
                    line-height: unset;
                }
                .Coupon-desktop .ant-radio-group,
                .Coupon-mobile .ant-radio-group,
                .Coupon-tablet .ant-radio-group {
                    width: 100%;
                }
                .flex-row-between {
                    -webkit-flex-direction: row;
                    flex-direction: row;
                }
                .flex-col-between,
                .flex-row-between {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .Coupon-desktop .promo-code,
                .Coupon-mobile .promo-code,
                .Coupon-tablet .promo-code {
                    padding: 24px 0;
                    border-bottom: 1px solid #ddd;
                }
                .Coupon-desktop .promo-code,
                .Coupon-desktop .use-coupon-box {
                    margin: 0 -30px;
                    padding-left: 30px;
                    padding-right: 30px;
                }
                .Coupon-desktop .conpon-radio,
                .Coupon-mobile .conpon-radio,
                .Coupon-tablet .conpon-radio {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                    font-weight: bold !important;
                }
                .h4,
                .h5 {
                    color: #333;
                    font-weight: 500;
                }
                .h5 {
                    font-size: 20px;
                    line-height: 28px;
                }
                .Coupon-desktop .promo-code-container,
                .Coupon-mobile .promo-code-container,
                .Coupon-tablet .promo-code-container {
                    display: -webkit-flex;
                    display: flex;
                    width: 300px;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    -webkit-align-items: flex-end;
                    align-items: flex-end;
                }
                .border-gray5 {
                    opacity: 1;
                    border-color: #d9d9d9;
                    border-color: rgba(217, 217, 217, 1);
                }
                .Coupon-desktop .promo-redeem,
                .Coupon-mobile .promo-redeem,
                .Coupon-tablet .promo-redeem {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    max-width: 300px;
                    width: 100%;
                    border-width: 1px;
                    border-style: solid;
                    border-radius: 4px;
                    -webkit-align-items: center;
                    align-items: center;
                    background: #fff;
                }
                .Coupon-desktop .promo-code-error,
                .Coupon-mobile .promo-code-error,
                .Coupon-tablet .promo-code-error {
                    font-size: 13px;
                    line-height: 15px;
                    color: #cb242b;
                    max-width: 300px;
                    width: 100%;
                }
                .Coupon-desktop .promo-redeem .promo-redeem-input,
                .Coupon-mobile .promo-redeem .promo-redeem-input,
                .Coupon-tablet .promo-redeem .promo-redeem-input {
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    height: 40px;
                    margin-right: 5px;
                }
                .text-common {
                    display: inline-block;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                    height: 42px;
                    padding: 13px 15px;
                    border: 1px solid #ccc;
                    outline: none;
                    color: #333;
                }
                .h-10 {
                    height: 40px;
                }
                .text-common.text-noBorder {
                    border: none;
                }
                .Coupon-desktop .promo-redeem .promo-redeem-input input,
                .Coupon-mobile .promo-redeem .promo-redeem-input input,
                .Coupon-tablet .promo-redeem .promo-redeem-input input {
                    width: 100%;
                    border-radius: 4px;
                }
                .ant-btn,
                .ant-btn:active,
                .ant-btn:focus {
                    outline: 0;
                }
                .ant-btn-default {
                    color: #4d4d4d;
                    background-color: #fff;
                    border-color: #d9d9d9;
                }
                .border-none {
                    border-style: none;
                }
                .ant-btn > i,
                .ant-btn > span {
                    display: inline-block;
                    -webkit-transition: margin-left 0.3s
                        cubic-bezier(0.645, 0.045, 0.355, 1);
                    transition: margin-left 0.3s
                        cubic-bezier(0.645, 0.045, 0.355, 1);
                    pointer-events: none;
                    font-weight: bold;
                }
                .paymentForm_container__2qRpy {
                    position: relative;
                    min-height: 200px;
                }
                .paymentForm_country {
                    display: -webkit-flex;
                    display: flex;
                    margin: 0 -15px;
                    padding: 15px;
                    -webkit-align-items: center;
                    align-items: center;
                    border-bottom: 1px solid #ddd;
                }
                @media (min-width: 1199px) {
                    .paymentForm_country {
                        margin: 0 -30px;
                        padding: 30px 30px 25px;
                    }
                }
                .headline {
                    font-size: 23px;
                    font-weight: 300;
                }
                @media (min-width: 1199px) {
                    .paymentForm_country h1 {
                        display: -webkit-flex;
                        display: flex;
                        -webkit-justify-content: space-between;
                        justify-content: space-between;
                        -webkit-align-items: center;
                        align-items: center;
                        margin-right: 20px;
                    }
                }
                .paymentForm_country h1 {
                    -webkit-flex: 1 1;
                    flex: 1 1;
                }
                @media (min-width: 1199px) {
                    .paymentForm_country h1 span:first-child {
                        font-size: 20px;
                        font-weight: bold;
                        line-height: 28px;
                        color: #333;
                        margin-bottom: 0;
                    }
                }
                .paymentForm_radiosWidth {
                    width: 100%;
                }
                .paymentForm_radio_item__1 {
                    margin: 0 -30px;
                }
                .PayItemRadio_option {
                    margin: 0 30px;
                    border-bottom: 1px solid #ddd;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                }
                .PayItemRadio_option,
                .PayItemRadio_option_padding {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .PayItemRadio_option,
                .PayItemRadio_option_padding {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .PayItemRadio_option_padding {
                    width: calc(100% + 20px);
                    padding: 10px 15px;
                    -webkit-justify-content: center;
                    justify-content: center;
                    margin: 13px -10px;
                }
                .PayItemRadio_option_padding_desk:hover {
                    background: #f7f7fa;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .w-full {
                    width: 100%;
                }
                .PayItemRadio_top_item {
                    width: 100%;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                }
                .PayItemRadio_pay_item {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .PayItemRadio_name_desc {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    margin-left: 8px;
                    margin-bottom: 0;
                }
                .ant-radio-wrapper {
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    padding: 0;
                    color: #4d4d4d;
                    font-size: 14px;
                    font-variant: normal;
                    line-height: 1.5715;
                    list-style: none;
                    -webkit-font-feature-settings: normal;
                    font-feature-settings: normal;
                    position: relative;
                    display: inline-block;
                    margin: 0 8px 0 0;
                    white-space: nowrap;
                    cursor: pointer;
                }
                .PayItemRadio_radio {
                    margin-left: 25px;
                    font-size: 14px !important;
                }
                .ant-radio {
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    color: #4d4d4d;
                    font-size: 14px;
                    font-variant: normal;
                    line-height: 1.5715;
                    list-style: none;
                    -webkit-font-feature-settings: normal;
                    font-feature-settings: normal;
                    position: relative;
                    display: inline-block;
                    line-height: 1;
                    white-space: nowrap;
                    vertical-align: sub;
                    outline: none;
                    cursor: pointer;
                }
                .PayItemRadio_name > span {
                    font-size: 16px;
                    font-weight: 400;
                    color: #333;
                }
                .payment_right {
                    position: fixed;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                }
                @media (min-width: 1199px) {
                    .payment_right {
                        position: static;
                        padding-left: 20px;
                        max-width: 367px;
                    }
                }
                .payment_right > div {
                    box-shadow: 0 2px 12px rgb(0 40 117 / 6%);
                    border-radius: 4px;
                }
                @media (min-width: 1199px) {
                    .payment_right .payment_payTotal {
                        position: -webkit-sticky;
                        position: sticky;
                        top: 40px;
                    }
                }
                .total_section {
                    display: block;
                }
                .total_product {
                    display: -webkit-flex;
                    display: flex;
                    margin: 0 -30px;
                    padding: 30px;
                    border-bottom: 1px solid #ddd;
                }
                .total_productInfo {
                    margin-left: 20px;
                }
                .callout-small {
                    font-size: 16px;
                }
                .total_productTitle {
                    margin-bottom: 10px;
                    font-weight: 500;
                }
                .ispeak-blackbar {
                    width: 10px;
                    height: 1px;
                    background-color: #333;
                }
                .total_productTitle + div {
                    margin-bottom: 10px;
                }
                .subhead {
                    font-size: 14px;
                }
                .total_priceInfo {
                    padding: 20px 0;
                }
                @media (min-width: 1199px) {
                    .total_priceInfo {
                        border-bottom: 1px solid #ddd;
                    }
                }
                .total_item {
                    display: -webkit-flex;
                    display: flex;
                    margin-bottom: 20px;
                }
                .total_coupon,
                .total_number,
                .total_totalNumber {
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    font-size: 16px;
                    text-align: right;
                }
                .total_support {
                    margin-left: 10px;
                    vertical-align: text-bottom;
                }
                .total_total {
                    display: none;
                    padding: 20px 0;
                }
                @media (min-width: 1199px) {
                    .total_total {
                        display: -webkit-flex;
                        display: flex;
                    }
                }
                .total_totalNumber {
                    font-weight: 500;
                    line-height: 1.5;
                }
                .payBtn_btn {
                    padding: 0;
                }
                @media (min-width: 1199px) {
                    .payBtn_btn {
                        padding-bottom: 20px;
                    }
                }
                .payBtn_btn button {
                    width: 100%;
                }
                .banker-wrap .banker-item {
                    border-top: 1px solid #ddd;
                    padding: 7px 0;
                    min-height: 55px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .banker-wrap .banker-item .banker-item-left {
                    color: #777;
                    width: 30%;
                    display: inline-block;
                }
                .banker-wrap .banker-item .banker-item-right {
                    text-align: right;
                    height: 100%;
                    width: 70%;
                    font-size: 14px;
                    display: inline-block;
                }
                .ant-input-number-group-addon {
                    padding: 0;
                }
                .banker-wrap .banker-bottom {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #777;
                }
            `}</style>
        </Layout>
    )
}

export const getInitialProps = async () => {
    const data = []
    return {
        props: { data } // will be passed to the page component as props
    }
}

export default Payment
