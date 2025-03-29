import React from 'react';
import { motion } from 'framer-motion';
import Title from './Title';

const Services = () => {
  const services = [
    {
      id: 1,
      category: 'Protection',
      title: 'Comprehensive Financial Protection',
      description:
        'Our service ensures you are financially safeguarded in the event of account bans, suspensions, or demonetization. We provide tailored solutions to help you recover lost revenue and maintain financial stability during challenging times.',
    },
    {
      id: 2,
      category: 'Prevention',
      title: 'Advanced Preventive Tools',
      description:
        'We offer cutting-edge preventive tools, including in-depth content review services, to proactively identify and mitigate risks that could lead to account penalties. Our tools are designed to keep your accounts compliant and secure.',
    },
    {
      id: 3,
      category: 'Education',
      title: 'Expert Training on Platform Guidelines',
      description:
        'Our specialized training programs provide a thorough understanding of social media platform guidelines. We equip you with the knowledge and best practices needed to avoid violations, ensuring long-term success and compliance.',
    },
  ];

  return (
    <div id="services" className="w-full min-h-[160vh] h-fit py-10 ">
      <Title head={'Our Services'} subHead={'What we offer as an organization'} />
      <div className="relative flex justify-center items-center mt-10">
        {/* Vertical Line */}
        <div className="hidden md:block w-2 bg-gradient-to-b from-appleGreen to-white min-h-[110vh] top-0 absolute left-1/2 transform -translate-x-1/2"></div>

        {/* Services Cards */}
        <div className="relative w-full">
          {services.map((service, index) => {
            const isLeft = index % 2 === 0; // Alternate sides
            const topPosition = `${index * 150}px`; // Stagger the cards vertically

            return (
              <div
                key={service.id}
                className="relative w-full flex justify-center"
                style={{ marginTop: index === 0 ? '0' : '100px' }}
              >
                {/* Dot on the timeline */}
                <div
                  className="hidden md:block absolute w-6 h-6 bg-yellowGreen rounded-full left-1/2 transform -translate-x-1/2 z-10"
                  style={{ top: topPosition }}
                ></div>

                {/* Card */}
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0 }}
                  viewport={{ once: true }}
                  className={`bg-white shadow-lg p-6 rounded-lg w-3/4 md:w-1/3 absolute border border-yellowGreen hover:shadow-xl transition-shadow duration-300 ${
                    isLeft ? 'md:left-10 md:mr-auto' : 'md:right-10 md:ml-auto'
                  }`}
                  style={{ top: topPosition }}
                >
                  <h3 className="text-sm font-semibold text-appleGreen">{service.category}</h3>
                  <h4 className="text-lg font-semibold text-brown mt-1">{service.title}</h4>
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