const MediaStreamHelper = {
    // Property of the object to store the current stream
    _stream: null,
    // This method will return the promise to list the real devices
    getDevices() {
        return navigator.mediaDevices.enumerateDevices()
    },
    // Request user permissions to access the camera and video
    requestStream() {
        if (this._stream) {
            this._stream.getTracks().forEach((track) => {
                track.stop()
            })
        }

        const videoSourcesSelect: any = document.getElementById('video-source')
        const audioSourcesSelect: any = document.getElementById('audio-source')

        const audioSource = audioSourcesSelect?.value
        const videoSource = videoSourcesSelect?.value
        const constraints = {
            audio: {
                deviceId: audioSource ? { exact: audioSource } : undefined
            },
            video: {
                deviceId: videoSource ? { exact: videoSource } : undefined
            }
        }

        return navigator.mediaDevices.getUserMedia(constraints)
    },

    stopStream() {
        if (this._stream) {
            this._stream.getTracks().forEach((track) => {
                track.stop()
            })
        }
    }
}

export default MediaStreamHelper
