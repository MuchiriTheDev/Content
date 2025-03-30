import React from 'react';
import { FaMoneyCheckAlt, FaTools, FaChalkboardTeacher } from 'react-icons/fa';
import Title from '../../Resources/Title';
import { GiDuration } from 'react-icons/gi';
import {motion} from 'framer-motion'

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
        <Title head="Why Choose Us" subHead="Explore the Unique Benefits We Offer to Creators" />
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
            Cost-Effective Plans
          </motion.h3>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs lg:text-sm lg:text-center w-full"
          >
            Enjoy tailored plans that fit your needs and budget. We provide flexible payment options to ensure affordability without compromising on quality.
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
            Advanced Preventive Tools
          </motion.h3>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs lg:text-sm lg:text-center w-full"
          >
            Access cutting-edge tools designed to proactively address potential challenges. Stay secure and ahead with our comprehensive support and resources.
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
          <FaChalkboardTeacher className="text-5xl text-appleGreen mx-auto mb-4" />
          <motion.h3
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-brown mb-2"
          >
            Comprehensive Training
          </motion.h3>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs lg:text-sm lg:text-center w-full"
          >
            Gain in-depth knowledge of platform guidelines with our expert-led training sessions. Navigate the platform confidently with our dedicated resources and support.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyUs;
