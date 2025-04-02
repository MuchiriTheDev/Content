import React from 'react';
import { useForm } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ClaimReviewAndSubmit = ({ onSubmit, onBack, formData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: formData
  });

  const handleFormSubmit = (data) => {
    onSubmit(formData); // Submit all collected data
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-gray-100 text-brown flex flex-col items-center justify-start py-8 px-4 md:px-8 overflow-auto"
    >
      {/* Header Section */}
      <div className="w-full mb-6">
        <div className="flex gap-3 items-center">
          <Link to="#" className="py-2" onClick={onBack}>
            <MdArrowBack size={25} className="text-brown" />
          </Link>
          <h2 className="text-2xl font-extrabold text-brown">
            Review and Submit
          </h2>
        </div>
        <p className="text-yellowGreen text-sm mt-2">
          Review your claim details and submit for processing. We’ll review it within 72 hours.
        </p>
      </div>

      {/* Review Container */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-20 items-start bg-white backdrop-blur-md rounded-xl shadow-2xl border border-appleGreen p-6"
      >
        {/* Incident Basics Section */}
        <div className="space-y-4 w-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Incident Basics</h3>
          <p><strong>Date:</strong> {formData?.incidentDate || 'Not provided'}</p>
          <p><strong>Platform:</strong> {formData?.platform || 'Not provided'}</p>
          <p><strong>Other Platform:</strong> {formData?.otherPlatform || 'N/A'}</p>
        </div>

        {/* Incident Impact Section */}
        <div className="space-y-4 w-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Incident Impact</h3>
          <p><strong>Type:</strong> {formData?.incidentType || 'Not provided'}</p>
          <p><strong>Other Type:</strong> {formData?.otherIncidentType || 'N/A'}</p>
          <p><strong>Duration:</strong> {formData?.incidentDuration ? `${formData.incidentDuration} days` : 'Not provided'}</p>
          <p><strong>Audience Size:</strong> {formData?.audienceSize || 'Not provided'}</p>
        </div>

        {/* Platform Interaction Section */}
        <div className="space-y-4 w-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Platform Interaction</h3>
          <p><strong>Prior Warnings:</strong> {formData?.priorWarnings || 'Not provided'}</p>
          <p><strong>Warning Details:</strong> {formData?.warningDetails || 'N/A'}</p>
          <p><strong>Platform Communication:</strong> {formData?.platformCommunication || 'Not provided'}</p>
        </div>

        {/* Evidence & Financials Section */}
        <div className="space-y-4 w-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Evidence & Financials</h3>
          <p><strong>Primary Evidence Files:</strong> {formData?.evidenceFiles ? `${formData.evidenceFiles.length} file(s)` : 'No files'}</p>
          <p><strong>Analytics Files:</strong> {formData?.analyticsFiles ? `${formData.analyticsFiles.length} file(s)` : 'No files'}</p>
          <p><strong>Estimated Loss:</strong> KES {formData?.estimatedLoss || 'Not provided'}</p>
          <p><strong>Loss Breakdown:</strong> {formData?.lossBreakdown || 'Not provided'}</p>
          <p><strong>Pre-Incident Earnings:</strong> KES {formData?.preIncidentEarnings || 'Not provided'}</p>
          <p><strong>Time to Notice:</strong> {formData?.timeToNotice ? `${formData.timeToNotice} days` : 'Not provided'}</p>
          <p><strong>Evidence Description:</strong> {formData?.evidenceDescription || 'Not provided'}</p>
          <p><strong>Mitigation Attempts:</strong> {formData?.mitigationAttempts || 'None'}</p>
          <p><strong>Additional Notes:</strong> {formData?.notes || 'None'}</p>
          <p><strong>Affected Content:</strong> {formData?.affectedContent || 'Not provided'}</p>
          <p><strong>Detailed Description:</strong> {formData?.description || 'Not provided'}</p>
        </div>

        {/* Form for Confirmation */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 col-span-1 md:col-span-2">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("confirmation", { required: "You must confirm the details" })}
              className="mt-1 text-appleGreen focus:ring-yellowGreen"
            />
            <label className="text-sm text-gray-700">
              I confirm that the information provided is accurate and complete.
            </label>
          </div>
          {errors.confirmation && <p className="text-red-500 text-xs">{errors.confirmation.message}</p>}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-fit px-10 py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300 flex items-center justify-center gap-2 transform"
          >
            <FaCheckCircle /> Submit Claim
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ClaimReviewAndSubmit;