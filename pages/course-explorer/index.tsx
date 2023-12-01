import React from 'react'
import Layout from 'components/Atoms/HomePage/Layout'
import CourseExplorerPage from 'components/Atoms/CourseExplorerPage'
import Footer from 'components/Atoms/HomePage/Footer'

const Index = () => (
    <>
        <Layout />
        <CourseExplorerPage />
        <div style={{ paddingTop: '90px' }}>
            <Footer />
        </div>
    </>
)

export default Index
