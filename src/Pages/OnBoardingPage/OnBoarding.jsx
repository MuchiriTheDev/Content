import React, { useContext, useState, useEffect } from 'react';
import { 
  FaExclamationCircle, 
  FaCheck, 
  FaGraduationCap, 
  FaGamepad, 
  FaHeart, 
  FaLaugh, 
  FaMusic, 
  FaVideo, 
  FaLaptopCode, 
  FaTrophy,
  FaUtensils,
  FaPlane,
  FaPalette,
  FaDumbbell,
  FaChartLine,
  FaLightbulb,
  FaNewspaper,
  FaTools,
  FaBaby,
  FaFilm,
  FaCar,
  FaEllipsisH
} from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneralContext } from '../../Context/GeneralContext';
import Loading from '../../Resources/Loading';
import toast from 'react-hot-toast';
import axios from 'axios';
import { backendUrl } from '../../App';

const contentTypes = [
  { value: 'Education', label: 'Education', Icon: FaGraduationCap, color: 'from-blue-400 to-blue-600' },
  { value: 'Gaming', label: 'Gaming', Icon: FaGamepad, color: 'from-purple-400 to-purple-600' },
  { value: 'Lifestyle', label: 'Lifestyle', Icon: FaHeart, color: 'from-pink-400 to-pink-600' },
  { value: 'Comedy', label: 'Comedy', Icon: FaLaugh, color: 'from-yellow-400 to-yellow-600' },
  { value: 'Music', label: 'Music', Icon: FaMusic, color: 'from-green-400 to-green-600' },
  { value: 'Vlogs', label: 'Vlogs', Icon: FaVideo, color: 'from-red-400 to-red-600' },
  { value: 'Tech', label: 'Tech', Icon: FaLaptopCode, color: 'from-indigo-400 to-indigo-600' },
  { value: 'Sports', label: 'Sports', Icon: FaTrophy, color: 'from-orange-400 to-orange-600' },
  { value: 'Food', label: 'Food & Cooking', Icon: FaUtensils, color: 'from-amber-400 to-amber-600' },
  { value: 'Travel', label: 'Travel', Icon: FaPlane, color: 'from-cyan-400 to-cyan-600' },
  { value: 'Beauty', label: 'Beauty & Fashion', Icon: FaPalette, color: 'from-rose-400 to-rose-600' },
  { value: 'Fitness', label: 'Fitness', Icon: FaDumbbell, color: 'from-emerald-400 to-emerald-600' },
  { value: 'Business', label: 'Business & Finance', Icon: FaChartLine, color: 'from-violet-400 to-violet-600' },
  { value: 'Motivation', label: 'Motivation', Icon: FaLightbulb, color: 'from-lime-400 to-lime-600' },
  { value: 'News', label: 'News & Politics', Icon: FaNewspaper, color: 'from-slate-400 to-slate-600' },
  { value: 'DIY', label: 'DIY & Crafts', Icon: FaTools, color: 'from-teal-400 to-teal-600' },
  { value: 'Parenting', label: 'Parenting', Icon: FaBaby, color: 'from-fuchsia-400 to-fuchsia-600' },
  { value: 'Animation', label: 'Animation', Icon: FaFilm, color: 'from-sky-400 to-sky-600' },
  { value: 'Automotive', label: 'Cars & Bikes', Icon: FaCar, color: 'from-zinc-400 to-zinc-600' },
  { value: 'Other', label: 'Other', Icon: FaEllipsisH, color: 'from-gray-400 to-gray-600' },
];

const OnBoarding = () => {
  const [phoneDigits, setPhoneDigits] = useState('');
  const [selectedContentType, setSelectedContentType] = useState('');
  const [formData, setFormData] = useState({ dateOfBirth: '' });
  const { loading, setLoading } = useContext(GeneralContext);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhoneDigits(value);
    setErrors((prev) => ({ ...prev, phoneNumber: '' }));
  };

  const handleContentTypeSelect = (type) => {
    setSelectedContentType(type);
    setErrors((prev) => ({ ...prev, contentType: '' }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (phoneDigits.length !== 9) {
      newErrors.phoneNumber = 'Enter exactly 9 digits (e.g., 712345678)';
    }
    if (!selectedContentType) newErrors.contentType = 'Please select your content type';
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

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication required. Please log in again.', {
        style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
      });
      navigate('/login');
      return;
    }

    const fullPhoneNumber = `+254${phoneDigits}`;

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/auth/onboard`, {
        phoneNumber: fullPhoneNumber,
        dateOfBirth: formData.dateOfBirth,
        contentType: selectedContentType,
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Onboarding complete!', {
          style: { background: '#A3E635', color: '#4A2C2A', borderRadius: '8px' },
        });
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'An error occurred during onboarding.', {
        style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldGuidance = {
    phoneNumber: 'Enter your 9-digit M-Pesa number.',
    dateOfBirth: 'Your date of birth (optional).',
    contentType: 'Choose what best describes your YouTube content.',
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen w-full bg-gradient-to-br from-white to-appleGreen/10 flex items-center justify-center p-0 md:p-4 relative overflow-hidden"
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
        className="w-full md:max-w-5xl p-5 md:p-10 bg-white min-h-screen md:min-h-fit rounded-2xl shadow-lg border border-appleGreen/20"
      >
        {/* Form Section */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full  flex items-center justify-center"
        >
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Header */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 bg-brown/10 rounded-full"
                >
                  <MdArrowBack size={20} className="text-brown" />
                </motion.div>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-brown">Complete Your Onboarding</h1>
              </div>
            </motion.div>

            <p className="text-xs md:text-sm text-gray-600 mt-1 mb-6">
              Provide your details to finish setting up your account.
            </p>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 gap-6">
              {/* Phone Number */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label htmlFor="phoneDigits" className="block text-sm font-medium text-brown mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">{fieldGuidance.phoneNumber}</p>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-brown font-medium text-sm z-10">
                    +254
                  </span>
                  <motion.input
                    whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                    type="tel"
                    id="phoneDigits"
                    placeholder="712345678"
                    value={phoneDigits}
                    onChange={handlePhoneChange}
                    maxLength={9}
                    required
                    className={`w-full h-10 pl-16 pr-3 border-2 ${errors.phoneNumber ? 'border-red-400' : 'border-appleGreen'} rounded-lg text-brown bg-white focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 text-sm`}
                  />
                </div>
                <AnimatePresence>
                  {errors.phoneNumber && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <FaExclamationCircle /> {errors.phoneNumber}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Date of Birth */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-brown mb-1">
                  Date of Birth
                </label>
                <p className="text-xs text-gray-500 mb-2">{fieldGuidance.dateOfBirth}</p>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full h-10 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 text-sm`}
                />
              </motion.div>

              {/* Content Type - Compact Grid */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <label className="block text-sm font-medium text-brown mb-1">
                  Content Type <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">{fieldGuidance.contentType}</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {contentTypes.map((type) => {
                    const Icon = type.Icon;
                    return (
                      <motion.div
                        key={type.value}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleContentTypeSelect(type.value)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden shadow-sm transition-all duration-300 h-16 sm:h-20 ${
                          selectedContentType === type.value
                            ? 'ring-3 ring-yellowGreen ring-offset-2 shadow-lg'
                            : 'hover:shadow-md'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-90`} />
                        <div className="relative p-2 sm:p-3 flex flex-col items-center justify-center h-full text-white">
                          <Icon className="text-lg sm:text-xl mb-0.5" />
                          <p className="text-[10px] sm:text-xs font-medium text-center leading-tight">
                            {type.label}
                          </p>
                          {selectedContentType === type.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"
                            >
                              <FaCheck className="text-yellowGreen text-[10px]" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {errors.contentType && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-2 flex items-center gap-1"
                    >
                      <FaExclamationCircle /> {errors.contentType}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(124, 179, 42, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
              >
                Complete Onboarding
              </motion.button>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="text-center mt-6"
            >
              <p className="text-xs text-gray-600">
                By completing, you agree to our{' '}
                <Link to="/terms" className="text-yellowGreen font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-yellowGreen font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OnBoarding;