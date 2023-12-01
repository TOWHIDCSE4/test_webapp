export default function TeacherRight({ ...props }) {
    return (
        <div className='teacher-right'>
            <div className='teacher-book'>
                <div className='bookCards'>
                    <div className='bookCard-box'>
                        {/* <div className="bookCard">
                            <div className="bookCard-left">
                                <div className="bookCard-title">
                                    <span>Lessons</span>
                                </div>
                            </div>
                            <div className="bookCard-right">
                                <div className="bookCard-priceNew">
                                    <span>VND 184,181.46</span>
                                </div>
                            </div>
                            <div className="bookCard-price-from">
                                <span>FROM</span>
                            </div>
                        </div> */}
                    </div>
                    <button
                        id='schedule-lesson'
                        type='button'
                        className='ant-btn teacher-right-booknow ant-btn-secondary'
                        onClick={() => props.onBooking()}
                    >
                        <span>BOOK NOW</span>
                    </button>
                </div>
            </div>
            <style jsx>{`
                .teacher-right {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    left: auto;
                    top: auto;
                    bottom: auto;
                }
                .teacher-book {
                    width: 367px;
                    border-radius: 6px;
                    background-color: #fff;
                    box-shadow: 0 7px 25px 0 rgb(0 0 0 / 10%);
                }
                .Teacher-desktop .Teacher-main > div,
                .Teacher-desktop .teacher-right-absolute > div,
                .Teacher-desktop .teacher-right-fixed > div,
                .Teacher-desktop .teacher-right > div {
                    box-shadow: 0 2px 12px rgb(0 40 117 / 6%);
                    border-radius: 4px;
                }
                .bookCard-box {
                    padding: 5px;
                }
                .bookCard-box,
                .bookCard-left {
                    display: -webkit-flex;
                    display: flex;
                }
                .bookCard {
                    position: relative;
                    top: 0;
                    right: 0;
                }
                .bookCard {
                    width: 357px;
                    min-height: 71px;
                    padding: 0 15px;
                    border-radius: 2px;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                    -webkit-align-items: center;
                    align-items: center;
                    cursor: pointer;
                }
                .bookCard-left {
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: flex-start;
                    justify-content: flex-start;
                    -webkit-align-items: center;
                    align-items: center;
                }
                .bookCard-title {
                    font-size: 16px;
                    color: #333;
                }
                .bookCard-right {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex-direction: column;
                    flex-direction: column;
                    -webkit-justify-content: center;
                    justify-content: center;
                    -webkit-align-items: flex-end;
                    align-items: flex-end;
                }
                .bookCard-priceNew {
                    font-size: 18px;
                    font-weight: 500;
                    color: #333;
                }
                .bookCard-price-from {
                    position: absolute;
                    top: 8px;
                    right: 15px;
                    font-size: 10px;
                    color: #333;
                }
                .ant-btn {
                    position: relative;
                    display: inline-block;
                    font-weight: 500;
                    letter-spacing: 0.75px;
                    white-space: nowrap;
                    text-align: center;
                    background-image: none;
                    border: 1px solid transparent;
                    -webkit-box-shadow: none;
                    box-shadow: none;
                    cursor: pointer;
                    -webkit-transition: all 0.3s
                        cubic-bezier(0.645, 0.045, 0.355, 1);
                    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    -ms-touch-action: manipulation;
                    touch-action: manipulation;
                    text-transform: uppercase;
                    line-height: 1;
                    min-width: 80px;
                    height: 40px;
                    padding: 12px 16px;
                    font-size: 14px;
                    border-radius: 4px;
                }
                .ant-btn,
                .ant-btn:active,
                .ant-btn:focus {
                    outline: 0;
                }
                .ant-btn-secondary {
                    color: #fff;
                    background-color: #ff554b;
                    border-color: #ff554b;
                    text-shadow: none;
                    -webkit-box-shadow: none;
                    box-shadow: none;
                }
                .teacher-right-booknow {
                    width: 327px;
                    margin: 0 20px 20px;
                }
                .ant-btn > i,
                .ant-btn > span {
                    display: inline-block;
                    -webkit-transition: margin-left 0.3s
                        cubic-bezier(0.645, 0.045, 0.355, 1);
                    transition: margin-left 0.3s
                        cubic-bezier(0.645, 0.045, 0.355, 1);
                    pointer-events: none;
                }
            `}</style>
        </div>
    )
}
