import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaChartLine, FaChartPie, FaFileAlt, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes, FaUpload } from 'react-icons/fa';
import { MdArrowBack, MdPayment } from 'react-icons/md';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import AddPlatform from './AddPlatform';
import { IoAdd, IoAddCircle } from 'react-icons/io5';
import PremiumPage from '../../Component/DashboardComponent/PremiumPage';
import ClaimComponentPopup from '../../Component/ClaimsComponents/ClaimComponentPopup';

const Dashboard = () => {
  const [ searchParams ] = useSearchParams();
  const section = searchParams.get('section') || 'overview';
  console.log(section)
  const [activeSection, setActiveSection] = useState(section || 'overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const { loading, setLoading, profile, setProfile , claimId } = useContext(GeneralContext);
  const [insuranceData, setInsuranceData] = useState(null);
  const navigate = useNavigate();

  const sections = {
    overview: <InsuranceOverview insuranceData={insuranceData} setSection={setActiveSection} profile={profile} />,
    analytics: <DashboardAnalytics />,
    claims: <ClaimsManagement />,
    contentReviewing: <ContentReviewing />,
    addPlatform: <AddPlatform />,
    premiums: <PremiumPage />,
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setProfile(null);
    setInsuranceData(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const fetchUserData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token || typeof token !== 'string' || !token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
      setLoading(false);
      toast.error('Invalid or missing token. Please log in again.');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      // Fetch user data
      const userResponse = await axios.get(`${backendUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userResponse.data.success) {
        setProfile(userResponse.data.user);
      }

      // Fetch insurance data
      const insuranceResponse = await axios.get(`${backendUrl}/insurance/my-insurance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (insuranceResponse.data.success) {
        setInsuranceData(insuranceResponse.data.data);
        console.log('Insurance data:', insuranceResponse.data.data);
        toast.success('Insurance data loaded successfully!');
      }
    } catch (error) {
      console.error('Fetch data error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to fetch data!';
      toast.error(errorMessage);
      if (errorMessage.includes('invalid signature') || errorMessage.includes('Unauthorized')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      setIsSidebarOpen(false);
      return;
    }

    fetchUserData();

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  if (loading) return <Loading />;

  return (
    <div className="w-full min-h-screen bg-gray-100 text-brown flex flex-col overflow-hidden">
      <ClaimComponentPopup claimId={claimId} />
      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full bg-white p-4 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-3">
          {!isLargeScreen && (
            <button
              className="p-2 text-brown hover:bg-yellowGreen/20 rounded-full"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars size={24} />
            </button>
          )}
          <Link to="/" className="py-2 hidden md:block hover:bg-yellowGreen/20 rounded-full">
            <MdArrowBack size={24} className="text-brown" />
          </Link>
          <Link to="/">
            <img src={assets.logo2} alt="CCI Logo" className="h-16 w-fit rounded-full" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-appleGreen text-white rounded-full shadow-md hover:bg-yellowGreen"
            aria-label="Notifications"
          >
            <FaBell size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-appleGreen text-white rounded-full shadow-md hover:bg-yellowGreen"
            aria-label="User Profile"
          >
            <FaUser size={18} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Sidebar */}
      {(isSidebarOpen || isLargeScreen) && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 w-64 bg-white  p-6 flex flex-col justify-between h-screen z-30 ${
            isLargeScreen ? 'md:z-10' : 'z-40'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-6 mt-16">
             
              {!isLargeScreen && (
                <button
                  className="p-2 text-brown hover:bg-yellowGreen/20 rounded-full"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <FaTimes size={24} />
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
                { id: 'addPlatform', label: 'Add Platform', icon: <IoAddCircle />},
                { id: 'premiums', label: 'Premiums', icon: <MdPayment /> },
                { id: 'contentReviewing', label: 'Review Content', icon: <FaUpload /> },
                { id: 'claims', label: 'Claims', icon: <FaFileAlt /> },
                
              ].map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/dashboard?section=${item.id}`}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-white'
                        : 'text-brown hover:bg-yellowGreen/10'
                    }`}
                    aria-label={`Switch to ${item.label}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </motion.aside>
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 ml-0 md:ml-64 mt-20 p-6 overflow-y-auto"
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-white p-4 py-6 rounded-2xl border border-appleGreen text-center shadow-md mb-6">
          Welcome {profile?.personalInfo?.firstName || 'User'} 👋
        </h1>
        <div className="max-w-7xl mx-auto">{sections[activeSection]}</div>
      </motion.main>
    </div>
  );
};

export default Dashboard;