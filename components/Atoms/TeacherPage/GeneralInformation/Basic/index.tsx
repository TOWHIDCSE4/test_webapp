import React, { useEffect, useReducer, useState } from 'react'
import cn from 'classnames'
import { Image, Row, Col, Select, Button } from 'antd'
import { GENDER_ENUM } from 'const/gender'
import _ from 'lodash'
import { ITeacher, IUser } from 'types'
import moment from 'moment'
import { DEFAULT_AVATAR } from 'const/common'
import { getTranslateText } from 'utils/translate-utils'
import { toReadablePrice } from 'utils/price-utils'
import { notify } from 'contexts/Notification'
import CountryAPI from 'api/CountryAPI'
import LoadingView from './LoadingView'
import EditBasicInfoModal from './EditModal'
import styles from './index.module.scss'

const { Option } = Select
interface BasicProps {
    isLoading: boolean
    basicInfo: IUser
    teacher: ITeacher
    refetchData: () => void
}
const Basic = ({ isLoading, basicInfo, teacher, refetchData }: BasicProps) => {
    const [values, setValues] = useReducer(
        (state: any, newState: any) => ({ ...state, ...newState }),
        {
            isShownEdit: false
        }
    )

    const [timeZones, setTimeZones] = useState([])
    const [timeZone, setTimeZone] = useState<string>('')

    useEffect(() => {
        if (timeZones.length > 0) {
            const tmp = window.localStorage.getItem('timezone')
            if (tmp) {
                setTimeZone(tmp)
            }
        }
    }, [timeZones])

    const getTimeZones = () => {
        CountryAPI.getTimeZones()
            .then((res: any) => setTimeZones(res))
            .catch((err: any) => notify('error', err.message))
    }

    useEffect(() => {
        getTimeZones()
    }, [])

    const toggleEdit = (value: boolean) => {
        setValues({ isShownEdit: value })
    }

    const renderTimeZone = () =>
        timeZones.map((item: any, index) => (
            <Option key={index} value={item.t}>
                {item.t}
            </Option>
        ))

    const handleChangeTimezone = (val) => {
        localStorage.setItem('timezone', val)
        setTimeZone(val)
    }

    return (
        <>
            <div className={cn(styles.wrapFirstPage)}>
                <div className={cn(styles.title)}>
                    <LoadingView
                        type='round'
                        ready={!isLoading}
                        rows={1}
                        style={{ width: 80, height: 10 }}
                        className='ml-3'
                    >
                        <div>{getTranslateText('teacher.info')}</div>
                    </LoadingView>
                    <LoadingView
                        type='round'
                        ready={!isLoading}
                        rows={1}
                        style={{ width: 80, height: 10 }}
                        className='mr-3'
                    >
                        <div onClick={() => toggleEdit(true)}>
                            {getTranslateText('common.edit')}
                        </div>
                    </LoadingView>
                </div>
                <div className={cn(styles.avatar)}>
                    <LoadingView type='media' rows={0} ready={!isLoading}>
                        <Image
                            src={basicInfo.avatar || DEFAULT_AVATAR}
                            preview={false}
                            width={150}
                            fallback={DEFAULT_AVATAR}
                        />
                    </LoadingView>
                </div>
                <div className={cn(styles.infoGroup)}>
                    {/* <div className={cn(styles.currentLevel)}>
                        {getTranslateText(
                            'teacher.dashboard.label.current_level'
                        )}
                    </div> */}
                    <Row className='align-items-center m-0' gutter={[30, 0]}>
                        <Col span={16} className={cn(styles.fromItemMidLeft)}>
                            <Select
                                defaultValue='1'
                                className={cn(styles.textDefault)}
                                size='large'
                                style={{ width: '100%', padding: 0 }}
                            >
                                <Option value='1'>
                                    {toReadablePrice(teacher?.hourly_rate || 0)}{' '}
                                    {teacher?.location?.currency} -{' '}
                                    {teacher?.level?.name}
                                </Option>
                            </Select>
                        </Col>
                        {/* <Col span={8} className={cn(styles.fromItemMidRight)}>
                            <Button
                                htmlType='submit'
                                shape='round'
                                className={cn(styles.updateFormButton)}
                            >
                                {getTranslateText('teacher.info.level.upgrade')}
                            </Button>
                        </Col> */}
                    </Row>
                    {/* <div>
                        {getTranslateText('teacher.info.condition')}
                        <br />
                        <a>
                            {getTranslateText(
                                'teacher.info.condition.checkHere'
                            )}
                        </a>
                    </div> */}
                    <div>
                        <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 600, height: 10 }}
                            className='mb-4'
                        >
                            <div>
                                {getTranslateText('teacher.info.fullname')}
                            </div>{' '}
                            <div>
                                {basicInfo.full_name ||
                                    `${basicInfo.full_name}`}
                            </div>
                        </LoadingView>
                    </div>
                    <div>
                        {/* <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 600, height: 10 }}
                            className='mb-4'
                        >
                            <div>
                                {getTranslateText('teacher.info.username')}
                            </div>{' '}
                            <div>{basicInfo.username}</div>
                        </LoadingView> */}
                    </div>
                    <div>
                        <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 600, height: 10 }}
                            className='mb-4'
                        >
                            <div>{getTranslateText('teacher.info.email')}</div>{' '}
                            <div>{basicInfo.email}</div>
                        </LoadingView>
                    </div>
                    <div>
                        <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 600, height: 10 }}
                            className='mb-4'
                        >
                            <div>
                                {getTranslateText('form.basic_info.gender')}
                            </div>{' '}
                            <div>
                                {_.capitalize(
                                    _.findKey(
                                        GENDER_ENUM,
                                        (o) => o === basicInfo.gender
                                    )
                                )}
                            </div>
                        </LoadingView>
                    </div>
                    <div>
                        <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 600, height: 10 }}
                            className='mb-4'
                        >
                            <div>{getTranslateText('teacher.info.birth')}</div>{' '}
                            <div>
                                {basicInfo.date_of_birth &&
                                    moment(basicInfo.date_of_birth).format(
                                        'DD - MM - YYYY'
                                    )}
                            </div>
                        </LoadingView>
                    </div>
                    <div>
                        <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 600, height: 10 }}
                            className='mb-4'
                        >
                            <div>{getTranslateText('teacher.info.phone')}</div>{' '}
                            <div>{basicInfo.phone_number}</div>
                        </LoadingView>
                    </div>
                    <div>
                        <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 600, height: 10 }}
                            className='mb-4'
                        >
                            <div>
                                {getTranslateText('teacher.info.timezone')}
                            </div>{' '}
                            <div>
                                <Select
                                    showSearch
                                    placeholder='Choose timezone'
                                    optionFilterProp='children'
                                    filterOption={(input, option) =>
                                        _.isString(option.children) &&
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: '200px' }}
                                    value={timeZone}
                                    onChange={handleChangeTimezone}
                                >
                                    {renderTimeZone()}
                                </Select>
                            </div>
                        </LoadingView>
                    </div>
                    <div>
                        <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 600, height: 10 }}
                            className='mb-4'
                        >
                            <div>{getTranslateText('teacher.info.skype')}</div>{' '}
                            <div>{basicInfo.skype_account}</div>
                        </LoadingView>
                    </div>
                    {/* <div>
                        <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 600, height: 10 }}
                            className='mb-4'
                        >
                            <div>{getTranslateText('teacher.info.ip')}</div>
                            <div>116.110.118.160</div>
                        </LoadingView>
                    </div> */}
                    <div>
                        <LoadingView
                            type='round'
                            ready={!isLoading}
                            rows={1}
                            style={{ width: 1000, height: 10 }}
                            className='mb-4'
                        >
                            <div>{getTranslateText('ref_code')}</div>
                            <div style={{ display: 'flex' }}>
                                <b style={{ color: 'red' }}>
                                    {teacher?.ref_code}
                                </b>
                                &nbsp;&nbsp;
                                <b>
                                    <Button
                                        size='small'
                                        title='Click to copy'
                                        style={{
                                            borderRadius: '999px',
                                            background: '#1890ff',
                                            borderColor: '#1890ff',
                                            color: '#fff'
                                        }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${window.location.host}/?ref=${teacher?.ref_code}`
                                            )
                                            notify(
                                                'success',
                                                'Copied referral link to clipboard'
                                            )
                                        }}
                                    >
                                        Copy Link
                                    </Button>
                                </b>
                            </div>
                        </LoadingView>
                    </div>
                </div>
            </div>
            <EditBasicInfoModal
                visible={values.isShownEdit}
                toggleModal={toggleEdit}
                data={basicInfo}
                refetchData={refetchData}
            />
        </>
    )
}

export default Basic
