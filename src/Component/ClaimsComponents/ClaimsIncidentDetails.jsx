import React, { useState, useEffect, useContext } from 'react';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../../Context/GeneralContext';
import { backendUrl } from '../../App';

const ClaimIncidentDetails = ({ register, errors, getValues, setValue, control }) => {
  const { setLoading } = useContext(GeneralContext);
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Static fallback platforms (for testing without API)
  const fallbackAccounts = [
    { name: 'YouTube', username: '@CreatorYT', accountLink: 'https://youtube.com/@CreatorYT' },
    { name: 'TikTok', username: '@CreatorTok', accountLink: 'https://tiktok.com/@CreatorTok' },
    { name: 'Instagram', username: '@CreatorInsta', accountLink: 'https://instagram.com/CreatorInsta' },
    { name: 'X', username: '@CreatorX', accountLink: 'https://x.com/CreatorX' },
    { name: 'Facebook', username: '@CreatorFB', accountLink: 'https://facebook.com/CreatorFB' },
    { name: 'Other', username: '@CreatorOther', accountLink: 'https://example.com/CreatorOther' },
  ];

  // Fetch user platforms from backend
  useEffect(() => {
    const fetchPlatforms = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue.');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        // TODO: Replace with actual API endpoint when available
        // const response = await axios.get(`${backendUrl}/user/platforms`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // if (response.data.success) {
        //   setAccounts(response.data.data);
        // } else {
        //   throw new Error(response.data.error || 'Failed to fetch platforms');
        // }

        // Use fallback accounts for now
        setAccounts(fallbackAccounts);
      } catch (error) {
        console.error('Fetch platforms error:', error.response?.data || error.message);
        setFetchError('Failed to load your accounts. Using default platforms.');
        setAccounts(fallbackAccounts);
        toast.error('Could not load your accounts. Please try again or add platforms in your profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlatforms();
  }, [setLoading, navigate]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-brown text-center">
          Incident Details
        </h3>
        <p className="text-gray-600 mt-2 text-sm md:text-base text-center">
          Provide details about the incident affecting your content or income.
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 md:p-6 bg-white rounded-lg shadow-md transition-all duration-300"
      >
        {fetchError && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <FaExclamationCircle />
            {fetchError} <a href="/profile" className="text-yellowGreen hover:underline">Add platforms</a>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="p-4 bg-gray-100 text-gray-600 text-center rounded-lg">
            <p>No accounts registered. Please add platforms in your profile.</p>
            <a
              href="/profile"
              className="text-yellowGreen hover:underline font-semibold"
            >
              Go to Profile
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Affected Account <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Select the account where the incident occurred.
              </p>
              <select
                {...register('incidentDetails.platform', {
                  required: 'Please select an account',
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account.accountLink} value={account.accountLink}>
                    {account.name} - {account.username}
                  </option>
                ))}
              </select>
              {errors.incidentDetails?.platform && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.incidentDetails.platform.message}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                <FaInfoCircle className="text-gray-400" />
                We’ll review the account’s policies to assess your claim.
              </p>
            </div>

            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Incident Type <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Specify the type of incident (e.g., ban, suspension).
              </p>
              <select
                {...register('incidentDetails.incidentType', {
                  required: 'Please select an incident type',
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              >
                <option value="">Select Incident Type</option>
                <option value="Ban">Ban</option>
                <option value="Suspension">Suspension</option>
                <option value="Demonetization">Demonetization</option>
                <option value="CopyrightDispute">Copyright Dispute</option>
              </select>
              {errors.incidentDetails?.incidentType && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.incidentDetails.incidentType.message}
                </p>
              )}
            </div>

            {/* Incident Date */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Incident Date <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                When did the incident occur?
              </p>
              <input
                type="date"
                {...register('incidentDetails.incidentDate', {
                  required: 'Please enter the incident date',
                  validate: (value) =>
                    new Date(value) <= new Date() || 'Date cannot be in the future',
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              />
              {errors.incidentDetails?.incidentDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.incidentDetails.incidentDate.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-brown">
                Description <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Describe the incident in detail to help us process your claim.
              </p>
              <textarea
                {...register('incidentDetails.description', {
                  required: 'Please provide a description',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Description cannot exceed 1000 characters',
                  },
                })}
                className="w-full h-24 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., My account was suspended due to a copyright claim."
              />
              {errors.incidentDetails?.description && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.incidentDetails.description.message}
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ClaimIncidentDetails;