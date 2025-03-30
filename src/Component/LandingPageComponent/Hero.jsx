import React from 'react';
import { assets } from '../../assets/assets';
import { MdArrowRight } from 'react-icons/md';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { FaExclamation } from 'react-icons/fa';

const Hero = () => {
  return (
    <section
      style={{
        background: `url(${assets.hero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      className="w-full min-h-screen h-fit relative"
      id="home"
    >
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#4f391a9a] to-transparent backdrop-blur-lg">
        <div className="md:w-1/2 h-fit text-center px-4 md:px-0">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.6,
            }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
          >
            Content Creator
          </motion.h1>
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.6,
            }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="text-3xl lg:text-5xl font-bold text-yellowGreen mb-4"
          >
            Insurance
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.8,
            }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="text-sm md:text-lg font-medium text-slate-200 mb-6"
            >
              Empowering creators with unparalleled protection against account bans, demonetization, and suspensions, ensuring you can focus on creating fearlessly and with confidence.
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1,
            }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="w-full flex justify-center items-center"
          >
            <ScrollLink
              className="h-14 w-fit px-6 py-4 rounded-md shadow-md font-bold bg-appleGreen flex justify-center items-center gap-2 text-base text-white cursor-pointer"
              to="services"
              smooth={true}
              duration={500}
              offset={-100}
            >
              <p>Apply Now</p>
              <FaExclamation className="text-xl h-full" />
            </ScrollLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;