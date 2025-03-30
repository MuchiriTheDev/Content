import React from 'react';
import Title from '../../Resources/Title';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="w-full p-3 py-5" id="about">
      <Title
        head="The Solution"
        subHead="Protecting Creators, Empowering Dreams."
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
            src={assets.about} // Use an image of a Kenyan creator or digital workflow
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
            How CCI Supports You
          </motion.h1>
          <motion.p
            initial={{ x: 250, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 text-sm lg:text-base"
          >
            Content Creators Insurance (CCI) is your lifeline against platform risks—demonetization, suspensions, and bans. Starting in Kenya, with its 10.4 million social media users and 90%+ mobile penetration, we offer rapid financial relief within 72 hours, tailored to your lost earnings and recovery costs.
          </motion.p>
          <motion.p
            initial={{ x: 250, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 text-sm lg:text-base"
          >
            Our web-app platform, powered by lightweight AI, delivers personalized premiums and preventive tools to reduce violations by 20%. From Kenya’s vibrant creator community to the global stage, CCI ensures you thrive, with payouts via M-Pesa and scalable solutions for the $480 billion creator economy.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default About;