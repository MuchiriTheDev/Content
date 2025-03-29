import React, { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa'; // Simplified to only FaChevronUp since direction handles collapse
import Title from './Title';
import { motion } from 'framer-motion';

const FAQs = () => {
  const [activeQuestion, setActiveQuestion] = useState(1);

  const questions = [
    {
      key: 1,
      question: 'What is financial literacy and why is it important?',
      answer:
        'Financial literacy is the ability to understand and effectively use various financial skills, including personal financial management, budgeting, and investing. It’s important for making informed decisions.',
    },
    {
      key: 2,
      question: 'What services does Making Sents offer?',
      answer:
        'We offer financial education, consultation services, and tools to help manage your personal finances. Learn more on our Services page.',
    },
    {
      key: 3,
      question: 'How can I improve my credit score?',
      answer:
        'Improving your credit score involves paying bills on time, keeping balances low, and managing debt responsibly. Visit our Products page for tools that can help.',
    },
    {
      key: 4,
      question: 'Do you offer budget planning services?',
      answer:
        'Yes! We provide personalized budgeting services to help you manage your income and expenses. Get started by contacting us today.',
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