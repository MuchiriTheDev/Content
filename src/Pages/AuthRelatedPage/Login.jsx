import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { FaExclamationCircle } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { FaYoutube, FaTwitter, FaTiktok, FaInstagram, FaFacebook, FaTwitch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneralContext } from '../../Context/GeneralContext';
import Loading from '../../Resources/Loading';
import toast from 'react-hot-toast';
import axios from 'axios';
import { backendUrl } from '../../App';

const Login = () => {
  const { loading, setLoading } = useContext(GeneralContext);
  const navigate = useNavigate();

  const handleConnect = (platform) => {
    toast.loading('Preparing logining...');
    if(platform === 'YouTube') {
      toast.dismiss();
      window.location.href = `${backendUrl}/auth/youtube`;
      return;
    } else {
      toast.info(`${platform} connection is coming soon!`)
      return;
    }
  };

  const handleGoogleConnect = () => {
    handleConnect('Google');
  };

  const handleYoutubeConnect = () => {
    handleConnect('YouTube');
  };

  const handleXConnect = () => {
    handleConnect('X');
  };

  const handleTiktokConnect = () => {
    handleConnect('TikTok');
  };

  const handleInstagramConnect = () => {
    handleConnect('Instagram');
  };

  const handleFacebookConnect = () => {
    handleConnect('Facebook');
  };

  const handleTwitchConnect = () => {
    handleConnect('Twitch');
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
        className="w-full md:max-w-xl bg-white min-h-screen md:min-h-fit rounded-2xl shadow-lg border border-appleGreen/20"
      >
        {/* Form Section */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full p-6 flex items-center justify-center"
        >
          <div className="w-full">
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
                <h1 className="text-2xl md:text-3xl font-bold text-brown">Login Your Channels</h1>
              </div>
            </motion.div>

            <p className="text-xs md:text-sm text-gray-600 mt-1 mb-6">
              Link your monetized platforms to manage your content creator journey.
            </p>

            {/* Connect Buttons */}
            <div className="grid grid-cols-1 gap-4">
              {/* YouTube */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onClick={handleYoutubeConnect}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 57, 26, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-10 bg-white text-brown font-semibold rounded-lg border-2 border-brown flex items-center justify-start pl-4 gap-2 hover:bg-brown hover:text-white transition-all duration-300 text-sm"
                >
                  <FaYoutube size={18} className="text-red-600" /> Connect with YouTube
                </motion.button>
              </motion.div>

              {/* X */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                onClick={handleXConnect}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 57, 26, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-10 bg-white text-brown font-semibold rounded-lg border-2 border-brown flex items-center justify-start pl-4 gap-2 hover:bg-brown hover:text-white transition-all duration-300 text-sm"
                >
                  <FaTwitter size={18} className="text-blue-500" /> Connect with X
                </motion.button>
              </motion.div>

              {/* TikTok */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={handleTiktokConnect}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 57, 26, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-10 bg-white text-brown font-semibold rounded-lg border-2 border-brown flex items-center justify-start pl-4 gap-2 hover:bg-brown hover:text-white transition-all duration-300 text-sm"
                >
                  <FaTiktok size={18} className="text-black" /> Connect with TikTok
                </motion.button>
              </motion.div>

              {/* Instagram */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                  onClick={handleInstagramConnect}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 57, 26, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-10 bg-white text-brown font-semibold rounded-lg border-2 border-brown flex items-center justify-start pl-4 gap-2 hover:bg-brown hover:text-white transition-all duration-300 text-sm"
                >
                  <FaInstagram size={18} className="text-pink-500" /> Connect with Instagram
                </motion.button>
              </motion.div>

              {/* Facebook */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={handleFacebookConnect}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 57, 26, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-10 bg-white text-brown font-semibold rounded-lg border-2 border-brown flex items-center justify-start pl-4 gap-2 hover:bg-brown hover:text-white transition-all duration-300 text-sm"
                >
                  <FaFacebook size={18} className="text-blue-600" /> Connect with Facebook
                </motion.button>
              </motion.div>

              {/* Twitch */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                  onClick={handleTwitchConnect}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 57, 26, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-10 bg-white text-brown font-semibold rounded-lg border-2 border-brown flex items-center justify-start pl-4 gap-2 hover:bg-brown hover:text-white transition-all duration-300 text-sm"
                >
                  <FaTwitch size={18} className="text-purple-600" /> Connect with Twitch
                </motion.button>
              </motion.div>
            </div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="text-center mt-4 space-y-2"
            >
              <p className="text-xs text-gray-600">
                Already Have An Accoutn?{' '}
                <Link to="/login" className="text-yellowGreen font-semibold hover:underline">
                  Login
                </Link>
              </p>
              <p className="text-xs text-gray-600">
                By connecting, you agree to our{' '}
                <Link to="/terms" className="text-yellowGreen font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-yellowGreen font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;