import React from 'react';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ClaimIncidentDetails = ({ register, errors, getValues, setValue, control }) => {
  // Updated incident types from backend schema (CCI dropdown)
  const incidentTypes = ['Full suspension', 'Limited ads', 'Video demonetization'];

  // Updated appeal statuses from backend schema
  const appealStatuses = ['Not started', 'In progress', 'Rejected'];

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
          Provide the required details about your YouTube incident. We'll auto-verify earnings loss via API.
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
          {/* Incident Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Incident Type <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Select the type of YouTube issue.
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
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" aria-hidden="true" />
              Covers platform risks like demonetization (yellow icon) or temp suspension.
            </p>
          </div>

          {/* Incident Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Incident Date <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">
              When did the issue start?
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
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" aria-hidden="true" />
              Used for revenue drop calculation (≥70% vs prior 7 days).
            </p>
          </div>

          {/* Appeal Status */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Appeal Status <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Status of your YouTube appeal.
            </p>
            <select
              {...register('incidentDetails.appealStatus', {
                required: 'Please select appeal status',
              })}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              aria-label="Select appeal status"
            >
              <option value="">Select Appeal Status</option>
              {appealStatuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.incidentDetails?.appealStatus && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle aria-hidden="true" />
                {errors.incidentDetails.appealStatus.message}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" aria-hidden="true" />
              Helps verify if eligible (e.g., rejected appeals flag risk).
            </p>
          </div>

          {/* YouTube Email (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              YouTube Notification Email (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Paste the email from YouTube (or upload as evidence).
            </p>
            <textarea
              {...register('incidentDetails.youTubeEmail')}
              className="w-full h-20 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              placeholder="e.g., Your channel has been demonetized due to policy update..."
              aria-label="YouTube notification email (optional)"
            />
            {errors.incidentDetails?.youTubeEmail && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle aria-hidden="true" />
                {errors.incidentDetails.youTubeEmail.message}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" aria-hidden="true" />
              Optional—API pulls handle most verification.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimIncidentDetails;