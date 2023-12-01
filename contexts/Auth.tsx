// contexts/auth.js

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    FC
} from 'react'
import { useRouter } from 'next/router'

import AuthenticateAPI from 'api/AuthenticateAPI'
import UserAPI from 'api/UserAPI'
import * as store from 'helpers/storage'
import { setCookie, removeCookie, getCookie } from 'helpers/cookie'
import { ROLES_ENUM, ROLES } from 'const/role'
import { encrypted, decrypted } from 'utils/crypto'
import { makeStrId } from 'utils/string-utils'
import {
    ISignUp,
    IUser,
    ISignIn,
    ISignUpTeacherWithGoogle,
    ITeacher
} from 'types'
import _ from 'lodash'
import { Spin } from 'antd'
import { Logger } from 'utils/logger'
import { Button, Modal } from 'antd'
import { browser } from 'process'
import { getTranslateText } from 'utils/translate-utils'
interface ContextProps {
    user: IUser | null
    isLoading: boolean
    error: any
    signUpSuccess: boolean
    newNotificationCount: number
    setNewNotificationCount: (newNotificationCount: number) => void
    login: (data: ISignIn) => Promise<any>
    signUp: (data: ISignUp) => Promise<any>
    logout: () => void
    logoutHomePage: () => void
    onFailure: (res: any) => void
    onSuccess: (res: any) => void
    resetState: () => void
    getRememberValues: () => void
    goToDashboard: () => void
    becomeATeacher: (data: ISignUp) => Promise<any>
    becomeATeacherByGoogle: (data: ISignUpTeacherWithGoogle) => any
    verifyEmail: (accessToken: string) => void
    fetchUserInfo: () => Promise<any>
    teacherInfo: ITeacher | null
}
const AuthContext = createContext<Partial<ContextProps>>({
    user: {},
    isLoading: false,
    error: '',
    signUpSuccess: false,
    newNotificationCount: 0,
    becomeATeacherByGoogle: (data: ISignUpTeacherWithGoogle) => {},
    teacherInfo: {}
} as ContextProps)

export const AuthProvider: FC<{}> = (props) => {
    const { children } = props
    const router = useRouter()
    const [user, setUser] = useState<IUser>({} as IUser)
    const [isLoading, setLoading] = useState(false)
    const [loadingComponent, setLoadingComponent] = useState(false)
    const [signUpSuccess, setSignUpSuccess] = useState(false)
    const [error, setError] = useState('')
    const [newNotificationCount, setNewNotificationCount] = useState(0)
    const [teacherInfo, setTeacherInfo] = useState<ITeacher>({} as ITeacher)
    const role = user?.role
    const { token, ref } = router.query

    const logout = () => {
        store.clear('user')
        store.clear('access_token')
        store.clear('close_popup')
        removeCookie('token')
        setUser({} as IUser)
        setError('')
        location.assign('/login')
    }

    const logoutHomePage = () => {
        store.clear('user')
        store.clear('access_token')
        store.clear('close_popup')
        removeCookie('token')
        setUser({} as IUser)
        setError('')
        location.assign('/')
    }

    useEffect(() => {
        if (ref) {
            store.set('ref_code', ref)
        }
        if (token) {
            setCookie('token', router.query.token)
            location.href = '/'
            return
        }

        if (role) {
            // if (role.includes(ROLES.TEACHER)) {
            //     setCookie('locale', 'en')
            // }
            // if (role.includes(ROLES.STUDENT)) {
            //     setCookie('locale', 'vi')
            // }
            if (
                router.pathname.startsWith('/teacher') &&
                !role.includes(ROLES.TEACHER)
            ) {
                router.push('/')
            }
            if (
                router.pathname.startsWith('/student') &&
                !role.includes(ROLES.STUDENT)
            ) {
                router.push('/')
            }
        }
    }, [user, router, role, token, ref])

    useEffect(() => {
        const tokenCookie = getCookie('token')
        if (tokenCookie) {
            setTimeout(() => {
                UserAPI.getFullInfo().then((user) => {
                    store.set('user', user)
                    setUser(user)
                })
            }, 1000)
        }
    }, [])

    const login = async (signInForm: ISignIn) => {
        try {
            setLoading(true)
            const response = await AuthenticateAPI.login(signInForm)
            if (response && response.access_token) {
                if (signInForm.zalo_id) {
                    Modal.success({
                        closable: false,
                        centered: true,
                        maskClosable: false,
                        title: getTranslateText('success_connect'),
                        content: getTranslateText('success_connect_message'),
                        onOk: () => {
                            window.open('https://www.google.com/', '_self')
                            window.close()
                        }
                    })
                    return
                }
                if (
                    response.user &&
                    response.user?.role.includes(ROLES_ENUM.STUDENT) &&
                    !response.user.is_verified_phone
                ) {
                    router.push(`/vi/verify-phone?user_id=${response.user.id}`)
                    return
                }
                setCookie('token', response.access_token)
                const fullUserInfo = await UserAPI.getFullInfo()
                store.set('user', fullUserInfo)
                setUser(fullUserInfo)
                if (router.asPath.indexOf('meet') !== -1) {
                    window.location.reload()
                } else if (
                    response.user.role.includes(ROLES_ENUM.TEACHER) &&
                    router.asPath.indexOf('meet') === -1
                ) {
                    const teacherFullInfo = await UserAPI.getFullInfoByTeacher()
                    setTeacherInfo(teacherFullInfo)
                    router.push('/en/teacher/dashboard')
                } else if (
                    response.user.role.includes(ROLES_ENUM.STUDENT) &&
                    router.asPath.indexOf('meet') === -1
                ) {
                    router.push('/vi/student/my-booking')
                } else {
                    router.push('/')
                }
                store.set('remember', signInForm.remember || false)
                if (signInForm.remember) {
                    const strRand = makeStrId(12)
                    store.set('u', encrypted(signInForm.email, strRand))
                    store.set('pwd', encrypted(signInForm.password, strRand))
                    store.set('hash', strRand)
                } else {
                    store.clear('u')
                    store.clear('pwd')
                    store.clear('hash')
                }
            } else {
                setError(response)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            _.delay(() => {
                setLoading(false)
            }, 500)
        }
    }

    const verifyEmail = async (access_token: string) => {
        if (access_token) {
            store.set('access_token', access_token)
            setCookie('token', access_token)
            const _user = await UserAPI.getFullInfo()
            store.set('user', _user)
            setUser(_user)
        }
    }

    const onFailure = (err: any) => {
        // Log error Sign in google
        setError(null)
    }
    const onSuccess = async (res: any) => {
        if (res) {
            try {
                const response = await AuthenticateAPI.loginByGoogle({
                    id_token: res.tokenId
                })
                store.set('access_token', response.access_token)
                store.set('user', response.user)
                setCookie('token', response.access_token)
                setUser(response.user)
                setLoading(false)
                if (response.user.role.includes(ROLES_ENUM.TEACHER)) {
                    router.push('/teacher/dashboard')
                } else if (response.user.role.includes(ROLES_ENUM.STUDENT)) {
                    router.push('/student/dashboard')
                } else {
                    router.push('/')
                }
            } catch (err: any) {
                setLoading(false)
                setError(err.message)
            }
        }
    }

    const signUp = async (signUpForm: ISignUp) => {
        try {
            setLoading(true)
            const resSignUp = await AuthenticateAPI.registerStudent(signUpForm)
            setLoading(false)
            setSignUpSuccess(true)
            setError('')
            store.set('user', resSignUp?.user)
            setUser(resSignUp?.user)
            return resSignUp
        } catch (err) {
            setLoading(false)
            setError(err.message)
            setSignUpSuccess(false)
        }
    }

    const becomeATeacher = async (signUpForm: ISignUp) => {
        try {
            await AuthenticateAPI.becomeATeacher(signUpForm)
            setLoading(false)
            setSignUpSuccess(true)
            setError('')
            setUser({ email: signUpForm.email } as IUser)
        } catch (err) {
            setError(err.message)
            setSignUpSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    const becomeATeacherByGoogle = async (
        signUpForm: ISignUpTeacherWithGoogle
    ) => {
        try {
            const response = await AuthenticateAPI.becomeATeacherByGoogle(
                signUpForm
            )
            store.set('access_token', response.access_token)
            store.set('user', response.user)
            setCookie('token', response.access_token)
            setUser(response.user)
            setLoading(false)
            if (response.user.role.includes(ROLES_ENUM.TEACHER)) {
                router.push('/teacher/dashboard')
            } else if (response.user.role.includes(ROLES_ENUM.STUDENT)) {
                router.push('/student/dashboard')
            } else {
                router.push('/')
            }
            setLoading(false)
            setSignUpSuccess(true)
            setError('')
        } catch (err) {
            setError(err.message)
            setSignUpSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    const resetState = () => {
        setUser({} as IUser)
        setError('')
        setSignUpSuccess(false)
        setLoading(false)
    }

    const getRememberValues = () => {
        if (store.get('remember')) {
            const hash = store.get('hash')
            const email = decrypted(store.get('u'), hash)
            const password = decrypted(store.get('pwd'), hash)
            return {
                email,
                password
            }
        }
    }

    const goToDashboard = () => {
        if (user && user.role && user.role.includes(ROLES_ENUM.TEACHER)) {
            router.push('/teacher/dashboard')
        } else if (user && user.role.includes(ROLES_ENUM.STUDENT)) {
            router.push('/student/dashboard')
        } else {
            router.push('/')
        }
    }

    const fetchUserInfo = async () => {
        setLoading(true)
        UserAPI.getFullInfo()
            .then((_user: any) => {
                setUser(_user)
            })
            .catch((_error) => {
                setError(_error)
            })
            .finally(() => setLoading(false))
    }

    const memoedValue = useMemo(
        () => ({
            user,
            teacherInfo,
            isLoading,
            signUpSuccess,
            error,
            newNotificationCount,
            setNewNotificationCount,
            login,
            signUp,
            logout,
            logoutHomePage,
            onFailure,
            onSuccess,
            resetState,
            getRememberValues,
            goToDashboard,
            becomeATeacher,
            becomeATeacherByGoogle,
            verifyEmail,
            fetchUserInfo
        }),
        [user, isLoading, error, newNotificationCount, teacherInfo]
    )
    if (loadingComponent)
        return (
            <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
                <Spin spinning={loadingComponent} size='large' />
            </div>
        )
    return (
        <AuthContext.Provider value={memoedValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
