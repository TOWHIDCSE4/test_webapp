export function toReadablePrice(price, divider = ',') {
    let _price: any = price || 0
    _price = (Math.round(_price * 100) / 100).toFixed(2)
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })
    return formatter.format(_price)
}
