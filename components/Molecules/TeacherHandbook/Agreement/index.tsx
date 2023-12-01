import React from 'react'
import { merge } from 'lodash'
import {
    HandbookSidebar,
    HandbookContent
} from 'components/Atoms/TeacherPage/TeacherHandbook'
import sideBarItems from './sideBarItems'
import contentItems from './contentItems'

const items = merge(sideBarItems, contentItems).reduce((acc, i) => {
    if (i.elementId) acc.push(i)
    return acc
}, [])

const Agreement = () => (
    <div className='flex'>
        <HandbookSidebar sideBarItems={sideBarItems} />
        {/* @ts-ignore -- A correct type will be given after merging sideBarItems and contentItems  */}
        <HandbookContent contentItems={items} />
    </div>
)

export default Agreement
