import React from 'react';
import { FaMoneyCheckAlt, FaTools, FaChalkboardTeacher } from 'react-icons/fa';
import Title from './Title';
import { GiDuration } from 'react-icons/gi';
import {motion} from 'framer-motion'

const WhyUs = () => {
  return (
    <div className="w-full py-16 px-4 md:px-8 bg-fadeBrown">
      {/* Title and Subheading */}
      <Title head={'Why Us?'} subHead={'Here’s how we empower your financial future.'}/>

      {/* Grid for Cards */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {/* Card 1 */}
        <motion.div
          initial={{y:100 , opacity:0}}
          whileInView={{y:0, opacity:1}}
          transition={{duration: 1 , delay: 0.4}} 
          className="bg-white p-6 rounded-lg shadow-lg text-center">
          <FaMoneyCheckAlt className="text-5xl text-appleGreen mx-auto mb-4" />
          <motion.h3
            initial={{y:100 , opacity:0}}
            whileInView={{y:0, opacity:1}}
            transition={{duration: 1 , delay: 0.4}} 
            className="text-xl font-bold text-brown mb-2">
            Affordable Resources
          </motion.h3>
          <motion.p 
            initial={{y:100 , opacity:0}}
            whileInView={{y:0, opacity:1}}
            transition={{duration: 1 , delay: 0.4}}
            className="text-gray-600 text-xs lg:text-sm lg:text-center w-full">
            Our platform provides tailored, cost-effective solutions to streamline operations and maximize efficiency for your business.
          </motion.p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{y:100 , opacity:0}}
          whileInView={{y:0, opacity:1}}
          transition={{duration: 1 , delay: 0.6}} 
          className="bg-white p-6 rounded-lg shadow-lg text-center">
          <FaTools className="text-5xl text-appleGreen mx-auto mb-4" />
          <motion.h3 
            initial={{y:100 , opacity:0}}
            whileInView={{y:0, opacity:1}}
            transition={{duration: 1 , delay: 0.6}}
            className="text-xl font-bold text-brown mb-2">
            Practical Tools
          </motion.h3>
          <motion.p
            initial={{y:100 , opacity:0}}
            whileInView={{y:0, opacity:1}}
            transition={{duration: 1 , delay: 0.6}} 
            className="text-gray-600 text-xs lg:text-sm lg:text-center w-full">
          Our platform provides tools to improve budgeting, expense tracking, and decision-making, for both beginners and experienced entrepreneurs.
          </motion.p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{y:100 , opacity:0}}
          whileInView={{y:0, opacity: 1}}
          transition={{duration: 1 , delay: 0}} 
          className="bg-white p-6 rounded-lg shadow-lg text-center">
          <FaChalkboardTeacher className="text-5xl text-appleGreen mx-auto mb-4" />
          <motion.h3
            initial={{y:100 , opacity:0}}
            whileInView={{y:0, opacity: 1}}
            transition={{duration:1 , delay: 0.8}}
            className="text-xl font-semibold text-brown mb-2">
            Accessible Learning
          </motion.h3>
          <motion.p
            initial={{y:100 , opacity:0}}
            whileInView={{y:0, opacity: 1}}
            transition={{duration:1 , delay: 0}} 
            className="text-gray-600 text-xs lg:text-sm lg:text-center w-full">
            Our platform supports entrepreneurs at all levels with resources and guidance to help you grow and succeed
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyUs;
