import React from 'react';
import Title from './Title';
import { FaMailBulk, FaPhoneAlt, FaUser } from 'react-icons/fa';
import { FaLocationPinLock, FaMessage, FaPhone } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section id="contact" className="w-full h-fit py-10 pt-5">
      <Title head="Contact Us" subHead="Feel free to reach out and connect with us" />
      <div className="w-full md:h-[70vh] h-fit md:flex-row flex-col flex justify-center items-center gap-3">
        {/* Links */}
        <div className="md:w-1/2 w-full h-full p-4">
          <h1 className="text-brown font-bold text-lg mb-3 w-full">How to reach us easily</h1>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="flex justify-center items-center gap-3 h-20 w-full mb-3"
          >
            <div className="h-full w-[10%] p-0 lg:p-4 flex justify-center items-center text-appleGreen text-xl">
              <FaPhoneAlt className="w-fit h-full" />
            </div>
            <a
              href="tel:+254798159691"
              className="h-full flex justify-start items-start flex-col p-2 w-[90%]"
            >
              <h2 className="font-semibold text-appleGreen text-lg">Call To Action</h2>
              <p>Click here to call customer service for any queries</p>
            </a>
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="flex justify-center items-center gap-3 h-20 w-full mb-3"
          >
            <div className="h-full w-[10%] p-0 lg:p-4 flex justify-center items-center text-appleGreen text-xl">
              <FaMailBulk className="w-fit h-full" />
            </div>
            <a
              href="mailto:info.content.creator@insurance.com"
              className="h-full flex justify-start items-start flex-col p-2 w-[90%]"
            >
              <h2 className="font-semibold text-appleGreen text-lg">info.content.creator@insurance.com</h2>
              <p>Click here to send us an email</p>
            </a>
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="flex justify-center items-center gap-3 h-20 w-full mb-3"
          >
            <div className="h-full w-[10%] p-0 lg:p-4 flex justify-center items-center text-appleGreen text-xl">
              <FaLocationPinLock className="w-fit h-full" />
            </div>
            <a
              href="https://maps.google.com" // Placeholder; replace with actual URL
              className="h-full flex justify-start items-start flex-col p-2 w-[90%]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="font-semibold text-appleGreen text-lg">Kenya, Nyeri, Nairobi</h2>
              <p>Click to get the location of our head offices</p>
            </a>
          </motion.div>
        </div>

        {/* Form section */}
        <form className="md:w-1/2 w-full md:h-full h-fit p-4">
          <h1 className="flex items-center gap-2 text-brown font-bold text-lg mb-3 w-full">
            <p>Send a message</p> <FaMessage />
          </h1>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="w-full h-14 border-2 border-appleGreen rounded flex gap-3 items-center mb-3"
          >
            <FaUser className="w-fit p-2 h-full text-appleGreen" />
            <input
              className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-3/4 h-full"
              type="text"
              name="name"
              required
              placeholder="Ex: John Doe"
            />
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="w-full h-14 border-2 border-appleGreen rounded flex gap-3 items-center mb-3"
          >
            <FaMailBulk className="w-fit p-2 h-full text-appleGreen" />
            <input
              className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-3/4 h-full"
              type="email"
              name="email"
              required
              placeholder="Ex: johndoe@gmail.com"
            />
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="w-full h-14 border-2 border-appleGreen rounded flex gap-3 items-center mb-3"
          >
            <FaPhone className="w-fit p-2 h-full text-appleGreen" />
            <input
              className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-3/4 h-full"
              type="tel"
              name="phone" // Fixed from "name" to "phone"
              required
              placeholder="Ex: +254712345678"
            />
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="w-full h-28 border-2 border-appleGreen rounded flex gap-3 items-start mb-3 overflow-hidden"
          >
            <FaMessage className="w-fit p-2 h-14 text-appleGreen" />
            <textarea
              className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full pl-0 p-4"
              required
              placeholder="Message"
            />
          </motion.div>
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }} // Ensures animation runs only once
            className="h-12 w-28 rounded py-3 px-4 bg-appleGreen text-white font-bold"
            type="submit"
          >
            Send
          </motion.button>
        </form>
      </div>
    </section>
  );
};

export default Contact;