import React from 'react';
import { assets } from '../../assets/assets';
import { FaLock, FaMailBulk } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-screen h-fit min-h-screen bg-gray-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
       className="md:w-[90%] w-full max-w-5xl shadow-none md:shadow-xl rounded-md bg-none md:bg-white border-none md:border-2 border-appleGreen my-5 md:my-10 flex justify-center items-center h-fit md:min-h-[75vh] relative"
      >
        {/* Image - Hidden on small screens */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:block h-full w-[40%] overflow-hidden rounded-l-md"
        >
          <img src={assets.login} className="w-full h-full object-cover" alt="Login" />
        </motion.div>
        {/* Form Container */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-full w-full md:w-[60%] flex items-center justify-center relative p-4 md:p-6"
        >
          <form className="w-full max-w-lg">
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex gap-5 mb-4"
            >
              <Link to="/">
                <MdArrowBack size={27} className="text-brown" />
              </Link>
              <div className="mb-3">
                <h1 className="text-3xl md:text-4xl mb-2 text-brown font-semibold">
                  Welcome Back
                </h1>
                <p className="text-sm text-gray-500">
                  Log in to continue your journey as a Content Creator and manage your account!
                </p>
              </div>
            </motion.div>
            {/* Form Inputs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="w-full h-fit p-6 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg border-2 border-appleGreen"
            >
              <div className="w-full h-fit mb-4">
                {/* Email */}
                <label
                  htmlFor="email"
                  className="text-sm text-yellowGreen flex gap-2 mb-2 items-center"
                >
                  <FaMailBulk /> Email
                </label>
                <motion.input
                  whileFocus={{ borderColor: '#A3BFFA' }}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full h-10 border-b-2 px-4 border-b-appleGreen focus:outline-none focus:border-b-2 focus:border-b-yellowGreen"
                />
              </div>
              <div className="w-full h-fit mb-3">
                {/* Password */}
                <label
                  htmlFor="password"
                  className="text-sm text-yellowGreen flex gap-2 mb-2 items-center"
                >
                  <FaLock /> Password
                </label>
                <motion.input
                  whileFocus={{ borderColor: '#A3BFFA' }}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full h-10 border-b-2 px-4 border-b-appleGreen focus:outline-none focus:border-b-2 focus:border-b-yellowGreen"
                />
              </div>
            </motion.div>
            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="w-full h-fit flex items-center justify-center mt-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full h-10 bg-yellowGreen text-white font-bold rounded-md hover:bg-brown transition-all duration-300"
              >
                Log In
              </motion.button>
            </motion.div>
            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="w-full h-fit flex items-center justify-center mt-2"
            >
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-yellowGreen font-bold cursor-pointer">
                  Sign Up
                </Link>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="w-full h-fit flex items-center justify-center mt-2"
            >
              <p className="text-sm text-gray-500">Or</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="w-full h-fit flex items-center justify-center mt-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full h-10 bg-white text-brown font-bold rounded-md border-2 border-brown hover:bg-brown hover:text-white transition-all flex justify-center items-center gap-3 duration-300"
              >
                <FcGoogle /> Continue with Google
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="w-full h-fit flex items-center justify-center mt-4"
            >
              <p className="text-sm text-gray-500">
                By logging in, you agree to our{' '}
                <span className="text-yellowGreen font-bold cursor-pointer">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-yellowGreen font-bold cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;