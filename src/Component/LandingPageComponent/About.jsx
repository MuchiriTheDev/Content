import React from 'react';
import Title from '../../Resources/Title';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';

const About = () => {
  return (
    <section className="w-full p-3 py-5" id="about">
      <Title
        head="Your Creative Shield"
        subHead="Where Creators Thrive"
      />
      <div className="flex justify-center items-center md:flex-row flex-col w-full h-fit lg:h-[70vh]">
        {/* Left side */}
        <div className="md:w-1/2 w-full flex justify-center items-center h-full p-3 mb-3">
          <motion.img
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="w-fit h-full rounded-lg shadow-2xl"
            src={assets.about} // Image of a creator thriving (e.g., filming or celebrating)
            alt="Content Creators Insurance"
          />
        </div>
        {/* Right side */}
        <div className="md:w-1/2 w-full h-full p-3">
          <motion.h1
            initial={{ x: 250, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg lg:text-2xl mb-2 text-brown font-bold"
          >
            Your Backup Plan
          </motion.h1>
          <motion.p
            initial={{ x: 250, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 text-sm lg:text-base"
          >
            Hey creators, platforms can trip, but CCI won’t let you slip. We’re your safety net when the unexpected hits—think demonetization or bans. With fast cash to keep your vibe alive, we turn setbacks into comebacks.
          </motion.p>
          <motion.p
            initial={{ x: 250, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-6 text-sm lg:text-base"
          >
            Our slick web-app tunes into your world, crafting coverage just for you. Plus, smart tools help you dodge the drama before it starts. Born in Kenya’s creator scene, we’re here to fuel your dreams—wherever you stream.
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="w-full flex justify-start"
          >
            <ScrollLink
              className="h-12 w-fit px-6 py-3 rounded-md shadow-md font-bold bg-appleGreen flex justify-center items-center gap-2 text-base text-white cursor-pointer hover:bg-opacity-90 transition-all"
              to="services" // Could link to a dedicated apply section later
              smooth={true}
              duration={500}
              offset={-100}
            >
              <p>Apply Now</p>
            </ScrollLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;