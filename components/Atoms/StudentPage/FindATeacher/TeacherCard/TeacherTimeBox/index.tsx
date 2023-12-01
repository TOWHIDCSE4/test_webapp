/* eslint-disable react/button-has-type */
import { notification, Select, Space, Spin } from 'antd'
import CalendarAPI from 'api/CalendarAPI'
import TeacherAPI from 'api/TeacherAPI'
import _ from 'lodash'
import React, {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react'
import ItemTime from './item-time'

interface IProps {
    time: any
    teacher: any
}

export default React.memo(
    ({ ...props }: IProps) => {
        const [schedules, setSchedules] = useState(null)
        const [isLoading, setIsLoading] = useState(false)

        const renderTime = () => {
            const listTime = []
            const time = props.time.clone()
            time.set({
                hour: 7,
                minute: 0,
                second: 0,
                millisecond: 0
            })
            while (time.hour() < 23) {
                listTime.push(
                    <ItemTime
                        start_time={time.clone()}
                        end_time={time.clone().add({
                            minute: 30
                        })}
                        schedules={schedules}
                    />
                )
                time.add({
                    minute: 30
                })
            }
            return listTime
        }

        const getData = async () => {
            setIsLoading(true)
            try {
                const startTime = props.time.clone()
                const endTime = props.time.clone()
                startTime.set({
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0
                })
                endTime.set({
                    hour: 24,
                    minute: 0,
                    second: 0,
                    millisecond: 0
                })
                const res = await CalendarAPI.getCalendarByStudent(
                    props.teacher.id,
                    {
                        teacher_id: props.teacher.id,
                        start_time: startTime.valueOf(),
                        end_time: endTime.valueOf()
                    }
                )
                if (res) {
                    setSchedules(res)
                }
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: error.message
                })
            }
            setIsLoading(false)
        }

        useEffect(() => {
            getData()
        }, [props.teacher._id, props.time.valueOf()])

        return (
            <div className='mb-4 item-teacher'>
                {isLoading ? (
                    <div className='w-100 d-flex justify-content-center'>
                        <Space size='middle'>
                            <Spin size='large' />
                        </Space>
                    </div>
                ) : (
                    <div className='col-time p-2'>{renderTime()}</div>
                )}
            </div>
        )
    },
    (pre, next) =>
        pre.teacher._id === next.teacher._id &&
        pre.time.valueOf() === next.time.valueOf()
)
