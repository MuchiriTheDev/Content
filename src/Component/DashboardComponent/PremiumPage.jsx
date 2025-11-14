import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiChevronDown, FiChevronUp, FiDollarSign, FiClock, FiCreditCard, FiInfo } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa6';
import { RiFileHistoryFill } from 'react-icons/ri';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { backendUrl } from '../../App'; // Adjust path as needed
import { AiFillCalculator } from 'react-icons/ai';

const PremiumPage = ({ financialData }) => {
  const [premiumData, setPremiumData] = useState(null);
  const [estimatedPremium, setEstimatedPremium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ open: false });

  // Fetch premium or estimate data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // First, try to fetch existing premium
        const premiumResponse = await axios.get(`${backendUrl}/premiums/my-premium`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPremiumData(premiumResponse.data.premium);
        setLoading(false);
      } catch (premiumErr) {
        if (premiumErr.response?.status === 404) {
          // No premium exists, fetch estimate
          try {
            const estimateResponse = await axios.post(
              `${backendUrl}/premiums/estimate`,
              {}, // Empty body for self-estimate
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setEstimatedPremium(estimateResponse.data.estimation);
            setLoading(false);
          } catch (estimateErr) {
            setError(estimateErr.response?.data?.error || 'Failed to fetch estimate');
            setLoading(false);
            toast.error('Failed to fetch premium estimate.', {
              style: { background: '#FECACA', color: '#7F1D1D' },
            });
          }
        } else {
          setError(premiumErr.response?.data?.error || 'Failed to fetch premium data');
          console.log(error)
          setLoading(false);
          toast.error('Failed to fetch premium data.', {
            style: { background: '#FECACA', color: '#7F1D1D' },
          });
        }
      }
    };

    fetchData();
  }, []);

  // Handle pay premium (only if premium exists)
  const handlePayPremium = async () => {
    if (!premiumData) {
      toast.error('No active premium to pay. Please apply for insurance first.', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/premiums/pay`,
        {
          paymentMethod: 'M-Pesa',
          paymentDetails: JSON.stringify({ mobileNumber: financialData?.details?.mobileNumber || '' }),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPaymentModal({ open: false });
      toast.success(response.data.message || 'Payment processed', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      // Refresh premium data after payment
      const updatedResponse = await axios.get(`${backendUrl}/premiums/my-premium`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPremiumData(updatedResponse.data.premium);
    } catch (err) {
      setPaymentModal({ open: false });
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
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
          statusStyles[status] || 'bg-gray-200 text-gray-900'
        } transition-all duration-300`}
      >
        {status}
      </span>
    );
  };

  // Render payment attempt status badge
  const getAttemptStatusBadge = (status) => {
    const statusStyles = {
      Success: 'bg-appleGreen text-brown',
      Failed: 'bg-red-200 text-red-900',
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
          statusStyles[status] || 'bg-gray-200 text-gray-900'
        } transition-all duration-300`}
      >
        {status}
      </span>
    );
  };

  // Current data: premium if exists, else estimate
  const currentData = premiumData || estimatedPremium;
  const isEstimate = !premiumData;
  const showPaymentButton = premiumData && ['Pending', 'Overdue', 'Failed'].includes(premiumData.paymentStatus?.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl border border-appleGreen  my-6 w-full"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brown tracking-tight">
            Premium Payments
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            {isEstimate ? 'Estimate your potential premium.' : 'View and manage your premium payment details.'}
          </p>
        </div>
        {showPaymentButton && (
          <button
            onClick={() => setPaymentModal({ open: true })}
            className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown rounded-lg font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm"
          >
            <FaMoneyBillWave className="mr-1 text-sm" />
            Pay Premium
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block h-8 w-8 border-4 border-appleGreen border-t-transparent rounded-full"
          ></motion.div>
          <p className="text-brown mt-3 text-sm font-medium">Loading payment details...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 text-red-900 p-4 rounded-lg mb-4 flex items-center text-sm"
        >
          <FiAlertCircle className="mr-2 text-lg" />
          {error}
        </motion.div>
      )}

      {/* No Data State (shouldn't happen with estimate fallback) */}
      {!loading && !error && !currentData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <AiFillCalculator className="mx-auto text-4xl text-brown mb-3" />
          <p className="text-brown text-sm font-medium">
            No payment data available. Contact support.
          </p>
        </motion.div>
      )}

      {/* Main Content */}
      {!loading && !error && currentData && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amount Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <FiDollarSign className="mr-1" /> {isEstimate ? 'Estimated Premium' : 'Current Premium'}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-brown mt-1">
                    KSh {currentData.estimatedAmount || currentData.premiumDetails?.finalAmount?.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {isEstimate ? `${currentData.estimatedPercentage}% of earnings` : `${currentData.premiumDetails?.finalPercentage?.toFixed(2)}% of earnings`}
                  </p>
                </div>
                <FiDollarSign className="text-3xl text-yellowGreen opacity-80" />
              </div>
            </motion.div>

            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <FiClock className="mr-1" /> {isEstimate ? 'Status' : 'Payment Status'}
                  </p>
                  <div className="mt-1">
                    {isEstimate ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-200 text-blue-900">
                        Estimate
                      </span>
                    ) : (
                      getPaymentStatusBadge(premiumData?.paymentStatus?.status || 'Pending')
                    )}
                  </div>
                  {!isEstimate && (
                    <p className="text-xs text-gray-600 mt-1">
                      Due: {moment(premiumData?.paymentStatus?.dueDate).format('MMM D, YYYY')}
                    </p>
                  )}
                </div>
                <FiClock className="text-3xl text-yellowGreen opacity-80" />
              </div>
            </motion.div>

            {/* Last Payment / Next Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <FiCreditCard className="mr-1" /> {isEstimate ? 'Next Step' : 'Last Payment'}
                  </p>
                  <p className="text-sm md:text-base font-semibold text-brown mt-1">
                    {isEstimate
                      ? 'Apply for Insurance'
                      : premiumData?.paymentStatus?.paymentDate
                      ? moment(premiumData.paymentStatus.paymentDate).format('MMM D, YYYY')
                      : 'Not Paid'}
                  </p>
                  {isEstimate ? (
                    <p className="text-xs text-gray-600 mt-1">Based on current earnings</p>
                  ) : premiumData?.paymentStatus?.paymentDate ? (
                    <p className="text-xs text-gray-600 mt-1">
                      Via {premiumData?.paymentStatus?.paymentMethod?.type}
                    </p>
                  ) : null}
                </div>
                <FiCreditCard className="text-3xl text-yellowGreen opacity-80" />
              </div>
            </motion.div>
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
          >
            <h2 className="text-lg font-semibold text-brown mb-3 flex items-center">
              <FiCreditCard className="mr-1" /> {isEstimate ? 'Estimate Details' : 'Payment Details'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Billing Cycle</p>
                <p className="text-brown font-medium">{isEstimate ? 'Monthly' : premiumData?.billingCycle}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Currency</p>
                <p className="text-brown font-medium">{isEstimate ? 'KSh' : premiumData?.premiumDetails?.currency}</p>
              </div>
              {!isEstimate && (
                <>
                  <div>
                    <p className="text-xs text-gray-500">Next Calculation Date</p>
                    <p className="text-brown font-medium">
                      {moment(premiumData?.nextCalculationDate).format('MMM D, YYYY')}
                    </p>
                  </div>
                  {premiumData?.paymentStatus?.transactionId && (
                    <div>
                      <p className="text-xs text-gray-500">Transaction ID</p>
                      <p className="text-brown font-medium">{premiumData?.paymentStatus?.transactionId}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Payment Attempts History (only for actual premium) */}
          {premiumData?.paymentStatus?.attempts?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white rounded-lg overflow-hidden shadow-md p-4 border border-appleGreen"
            >
              <button
                onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                className="flex items-center justify-between w-full text-lg font-semibold text-brown mb-4"
              >
                <span className="flex items-center">
                  <RiFileHistoryFill className="mr-1" />
                  Payment Attempts History
                </span>
                {showPaymentHistory ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              <AnimatePresence>
                {showPaymentHistory && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    {/* Scrollable Table Container */}
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
                      <table className="w-full min-w-[600px] text-left table-auto text-sm">
                        <thead>
                          <tr className="text-xs text-gray-500 bg-gray-50 sticky top-0 z-10">
                            <th className="p-3 font-medium">
                              <FiClock className="inline mr-1" /> Date
                            </th>
                            <th className="p-3 font-medium">
                              <FiCreditCard className="inline mr-1" /> Status
                            </th>
                            <th className="p-3 font-medium">
                              <FiInfo className="inline mr-1" /> Details
                            </th>
                            <th className="p-3 font-medium">
                              <FiDollarSign className="inline mr-1" /> Amount (KSh)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {premiumData?.paymentStatus?.attempts.map((attempt, index) => (
                            <motion.tr
                              key={attempt._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.1 }}
                              className="border-t border-gray-100 hover:bg-appleGreen/10 transition-all duration-200"
                            >
                              <td className="p-3 text-brown">
                                {moment(attempt.date).format('MMM D, YYYY, h:mm A')}
                              </td>
                              <td className="p-3 text-brown">
                                {getAttemptStatusBadge(attempt.status)}
                              </td>
                              <td className="p-3 text-brown">
                                {attempt.status === 'Success'
                                  ? `Paid via ${premiumData?.paymentStatus?.paymentMethod?.type}`
                                  : attempt.errorMessage || 'No details available'}
                              </td>
                              <td className="p-3 text-brown">
                                {attempt.status === 'Success'
                                  ? premiumData?.premiumDetails?.finalAmount.toFixed(2)
                                  : 'N/A'}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-1">
                      Scroll left or right to view more
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* Payment Confirmation Modal (only for actual premium) */}
      <AnimatePresence>
        {paymentModal.open && premiumData && (
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
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-appleGreen"
            >
              <h4 className="text-lg font-bold text-brown mb-3">Confirm Payment</h4>
              <p className="text-brown mb-4 text-sm">
                Pay KSh {premiumData?.premiumDetails?.finalAmount.toFixed(2)} using M-Pesa? This action will process your premium payment.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setPaymentModal({ open: false })}
                  className="px-4 py-2 bg-gray-200 text-brown rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayPremium}
                  className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown transition-colors duration-300 text-sm"
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