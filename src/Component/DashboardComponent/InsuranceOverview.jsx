import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartBar, FaChartLine, FaFileAlt, FaCalendar, FaShieldAlt, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="p-4 bg-white rounded-xl shadow-md border border-appleGreen flex items-center gap-4"
  >
    {icon}
    <div>
      <p className="text-brown font-medium">{title}</p>
      <p className="text-xl font-bold text-brown">{value}</p>
    </div>
  </motion.div>
);

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="p-3 rounded-lg shadow-lg border border-appleGreen bg-white"
      >
        <p className="text-base font-bold flex gap-2 items-center text-brown">
          <FaCalendar /> {label}
        </p>
        <p className="text-brown font-medium mt-1 capitalize">
          {`${payload[0].name}: `}
          <span className="text-yellowGreen font-bold">{payload[0].value.toLocaleString()} followers</span>
        </p>
      </motion.div>
    );
  }
  return null;
};

// Fallback data for charts
const fallbackData = {
  earnings: [
    { month: 'Jan', earnings: 8400 },
    { month: 'Feb', earnings: 4398 },
    { month: 'Mar', earnings: 9800 },
    { month: 'Apr', earnings: 6908 },
  ],
  audience: [
    { month: 'Jan', followers: 400000 },
    { month: 'Feb', followers: 900000 },
    { month: 'Mar', followers: 500000 },
    { month: 'Apr', followers: 700000 },
  ],
};

const InsuranceOverview = ({ insuranceData, profile, setSection }) => {
  const navigate = useNavigate();

  // Process data
  const earningsData = fallbackData.earnings; // No historical earnings data in backend
  const audienceData = fallbackData.audience; // No historical audience data in backend
  const platformData = profile?.platformInfo?.platforms
    ? profile.platformInfo.platforms.map((platform, index) => {
        // Count how many times this platform name appears before this index to create unique names
        const samePlatformCount = profile.platformInfo.platforms
          .slice(0, index)
          .filter((p) => p.name === platform.name).length;
        const displayName = samePlatformCount > 0 ? `${platform.name} ${samePlatformCount + 1}` : platform.name;
        return {
          name: displayName,
          value: platform.audienceSize || 0,
        };
      })
    : [{ name: 'YouTube', value: 1000 }]; // Fallback to a single YouTube platform

  // Calculate stat card values
  const averageEarnings = profile?.financialInfo?.monthlyEarnings
    ? `${profile.financialInfo.currency} ${profile.financialInfo.monthlyEarnings.toLocaleString()}`
    : 'N/A';
  const totalAudience = profile?.platformInfo?.platforms
    ? profile.platformInfo.platforms.reduce((sum, p) => sum + (p.audienceSize || 0), 0).toLocaleString()
    : '0';
  const activeClaims = insuranceData?.claims?.length
    ? insuranceData.claims.filter((c) => c.status !== 'Rejected').length
    : 0;

  const insuranceStatus = insuranceData?.insuranceStatus?.status || 'Not Applied';

  // Handle Add Platform button click
  const handleAddPlatform = () => {
    setSection('addPlatform'); // Set the active section to 'addPlatform'
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earnings"
          value={averageEarnings}
          icon={<FaChartBar className="text-appleGreen text-2xl" />}
        />
        <StatCard
          title="Total Audience"
          value={totalAudience}
          icon={<FaChartLine className="text-appleGreen text-2xl" />}
        />
        <StatCard
          title="Active Claims"
          value={activeClaims}
          icon={<FaFileAlt className="text-appleGreen text-2xl" />}
        />
        <StatCard
          title="Insurance Status"
          value={insuranceStatus}
          icon={<FaShieldAlt className="text-appleGreen text-2xl" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Over Time (Bar Chart) */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 bg-white rounded-xl shadow-md border border-appleGreen"
        >
          <h3 className="text-xl font-bold text-brown mb-4">Earnings Over Time</h3>
          <p className="text-sm text-gray-500 mb-4">Historical earnings data not available. Showing sample data.</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
              <XAxis dataKey="month" stroke="#4F391A" tick={{ fill: '#4F391A' }} />
              <YAxis stroke="#4F391A" tick={{ fill: '#4F391A' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="earnings" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={40}>
                {earningsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#AAC624" />
                  <stop offset="100%" stopColor="#abfa50" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Audience Growth (Line Chart) */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 bg-white rounded-xl shadow-md border border-appleGreen"
        >
          <h3 className="text-xl font-bold text-brown mb-4">Audience Growth</h3>
          <p className="text-sm text-gray-500 mb-4">Historical audience data not available. Showing sample data.</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={audienceData}>
              <XAxis dataKey="month" stroke="#4F391A" tick={{ fill: '#4F391A' }} />
              <YAxis stroke="#4F391A" tick={{ fill: '#4F391A' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ r: 5, fill: '#AAC624' }}
                activeDot={{ r: 7, fill: '#abfa50' }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#AAC624" />
                  <stop offset="100%" stopColor="#abfa50" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform Audience Distribution (Pie Chart) */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 bg-white rounded-xl shadow-md border border-appleGreen lg:col-span-2"
        >
          <h3 className="text-xl font-bold text-brown mb-4">Audience Size Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                label={({ name, value }) => `${name} (${value.toLocaleString() === 158 ? value.toLocaleString * 1000 :  value.toLocaleString()})`}
                labelLine={{ stroke: '#4F391A' }}
              >
                {platformData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index % 10 === 0 ? '#AAC624' :       // Vibrant lime (yellow-green)
                      index % 10 === 1 ? '#4F391A' :       // Deep chocolate brown
                      index % 10 === 2 ? '#C0DC3A' :       // Electric lime
                      index % 10 === 3 ? '#634725' :       // Warm chestnut brown
                      index % 10 === 4 ? '#8FAF10' :       // Olive green
                      index % 10 === 5 ? '#3A2B10' :       // Cool espresso brown
                      index % 10 === 6 ? '#abfa50' :       // Neon green
                      index % 10 === 7 ? '#5D4328' :       // Reddish-brown (new variant)
                      index % 10 === 8 ? '#D2FF8C' :       // Pastel mint
                      index % 10 === 9 ? '#2E2210'  : null       // Nearly black brown (new darkest variant)
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {/* Add Platform Button */}
          {insuranceStatus === 'Pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddPlatform}
                className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all"
              >
                <FaPlus /> Add Platform
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InsuranceOverview;