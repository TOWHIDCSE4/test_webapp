/* eslint-disable no-restricted-syntax */
import React, { useReducer, useEffect } from 'react'
import moment from 'moment'
import Availability from './components/Availability'
import From from './components/From'
import LocationAPI from '../../../../../api/LocationAPI'
import SubjectAPI from '../../../../../api/SubjectAPI'
import { notify } from '../../../../../contexts/Notification'
import Subject from './components/Subject'
import { delay } from '../../../../../utils/timeout-utils'

export default function SearchAndFilter(props) {
    const [values, setValues] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isShownDropdown: {
                from: false,
                availability: false,
                category: false,
                subject: false
            },
            locations: [],
            subjects: [],
            isLoading: true,
            isShownOverlay: false,
            filter: {
                location_ids: [],
                subject_ids: [],
                keyword: '',
                calendar: {
                    start_time: '',
                    end_time: '',
                    hour_of_day: '',
                    day_of_week: '',
                    timezone_offset: -7
                }
            }
        }
    )

    const _getLocations = () => {
        setValues({ isLoading: true })
        LocationAPI.getLocations()
            .then((res) => {
                setValues({ isLoading: false, locations: res.data })
            })
            .catch((err) => {
                setValues({ isLoading: false })
                notify('error', err.message)
            })
    }

    const _getSubjects = () => {
        setValues({ isLoading: true })
        SubjectAPI.getSubjects()
            .then((res) => {
                setValues({ isLoading: false, subjects: res.data })
            })
            .catch((err) => {
                setValues({ isLoading: false })
                notify('error', err.message)
            })
    }

    useEffect(() => {
        _getLocations()
        _getSubjects()
    }, [])

    const onShowFilter = (type) => {
        const { isShownDropdown } = values
        for (const [key, value] of Object.entries(isShownDropdown)) {
            isShownDropdown[key] = false
        }
        isShownDropdown[type] = true
        setValues({ isShownDropdown, isShownOverlay: true })
    }

    const onSelectByKey = (key) => (id) => {
        const { filter } = values
        if (filter[key].includes(id)) {
            const index = filter[key].indexOf(id)
            if (index > -1) {
                filter[key].splice(index, 1)
            }
        } else {
            filter[key].push(id)
        }
        setValues({ filter })
    }

    const onChangeCalendar = (calendar) => {
        const { filter } = values
        filter.calendar = calendar
        setValues({ filter })
    }

    const onChangeForm = async (e) => {
        const { value } = e.target
        const { filter } = values
        filter.keyword = value
        setValues({ filter })
        await delay(200)
        if (props.onApplyFilter) {
            props.onApplyFilter({ ...values.filter, name: value })
        }
    }
    const clearFilterByKey = (key) => {
        const { filter } = values
        filter[key] = []
        if (key === 'calendar') {
            filter[key] = {
                start_time: '',
                end_time: '',
                hour_of_day: '',
                day_of_week: '',
                timezone_offset: -7
            }
        }
        setValues({ filter })
    }

    const resetShownDropdown = () => {
        setValues({
            isShownOverlay: false,
            isShownDropdown: {
                from: false,
                availability: false,
                category: false,
                subject: false
            }
        })
    }

    const applyFilter = (e) => {
        if (e) {
            e.preventDefault()
        }
        resetShownDropdown()
        if (props.onApplyFilter) {
            props.onApplyFilter({
                ...values.filter,
                name: values.filter.keyword
            })
        }
    }

    return (
        <div className='teachers-filter mb-5'>
            <div className='filter-bar'>
                <div className='filter-section'>
                    <div
                        className={`tag-filter${
                            values.isShownDropdown.from === true
                                ? ' tag-selected'
                                : values.filter.location_ids.length > 0
                                ? ' tag-actived'
                                : ''
                        }`}
                        onClick={() => onShowFilter('from')}
                    >
                        <span>From</span>
                        {values.filter.location_ids.length > 0 ? (
                            <span> ⋅ {values.filter.location_ids.length}</span>
                        ) : null}
                    </div>
                    {values.isShownDropdown.from ? (
                        <From
                            onSelectLocation={onSelectByKey('location_ids')}
                            onClearFilter={clearFilterByKey}
                            onApplyFilter={applyFilter}
                            location_ids={values.filter.location_ids}
                            locations={values.locations}
                        />
                    ) : (
                        false
                    )}
                </div>
                <div className='filter-section'>
                    <div
                        id='availability-datetime'
                        className={`tag-filter${
                            values.isShownDropdown.availability === true
                                ? ' tag-selected'
                                : values.filter.calendar.day_of_week ||
                                  values.filter.calendar.start_time
                                ? ' tag-actived'
                                : ''
                        }`}
                        onClick={() => onShowFilter('availability')}
                    >
                        <span>
                            {`Availability${
                                values.filter.calendar.start_time
                                    ? ` - ${moment(
                                          values.filter.calendar.start_time
                                      ).format('MMMM DD YYYY')}`
                                    : ''
                            }`}
                        </span>
                    </div>
                    {values.isShownDropdown.availability ? (
                        <Availability
                            onClearFilter={clearFilterByKey}
                            onApplyFilter={applyFilter}
                            calendar={values.filter.calendar}
                            onChangeCalendar={onChangeCalendar}
                        />
                    ) : null}
                </div>
                <div className='filter-section'>
                    <div
                        className={`tag-filter${
                            values.isShownDropdown.subject === true
                                ? ' tag-selected'
                                : values.filter.subject_ids.length > 0
                                ? ' tag-actived'
                                : ''
                        }`}
                        onClick={() => onShowFilter('subject')}
                    >
                        <span>Subject</span>
                        {values.filter.subject_ids.length > 0 ? (
                            <span> ⋅ {values.filter.subject_ids.length}</span>
                        ) : null}
                    </div>
                    {values.isShownDropdown.subject ? (
                        <Subject
                            onSelectSubject={onSelectByKey('subject_ids')}
                            onClearFilter={clearFilterByKey}
                            onApplyFilter={applyFilter}
                            subject_ids={values.filter.subject_ids}
                            subjects={values.subjects}
                        />
                    ) : (
                        false
                    )}
                </div>
                <div className='search-teacher-input mx-5'>
                    <div className='search-form-hide'>
                        <input
                            id='search_teachers_skills'
                            placeholder='Search by name or keyword'
                            value={values.filter.keyword}
                            onChange={onChangeForm}
                        />
                    </div>
                    <div
                        id='search_teachers_btn'
                        className='flex justify-center search-teachers-input-icon items-center clickable'
                    >
                        <svg
                            height='24'
                            viewBox='0 0 24 24'
                            width='24'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='#333'
                        >
                            <path
                                clipRule='evenodd'
                                d='M2.75 11.582a8.332 8.332 0 1116.664 0 8.332 8.332 0 01-16.664 0zm8.332-9.832c-5.43 0-9.832 4.402-9.832 9.832 0 5.43 4.402 9.832 9.832 9.832a9.793 9.793 0 006.42-2.385c.03.053.069.102.114.147l2.854 2.854a.75.75 0 101.06-1.06l-2.854-2.854A.752.752 0 0018.53 18a9.793 9.793 0 002.384-6.419c0-5.43-4.402-9.832-9.832-9.832z'
                                fillRule='evenodd'
                            />
                        </svg>
                    </div>
                </div>
            </div>
            {values.isShownOverlay ? (
                <div
                    className='overlay overlay-enter-done'
                    onClick={resetShownDropdown}
                />
            ) : null}

            <style jsx>{`
                .filter-bar,
                .filter-bar-tablet {
                    position: fixed;
                    top: 0;
                    margin-top: 0px;
                    // width: 100%;
                    display: -webkit-flex;
                    display: flex;
                    padding-left: 37px;
                    height: 66px;
                    background: #fff;
                    border-bottom: 1px solid #e9e9eb;
                    -webkit-align-items: center;
                    align-items: center;
                    z-index: 99;
                    transition: margin 0.2s;
                }
                .tag,
                .tag-filter {
                    display: inline-block;
                    padding: 0 24px;
                    margin-right: 10px;
                    min-width: 88px;
                    width: auto;
                    height: 40px;
                    font-size: 14px;
                    line-height: 38px;
                    text-align: center;
                    border-radius: 40px;
                    color: #4d4d4d;
                    background-color: #fff;
                    border: 1px solid #ddd;
                    white-space: nowrap;
                    transition: all 0.2s;
                    cursor: pointer;
                    -webkit-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                .search-teacher-input {
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: center;
                    align-items: center;
                    // -webkit-justify-content: flex-end;
                    // justify-content: flex-end;
                }
                .search-teachers-input-icon {
                    width: 88px;
                    height: 59px;
                    line-height: 59px;
                    text-align: center;
                    border-left: 1px solid #e9e9eb;
                }
                .search-teacher-input input {
                    padding: 0 10px;
                    width: 200px;
                    height: 60px;
                    font-size: 14px;
                    font-weight: 300;
                    border: 0;
                }
                #search_teachers_skills {
                    border-left: 1px solid #e9e9eb;
                }
                #search_teachers_skills:focus,
                #search_teachers_skills:focus-visible {
                    outline: unset;
                }
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    transition: opacity 0.2s;
                    z-index: 2;
                }
                .tag-filter.tag-actived,
                .tag-filter.tag-selected {
                    border: 1px solid #00bfbd;
                }
                .tag-filter.tag-actived,
                .tag.tag-selected {
                    color: #00bfbd;
                    background: rgba(0, 191, 189, 0.1);
                }
            `}</style>
        </div>
    )
}
