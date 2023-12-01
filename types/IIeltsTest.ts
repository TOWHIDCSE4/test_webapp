export interface IIeltsCategory {
    id: number
    title: string
    description?: string
}

export interface IIeltsTest {
    id: number
    title: string
    description?: string
    article?: string
    answers?: string
    audio?: string
    video?: string
    category_id?: number
    category?: IIeltsCategory
}
