import _ from 'lodash'
import { FC, memo } from 'react'
import { IQuestion } from 'types'
import { nl2br, sanitize } from 'utils/string-utils'
import ReactAudioPlayer from 'react-audio-player'
import { Image } from 'antd'
import styles from './index.module.scss'

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
    data: IQuestion
    onChangeAnswer: (ques_id: string, ans_id: string) => void
    userAnswers: any[]
}

const Question: FC<Props> = ({ data, onChangeAnswer, userAnswers }) => {
    const renderAnswers = () => {
        if (!_.isEmpty(data?.answers)) {
            return data?.answers.map((item, index) => (
                <label
                    className='i-dot d-block col-sm-6 col-12'
                    key={index}
                    style={{
                        color: `${item?.is_correct && 'green'}`,
                        fontWeight: `${item?.is_correct && 'bold'}`
                    }}
                >
                    <input
                        type='radio'
                        name={item?.label + data._id}
                        value={item?.label + data._id}
                        checked={
                            _.findIndex(
                                userAnswers,
                                (o) =>
                                    o?.answers.includes(
                                        item.label.toString()
                                    ) && o.question_id === data._id
                            ) >= 0
                        }
                        onChange={() =>
                            onChangeAnswer(data._id, item.label.toString())
                        }
                    />
                    <i className='contribute-check' /> {item?.text}
                </label>
            ))
        }
    }
    return (
        <li>
            <p className='title2 exam-title'>
                <span>{data?.display_order}</span>
                <b
                    dangerouslySetInnerHTML={{
                        __html: sanitize(nl2br(data?.name))
                    }}
                />
                <br />
            </p>

            {data?.audio && <ReactAudioPlayer src={data?.audio} controls />}

            <div
                className={`${styles.image}`}
                dangerouslySetInnerHTML={{
                    __html: sanitize(nl2br(data?.description))
                }}
            />
            {data?.image && <Image src={data?.image} />}
            <div className='contribute-plus row'>{renderAnswers()}</div>
        </li>
    )
}
export default memo(Question)
