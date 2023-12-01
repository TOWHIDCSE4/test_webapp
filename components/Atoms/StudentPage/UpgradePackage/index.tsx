import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PackageAPI from 'api/PackageAPI'
import { notify } from 'contexts/Notification'
import _ from 'lodash'
import { Empty, Input, Pagination, Select, Space, Spin } from 'antd'
import * as store from 'helpers/storage'
import { getTranslateText } from 'utils/translate-utils'
import Cart from 'components/Atoms/Cart'
import { EnumPackageType, IPackage } from 'types'
import LocationAPI from 'api/LocationAPI'
import BlockHeader from '../BlockHeader'
import PackageCard from '../PackageCard'

const { Option } = Select

const UpgradePackage = () => {
    const router = useRouter()
    const [packages, setPackages] = useState<IPackage[]>([])
    const [location, setLocation] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [selectedPackages, setSelectedPackages] = useState<IPackage[]>([])
    const [query, setQuery] = useState({
        page_size: 10,
        page_number: 1,
        search: '',
        location_id: '',
        type: ''
    })
    let timer = null
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const getAllPackages = (query) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            setQuery(query)
            setLoading(true)
            query.is_show_on_student_page = true
            PackageAPI.getPackages(query)
                .then((res) => {
                    setPackages(res.data)
                    if (res.pagination && res.pagination.total >= 0) {
                        setTotal(res.pagination.total)
                    }
                })
                .catch((err) => {
                    notify('error', err.message)
                })
                .finally(() => setLoading(false))
        }, 800)
    }
    const getLocations = async () => {
        const res = await LocationAPI.getLocations()
        if (res) {
            setLocation(res.data)
        }
    }

    const handleChangePagination = (_pageNumber, _pageSize) => {
        getAllPackages({
            ...query,
            page_size: _pageSize,
            page_number: _pageNumber
        })
    }

    useEffect(() => {
        const selected_package = store.get('selected_package')
        if (selected_package && selected_package.length > 0) {
            setSelectedPackages(selected_package)
        }
        getLocations()
    }, [])

    useEffect(() => {
        getAllPackages(query)
    }, [])

    const handleSelectPackage = (item: IPackage) => {
        const newSelected = [...selectedPackages]
        newSelected.push(item)
        setSelectedPackages(newSelected)
    }

    const handleCheckout = () => {
        store.set('selected_package', selectedPackages)
        router.push('/student/payment', undefined, { shallow: true })
    }
    const renderPackageCard = () => {
        if (_.isEmpty(packages)) return <Empty />
        return packages.map((item, index) => (
            <div key={index} className='mb-3'>
                <PackageCard
                    key={index}
                    data={item}
                    onSelectPackage={handleSelectPackage}
                />
            </div>
        ))
    }
    const searchByName = (val) => {
        getAllPackages({ ...query, search: val.target.value, page_number: 1 })
    }
    const searchByType = (val) => {
        getAllPackages({ ...query, type: val, page_number: 1 })
    }
    const searchByLocation = (val) => {
        getAllPackages({ ...query, location_id: val, page_number: 1 })
    }
    const searchByNumberClass = (val) => {
        getAllPackages({
            ...query,
            number_class: val.target.value,
            page_number: 1
        })
    }
    return (
        <>
            <BlockHeader title={getTranslateText('student.package.upgrade')} />
            <div className='d-flex justify-content-end mb-3 mt-3'>
                <Input
                    placeholder={getTranslateText(
                        'student.package_card.search'
                    )}
                    style={{ width: 200 }}
                    onKeyUp={searchByName}
                />
                <Input
                    type='number'
                    placeholder={getTranslateText(
                        'student.package_card.number_class'
                    )}
                    style={{ width: 200 }}
                    onKeyUp={searchByNumberClass}
                    className='ml-2'
                />

                <Select
                    className='ml-2'
                    style={{ width: 200 }}
                    placeholder={getTranslateText(
                        'student.package_card.filter_type'
                    )}
                    onChange={searchByType}
                >
                    <Option value=''>All</Option>
                    <Option value={EnumPackageType.STANDARD}>
                        {_.findKey(
                            EnumPackageType,
                            (o) => o === EnumPackageType.STANDARD
                        )}
                    </Option>
                    <Option value={EnumPackageType.PREMIUM}>
                        {_.findKey(
                            EnumPackageType,
                            (o) => o === EnumPackageType.PREMIUM
                        )}
                    </Option>
                    <Option value={EnumPackageType.TRIAL}>
                        {_.findKey(
                            EnumPackageType,
                            (o) => o === EnumPackageType.TRIAL
                        )}
                    </Option>
                </Select>
                <Select
                    className='ml-2'
                    style={{ width: 200 }}
                    placeholder={getTranslateText(
                        'student.package_card.filter_location'
                    )}
                    onChange={searchByLocation}
                >
                    {location.map((e, index) => (
                        <Option value={e.id}>{e.name}</Option>
                    ))}
                </Select>
            </div>

            {isLoading ? (
                <div className='mt-3 d-flex justify-content-center'>
                    <Spin spinning={isLoading} size='large' />
                </div>
            ) : (
                renderPackageCard()
            )}

            {!isLoading && total > 0 && (
                <div className='mb-3 d-flex justify-content-end'>
                    <Pagination
                        defaultCurrent={query.page_number}
                        pageSize={query.page_size}
                        total={total}
                        onChange={handleChangePagination}
                    />
                </div>
            )}
            {selectedPackages.length > 0 && (
                <Cart packages={selectedPackages} onCheckout={handleCheckout} />
            )}
        </>
    )
}

export default UpgradePackage
