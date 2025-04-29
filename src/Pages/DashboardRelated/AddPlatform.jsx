// src/Pages/AddPlatform.jsx
import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import { backendUrl } from '../../App';
import Loading from '../../Resources/Loading';
import { FaArrowLeft, FaPlus, FaTrash, FaExclamationCircle, FaLock } from 'react-icons/fa';

const AddPlatform = () => {
  const { loading, setLoading } = useContext(GeneralContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues: {
      platform: {
        name: '',
        username: '',
        accountLink: '',
        audienceSize: 0,
        contentType: '',
        riskHistory: [],
      },
    },
  });

  // Field array for riskHistory
  const { fields: riskHistoryFields, append: appendRisk, remove: removeRisk } = useFieldArray({
    control,
    name: 'platform.riskHistory',
  });

  // Watch platform name for dynamic guidance
  const platformName = useWatch({ control, name: 'platform.name', defaultValue: '' });

  // Dynamic guidance for platform selection
  const platformGuidance = (name) => {
    const messages = {
      YouTube: 'We’ll analyze YouTube’s policies to tailor your coverage and protect against demonetization or bans.',
      TikTok: 'We’ll assess TikTok’s guidelines to ensure your coverage fits your content’s risk profile.',
      Instagram: 'We’ll review Instagram’s rules to provide coverage for suspensions or content restrictions.',
      X: 'We’ll evaluate X’s policies to protect your income from platform actions.',
      Facebook: 'We’ll check Facebook’s standards to customize your insurance for potential bans or demonetization.',
      Other: 'We’ll review your platform’s policies to provide tailored coverage.',
      '': 'Select a platform to see how we’ll protect your income.',
    };
    return messages[name] || messages[''];
  };

  // Check application status on mount
  useEffect(() => {
    const checkStatus = async () => {
    // setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue.');
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/insurance/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const { insuranceStatus } = response.data.data;
          if (insuranceStatus.status !== 'Pending') {
            toast.error('You can only add platforms to a pending application.');
            navigate('/dashboard');
          }
        }
      } catch (error) {
        toast.error('Failed to verify application status.');
        navigate('/dashboard');
      } finally {
        // setLoading(false);
      }
    };
    checkStatus();
  }, [navigate, setLoading]);

  const onSubmit = async (data) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/insurance/add-platform`,
        { platform: data.platform },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add platform.';
      toast.error(errorMessage);
      if (errorMessage.includes('Unauthorized')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-gray-100 text-brown flex flex-col items-center justify-start py-10 px-4 md:px-10"
    >
      {/* Header */}
      <div className="w-full max-w-4xl mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brown">Add a New Platform</h2>
        <p className="text-lg text-yellowGreen mt-3">
          Add a social media platform to your pending insurance application to ensure comprehensive coverage.
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-appleGreen p-6 md:p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Platform Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Platform <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                This helps us assess platform-specific risks for your coverage.
              </p>
              <select
                {...register('platform.name', {
                  required: 'Please select a platform',
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              >
                <option value="">Select Platform</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="X">X</option>
                <option value="Facebook">Facebook</option>
                <option value="Other">Other</option>
              </select>
              {errors.platform?.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.platform.name.message}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                <FaLock className="text-gray-400" /> {platformGuidance(platformName)}
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Username <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                This helps us verify your account for coverage and claims.
              </p>
              <input
                type="text"
                {...register('platform.username', {
                  required: 'Please enter your username',
                  minLength: {
                    value: 2,
                    message: 'Username must be at least 2 characters',
                  },
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., @yourusername"
              />
              {errors.platform?.username && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.platform.username.message}
                </p>
              )}
            </div>

            {/* Account Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-brown">
                Account Link <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                This lets us review your content to tailor your coverage.
              </p>
              <input
                type="url"
                {...register('platform.accountLink', {
                  required: 'Please enter your account link',
                  pattern: {
                    value: /^https?:\/\/.+$/,
                    message: 'Enter a valid profile URL, e.g., https://www.youtube.com/@yourusername',
                  },
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., https://www.tiktok.com/@yourusername"
              />
              {errors.platform?.accountLink && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.platform.accountLink.message}
                </p>
              )}
            </div>

            {/* Audience Size */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Audience Size
              </label>
              <p className="text-xs text-gray-500 mb-1">
                This helps us estimate your income and risk for a fair premium.
              </p>
              <input
                type="number"
                {...register('platform.audienceSize', {
                  min: {
                    value: 0,
                    message: 'Audience size cannot be negative',
                  },
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., 1000"
              />
              {errors.platform?.audienceSize && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.platform.audienceSize.message}
                </p>
              )}
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Content Type
              </label>
              <p className="text-xs text-gray-500 mb-1">
                This helps us assess risk and offer violation prevention tools.
              </p>
              <input
                type="text"
                {...register('platform.contentType')}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., Gaming, Lifestyle, Education"
              />
            </div>
          </div>

          {/* Risk History */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-brown">
                Past Incidents (Bans, Suspensions, Demonetizations)
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => appendRisk({ violationType: '', date: '', description: '' })}
                className="flex items-center gap-2 py-2 px-4 bg-appleGreen text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaPlus size={14} /> Incident
              </motion.button>
            </div>
            {riskHistoryFields.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No incidents added. Add any past bans, suspensions, or demonetizations.
              </p>
            ) : (
              riskHistoryFields.map((risk, riskIndex) => (
                <motion.div
                  key={risk.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 p-4 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-semibold text-brown">Incident {riskIndex + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removeRisk(riskIndex)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Violation Type */}
                    <div>
                      <label className="block text-sm font-medium mb-1 text-brown">
                        Incident Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register(`platform.riskHistory.${riskIndex}.violationType`, {
                          required: 'Please enter the incident type',
                        })}
                        className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                        placeholder="e.g., Ban, Suspension, Demonetization"
                      />
                      {errors.platform?.riskHistory?.[riskIndex]?.violationType && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <FaExclamationCircle />{' '}
                          {errors.platform.riskHistory[riskIndex].violationType.message}
                        </p>
                      )}
                    </div>
                    {/* Incident Date */}
                    <div>
                      <label className="block text-sm font-medium mb-1 text-brown">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register(`platform.riskHistory.${riskIndex}.date`, {
                          required: 'Please enter the incident date',
                          validate: (value) =>
                            new Date(value) <= new Date() || 'Date cannot be in the future',
                        })}
                        className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      />
                      {errors.platform?.riskHistory?.[riskIndex]?.date && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <FaExclamationCircle />{' '}
                          {errors.platform.riskHistory[riskIndex].date.message}
                        </p>
                      )}
                    </div>
                    {/* Incident Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-brown">
                        Description (Optional)
                      </label>
                      <textarea
                        {...register(`platform.riskHistory.${riskIndex}.description`, {
                          maxLength: {
                            value: 500,
                            message: 'Description cannot exceed 500 characters',
                          },
                        })}
                        className="w-full h-24 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                        placeholder="e.g., Temporary suspension due to community guideline violation"
                      />
                      {errors.platform?.riskHistory?.[riskIndex]?.description && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <FaExclamationCircle />{' '}
                          {errors.platform.riskHistory[riskIndex].description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg font-semibold text-brown shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaArrowLeft /> Back to Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaPlus /> Add Platform
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddPlatform;