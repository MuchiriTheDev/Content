import React, { useRef } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { assets } from '../../assets/assets';
import Title from '../../Resources/Title';
import { motion } from 'framer-motion';

const testimonialsData = [
  {
    name: 'Azziad Nasenya',
    location: 'Nairobi, Kenya',
    text: 'When TikTok demonetized my account overnight, CCI saved me. I got a payout in just 72 hours, covering my lost earnings and keeping my team paid. It’s a game-changer for creators like me in Kenya!',
  },
  {
    name: 'James Otieno',
    location: 'Kisumu, Kenya',
    text: 'CCI’s content review tools helped me avoid a YouTube suspension. The AI caught risky edits before I posted, and their training made me confident about platform rules. I’m creating worry-free now.',
  },
  {
    name: 'Priya Patel',
    location: 'Mumbai, India',
    text: 'As an Instagram influencer, I love how CCI tailored my premium to my earnings and audience size. When I faced a temporary ban, their fast support got me back on track without breaking the bank.',
  },
  {
    name: 'Michael Brooks',
    location: 'Los Angeles, USA',
    text: 'CCI’s global vision is real. After a YouTube ban cost me sponsorships, their payout came through in three days flat. It’s the safety net every creator needs in this unpredictable digital world.',
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
      <Title head="Testimonials" subHead="What Creators Say About CCI" />
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
                    src={assets.user} // Replace with creator-specific placeholder if available
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