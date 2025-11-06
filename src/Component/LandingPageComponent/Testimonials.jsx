import React, { useRef } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { assets } from '../../assets/assets';
import Title from '../../Resources/Title';
import { motion } from 'framer-motion';

const testimonialsData = [
  {
    name: 'Wanjiku Kariuki',
    image: assets.CreatorW1,
    location: 'Nairobi, Kenya',
    text: 'CCI saved my YouTube channel from a sudden demonetization—quick payout covered my lost earnings, and AI tips helped me rebuild stronger. Now I create fearlessly!',
  },
  {
    name: 'Juma Otieno',
    image: assets.CreatorM1,
    location: 'Mombasa, Kenya',
    text: 'A glitch suspended my videos, but CCI\'s app spotted risks early with YouTube API scans. Fast claim process kept my income steady—essential for Kenyan creators.',
  },
  {
    name: 'Aisha Mwangi',
    image: assets.CreatorW2,
    location: 'Kisumu, Kenya',
    text: 'Banned for a minor rule slip? CCI paid out in days and gave AI insights to avoid future issues. It\'s more than insurance—it\'s my growth toolkit.',
  },
  {
    name: 'David Kimani',
    image: assets.CreatorM2,
    location: 'Eldoret, Kenya',
    text: 'New cyber laws blocked my account, but CCI bridged the gap with coverage and appeal tools. Affordable and tailored for us Kenyan YouTubers—highly recommend!',
  },
];

const Testimonials = () => {
  const slider = useRef();
  const [tx, setTx] = React.useState(0);

  const itemsPerView = window.innerWidth >= 768 ? 2 : 1;
  const totalItems = testimonialsData.length;
  const maxTx = -(totalItems - itemsPerView) * 100;

  const slideForward = () => {
    if (tx > maxTx) {
      const newTx = tx - 107;
      setTx(newTx);
      slider.current.style.transform = `translateX(${newTx}%)`;
    }
  };

  const slideBackward = () => {
    if (tx < 0) {
      const newTx = tx + 107;
      setTx(newTx);
      slider.current.style.transform = `translateX(${newTx}%)`;
    }
  };

  return (
    <section className="testimonials mx-auto py-16 relative bg-fadeBrown" id="testimonials">
      <Title head="Creators Speak" subHead="Real Stories from Kenyan YouTubers" />
      <button
        className="next-btn absolute top-2/3 right-4 transform -translate-y-1/2 text-2xl md:text-3xl text-appleGreen cursor-pointer z-10 hover:scale-110 transition-transform duration-300"
        onClick={slideForward}
        aria-label="Next testimonial"
      >
        <FaChevronRight />
      </button>
      <button
        className="back-btn absolute top-2/3 left-4 transform -translate-y-1/2 text-2xl md:text-3xl text-appleGreen cursor-pointer z-10 hover:scale-110 transition-transform duration-300"
        onClick={slideBackward}
        aria-label="Previous testimonial"
      >
        <FaChevronLeft />
      </button>
      <div className="slider overflow-hidden px-4">
        <ul ref={slider} className="flex gap-6 md:gap-8 transition-all duration-500 ease-in-out">
          {testimonialsData.map((testimonial, index) => (
            <motion.li
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              key={index}
              className="testimonial-item flex-shrink-0 w-full md:w-[49%]"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="slide shadow-lg p-5 md:p-6 rounded-xl bg-white h-full">
                <div className="user-info flex items-center mb-3 md:mb-4">
                  <img
                    src={testimonial.image || assets.user}
                    alt={`${testimonial.name}'s profile`}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 object-cover border-appleGreen mr-3 md:mr-4"
                  />
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-brown">{testimonial.name}</h3>
                    <span className="text-xs text-gray-600 block">{testimonial.location}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{testimonial.text}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials;