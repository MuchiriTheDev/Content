import React from 'react';
import { useForm } from 'react-hook-form';
import { FaFileUpload, FaMoneyBill } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ClaimEvidenceUpload = ({ onNext, onBack, formData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: formData
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
      <div className="w-full max-w-3xl mb-6">
        <div className="flex gap-3 items-center">
          <Link to="#" className="py-2" onClick={onBack}>
            <MdArrowBack size={25} className="text-brown" />
          </Link>
          <h2 className="text-3xl font-extrabold text-brown">
            Evidence Upload
          </h2>
        </div>
        <p className="text-yellowGreen text-sm mt-2">
          Upload evidence to support your claim, such as screenshots or emails from the platform.
        </p>
      </div>

      {/* Form Container */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-appleGreen p-6 space-y-6"
      >
        {/* Evidence Files */}
        <div>
          <label htmlFor="evidenceFiles" className="block text-sm font-medium mb-1 text-brown">
            Upload Evidence (Screenshots, Emails, etc.)
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

        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1 text-brown">
            Additional Notes (Optional)
          </label>
          <motion.textarea
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full h-24 border-2 border-appleGreen rounded-lg text-brown bg-transparent outline-none p-3 resize-none"
            {...register("notes")}
            placeholder="Ex: The issue started after a platform update."
          />
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300"
        >
          Next
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default ClaimEvidenceUpload;