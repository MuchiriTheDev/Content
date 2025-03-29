import React from 'react';
import Title from './Title';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className='w-full p-3 py-5' id='about'>
      <Title 
        head='About Us' 
        subHead='Empowering entrepreneurs with financial education.' 
      />
      <div className="flex justify-center items-center md:flex-row flex-col w-full h-fit lg:h-[70vh]">
        {/* Left side */}
        <div className="md:w-1/2 w-full flex justify-center items-center h-full mb-3">
          <motion.img
            initial={{x:-100, opacity:0}}
            whileInView={{x:0, opacity: 1}}
            transition={{duration:0.7 , delay: 0.3}} 
            className='w-fit h-full' src={assets.about} alt="About Us" />
        </div>
        {/* Right side */}
        <div className="md:w-1/2 w-full h-full p-3">
          <motion.h1
            initial={{x:250, opacity:0}}
            whileInView={{x:0, opacity: 1}}
            transition={{duration:0.7 , delay: 0.3}}
           className='text-lg lg:text-2xl mb-2 text-brown font-bold'>
            What We Do
          </motion.h1>
          <motion.p 
            initial={{x:250, opacity:0}}
            whileInView={{x:0, opacity: 1}}
            transition={{duration:0.7 , delay: 0.5}}
            className='mb-4 text-sm lg:text-base'>
            At Making Sents, we believe that every entrepreneur deserves access to high-quality financial education and tools to succeed. Founded with a vision to bridge the financial literacy gap, we offer practical, affordable, and convenient resources to help individuals and small businesses thrive.
          </motion.p>
          <motion.p 
            initial={{x:250, opacity:0}}
            whileInView={{x:0, opacity: 1}}
            transition={{duration:0.7 , delay: 0.6}}
            className='mb-4 text-sm lg:text-base'>
            We set out to equip budding entrepreneurs with the financial knowledge and tools they need to make sound decisions and meet their business objectives. Whether you’re just starting out or looking to scale, our wide range of offerings ensures that there’s something for everyone.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default About;
