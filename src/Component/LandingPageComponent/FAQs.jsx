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
      question: 'What messes does CCI save me from?',
      answer:
        'CCI’s got you covered when platforms throw curveballs—demonetization, suspensions, or bans on spots like YouTube, TikTok, or Insta. We swoop in with cash to keep your creative flow steady, no matter the hiccup.',
    },
    {
      key: 2,
      category: 'Claims',
      question: 'How fast does CCI come through?',
      answer:
        'When disaster strikes, CCI’s on it—fast. We get cash in your hands quick after a claim, so you’re back to creating without missing a beat. Speed’s our thing!',
    },
    {
      key: 3,
      category: 'App Features',
      question: 'How does CCI’s web-app make my life easier?',
      answer:
        'Our web-app’s your creative sidekick—apply, claim, and dodge risks right from your phone. It’s smooth, smart, and built for creators on the move, wherever you’re vibing.',
    },
    {
      key: 4,
      category: 'Prevention',
      question: 'Can CCI keep me out of trouble?',
      answer:
        'Yep, CCI’s got tools to spot drama before it hits—content checks and platform know-how. Stay safe, keep posting, and maybe even snag a sweeter deal on your plan.',
    },
    {
      key: 5,
      category: 'Eligibility',
      question: 'What if my channel’s small—can I still join CCI?',
      answer:
        'Size doesn’t matter to us! Whether you’re just starting or already popping off, CCI’s here for every creator. We tailor your coverage to fit your hustle, big or small—join the squad!',
    },
    {
      key: 6,
      category: 'Costs',
      question: 'Will CCI cost me more if I mess up a lot?',
      answer:
        'No stress here—CCI keeps it fair. We look at your vibe, not just your slip-ups, to craft a plan that won’t break the bank. Plus, our tools help you dodge repeat chaos, keeping costs chill.',
    },
  ];

  return (
    <section id="faqs" className="w-full py-12 bg-white text-gray-900">
      <Title head="Got Questions?" subHead="CCI’s Answers for Creators" />
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