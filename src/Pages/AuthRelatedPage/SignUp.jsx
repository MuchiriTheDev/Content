import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { MdArrowBack } from 'react-icons/md';
import { FaLock, FaMailBulk, FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { backendUrl } from '../../App';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import Loading from '../../Resources/Loading';

const SignUp = () => {
  const { loading, setLoading } = useContext(GeneralContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    setLoading(true);
    // Here you can add your form submission logic, like sending the data to an API
    try {
      const response = await axios.post(`${backendUrl}/auth/register`, formData);
      console.log('Response:', response.data);
      if(response.data.success){
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/verify-email')
        return;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error?.response?.data?.error||'Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
    // Reset form data after submission
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    });
    // Add your form submission logic here
  };

  if (loading) return <Loading />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-screen h-fit md:min-h-screen bg-gray-50 flex items-center justify-center"
    >
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="md:w-[95%] w-full max-w-5xl shadow-none md:shadow-xl rounded-md bg-none md:bg-white border-none md:border-2 border-appleGreen my-5 md:my-10 flex justify-center items-center h-fit md:min-h-[75vh] relative"
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:flex h-full w-[40%] overflow-hidden items-center justify-center px-3"
        >
          <img src={assets.signup} className="w-fit h-full object-cover rounded-lg" alt="Signup" />
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-full w-full md:w-[60%] flex items-center relative p-4 py-8 md:p-6"
        >
          <form className="w-full max-w-lg" onSubmit={handleSubmit}>
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
                <h1 className="text-3xl md:text-4xl mb-2 text-brown font-bold">
                  Create An Account
                </h1>
                <p className="text-sm text-gray-500">
                  Create an account <strong>for free</strong> and start your journey to financial security as a content creator.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="w-full h-fit p-6 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg border-2 border-appleGreen"
            >
              <div className="w-full h-fit flex flex-col md:flex-row gap-5 mb-4">
                <div className="w-full md:w-[50%]">
                  <label
                    htmlFor="firstName"
                    className="text-sm text-yellowGreen flex gap-2 mb-2 items-center"
                  >
                    <FaUser /> First Name
                  </label>
                  <motion.input
                    whileFocus={{ borderColor: '#A3BFFA' }}
                    type="text"
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full h-10 border-b-2 px-4 border-b-appleGreen focus:outline-none focus:border-b-2 focus:border-b-yellowGreen"
                  />
                </div>
                <div className="w-full md:w-[50%]">
                  <label
                    htmlFor="lastName"
                    className="text-sm text-yellowGreen flex gap-2 mb-2 items-center"
                  >
                    <FaUser /> Last Name
                  </label>
                  <motion.input
                    whileFocus={{ borderColor: '#A3BFFA' }}
                    type="text"
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full h-10 border-b-2 px-4 border-b-appleGreen focus:outline-none focus:border-b-2 focus:border-b-yellowGreen"
                  />
                </div>
              </div>
              <div className="w-full h-fit flex flex-col md:flex-row gap-5 mb-3">
                <div className="w-full md:w-[50%]">
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
                    onChange={handleChange}
                    required
                    className="w-full h-10 border-b-2 px-4 border-b-appleGreen focus:outline-none focus:border-b-2 focus:border-b-yellowGreen"
                  />
                </div>
                <div className="w-full md:w-[50%]">
                  <label
                    htmlFor="phone"
                    className="text-sm text-yellowGreen flex gap-2 mb-2 items-center"
                  >
                    Phone Number
                  </label>
                  <motion.input
                    whileFocus={{ borderColor: '#A3BFFA' }}
                    type="tel"
                    id="phone"
                    placeholder="Enter your number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full h-10 border-b-2 px-4 border-b-appleGreen focus:outline-none focus:border-b-2 focus:border-b-yellowGreen"
                  />
                </div>
              </div>
              <div className="w-full h-fit mb-3">
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
                  onChange={handleChange}
                  required
                  className="w-full h-10 border-b-2 px-4 border-b-appleGreen focus:outline-none focus:border-b-2 focus:border-b-yellowGreen"
                />
              </div>
            </motion.div>
            
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
                Create Account
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
                Already have an account?{' '}
                <Link to="/login" className="text-yellowGreen font-bold cursor-pointer">
                  Login
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
                By signing up, you agree to our{' '}
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

export default SignUp;