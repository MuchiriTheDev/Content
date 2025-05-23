import React from 'react'
import Navbar from '../../Resources/Navbar'
import Hero from '../../Component/LandingPageComponent/Hero'
import About from '../../Component/LandingPageComponent/About'
import WhyUs from '../../Component/LandingPageComponent/WhyUs'
import Testimonials from '../../Component/LandingPageComponent/Testimonials'
import Services from '../../Component/LandingPageComponent/Services'
import Contact from '../../Resources/Contact'
import FAQs from '../../Component/LandingPageComponent/FAQs'
import Footer from '../../Resources/Footer'
import HowToApply from '../../Component/LandingPageComponent/HowToApply'


const LandingPage = () => {
  return (
    <div className='h-fit max-w-[100vw] overflow-x-hidden'>
        <Navbar/>
        <Hero/>
        <About/>
        <WhyUs/>
        <Services/>
        <Testimonials/>
        <FAQs/>
        <HowToApply />
        <Contact/>
        <Footer/>
    </div>
  )
}

export default LandingPage