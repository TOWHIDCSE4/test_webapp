import React, { useState, useRef, useMemo, useEffect, memo } from 'react'
import { Select, Spin } from 'antd'
import { SelectProps } from 'antd/es/select'
import debounce from 'lodash/debounce'

interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>
    debounceTimeout?: number
    initialFetch?: boolean
}

function DebounceSelect<
    OptionType extends {
        key?: string
        label: React.ReactNode
        value: string | number
    } = any
>({
    fetchOptions,
    debounceTimeout = 300,
    initialFetch = true,
    ...props
}: DebounceSelectProps) {
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState<OptionType[]>([])
    const fetchRef = useRef(0)

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1
            const fetchId = fetchRef.current
            setOptions([])
            setFetching(true)

            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return
                }

                setOptions(newOptions)
                setFetching(false)
            })
        }

        return debounce(loadOptions, debounceTimeout)
    }, [fetchOptions, debounceTimeout])

    useEffect(() => {
        debounceFetcher.cancel()
    }, [debounceFetcher])

    useEffect(() => {
        if (initialFetch) {
            debounceFetcher('')
            debounceFetcher.flush()
        }
        return () => {
            debounceFetcher.cancel()
        }
    }, [])

    return (
        <Select<OptionType>
            showSearch={props.showSearch}
            filterOption={false}
            onSearch={props.showSearch && debounceFetcher}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            {...props}
            options={options}
        />
    )
}
export default memo(DebounceSelect)
