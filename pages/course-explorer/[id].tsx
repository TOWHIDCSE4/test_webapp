import React from 'react'
import Layout from 'components/Atoms/HomePage/Layout'
import CourseDetail from 'components/Atoms/CourseExplorerPage/CourseDetail'
import Footer from 'components/Atoms/HomePage/Footer'

const Index = () => (
    <>
        <Layout />
        <CourseDetail />
        <div style={{ paddingTop: '90px' }}>
            <Footer />
        </div>
    </>
)

export default Index
