import React from 'react';
import { useForm } from 'react-hook-form';
import { FaCalendarAlt, FaExclamationCircle, FaGlobe, FaClock, FaFileAlt, FaUser, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ClaimIncidentDetails = ({ onNext }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

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
          <Link to="/dashboard" className="py-2">
            <MdArrowBack size={25} className="text-brown" />
          </Link>
          <h2 className="text-2xl font-extrabold text-brown">
            Incident Details
          </h2>
        </div>
        <p className="text-yellowGreen text-sm mt-2">
          Provide detailed information about the incident that affected your income. The more details you share, the faster we can process your claim.
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
        {/* Incident Basics Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Incident Basics</h3>
          {/* Incident Date */}
          <div>
            <label htmlFor="incidentDate" className="block text-sm font-medium mb-1 text-brown">
              Date of Incident
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaCalendarAlt className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="date"
                {...register("incidentDate", { required: "Incident date is required" })}
              />
            </motion.div>
            {errors.incidentDate && <p className="text-red-500 text-xs mt-1">{errors.incidentDate.message}</p>}
          </div>

          {/* Affected Platform */}
          <div>
            <label htmlFor="platform" className="block text-sm font-medium mb-1 text-brown">
              Affected Platform
            </label>
            <motion.select
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-transparent outline-none"
              {...register("platform", { required: "Platform is required" })}
            >
              <option value="">Select Platform</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="x">X</option>
              <option value="other">Other</option>
            </motion.select>
            {errors.platform && <p className="text-red-500 text-xs mt-1">{errors.platform.message}</p>}
          </div>

          {/* Other Platform */}
          <div>
            <label htmlFor="otherPlatform" className="block text-sm font-medium mb-1 text-brown">
              If Other, Specify Platform
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
                {...register("otherPlatform")}
                placeholder="Ex: Twitch"
              />
            </motion.div>
          </div>
        </div>

        {/* Incident Impact Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Incident Impact</h3>
          {/* Incident Type */}
          <div>
            <label htmlFor="incidentType" className="block text-sm font-medium mb-1 text-brown">
              Type of Incident
            </label>
            <motion.select
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-transparent outline-none"
              {...register("incidentType", { required: "Incident type is required" })}
            >
              <option value="">Select Incident Type</option>
              <option value="demonetization">Demonetization</option>
              <option value="suspension">Temporary Suspension</option>
              <option value="ban">Permanent Ban</option>
              <option value="adDrop">Ad Revenue Drop</option>
              <option value="contentRemoval">Content Removal</option>
              <option value="other">Other</option>
            </motion.select>
            {errors.incidentType && <p className="text-red-500 text-xs mt-1">{errors.incidentType.message}</p>}
          </div>

          {/* Other Incident Type */}
          <div>
            <label htmlFor="otherIncidentType" className="block text-sm font-medium mb-1 text-brown">
              If Other, Specify Incident Type
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaExclamationCircle className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("otherIncidentType")}
                placeholder="Ex: Account Hack"
              />
            </motion.div>
          </div>

          {/* Incident Duration */}
          <div>
            <label htmlFor="incidentDuration" className="block text-sm font-medium mb-1 text-brown">
              Duration of Incident (Days)
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
                {...register("incidentDuration", { required: "Duration is required", min: { value: 1, message: "Must be at least 1 day" } })}
                placeholder="Ex: 7"
              />
            </motion.div>
            {errors.incidentDuration && <p className="text-red-500 text-xs mt-1">{errors.incidentDuration.message}</p>}
          </div>

          {/* Affected Audience Size */}
          <div>
            <label htmlFor="audienceSize" className="block text-sm font-medium mb-1 text-brown">
              Affected Audience Size (e.g., Subscribers/Followers)
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
                {...register("audienceSize", { required: "Audience size is required", min: { value: 0, message: "Cannot be negative" } })}
                placeholder="Ex: 50000"
              />
            </motion.div>
            {errors.audienceSize && <p className="text-red-500 text-xs mt-1">{errors.audienceSize.message}</p>}
          </div>
        </div>

        {/* Platform Interaction Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Platform Interaction</h3>
          {/* Prior Warnings */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Did You Receive Prior Warnings or Notifications?
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
                  {...register("priorWarnings", { required: "Please select an option" })}
                  value="yes"
                  className="text-appleGreen"
                />
                <span className="text-brown">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("priorWarnings", { required: "Please select an option" })}
                  value="no"
                  className="text-appleGreen"
                />
                <span className="text-brown">No</span>
              </label>
            </motion.div>
            {errors.priorWarnings && <p className="text-red-500 text-xs mt-1">{errors.priorWarnings.message}</p>}
          </div>

          {/* Warning Details */}
          <div>
            <label htmlFor="warningDetails" className="block text-sm font-medium mb-1 text-brown">
              If Yes, Describe Warnings or Notifications
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-16 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaBell className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("warningDetails")}
                placeholder="Ex: Copyright strike on 15/03/2025"
              />
            </motion.div>
          </div>

          {/* Platform Communication */}
          <div>
            <label htmlFor="platformCommunication" className="block text-sm font-medium mb-1 text-brown">
              Communication from Platform (e.g., Email Subject)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaBell className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("platformCommunication", { required: "Platform communication is required" })}
                placeholder="Ex: 'Your account has been demonetized' email on 01/04/2025"
              />
            </motion.div>
            {errors.platformCommunication && <p className="text-red-500 text-xs mt-1">{errors.platformCommunication.message}</p>}
          </div>
        </div>

        {/* Content Details Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2 w-fit">Content Details</h3>
          {/* Affected Content */}
          <div>
            <label htmlFor="affectedContent" className="block text-sm font-medium mb-1 text-brown">
              Affected Content (e.g., Video Title, Post ID)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaFileAlt className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("affectedContent", { required: "Affected content is required" })}
                placeholder="Ex: 'My Latest Vlog' or Post ID: 12345"
              />
            </motion.div>
            {errors.affectedContent && <p className="text-red-500 text-xs mt-1">{errors.affectedContent.message}</p>}
          </div>

          {/* Incident Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1 text-brown">
              Detailed Incident Description
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-24 border-2 border-appleGreen rounded-lg flex gap-3 p-3"
            >
              <FaFileAlt className="w-fit p-2 h-full text-appleGreen" />
              <textarea
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full resize-none"
                {...register("description", { required: "Description is required" })}
                placeholder="Ex: My YouTube channel was demonetized on 01/04/2025 due to an algorithm update affecting all my videos uploaded in March."
              />
            </motion.div>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
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

export default ClaimIncidentDetails;