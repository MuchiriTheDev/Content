import React from 'react';
import { assets } from '../../assets/assets'; // Image of a creator in action (filming, editing)
import { MdArrowRight, MdPlayCircleOutline } from 'react-icons/md';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  // Staggered animation variants for child elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  return (
    <section
      style={{
        background: `url(${assets.hero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      className="w-full min-h-[110vh] relative overflow-hidden"
      id="home"
    >
      {/* Enhanced gradient overlay with subtle texture */}
      <div className="absolute inset-0 bg-brown/30 backdrop-blur-md" />
      
      {/* Dynamic floating elements: Subtle creator-themed icons */}
      <motion.div
        className="absolute top-16 left-6 w-10 h-10 text-appleGreen"
        initial={{ opacity: 0, x: -10 }}
        animate={{ 
          opacity: [0.3, 1, 0.3], 
          x: [0, 8, 0],
          rotate: [0, 180]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MdPlayCircleOutline className="w-full h-full" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 right-8 w-8 h-8 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: [0.2, 1, 0.2], 
          y: [0, -8, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
      >
        <MdArrowRight className="w-full h-full" />
      </motion.div>

      <div className="relative z-10 flex items-center justify-center mt-10 min-h-screen px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full max-w-xl md:max-w-3xl text-center space-y-6 mx-auto"
        >
          {/* Compact Hero Title Stack – Teasing the concept */}
          <motion.div
            variants={itemVariants}
            className="space-y-2"
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent"
            >
              Content Creator Insurance
            </motion.h1>
            <motion.h3
              variants={itemVariants}
              className="text-base md:text-lg lg:text-xl font-semibold  text-appleGreen"
            >
              Your Safety Net for YouTube
            </motion.h3>
          </motion.div>

          {/* Ultra-concise teaser description to spark curiosity */}
          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm font-semibold text-slate-300 leading-5 md:leading-6 max-w-prose mx-auto px-1"
          >
           Glitch steals earnings? CCI shields Kenyan creators—affordable ban coverage at 2-5%. Create boldly!
          </motion.p>

          {/* Streamlined CTA – Focused on onboarding */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2"
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              className="group"
            >
              <Link
                to="/application"
                className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-appleGreen to-emerald-600 text-white text-xs md:text-sm shadow-lg group-hover:shadow-xl transition-all duration-400 flex items-center justify-center gap-2 min-w-[140px] overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <MdArrowRight className="text-xs relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              className="group"
            >
              <Link
                to="/claim"
                className="px-6 py-3 rounded-full font-semibold border-2 border-appleGreen text-appleGreen bg-transparent text-xs md:text-sm hover:bg-appleGreen hover:text-white transition-all duration-400 flex items-center justify-center gap-2 min-w-[140px]"
              >
                <span className="relative z-10">File a Claim</span>
                <MdArrowRight className="text-xs relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Minimal teaser to hint at more */}
          <motion.p
            variants={itemVariants}
            className="text-xs text-white italic flex items-center justify-center gap-1"
          >
            <span>✨</span>
            Built for YouTube creators—AI tools for growth coming soon.
          </motion.p>
        </motion.div>
      </div>

      {/* Gentle scroll prompt */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <MdArrowRight className="text-lg rotate-90 animate-bounce" />
        <span className="text-xs ml-1">Discover More</span>
      </motion.div>
    </section>
  );
};

export default Hero;