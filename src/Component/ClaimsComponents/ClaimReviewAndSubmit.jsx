import React from 'react';
import { FaExclamationCircle, FaCheckCircle, FaShieldAlt, FaFileAlt, FaLink, FaEdit, FaImage, FaVideo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ClaimReviewAndSubmit = ({ register, errors, getValues, setValue, onBack, insuredPlatforms, setCurrentStep }) => {
  const formData = getValues();
  const navigate = useNavigate();

  // Find the selected platform
  const selectedPlatform = insuredPlatforms.find(
    platform => platform.name === formData.incidentDetails.platform
  );

  // Placeholder for content preview (simplified; can integrate with APIs for real thumbnails)
  const getContentPreview = (content) => {
    const { url, mediaType } = content;
    // Mock logic for demonstration (replace with API integration for real previews)
    if (mediaType === 'Video' && url.includes('youtube.com')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/default.jpg`;
    } else if (mediaType === 'Post' && url.includes('instagram.com')) {
      return 'https://via.placeholder.com/100?text=Instagram+Post';
    }
    return null; // Fallback to icon
  };

  // Handle edit button clicks
  const handleEdit = (step) => {
    setCurrentStep(step);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6 px-4 sm:px-6 md:px-8"
      role="form"
      aria-label="Claim Review and Submit Form"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brown">Review & Submit Claim</h3>
        <p className="text-gray-600 mt-2 text-sm sm:text-base md:text-lg">
          Review your claim details, ensure accuracy, and agree to the terms to submit.
        </p>
      </div>

      {/* Review Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl border border-appleGreen/10 p-4 sm:p-6 md:p-8"
      >
        <div className="space-y-8">
          {/* Before You Submit Section */}
          <div className="bg-appleGreen/5 rounded-lg p-4 sm:p-6 border border-appleGreen/20">
            <h4 className="text-lg sm:text-xl font-semibold text-brown flex items-center gap-2">
              <FaShieldAlt className="text-appleGreen" size={20} /> Before You Submit
            </h4>
            <p className="text-gray-700 text-sm sm:text-base mt-2">
              Ensure your claim is complete to avoid delays in processing:
            </p>
            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base space-y-2 mt-3">
              <li>
                <strong>Evidence Requirements</strong>: Include at least one Screenshot, Email, or Notification file.
              </li>
              <li>
                <strong>Accurate Details</strong>: Verify platform, incident date, and earnings loss.
              </li>
              <li>
                <strong>Affected Content</strong>: Provide URLs and descriptions for impacted content.
              </li>
              <li>
                <strong>Evidence Summary</strong>: Summarize how evidence supports your claim (50-1000 characters).
              </li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base mt-3">
              Approved claims are processed and paid within{' '}
              <span className="font-bold text-appleGreen">72 hours</span>.
            </p>
          </div>

          {/* How Claims Are Processed Section */}
          <div className="bg-yellowGreen/5 rounded-lg p-4 sm:p-6 border border-yellowGreen/20">
            <h4 className="text-lg sm:text-xl font-semibold text-brown flex items-center gap-2">
              <FaCheckCircle className="text-yellowGreen" size={20} /> How Claims Are Processed
            </h4>
            <p className="text-gray-700 text-sm sm:text-base mt-2">
              Our process ensures quick and fair claim resolution:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 text-sm sm:text-base space-y-2 mt-3">
              <li>
                <strong>Submission</strong>: Your claim and evidence are submitted securely.
              </li>
              <li>
                <strong>Review</strong>: AI and our team evaluate within 72 hours.
              </li>
              <li>
                <strong>Payout</strong>: Approved claims receive a lump-sum payment.
              </li>
            </ol>
          </div>

          {/* Incident Details */}
          <div className="relative">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg sm:text-xl font-semibold text-brown flex items-center gap-2">
                <FaShieldAlt className="text-appleGreen" size={20} /> Incident Details
              </h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(1)}
                className="flex items-center gap-2 py-1 px-3 bg-gradient-to-r from-yellowGreen to-appleGreen text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Edit Incident Details"
              >
                <FaEdit size={14} /> Edit
              </motion.button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="font-medium">Platform:</span>
                <p>
                  {selectedPlatform
                    ? `${selectedPlatform.name} (${selectedPlatform.username})`
                    : formData.incidentDetails.platform || 'N/A'}
                </p>
              </div>
              <div>
                <span className="font-medium">Incident Type:</span>
                <p>{formData.incidentDetails.incidentType || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium">Incident Date:</span>
                <p>{formData.incidentDetails.incidentDate || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium">Reported Earnings Loss:</span>
                <p>
                  {formData.incidentDetails.reportedEarningsLoss
                    ? `${formData.incidentDetails.reportedEarningsLoss} ${formData.incidentDetails.currency}`
                    : 'N/A'}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium">Platform Notification:</span>
                <p className="truncate">{formData.incidentDetails.platformNotification || 'N/A'}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium">Description:</span>
                <p className="truncate">{formData.incidentDetails.incidentDescription || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="relative">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg sm:text-xl font-semibold text-brown flex items-center gap-2">
                <FaFileAlt className="text-yellowGreen" size={20} /> Evidence
              </h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(2)}
                className="flex items-center gap-2 py-1 px-3 bg-gradient-to-r from-yellowGreen to-appleGreen text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Edit Evidence"
              >
                <FaEdit size={14} /> Edit
              </motion.button>
            </div>
            <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
              {/* Evidence Files */}
              <div>
                <span className="font-medium text-sm sm:text-base text-gray-700">Evidence Files:</span>
                {formData.evidence.files.length === 0 ? (
                  <p className="text-gray-500 text-sm">None</p>
                ) : (
                  <ul className="list-disc pl-6 text-sm sm:text-base text-gray-700 space-y-2">
                    {formData.evidence.files.map((fileObj, index) => (
                      <li key={index}>
                        {fileObj.file instanceof File ? fileObj.file.name : 'No file uploaded'} (
                        {fileObj.type})
                        {fileObj.description && (
                          <span className="text-gray-600">: {fileObj.description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Affected Content */}
              <div>
                <span className="font-medium text-sm sm:text-base text-gray-700">Affected Content:</span>
                {formData.evidence.affectedContent.length === 0 ? (
                  <p className="text-gray-500 text-sm">None</p>
                ) : (
                  <div className="grid grid-cols-1  gap-4 mt-2">
                    {formData.evidence.affectedContent.map((content, index) => {
                      const previewUrl = getContentPreview(content);
                      return (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm border border-appleGreen/10"
                        >
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt={`Preview for ${content.mediaType} ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-md"
                              aria-hidden="true"
                            />
                          ) : (
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md">
                              {content.mediaType === 'Video' ? (
                                <FaVideo className="text-appleGreen text-2xl" />
                              ) : content.mediaType === 'Post' ? (
                                <FaImage className="text-yellowGreen text-2xl" />
                              ) : (
                                <FaLink className="text-gray-400 text-2xl" />
                              )}
                            </div>
                          )}
                          <div className="flex-1">
                            <a
                              href={content.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellowGreen hover:underline text-sm sm:text-base truncate block"
                              aria-label={`Affected content ${index + 1} URL`}
                            >
                              {content.url}
                            </a>
                            <p className="text-gray-700 text-sm">
                              <span className="font-medium">{content.mediaType}</span>: {content.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* Evidence Summary */}
              <div>
                <span className="font-medium text-sm sm:text-base text-gray-700">Evidence Summary:</span>
                <p className="text-gray-700 text-sm sm:text-base truncate">
                  {formData.evidence.evidenceSummary || 'N/A'}
                </p>
              </div>
              {/* Additional Notes */}
              <div>
                <span className="font-medium text-sm sm:text-base text-gray-700">Additional Notes:</span>
                <p className="text-gray-700 text-sm sm:text-base truncate">
                  {formData.evidence.additionalNotes || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-3 text-sm sm:text-base font-medium text-brown">
              <input
                type="checkbox"
                {...register('termsAgreed', {
                  required: 'You must agree to the terms and conditions',
                })}
                className="h-5 w-5 text-appleGreen border-appleGreen rounded focus:ring-2 focus:ring-yellowGreen"
                aria-label="Agree to terms and conditions"
              />
              <span>
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
              </span>
            </label>
            {errors.termsAgreed && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <FaExclamationCircle aria-hidden="true" /> {errors.termsAgreed.message}
              </p>
            )}
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              By submitting, you confirm all provided information is accurate and complete.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimReviewAndSubmit;