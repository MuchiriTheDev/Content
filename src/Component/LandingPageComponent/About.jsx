import React from 'react';
import Title from '../../Resources/Title';
import { assets } from '../../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 8px 25px rgba(123, 191, 42, 0.3)' },
    tap: { scale: 0.98 },
  };

  return (
    <section className="w-full py-8 px-4 md:px-8 bg-white" id="about">
      <Title
        head="Your Creative Shield"
        subHead="Where Creators Thrive"
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col lg:flex-row justify-center items-center gap-8 w-full max-w-6xl mx-auto"
      >
        {/* Left side: Interactive Image */}
        <motion.div
          variants={imageVariants}
          className="lg:w-1/2 w-full flex justify-center items-center p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={assets.about}
            alt="Content Creators Insurance"
            className="w-full max-w-md rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 object-cover"
          />
        </motion.div>

        {/* Right side: Text Content */}
        <motion.div
          variants={itemVariants}
          className="lg:w-1/2 w-full p-4 space-y-6"
        >
          <motion.h1
            variants={itemVariants}
            className="text-xl lg:text-3xl font-bold text-brown leading-tight"
          >
            Empower Your Journey
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-sm lg:text-base text-gray-700 leading-relaxed"
          >
            Waking up to a banned or demonetized channel means no views, no revenue, no income—turning your passion into panic from glitches, rule changes, or suspensions.
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-sm lg:text-base text-gray-700 leading-relaxed"
          >
            CCI is your simple app shield: connect your channel for AI risk detection, quick claims with YouTube-backed payouts to keep you going, and tools to rebuild fast. Evolving into a full toolkit with real-time stats across platforms and AI tips for viral content, sponsors, and safer growth.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex justify-start"
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative group"
            >
              <Link
                to="/application"
                className="px-8 py-4 rounded-xl font-semibold bg-appleGreen text-white shadow-lg hover:bg-opacity-90 transition-all duration-300 flex items-center gap-3 text-sm lg:text-base overflow-hidden"
              >
                <span>Join the Toolkit</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-appleGreen/20 to-yellowGreen opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;