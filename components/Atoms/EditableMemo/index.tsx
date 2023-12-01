import React, { useContext, useState, useEffect, useRef, FC } from 'react'
import { Table, Input, Button, Popconfirm, Form, InputNumber } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { ColumnsType } from 'antd/lib/table'
import cn from 'classnames'
import { getTranslateText } from 'utils/translate-utils'
import { EnumCommentType, EnumScheduledMemoType, IScheduledMemo } from 'types'
import _ from 'lodash'
import { calculateClassification } from 'utils/string-utils'
import { TEACHER_SCHEDULED_MEMO_FIELD } from 'const'
import CommentSuggestionAPI from 'api/CommentSuggestionAPI'
import styles from './Editable.module.scss'

const EditableContext = React.createContext<FormInstance<any> | null>(null)
interface IMemo {
    key: string
    name: string
    point: number
}

interface EditableRowProps {
    index: number
}

const EditableRow: FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    inputType,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const form = useContext(EditableContext)
    useEffect(() => {
        if (editing) {
            inputRef.current!.focus()
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing)
        form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    useEffect(() => {
        if (record && !_.isEmpty(record)) {
            form.setFieldsValue({ [dataIndex]: record[dataIndex] })
        }
    }, [inputRef])

    const save = async () => {
        try {
            const values = await form.validateFields()
            toggleEdit()
            handleSave({ ...record, ...values })
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }
    let childNode = children
    if (editable) {
        childNode = TEACHER_SCHEDULED_MEMO_FIELD.includes(record.key) ? (
            editing ? (
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} ${getTranslateText(
                                'is_required'
                            )}`
                        }
                    ]}
                >
                    {dataIndex === 'comment' ? (
                        <Input
                            ref={inputRef}
                            onBlur={save}
                            className={cn(styles['editable-input'])}
                        />
                    ) : (
                        <Input
                            ref={inputRef}
                            onBlur={save}
                            className={cn(styles['editable-input'])}
                        />
                    )}
                </Form.Item>
            ) : (
                <Input
                    value={record[dataIndex]}
                    onClick={toggleEdit}
                    className={cn(styles['editable-input'])}
                />
            )
        ) : (
            <span className={cn(styles.classification)}>{children}</span>
        )
    }

    return (
        <td {...restProps} className='p-2' style={{ verticalAlign: 'middle' }}>
            {!TEACHER_SCHEDULED_MEMO_FIELD.includes(record?.key) &&
            dataIndex === 'comment' ? (
                <span className={cn(styles.classification)}>{children}</span>
            ) : (
                <span>{childNode}</span>
            )}
        </td>
    )
}

type ColumnTypes = Exclude<Parameters<typeof Table>[0]['columns'], undefined>

type Props = {
    data: IScheduledMemo
    onChangeAssessment: (val) => void
    memoType: EnumScheduledMemoType
}

const EditableTableMemo: FC<Props> = ({
    data,
    onChangeAssessment,
    memoType
}) => {
    const [dataSource, setDataSource] = useState([
        {
            key: 'attendance',
            name: getTranslateText('memo.attendance'),
            none: getTranslateText('memo.attendance'),
            point: 0,
            comment: ''
        },
        {
            key: 'attitude',
            name: getTranslateText('memo.attitude'),
            none: getTranslateText('memo.attitude'),
            point: 0,
            comment: ''
        },
        {
            key: 'homework',
            name: getTranslateText('memo.homework'),
            none: getTranslateText('memo.homework'),
            point: 0,
            comment: ''
        },
        {
            key: 'listening',
            name: getTranslateText('trial_memo.listening'),
            none: getTranslateText('examination'),
            point: 0,
            comment: ''
        },
        {
            key: 'speaking',
            name: getTranslateText('trial_memo.speaking'),
            none: getTranslateText('trial_memo.speaking'),
            point: 0,
            comment: ''
        },
        {
            key: 'reading',
            name: getTranslateText('trial_memo.reading'),
            none: getTranslateText('trial_memo.reading'),
            point: 0,
            comment: ''
        },
        {
            key: 'writing',
            name: getTranslateText('trial_memo.writing'),
            none: getTranslateText('trial_memo.writing'),
            point: 0,
            comment: ''
        },
        {
            key: 'exam_result',
            name: getTranslateText('memo.avg_score'),
            none: getTranslateText('memo.avg_score'),
            point: 0,
            comment: ''
        },
        {
            key: 'avg_monthly',
            name: getTranslateText('memo.avg_monthly'),
            none: getTranslateText('memo.avg_monthly'),
            point: 0,
            comment: ''
        }
    ])

    const fetchCommentSuggestion = (keyword: string, point: number) =>
        CommentSuggestionAPI.getRandomCommentSuggestion({
            keyword,
            point,
            type:
                memoType === EnumScheduledMemoType.COURSE_MEMO
                    ? EnumCommentType.COURSE_MEMO
                    : EnumCommentType.MONTHLY_MEMO
        }).then((res) => res.data)

    useEffect(() => {
        async function fetchData() {
            if (!_.isEmpty(data)) {
                let newDataSource = [...dataSource]
                let avg_monthly = 0
                newDataSource = await Promise.all(
                    newDataSource.map(async (item) => {
                        const val: any = _.get(data, item.key)
                        const tmp = {
                            ...item,
                            point: val ? val.point : 0,
                            comment: val ? val.comment : ''
                        }
                        if (!tmp.comment) {
                            if (
                                TEACHER_SCHEDULED_MEMO_FIELD.includes(tmp.key)
                            ) {
                                const memoSuggest =
                                    await fetchCommentSuggestion(
                                        tmp.key,
                                        tmp.point
                                    )
                                if (memoSuggest) {
                                    tmp.comment = memoSuggest?.en_comment
                                }
                            }
                        }
                        if (item.key === 'exam_result') {
                            tmp.point = _.get(data, item.key)
                            avg_monthly += tmp.point
                        } else if (item.key !== 'avg_monthly') {
                            avg_monthly += tmp.point
                        } else {
                            tmp.point = _.round(avg_monthly / 4, 2).toFixed(2)
                            tmp.comment = `${getTranslateText(
                                'memo.classification'
                            )}: ${calculateClassification(tmp.point)}
                        `
                        }
                        return tmp
                    })
                )
                setDataSource(newDataSource)
                onChangeAssessment(newDataSource)
            }
        }
        fetchData()
    }, [data])
    const handleSave = async (row: any) => {
        const newData = [...dataSource]
        const index = newData.findIndex((item) => row.key === item.key)
        const item = newData[index]
        newData.splice(index, 1, {
            ...item,
            ...row
        })
        if (row.point !== item.point) {
            const memoSuggest = await fetchCommentSuggestion(row.key, row.point)
            if (memoSuggest) {
                row.comment = memoSuggest?.en_comment
            } else {
                row.comment = ''
            }
        }
        setDataSource(newData)
        onChangeAssessment(newData)
    }
    const sharedOnCell = (none, index) => {
        if (index < 3 || index === 8) {
            return { colSpan: 0 }
        }
    }
    const columns: any = [
        {
            title: getTranslateText('memo.criterions'),
            dataIndex: 'none',
            editable: false,
            disabled: true,
            width: '15%',
            colSpan: 2,
            onCell: (none, index) => {
                if (index < 3 || index === 8) {
                    return { colSpan: 2 }
                }
                // // These two are merged into above cell
                if (index === 3) {
                    return { rowSpan: 5 }
                }
                if ([4, 5, 6, 7].includes(index)) {
                    return { rowSpan: 0 }
                }
            }
        },
        {
            title: getTranslateText('memo.criterions'),
            dataIndex: 'name',
            colSpan: 0,
            editable: false,
            disabled: true,
            width: '20%',
            onCell: sharedOnCell
        },
        {
            title: getTranslateText('memo.score'),
            dataIndex: 'point',
            editable: false,
            inputType: 'number',
            width: '20%'
        },
        {
            title: getTranslateText('memo.comment'),
            dataIndex: 'comment',
            editable: !data?.teacher_commented,
            inputType: 'text',
            width: '50%'
        }
    ]
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    }
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            if (col.dataIndex === 'comment') {
                return {
                    ...col,
                    onCell: (record: IMemo) => ({
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: true
                    })
                }
            }
            return col
        }
        return {
            ...col,
            onCell: (record: IMemo) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: true,
                handleSave
            })
        }
    })

    return (
        <div>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={mergedColumns}
                pagination={false}
            />
        </div>
    )
}

export default EditableTableMemo
