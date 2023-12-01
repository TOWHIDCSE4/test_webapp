import { FC, memo, useState } from 'react'
import { Button } from 'antd'
import cn from 'classnames'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { IPackage } from 'types'
import { toReadablePrice } from 'utils/price-utils'
import styles from './Cart.module.scss'

type Props = {
    packages: IPackage[]
    onCheckout: () => void
}

const Cart: FC<Props> = ({ packages, onCheckout }) => {
    const [loading, setLoading] = useState()

    return (
        <div>
            <div className={cn(styles.sticky)}>
                <div className={cn(styles['float-btn'])}>
                    <div className='d-flex'>
                        <div className='mc-floating-button__wrapper'>
                            {/* <Button className='gb-btn mc-floating-button__dots gb-btn--link'>
                                View Item
                            </Button> */}
                            <div className={cn(styles['container-price'])}>
                                <div className={cn(styles['wrapper-price'])}>
                                    <span className={cn(styles['count-items'])}>
                                        {packages.length} item
                                    </span>
                                    <span className={cn(styles['total-price'])}>
                                        {toReadablePrice(
                                            packages.reduce(
                                                (s, v) => (s += v.price),
                                                0
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button
                            className={cn(styles['btn-checkout'])}
                            type='primary'
                            onClick={onCheckout}
                        >
                            <ShoppingCartOutlined />
                            <span className='ml-2'>Checkout</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Cart)
