import React from 'react';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa'; // Removed FaArrowRight (unused)
import { motion } from 'framer-motion';

const InsuranceDetails = ({ register, errors, getValues, setValue, onBack }) => {
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
          Insurance Details & Agreement
        </h3>
        <p className="text-gray-600 mt-2 text-sm md:text-base text-center">
          Select your coverage period and agree to the terms to finalize your application.
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-0 md:p-6 duration-300"
      >
        <div className="space-y-6">
          {/* Coverage Section */}
          <div className="space-y-4">
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaShieldAlt className="text-appleGreen" size={20} /> What We Cover
            </h4>
            <p className="text-gray-700 text-sm md:text-base">
              Content Creators Insurance (CCI) safeguards your income from platform disruptions.
            </p>
            <ul className="list-disc pl-6 text-gray-700 text-sm md:text-base space-y-2">
              <li><strong>Demonetization</strong>: Income loss from algorithm or policy changes.</li>
              <li><strong>Temporary Suspensions</strong>: Coverage for unclear violation suspensions.</li>
              <li><strong>Non-Excluded Bans</strong>: Bans not related to content violations.</li>
              <li><strong>Copyright Disputes</strong>: Ad revenue loss if you’re not at fault.</li>
            </ul>
            <p className="text-gray-700 text-sm md:text-base">
              Approved claims are paid within <span className="font-bold text-appleGreen">72 hours</span>.
            </p>
          </div>

          {/* Exclusions Section */}
          <div className="space-y-4">
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaTimesCircle className="text-red-500" size={20} /> What We Don’t Cover
            </h4>
            <p className="text-gray-700 text-sm md:text-base">
              Income loss from guideline violations or inappropriate content is not covered.
            </p>
            <ul className="list-disc pl-6 text-gray-700 text-sm md:text-base space-y-2">
              <li><strong>Hate Speech</strong>: Content promoting hate or abuse.</li>
              <li><strong>Harassment or Violence</strong>: Violations of community standards.</li>
              <li><strong>Intentional Violations</strong>: Deliberate breaches like nudity.</li>
            </ul>
          </div>

          {/* How It Works Section */}
          <div className="space-y-4">
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaCheckCircle className="text-yellowGreen" size={20} /> How It Works
            </h4>
            <p className="text-gray-700 text-sm md:text-base">
              Our process ensures quick and fair claim resolution:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 text-sm md:text-base space-y-2">
              <li><strong>Submit a Claim</strong>: Provide evidence of the disruption.</li>
              <li><strong>Review Process</strong>: AI and team evaluate within 72 hours.</li>
              <li><strong>Payout</strong>: Lump-sum payment upon approval.</li>
            </ol>
            <p className="text-gray-700 text-sm md:text-base">
              Premiums are tailored to your earnings, content, and audience size.
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coverage Period */}
            <div>
              <label className="block text-sm font-medium mb-1 text-brown">
                Coverage Period <span className="text-red-500">*</span>
              </label>
              <select
                {...register('coveragePeriod', {
                  required: 'Coverage period is required',
                  validate: (value) => [6, 12, 24].includes(Number(value)) || 'Select 6, 12, or 24 months',
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              >
                <option value="">Select Coverage Period</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
              </select>
              {errors.coveragePeriod && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.coveragePeriod.message}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">Choose your policy duration (6, 12, or 24 months).</p> {/* NEW: Helper text */}
            </div>

            {/* Data Accuracy Agreement */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-brown">
                <input
                  type="checkbox"
                  {...register('accurateInfo', { // NEW: Renamed to accurateInfo
                    required: 'You must confirm the accuracy of your data',
                  })}
                  className="h-5 w-5 text-appleGreen border-appleGreen rounded focus:ring-yellowGreen"
                />
                I confirm that all provided information is accurate and complete
                <span className="text-red-500">*</span>
              </label>
              {errors.accurateInfo && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.accurateInfo.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions Agreement */}
            <div className="md:col-span-2">
              <label className="flex w-full items-center gap-2 text-sm font-medium text-brown">
                <input
                  type="checkbox"
                  {...register('termsAgreed', { // NEW: Renamed to termsAgreed
                    required: 'You must agree to the terms and conditions',
                  })}
                  className="h-5 w-5 text-appleGreen border-appleGreen rounded focus:ring-yellowGreen"
                />
                I agree to the{' '}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellowGreen hover:underline"
                >
                  Terms and Conditions
                </a>
                <span className="text-red-500">*</span>
              </label>
              {errors.termsAgreed && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.termsAgreed.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InsuranceDetails;