import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaTimesCircle, FaLock, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import { backendUrl } from '../../App';
import Loading from '../../Resources/Loading';

const ApplicationProcess = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { setLoading: setGlobalLoading } = useContext(GeneralContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      nationalId: '',
      coveragePeriod: '',
      accurateInfo: false,
      termsAgreed: false,
    },
  });

  const accurateInfo = watch('accurateInfo');
  const termsAgreed = watch('termsAgreed');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue.');
        navigate('/login');
        return;
      }

      try {
        setGlobalLoading(true);
        const response = await axios.get(`${backendUrl}/insurance/my-insurance`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const { insuranceStatus, platformInfo, financialInfo, applicationProgress } = response.data.data;

          if (insuranceStatus?.status === 'Pending' || insuranceStatus?.status === 'Approved' || insuranceStatus?.status === 'Rejected') {
            toast.info('Existing application found. Redirecting.');
            navigate('/insurance/status');
            return;
          }

          if (applicationProgress?.step !== 'Onboarded') {
            toast.error('Complete onboarding first.');
            navigate('/onboard');
            return;
          }

          setUserData({
            channelTitle: platformInfo?.youtube?.channel?.title || 'N/A',
            subscriberCount: platformInfo?.youtube?.channel?.subscriberCount || 0,
            monthlyEarnings: financialInfo?.monthlyEarnings || 0,
            avgDailyRevenue: platformInfo?.youtube?.avgDailyRevenue90d || 0,
            contentType: platformInfo?.youtube?.contentType || 'Unknown',
          });
        }
      } catch (error) {
        console.error('Fetch error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          toast.error('Session expired. Log in again.');
          navigate('/login');
        } else {
          toast.error('Failed to fetch data. Try again.');
        }
      } finally {
        setGlobalLoading(false);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, setGlobalLoading]);

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitLoading(false);
      toast.error('Session expired. Log in again.');
      navigate('/login');
      return;
    }

    if (!data.nationalId || data.nationalId.trim().length !== 8 || !/^\d{8}$/.test(data.nationalId)) {
      toast.error('Valid 8-digit Kenyan ID required.');
      setSubmitLoading(false);
      return;
    }
    if (!data.coveragePeriod || ![6, 12, 24].includes(Number(data.coveragePeriod))) {
      toast.error('Select 6, 12, or 24 months.');
      setSubmitLoading(false);
      return;
    }
    if (!accurateInfo || !termsAgreed) {
      toast.error('Confirm accuracy & terms.');
      setSubmitLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/insurance/apply`,
        {
          nationalId: data.nationalId.trim(),
          coveragePeriod: Number(data.coveragePeriod),
          accurateInfo: true,
          termsAgreed: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Submitted! Check email. Redirecting.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Submit error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || 'Failed to submit.';
      toast.error(errorMsg);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (errorMsg.includes('ineligible') || errorMsg.includes('earnings')) {
        toast.error('Check eligibility (KSh 65K+/mo).');
        navigate('/onboard');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-2xl mx-auto mb-2" />
          <p className="text-brown text-xs">Unable to load channel data. Connect YouTube.</p>
          <button onClick={() => navigate('/onboard')} className="mt-2 px-3 py-1 bg-appleGreen text-white rounded text-xs">
            Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-white text-brown py-4 px-3 md:px-6"
    >
      {/* Header */}
      <section className="mb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-brown mb-1">Secure Your Income with CCI</h1>
          <p className="text-sm md:text-base text-yellowGreen mb-1">
            Safety net for Kenyan YouTubers.
          </p>
          <p className="text-xs md:text-sm text-gray-600">
            Premiums at 2-5% earnings (KSh 1K-5K/mo). AI-powered.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {/* Left: Snapshot & Form */}
        <div className="space-y-4">
          {/* Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-appleGreen p-3 md:p-4"
          >
            <h3 className="font-semibold text-brown mb-2 text-center text-xs">
              <FaShieldAlt className="text-appleGreen inline mr-1" />
              Channel Snapshot
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Channel:</span>
                <span className="font-medium">{userData.channelTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>Subs:</span>
                <span>{userData.subscriberCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Niche:</span>
                <span>{userData.contentType}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly:</span>
                <span className="font-medium text-appleGreen">KSh {userData.monthlyEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Avg:</span>
                <span>KSh {userData.avgDailyRevenue.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Eligible: Earnings greater than 65K/mo (YouTube API)
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-appleGreen p-3 md:p-4"
          >
            <h3 className="font-semibold text-brown mb-2 text-left text-sm">Finalize</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-brown mb-1">
                  National ID (8 digits) <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-1">For verification & M-Pesa</p>
                <input
                  {...register('nationalId', {
                    required: 'ID required',
                    pattern: { value: /^\d{8}$/, message: '8 digits only' },
                  })}
                  type="text"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-appleGreen"
                  placeholder="12345678"
                />
                {errors.nationalId && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle /> {errors.nationalId.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-brown mb-1">
                  Coverage <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-1">6, 12, or 24 months</p>
                <select
                  {...register('coveragePeriod', { required: 'Select coverage' })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-appleGreen"
                >
                  <option value="">Choose</option>
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                </select>
                {errors.coveragePeriod && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle /> {errors.coveragePeriod.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-2 text-xs">
                  <input {...register('accurateInfo', { required: 'Confirm accuracy' })} type="checkbox" className="mt-0.5 rounded" />
                  <span>Confirm data accurate (API/NDVS verified)</span>
                </label>
                <label className="flex items-start gap-2 text-xs">
                  <input {...register('termsAgreed', { required: 'Agree to terms' })} type="checkbox" className="mt-0.5 rounded" />
                  <span>Agree to <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-yellowGreen underline">Terms</a> (platform risks only)</span>
                </label>
                {(!accurateInfo || !termsAgreed) && <p className="text-red-500 text-xs flex items-center gap-1"><FaExclamationTriangle /> Confirm both</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitLoading || !accurateInfo || !termsAgreed}
                className="w-full py-2 px-3 bg-gradient-to-r from-yellowGreen to-appleGreen text-white rounded text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                {submitLoading ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="text-xs" />
                    Apply Now
                  </>
                )}
              </motion.button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-2">
              Premium: 2-5% earnings (KSh 1K-5K/mo). Review: 24-48h
            </p>
          </motion.div>
        </div>

        {/* Right: Quick Facts */}
        <div className="space-y-4">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 border border-red-200"
          >
            <h3 className="text-sm font-semibold text-red-700 mb-1 flex items-center gap-1">
              <FaExclamationTriangle className="text-red-500" />
              The Problem
            </h3>
            <p className="text-xs text-gray-700 mb-2">
              Suspended channel || Banned Channel || Demonitized Channel = no income.
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs text-center bg-white rounded p-1">
              <div className="border-r">
                <span className="font-bold text-red-600">KSh 100-200</span><br />
                <span className="text-gray-600">/1K views</span>
              </div>
              <div>
                <span className="font-bold text-red-600">+30%</span><br />
                <span className="text-gray-600">YoY growth</span>
              </div>
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-appleGreen to-yellowGreen rounded-lg p-3 text-white"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
              <FaCheckCircle className="text-yellow-200" />
              How It Works
            </h3>
            <p className="text-xs mb-2 opacity-90">
              Track earnings, AI risks, M-Pesa payout. Covers 70% disruptions.
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1">
                <FaLightbulb className="text-yellow-200" />
                <span>Connect → Track</span>
              </div>
              <div className="flex items-center gap-1">
                <FaShieldAlt className="text-yellow-200" />
                <span>Claim → Pay</span>
              </div>
              <div className="flex items-center gap-1">
                <FaLock className="text-yellow-200" />
                <span>AI tips</span>
              </div>
            </div>
            
          </motion.div>

          {/* Coverage */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h3 className="text-sm font-semibold text-brown text-center mb-1 text-xs">Coverage</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-appleGreen/10 p-2 rounded border border-appleGreen">
                <h4 className="font-semibold text-brown mb-1 flex items-center gap-1 text-xs">
                  <FaShieldAlt className="text-appleGreen" />
                  Covered
                </h4>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  <li>• Demonetization</li>
                  <li>• Temporary bans</li>
                  <li>• Glitches</li>
                  <li>• 70% daily, 7-10d</li>
                </ul>
              </div>
              <div className="bg-red-50 p-2 rounded border border-red-200">
                <h4 className="font-semibold text-brown mb-1 flex items-center gap-1 text-xs">
                  <FaTimesCircle className="text-red-500" />
                  Not Covered
                </h4>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  <li>• Copyright</li>
                  <li>• Hate/violence</li>
                  <li>• Intentional</li>
                  <li>• Permanent bans</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
              <h4 className="font-semibold text-brown mb-1 flex items-center gap-1 text-xs">
                <FaLightbulb className="text-yellow-600" />
                Claim Flow
              </h4>
              <ol className="list-decimal pl-3 text-xs text-gray-700 space-y-0.5">
                <li>Spot drop → File</li>
                <li>AI check</li>
                <li>Payout</li>
              </ol>
              <p className="text-xs text-gray-600 mt-1">AI fraud scan</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-4 text-right max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/dashboard')}
          className="text-yellowGreen text-xs underline hover:no-underline"
        >
          Dashboard
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ApplicationProcess;