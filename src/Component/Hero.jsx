import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { MdArrowLeft, MdArrowRight } from 'react-icons/md'
import { motion } from 'framer-motion'
import { Link as ScrollLink } from 'react-scroll';

const Hero = () => {
  return (
    <div
      style={{
        background: `url(${assets.hero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      className='w-full h-screen relative'
      id='home'
    >
      <div className="absolute top-0 right-0 left-0 bottom-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-[#4f391a9a] to-transparent backdrop-blur-sm">
        <div className="md:w-1/2 h-fit text-center px-4 md:px-0">
          <motion.h1 
          initial={{y: 50, opacity: 0}}
          whileInView={{y: 1, opacity: 1}}
          transition={{
            duration: 0.5,
            delay: 0.6,
          }}
          className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-4">
            Making <span className='text-yellowGreen'>| Sents</span>
          </motion.h1>
          <motion.p 
            initial={{y: 50, opacity: 0}}
            whileInView={{y: 1, opacity: 1}}
            transition={{
              duration: 0.5,
              delay: 0.8,
            }}
            className="text-sm md:text-lg font-medium text-slate-200 mb-6">
            Empowering your financial future with affordable, tailored resources, practical tools, and accessible learning for all entrepreneurs.
          </motion.p>
          <motion.div
            initial={{y: 50, opacity: 0}}
            whileInView={{y: 1, opacity: 1}}
            transition={{
              duration: 0.8,
              delay: 1,
            }} 
            className="w-full flex justify-center items-center">
            <ScrollLink className={`h-14 w-fit px-6 py-4 rounded-md shadow-md font-bold bg-appleGreen flex justify-center items-center gap-2 text-base text-white`}
              to="services" smooth={true} duration={500} offset={-100}>
              <p>Explore Our Services</p> 
              <MdArrowRight className='text-xl h-full'/>
            </ScrollLink>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero

