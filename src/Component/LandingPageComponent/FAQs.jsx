import React, { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import Title from '../../Resources/Title';
import { motion, AnimatePresence } from 'framer-motion';

const FAQs = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const questions = [
    {
      key: 1,
      category: 'Overview',
      question: 'What is CCI?',
      answer:
        'CCI is a simple app-based insurance for Kenyan YouTube creators. It protects your income from sudden bans, demonetization, or suspensions using YouTube\'s API for real-time monitoring and quick issue detection.',
    },
    {
      key: 2,
      category: 'Coverage',
      question: 'What does CCI cover?',
      answer:
        'We cover up to 70% of your average daily earnings (with a monthly cap) during disruptions, so you can keep going while resolving issues. Starts with YouTube, expanding to TikTok, X, and Instagram.',
    },
    {
      key: 3,
      category: 'Claims',
      question: 'How do claims work?',
      answer:
        'Connect your account, report the issue—our app detects it instantly. We verify with YouTube data and experts, then pay out in 7-10 days. Includes tools to appeal or rebuild your channel.',
    },
    {
      key: 4,
      category: 'Signup',
      question: 'How do I sign up?',
      answer:
        'Download the app, link your YouTube account—we track earnings and risks with AI. Premiums are tailored to your income and channel stability; add optional pre-post content checks.',
    },
    {
      key: 5,
      category: 'Future Features',
      question: 'What else will CCI offer?',
      answer:
        'Evolving into a full creator toolkit: real-time stats across platforms, AI tips for better videos, sponsor matching, and risk avoidance—all in one easy app.',
    },
    {
      key: 6,
      category: 'Eligibility',
      question: 'Who can join CCI?',
      answer:
        'Any Kenyan YouTube creator earning $500+/month qualifies initially. We support full-time grinders with no backup—join to protect and grow your channel.',
    },
  ];

  return (
    <section id="faqs" className="w-full py-10 bg-white text-gray-900">
      <Title head="Got Questions?" subHead="CCI Answers for Creators" />
      <div className="flex flex-col p-4 items-center max-w-4xl mx-auto">
        {questions.map((qs) => (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: qs.key * 0.1 }}
            viewport={{ once: true }}
            key={qs.key}
            onClick={() => setActiveQuestion(activeQuestion === qs.key ? null : qs.key)}
            className="w-full my-3 border border-yellowGreen rounded-lg cursor-pointer hover:shadow-md transition-shadow"
            role="button"
            aria-expanded={activeQuestion === qs.key}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveQuestion(activeQuestion === qs.key ? null : qs.key)}
          >
            <div className="flex justify-between w-full p-4 items-center">
              <h2 className="text-base font-semibold text-brown">{qs.question}</h2>
              <FaChevronUp
                className={`text-yellowGreen transition-all duration-300 ${activeQuestion === qs.key ? 'rotate-180' : ''}`}
              />
            </div>
            <AnimatePresence>
              {activeQuestion === qs.key && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-700 bg-fadeBrown text-xs px-4 pb-4 overflow-hidden"
                >
                  {qs.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;