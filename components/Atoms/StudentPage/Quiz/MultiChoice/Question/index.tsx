import _ from 'lodash'
import { FC, memo } from 'react'
import { IQuestion } from 'types'
import { nl2br, sanitize } from 'utils/string-utils'
import { Image } from 'antd'
import ReactAudioPlayer from 'react-audio-player'

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
    data: IQuestion
    onChangeAnswer: (ques_id: number, ans_id: string) => void
    userAnswers: any[]
}

const Question: FC<Props> = ({ data, onChangeAnswer, userAnswers }) => {
    const renderAnswers = () => {
        if (!_.isEmpty(data?.answers)) {
            return data?.answers.map((item, index) => (
                <label
                    className='i-dot d-block col-sm-6 col-12'
                    key={item._id}
                    style={{ color: `${item?.is_correct && 'green'}` }}
                >
                    <input
                        type='radio'
                        name={item?.label + data.id}
                        value={item?.label + data.id}
                        checked={
                            _.findIndex(
                                userAnswers,
                                (o) =>
                                    o?.answers + o.question_id ===
                                    item?.label + data.id
                            ) >= 0
                        }
                        onChange={() => onChangeAnswer(data.id, item?.label)}
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
            {data?.image && (
                <Image src={data?.image} height={300} width={300} />
            )}
            {data?.audio && <ReactAudioPlayer src={data?.audio} controls />}

            {/* {data?.name} */}
            <p
                dangerouslySetInnerHTML={{
                    __html: sanitize(nl2br(data?.description))
                }}
            />
            <div className='contribute-plus row'>{renderAnswers()}</div>
        </li>
    )
}
export default memo(Question)
