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
      <div className="w-full max-w-3xl mb-6">
        <div className="flex gap-3 items-center">
          <Link to="#" className="py-2" onClick={onBack}>
            <MdArrowBack size={25} className="text-brown" />
          </Link>
          <h2 className="text-3xl font-extrabold text-brown">
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
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-appleGreen p-6 space-y-6"
      >
        {/* Incident Summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Incident Summary</h3>
          <p><strong>Date:</strong> {formData?.incidentDate}</p>
          <p><strong>Platform:</strong> {formData?.platform}</p>
          <p><strong>Type:</strong> {formData?.incidentType}</p>
          <p><strong>Description:</strong> {formData?.description}</p>
        </div>

        {/* Evidence Summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Evidence</h3>
          <p><strong>Estimated Loss:</strong> KES {formData?.estimatedLoss}</p>
          <p><strong>Files:</strong> {formData?.evidenceFiles ? `${formData?.evidenceFiles.length} file(s) uploaded` : 'No files'}</p>
          <p><strong>Notes:</strong> {formData?.notes || 'None'}</p>
        </div>

        {/* Form for Confirmation */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Confirmation Checkbox */}
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
            className="w-full py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaCheckCircle /> Submit Claim
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ClaimReviewAndSubmit;