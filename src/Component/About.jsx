import React from 'react';
import Title from './Title';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="w-full p-3 py-5" id="about">
      <Title
        head="The Solution"
        subHead="Empowering Content Creators with Financial Security."
      />
      <div className="flex justify-center items-center md:flex-row flex-col w-full h-fit lg:h-[70vh]">
        {/* Left side */}
        <div className="md:w-1/2 w-full flex justify-center items-center h-full p-3 mb-3">
          <motion.img
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="w-fit h-full rounded-lg shadow-2xl"
            src={assets.about}
            alt="About Us"
          />
        </div>
        {/* Right side */}
        <div className="md:w-1/2 w-full h-full p-3">
          <motion.h1
            initial={{ x: 250, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="text-lg lg:text-2xl mb-2 text-brown font-bold"
          >
            How We Help You
          </motion.h1>
          <motion.p
            initial={{ x: 250, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="mb-4 text-sm lg:text-base"
          >
            With Content Creators Insurance, we are dedicated to safeguarding the livelihoods of Kenyan content creators—YouTubers, TikTokers, Instagrammers, and others—who rely on social media platforms to earn a living. Our tailored insurance solutions provide a safety net against the most pressing risks creators face, including account bans, demonetization, and suspensions.
          </motion.p>
          <motion.p
            initial={{ x: 250, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="mb-4 text-sm lg:text-base"
          >
            With our seamless, app-based platform, we ensure that creators can access financial protection quickly and effortlessly. Payouts are processed efficiently through M-Pesa or other financial systems, offering creators peace of mind and the ability to focus on what they do best—creating impactful content.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default About;