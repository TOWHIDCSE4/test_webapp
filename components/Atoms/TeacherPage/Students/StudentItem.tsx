import React, { memo } from 'react'
import { Table, TableColumnsType } from 'antd'
import _ from 'lodash'
import { calculateClassification } from 'utils/string-utils'
import { IScheduledMemo, IStudent } from 'types'
import { getTranslateText } from 'utils/translate-utils'

type StudentItemProps = {
    student: IStudent
    memos: IScheduledMemo[]
}
const getAvgPoint = (memoItem: IScheduledMemo) =>
    _.round(
        _.mean(
            [
                memoItem.attendance.point,
                memoItem.attitude.point,
                memoItem.homework.point,
                memoItem.exam_result
            ].filter((point) => _.isFinite(point))
        ),
        2
    )
const StudentItem = ({ student, memos }: StudentItemProps) => {
    const columns: TableColumnsType<IScheduledMemo> = [
        {
            title: getTranslateText('common.month'),
            key: 'month',
            render: (val, record) =>
                [record.month, record.year].filter((v) => v).join('-')
        },
        {
            title: getTranslateText('table.header.attitude'),
            dataIndex: ['attendance', 'point']
        },
        {
            title: getTranslateText('table.header.attendance'),
            dataIndex: ['attitude', 'point']
        },
        {
            title: getTranslateText('table.header.homework'),
            dataIndex: ['homework', 'point']
        },
        {
            title: getTranslateText('table.header.exam_result'),
            dataIndex: 'exam_result'
        },
        {
            title: getTranslateText('table.header.avg_monthly'),
            key: 'avg',
            render: (val, record) => getAvgPoint(record)
        },
        {
            title: getTranslateText('table.header.classification'),
            key: 'avg',
            render: (val, record) =>
                calculateClassification(getAvgPoint(record))
        }
    ]
    const dataSource =
        memos.length < 2
            ? memos
            : [
                  ...memos,
                  {
                      month: 'Trung bình',
                      attendance: {
                          point: _.round(
                              _.mean(memos.map((m) => m.attendance.point)),
                              2
                          )
                      },
                      attitude: {
                          point: _.round(
                              _.mean(memos.map((m) => m.attitude.point)),
                              2
                          )
                      },
                      homework: {
                          point: _.round(
                              _.mean(memos.map((m) => m.homework.point)),
                              2
                          )
                      },
                      exam_result: _.round(
                          _.mean(memos.map((m) => m.exam_result)),
                          2
                      )
                  }
              ]

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                scroll={{ x: 900 }}
            />
        </>
    )
}

export default memo(StudentItem)
