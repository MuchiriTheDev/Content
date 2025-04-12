import React from 'react';
import { useForm } from 'react-hook-form';
import { FaFileUpload, FaMoneyBill, FaChartLine, FaClock, FaComment, FaPaperclip } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ClaimEvidenceUpload = ({ onNext, onBack, formData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: formData // Pre-fill with data from previous step if available
  });

  const onSubmit = (data) => {
    onNext(data); // Pass data to the next step
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
            Evidence Upload
          </h2>
        </div>
        <p className="text-yellowGreen text-sm mt-2">
          Upload comprehensive evidence and details to support your claim. This ensures a thorough review within 72 hours.
        </p>
      </div>

      {/* Form Container */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-20 items-center bg-white backdrop-blur-md rounded-xl shadow-2xl border border-appleGreen p-6"
      >
        {/* Evidence Uploads Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Evidence Uploads</h3>
          {/* Primary Evidence Files */}
          <div>
            <label htmlFor="evidenceFiles" className="block text-sm font-medium mb-1 text-brown">
              Upload Primary Evidence (Screenshots, Emails, etc.)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-20 border-2 border-dashed border-appleGreen rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <FaFileUpload className="text-appleGreen mr-2" />
              <input
                className="text-brown file:border-none file:bg-appleGreen file:text-white file:rounded file:px-4 file:py-2"
                type="file"
                multiple
                accept=".pdf,.jpg,.png"
                {...register("evidenceFiles", { required: "At least one file is required" })}
              />
            </motion.div>
            {errors.evidenceFiles && <p className="text-red-500 text-xs mt-1">{errors.evidenceFiles.message}</p>}
            <p className="text-xs text-gray-600 mt-2">Accepted formats: PDF, JPG, PNG. Multiple files allowed.</p>
          </div>

          {/* Analytics Evidence */}
          <div>
            <label htmlFor="analyticsFiles" className="block text-sm font-medium mb-1 text-brown">
              Upload Analytics Evidence (e.g., Revenue Reports)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-20 border-2 border-dashed border-appleGreen rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <FaChartLine className="text-appleGreen mr-2" />
              <input
                className="text-brown file:border-none file:bg-appleGreen file:text-white file:rounded file:px-4 file:py-2"
                type="file"
                multiple
                accept=".pdf,.csv,.jpg,.png"
                {...register("analyticsFiles")}
              />
            </motion.div>
            <p className="text-xs text-gray-600 mt-2">Optional: PDF, CSV, JPG, PNG.</p>
          </div>
        </div>

        {/* Financial Impact Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Financial Impact</h3>
          {/* Estimated Loss */}
          <div>
            <label htmlFor="estimatedLoss" className="block text-sm font-medium mb-1 text-brown">
              Estimated Income Loss (KES)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaMoneyBill className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="number"
                {...register("estimatedLoss", { required: "Estimated loss is required", min: { value: 0, message: "Cannot be negative" } })}
                placeholder="Ex: 10000"
              />
            </motion.div>
            {errors.estimatedLoss && <p className="text-red-500 text-xs mt-1">{errors.estimatedLoss.message}</p>}
          </div>

          {/* Loss Breakdown */}
          <div>
            <label htmlFor="lossBreakdown" className="block text-sm font-medium mb-1 text-brown">
              Breakdown of Loss (e.g., Ads, Sponsorships)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-16 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaMoneyBill className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("lossBreakdown", { required: "Breakdown is required" })}
                placeholder="Ex: Ads: 5000 KES, Sponsorships: 3000 KES"
              />
            </motion.div>
            {errors.lossBreakdown && <p className="text-red-500 text-xs mt-1">{errors.lossBreakdown.message}</p>}
          </div>

          {/* Pre-Incident Earnings */}
          <div>
            <label htmlFor="preIncidentEarnings" className="block text-sm font-medium mb-1 text-brown">
              Pre-Incident Monthly Earnings (KES)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaMoneyBill className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="number"
                {...register("preIncidentEarnings", { required: "Pre-incident earnings are required", min: { value: 0, message: "Cannot be negative" } })}
                placeholder="Ex: 20000"
              />
            </motion.div>
            {errors.preIncidentEarnings && <p className="text-red-500 text-xs mt-1">{errors.preIncidentEarnings.message}</p>}
          </div>
        </div>

        {/* Supporting Details Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Supporting Details</h3>
          {/* Time to Notice Impact */}
          <div>
            <label htmlFor="timeToNotice" className="block text-sm font-medium mb-1 text-brown">
              Time to Notice Impact (Days)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaClock className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="number"
                {...register("timeToNotice", { required: "Time to notice is required", min: { value: 0, message: "Cannot be negative" } })}
                placeholder="Ex: 3"
              />
            </motion.div>
            {errors.timeToNotice && <p className="text-red-500 text-xs mt-1">{errors.timeToNotice.message}</p>}
          </div>

          {/* Evidence Description */}
          <div>
            <label htmlFor="evidenceDescription" className="block text-sm font-medium mb-1 text-brown">
              Description of Uploaded Evidence
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-24 border-2 border-appleGreen rounded-lg flex gap-3 p-3"
            >
              <FaPaperclip className="w-fit p-2 h-full text-appleGreen" />
              <textarea
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full resize-none"
                {...register("evidenceDescription", { required: "Evidence description is required" })}
                placeholder="Ex: Screenshot of demonetization email, Analytics showing revenue drop."
              />
            </motion.div>
            {errors.evidenceDescription && <p className="text-red-500 text-xs mt-1">{errors.evidenceDescription.message}</p>}
          </div>
        </div>

        {/* Additional Context Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Additional Context</h3>
          {/* Mitigation Attempts */}
          <div>
            <label htmlFor="mitigationAttempts" className="block text-sm font-medium mb-1 text-brown">
              Attempts to Mitigate Loss
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-24 border-2 border-appleGreen rounded-lg flex gap-3 p-3"
            >
              <FaComment className="w-fit p-2 h-full text-appleGreen" />
              <textarea
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full resize-none"
                {...register("mitigationAttempts")}
                placeholder="Ex: Appealed the ban on 02/04/2025, contacted support."
              />
            </motion.div>
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1 text-brown">
              Additional Notes
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-24 border-2 border-appleGreen rounded-lg flex gap-3 p-3"
            >
              <FaComment className="w-fit p-2 h-full text-appleGreen" />
              <textarea
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full resize-none"
                {...register("notes")}
                placeholder="Ex: The issue started after a platform update on 31/03/2025."
              />
            </motion.div>
          </div>
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-fit px-10 py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300 transform"
        >
          Next
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default ClaimEvidenceUpload;