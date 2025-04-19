import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaChartLine, FaChartPie, FaFileAlt, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCalendar, FaUpload } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import InsuranceOverview from '../../Component/DashboardComponent/InsuranceOverview';
import ClaimsManagement from '../../Component/DashboardComponent/ClaimsManagement';
import DashboardAnalytics from '../../Component/DashboardComponent/DashboardAnalytics';
import ContentReviewing from '../../Component/DashboardComponent/ContentReviewing'; // Assuming this is the file path

// Main Dashboard Component
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = {
    overview: <InsuranceOverview />,
    analytics: <DashboardAnalytics />,
    claims: <ClaimsManagement />,
    contentReviewing: <ContentReviewing />,
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  }

  useEffect(() => {
    if(!localStorage.getItem('token')){
      window.location.href = '/login';
      setIsSidebarOpen(false);
    }
  },[]);


  return (
    <div className="w-full h-screen bg-appleGreen text-brown flex flex-col overflow-hidden">
      {/* Navbar (Fixed) */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="fixed top-0 left-0 w-full bg-white p-4 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 text-brown"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars size={25} />
          </button>
          <Link to="/" className="py-2 hidden md:block">
            <MdArrowBack size={25} className="text-brown" />
          </Link>
          <Link to="/">
            <img src={assets.logo2} alt="Logo" className="h-14 w-fit rounded-full" />
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

      {/* Sidebar (Hidden on Small Screens, Fixed on Large) */}
      {isSidebarOpen || window.innerWidth >= 770 ? (
        <motion.aside
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 w-64 bg-white shadow-2xl p-6 flex flex-col justify-between h-screen z-30 md:z-10"
        >
          <div>
            <div className="flex justify-between items-center mb-6 mt-16 md:mt-20">
              <h2 className="text-xl md:text-2xl font-extrabold text-brown">Menu</h2>
              <button
                className="md:hidden p-2 text-brown"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaTimes size={25} />
              </button>
            </div>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => { setActiveSection('overview'); setIsSidebarOpen(false); }}
                  className={`w-full text-left py-2 md:py-3 px-4 rounded-lg flex items-center gap-3 font-semibold ${activeSection === 'overview' ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown' : 'text-brown hover:bg-yellowGreen/20'}`}
                >
                  <FaChartBar /> Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveSection('analytics'); setIsSidebarOpen(false); }}
                  className={`w-full text-left py-2 md:py-3 px-4 rounded-lg flex items-center gap-3 font-semibold ${activeSection === 'analytics' ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown' : 'text-brown hover:bg-yellowGreen/20'}`}
                >
                  <FaChartLine /> Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveSection('contentReviewing'); setIsSidebarOpen(false); }}
                  className={`w-full text-left py-2 md:py-3 px-4 rounded-lg flex items-center gap-3 font-semibold ${activeSection === 'contentReviewing' ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown' : 'text-brown hover:bg-yellowGreen/20'}`}
                >
                  <FaUpload />Review Content
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveSection('claims'); setIsSidebarOpen(false); }}
                  className={`w-full text-left py-2 md:py-3 px-4 rounded-lg flex items-center gap-3 font-semibold ${activeSection === 'claims' ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown' : 'text-brown hover:bg-yellowGreen/20'}`}
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
      ) : null}

      {/* Main Content (Scrollable) */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="flex-1 ml-0 md:ml-64 mt-16 p-4 md:p-8 overflow-y-auto h-[calc(100vh-4rem)]"
      >
        <h1 className="text-2xl font-bold py-6 w-full bg-white mb-4 px-5 mt-2 rounded-lg shadow-xl">Welcome, Muchiri Mwangi</h1>
        <div className="max-w-full md:max-w-7xl mx-auto">
          {sections[activeSection]}
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;