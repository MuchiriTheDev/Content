import React from 'react';
import { motion } from 'framer-motion';
import Title from '../../Resources/Title';

const Services = () => {
  const services = [
    {
      id: 1,
      category: 'Income Protection',
      title: 'Secure Your Earnings',
      description:
        'If your channel faces a ban, demonetization, or suspension, CCI covers up to 70% of your daily income. Get payouts in 7-10 days to keep creating without financial stress.',
    },
    {
      id: 2,
      category: 'AI Analytics & Review',
      title: 'Spot Risks Early',
      description:
        'Connect your account for real-time monitoring via YouTube API. Our AI scans videos for issues, provides growth tips, and helps avoid platform pitfalls before they impact you.',
    },
    {
      id: 3,
      category: 'Personalized Toolkit',
      title: 'Grow Smarter',
      description:
        'Tailored coverage based on your earnings and channel stability. Evolving app with stats from YouTube, TikTok, X, and Instagram—plus AI advice for better videos and sponsors.',
    },
  ];

  return (
    <div id="services" className="w-full max-w-[100vw] min-h-[100vh] md:min-h-[160vh] h-fit py-10 bg-gray-50">
      <Title head={'What CCI Brings You'} subHead={'Your Creative Superpowers'} />
      <div className="relative flex justify-center items-center mt-10">
        {/* Vertical Line */}
        <div
          className="w-2 bg-gradient-to-b from-appleGreen via-appleGreen to-white min-h-[80vh] md:min-h-[100vh] top-0 absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2"
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
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  className={`bg-white shadow-lg p-6 rounded-lg w-[calc(100%-6rem)] md:w-1/3 absolute border border-yellowGreen transition-all duration-300 ${
                    isLeft ? 'left-8 md:left-10 md:mr-auto' : 'left-8 md:right-10 md:ml-auto'
                  }`}
                  style={{ top: topPosition }}
                >
                  <h3 className="text-sm font-semibold text-appleGreen">{service.category}</h3>
                  <h4 className="text-base font-semibold text-gray-800 mt-1">{service.title}</h4>
                  <p className="text-xs text-gray-700 mt-2 leading-relaxed">{service.description}</p>
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