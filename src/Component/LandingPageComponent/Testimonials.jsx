import React, { useRef } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { assets } from '../../assets/assets';
import Title from '../../Resources/Title';
import { motion } from 'framer-motion';

const testimonialsData = [
  {
    name: 'Wanjiku Kariuki',
    location: 'Nairobi, Kenya',
    text: 'CCI pulled me out of a TikTok ban mess—cash hit my account fast, and I was back creating in no time. It’s like having a crew that’s got your back!',
  },
  {
    name: 'Kofi Mensah',
    location: 'Accra, Ghana',
    text: 'The tools CCI gave me stopped a YouTube flag before it wrecked my channel. Now I post with confidence—total game-changer for my hustle.',
  },
  {
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    text: 'CCI gets my vibe. They shaped a plan that fits my Insta gigs perfectly—affordable and solid. I’m hooked, no stress, just growth!',
  },
  {
    name: 'Liam Carter',
    location: 'London, UK',
    text: 'When a sponsor bailed after a platform glitch, CCI stepped up quick. It’s the safety net every creator needs—join this squad, trust me!',
  },
];

const Testimonials = () => {
  const slider = useRef();
  const [tx, setTx] = React.useState(0);

  const itemsPerView = 2; // 1 on mobile, 2 on md+ (based on w-full vs md:w-1/2)
  const totalItems = testimonialsData.length;
  const maxTx = -((totalItems - itemsPerView) * 100); // Max translation based on visible items

  const slideForward = () => {
    if (tx > maxTx) {
      const newTx = tx - 100;
      setTx(newTx);
      slider.current.style.transform = `translateX(${newTx}%)`;
    }
  };

  const slideBackward = () => {
    if (tx < 0) {
      const newTx = tx + 100;
      setTx(newTx);
      slider.current.style.transform = `translateX(${newTx}%)`;
    }
  };

  return (
    <section className="testimonials mx-auto py-20 relative bg-fadeBrown" id="testimonials">
      <Title head="Creators Speak" subHead="Why They Love CCI" />
      <button
        className="next-btn absolute top-2/3 right-1 transform -translate-y-1/2 text-4xl text-appleGreen cursor-pointer z-10"
        onClick={slideForward}
        aria-label="Next testimonial"
      >
        <FaChevronRight />
      </button>
      <button
        className="back-btn absolute top-2/3 left-1 transform -translate-y-1/2 text-4xl text-appleGreen cursor-pointer z-10"
        onClick={slideBackward}
        aria-label="Previous testimonial"
      >
        <FaChevronLeft />
      </button>
      <div className="slider overflow-hidden">
        <ul ref={slider} className="flex p-4 transition-all gap-9 md:gap-4 duration-1000">
          {testimonialsData.map((testimonial, index) => (
            <motion.li
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: index / 10 }}
              viewport={{ once: true }}
              key={index}
              className="testimonial-item flex-shrink-0 w-full md:w-1/2 p-6"
            >
              <div className="slide shadow-lg p-6 rounded-lg bg-white">
                <div className="user-info flex items-center mb-4">
                  <img
                    src={assets.user} // Replace with creator-specific avatars later
                    alt={`${testimonial.name}'s profile`}
                    className="w-16 h-16 rounded-full border-4 border-appleGreen mr-4"
                  />
                  <div>
                    <h3 className="text-sm md:text-xl font-semibold text-appleGreen">{testimonial.name}</h3>
                    <span className="text-xs md:text-sm text-gray-700">{testimonial.location}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-xs md:text-base">{testimonial.text}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials;