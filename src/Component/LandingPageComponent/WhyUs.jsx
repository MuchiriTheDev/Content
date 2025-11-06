import React from 'react';
import { FaShieldAlt, FaBolt, FaBrain } from 'react-icons/fa';
import Title from '../../Resources/Title';
import { motion } from 'framer-motion';

const WhyUs = () => {
  return (
    <div className="w-full py-12 px-4 md:px-8 bg-fadeBrown">
      {/* Title and Subheading */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <Title head="Why Choose CCI" subHead="Protection That Grows With You" />
      </motion.div>

      {/* Grid for Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Card 1: Income Protection */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white p-5 rounded-lg shadow-lg text-center"
        >
          <FaShieldAlt className="text-4xl text-appleGreen mx-auto mb-3" />
          <motion.h3
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base font-bold text-brown mb-2"
          >
            Safeguard Your Earnings
          </motion.h3>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs text-center"
          >
            Bans or demonetization hit hard—CCI covers up to 70% of your daily income so you stay afloat while fixes happen.
          </motion.p>
        </motion.div>

        {/* Card 2: Quick Claims */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white p-5 rounded-lg shadow-lg text-center"
        >
          <FaBolt className="text-4xl text-appleGreen mx-auto mb-3" />
          <motion.h3
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-base font-bold text-brown mb-2"
          >
            Fast, Fair Payouts
          </motion.h3>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs text-center"
          >
            App spots issues instantly—report, we verify with YouTube data, and pay out in 7-10 days. No hassle, just help.
          </motion.p>
        </motion.div>

        {/* Card 3: Evolving Toolkit */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="bg-white p-5 rounded-lg shadow-lg text-center"
        >
          <FaBrain className="text-4xl text-appleGreen mx-auto mb-3" />
          <motion.h3
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-base font-bold text-brown mb-2"
          >
            AI-Powered Growth
          </motion.h3>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs text-center"
          >
            Starts with YouTube protection, expands to TikTok, X, Instagram—real-time stats, AI tips for videos, sponsors, and risk avoidance.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyUs;