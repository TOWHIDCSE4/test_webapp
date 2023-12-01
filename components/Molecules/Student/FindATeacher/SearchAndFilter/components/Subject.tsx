/* eslint-disable jsx-a11y/label-has-associated-control */
export default function Subject({ ...props }) {
    const { subjects, subject_ids } = props

    const onSelectSubject = (id) => {
        if (props.onSelectSubject) {
            props.onSelectSubject(id)
        }
    }

    const _renderSubjects = () => {
        if (subjects.length > 0) {
            return subjects.map((item, index) => (
                <label
                    className={`filter-checkbox ant-checkbox-wrapper${
                        subject_ids.includes(item.id)
                            ? ' ant-checkbox-wrapper-checked'
                            : ''
                    }`}
                    key={index}
                    onClick={() => onSelectSubject(item.id)}
                >
                    <span
                        className={`ant-checkbox${
                            subject_ids.includes(item.id)
                                ? ' ant-checkbox-checked'
                                : ''
                        }`}
                    >
                        {/* <input type="checkbox" className="ant-checkbox-input" value="" /> */}
                        <span className='ant-checkbox-inner' />
                    </span>
                    <span>
                        <span>{item.name}</span>
                    </span>
                </label>
            ))
        }
    }

    const clearFilter = () => {
        if (props.onClearFilter) {
            props.onClearFilter('subject_ids')
        }
    }

    const applyFilter = () => {
        if (props.onApplyFilter) {
            props.onApplyFilter()
        }
    }
    return (
        <div className='filter-container' style={{ width: '280px' }}>
            <div className='filter-body'>
                <div>
                    <div className='filter-from'>
                        {_renderSubjects()}
                        {/* <p className="flex filter-from-all-languages justify-center items-center">
                            <span data-cy="ts_showmore">Show More</span>
                            <svg height="24" viewBox="0 0 24 24" width="24"
                                xmlns="http://www.w3.org/2000/svg" fill="#8C8C8C">
                                <path clip-rule="evenodd" d="M7.97 9.97a.75.75 0 011.06 0L12 12.94l2.97-2.97a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06z" fill-rule="evenodd"></path>
                            </svg>
                        </p> */}
                    </div>
                    <div className='filter-footer'>
                        {subject_ids.length > 0 ? (
                            <button
                                type='button'
                                className='ant-btn filter-clear-btn ant-btn-default ant-btn-sm'
                                onClick={clearFilter}
                            >
                                <span data-cy='ts_clear'>Clear</span>
                            </button>
                        ) : null}

                        <button
                            type='button'
                            className='ant-btn filter-apply-btn ant-btn-primary ant-btn-sm'
                            onClick={applyFilter}
                        >
                            <span data-cy='ts_apply'>Apply</span>
                        </button>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .filter-container {
                    position: fixed;
                    margin-top: 13px;
                    max-width: 375px;
                    min-width: 280px;
                    transition: top 0.2s;
                    background: #fff;
                    border-radius: 4px;
                }
                .filter-section .filter-container {
                    -webkit-transform: translateX(-25%);
                    transform: translateX(-25%);
                }
                .filter-section:first-child .filter-container {
                    -webkit-transform: translateX(0);
                    transform: translateX(0);
                    width: 280px;
                }
                .filter-body {
                    background: #fff;
                    border-radius: 4px;
                }
                .filter-from {
                    padding: 8px 16px 0;
                    max-height: 60vh;
                    overflow-y: auto;
                }
                .ant-checkbox-wrapper {
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    color: #4d4d4d;
                    font-size: 14px;
                    font-variant: normal;
                    line-height: 1.5715;
                    list-style: none;
                    -webkit-font-feature-settings: normal;
                    font-feature-settings: normal;
                    display: inline-block;
                    line-height: unset;
                    cursor: pointer;
                }
                .filter-checkbox {
                    display: -webkit-flex;
                    display: flex;
                    height: 40px;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .ant-checkbox {
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    color: #4d4d4d;
                    font-size: 14px;
                    font-variant: normal;
                    line-height: 1.5715;
                    list-style: none;
                    -webkit-font-feature-settings: normal;
                    font-feature-settings: normal;
                    position: relative;
                    top: -0.09em;
                    display: inline-block;
                    line-height: 1;
                    white-space: nowrap;
                    vertical-align: middle;
                    outline: none;
                    cursor: pointer;
                }
                .filter-checkbox .ant-checkbox {
                    margin-top: 2px;
                }
                .ant-checkbox-input {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    opacity: 0;
                }
                [role='button'],
                a,
                area,
                button,
                input:not([type='range']),
                label,
                select,
                summary,
                textarea {
                    -ms-touch-action: manipulation;
                    touch-action: manipulation;
                }
                input[type='checkbox'],
                input[type='radio'] {
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    padding: 0;
                }
                .ant-checkbox-inner {
                    position: relative;
                    top: 0;
                    left: 0;
                    display: block;
                    width: 18px;
                    height: 18px;
                    background-color: #fff;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    border-collapse: separate;
                    -webkit-transition: all 0.3s;
                    transition: all 0.3s;
                }
                .ant-checkbox-inner:after {
                    position: absolute;
                    top: 50%;
                    left: 22%;
                    display: table;
                    width: 6.42857143px;
                    height: 10.28571429px;
                    border: 2px solid #fff;
                    border-top: 0;
                    border-left: 0;
                    -webkit-transform: rotate(45deg) scale(0)
                        translate(-50%, -50%);
                    transform: rotate(45deg) scale(0) translate(-50%, -50%);
                    opacity: 0;
                    -webkit-transition: all 0.1s
                            cubic-bezier(0.71, -0.46, 0.88, 0.6),
                        opacity 0.1s;
                    transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6),
                        opacity 0.1s;
                    content: ' ';
                }
                .ant-checkbox + span {
                    padding-right: 8px;
                    padding-left: 8px;
                }
                .filter-from-all-languages {
                    margin-bottom: 16px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #8c8c8c;
                    cursor: pointer;
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 0.75px;
                }
                .filter-footer {
                    position: relative;
                    display: -webkit-flex;
                    display: flex;
                    height: 56px;
                    padding: 16px;
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    -webkit-align-items: center;
                    align-items: center;
                    -webkit-justify-content: flex-end;
                    justify-content: flex-end;
                    border-top: 1px solid #e9e9eb;
                    background: #fff;
                    border-radius: 4px;
                }
                button.filter-apply-btn {
                    margin-left: 16px;
                }
                .ant-checkbox-checked .ant-checkbox-inner {
                    background-color: #00bfbd;
                    border-color: #00bfbd;
                }
                .ant-checkbox-input:focus + .ant-checkbox-inner,
                .ant-checkbox-wrapper:hover .ant-checkbox-inner,
                .ant-checkbox:hover .ant-checkbox-inner {
                    border-color: #00bfbd;
                }
                .ant-checkbox-checked .ant-checkbox-inner:after {
                    position: absolute;
                    display: table;
                    border: 2px solid #fff;
                    border-top: 0;
                    border-left: 0;
                    -webkit-transform: rotate(45deg) scale(1)
                        translate(-50%, -50%);
                    transform: rotate(45deg) scale(1) translate(-50%, -50%);
                    opacity: 1;
                    -webkit-transition: all 0.2s
                        cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
                    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46)
                        0.1s;
                    content: ' ';
                }
                .ant-checkbox-checked:after {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 1px solid #00bfbd;
                    border-radius: 4px;
                    visibility: hidden;
                    -webkit-animation: antCheckboxEffect 0.36s ease-in-out;
                    animation: antCheckboxEffect 0.36s ease-in-out;
                    -webkit-animation-fill-mode: backwards;
                    animation-fill-mode: backwards;
                    content: '';
                }
            `}</style>
        </div>
    )
}
