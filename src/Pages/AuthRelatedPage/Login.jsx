import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { FaLock, FaMailBulk } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GeneralContext } from '../../Context/GeneralContext';
import Loading from '../../Resources/Loading';
import toast from 'react-hot-toast';
import axios from 'axios';
import { backendUrl } from '../../App';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading , setLoading } = useContext(GeneralContext);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    if (!formData.email || !formData.password) {
      toast.info('Please fill in all fields!');
      setLoading(false); // Reset loading state
      return;
    }
    
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, formData)
      if(response.data.success){
        toast.success('Login successful!');
        console.log('Login successful:', response.data);
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        navigate('/')
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.error ||'An error occurred while logging in. Please try again later.');
      setLoading(false); // Reset loading state
      return;
    }finally{
      setLoading(false); // Reset loading state after API call
    }
  };

  if (loading) return <Loading/>; // Show loading spinner if loading is true

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-screen h-fit md:min-h-screen bg-gray-50 flex  md:items-center justify-center"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="md:w-[95%] w-full max-w-5xl shadow-none md:shadow-xl rounded-md bg-none md:bg-white border-none md:border-2 border-appleGreen my-5 md:my-14 flex justify-center items-center h-fit min-h-screen md:min-h-[75vh] relative"
      >
        {/* Image - Hidden on small screens */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:block h-full w-[40%] overflow-hidden px-3 py-2"
        >
          <img src={assets.login} className="w-full h-full object-cover rounded-lg" alt="Login" />
        </motion.div>
        {/* Form Container */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-full w-full md:w-[60%] flex items-center  relative p-4 md:p-6"
        >
          <form className="w-full max-w-lg" onSubmit={handleSubmit}>
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
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl mb-2 text-brown font-bold">
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
                  value={formData.email}
                  required
                  onChange={handleChange}
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
                  value={formData.password}
                  required
                  onChange={handleChange}
                  className="w-full h-10 border-b-2 px-4 border-b-appleGreen focus:outline-none focus:border-b-2 focus:border-b-yellowGreen"
                />
              </div>
            </motion.div>
            <div className="flex items-center justify-end w-full mt-2 mb-3">
                <Link to={'/reset-email'} className="text-sm text-yellowGreen font-bold cursor-pointer hover:underline">
                  Forgot Password?
                </Link>
            </div>
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
              <p className="text-sm text-center text-gray-500">
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