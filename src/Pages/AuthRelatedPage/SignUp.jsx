import React, { useContext, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { FaUser, FaMailBulk, FaLock, FaPhone, FaExclamationCircle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { backendUrl } from '../../App';
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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 9);
      setFormData((prev) => ({ ...prev, [id]: digits }));
      setErrors((prev) => ({ ...prev, phone: digits.length !== 9 ? 'Phone number must be 9 digits' : '' }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) newErrors.firstName = 'Letters and spaces only';
    if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) newErrors.lastName = 'Letters and spaces only';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.phone.length !== 9) newErrors.phone = 'Phone number must be 9 digits';
    if (formData.password.length < 8) newErrors.password = 'Minimum 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors.', {
        style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
      });
      return;
    }
    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        phone: `+254${formData.phone}`,
      };
      const response = await axios.post(`${backendUrl}/auth/register`, submissionData);
      if (response.data.success) {
        toast.success('Account created! Check your email for verification.', {
          style: { background: '#A3E635', color: '#4A2C2A', borderRadius: '8px' },
        });
        setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
        navigate('/verify-email');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error creating account.', {
        style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    toast.info('Google Sign-Up is coming soon!', {
      style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
    });
  };

  // Guidance messages inspired by PlatformInformation
  const fieldGuidance = {
    firstName: 'Your first name helps us personalize your account.',
    lastName: 'Your last name is used for account verification.',
    email: 'We’ll send a verification link to this email.',
    phone: 'Your phone number ensures secure account recovery.',
    password: 'Create a strong password (minimum 8 characters).',
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen w-full bg-gradient-to-br from-white to-appleGreen/10 flex items-center justify-center p-0 md:p-6 relative overflow-hidden"
    >
      {/* Background Shapes */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-0 w-1/3 h-1/3 bg-yellowGreen rounded-full blur-xl -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-brown rounded-full blur-xl -z-10"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
        className="w-full md:max-w-5xl bg-white min-h-screen md:min-h-fit rounded-2xl shadow-lg border border-appleGreen/20 p-8 md:p-10"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex  items-center gap-4 mb-8 w-full"
        >
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-brown/10 rounded-full"
            >
              <MdArrowBack size={24} className="text-brown" />
            </motion.div>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-brown">Create an Account</h1>
          <div className="w-10" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-600 mb-8 text-sm md:text-base"
        >
          Sign up <span className="font-semibold text-yellowGreen">for free</span> to start securing your financial future.
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  items-start">
            {/* First Name */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label htmlFor="firstName" className="block text-sm font-medium text-brown mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">{fieldGuidance.firstName}</p>
              <motion.input
                whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                type="text"
                id="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`w-full h-12 border-2 ${errors.firstName ? 'border-red-400' : 'border-appleGreen'} rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200`}
              />
              <AnimatePresence>
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <FaExclamationCircle /> {errors.firstName}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Last Name */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label htmlFor="lastName" className="block text-sm font-medium text-brown mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">{fieldGuidance.lastName}</p>
              <motion.input
                whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                type="text"
                id="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={`w-full h-12 border-2 ${errors.lastName ? 'border-red-400' : 'border-appleGreen'} rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200`}
              />
              <AnimatePresence>
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <FaExclamationCircle /> {errors.lastName}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-brown mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">{fieldGuidance.email}</p>
              <motion.input
                whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full h-12 border-2 ${errors.email ? 'border-red-400' : 'border-appleGreen'} rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200`}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <FaExclamationCircle /> {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Phone Number */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <label htmlFor="phone" className="block text-sm font-medium text-brown mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">{fieldGuidance.phone}</p>
              <div className="flex">
                <span className="inline-flex items-center px-4 bg-brown text-white text-sm font-medium rounded-l-lg">
                  +254
                </span>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                  type="tel"
                  id="phone"
                  placeholder="712345678"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={9}
                  className={`w-full h-12 border-2 ${errors.phone ? 'border-red-400' : 'border-appleGreen'} rounded-r-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200`}
                />
              </div>
              <AnimatePresence>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <FaExclamationCircle /> {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-brown mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">{fieldGuidance.password}</p>
              <motion.input
                whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                type="password"
                id="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full h-12 border-2 ${errors.password ? 'border-red-400' : 'border-appleGreen'} rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200`}
              />
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <FaExclamationCircle /> {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Submit Button (Outside Grid) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(124, 179, 42, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Create Account
            </motion.button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex items-center my-6"
        >
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="mx-4 text-sm text-gray-500 font-medium">Or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </motion.div>

        {/* Google Sign-Up */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 57, 26, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleSignUp}
            className="w-full h-12 bg-white text-brown font-semibold rounded-lg border-2 border-brown flex items-center justify-center gap-3 hover:bg-brown hover:text-white transition-all duration-300"
          >
            <FcGoogle size={20} /> Continue with Google
          </motion.button>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="text-center mt-6 space-y-3"
        >
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-yellowGreen font-semibold hover:underline">
              Log In
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-yellowGreen font-semibold hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-yellowGreen font-semibold hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;