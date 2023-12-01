import { FC, memo } from 'react'
import { Modal } from 'antd'
import { EnumScheduledMemoType, IScheduledMemo } from 'types'
import moment from 'moment'
import { getTranslateText } from 'utils/translate-utils'
import CourseSummary from '../CourseSummary'
import MonthlySummary from '../MonthlySummary'

type Props = {
    visible: boolean
    toggleModal: (val) => void
    type: EnumScheduledMemoType
    data: IScheduledMemo
}
const ViewReportModal: FC<Props> = ({ visible, toggleModal, type, data }) => (
    <Modal
        maskClosable
        centered
        visible={visible}
        onCancel={() => toggleModal(false)}
        width={1024}
        footer={null}
        className='modalProfile'
        title={
            type === EnumScheduledMemoType.COURSE_MEMO
                ? getTranslateText('study_summary.course_report')
                : getTranslateText('study_summary.monthly_report')
        }
    >
        {type === EnumScheduledMemoType.COURSE_MEMO ? (
            <CourseSummary data={data} />
        ) : (
            type === EnumScheduledMemoType.MONTHLY_MEMO && (
                <MonthlySummary
                    month={moment()
                        .set('year', data?.year)
                        .set('month', data?.month - 1)}
                />
            )
        )}
    </Modal>
)

export default memo(ViewReportModal)
