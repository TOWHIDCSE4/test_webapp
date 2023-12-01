import _ from 'lodash'
import ApiSender from './ApiSender'

export default class UploadAPI {
    public static uploadImage(file: any) {
        const route = `/st/user/upload`
        const formData = new FormData()
        formData.append('file', file)
        return ApiSender.post(route, formData)
    }
}
