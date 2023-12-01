import TeacherLeft from './TeacherLeft'
import TeacherRight from './TeacherRight'

export default function DetailTeacher({ ...props }) {
    return (
        <div className='Teacher Teacher-desktop'>
            <TeacherLeft {...props} />
            <TeacherRight {...props} />
            <style jsx>{`
                .Teacher-desktop.Teacher,
                .Teacher-mobile.Teacher,
                .Teacher-tablet.Teacher {
                    font-size: 14px;
                    color: #333;
                }
                .Teacher-desktop.Teacher {
                    margin: 0 auto;
                    position: relative;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-flex: 1 1;
                    flex: 1 1;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -webkit-justify-content: flex-start;
                    justify-content: flex-start;
                    -webkit-align-items: flex-start;
                    align-items: flex-start;
                }
            `}</style>
        </div>
    )
}
