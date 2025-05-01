import React, { useState } from 'react';
import { FaExclamationCircle, FaPlus, FaTrash, FaImage, FaVideo, FaFilePdf, FaCamera, FaLink } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useFieldArray, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

const ClaimEvidenceUpload = ({ register, errors, getValues, setValue, control }) => {
  const { fields: files, append: appendFile, remove: removeFile } = useFieldArray({
    control,
    name: 'evidence.files',
  });
  const { fields: affectedContent, append: appendContent, remove: removeContent } = useFieldArray({
    control,
    name: 'evidence.affectedContent',
  });
  const [previews, setPreviews] = useState([]);

  // Supported file types from backend schema
  const evidenceTypes = ['Screenshot', 'Email', 'Notification', 'Analytics', 'Other'];
  const mediaTypes = ['Video', 'Post', 'Other'];

  // Handle file upload
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'];
    if (!validMimeTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, MP4, or PDF.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setValue(`evidence.files.${index}.file`, file);
    setPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews[index] = {
        url: previewUrl,
        type: file.type.startsWith('image/') ? 'image' : file.type === 'video/mp4' ? 'video' : 'pdf',
      };
      return newPreviews;
    });

    toast.success(`${file.type.startsWith('image/') ? 'Image' : file.type === 'video/mp4' ? 'Video' : 'PDF'} uploaded successfully!`);
  };

  // Add new file entry
  const addFile = () => {
    if (files.length >= 10) {
      toast.error('You can upload up to 10 files.');
      return;
    }
    appendFile({ file: null, type: 'Screenshot', description: '' });
    setPreviews(prev => [...prev, null]);
  };

  // Remove file entry
  const removeFileEntry = (index) => {
    if (window.confirm('Are you sure you want to remove this file?')) {
      removeFile(index);
      setPreviews(prev => prev.filter((_, i) => i !== index));
      toast.success('File removed successfully.');
    }
  };

  // Add affected content entry
  const addAffectedContent = () => {
    if (affectedContent.length >= 5) {
      toast.error('You can add up to 5 affected content entries.');
      return;
    }
    appendContent({ url: '', description: '', mediaType: 'Video' });
  };

  // Remove affected content entry
  const removeAffectedContent = (index) => {
    if (window.confirm('Are you sure you want to remove this content entry?')) {
      removeContent(index);
      toast.success('Content entry removed successfully.');
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
      role="form"
      aria-label="Evidence Upload Form"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-brown">Evidence Upload</h3>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Upload evidence and specify affected content to support your claim. At least one file must be a Screenshot, Email, or Notification.
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
          {/* Evidence Files */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-brown">
                Evidence Files <span className="text-red-500">*</span>
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={addFile}
                className="flex items-center gap-2 py-2 px-4 bg-appleGreen text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Add evidence file"
              >
                <FaPlus size={14} /> Add File
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Upload screenshots, videos, or PDFs (max 10 files, 5MB each). Specify the type and add a description.
            </p>
            {files.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No files uploaded. Please add at least one file (Screenshot, Email, or Notification required).
              </p>
            ) : (
              <div className="space-y-4">
                {files.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative p-4 bg-white rounded-lg shadow-md border border-appleGreen/10"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-brown flex items-center gap-2">
                        {previews[index]?.type === 'image' ? (
                          <FaImage className="text-yellowGreen" />
                        ) : previews[index]?.type === 'video' ? (
                          <FaVideo className="text-appleGreen" />
                        ) : previews[index]?.type === 'pdf' ? (
                          <FaFilePdf className="text-appleGreen" />
                        ) : (
                          <FaPlus className="text-gray-400" />
                        )}
                        Evidence File {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFileEntry(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label={`Remove evidence file ${index + 1}`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File Type */}
                      <div>
                        <label className="block text-xs font-medium text-brown mb-1">
                          File Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register(`evidence.files.${index}.type`, {
                            required: 'Please select a file type',
                          })}
                          className="w-full h-10 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                          aria-label={`Select file type for evidence ${index + 1}`}
                        >
                          {evidenceTypes.map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {errors.evidence?.files?.[index]?.type && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <FaExclamationCircle />
                            {errors.evidence.files[index].type.message}
                          </p>
                        )}
                      </div>
                      {/* File Upload */}
                      <div>
                        <label className="block text-xs font-medium text-brown mb-1">
                          Upload File <span className="text-red-500">*</span>
                        </label>
                        {!previews[index] ? (
                          <label
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-appleGreen/40 rounded-xl cursor-pointer bg-white/30 hover:bg-yellowGreen/10 transition-all duration-300"
                            htmlFor={`evidence.files.${index}.file`}
                          >
                            <FaCamera className="text-brown text-3xl mb-2" />
                            <p className="text-brown text-xs font-medium">Upload File</p>
                            <p className="text-xs text-brown/50 mt-1">JPG, PNG, MP4, PDF (max 5MB)</p>
                            <input
                              id={`evidence.files.${index}.file`}
                              type="file"
                              accept="image/jpeg,image/png,video/mp4,application/pdf"
                              onChange={e => handleFileChange(e, index)}
                              className="hidden"
                              aria-label={`Upload evidence file ${index + 1}`}
                            />
                          </label>
                        ) : (
                          <div className="relative max-w-xs">
                            {previews[index].type === 'image' ? (
                              <img
                                src={previews[index].url}
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-32 object-cover rounded-xl shadow-md border-2 border-yellowGreen/20"
                              />
                            ) : previews[index].type === 'video' ? (
                              <video
                                src={previews[index].url}
                                controls
                                className="w-full h-32 object-cover rounded-xl shadow-md border-2 border-appleGreen/20"
                                aria-label={`Evidence video ${index + 1}`}
                              />
                            ) : (
                              <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-xl shadow-md border-2 border-appleGreen/20">
                                <FaFilePdf className="text-appleGreen text-3xl" />
                                <p className="ml-2 text-brown font-medium">PDF Uploaded</p>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setValue(`evidence.files.${index}.file`, null);
                                setPreviews(prev => {
                                  const newPreviews = [...prev];
                                  newPreviews[index] = null;
                                  return newPreviews;
                                });
                                toast.success('File removed successfully.');
                              }}
                              className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
                              aria-label={`Remove evidence file ${index + 1}`}
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        )}
                        {errors.evidence?.files?.[index]?.file && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <FaExclamationCircle />
                            {errors.evidence.files[index].file.message || 'Please upload a file'}
                          </p>
                        )}
                      </div>
                      {/* File Description */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-brown mb-1">
                          Description (Optional)
                        </label>
                        <textarea
                          {...register(`evidence.files.${index}.description`, {
                            maxLength: {
                              value: 500,
                              message: 'Description cannot exceed 500 characters',
                            },
                          })}
                          className="w-full h-20 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                          placeholder="e.g., Screenshot of suspension notice from platform dashboard"
                          aria-label={`Description for evidence file ${index + 1}`}
                        />
                        {errors.evidence?.files?.[index]?.description && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <FaExclamationCircle />
                            {errors.evidence.files[index].description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {errors.evidence?.files && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <FaExclamationCircle />
                {errors.evidence.files.message || 'Please upload at least one file (Screenshot, Email, or Notification required)'}
              </p>
            )}
          </div>

          {/* Affected Content */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-brown">
                Affected Content <span className="text-red-500">*</span>
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={addAffectedContent}
                className="flex items-center gap-2 py-2 px-4 bg-appleGreen text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Add affected content"
              >
                <FaPlus size={14} /> Add Content
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Specify URLs of content affected by the incident (e.g., videos, posts) with descriptions (max 5 entries).
            </p>
            {affectedContent.length === 0 ? (
              <p className="text-gray-500 text-sm">No affected content added. Please add at least one entry.</p>
            ) : (
              <div className="space-y-4">
                {affectedContent.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative p-4 bg-white rounded-lg shadow-md border border-appleGreen/10"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-brown flex items-center gap-2">
                        <FaLink className="text-yellowGreen" />
                        Affected Content {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeAffectedContent(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label={`Remove affected content ${index + 1}`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Content URL */}
                      <div>
                        <label className="block text-xs font-medium text-brown mb-1">
                          Content URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          {...register(`evidence.affectedContent.${index}.url`, {
                            required: 'Please enter a URL',
                            pattern: {
                              value: /^https?:\/\/.+$/,
                              message: 'Enter a valid URL (e.g., https://example.com)',
                            },
                          })}
                          className="w-full h-10 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                          placeholder="e.g., https://youtube.com/watch?v=abc123"
                          aria-label={`URL for affected content ${index + 1}`}
                        />
                        {errors.evidence?.affectedContent?.[index]?.url && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <FaExclamationCircle />
                            {errors.evidence.affectedContent[index].url.message}
                          </p>
                        )}
                      </div>
                      {/* Media Type */}
                      <div>
                        <label className="block text-xs font-medium text-brown mb-1">
                          Media Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register(`evidence.affectedContent.${index}.mediaType`, {
                            required: 'Please select a media type',
                          })}
                          className="w-full h-10 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                          aria-label={`Select media type for affected content ${index + 1}`}
                        >
                          {mediaTypes.map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {errors.evidence?.affectedContent?.[index]?.mediaType && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <FaExclamationCircle />
                            {errors.evidence.affectedContent[index].mediaType.message}
                          </p>
                        )}
                      </div>
                      {/* Content Description */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-brown mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...register(`evidence.affectedContent.${index}.description`, {
                            required: 'Please provide a description',
                            minLength: {
                              value: 10,
                              message: 'Description must be at least 10 characters',
                            },
                            maxLength: {
                              value: 500,
                              message: 'Description cannot exceed 500 characters',
                            },
                          })}
                          className="w-full h-20 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                          placeholder="e.g., Video removed due to copyright claim"
                          aria-label={`Description for affected content ${index + 1}`}
                        />
                        {errors.evidence?.affectedContent?.[index]?.description && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <FaExclamationCircle />
                            {errors.evidence.affectedContent[index].description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {errors.evidence?.affectedContent && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <FaExclamationCircle />
                {errors.evidence.affectedContent.message || 'Please add at least one affected content entry'}
              </p>
            )}
          </div>

          {/* Evidence Summary */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Evidence Summary <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Summarize how the uploaded evidence supports your claim (50-1000 characters).
            </p>
            <textarea
              {...register('evidence.evidenceSummary', {
                required: 'Please provide an evidence summary',
                minLength: {
                  value: 50,
                  message: 'Summary must be at least 50 characters',
                },
                maxLength: {
                  value: 1000,
                  message: 'Summary cannot exceed 1000 characters',
                },
              })}
              className="w-full h-32 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              placeholder="e.g., The screenshots show the suspension notice and analytics indicate a 50% revenue drop..."
              aria-label="Evidence summary"
            />
            {errors.evidence?.evidenceSummary && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle />
                {errors.evidence.evidenceSummary.message}
              </p>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Additional Notes (Optional)
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
              placeholder="e.g., Additional context about the incident or evidence..."
              aria-label="Additional notes"
            />
            {errors.evidence?.additionalNotes && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle />
                {errors.evidence.additionalNotes.message}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimEvidenceUpload;