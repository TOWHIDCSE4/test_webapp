import React, { FunctionComponent } from 'react'
import Layout from 'components/Atoms/HomePage/Layout'
import LearnFor from 'components/Atoms/HomePage/LearnFor'
import HowItWorks from 'components/Atoms/HomePage/HowItWorks'
import WhyLearn from 'components/Atoms/HomePage/WhyLearn'
import TeacherTeam from 'components/Atoms/HomePage/TeacherSlider'
import News from 'components/Atoms/HomePage/News'
import Contact from 'components/Atoms/HomePage/Contact'
import Footer from 'components/Atoms/HomePage/Footer'
import Feedback from 'components/Atoms/HomePage/Feedback'
import Event from 'components/Atoms/HomePage/Event'
import First from 'components/Atoms/HomePage/First'
import Programming from 'components/Atoms/HomePage/Programming'
import WhyUsSpecial from 'components/Atoms/HomePage/WhyUsSpecial'
import FindCourse from 'components/Atoms/HomePage/findCourse'
import Comment from 'components/Atoms/HomePage/Comment'
import BookingTrial from 'components/Atoms/HomePage/BookingTrial'
import Statistic from 'components/Atoms/HomePage/Statistic'

const HomePage: FunctionComponent = () => (
    <Layout class='w-100'>
        {/* <Event /> */}
        {/* <Statistic />
        <LearnFor />
        {/* <WhyLearn />
        <News />
        <HowItWorks />
        <TeacherTeam /> */}
        {/* <Feedback /> */}
        {/* <Contact /> */}

        <div id='body_home_page'>
            <First />
            <Programming />
            <WhyUsSpecial />
            <Statistic />
            <BookingTrial />
            <Comment />
            <FindCourse />
        </div>
        <Footer />
    </Layout>
)

export default HomePage
