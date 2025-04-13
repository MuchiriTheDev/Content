import React from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartBar, FaChartLine, FaChartPie, FaFileAlt, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCalendar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';


// Sample Data for Charts
const earningsData = [
  { month: 'Jan', earnings: 8400 },
  { month: 'Feb', earnings: 4398 },
  { month: 'Mar', earnings: 9800 },
  { month: 'Apr', earnings: 6908 },
];
const audienceData = [
  { month: 'Jan', followers: 400 },
  { month: 'Feb', followers: 900 },
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
// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl shadow-xl border-2 border-appleGree bg-white"
        >
          <p className="text-lg font-extrabold flex gap-2 items-center text-brown">
            <FaCalendar/> {label}
          </p>
          <p className="text-brown font-semibold mt-1 capitalize">
            {`${payload[0].name}:- `}
            <span className="text-yellowGreen font-extrabold">{payload[0].value}</span>
          </p>
        </motion.div>
      );
    }
    return null;
  };
const InsuranceOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard title="Average Earnings" value="$10,506" icon={<FaChartBar className="text-appleGreen text-2xl" />} />
              <StatCard title="Audience Size" value="1.2M" icon={<FaChartLine className="text-appleGreen text-2xl" />} />
              <StatCard title="Active Claims" value="2" icon={<FaFileAlt className="text-appleGreen text-2xl" />} />
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings Over Time (Bar Chart) */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 bg-white rounded-xl shadow-2xl border border-appleGreen"
              >
                <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4 tracking-tight">Earnings Over Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={earningsData}>
                    <XAxis
                      dataKey="month"
                      stroke="#4F391A"
                      tick={{ fill: '#4F391A', fontSize: 14 }}
                      tickLine={{ stroke: '#4F391A' }}
                    />
                    <YAxis
                      stroke="#4F391A"
                      tick={{ fill: '#4F391A', fontSize: 14 }}
                      tickLine={{ stroke: '#4F391A' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#4F391A', fontSize: 14 }} />
                    <Bar
                      dataKey="earnings"
                      fill="url(#barGradient)"
                      radius={[10, 10, 0, 0]}
                      barSize={40}
                      animationDuration={1500}
                    >
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
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-6 bg-white rounded-xl shadow-2xl border border-appleGreen"
              >
                <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4 tracking-tight">Audience Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={audienceData}>
                    <XAxis
                      dataKey="month"
                      stroke="#4F391A"
                      tick={{ fill: '#4F391A', fontSize: 14 }}
                      tickLine={{ stroke: '#4F391A' }}
                    />
                    <YAxis
                      stroke="#4F391A"
                      tick={{ fill: '#4F391A', fontSize: 14 }}
                      tickLine={{ stroke: '#4F391A' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#4F391A', fontSize: 14 }} />
                    <Line
                      type="monotone"
                      dataKey="followers"
                      stroke="url(#lineGradient)"
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#AAC624', stroke: '#4F391A', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#abfa50', stroke: '#4F391A', strokeWidth: 2 }}
                      animationDuration={1500}
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
                transition={{ duration: 0.5, delay: 0.5 }}
                className="p-6 h-fit bg-white rounded-xl shadow-2xl border border-appleGreen"
              >
                <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4 tracking-tight">Platform Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      fill="#AAC624"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={{ stroke: '#4F391A' }}
                      animationDuration={1500}
                    >
                      {platformData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? '#AAC624' : index === 1 ? '#4F391A' : '#abfa50'}
                          stroke="#4F391A"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#4F391A', fontSize: 14 }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
    </div>
  )
}

export default InsuranceOverview
