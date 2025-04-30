import React from 'react';
import { FaExclamationCircle, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ClaimReviewAndSubmit = ({ register, errors, getValues, setValue, onBack }) => {
  const formData = getValues();

  // Static fallback accounts (replace with API fetch if needed)
  const accounts = [
    { name: 'YouTube', username: '@CreatorYT', accountLink: 'https://youtube.com/@CreatorYT' },
    { name: 'TikTok', username: '@CreatorTok', accountLink: 'https://tiktok.com/@CreatorTok' },
    { name: 'Instagram', username: '@CreatorInsta', accountLink: 'https://instagram.com/CreatorInsta' },
    { name: 'X', username: '@CreatorX', accountLink: 'https://x.com/CreatorX' },
    { name: 'Facebook', username: '@CreatorFB', accountLink: 'https://facebook.com/CreatorFB' },
    { name: 'Other', username: '@CreatorOther', accountLink: 'https://example.com/CreatorOther' },
  ];

  // Find the selected account
  const selectedAccount = accounts.find(
    (account) => account.accountLink === formData.incidentDetails.platform
  );

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
          Review & Submit Claim
        </h3>
        <p className="text-gray-600 mt-2 text-sm md:text-base text-center">
          Review your claim details and agree to the terms to submit.
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
          {/* Incident Details */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaShieldAlt className="text-appleGreen" size={20} /> Incident Details
            </h4>
            <table className="w-full mt-2 text-sm text-gray-700">
              <tbody>
                <tr>
                  <td className="py-2 font-medium">Account:</td>
                  <td>
                    {selectedAccount
                      ? `${selectedAccount.name} - ${selectedAccount.username}`
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
                  <td className="py-2 font-medium">Description:</td>
                  <td>{formData.incidentDetails.description || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Evidence */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-brown flex items-center gap-2">
              <FaCheckCircle className="text-yellowGreen" size={20} /> Evidence
            </h4>
            <table className="w-full mt-2 text-sm text-gray-700">
              <tbody>
                <tr>
                  <td className="py-2 font-medium">Account Screenshot:</td>
                  <td>
                    {formData.evidence.accountScreenshot instanceof File
                      ? formData.evidence.accountScreenshot.name
                      : 'Not uploaded'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Email Screenshot:</td>
                  <td>
                    {formData.evidence.emailScreenshot instanceof File
                      ? formData.evidence.emailScreenshot.name
                      : 'Not uploaded'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Email Message:</td>
                  <td>{formData.evidence.emailMessage || 'Not provided'}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Additional Files:</td>
                  <td>
                    {formData.evidence.additionalFiles.length === 0 ? (
                      'None'
                    ) : (
                      <ul className="list-disc pl-4">
                        {formData.evidence.additionalFiles.map((file, index) => (
                          <li key={index}>{file instanceof File ? file.name : `File ${index + 1}`}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Additional URLs:</td>
                  <td>
                    {formData.evidence.additionalUrls.length === 0 ? (
                      'None'
                    ) : (
                      <ul className="list-disc pl-4">
                        {formData.evidence.additionalUrls.map((url, index) => (
                          <li key={index}>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-yellowGreen hover:underline">
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
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
            <p className="text-gray-500 text-xs mt-1">
              By submitting, you confirm all provided information is accurate.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimReviewAndSubmit;