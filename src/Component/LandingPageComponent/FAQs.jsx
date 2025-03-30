import React, { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa'; // Simplified to only FaChevronUp since direction handles collapse
import Title from '../../Resources/Title';
import { motion } from 'framer-motion';

const FAQs = () => {
  const [activeQuestion, setActiveQuestion] = useState(1);
  const questions = [
    {
      key: 1,
      category: 'Coverage',
      question: 'What risks does Content Creators Insurance (C.C.I) protect against?',
      answer:
        'C.C.I provides financial protection against common risks faced by content creators, including account bans, demonetization, and suspensions on platforms like YouTube, Instagram, and TikTok. Our goal is to restore your financial position to pre-incident levels, ensuring you can continue your work without prolonged strain.',
    },
    {
      key: 2,
      category: 'Claims',
      question: 'How quickly can I receive payouts with C.C.I?',
      answer:
        'C.C.I offers rapid claims processing, with claims verified and paid within 48 hours. This swift payout mechanism provides immediate financial relief, a feature that sets us apart from traditional insurance products.',
    },
    {
      key: 3,
      category: 'App Features',
      question: 'How does the C.C.I app help me manage my insurance?',
      answer:
        'Our user-friendly app allows you to monitor your account status in real-time, file claims seamlessly, and access preventive tools. Designed with Kenya’s high mobile penetration in mind, the app ensures accessibility and efficiency with minimal infrastructure.',
    },
    {
      key: 4,
      category: 'Prevention',
      question: 'What preventive services does C.C.I offer to reduce risks?',
      answer:
        'C.C.I provides optional preventive services like content review, training on platform guidelines, and AI-powered content analysis to flag potential issues before posting. These services help reduce the risk of bans or demonetization, potentially lowering your premiums over time.',
    },
  ];
  return (
    <section id="faqs" className="w-full py-12 bg-white text-gray-900">
      <Title
        head="Frequently Asked Questions"
        subHead="Find answers to common questions about our services and financial literacy."
      />
      <div className="flex flex-col p-4 items-center">
        {questions.map((qs) => (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0 }}
            viewport={{ once: true }} // Ensures animation runs only once
            key={qs.key}
            onClick={() => setActiveQuestion(activeQuestion === qs.key ? 0 : qs.key)}
            className="w-full md:w-3/4 my-2 border border-yellowGreen rounded-lg cursor-pointer"
            role="button"
            aria-expanded={activeQuestion === qs.key}
            tabIndex={0} // Makes it keyboard-focusable
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveQuestion(activeQuestion === qs.key ? 0 : qs.key)}
          >
            <div className="flex justify-between w-full p-4 items-center">
              <h2 className="text-lg font-semibold text-appleGreen">{qs.question}</h2>
              <FaChevronUp
                className={`text-appleGreen transition-all duration-200 ${activeQuestion === qs.key ? 'rotate-180' : ''}`}
              />
            </div>
            <p
              className={`text-gray-700 bg-fadeBrown text-sm font-semibold text-center transition-all duration-200 overflow-hidden ${
                activeQuestion === qs.key ? 'max-h-full p-2' : 'max-h-0'
              }`}
            >
              {qs.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;