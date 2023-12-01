export interface ISignIn {
    email: string
    password: string
    remember?: boolean
    zalo_id?: any
}

export interface ISignUp {
    first_name: string
    last_name: string
    email: string
    password: string
    phone_number?: string
    crm_user_id?: number
}

export interface ISignUpTeacherWithGoogle {
    id_token: string
    location_id: number
}
