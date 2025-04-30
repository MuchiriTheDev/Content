import React, { useState } from 'react';
import { FaExclamationCircle, FaPlus, FaTrash, FaImage, FaVideo, FaFilePdf, FaLink, FaEnvelope, FaCamera } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useFieldArray, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

const ClaimEvidenceUpload = ({ register, errors, getValues, setValue, control }) => {
  const { fields: additionalFiles, append: appendFile, remove: removeFile } = useFieldArray({
    control,
    name: 'evidence.additionalFiles',
  });
  const { fields: additionalUrls, append: appendUrl, remove: removeUrl } = useFieldArray({
    control,
    name: 'evidence.additionalUrls',
  });
  const [previews, setPreviews] = useState({
    accountScreenshot: null,
    emailScreenshot: null,
    additionalFiles: [],
  });

  // Handle file upload for screenshots or additional files
  const handleFileChange = (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const validTypes = {
      accountScreenshot: ['image/jpeg', 'image/png'],
      emailScreenshot: ['image/jpeg', 'image/png', 'application/pdf'],
      additionalFiles: ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'],
    };

    if (!validTypes[type].includes(file.type)) {
      toast.error(
        type === 'accountScreenshot'
          ? 'Please upload a JPG or PNG image.'
          : type === 'emailScreenshot'
          ? 'Please upload a JPG, PNG, or PDF.'
          : 'Please upload a JPG, PNG, MP4, or PDF.'
      );
      return;
    }

    if (type === 'additionalFiles') {
      setValue(`evidence.additionalFiles.${index}`, file);
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        newPreviews.additionalFiles[index] = {
          url: previewUrl,
          type: file.type.startsWith('image/') ? 'image' : file.type === 'video/mp4' ? 'video' : 'pdf',
        };
        return newPreviews;
      });
    } else {
      setValue(`evidence.${type}`, file);
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({
        ...prev,
        [type]: {
          url: previewUrl,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
        },
      }));
    }

    toast.success(`${file.type.startsWith('image/') ? 'Image' : file.type === 'video/mp4' ? 'Video' : 'PDF'} uploaded successfully!`);
  };

  // Add new additional file
  const addAdditionalFile = () => {
    if (additionalFiles.length >= 7) {
      toast.error('You can upload up to 7 additional files.');
      return;
    }
    appendFile(null);
    setPreviews((prev) => ({
      ...prev,
      additionalFiles: [...prev.additionalFiles, null],
    }));
  };

  // Remove additional file
  const removeAdditionalFile = (index) => {
    if (window.confirm('Are you sure you want to remove this file?')) {
      removeFile(index);
      setPreviews((prev) => ({
        ...prev,
        additionalFiles: prev.additionalFiles.filter((_, i) => i !== index),
      }));
    }
  };

  // Add new URL
  const addAdditionalUrl = () => {
    if (additionalUrls.length >= 5) {
      toast.error('You can add up to 5 URLs.');
      return;
    }
    appendUrl('');
  };

  // Remove URL
  const removeAdditionalUrl = (index) => {
    if (window.confirm('Are you sure you want to remove this URL?')) {
      removeUrl(index);
    }
  };

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
          Evidence Upload
        </h3>
        <p className="text-gray-600 mt-2 text-sm md:text-base text-center">
          Provide as much evidence as possible to support your claim, including screenshots, emails, and other proof.
        </p>
      </div>

      {/* Evidence Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 md:p-6 bg-white rounded-lg shadow-md transition-all duration-300"
      >
        <div className="space-y-8">
          {/* Account Screenshot */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Account Screenshot <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Upload a screenshot showing your account is suspended or banned (JPG/PNG, max 5MB).
            </p>
            {!previews.accountScreenshot ? (
              <label
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-appleGreen/40 rounded-xl cursor-pointer bg-white/30 hover:bg-yellowGreen/10 transition-all duration-300"
                htmlFor="accountScreenshot"
              >
                <FaCamera className="text-brown text-4xl mb-3" />
                <p className="text-brown text-sm font-medium">Upload Account Screenshot</p>
                <p className="text-xs text-brown/50 mt-1">JPG or PNG (max 5MB)</p>
                <input
                  id="accountScreenshot"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange(e, 'accountScreenshot')}
                  className="hidden"
                  aria-label="Upload account screenshot"
                />
              </label>
            ) : (
              <div className="relative max-w-md mx-auto">
                <img
                  src={previews.accountScreenshot.url}
                  alt="Account Screenshot"
                  className="w-full h-48 object-cover rounded-xl shadow-md border-2 border-yellowGreen/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    setValue('evidence.accountScreenshot', null);
                    setPreviews((prev) => ({ ...prev, accountScreenshot: null }));
                  }}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
                  aria-label="Remove account screenshot"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
            {errors.evidence?.accountScreenshot && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle /> Please upload a screenshot of your account status.
              </p>
            )}
          </div>

          {/* Email Screenshot */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Email/Notification Screenshot
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Upload a screenshot of the email or notification from the platform (JPG, PNG, or PDF, max 5MB).
            </p>
            {!previews.emailScreenshot ? (
              <label
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-appleGreen/40 rounded-xl cursor-pointer bg-white/30 hover:bg-yellowGreen/10 transition-all duration-300"
                htmlFor="emailScreenshot"
              >
                <FaEnvelope className="text-brown text-4xl mb-3" />
                <p className="text-brown text-sm font-medium">Upload Email Screenshot</p>
                <p className="text-xs text-brown/50 mt-1">JPG, PNG, or PDF (max 5MB)</p>
                <input
                  id="emailScreenshot"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e, 'emailScreenshot')}
                  className="hidden"
                  aria-label="Upload email screenshot"
                />
              </label>
            ) : (
              <div className="relative max-w-md mx-auto">
                {previews.emailScreenshot.type === 'image' ? (
                  <img
                    src={previews.emailScreenshot.url}
                    alt="Email Screenshot"
                    className="w-full h-48 object-cover rounded-xl shadow-md border-2 border-yellowGreen/20"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-xl shadow-md border-2 border-appleGreen/20">
                    <FaFilePdf className="text-appleGreen text-4xl" />
                    <p className="ml-2 text-brown font-medium">PDF Uploaded</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setValue('evidence.emailScreenshot', null);
                    setPreviews((prev) => ({ ...prev, emailScreenshot: null }));
                  }}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
                  aria-label="Remove email screenshot"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Email Message */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Pasted Email/Message
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Paste the full text of any email or message from the platform (max 1000 characters).
            </p>
            <textarea
              {...register('evidence.emailMessage', {
                maxLength: {
                  value: 1000,
                  message: 'Email message cannot exceed 1000 characters',
                },
              })}
              className="w-full h-24 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              placeholder="e.g., Dear Creator, Your account has been suspended due to a violation..."
            />
            {errors.evidence?.emailMessage && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {errors.evidence.emailMessage.message}
              </p>
            )}
          </div>

          {/* Additional Files */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-brown">
                Additional Files (Images, Videos, PDFs)
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={addAdditionalFile}
                className="flex items-center gap-2 py-2 px-4 bg-appleGreen text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaPlus size={14} /> Add File
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Upload additional evidence like analytics screenshots, dispute letters, or videos (max 7 files, 5MB each).
            </p>
            {additionalFiles.length === 0 ? (
              <p className="text-gray-500 text-sm">No additional files uploaded.</p>
            ) : (
              <div className="space-y-4">
                {additionalFiles.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative p-4 bg-white rounded-lg shadow-md border border-appleGreen/10"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-brown flex items-center gap-2">
                        {previews.additionalFiles[index]?.type === 'image' ? (
                          <FaImage className="text-yellowGreen" />
                        ) : previews.additionalFiles[index]?.type === 'video' ? (
                          <FaVideo className="text-appleGreen" />
                        ) : previews.additionalFiles[index]?.type === 'pdf' ? (
                          <FaFilePdf className="text-appleGreen" />
                        ) : (
                          <FaPlus className="text-gray-400" />
                        )}
                        Additional File {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeAdditionalFile(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label={`Remove additional file ${index + 1}`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                    {!previews.additionalFiles[index] ? (
                      <label
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-appleGreen/40 rounded-xl cursor-pointer bg-white/30 hover:bg-yellowGreen/10 transition-all duration-300"
                        htmlFor={`additionalFiles.${index}`}
                      >
                        <FaPlus className="text-brown text-4xl mb-3" />
                        <p className="text-brown text-sm font-medium">Upload File</p>
                        <p className="text-xs text-brown/50 mt-1">JPG, PNG, MP4, or PDF (max 5MB)</p>
                        <input
                          id={`additionalFiles.${index}`}
                          type="file"
                          accept="image/jpeg,image/png,video/mp4,application/pdf"
                          onChange={(e) => handleFileChange(e, 'additionalFiles', index)}
                          className="hidden"
                          aria-label={`Upload additional file ${index + 1}`}
                        />
                      </label>
                    ) : (
                      <div className="relative max-w-md mx-auto">
                        {previews.additionalFiles[index].type === 'image' ? (
                          <img
                            src={previews.additionalFiles[index].url}
                            alt={`Additional File ${index + 1}`}
                            className="w-full h-48 object-cover rounded-xl shadow-md border-2 border-yellowGreen/20"
                          />
                        ) : previews.additionalFiles[index].type === 'video' ? (
                          <video
                            src={previews.additionalFiles[index].url}
                            controls
                            className="w-full h-48 object-cover rounded-xl shadow-md border-2 border-appleGreen/20"
                            aria-label={`Additional video ${index + 1}`}
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-xl shadow-md border-2 border-appleGreen/20">
                            <FaFilePdf className="text-appleGreen text-4xl" />
                            <p className="ml-2 text-brown font-medium">PDF Uploaded</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Additional URLs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-brown">
                Additional URLs
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={addAdditionalUrl}
                className="flex items-center gap-2 py-2 px-4 bg-appleGreen text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaPlus size={14} /> Add URL
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Provide links to posts, policies, or other relevant pages (max 5 URLs).
            </p>
            {additionalUrls.length === 0 ? (
              <p className="text-gray-500 text-sm">No URLs added.</p>
            ) : (
              <div className="space-y-4">
                {additionalUrls.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1">
                      <input
                        type="url"
                        {...register(`evidence.additionalUrls.${index}`, {
                          pattern: {
                            value: /^https?:\/\/.+$/,
                            message: 'Enter a valid URL (e.g., https://example.com)',
                          },
                        })}
                        className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                        placeholder="e.g., https://www.youtube.com/policy"
                      />
                      {errors.evidence?.additionalUrls?.[index] && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <FaExclamationCircle /> {errors.evidence.additionalUrls[index].message}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAdditionalUrl(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      aria-label={`Remove URL ${index + 1}`}
                    >
                      <FaTrash size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Additional Notes
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Provide any other details or context to support your claim (max 1000 characters).
            </p>
            <textarea
              {...register('evidence.additionalNotes', {
                maxLength: {
                  value: 1000,
                  message: 'Notes cannot exceed 1000 characters',
                },
              })}
              className="w-full h-24 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              placeholder="e.g., Analytics show a 50% drop in revenue after the suspension."
            />
            {errors.evidence?.additionalNotes && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {errors.evidence.additionalNotes.message}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimEvidenceUpload;