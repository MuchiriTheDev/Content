import React, { useRef } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { assets } from '../../assets/assets';
import Title from '../../Resources/Title';
import { motion } from 'framer-motion';

const testimonialsData = [
  {
    name: 'Muchiri Mwangi',
    location: 'Nakuru, Kenya',
    text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi animi veniam consectetur, labore deserunt ipsum ad assumenda. Inventore optio molestiae rerum, recusandae ab consectetur ipsum aspernatur ea repellat, illum architecto?',
  },
  {
    name: 'Brian Mwangi',
    location: 'Nairobi, Kenya',
    text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi animi veniam consectetur, labore deserunt ipsum ad assumenda. Inventore optio molestiae rerum, recusandae ab consectetur ipsum aspernatur ea repellat, illum architecto?',
  },
  {
    name: 'Bernard Huston',
    location: 'California, USA',
    text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi animi veniam consectetur, labore deserunt ipsum ad assumenda. Inventore optio molestiae rerum, recusandae ab consectetur ipsum aspernatur ea repellat, illum architecto?',
  },
  {
    name: 'Ibrahim Zlatan',
    location: 'Moscow, Russia',
    text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi animi veniam consectetur, labore deserunt ipsum ad assumenda. Inventore optio molestiae rerum, recusandae ab consectetur ipsum aspernatur ea repellat, illum architecto?',
  },
];

const Testimonials = () => {
  const slider = useRef();
  const [tx, setTx] = React.useState(0); // Use state for better React integration

  const itemsPerView = 2; // 1 on mobile, 2 on md+ (adjust based on w-full vs md:w-1/2)
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
      <Title head="Testimonials" subHead="Hear what people say about us" />
      <button
        className="next-btn absolute top-2/3 right-4 transform -translate-y-1/2 text-4xl text-appleGreen cursor-pointer z-10"
        onClick={slideForward}
        aria-label="Next testimonial"
      >
        <FaChevronRight />
      </button>
      <button
        className="back-btn absolute top-2/3 left-4 transform -translate-y-1/2 text-4xl text-appleGreen cursor-pointer z-10"
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
              viewport={{ once: true }} // Ensures animation runs only once
              key={index}
              className="testimonial-item flex-shrink-0 w-full md:w-1/2 p-6"
            >
              <div className="slide shadow-lg p-6 rounded-lg bg-white">
                <div className="user-info flex items-center mb-4">
                  <img
                    src={assets.user}
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