import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiChevronDown, FiChevronUp, FiDollarSign, FiClock, FiInfo } from 'react-icons/fi';
import { FaCalculator, FaMoneyBillWave } from 'react-icons/fa6';
import { RiFileHistoryFill } from 'react-icons/ri';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { backendUrl } from '../../App'; // Adjust path as needed

const PremiumPage = ({financialData}) => {
  const [premiumData, setPremiumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ open: false });
  
  // Fetch premium data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/premiums/my-premium`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPremiumData(response.data.premium);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch premium data');
        setLoading(false);
        toast.error('Failed to fetch premium data.', {
          style: { background: '#FECACA', color: '#7F1D1D' },
        });
      }
    };

    fetchData();
  }, []);

  // Handle estimate premium
  const handleEstimatePremium = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/premiums/estimate`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(
        `Estimated: ${response.data.estimation.estimatedPercentage}% (KES ${response.data.estimation.estimatedAmount})`,
        { style: { background: '#A3E635', color: '#4A2C2A' } }
      );
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to estimate premium', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  // Handle pay premium
  const handlePayPremium = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/premiums/pay`,
        {
          paymentMethod: financialData?.type,
          paymentDetails: JSON.stringify({ mobileNumber: financialData?.details?.mobileNumber }),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPaymentModal({ open: false });
      toast.success(response.data.message || 'Payment processed', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      setPaymentModal({ open: false });
      console.log(err)
      toast.error(err.response?.data?.error || 'Payment failed', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  // Render payment status badge
  const getPaymentStatusBadge = (status) => {
    const statusStyles = {
      Paid: 'bg-appleGreen text-brown',
      Pending: 'bg-yellow-200 text-yellow-900',
      Failed: 'bg-red-200 text-red-900',
      Overdue: 'bg-red-300 text-red-900',
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
          statusStyles[status] || 'bg-gray-200 text-gray-900'
        } transition-all duration-300`}
      >
        {status}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="p-6 md:p-10 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl border border-appleGreen mx-auto my-8 max-w-6xl"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-brown tracking-tight">
            Your Premium
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Manage your premium payments and view adjustments seamlessly.
          </p>
        </div>
        {premiumData && (
          <button
            onClick={() => setPaymentModal({ open: true })}
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-brown to-fadeBrown rounded-lg font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FaMoneyBillWave className="mr-2" />
            Pay Premium
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block h-12 w-12 border-4 border-appleGreen border-t-transparent rounded-full"
          ></motion.div>
          <p className="text-brown mt-4 text-lg font-medium">Loading premium details...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 text-red-900 p-5 rounded-lg mb-6 flex items-center"
        >
          <FiAlertCircle className="mr-3 text-xl" />
          {error}
        </motion.div>
      )}

      {/* No Premium State */}
      {!loading && !error && !premiumData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <FiDollarSign className="mx-auto text-5xl text-brown mb-4" />
          <p className="text-brown text-lg font-medium">
            No premium data found. Estimate your premium to get started.
          </p>
          <button
            onClick={handleEstimatePremium}
            className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FaCalculator className="mr-2" />
            Estimate Premium
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      {!loading && !error && premiumData && (
        <div className="space-y-10">
          {/* Premium Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Premium Amount Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FiDollarSign className="mr-1" /> Current Premium
                  </p>
                  <p className="text-4xl font-bold text-brown mt-2">
                    KES {premiumData.finalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {premiumData.finalPercentage.toFixed(2)}% of earnings
                  </p>
                </div>
                <FiDollarSign className="text-5xl text-yellowGreen opacity-80" />
              </div>
            </motion.div>

            {/* Payment Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FiClock className="mr-1" /> Payment Status
                  </p>
                  <div className="mt-2">
                    {getPaymentStatusBadge(premiumData.paymentStatus?.status || 'Pending')}
                  </div>
                  {premiumData.paymentStatus?.dueDate && (
                    <p className="text-sm text-gray-600 mt-1">
                      Due: {moment(premiumData.paymentStatus.dueDate).format('MMM D, YYYY')}
                    </p>
                  )}
                </div>
                <FiClock className="text-5xl text-yellowGreen opacity-80" />
              </div>
            </motion.div>
          </div>

          {/* Premium Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
          >
            <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
              <FiInfo className="mr-2" /> Premium Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Currency</p>
                <p className="text-brown font-medium">{premiumData.currency}</p>
              </div>
              {premiumData.discount.percentage > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Discount Applied</p>
                  <p className="text-appleGreen font-medium">{premiumData.discount.percentage}%</p>
                </div>
              )}
              {premiumData.manualAdjustment && (
                <div className="col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-500">Manual Adjustment</p>
                  <p className="text-brown font-medium">
                    {premiumData.manualAdjustment.percentage}% - {premiumData.manualAdjustment.reason} (
                    {moment(premiumData.manualAdjustment.adjustedAt).format('MMM D, YYYY')})
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleEstimatePremium}
              className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaCalculator className="mr-2" />
              Estimate Premium
            </button>
          </motion.div>

          {/* Adjustment History */}
          {premiumData.adjustmentHistory?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 border border-appleGreen"
            >
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center justify-between w-full text-xl font-semibold text-brown mb-6"
              >
                <span className="flex items-center">
                  <RiFileHistoryFill className="mr-2" />
                  Adjustment History
                </span>
                {showHistory ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-x-auto"
                  >
                    <table className="w-full text-left table-auto">
                      <thead>
                        <tr className="text-sm text-gray-500 bg-gray-50">
                          <th className="p-4 w-44 font-medium">
                            <FiClock className="inline mr-1" /> Date
                          </th>
                          <th className="p-4 w-44 font-medium">
                            <FiDollarSign className="inline mr-1" /> Percentage
                          </th>
                          <th className="p-4 w-44 font-medium">
                            <FiDollarSign className="inline mr-1" /> Amount (KES)
                          </th>
                          <th className="p-4 font-medium">
                            <FiInfo className="inline mr-1" /> Reason
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {premiumData.adjustmentHistory.map((adjustment, index) => (
                          <motion.tr
                            key={adjustment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="border-t border-gray-100 hover:bg-appleGreen/10 transition-all duration-200"
                          >
                            <td className="p-4 text-sm text-brown">
                              {moment(adjustment.adjustedAt).format('MMM D, YYYY')}
                            </td>
                            <td className="p-4 text-sm text-brown">{adjustment.percentage}%</td>
                            <td className="p-4 text-sm text-brown">{adjustment.newFinalAmount.toFixed(2)}</td>
                            <td className="p-4 text-sm text-brown">{adjustment.reason}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {paymentModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-appleGreen"
            >
              <h4 className="text-xl font-bold text-brown mb-4">Confirm Payment</h4>
              <p className="text-brown mb-6">
                Pay KES {premiumData?.finalAmount.toFixed(2)} using Mpesa? This action will process your premium payment.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setPaymentModal({ open: false })}
                  className="px-5 py-2 bg-gray-200 text-brown rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayPremium}
                  className="px-5 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown transition-colors duration-300"
                >
                  Confirm Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PremiumPage;