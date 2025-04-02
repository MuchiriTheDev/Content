import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaChartLine, FaChartPie, FaFileAlt, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { assets } from '../../assets/assets';

// Sample Data for Charts
const earningsData = [
  { month: 'Jan', earnings: 2400 },
  { month: 'Feb', earnings: 1398 },
  { month: 'Mar', earnings: 9800 },
  { month: 'Apr', earnings: 3908 },
];
const audienceData = [
  { month: 'Jan', followers: 400 },
  { month: 'Feb', followers: 300 },
  { month: 'Mar', followers: 500 },
  { month: 'Apr', followers: 700 },
];
const platformData = [
  { name: 'YouTube', value: 400 },
  { name: 'TikTok', value: 300 },
  { name: 'Instagram', value: 200 },
];

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="p-4 bg-white rounded-xl shadow-2xl border border-appleGreen flex items-center gap-4"
  >
    {icon}
    <div>
      <p className="text-brown font-semibold">{title}</p>
      <p className="text-2xl font-extrabold text-brown">{value}</p>
    </div>
  </motion.div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = {
    overview: (
      <div className="grid grid-cols-1 gap-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total Earnings" value="$15,506" icon={<FaChartBar className="text-appleGreen text-2xl" />} />
          <StatCard title="Audience Size" value="1.2M" icon={<FaChartLine className="text-appleGreen text-2xl" />} />
          <StatCard title="Active Claims" value="2" icon={<FaFileAlt className="text-appleGreen text-2xl" />} />
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 bg-white rounded-xl shadow-2xl border border-appleGreen"
          >
            <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4">Earnings Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={earningsData}>
                <XAxis dataKey="month" stroke="#5A3E1E" />
                <YAxis stroke="#5A3E1E" />
                <Tooltip />
                <Legend />
                <Bar dataKey="earnings" fill="#A8D5A2" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 bg-white rounded-xl shadow-2xl border border-appleGreen"
          >
            <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4">Audience Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={audienceData}>
                <XAxis dataKey="month" stroke="#5A3E1E" />
                <YAxis stroke="#5A3E1E" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="followers" stroke="#A8D5A2" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-6 bg-white rounded-xl shadow-2xl border border-appleGreen"
          >
            <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4">Platform Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={platformData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#A8D5A2"
                  label
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#A8D5A2' : '#D9E8A2'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    ),
    analytics: (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 bg-white rounded-xl shadow-2xl border border-appleGreen"
      >
        <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4">Analytics</h3>
        <p className="text-brown">More detailed analytics coming soon...</p>
      </motion.div>
    ),
    claims: (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 bg-white rounded-xl shadow-2xl border border-appleGreen"
      >
        <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4">Claims</h3>
        <p className="text-brown mt-2">Latest Claim: $2,000 - Paid</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 w-full py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300"
        >
          File a Claim
        </motion.button>
      </motion.div>
    ),
  };

  return (
    <div className="w-full h-screen bg-appleGreen text-brown flex flex-col overflow-hidden">
      {/* Navbar (Fixed) */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="fixed top-0 left-0 w-full bg-white p-4 flex items-center justify-between z-20 "
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
          <img src={assets.logo2} className="w-auto h-12 md:h-16" alt="Logo for CCI" />
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
      {isSidebarOpen || window.innerWidth >= 770  ? (
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
            onClick={() => setIsSidebarOpen(false)}
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
        <div className="max-w-full md:max-w-7xl mx-auto">
          {sections[activeSection]}
        </div>
      </motion.main>

      {/* Notifications (Fixed, Hidden on Mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden md:block fixed top-16 right-4 w-72 p-6 bg-white rounded-xl shadow-2xl border border-appleGreen z-20"
      >
        <h3 className="text-xl font-extrabold text-brown flex items-center gap-2">
          <FaBell /> Notifications
        </h3>
        <p className="text-brown text-sm mt-2">YouTube: Video demonetized</p>
        <p className="text-yellowGreen text-sm mt-1">Payment due in 3 days</p>
      </motion.div>
    </div>
  );
};

export default Dashboard;