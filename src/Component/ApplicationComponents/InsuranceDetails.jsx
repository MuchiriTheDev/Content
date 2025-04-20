import React from 'react';
import { useForm } from 'react-hook-form';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

const InsuranceDetails = ({ onSubmit, onBack, formData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: formData // Pre-fill with data from previous steps if available
  });

  const handleFormSubmit = (data) => {
    onSubmit({ ...formData, ...data }); // Combine with previous data and submit
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-brown flex flex-col items-center justify-start py-10 px-4 md:px-10 overflow-auto"
    >
      {/* Header Section */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex gap-4 items-center">
          <Link to="/" className="py-2" onClick={onBack}>
            <MdArrowBack size={28} className="text-brown hover:text-appleGreen transition-colors" />
          </Link>
          <h2 className="text-3xl font-bold text-brown">
            Insurance Details & Agreement
          </h2>
        </div>
        <p className="text-lg text-yellowGreen mt-3">
          Review what we cover, how it works, and agree to the terms to finalize your application.
        </p>
      </div>

      {/* Content Container */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-appleGreen p-8 space-y-8"
      >
        {/* Coverage Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-brown flex items-center gap-2">
            <FaShieldAlt className="text-appleGreen" /> What We Cover
          </h3>
          <p className="text-gray-700">
            Content Creators Insurance (CCI) protects your income from platform-induced disruptions, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Demonetization due to algorithm changes or policy updates.</li>
            <li>Temporary suspensions for unclear violations.</li>
            <li>Bans not related to content exclusions (see below).</li>
            <li>Ad revenue drops from copyright disputes (if not your fault).</li>
          </ul>
          <p className="text-gray-700">
            Payouts are delivered within <span className="font-bold text-appleGreen">72 hours</span> of claim approval, based on your verified earnings.
          </p>
        </div>

        {/* Exclusions Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-brown flex items-center gap-2">
            <FaTimesCircle className="text-red-500" /> What We Don’t Cover
          </h3>
          <p className="text-gray-700">
            We do not cover income loss from bans or penalties due to unsuitable content, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Hate speech or abusive language.</li>
            <li>Harassment, violence, or explicit content violations.</li>
            <li>Intentional breaches of platform guidelines (e.g., nudity, threats).</li>
          </ul>
        </div>

        {/* How It Works Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-brown flex items-center gap-2">
            <FaCheckCircle className="text-yellowGreen" /> How It Works
          </h3>
          <p className="text-gray-700">
            Here’s the process:
          </p>
          <ol className="list-decimal pl-6 text-gray-700 space-y-2">
            <li>Submit a claim with evidence (e.g., screenshots, emails) of the incident.</li>
            <li>Our AI and team review it within 72 hours.</li>
            <li>If approved, receive a lump-sum payout based on your chosen coverage amount.</li>
          </ol>
          <p className="text-gray-700">
            Premiums are tailored to your earnings, content type, audience size, and risk history for fairness and affordability.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Coverage Period */}
          <div>
            <label htmlFor="coveragePeriod" className="block text-sm font-medium mb-2 text-brown">
              Desired Coverage Period
            </label>
            <motion.select
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-transparent outline-none focus:ring-2 focus:ring-yellowGreen"
              {...register("coveragePeriod", { required: "Please select a coverage period" })}
            >
              <option value="">Select Coverage Period</option>
              <option value="1">1 Month of Earnings</option>
              <option value="3">3 Months of Earnings</option>
              <option value="6">6 Months of Earnings</option>
            </motion.select>
            {errors.coveragePeriod && <p className="text-red-500 text-xs mt-1">{errors.coveragePeriod.message}</p>}
          </div>

          {/* Data Accuracy Confirmation */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("dataAccuracy", { required: "You must confirm data accuracy" })}
              className="mt-1 text-appleGreen focus:ring-yellowGreen"
            />
            <label className="text-sm text-gray-700">
              I confirm that all provided information is accurate and complete.
            </label>
          </div>
          {errors.dataAccuracy && <p className="text-red-500 text-xs">{errors.dataAccuracy.message}</p>}

          {/* Terms Agreement */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("termsAgreement", { required: "You must agree to the terms" })}
              className="mt-1 text-appleGreen focus:ring-yellowGreen"
            />
            <label className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-yellowGreen hover:text-appleGreen underline">
                Terms and Conditions
              </a>{' '}
              of Content Creators Insurance.
            </label>
          </div>
          {errors.termsAgreement && <p className="text-red-500 text-xs">{errors.termsAgreement.message}</p>}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300"
          >
            Submit Application
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};


export default InsuranceDetails;