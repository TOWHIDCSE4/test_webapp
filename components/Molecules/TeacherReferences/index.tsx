import React from 'react'
import styles from './TeacherReferences.module.scss'

const TeacherRefenrences = () => (
    <div className={styles.wrapper}>
        <h5 className={styles.title}>References</h5>

        <p>
            <a href='https://class.ispeak.vn/page/[for-teachers]-how-to-open-teaching-slots'>
                <span>
                    <strong>1. HOW TO OPEN TEACHING SLOTS</strong>
                </span>
            </a>
        </p>

        <p>
            <a href='https://class.ispeak.vn/page/[for-teachers]-how-to-evaluate-the-student-after-the-class-writing-a-memo'>
                <span>
                    <strong>
                        2. HOW TO EVALUATE THE STUDENT AFTER CLASS (WRITE MEMO)
                    </strong>
                </span>
            </a>
        </p>

        <p>
            <a href='https://class.ispeak.vn/page/[for-teachers]-standard-teaching-flow'>
                <span>
                    <strong>3. STANDARD TEACHING FLOW</strong>
                </span>
            </a>
        </p>

        <p>
            <a href='https://class.ispeak.vn/page/[for-teachers]--wrapping-up-the-class-with-video'>
                <span>
                    <strong>
                        4. [For Teachers] Wrapping-up the class with video
                    </strong>
                </span>
            </a>
        </p>

        <p>
            <a href='https://class.ispeak.vn/page/[for-teachers]-important!-daily-conversation-material,-assigning-and-correcting-homework'>
                <span>
                    <strong>
                        5. Daily Conversation material, Assigning and Correcting
                        your student's homework
                    </strong>
                </span>
            </a>
        </p>

        <p className={styles['red-text']}>
            <span>
                <strong>6. GUIDELINES FOR SETTING STARTING LEVEL</strong>
            </span>
        </p>

        <p className={styles['red-text']}>
            <span>
                <em>
                    <strong>&nbsp; &nbsp; 6.1. For Adults</strong>
                </em>
            </span>
        </p>

        <p className={styles['red-text']}>
            <span>
                <em>
                    <strong>
                        &nbsp; &nbsp;6.2. For Children (7-12 year old)
                    </strong>
                </em>
            </span>
        </p>

        <p>
            <span>
                Please ask the students or share your screen the relevant
                textbooks, based on his/her level and previous class: The link
                to textbook can be found at:{' '}
            </span>
            <a href='https://class.ispeak.vn/page/english-for-children'>
                https://class.ispeak.vn/page/english-for-children
            </a>
        </p>

        <p>
            <span>
                <strong>
                    <a href='https://class.ispeak.vn/page/guidelines-to-conduct-the-trial-level-test-class'>
                        <span>GUIDELINES TO TEACH TRIAL CLASSES</span>
                    </a>
                </strong>
            </span>
        </p>

        <p className={styles['red-text']}>
            <span>
                <strong>OTHER IMPORTANT FILES</strong>
            </span>
        </p>

        <p>
            <strong>
                <a href='https://www.mediafire.com/folder/v4zjfp5vabp6b/AAVTP'>
                    American Accent Video Training
                    Program(Pronunciationworkshop)
                </a>
            </strong>
        </p>

        <p>
            <strong>
                <a href='https://www.mediafire.com/folder/ybew89wytgsz3/AAT'>
                    American Accent Training
                </a>
                &nbsp; <span className={styles['gray-text']}>(AUDIO)</span>
            </strong>
        </p>
    </div>
)

export default TeacherRefenrences
