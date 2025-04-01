import React from 'react';
import { useForm } from 'react-hook-form';
import { FaGlobe, FaMoneyBill, FaUser, FaHistory, FaPiggyBank } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ContentAccountInformation = ({ onNext, onBack, formData }) => {
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
      className="w-full min-h-screen bg-gray-100 text-fadeBrown flex flex-col items-center justify-start py-8 px-4 md:px-8 overflow-auto"
    >
      {/* Header Section */}
      <div className="w-full mb-6">
        <div className="flex gap-3 items-center">
          <Link to="/" className="py-2" onClick={onBack}>
            <MdArrowBack size={25} className="text-brown" />
          </Link>
          <h2 className="text-3xl font-extrabold text-brown">
            Content Account Information
          </h2>
        </div>
        <p className="text-yellowGreen text-sm mt-2">
          Provide details about your content accounts and financials. This helps us assess your earnings and platforms to insure.
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
        {/* Platform Details Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Platform Details</h3>
          {/* Primary Platform */}
          <div>
            <label htmlFor="primaryPlatform" className="block text-sm font-medium mb-1 text-brown">
              Primary Platform to Insure
            </label>
            <motion.select
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-transparent outline-none"
              {...register("primaryPlatform", { required: "Primary platform is required" })}
            >
              <option value="">Select Platform</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="x">X</option>
            </motion.select>
            {errors.primaryPlatform && <p className="text-red-500 text-xs mt-1">{errors.primaryPlatform.message}</p>}
          </div>

          {/* Primary Platform Handle */}
          <div>
            <label htmlFor="primaryHandle" className="block text-sm font-medium mb-1 text-brown">
              Primary Platform Handle/URL
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaGlobe className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("primaryHandle", { required: "Handle/URL is required" })}
                placeholder="Ex: youtube.com/@yourchannel"
              />
            </motion.div>
            {errors.primaryHandle && <p className="text-red-500 text-xs mt-1">{errors.primaryHandle.message}</p>}
          </div>

          {/* Additional Platforms */}
          <div>
            <label htmlFor="additionalPlatforms" className="block text-sm font-medium mb-1 text-brown">
              Additional Platforms (Optional)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaGlobe className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("additionalPlatforms")}
                placeholder="Ex: tiktok.com/@user, instagram.com/@user"
              />
            </motion.div>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Earnings</h3>
          {/* Average Monthly Earnings */}
          <div>
            <label htmlFor="earnings" className="block text-sm font-medium mb-1 text-brown">
              Average Monthly Earnings (KES)
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
                {...register("earnings", { required: "Earnings are required", min: { value: 0, message: "Earnings cannot be negative" } })}
                placeholder="Ex: 50000"
              />
            </motion.div>
            {errors.earnings && <p className="text-red-500 text-xs mt-1">{errors.earnings.message}</p>}
          </div>

          {/* Income Sources */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Main Income Sources
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              {["Ads", "Sponsorships", "Affiliate Marketing", "Merchandise"].map((source) => (
                <label key={source} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("incomeSources", { required: "Select at least one income source" })}
                    value={source.toLowerCase()}
                    className="text-appleGreen"
                  />
                  <span className="text-brown">{source}</span>
                </label>
              ))}
            </motion.div>
            {errors.incomeSources && <p className="text-red-500 text-xs mt-1">{errors.incomeSources.message}</p>}
          </div>

          {/* Bank Statement Upload */}
          <div>
            <label htmlFor="bankStatement" className="block text-sm font-medium mb-1 text-brown">
              Upload Bank Statement (Last 3 Months)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-16 border-2 border-dashed border-appleGreen rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <FaMoneyBill className="text-appleGreen mr-2" />
              <input
                className="text-brown file:border-none file:bg-appleGreen file:text-white file:rounded file:px-4 file:py-2"
                type="file"
                accept=".pdf,.jpg,.png"
                {...register("bankStatement", { required: "Bank statement is required" })}
              />
            </motion.div>
            {errors.bankStatement && <p className="text-red-500 text-xs mt-1">{errors.bankStatement.message}</p>}
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Bank Details</h3>
          {/* Bank Account Number */}
          <div>
            <label htmlFor="bankAccount" className="block text-sm font-medium mb-1 text-brown">
              Bank Account Number
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaPiggyBank className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("bankAccount", { required: "Bank account number is required" })}
                placeholder="Ex: 1234567890"
              />
            </motion.div>
            {errors.bankAccount && <p className="text-red-500 text-xs mt-1">{errors.bankAccount.message}</p>}
          </div>

          {/* Bank Name */}
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium mb-1 text-brown">
              Bank Name
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaPiggyBank className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("bankName", { required: "Bank name is required" })}
                placeholder="Ex: KCB Bank"
              />
            </motion.div>
            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>}
          </div>

          {/* Bank Branch */}
          <div>
            <label htmlFor="bankBranch" className="block text-sm font-medium mb-1 text-brown">
              Bank Branch
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaPiggyBank className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("bankBranch", { required: "Bank branch is required" })}
                placeholder="Ex: Nairobi Branch"
              />
            </motion.div>
            {errors.bankBranch && <p className="text-red-500 text-xs mt-1">{errors.bankBranch.message}</p>}
          </div>
        </div>

        {/* Risk History Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Risk History</h3>
          {/* Penalty History */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              History of Platform Penalties?
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("penaltyHistory", { required: "Please select an option" })}
                  value="yes"
                  className="text-appleGreen"
                />
                <span className="text-brown">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("penaltyHistory", { required: "Please select an option" })}
                  value="no"
                  className="text-appleGreen"
                />
                <span className="text-brown">No</span>
              </label>
            </motion.div>
            {errors.penaltyHistory && <p className="text-red-500 text-xs mt-1">{errors.penaltyHistory.message}</p>}
          </div>

          {/* Penalty Details (Conditional) */}
          <div>
            <label htmlFor="penaltyDetails" className="block text-sm font-medium mb-1 text-brown">
              Penalty Details (If Yes)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-fit border-2 border-appleGreen rounded-lg flex gap-3 p-3"
            >
              <FaHistory size={28} className="w-fit p-2 h-full text-appleGreen" />
              <textarea
                rows="5"
                className="border-none p-2 placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("penaltyDetails")}
                placeholder={`1: Suspended on YouTube, Jan 2023, copyright issue.\n2: Shadowbanned on TikTok, Feb 2023, spammy content.\n3: Account disabled on Instagram, Mar 2023, policy violation.\n`}
              />
            </motion.div>
          </div>

          {/* Years Active */}
          <div>
            <label htmlFor="yearsActive" className="block text-sm font-medium mb-1 text-brown">
              Years Active on Primary Platform
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaUser className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="number"
                {...register("yearsActive", { required: "Years active is required", min: { value: 0, message: "Cannot be negative" } })}
                placeholder="Ex: 3"
              />
            </motion.div>
            {errors.yearsActive && <p className="text-red-500 text-xs mt-1">{errors.yearsActive.message}</p>}
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

export default ContentAccountInformation;