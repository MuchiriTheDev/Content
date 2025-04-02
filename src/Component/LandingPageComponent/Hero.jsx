import React from 'react';
import { assets } from '../../assets/assets'; // Image of a creator in action (filming, editing)
import { MdArrowRight } from 'react-icons/md';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { FaExclamation } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section
      style={{
        background: `url(${assets.hero})`, // Vibrant creator scene
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      className="w-full min-h-screen h-fit relative"
      id="home"
    >
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#4f391a9a] to-transparent backdrop-blur-sm">
        <div className="md:w-1/2 h-fit text-center px-4 md:px-0">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Content Creators
          </motion.h1>
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellowGreen mb-4"
          >
            Create without Fear
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-sm md:text-base lg:text-lg font-medium text-slate-200 mb-6"
          >
            With <span className='text-yellowGreen font-semibold'>CCI</span>, we empower you to focus on your passion, while we handle the risks. Our AI-driven insurance solutions ensure you can create freely, without the fear of losing your income or content.
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
            className="w-full flex justify-center items-center gap-4"
          >
            <Link
              className="h-14 w-fit px-6 py-4 rounded-md shadow-md font-bold bg-appleGreen flex justify-center items-center gap-2 text-base text-white cursor-pointer"
              to="/application"
            >
              <p>Apply Now</p>
              <FaExclamation className="text-xl h-full" />
            </Link>
            <Link
              className="h-14 w-fit px-6 py-4 rounded-md shadow-md font-bold bg-transparent border-2 border-appleGreen flex justify-center items-center gap-2 text-base text-white cursor-pointer hover:bg-appleGreen hover:text-white transition-all"
              to="/claim"
            >
              <p>Claim Now</p>
              <MdArrowRight className="text-xl h-full" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;