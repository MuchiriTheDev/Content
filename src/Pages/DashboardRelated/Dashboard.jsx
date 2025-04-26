import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaChartLine, FaChartPie, FaFileAlt, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCalendar, FaUpload } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { assets } from '../../assets/assets';
import InsuranceOverview from '../../Component/DashboardComponent/InsuranceOverview';
import ClaimsManagement from '../../Component/DashboardComponent/ClaimsManagement';
import DashboardAnalytics from '../../Component/DashboardComponent/DashboardAnalytics';
import ContentReviewing from '../../Component/DashboardComponent/ContentReviewing';
import { GeneralContext } from '../../Context/GeneralContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { backendUrl } from '../../App';
import Loading from '../../Resources/Loading';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
  const { loading, setLoading, profile, setProfile } = useContext(GeneralContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const sections = {
    overview: <InsuranceOverview />,
    analytics: <DashboardAnalytics />,
    claims: <ClaimsManagement />,
    contentReviewing: <ContentReviewing />,
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Use navigate instead of window.location.reload
  };

  const fetchUserData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    // Validate token format
    if (!token || typeof token !== 'string' || !token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
      setLoading(false);
      toast.error('Invalid or missing token. Please log in again.');
      localStorage.removeItem('token'); // Clear invalid token
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success('User data fetched successfully!');
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error('Fetch user data error:', error.response?.data || error.message); // Log detailed error
      const errorMessage = error.response?.data?.error || 'Failed to fetch user data!';
      toast.error(errorMessage);
      if (errorMessage.includes('invalid signature')) {
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login'); // Redirect to login
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Use navigate instead of window.location.href
      setIsSidebarOpen(false);
      return;
    }

    fetchUserData();

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 770);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]); // Add navigate to dependencies

  if (loading) return <Loading />;

  return (
    <div className="w-full h-screen bg-appleGreen text-brown flex flex-col overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="fixed top-0 left-0 w-full bg-white p-4 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-3">
          {!isLargeScreen && (
            <button
              className="p-2 text-brown"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FaBars size={25} />
            </button>
          )}
          <Link to="/" className="py-2 hidden md:block">
            <MdArrowBack size={25} className="text-brown" />
          </Link>
          <Link to="/">
            <img src={assets.logo2} alt="Logo" className="h-20 w-fit rounded-full" />
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg text-brown shadow-lg"
          >
            <FaBell size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg text-brown shadow-lg"
          >
            <FaUser size={18} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Sidebar */}
      {(isSidebarOpen || isLargeScreen) && (
        <motion.aside
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed top-0 left-0 w-64 bg-white shadow-2xl p-6 flex flex-col justify-between h-screen z-30 ${
            isLargeScreen ? 'md:z-10' : 'z-40'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-6 mt-16 md:mt-20">
              <h2 className="text-xl md:text-2xl font-extrabold text-brown">Menu</h2>
              {!isLargeScreen && (
                <button
                  className="p-2 text-brown"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaTimes size={25} />
                </button>
              )}
            </div>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => {
                    setActiveSection('overview');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left py-2 md:py-3 px-4 rounded-lg flex items-center gap-3 font-semibold ${
                    activeSection === 'overview'
                      ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown'
                      : 'text-brown hover:bg-yellowGreen/20'
                  }`}
                >
                  <FaChartBar /> Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection('analytics');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left py-2 md:py-3 px-4 rounded-lg flex items-center gap-3 font-semibold ${
                    activeSection === 'analytics'
                      ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown'
                      : 'text-brown hover:bg-yellowGreen/20'
                  }`}
                >
                  <FaChartLine /> Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection('contentReviewing');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left py-2 md:py-3 px-4 rounded-lg flex items-center gap-3 font-semibold ${
                    activeSection === 'contentReviewing'
                      ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown'
                      : 'text-brown hover:bg-yellowGreen/20'
                  }`}
                >
                  <FaUpload /> Review Content
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection('claims');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left py-2 md:py-3 px-4 rounded-lg flex items-center gap-3 font-semibold ${
                    activeSection === 'claims'
                      ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown'
                      : 'text-brown hover:bg-yellowGreen/20'
                  }`}
                >
                  <FaFileAlt /> Claims
                </button>
              </li>
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 md:py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300 flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </motion.aside>
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="flex-1 ml-0 md:ml-64 mt-16 p-4 md:p-8 overflow-y-auto h-[calc(100vh-4rem)]"
      >
        <h1 className="text-2xl font-bold py-6 w-full bg-white mb-4 px-5 mt-2 rounded-lg shadow-xl">
          Welcome, {profile?.personalInfo?.firstName || 'User'}
        </h1>
        <div className="max-w-full md:max-w-7xl mx-auto">{sections[activeSection]}</div>
      </motion.main>
    </div>
  );
};

export default Dashboard;