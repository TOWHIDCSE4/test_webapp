import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import { getTranslateText } from 'utils/translate-utils'
import { ITeacher, IUser } from 'types'
import { nl2br, sanitize, urlToFileName } from 'utils/string-utils'
import UserAPI from 'api/UserAPI'
import { Col, notification, Row, Upload } from 'antd'
import { notify } from 'contexts/Notification'
import { encodeFilenameFromLink } from 'utils/functions'
import Tag from './Tag'
import UploadButton from './UploadButton'
import styles from './Profile.module.scss'

interface ProfileProps {
    isLoading?: boolean
    basicInfo?: IUser
    teacher: ITeacher
    refetchData: () => void
}
const Profile = ({
    isLoading,
    teacher,
    basicInfo,
    refetchData
}: ProfileProps) => {
    const [files, setFiles] = useState({
        degree: null,
        tesol: null,
        tefl: null,
        ielts: null,
        toeic: null,
        intro_video: null,
        cv: null
    })
    useEffect(() => {
        if (!teacher) return
        setFiles({
            degree: teacher.degree && [
                {
                    name: urlToFileName(teacher.degree),
                    url: encodeFilenameFromLink(teacher.degree)
                }
            ],
            tesol: teacher.teaching_certificate?.tesol && [
                {
                    name: urlToFileName(teacher.teaching_certificate.tesol),
                    url: encodeFilenameFromLink(
                        teacher.teaching_certificate.tesol
                    )
                }
            ],
            tefl: teacher.teaching_certificate?.tefl && [
                {
                    name: urlToFileName(teacher.teaching_certificate.tefl),
                    url: encodeFilenameFromLink(
                        teacher.teaching_certificate.tefl
                    )
                }
            ],
            ielts: teacher.english_certificate?.ielts && [
                {
                    name: urlToFileName(teacher.english_certificate.ielts),
                    url: encodeFilenameFromLink(
                        teacher.english_certificate.ielts
                    )
                }
            ],
            toeic: teacher.english_certificate?.toeic && [
                {
                    name: urlToFileName(teacher.english_certificate.toeic),
                    url: encodeFilenameFromLink(
                        teacher.english_certificate.toeic
                    )
                }
            ],
            intro_video: teacher.intro_video && [
                {
                    name: urlToFileName(teacher.intro_video),
                    url: encodeFilenameFromLink(teacher.intro_video)
                }
            ],
            cv: teacher.cv && [
                {
                    name: urlToFileName(teacher.cv),
                    url: encodeFilenameFromLink(teacher.cv)
                }
            ]
        })
    }, [teacher])
    const editTeacher = useCallback(async (payload) => {
        try {
            await UserAPI.editTeacherInfo(payload)
            notify('success', 'Update successfully')
        } catch (error) {
            notify('error', error.message)
        }
        refetchData()
    }, [])
    const onRemove = useCallback(
        (key) => async (file) => {
            if (file.error) return
            editTeacher({ [key]: null })
        },
        []
    )

    const beforeUploadPdf = useCallback((file: any) => {
        if (file.type !== 'application/pdf') {
            notify('error', 'You can only upload pdf file!')
            return Upload.LIST_IGNORE
        }
    }, [])
    const beforeUploadVideo = useCallback((file: any) => {
        if (!file.type.startsWith('video/')) {
            notify('error', 'You can only upload video file!')
            return Upload.LIST_IGNORE
        }
    }, [])

    return (
        <div className={cn(styles.wrapProfile)}>
            <div className={cn(styles.titleHeader)}>
                {getTranslateText('teacher.info.profile')}
            </div>
            <div className='ml-3 ml-sm-4 mr-sm-4  mr-3'>
                <div className={cn(styles.introduction)}>
                    <h4>{getTranslateText('teacher.info.profile.intro')}</h4>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: sanitize(nl2br(teacher?.about_me))
                        }}
                    />
                </div>
                <div className={cn(styles.experience)}>
                    <h4>{getTranslateText('teacher.info.profile.exp')}</h4>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: sanitize(nl2br(teacher?.experience))
                        }}
                    />
                </div>
                <Row justify='center' gutter={1}>
                    <Col span={24} lg={12}>
                        <div
                            className={`${cn(
                                styles.certificate
                            )} text-sm-center`}
                        >
                            <h4 className='text-sm-center'>
                                {getTranslateText(
                                    'teacher.info.teaching_certificate'
                                )}
                            </h4>
                            <div className='d-flex flex-column flex-sm-row justify-content-around'>
                                <div className={cn(styles.certificateItem)}>
                                    <Tag
                                        content='TESOL'
                                        isActive={files.tesol?.length}
                                    />
                                    <UploadButton
                                        className='d-block mt-2'
                                        accept='.pdf'
                                        beforeUpload={beforeUploadPdf}
                                        afterUpload={(url) =>
                                            editTeacher({
                                                'teaching_certificate.tesol':
                                                    url
                                            })
                                        }
                                        onRemove={onRemove(
                                            'teaching_certificate.tesol'
                                        )}
                                        defaultFileList={files.tesol}
                                    />
                                </div>
                                <div className={cn(styles.certificateItem)}>
                                    <Tag
                                        content='TEFL'
                                        isActive={files.tefl?.length}
                                    />
                                    <UploadButton
                                        className='d-block mt-2'
                                        accept='.pdf'
                                        beforeUpload={beforeUploadPdf}
                                        afterUpload={(url) =>
                                            editTeacher({
                                                'teaching_certificate.tefl': url
                                            })
                                        }
                                        onRemove={onRemove(
                                            'teaching_certificate.tefl'
                                        )}
                                        defaultFileList={files.tefl}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={24} lg={12}>
                        <div
                            className={`${cn(
                                styles.certificate
                            )} text-sm-center`}
                        >
                            <h4 className='text-sm-center'>
                                {getTranslateText(
                                    'teacher.info.english_certificate'
                                )}
                            </h4>
                            <div className='d-flex flex-column flex-sm-row justify-content-around'>
                                <div className={cn(styles.certificateItem)}>
                                    <Tag
                                        content='IELTS'
                                        isActive={files.ielts?.length}
                                    />
                                    <UploadButton
                                        className='d-block mt-2'
                                        accept='.pdf'
                                        beforeUpload={beforeUploadPdf}
                                        afterUpload={(url) =>
                                            editTeacher({
                                                'english_certificate.ielts': url
                                            })
                                        }
                                        onRemove={onRemove(
                                            'english_certificate.ielts'
                                        )}
                                        defaultFileList={files.ielts}
                                    />
                                </div>
                                <div className={cn(styles.certificateItem)}>
                                    <Tag
                                        content='TOEIC'
                                        isActive={files.toeic?.length}
                                    />
                                    <UploadButton
                                        className='d-block mt-2'
                                        accept='.pdf'
                                        beforeUpload={beforeUploadPdf}
                                        afterUpload={(url) =>
                                            editTeacher({
                                                'english_certificate.toeic': url
                                            })
                                        }
                                        onRemove={onRemove(
                                            'english_certificate.toeic'
                                        )}
                                        defaultFileList={files.toeic}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className={cn(styles.update_DegreeCertificate)}>
                    <h4>
                        {getTranslateText('teacher.info.profile.uploadDegree')}
                    </h4>
                    <UploadButton
                        accept='.pdf'
                        beforeUpload={beforeUploadPdf}
                        afterUpload={(url) => editTeacher({ degree: url })}
                        onRemove={onRemove('degree')}
                        defaultFileList={files.degree}
                    />
                </div>
                <div className={cn(styles.video_introduction)}>
                    <h4>{getTranslateText('teacher.info.profile.vidIntro')}</h4>
                    <UploadButton
                        accept='video/*'
                        beforeUpload={beforeUploadVideo}
                        afterUpload={(url) => editTeacher({ intro_video: url })}
                        onRemove={onRemove('intro_video')}
                        defaultFileList={files.intro_video}
                    />
                </div>
                <div className={cn(styles.upload_cv)}>
                    <h4>{getTranslateText('teacher.info.profile.uploadCV')}</h4>
                    <UploadButton
                        accept='.pdf'
                        beforeUpload={beforeUploadPdf}
                        afterUpload={(url) => editTeacher({ cv: url })}
                        onRemove={onRemove('cv')}
                        defaultFileList={files.cv}
                    />
                </div>
            </div>
        </div>
    )
}

export default Profile
