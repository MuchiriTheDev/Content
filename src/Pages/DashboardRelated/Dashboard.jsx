// Dashboard.js (Updated: Smaller fonts, refined layout, backend-aligned data flow)
import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartBar, FaFileAlt, FaSignOutAlt, FaBars, FaTimes, FaUpload,
  FaRegFileAlt, FaHome, FaChartLine, FaPlusCircle, FaCreditCard,
  FaSearch, FaFileInvoice
} from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { CgAdd } from 'react-icons/cg';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { assets } from '../../assets/assets';
import InsuranceOverview from '../../Component/DashboardComponent/InsuranceOverview';
import ClaimsManagement from '../../Component/DashboardComponent/ClaimsManagement';
import DashboardAnalytics from '../../Component/DashboardComponent/DashboardAnalytics';
import ContentReviewing from '../../Component/DashboardComponent/ContentReviewing';
import AddPlatform from './AddPlatform';
import PremiumPage from '../../Component/DashboardComponent/PremiumPage';
import ClaimComponentPopup from '../../Component/ClaimsComponents/ClaimComponentPopup';

import { GeneralContext } from '../../Context/GeneralContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../../Resources/Loading';
import { backendUrl } from '../../App';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const urlSection = searchParams.get('section') ?? 'overview';
  const urlToken = searchParams.get('token');
  const [activeSection, setActiveSection] = useState(urlSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLarge, setIsLarge] = useState(window.innerWidth >= 768);

  const { loading, setLoading, profile, setProfile, claimId } = useContext(GeneralContext);
  const [insuranceData, setInsuranceData] = useState(null);
  const navigate = useNavigate();

  const sections = {
    overview: <InsuranceOverview insuranceData={insuranceData} setSection={setActiveSection} profile={profile} />,
    analytics: <DashboardAnalytics />,
    claims: <ClaimsManagement />,
    contentReviewing: <ContentReviewing />,
    addPlatform: <AddPlatform />,
    premiums: <PremiumPage financialData={profile?.financialInfo?.paymentMethod} />,
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setProfile(null);
    setInsuranceData(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isTokenValid = (token) => /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token || '');

  useEffect(() => {
    if (urlToken && isTokenValid(urlToken)) {
      localStorage.setItem('token', urlToken);
      navigate('/dashboard', { replace: true });
    }

    const token = localStorage.getItem('token');
    if (!token || !isTokenValid(token)) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get(`${backendUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.data.success) setProfile(userRes.data.user);

        try {
          const insRes = await axios.get(`${backendUrl}/insurance/my-insurance`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (insRes.data.success) {
            setInsuranceData(insRes.data.data);
            toast.success('Insurance data loaded');
          }
        } catch (insErr) {
          console.warn('Insurance fetch failed:', insErr);
        }
      } catch (err) {
        const msg = err.response?.data?.error || 'Failed to load data';
        toast.error(msg);

        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error('Session expired – logging you out');
          localStorage.removeItem('token');
          setProfile(null);
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    const onResize = () => setIsLarge(window.innerTime >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [navigate, setLoading, setProfile, urlToken]);

  useEffect(() => {
    setActiveSection(urlSection);
  }, [urlSection]);

  if (loading) return <Loading />;

  return (
    <div className="w-full min-h-screen bg-gray-100 text-brown flex flex-col overflow-hidden time overflow-time">
      {claimId && <ClaimComponentPopup claimId={claimId} />}

      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full bg-white p-3 flex items-center justify-between z-20 border-b border-appleGreen/20"
      >
        <div className="flex items-center gap-2">
          {!isLarge && (
            <button
              className="p-1.5 text-brown hover:bg-yellowGreen/20 rounded-full"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars size={16} />
            </button>
          )}
          <Link to="/" className="py-1.5 hidden md:block hover:bg-yellowGreen/20 rounded-full">
            <MdArrowBack size={16} className="text-brown" />
          </Link>
          <Link to="/">
            <img src={assets.logo2} alt="CCI Logo" className="h-10 w-auto rounded-full" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 bg-appleGreen text-white rounded-full shadow-md hover:bg-yellowGreen text-xs"
            aria-label="Add application"
          >
            <Link to="/application">
              <CgAdd size={14} />
            </Link>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 bg-appleGreen text-white rounded-full shadow-md hover:bg-yellowGreen text-xs"
            aria-label="Claims"
          >
            <Link to="/claim">
              <FaRegFileAlt size={14} />
            </Link>
          </motion.button>
        </div>
      </motion.nav>

      {/* Sidebar */}
      {(sidebarOpen || isLarge) && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 w-52 bg-white p-3 flex flex-col justify-between h-screen z-30 border-r border-appleGreen/20 ${
            isLarge ? 'md:z-10' : 'z-40'
          }`}
        >
          <div>
            <div className="flex justify-end items-center mb-3 mt-10">
              {!isLarge && (
                <button
                  className="p-1.5 text-brown hover:bg-yellowGreen/20 rounded-full"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <FaTimes size={16} />
                </button>
              )}
            </div>

            <ul className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: <FaHome size={14} /> },
                { id: 'analytics', label: 'Analytics', icon: <FaChartLine size={14} /> },
                { id: 'addPlatform', label: 'Add Platform', icon: <FaPlusCircle size={14} /> },
                { id: 'premiums', label: 'Premiums', icon: <FaCreditCard size={14} /> },
                { id: 'contentReviewing', label: 'Content Review', icon: <FaSearch size={14} /> },
                { id: 'claims', label: 'Claims', icon: <FaFileInvoice size={14} /> },
              ].map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/dashboard?section=${item.id}`}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left py-2 px-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-white'
                        : 'text-brown hover:bg-yellowGreen/10'
                    }`}
                    aria-label={`Switch to ${item.label}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg text-xs font-medium text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt size={12} /> Logout
          </motion.button>
        </motion.aside>
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 ml-0 md:ml-52 mt-14 p-3 overflow-y-auto"
      >
        <h1 className="text-sm md:text-base font-bold bg-white p-2 rounded-lg border border-appleGreen text-center shadow-sm mb-3">
          Welcome {profile?.personalInfo?.fullName || 'User'}
        </h1>

        <div className="max-w-7xl mx-auto">
          {sections[activeSection] ?? sections.overview}
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;