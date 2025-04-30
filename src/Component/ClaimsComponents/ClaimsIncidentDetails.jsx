import React from 'react';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ClaimIncidentDetails = ({ register, errors, getValues, setValue, control }) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Platform */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Platform <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Select the platform where the incident occurred.
            </p>
            <select
              {...register('incidentDetails.platform', {
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
            {errors.incidentDetails?.platform && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {errors.incidentDetails.platform.message}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" />
              We’ll review platform policies to assess your claim.
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
      </motion.div>
    </motion.div>
  );
};

export default ClaimIncidentDetails;