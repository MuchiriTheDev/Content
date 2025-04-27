import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartBar, FaChartLine, FaFileAlt, FaCalendar, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
          <span className="text-yellowGreen font-bold">{payload[0].value}</span>
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

const InsuranceOverview = ({ insuranceData, profile }) => {
  // Process data
  const earningsData = fallbackData.earnings; // No historical earnings data in backend
  const audienceData = fallbackData.audience; // No historical audience data in backend
  const platformData = profile?.platformInfo?.platforms
    ? profile.platformInfo.platforms.reduce((acc, platform) => {
        const existing = acc.find((p) => p.name === platform.name);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: platform.name, value: 1 });
        }
        return acc;
      }, [])
    : [{ name: 'YouTube', value: 1 }]; // Fallback to YouTube

  // Calculate stat card values
  const averageEarnings = profile?.financialInfo?.monthlyEarnings
    ? `Ksh ${profile.financialInfo.monthlyEarnings.toLocaleString()}`
    : 'N/A';
  const totalAudience = profile?.platformInfo?.platforms
    ? profile.platformInfo.platforms.reduce((sum, p) => sum + (p.audienceSize || 0), 0).toLocaleString()
    : '0';
  const activeClaims = insuranceData?.claims?.length
    ? insuranceData.claims.filter((c) => c.status === 'Pending').length
    : 0;
  const insuranceStatus = insuranceData?.insuranceStatus?.status || 'Not Applied';

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Earnings"
          value={averageEarnings}
          icon={<FaChartBar className="text-appleGreen text-2xl" />}
        />
        <StatCard
          title="Audience Size"
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

        {/* Platform Distribution (Pie Chart) */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 bg-white rounded-xl shadow-md border border-appleGreen lg:col-span-2"
        >
          <h3 className="text-xl font-bold text-brown mb-4">Platform Distribution</h3>
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
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: '#4F391A' }}
              >
                {platformData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 3 === 0 ? '#AAC624' : index % 3 === 1 ? '#4F391A' : '#abfa50'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default InsuranceOverview;