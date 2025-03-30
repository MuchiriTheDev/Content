import React from 'react';
import { motion } from 'framer-motion';
import Title from '../../Resources/Title';

const Services = () => {
  const services = [
    {
      id: 1,
      category: 'Protection',
      title: 'Your Income Lifeline',
      description:
        'CCI catches you when platforms drop the ball—think bans or cash flow stalls. Quick payouts keep your dreams on track, no matter where you’re at.',
    },
    {
      id: 2,
      category: 'Prevention',
      title: 'Risk-Busting Tools',
      description:
        'Stay in the game with CCI’s clever kit—content checks and platform tips. Dodge the flags and keep your spark blazing bright.',
    },
    {
      id: 3,
      category: 'Personalization',
      title: 'Coverage Your Way',
      description:
        'CCI gets you. We shape your plan around your hustle—your vibe, your earnings. Smart, simple protection that’s all about you.',
    },
  ];

  return (
    <div id="services" className="w-full max-w-[100vw] min-h-[100vh] md:min-h-[150vh] h-fit py-10 bg-gray-50">
      <Title head={'What CCI Brings You'} subHead={'Your Creative Superpowers'} />
      <div className="relative flex justify-center items-center mt-10">
        {/* Vertical Line */}
        <div
          className="w-2 bg-gradient-to-b from-appleGreen to-white min-h-[80vh] md:min-h-[120vh] top-0 absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2"
        ></div>

        {/* Services Cards */}
        <div className="relative w-full">
          {services.map((service, index) => {
            const isLeft = index % 2 === 0; // Alternate sides for medium screens and above
            const topPosition = `${index * 150}px`; // Stagger the cards vertically

            return (
              <div
                key={service.id}
                className="relative w-full flex justify-start md:justify-center"
                style={{ marginTop: index === 0 ? '0' : '100px' }}
              >
                {/* Dot on the timeline */}
                <div
                  className="absolute w-6 h-6 bg-yellowGreen rounded-full left-2 md:left-1/2 md:transform md:-translate-x-1/2 z-10"
                  style={{ top: topPosition }}
                ></div>

                {/* Card */}
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0 }}
                  viewport={{ once: true }}
                  className={`bg-white shadow-lg p-6 rounded-lg w-[calc(100%-6rem)] md:w-1/3 absolute border border-yellowGreen hover:shadow-xl transition-shadow duration-300 ${
                    isLeft ? 'left-8 md:left-10 md:mr-auto' : 'left-8 md:right-10 md:ml-auto'
                  }`}
                  style={{ top: topPosition }}
                >
                  <h3 className="text-sm font-semibold text-appleGreen">{service.category}</h3>
                  <h4 className="text-lg font-semibold text-gray-800 mt-1">{service.title}</h4>
                  <p className="text-sm text-gray-700 mt-2">{service.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;