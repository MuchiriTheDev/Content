import React, { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import Title from '../../Resources/Title';
import { motion } from 'framer-motion';

const FAQs = () => {
  const [activeQuestion, setActiveQuestion] = useState(1);
  const questions = [
    {
      key: 1,
      category: 'Coverage',
      question: 'What risks does Content Creators Insurance (CCI) protect against?',
      answer:
        'CCI safeguards your income against platform-induced disruptions like demonetization, suspensions, and bans on platforms such as YouTube, TikTok, and Instagram. Our lump-sum payouts, based on your lost earnings and recovery costs, aim to restore your financial stability swiftly.',
    },
    {
      key: 2,
      category: 'Claims',
      question: 'How quickly can I receive payouts with CCI?',
      answer:
        'CCI delivers rapid financial relief with payouts processed within 72 hours of claim verification. This industry-leading speed ensures you recover from platform setbacks without delay, starting with creators in Kenya and expanding globally.',
    },
    {
      key: 3,
      category: 'App Features',
      question: 'How does the CCI web-app simplify insurance management?',
      answer:
        'Our web-app platform, built for Kenya’s 90%+ mobile penetration, lets you apply, file claims, and access preventive tools effortlessly. With AI-driven efficiency and cloud-based operations, it’s a lean, scalable solution for creators worldwide.',
    },
    {
      key: 4,
      category: 'Prevention',
      question: 'How does CCI help reduce platform violations?',
      answer:
        'CCI offers optional preventive tools—platform guideline training and AI-powered content review—to cut violation risks by up to 20%. These services not only protect your income but can also qualify you for premium discounts, aligning safety with savings.',
    },
  ];

  return (
    <section id="faqs" className="w-full py-12 bg-white text-gray-900">
      <Title
        head="Frequently Asked Questions"
        subHead="Your Guide to CCI’s Services and Benefits"
      />
      <div className="flex flex-col p-4 items-center">
        {questions.map((qs) => (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0 }}
            viewport={{ once: true }}
            key={qs.key}
            onClick={() => setActiveQuestion(activeQuestion === qs.key ? 0 : qs.key)}
            className="w-full md:w-3/4 my-2 border border-yellowGreen rounded-lg cursor-pointer"
            role="button"
            aria-expanded={activeQuestion === qs.key}
            tabIndex={0}
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