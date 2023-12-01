/**
 * @summary     JQSpeedTest
 * @description jQuery "Plugin" to measure download and upload bandwidth (speed)
 * @version     1.0.1 (13/06/2018)
 * @author      Per Lasse Baasch
 *
 * Features:
 * 	- download speed test
 *  - upload speed test
 *  - response (ping) speed test
 *  - can run mulitple download,upload and ping test as specified
 *  - loop functionality for ongoing tests
 *  - cross-browser support
 *  - works on any webserver (Apache HTTP, Apache Tomcat, IIS, nginx);
 *
 * Requirements:
 *  - An HTTP server that allows GET and POST calls
 *  - jQuery 1.3 or newer
 *
 * For details please refer to:
 * https://skycube.net
 * https://github.com/skycube/jqspeedtest
 */

export const JQSpeedTest = (options) => {
    //* ************************* Configuration START *********************//
    const defaults = {
        // Callback function for Download output
        testDlCallback: defaultCallbackFunction,
        // Callback function for Upload output
        testUlCallback: defaultCallbackFunction,
        // Callback function for Response output
        testReCallback: defaultCallbackFunction,
        // Callback function for State
        testStateCallback: defaultCallbackFunction,
        // Callback function for the finish
        testFinishCallback: defaultCallbackFunction,
        // Count of Download Samples taken
        countDlSamples: 1,
        // Count of Upload Samples taken
        countUlSamples: 1,
        // Count of Response Samples taken
        countReSamples: 1,
        // Upload Unit Output
        uploadUnit: 'Mbps',
        // Download Unit Output
        downloadUnit: 'Mbps',
        // Include the Unit on Return,
        returnUnits: true,
        // Test Image URL (DEFAULT IS testimage.jpg)
        // you may want to replace this with a real url
        testImageUrl: '/assets/images/test-speed.jpg',
        // Test Imagee Size (Bytes) (DEFAULT IMAGE IS 4796123=4.8Mb)
        testImageSize: 4796123,
        // Test Upload Size (Bytes) (DEFAULT IS 2500000=2.5Mb)
        testUploadSize: 1500000,
        // Sleep time between tests to cool down a bit (DEFAULT IS 500ms)
        testSleepTime: 500
    }
    const settings = $.extend({}, defaults, options)
    //* ************************* Configuration END *********************//

    //* * Current State
    let currentState = 'stopped'

    let state
    let getCurrentState

    //* * Some Global Vars
    let dlCounts = 0
    let dlIntervalId = 0
    let dlTestRunning = 'no'
    let ulCounts = 0
    let ulIntervalId = 0
    let ulTestRunning = 'no'
    let reCounts = 0
    let reIntervalId = 0
    let reTestRunning = 'no'

    //* * Set the current state var from outside
    state = function (state) {
        currentState = state
        return true
    }
    // Set the current state var from internal and call a callback function
    const setCurrentState = (state) => {
        currentState = state

        typeof settings.testStateCallback === 'function' &&
            settings.testStateCallback(state)
    }

    //* * Get the current state var from outside
    getCurrentState = (state) => currentState

    //* * First Start
    function init() {
        dlCounts = 0
        ulCounts = 0
        reCounts = 0
        testStart()
    }

    //* * START
    init()

    //* * Internal start and stop function
    function testStart() {
        if (currentState == 'forcestop') {
            setCurrentState('stopped')
            typeof settings.testFinishCallback === 'function' &&
                settings.testFinishCallback('finished')
            return
        }
        setCurrentState('running')
        if (dlCounts < settings.countDlSamples) {
            if (
                dlTestRunning == 'no' &&
                ulTestRunning == 'no' &&
                reTestRunning == 'no'
            ) {
                dlCounts++
                dlTestRunning = 'yes'
                setTimeout(function () {
                    TestDownload(settings.elDlOutput)
                }, settings.testSleepTime)
            }
            clearTimeout(dlIntervalId)
            dlIntervalId = setTimeout(function () {
                testStart()
            }, 1000)
            return
        }
        if (ulCounts < settings.countUlSamples) {
            if (
                dlTestRunning == 'no' &&
                ulTestRunning == 'no' &&
                reTestRunning == 'no'
            ) {
                ulCounts++
                ulTestRunning = 'yes'
                setTimeout(function () {
                    TestUpload(settings.elUlOutput)
                }, settings.testSleepTime)
            }
            clearTimeout(ulIntervalId)
            ulIntervalId = setTimeout(function () {
                testStart()
            }, 1000)
            return
        }
        if (
            reCounts < settings.countReSamples ||
            settings.countReSamples == 'loop'
        ) {
            if (
                dlTestRunning == 'no' &&
                ulTestRunning == 'no' &&
                reTestRunning == 'no'
            ) {
                reCounts++
                reTestRunning = 'yes'
                setTimeout(function () {
                    TestResponse(settings.elReOutput)
                }, settings.testSleepTime)
            }
            clearTimeout(reIntervalId)
            reIntervalId = setTimeout(function () {
                testStart()
            }, 1000)
            return
        }
        currentState = 'stopped'
        setCurrentState('stopped')
        typeof settings.testFinishCallback === 'function' &&
            settings.testFinishCallback('finished')
    }

    //* * Test the download speed
    function TestDownload() {
        const sendDate = new Date().getTime()
        $.ajax({
            type: 'GET',
            url: settings.testImageUrl,
            timeout: 60000,
            cache: false,
            success() {
                const receiveDate = new Date().getTime()
                const duration = (receiveDate - sendDate) / 1000
                const bitsLoaded = settings.testImageSize * 8
                const speedBps = (bitsLoaded / duration).toFixed(2)
                const speedKbps = (speedBps / 1024).toFixed(2)
                const speedMbps = (speedKbps / 1024).toFixed(2)
                const speedGbps = (speedMbps / 1024).toFixed(2)
                if (settings.downloadUnit == 'bps') {
                    var response = speedBps
                    if (settings.returnUnits == true) {
                        response += ' Bps'
                    }
                } else if (settings.downloadUnit == 'Kbps') {
                    var response = speedKbps
                    if (settings.returnUnits == true) {
                        response += ' Kbps'
                    }
                } else if (settings.downloadUnit == 'Mbps') {
                    var response = speedMbps
                    if (settings.returnUnits == true) {
                        response += ' Mbps'
                    }
                } else {
                    var response = speedGbps
                    if (settings.returnUnits == true) {
                        response += ' Gbps'
                    }
                }
                dlTestRunning = 'no'
                typeof settings.testDlCallback === 'function' &&
                    settings.testDlCallback(response, duration)
            }
        })
    }

    //* * Function to create random string
    function randomString(length) {
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let result = ''
        for (let i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)]
        return result
    }

    //* * Test upload function
    function TestUpload() {
        const randData = {
            randomDataString: randomString(settings.testUploadSize)
        }
        const uploadSize = settings.testUploadSize
        const sendDate = new Date().getTime()
        $.ajax({
            type: 'POST',
            url: '',
            data: randData,
            timeout: 60000,
            cache: false,
            success() {
                const receiveDate = new Date().getTime()
                const duration = (receiveDate - sendDate) / 1000
                const bitsLoaded = uploadSize * 8
                const speedBps = (bitsLoaded / duration).toFixed(2)
                const speedKbps = (speedBps / 1024).toFixed(2)
                const speedMbps = (speedKbps / 1024).toFixed(2)
                const speedGbps = (speedMbps / 1024).toFixed(2)
                if (settings.uploadUnit == 'bps') {
                    var response = speedBps
                    if (settings.returnUnits == true) {
                        response += ' Bps'
                    }
                } else if (settings.uploadUnit == 'Kbps') {
                    var response = speedKbps
                    if (settings.returnUnits == true) {
                        response += ' Kbps'
                    }
                } else if (settings.uploadUnit == 'Mbps') {
                    var response = speedMbps
                    if (settings.returnUnits == true) {
                        response += ' Mbps'
                    }
                } else {
                    var response = speedGbps
                    if (settings.returnUnits == true) {
                        response += ' Gbps'
                    }
                }
                ulTestRunning = 'no'
                typeof settings.testUlCallback === 'function' &&
                    settings.testUlCallback(response, duration)
            }
        })
    }

    //* * Test Response time
    function TestResponse() {
        const sendDate = new Date().getTime()
        $.ajax({
            type: 'HEAD',
            url: '',
            timeout: 60000,
            cache: false,
            success() {
                const receiveDate = new Date().getTime()
                let response = receiveDate - sendDate
                const duration = response
                reTestRunning = 'no'
                if (settings.returnUnits == true) {
                    response += ' ms'
                }
                typeof settings.testReCallback === 'function' &&
                    settings.testReCallback(response, duration)
            }
        })
    }

    //* * Default callback function
    function defaultCallbackFunction(value) {
        // window.console && console.log(value);
    }
}
