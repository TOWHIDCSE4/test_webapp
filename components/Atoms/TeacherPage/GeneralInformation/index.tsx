import React, { FC, useReducer, useState, useEffect } from 'react'
import cn from 'classnames'
import Basic from 'components/Atoms/TeacherPage/GeneralInformation/Basic'
import Profile from 'components/Atoms/TeacherPage/GeneralInformation/Profile'
import PaymentMethod from 'components/Atoms/TeacherPage/GeneralInformation/PaymentMethod'
import ChangePassword from 'components/Atoms/TeacherPage/GeneralInformation/ChangePassword'
import { notify } from 'contexts/Notification'
import { ITeacher, IUser } from 'types'
import UserAPI from 'api/UserAPI'
import styles from './GeneralInformation.module.scss'

const GeneralInformation: FC = () => {
    const [values, setValues] = useReducer(
        (state: any, newState: any) => ({ ...state, ...newState }),
        {
            isLoading: false,
            isShownEdit: false,
            basic_info: {} as IUser,
            bank_list: []
        }
    )

    const [teacher, setTeacher] = useState<ITeacher>()

    const getBankList = () => {
        UserAPI.getBankList().then((res) => {
            setValues({ bank_list: res })
        })
    }

    const getTeacherFullInfo = () => {
        UserAPI.getFullInfoByTeacher()
            .then((res) => {
                setTeacher(res)
            })
            .catch((err) => {
                notify('error', err.message)
            })
    }

    const getFullInfo = () => {
        setValues({ isLoading: true })
        UserAPI.getFullInfo()
            .then((res) => {
                setValues({ isLoading: false, basic_info: res })
            })
            .catch((err) => {
                setValues({ isLoading: false })
                notify('error', err.message)
            })
    }

    useEffect(() => {
        getFullInfo()
        getTeacherFullInfo()
        getBankList()
    }, [])

    return (
        <div className={cn(styles.wrap)}>
            <Basic
                isLoading={values.isLoading}
                basicInfo={values.basic_info}
                teacher={teacher}
                refetchData={getFullInfo}
            />
            <Profile teacher={teacher} refetchData={getTeacherFullInfo} />
            <PaymentMethod
                data={values.basic_info?.bank_account}
                bank_list={values.bank_list}
            />
            <ChangePassword />
        </div>
    )
}

export default GeneralInformation
