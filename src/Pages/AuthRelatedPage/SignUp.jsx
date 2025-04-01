import React from 'react';
import { FaLock, FaMailBulk, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const SignUp = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-white md:bg-appleGreen text-fadeBrown flex items-center justify-center relative overflow-hidden"
    >
      {/* Sign-Up Form Container */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 max-w-2xl w-full md:h-fit h-full flex items-center justify-center p-8 bg-white backdrop-blur-md rounded-none md:rounded-xl shadow-none md:shadow-2xl border-nonde md:border border-appleGreen"
      >
        <div className="">
          <div className="flex gap-3 items-center mb-4">
            <Link to="/" className="py-2">
              <MdArrowBack size={25} className="text-brown" />
            </Link>
            <h2 className="text-3xl font-extrabold text-brown">
              Create Your Account
            </h2>
          </div>
          <p className="text-yellowGreen text-sm mb-8">
            Become part of our community today. Sign up now to start your journey as a Content Creator and unlock financial security!
          </p>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1 text-brown"
              >
                Full Name
              </label>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center mb-3"
              >
                <FaUser className="w-fit p-2 h-full text-appleGreen" />
                <input
                  className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-3/4 h-full"
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Jane Mwangi"
                />
              </motion.div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brown mb-1"
              >
                Email
              </label>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center mb-3"
              >
                <FaMailBulk className="w-fit p-2 h-full text-appleGreen" />
                <input
                  className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-3/4 h-full"
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: janemwangi@gmail.com"
                />
              </motion.div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brown mb-1"
              >
                Password
              </label>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                viewport={{ once: true }}
                className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center mb-3"
              >
                <FaLock className="w-fit p-2 h-full text-appleGreen" />
                <input
                  className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-3/4 h-full"
                  type="password"
                  name="name"
                  required
                  placeholder="*********"
                />
              </motion.div>
            </div>

            {/* Sign-Up Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300 transform"
            >
              Create Account
            </motion.button>

            {/* Continue with Google Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="w-full py-3 bg-white border-2 border-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-appleGreen/50 transition-all duration-300 transform flex items-center justify-center gap-2 mt-4"
            >
              <FcGoogle size={20} />
              Continue with Google
            </motion.button>
          </motion.form>

          {/* Additional Link */}
          <p className="mt-4 text-center text-sm text-brown">
            Already have an Account?{' '}
            <a
              href="/login"
              className="text-yellowGreen hover:text-appleGreen transition-colors duration-200"
            >
              Login
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;