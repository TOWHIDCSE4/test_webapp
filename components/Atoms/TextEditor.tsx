import { memo } from 'react'
import { Editor, IAllProps as TinyProps } from '@tinymce/tinymce-react'
import UploadApi from 'api/UploadAPI'

interface TextEditorProps extends TinyProps {
    onChange?: (value: any) => void
}

const defaultConfig = {
    height: 300,
    menubar: false,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
    ],
    toolbar: `formatselect | bold italic backcolor | alignleft aligncenter
                    alignright alignjustify | bullist numlist outdent indent |
                    link image media | removeformat`,
    images_upload_handler: async (blobInfo, success, failure, progress) => {
        try {
            const res = await UploadApi.uploadImage(blobInfo.blob())
            success(res)
        } catch (error) {
            failure(error)
        }
    },
    paste_data_images: true
}

function TextEditor({ onChange, init, ...props }: TextEditorProps) {
    return (
        <Editor
            tinymceScriptSrc='/lib/tinymce/tinymce.min.js'
            init={{ ...defaultConfig, ...init }}
            value={props.value}
            onEditorChange={onChange}
            {...props}
        />
    )
}

export default memo(TextEditor)
