// InsuranceOverview.js (Updated: Smaller fonts, consistent colors, backend data integration)
import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartBar, FaUsers, FaShieldAlt, FaEye, FaEyeSlash, FaCheckCircle, FaPlus, FaFileAlt, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color = 'appleGreen', link, hide = false }) => {
  if (hide) return null;

  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => link && (window.location.href = link)}
      className={`p-3 bg-white rounded-lg shadow-md border border-${color} flex items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow text-xs`}
    >
      <div className={`p-2 rounded-full bg-gradient-to-br from-${color} to-yellowGreen text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-brown font-medium">{title}</p>
        <p className="font-bold text-brown">{value}</p>
      </div>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-2 rounded-lg shadow-lg border border-appleGreen bg-white text-xs"
      >
        <p className="font-bold text-brown">{label}</p>
        <p className="text-brown">
          {payload[0].name}: <span className="font-bold text-yellowGreen">{payload[0].value.toLocaleString()}</span>
        </p>
      </motion.div>
    );
  }
  return null;
};

const InsuranceOverview = ({ insuranceData, profile, setSection }) => {
  const navigate = useNavigate();

  const youtube = profile?.platformInfo?.youtube;
  const isMonetized = (profile?.financialInfo?.monthlyEarnings ?? 0) > 0;
  const earnings = isMonetized ? `${profile.financialInfo.currency} ${profile.financialInfo.monthlyEarnings?.toLocaleString() || '0'}` : null;

  const totalAudience = youtube?.channel?.subscriberCount?.toLocaleString() || '0';
  const channelName = youtube?.channel?.title || 'Your Channel';
  const channelPicture = youtube?.profile?.picture || null;
  const isVerified = youtube?.isVerified === true;

  const activeClaims = insuranceData?.claims?.filter(c => c.status !== 'Rejected').length || 0;
  const insuranceStatus = insuranceData?.insuranceStatus?.status || 'Not Applied';

  const earningsData = [
    { month: 'Jan', earnings: 8400 },
    { month: 'Feb', earnings: 4398 },
    { month: 'Mar', earnings: 9800 },
    { month: 'Apr', earnings: 6908 },
  ];

  const audienceData = [
    { month: 'Jan', followers: 400000 },
    { month: 'Feb', followers: 900000 },
    { month: 'Mar', followers: 500000 },
    { month: 'Apr', followers: 700000 },
  ];

  const platformData = youtube ? [{ name: 'YouTube', value: youtube.channel.subscriberCount || 0 }] : [];

  const handleAddPlatform = () => setSection('addPlatform');

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellowGreen to-appleGreen p-1 rounded-xl"
      >
        <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative">
            {channelPicture ? (
              <img src={channelPicture} alt={channelName} className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 border-3 border-white shadow-lg flex items-center justify-center">
                <FaUsers className="text-xl text-gray-400" />
              </div>
            )}
            {isVerified && <FaCheckCircle className="absolute -bottom-0 -right-0 text-blue-500 bg-white rounded-full p-1 text-sm shadow" />}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-lg font-bold text-brown">{channelName}</h2>
            <p className="text-xs text-gray-600 flex items-center justify-center md:justify-start gap-1">
              <FaUsers className="text-appleGreen text-sm" />
              {totalAudience} subscribers
              {isVerified && <span className="ml-1 text-blue-600 font-medium text-xs">Verified</span>}
            </p>
            {isMonetized ? (
              <p className="text-sm font-bold text-yellowGreen mt-1">
                <FaChartLine className="inline mr-1 text-xs" />
                {earnings} / month
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-1">
                <FaEyeSlash className="text-gray-400 text-sm" />
                Not monetized yet
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Insurance</p>
            <p className={`font-bold text-sm ${
              insuranceStatus === 'Approved' ? 'text-appleGreen' :
              insuranceStatus === 'Pending' ? 'text-yellow-600' :
              insuranceStatus === 'Rejected' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {insuranceStatus.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Monthly Earnings"
          value={isMonetized ? earnings : '—'}
          icon={<FaChartBar className="text-sm" />}
          hide={!isMonetized}
        />
        <StatCard
          title="Total Audience"
          value={totalAudience}
          icon={<FaUsers className="text-sm" />}
        />
        <StatCard
          title="Active Claims"
          value={activeClaims}
          icon={<FaFileAlt className="text-sm" />}
          link="/dashboard?section=claims"
        />
        <StatCard
          title="Coverage"
          value={insuranceStatus === 'Approved' ? 'Active' : insuranceStatus}
          icon={<FaShieldAlt className="text-sm" />}
          color={insuranceStatus === 'Approved' ? 'appleGreen' : 'gray-400'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 bg-white rounded-lg shadow-md border border-appleGreen"
        >
          <h3 className="text-sm font-bold text-brown mb-2">Earnings Trend</h3>
          <p className="text-xs text-gray-500 mb-2">Sample data (real backend data incoming)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={earningsData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="earnings" fill="#AAC624" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 bg-white rounded-lg shadow-md border border-appleGreen"
        >
          <h3 className="text-sm font-bold text-brown mb-2">Audience Growth</h3>
          <p className="text-xs text-gray-500 mb-2">Sample data</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={audienceData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="followers" stroke="#AAC624" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 bg-white rounded-lg shadow-md border border-appleGreen lg:col-span-2"
        >
          <h3 className="text-sm font-bold text-brown mb-2">Audience by Platform</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={platformData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
              >
                {platformData.map((_, i) => <Cell key={i} fill="#AAC624" />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {insuranceStatus === 'Pending' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddPlatform}
                className="flex items-center gap-1 py-1.5 px-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-medium text-white text-xs shadow hover:shadow-md"
              >
                <FaPlus size={10} /> Add Platform
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InsuranceOverview;