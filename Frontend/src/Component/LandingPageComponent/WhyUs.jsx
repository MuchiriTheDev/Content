import React from 'react';
import { FaMoneyCheckAlt, FaTools, FaClock } from 'react-icons/fa';
import Title from '../../Resources/Title';
import { motion } from 'framer-motion';

const WhyUs = () => {
  return (
    <div className="w-full py-16 px-4 md:px-8 bg-fadeBrown">
      {/* Title and Subheading */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <Title head="Why CCI Rocks" subHead="Your Creator Edge Starts Here" />
      </motion.div>

      {/* Grid for Cards */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {/* Card 1 */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <FaMoneyCheckAlt className="text-5xl text-appleGreen mx-auto mb-4" />
          <motion.h3
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl font-bold text-brown mb-2"
          >
            Cash When You Crash
          </motion.h3>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs lg:text-sm lg:text-center w-full"
          >
            Platform glitch? Ban blues? CCI’s got your back with quick cash to bounce back fast. No waiting, just creating.
          </motion.p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <FaTools className="text-5xl text-appleGreen mx-auto mb-4" />
          <motion.h3
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl font-bold text-brown mb-2"
          >
            Dodge the Drama
          </motion.h3>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs lg:text-sm lg:text-center w-full"
          >
            Our clever tools spot trouble before it strikes—think content checks and guideline hacks. Stay safe, keep the vibe.
          </motion.p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <FaClock className="text-5xl text-appleGreen mx-auto mb-4" />
          <motion.h3
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-xl font-bold text-brown mb-2"
          >
            Built Just for You
          </motion.h3>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs lg:text-sm lg:text-center w-full"
          >
            Coverage that fits your hustle—your earnings, your style. CCI crafts it smart so you shine, not stress.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyUs;