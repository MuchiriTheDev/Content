import React from 'react';
import { FaExclamationCircle, FaCheckCircle, FaShieldAlt, FaFileAlt, FaLink } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ClaimReviewAndSubmit = ({ register, errors, getValues, setValue, onBack, insuredPlatforms }) => {
  const formData = getValues();

  // Find the selected platform
  const selectedPlatform = insuredPlatforms.find(
    platform => platform.name === formData.incidentDetails.platform
  );

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
      role="form"
      aria-label="Claim Review and Submit Form"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-brown">Review & Submit Claim</h3>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Review your claim details, ensure all information is accurate, and agree to the terms to submit.
        </p>
      </div>

      {/* Review Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 md:p-6 bg-white rounded-lg shadow-md transition-all duration-300"
      >
        <div className="space-y-6">
          {/* Before You Submit Section */}
          <div className="space-y-4">
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaShieldAlt className="text-appleGreen" size={20} /> Before You Submit
            </h4>
            <p className="text-gray-700 text-sm md:text-base">
              Ensure your claim is complete and accurate to avoid delays in processing:
            </p>
            <ul className="list-disc pl-6 text-gray-700 text-sm md:text-base space-y-2">
              <li>
                <strong>Evidence Requirements</strong>: Include at least one Screenshot, Email, or Notification file to verify the incident.
              </li>
              <li>
                <strong>Accurate Details</strong>: Verify platform, incident date, and earnings loss estimates.
              </li>
              <li>
                <strong>Affected Content</strong>: Provide URLs and descriptions for content impacted by the incident.
              </li>
              <li>
                <strong>Evidence Summary</strong>: Summarize how your evidence supports the claim (50-1000 characters).
              </li>
            </ul>
            <p className="text-gray-700 text-sm md:text-base">
              Approved claims are reviewed and paid within{' '}
              <span className="font-bold text-appleGreen">72 hours</span>.
            </p>
          </div>

          {/* How Claims Are Processed Section */}
          <div className="space-y-4">
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaCheckCircle className="text-yellowGreen" size={20} /> How Claims Are Processed
            </h4>
            <p className="text-gray-700 text-sm md:text-base">
              Our process ensures quick and fair claim resolution:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 text-sm md:text-base space-y-2">
              <li>
                <strong>Submission</strong>: Your claim and evidence are submitted securely.
              </li>
              <li>
                <strong>Review</strong>: AI and our team evaluate the claim within 72 hours.
              </li>
              <li>
                <strong>Payout</strong>: Approved claims receive a lump-sum payment.
              </li>
            </ol>
          </div>

          {/* Incident Details */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaShieldAlt className="text-appleGreen" size={20} /> Incident Details
            </h4>
            <table className="w-full mt-2 text-sm text-gray-700">
              <tbody>
                <tr>
                  <td className="py-2 font-medium">Platform:</td>
                  <td>
                    {selectedPlatform
                      ? `${selectedPlatform.name} (${selectedPlatform.username})`
                      : formData.incidentDetails.platform || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Incident Type:</td>
                  <td>{formData.incidentDetails.incidentType || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Incident Date:</td>
                  <td>{formData.incidentDetails.incidentDate || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Reported Earnings Loss:</td>
                  <td>
                    {formData.incidentDetails.reportedEarningsLoss
                      ? `${formData.incidentDetails.reportedEarningsLoss} ${formData.incidentDetails.currency}`
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Platform Notification:</td>
                  <td>{formData.incidentDetails.platformNotification || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Description:</td>
                  <td>{formData.incidentDetails.incidentDescription || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Evidence */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaFileAlt className="text-yellowGreen" size={20} /> Evidence
            </h4>
            <table className="w-full mt-2 text-sm text-gray-700">
              <tbody>
                <tr>
                  <td className="py-2 font-medium">Evidence Files:</td>
                  <td>
                    {formData.evidence.files.length === 0 ? (
                      'None'
                    ) : (
                      <ul className="list-disc pl-4">
                        {formData.evidence.files.map((fileObj, index) => (
                          <li key={index}>
                            {fileObj.file instanceof File ? fileObj.file.name : 'No file uploaded'} (
                            {fileObj.type})
                            {fileObj.description && `: ${fileObj.description}`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Affected Content:</td>
                  <td>
                    {formData.evidence.affectedContent.length === 0 ? (
                      'None'
                    ) : (
                      <ul className="list-disc pl-4">
                        {formData.evidence.affectedContent.map((content, index) => (
                          <li key={index}>
                            <a
                              href={content.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellowGreen hover:underline"
                            >
                              {content.url}
                            </a>{' '}
                            ({content.mediaType}): {content.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Evidence Summary:</td>
                  <td>{formData.evidence.evidenceSummary || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Additional Notes:</td>
                  <td>{formData.evidence.additionalNotes || 'Not provided'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex w-full items-center gap-2 text-sm font-medium text-brown">
              <input
                type="checkbox"
                {...register('termsAgreed', {
                  required: 'You must agree to the terms and conditions',
                })}
                className="h-5 w-5 text-appleGreen border-appleGreen rounded focus:ring-yellowGreen"
                aria-label="Agree to terms and conditions"
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
                <FaExclamationCircle aria-hidden="true" /> {errors.termsAgreed.message}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              By submitting, you confirm all provided information is accurate and complete.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimReviewAndSubmit;