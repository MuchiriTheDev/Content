import React, { useState } from 'react';
import { FaExclamationCircle, FaPlus, FaTrash, FaImage, FaVideo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

const ClaimEvidenceUpload = ({ register, errors, getValues, setValue, control }) => {
  const { fields: evidenceFiles, append, remove } = useFieldArray({
    control,
    name: 'evidenceFiles',
  });
  const [previews, setPreviews] = useState([]);

  // Handle file upload
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    if (file.type.startsWith('image/') || file.type === 'video/mp4') {
      setValue(`evidenceFiles.${index}`, file);
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = { url: previewUrl, type: file.type.startsWith('image/') ? 'image' : 'video' };
        return newPreviews;
      });
      toast.success(`${file.type.startsWith('image/') ? 'Image' : 'Video'} uploaded successfully!`);
    } else {
      toast.error('Please upload an image (JPG/PNG) or MP4 video.');
    }
  };

  // Add new evidence file
  const addEvidence = () => {
    if (evidenceFiles.length >= 5) {
      toast.error('You can upload up to 5 files.');
      return;
    }
    append(null);
    setPreviews((prev) => [...prev, null]);
  };

  // Remove evidence file
  const removeEvidence = (index) => {
    if (window.confirm('Are you sure you want to remove this file?')) {
      remove(index);
      setPreviews((prev) => prev.filter((_, i) => i !== index));
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
          Upload images or videos to support your claim (max 5 files, 5MB each).
        </p>
      </div>

      {/* Evidence List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 md:p-6 bg-white rounded-lg shadow-md transition-all duration-300"
      >
        {evidenceFiles.length === 0 ? (
          <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500 italic text-center">
              No evidence uploaded yet. Click "Add Evidence" to start.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {evidenceFiles.map((field, index) => (
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
                    ) : (
                      <FaPlus className="text-gray-400" />
                    )}
                    Evidence {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeEvidence(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    aria-label={`Remove evidence ${index + 1}`}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
                {!previews[index] ? (
                  <label
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-appleGreen/40 rounded-xl cursor-pointer bg-white/30 hover:bg-yellowGreen/10 transition-all duration-300"
                    htmlFor={`evidenceFiles.${index}`}
                  >
                    <FaPlus className="text-brown text-4xl mb-3" />
                    <p className="text-brown text-sm font-medium">Upload Image or Video</p>
                    <p className="text-xs text-brown/50 mt-1">JPG, PNG, or MP4 (max 5MB)</p>
                    <input
                      id={`evidenceFiles.${index}`}
                      type="file"
                      accept="image/*,video/mp4"
                      onChange={(e) => handleFileChange(e, index)}
                      className="hidden"
                      aria-label="Upload evidence file"
                    />
                  </label>
                ) : (
                  <div className="relative max-w-md mx-auto">
                    {previews[index].type === 'image' ? (
                      <img
                        src={previews[index].url}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl shadow-md border-2 border-yellowGreen/20"
                      />
                    ) : (
                      <video
                        src={previews[index].url}
                        controls
                        className="w-full h-48 object-cover rounded-xl shadow-md border-2 border-appleGreen/20"
                        aria-label={`Evidence video ${index + 1}`}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Evidence Button */}
        <div className="w-full flex justify-center mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={addEvidence}
            className="flex items-center justify-center gap-2 w-full md:w-auto py-3 px-6 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300"
            aria-label="Add new evidence"
          >
            <FaPlus size={18} /> Add Evidence
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimEvidenceUpload;