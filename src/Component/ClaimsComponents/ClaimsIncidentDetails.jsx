import React from 'react';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ClaimIncidentDetails = ({ register, errors, getValues, setValue, control, insuredPlatforms }) => {
  // Incident types from backend schema
  const incidentTypes = ['Ban', 'Suspension', 'Demonetization', 'CopyrightDispute'];

  // Currency options (can be expanded based on backend support)
  const currencyOptions = ['KES', 'USD', 'EUR'];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
      role="form"
      aria-label="Incident Details Form"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-brown">Incident Details</h3>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
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
        {insuredPlatforms.length === 0 ? (
          <div className="p-4 bg-gray-100 text-gray-600 text-center rounded-lg">
            <p>No insured platforms registered. Please add platforms in your profile.</p>
            <a
              href="/profile"
              className="text-yellowGreen hover:underline font-semibold"
              aria-label="Go to profile to add platforms"
            >
              Go to Profile
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Affected Platform <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Select the platform where the incident occurred.
              </p>
              <select
                {...register('incidentDetails.platform', {
                  required: 'Please select a platform',
                  validate: value =>
                    insuredPlatforms.some(p => p.name === value) || 'Selected platform is not insured',
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                aria-label="Select affected platform"
              >
                <option value="">Select Platform</option>
                {insuredPlatforms.map(platform => (
                  <option key={platform.name} value={platform.name}>
                    {platform.name} ({platform.username})
                  </option>
                ))}
              </select>
              {errors.incidentDetails?.platform && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle aria-hidden="true" />
                  {errors.incidentDetails.platform.message}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                <FaInfoCircle className="text-gray-400" aria-hidden="true" />
                Only insured platforms are eligible for claims.
              </p>
            </div>

            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Incident Type <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Specify the type of incident.
              </p>
              <select
                {...register('incidentDetails.incidentType', {
                  required: 'Please select an incident type',
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                aria-label="Select incident type"
              >
                <option value="">Select Incident Type</option>
                {incidentTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.incidentDetails?.incidentType && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle aria-hidden="true" />
                  {errors.incidentDetails.incidentType.message}
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
                  validate: value =>
                    new Date(value) <= new Date() || 'Date cannot be in the future',
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                aria-label="Incident date"
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.incidentDetails?.incidentDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle aria-hidden="true" />
                  {errors.incidentDetails.incidentDate.message}
                </p>
              )}
            </div>

            {/* Reported Earnings Loss */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Reported Earnings Loss <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Estimate the financial loss due to the incident.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('incidentDetails.reportedEarningsLoss', {
                    required: 'Please enter the estimated earnings loss',
                    min: { value: 0.01, message: 'Earnings loss must be greater than 0' },
                    validate: value => !isNaN(value) || 'Please enter a valid number',
                  })}
                  className="w-2/3 h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                  placeholder="e.g., 5000"
                  aria-label="Reported earnings loss"
                />
                <select
                  {...register('incidentDetails.currency', {
                    required: 'Please select a currency',
                  })}
                  className="w-1/3 h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                  aria-label="Select currency"
                >
                  {currencyOptions.map(currency => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              {errors.incidentDetails?.reportedEarningsLoss && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle aria-hidden="true" />
                  {errors.incidentDetails.reportedEarningsLoss.message}
                </p>
              )}
              {errors.incidentDetails?.currency && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle aria-hidden="true" />
                  {errors.incidentDetails.currency.message}
                </p>
              )}
            </div>

            {/* Platform Notification */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-brown">
                Platform Notification <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Paste the text of the notification or message from the platform (50-1000 characters).
              </p>
              <textarea
                {...register('incidentDetails.platformNotification', {
                  required: 'Please provide the platform notification',
                  minLength: {
                    value: 50,
                    message: 'Notification must be at least 50 characters',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Notification cannot exceed 1000 characters',
                  },
                })}
                className="w-full h-24 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., Your account has been suspended for violating community guidelines..."
                aria-label="Platform notification"
              />
              {errors.incidentDetails?.platformNotification && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle aria-hidden="true" />
                  {errors.incidentDetails.platformNotification.message}
                </p>
              )}
            </div>

            {/* Incident Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-brown">
                Incident Description <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Describe the incident in detail to help us process your claim (50-1000 characters).
              </p>
              <textarea
                {...register('incidentDetails.incidentDescription', {
                  required: 'Please provide a description',
                  minLength: {
                    value: 50,
                    message: 'Description must be at least 50 characters',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Description cannot exceed 1000 characters',
                  },
                })}
                className="w-full h-32 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., My account was suspended due to a copyright claim on a video..."
                aria-label="Incident description"
              />
              {errors.incidentDetails?.incidentDescription && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle aria-hidden="true" />
                  {errors.incidentDetails.incidentDescription.message}
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