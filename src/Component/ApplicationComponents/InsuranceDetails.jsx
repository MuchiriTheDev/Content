import React from 'react';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
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
          Understand your coverage, select a period, and agree to the terms to finalize your insurance application.
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=" p-0 md:p-6  duration-300"
      >
        <div className="space-y-6">
          {/* Coverage Section */}
          <div className="space-y-4">
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaShieldAlt className="text-appleGreen" size={20} /> What We Cover
            </h4>
            <p className="text-gray-700 text-sm md:text-base">
              Content Creators Insurance (CCI) safeguards your income from unexpected platform disruptions, ensuring financial stability.
            </p>
            <ul className="list-disc pl-6 text-gray-700 text-sm md:text-base space-y-2">
              <li><strong>Demonetization</strong>: Protection against income loss due to algorithm changes or policy updates.</li>
              <li><strong>Temporary Suspensions</strong>: Coverage for suspensions caused by unclear or ambiguous violations.</li>
              <li><strong>Non-Excluded Bans</strong>: Support for account bans not related to content violations (see exclusions).</li>
              <li><strong>Copyright Disputes</strong>: Compensation for ad revenue drops from disputes, provided you’re not at fault.</li>
            </ul>
            <p className="text-gray-700 text-sm md:text-base">
              Approved claims are paid out within <span className="font-bold text-appleGreen">72 hours</span>, based on your verified earnings.
            </p>
          </div>

          {/* Exclusions Section */}
          <div className="space-y-4">
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaTimesCircle className="text-red-500" size={20} /> What We Don’t Cover
            </h4>
            <p className="text-gray-700 text-sm md:text-base">
              We do not cover income loss resulting from violations of platform guidelines or inappropriate content.
            </p>
            <ul className="list-disc pl-6 text-gray-700 text-sm md:text-base space-y-2">
              <li><strong>Hate Speech</strong>: Content promoting hate or abusive language.</li>
              <li><strong>Harassment or Violence</strong>: Actions violating community standards, including explicit content.</li>
              <li><strong>Intentional Violations</strong>: Deliberate breaches like nudity or threats.</li>
            </ul>
          </div>

          {/* How It Works Section */}
          <div className="space-y-4">
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaCheckCircle className="text-yellowGreen" size={20} /> How It Works
            </h4>
            <p className="text-gray-700 text-sm md:text-base">
              Our streamlined process ensures quick and fair claim resolution:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 text-sm md:text-base space-y-2">
              <li><strong>Submit a Claim</strong>: Provide evidence (e.g., screenshots, emails) of the disruption.</li>
              <li><strong>Review Process</strong>: Our AI and team evaluate your claim within 72 hours.</li>
              <li><strong>Payout</strong>: Receive a lump-sum payment based on your selected coverage period upon approval.</li>
            </ol>
            <p className="text-gray-700 text-sm md:text-base">
              Premiums are customized based on your earnings, content type, audience size, and risk history for affordability.
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
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              >
                <option value="">Select Coverage Period</option>
                <option value="6 months">6 Months</option>
                <option value="12 months">12 Months</option>
                <option value="24 months">24 Months</option>
              </select>
              {errors.coveragePeriod && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.coveragePeriod.message}
                </p>
              )}
            </div>

            {/* Data Accuracy Agreement */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-brown">
                <input
                  type="checkbox"
                  {...register('dataAccuracy', {
                    required: 'You must confirm the accuracy of your data',
                  })}
                  className="h-5 w-5 text-appleGreen border-appleGreen rounded focus:ring-yellowGreen"
                />
                I confirm that all provided information is accurate and complete
                <span className="text-red-500">*</span>
              </label>
              {errors.dataAccuracy && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.dataAccuracy.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions Agreement */}
            <div className="md:col-span-2">
              <label className="flex w-full items-center gap-2 text-sm font-medium text-brown">
                <input
                  type="checkbox"
                  {...register('termsAgreement', {
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
              {errors.termsAgreement && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.termsAgreement.message}
                </p>
              )}
            </div>

            {/* Additional Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-brown">
                Additional Notes (Optional)
              </label>
              <textarea
                {...register('additionalNotes')}
                className="w-full h-24 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., Any special requests or additional information"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InsuranceDetails;