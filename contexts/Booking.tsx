import { useContext, createContext, useState } from 'react'
import moment from 'moment'

interface IBookingContext {
    rangePickerValue: number[]
    setRangePickerValue: (newValue: number[]) => void
}

const BookingContext = createContext<Partial<IBookingContext>>({
    rangePickerValue: [],
    setRangePickerValue: (val: number[]) => {}
})

const BookingProvider: React.FC = (props) => {
    const { children } = props

    const [rangePickerValue, setRangePickerValue] = useState([
        moment().endOf('day').valueOf(),
        moment().add(7, 'days').endOf('day').valueOf()
    ])

    return (
        <BookingContext.Provider
            value={{
                rangePickerValue,
                setRangePickerValue
            }}
        >
            {children}
        </BookingContext.Provider>
    )
}

export default BookingProvider

export const useBookingContext = () => useContext(BookingContext)
