import React from 'react'
import Navbar from '../Component/Navbar'
import Footer from '../Component/Footer'
import Hero from '../Component/Hero'
import About from '../Component/About'
import WhyUs from '../Component/WhyUs'
import Testimonials from '../Component/Testimonials'
import Services from '../Component/Services'
import Contact from '../Component/Contact'
import FAQs from '../Component/FAQs'


const LandingPage = () => {
  return (
    <div className='h-fit max-w-screen'>
        <Navbar/>
        <Hero/>
        <About/>
        <WhyUs/>
        <Services/>
        <Testimonials/>
        <FAQs/>
        <Contact/>
        <Footer/>
    </div>
  )
}

export default LandingPage