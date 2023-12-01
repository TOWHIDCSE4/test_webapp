import _ from 'lodash'
import { FC, memo } from 'react'
import { getTranslateText } from 'utils/translate-utils'
import cn from 'classnames'
import { Statistic, Modal } from 'antd'
import { IQuiz } from 'types'
import moment from 'moment'
import { EnumQuizSessionStatus } from 'const'

const { Countdown } = Statistic

type Props = {
    questions: any[]
    answers: any[]
    quizSession: IQuiz
    onSubmit: () => void
    onStartDoAgain: () => void
}

const Result: FC<Props> = ({
    questions,
    answers,
    quizSession,
    onSubmit,
    onStartDoAgain
}) => {
    const deadline = quizSession?.end_time
        ? moment(quizSession?.end_time).valueOf()
        : moment().valueOf()
    const renderQuestionCircle = () => {
        if (!_.isEmpty(questions)) {
            return _.sortBy(questions, 'display_order').map(
                (question, index) => (
                    <li
                        className={cn(
                            'd-flex justify-content-center',
                            quizSession.status ===
                                EnumQuizSessionStatus.DOING &&
                                _.findIndex(
                                    answers,
                                    (o) => o?.question_id === question?.id
                                ) >= 0
                                ? 'current'
                                : [
                                      EnumQuizSessionStatus.FAIL,
                                      EnumQuizSessionStatus.PASS
                                  ].includes(quizSession.status) &&
                                  _.find(
                                      quizSession.questions,
                                      (o) => o.id === question?.id
                                  )?.is_correct === true
                                ? 'correct'
                                : [
                                      EnumQuizSessionStatus.FAIL,
                                      EnumQuizSessionStatus.PASS
                                  ].includes(quizSession.status) &&
                                  _.find(
                                      quizSession.questions,
                                      (o) => o.id === question?.id
                                  )?.is_correct === false
                                ? 'wrong'
                                : ''
                        )}
                        key={index}
                    >
                        <p>{question?.display_order}</p>
                    </li>
                )
            )
        }
    }

    const onFinish = () => {
        Modal.confirm({
            content: <p>{getTranslateText('quiz.warning_submit')}</p>,
            onOk() {
                onSubmit()
            },
            okText: getTranslateText('quiz.submit_result')
        })
    }

    const handleSubmit = () => {
        if (
            [EnumQuizSessionStatus.FAIL, EnumQuizSessionStatus.PASS].includes(
                quizSession.status
            )
        ) {
            onStartDoAgain()
        } else {
            Modal.confirm({
                content: <p>{getTranslateText('quiz.confirm_submit')}</p>,
                onOk() {
                    onSubmit()
                },
                okText: getTranslateText('quiz.submit_result')
            })
        }
    }
    return (
        <div className='card exam-card'>
            <div className='body p-0'>
                <div className='row text-center mb-3'>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-12 exam-text-big'>
                        <p>{getTranslateText('quiz.done_sentences')}</p>
                        <b>
                            {answers.length}/{questions.length}
                        </b>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-12 exam-text-big'>
                        {quizSession.status === EnumQuizSessionStatus.DOING ? (
                            <>
                                <p>{getTranslateText('quiz.time')}</p>
                                <b>
                                    <Countdown
                                        value={deadline}
                                        onFinish={onFinish}
                                    />
                                </b>
                            </>
                        ) : (
                            <>
                                <p>{getTranslateText('quiz.score')}</p>
                                <b
                                    style={{
                                        color: `${
                                            quizSession.status ===
                                            EnumQuizSessionStatus.FAIL
                                                ? '#f15179'
                                                : quizSession.status ===
                                                      EnumQuizSessionStatus.PASS &&
                                                  '#36cb7c'
                                        }`
                                    }}
                                >
                                    {quizSession.user_score}/{quizSession.score}
                                </b>
                            </>
                        )}
                    </div>
                </div>
                <div className='list-result scroll-block'>
                    <ul>{renderQuestionCircle()}</ul>
                    <div className='clearfix' />
                </div>
                <button
                    className='btn my-2 my-sm-0 big-bt big-bt2'
                    type='button'
                    onClick={handleSubmit}
                >
                    <span className='color-white'>
                        {[
                            EnumQuizSessionStatus.FAIL,
                            EnumQuizSessionStatus.PASS
                        ].includes(quizSession.status)
                            ? getTranslateText('quiz.do_again')
                            : getTranslateText('quiz.submit_result')}
                    </span>
                    <img
                        src='/static/img/homepage/bt.png'
                        alt='Submit result'
                    />
                </button>
                <ul className='exam-des'>
                    <li>
                        <p> </p>
                        <span>
                            {getTranslateText('quiz.not_done_sentence')}
                        </span>
                    </li>
                    <li>
                        <p className='current'> </p>
                        <span>{getTranslateText('quiz.done_sentence')}</span>
                    </li>
                    <li>
                        <p className='correct'> </p>
                        <span>{getTranslateText('quiz.correct_sentence')}</span>
                    </li>
                    <li>
                        <p className='wrong'> </p>
                        <span>{getTranslateText('quiz.wrong_sentence')}</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default memo(Result)
