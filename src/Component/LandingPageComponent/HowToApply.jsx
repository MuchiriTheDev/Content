import React from 'react';
import Title from '../../Resources/Title';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HowToApply = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const stepVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 8px 25px rgba(123, 191, 42, 0.3)' },
    tap: { scale: 0.98 },
  };

  return (
    <div id='how-to-apply' className="w-full min-h-screen bg-fadeBrown text-brown overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brown/10 to-yellowGreen/5"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-center">
        <Title 
          head={'How to Get Started'} 
          subHead={'Simple Steps to Protect Your Channel'} 
          headStyle="text-4xl md:text-5xl font-bold text-brown"
          subHeadStyle="text-lg md:text-xl text-yellowGreen font-light tracking-wide"
        />

        {/* Steps Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12"
        >
          {/* Step 1 */}
          <motion.div
            variants={stepVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative p-6 bg-white rounded-xl flex flex-col justify-center items-center shadow-lg hover:shadow-xl transition-all duration-300 border border-appleGreen/20 text-center"
          >
            <div className="bg-appleGreen text-white p-3 text-lg md:text-xl mb-3 flex justify-center items-center rounded-full font-bold w-12 h-12">01</div>
            <h3 className="text-xl md:text-2xl font-bold text-brown mb-3">Connect Your Channel</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Download the app and link your YouTube account. We use the API to track earnings and scan for risks with AI.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            variants={stepVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative p-6 bg-white rounded-xl flex flex-col justify-center items-center shadow-lg hover:shadow-xl transition-all duration-300 border border-appleGreen/20 text-center"
          >
            <div className="bg-appleGreen text-white p-3 text-lg md:text-xl mb-3 flex justify-center items-center rounded-full font-bold w-12 h-12">02</div>
            <h3 className="text-xl md:text-2xl font-bold text-brown mb-3">Get Your Plan</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Review your tailored premiums based on income and channel stability. Add optional AI content checks.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            variants={stepVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative p-6 bg-white rounded-xl flex flex-col justify-center items-center shadow-lg hover:shadow-xl transition-all duration-300 border border-appleGreen/20 text-center"
          >
            <div className="bg-appleGreen text-white p-3 text-lg md:text-xl mb-3 flex justify-center items-center rounded-full font-bold w-12 h-12">03</div>
            <h3 className="text-xl md:text-2xl font-bold text-brown mb-3">Activate Protection</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Pay your first premium and start coverage. Up to 70% of daily earnings protected—create without fear.
            </p>
          </motion.div>
        </motion.div>

        {/* Apply Now Button */}
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="mt-12"
        >
          <Link
            to='/application'
            className="px-8 py-4 bg-appleGreen text-white font-semibold rounded-lg shadow-lg hover:bg-yellowGreen transition-all duration-300"
          >
            Apply Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HowToApply;