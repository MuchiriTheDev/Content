import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { MdArrowLeft, MdClose, MdMenu } from 'react-icons/md';
import { FaHome, FaPhoneAlt, FaQuestion, FaRegUser } from 'react-icons/fa';
import { GrServices } from 'react-icons/gr';
import { RiHotelLine } from 'react-icons/ri';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const [sidebar, showSidebar] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full z-30 h-fit p-6 md:px-8 flex justify-between items-center ${scrolling ? 'bg-white' : 'bg-transparent'} transition-all duration-300`}>
      {/* Logo */}
      <div className="flex justify-center items-center gap-3 md:w-1/4 px-4">
        <img className='h-16 w-fit' src={assets.logo} alt="" />
        <h1 className={`lg:text-2xl text-nowrap text-base font-bold ${scrolling ? 'text-brown' : 'text-white'}`}>Making <span className='text-appleGreen'>| Sents</span></h1>
      </div>

      {/* Nav items */}
      <div className="w-2/3 p-3 h-full hidden md:flex justify-center items-center gap-2 lg:gap-6">
        <ScrollLink className={`w-32 mx-3 font-medium transition-all lg:text-sm text-xs duration-150 ${scrolling ? 'text-brown' : 'text-white'} hover:text-brown`}
          to="home" smooth={true} duration={500} offset={-100}>
          Home
        </ScrollLink>
        <ScrollLink className={`max-w-32 lg:w-32 w-fit text-nowrap mx-3 font-medium transition-all lg:text-sm text-xs duration-150 ${scrolling ? 'text-brown' : 'text-white'} hover:text-brown`}
          to="about" smooth={true} duration={500} offset={-100}>
          About Us
        </ScrollLink>
        <ScrollLink className={`w-32 mx-3 font-medium transition-all lg:text-sm text-xs duration-150 ${scrolling ? 'text-brown' : 'text-white'} hover:text-brown`}
          to="services" smooth={true} duration={500} offset={-100}>
          Services
        </ScrollLink>
        <ScrollLink className={`w-32 mx-3 font-medium transition-all lg:text-sm text-xs duration-150 ${scrolling ? 'text-brown' : 'text-white'} hover:text-brown`}
          to="testimonials" smooth={true} duration={500} offset={-100}>
          Testimonials
        </ScrollLink>
        <ScrollLink className={`w-32 mx-3 font-medium transition-all lg:text-sm text-xs duration-150 ${scrolling ? 'text-brown' : 'text-white'} hover:text-brown`}
          to="faqs" smooth={true} duration={500} offset={-100}>
          FAQs
        </ScrollLink>
        <ScrollLink className={'text-white text-nowrap font-semibold lg:text-sm text-xs py-3 px-2 w-44 bg-appleGreen text-center'}
          to="contact" smooth={true} duration={500} offset={-100}>
          Contact Us
        </ScrollLink>
      </div>

      {/* Sidebar toggle */}
      <div onClick={() => showSidebar(!sidebar)} className="md:hidden block z-10">
        {sidebar ? (
          <MdClose className='w-fit h-10 text-white' />
        ) : (
          <MdMenu className='w-fit h-10' />
        )}
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 ${sidebar ? "right-0" : '-right-full'} md:hidden block p-5 transition-all duration-200 w-full bg-gradient-to-b from-[#4f391a9a] to-transparent backdrop-blur-md h-full`}>
        <ScrollLink onClick={() => showSidebar(false)} className={'w-full text-white flex items-center gap-2 py-10 h-12 text-xl font-bold mb-10'}
          to="home" smooth={true} duration={500} offset={-100}>
          <MdArrowLeft className='w-fit h-10' />
          <p>Back</p>
        </ScrollLink>
        <div className="w-full p-3 flex flex-col items-center">
          <ScrollLink onClick={() => showSidebar(false)} className={`text-white flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg`}
            to="home" smooth={true} duration={500} offset={-100}>
            <FaHome />
            <p>Home</p>
          </ScrollLink>
          <ScrollLink onClick={() => showSidebar(false)} className={`text-white flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg`}
            to="about" smooth={true} duration={500} offset={-100}>
            <RiHotelLine />
            <p>About Us</p>
          </ScrollLink>
          <ScrollLink onClick={() => showSidebar(false)} className={`text-white flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg`}
            to="services" smooth={true} duration={500} offset={-100}>
            <GrServices />
            <p>Services</p>
          </ScrollLink>
          <ScrollLink onClick={() => showSidebar(false)} className={`text-white flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg`}
            to="testimonials" smooth={true} duration={500} offset={-100}>
            <FaRegUser />
            <p>Testimonials</p>
          </ScrollLink>
          <ScrollLink onClick={() => showSidebar(false)} className={`text-white flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg`}
            to="faqs" smooth={true} duration={500} offset={-100}>
            <FaQuestion />
            <p>FAQs</p>
          </ScrollLink>
          <ScrollLink onClick={() => showSidebar(false)} className={`text-white flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg`}
            to="contact" smooth={true} duration={500} offset={-100}>
            <FaPhoneAlt />
            <p>Contact Us</p>
          </ScrollLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
