/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { memo, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { Modal, Button, Select } from 'antd'
import { getBrowser, checkBrowser } from 'utils/browser-utils'
import MediaStreamHelper from 'utils/media-utils'
import { JQSpeedTest } from 'utils/jqspeed'
import UserAPI from 'api/UserAPI'
import { getTranslateText } from 'utils/translate-utils'
import InfoRow from './InfoRow'

const TestEquipmentModal = ({ show, toggleModal }) => {
    const [browser, setBrowser] = useState(null)
    const [connectStatus, setConnectStatus] = useState(false)
    const [loadingConnect, setLoadingConnect] = useState(false)
    const [isTestSpeed, setIsTestSpeed] = useState(false)
    const [loadingSpeed, setLoadingSpeed] = useState(false)
    const [loadingSpeedDownload, setLoadingSpeedDownload] = useState(false)
    const [downloadStatus, setDownloadStatus] = useState('')
    const [loadingSpeedUpload, setLoadingSpeedUpload] = useState(false)
    const [uploadStatus, setUploadStatus] = useState('')
    const [isTestDevice, setIsTestDevice] = useState(false)
    const [isDeviceSupport, setDeviceSupport] = useState(true)
    const [devices, setDevices] = useState([])
    const [videoId, setVideoId] = useState('')
    const [audioId, setAudioId] = useState('')

    useEffect(() => {
        if (show) {
            // check status
            setBrowser(getBrowser())

            // get ConnectStatus
            setLoadingConnect(true)
            UserAPI.testConnect()
                .then((res) => {
                    setConnectStatus(true)
                    setLoadingConnect(false)
                })
                .catch((err) => {
                    setConnectStatus(false)
                    setLoadingConnect(false)
                })
        }

        if (!show) {
            // reset State
            setTimeout(() => {
                setBrowser(false)
                setLoadingConnect(false)
                setConnectStatus(false)
                setIsTestSpeed(false)

                setDownloadStatus('')
                setUploadStatus('')

                setIsTestDevice(false)
                setDeviceSupport(true)

                MediaStreamHelper.stopStream()
            }, 200)
        }
    }, [show])

    useEffect(() => {
        if (isTestSpeed) {
            setLoadingSpeed(true)
            setLoadingSpeedDownload(true)
            setLoadingSpeedUpload(true)
            const speedTest = new JQSpeedTest({
                testFinishCallback: (value) => {
                    setLoadingSpeed(false)
                    setLoadingSpeedDownload(false)
                    setLoadingSpeedUpload(false)
                },
                testDlCallback: (value, duration) => {
                    setLoadingSpeedDownload(false)
                    setDownloadStatus(value)
                },
                testUlCallback: (value, duration) => {
                    setLoadingSpeedUpload(false)
                    setUploadStatus(value)
                }
            })
        }
    }, [isTestSpeed])

    const speedTestEvent = () => {
        setIsTestSpeed(true)
    }

    const deviceTestEvent = () => {
        setIsTestDevice(true)

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.enumerateDevices
        ) {
            setDeviceSupport(false)
        } else {
            // Request streams (audio and video), ask for permission and display streams in the video element
            MediaStreamHelper.requestStream()
                .then(function (stream) {
                    // Store Current Stream
                    MediaStreamHelper._stream = stream

                    // Select the Current Streams in the list of devices
                    const videoPlayer: any = document.getElementById('player')

                    // Play the current stream in the Video element
                    videoPlayer.srcObject = stream

                    // You can now list the devices using the Helper
                    MediaStreamHelper.getDevices()
                        .then((_devices) => {
                            // Iterate over all the list of devices (InputDeviceInfo and MediaDeviceInfo)
                            setDevices(_devices)
                        })
                        .catch(function (e) {
                            console.log(`${e.name}: ${e.message}`)
                        })
                })
                .catch(function (err) {
                    console.error(err)
                })
        }
    }
    useEffect(() => {
        if (devices.length > 0 && !videoId && !audioId) {
            if (devices.filter((x) => x.kind === 'videoinput')[0]) {
                setVideoId(
                    devices.filter((x) => x.kind === 'videoinput')[0].deviceId
                )
            }
            if (devices.filter((x) => x.kind === 'audioinput')[0]) {
                setAudioId(
                    devices.filter((x) => x.kind === 'audioinput')[0].deviceId
                )
            }
        }
    }, [devices])
    const renderVideos = () =>
        devices
            .filter((x) => x.kind === 'videoinput')
            .map((item, index) => (
                <Select.Option key={index} value={item.deviceId}>
                    {item.label || `Camera ${index + 1}`}
                </Select.Option>
            ))

    const onChangeVideo = (val) => {
        setVideoId(val)
        const videoPlayer: any = document.getElementById('player')
        MediaStreamHelper.requestStream().then(function (stream) {
            MediaStreamHelper._stream = stream
            videoPlayer.srcObject = stream
        })
    }

    const renderAudios = () =>
        devices
            .filter((x) => x.kind === 'audioinput')
            .map((item, index) => (
                <Select.Option key={index} value={item.deviceId}>
                    {item.label || `Audio ${index + 1}`}
                </Select.Option>
            ))

    const onChangeAudio = (val) => {
        setAudioId(val)
        const videoPlayer: any = document.getElementById('player')
        MediaStreamHelper.requestStream().then(function (stream) {
            MediaStreamHelper._stream = stream
            videoPlayer.srcObject = stream
        })
    }

    return (
        <Modal
            maskClosable
            centered
            visible={show}
            title={getTranslateText('test_equipment')}
            onCancel={() => toggleModal(false)}
            footer={null}
        >
            <InfoRow
                title={getTranslateText('test_browser')}
                content={
                    browser
                        ? checkBrowser(browser)
                            ? `${getTranslateText('browser_available')}: ${
                                  browser.name
                              } ${browser.version}`
                            : `${getTranslateText('browser_invalid')}`
                        : `${getTranslateText('testing')}...`
                }
                success={checkBrowser(browser)}
            />
            <InfoRow
                title={getTranslateText('server_connection')}
                success={connectStatus}
                content={
                    loadingConnect
                        ? `${getTranslateText('testing')}...`
                        : connectStatus
                        ? `${getTranslateText('stable_server_connection')}...`
                        : `${getTranslateText('can_not_connect_server')}...`
                }
            />

            <InfoRow
                title={getTranslateText('internet_speed')}
                success={!isEmpty(downloadStatus) && !isEmpty(uploadStatus)}
                content={
                    <>
                        {isTestSpeed ? (
                            <>
                                <div className='loading-status d-flex justify-content-center mb-2'>
                                    {loadingSpeed ? (
                                        <div
                                            className='spinner-border'
                                            role='status'
                                        >
                                            <span className='sr-only'>
                                                Loading...
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            {!isEmpty(downloadStatus) &&
                                                !isEmpty(uploadStatus) && (
                                                    <span className='text-success'>
                                                        <svg
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            width='40'
                                                            height='40'
                                                            fill='currentColor'
                                                            className='bi bi-check-circle'
                                                            viewBox='0 0 16 16'
                                                        >
                                                            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
                                                            <path d='M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z' />
                                                        </svg>
                                                    </span>
                                                )}
                                        </>
                                    )}
                                </div>
                                <div className='speed-result d-flex justify-content-center'>
                                    <div className='speed-test-info mr-2'>
                                        <div>
                                            <label>
                                                {getTranslateText('download')}
                                            </label>
                                        </div>
                                        {loadingSpeedDownload ? (
                                            <div>
                                                {getTranslateText('testing')}{' '}
                                                ...
                                            </div>
                                        ) : (
                                            <>
                                                <div>{downloadStatus}</div>
                                                <span>
                                                    {parseInt(
                                                        downloadStatus.replace(
                                                            'Mbps',
                                                            ''
                                                        )
                                                    ) > 10 ? (
                                                        <span className='text-success'>
                                                            {getTranslateText(
                                                                'stable'
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className='text-warning'>
                                                            {getTranslateText(
                                                                'unstable'
                                                            )}
                                                        </span>
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className='speed-test-info download-status ml-2'>
                                        <div>
                                            <label>
                                                {getTranslateText('upload')}
                                            </label>
                                        </div>
                                        {loadingSpeedUpload ? (
                                            <div>
                                                {getTranslateText('testing')}{' '}
                                                ...
                                            </div>
                                        ) : (
                                            <>
                                                <div>{uploadStatus}</div>
                                                <span>
                                                    {!isEmpty(uploadStatus) && (
                                                        <>
                                                            {parseInt(
                                                                uploadStatus.replace(
                                                                    'Mbps',
                                                                    ''
                                                                )
                                                            ) > 10 ? (
                                                                <span className='text-success'>
                                                                    {getTranslateText(
                                                                        'stable'
                                                                    )}
                                                                </span>
                                                            ) : (
                                                                <span className='text-warning'>
                                                                    {getTranslateText(
                                                                        'unstable'
                                                                    )}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Button type='primary' onClick={speedTestEvent}>
                                {getTranslateText('test_speed')}
                            </Button>
                        )}
                    </>
                }
            />

            <InfoRow
                title='Kiểm tra camera/microphone'
                // success={connectStatus}
                content={
                    <>
                        {isTestDevice ? (
                            <div>
                                {!isDeviceSupport ? (
                                    <span>
                                        {getTranslateText('device_not_support')}
                                    </span>
                                ) : (
                                    <div>
                                        <video
                                            autoPlay
                                            id='player'
                                            controls
                                            style={{
                                                width: '95%'
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: '95%'
                                            }}
                                        >
                                            <Select
                                                id='video-source'
                                                className='form-select mt-3 mb-3'
                                                onChange={onChangeVideo}
                                                style={{ width: '100%' }}
                                                value={videoId}
                                            >
                                                {renderVideos()}
                                            </Select>
                                            <Select
                                                id='audio-source'
                                                className='form-select mb-2'
                                                onChange={onChangeAudio}
                                                style={{ width: '100%' }}
                                                value={audioId}
                                            >
                                                {renderAudios()}
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button type='primary' onClick={deviceTestEvent}>
                                {getTranslateText('test_equipment')}
                            </Button>
                        )}
                    </>
                }
            />
        </Modal>
    )
}

export default memo(TestEquipmentModal)
