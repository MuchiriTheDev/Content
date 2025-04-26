import React from 'react';
import { FaPlus, FaTrash, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

const PlatformInformation = ({ register, errors, control, getValues, setValue }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'platformData',
  });

  // Add a new platform
  const addPlatform = () => {
    const currentPlatforms = getValues('platformData') || [];
    // Optional: Prevent adding if the last platform is incomplete
    if (currentPlatforms.length > 0) {
      const lastPlatform = currentPlatforms[currentPlatforms.length - 1];
      if (!lastPlatform.name || !lastPlatform.username || !lastPlatform.accountLink) {
        return toast.error('Please complete the current platform details before adding a new one.');
      }
    }
    append({
      name: '',
      username: '',
      accountLink: '',
      audienceSize: 0,
      contentType: '',
    });
  };

  // Remove a platform with confirmation
  const removePlatform = (index) => {
    if (window.confirm('Are you sure you want to remove this platform?')) {
      remove(index);
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
        <h3 className="text-2xl md:text-3xl text-center font-bold text-brown">
          Platform Information
        </h3>
        <p className="text-gray-600 mt-2 text-center text-sm md:text-base">
          Add the social media platforms you want to insure. Ensure all required fields are filled for accurate coverage.
        </p>
      </div>

      {/* Platform List */}
      {fields.length === 0 ? (
        <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500 italic text-center">
            No platforms added yet. Click "Add Platform" to start.
          </p>
        </div>
      ) : (
        fields.map((field, index) => (
          <motion.div
            key={field.id} // Use field.id from useFieldArray for unique key
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-2 border-appleGreen rounded-xl p-4 md:p-6 shadow-lg hover:shadow-appleGreen/30 transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg md:text-xl font-semibold text-brown">
                Platform {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removePlatform(index)}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
                aria-label={`Remove platform ${index + 1}`}
              >
                <FaTrash size={16} /> <span className="hidden md:inline">Remove</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Platform Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-brown">
                  Platform <span className="text-red-500">*</span>
                </label>
                <select
                  {...register(`platformData.${index}.name`, {
                    required: 'Platform is required',
                  })}
                  className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                >
                  <option value="">Select Platform</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="X">X</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Other">Other</option>
                </select>
                {errors.platformData?.[index]?.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle /> {errors.platformData[index].name.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-1 text-brown">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register(`platformData.${index}.username`, {
                    required: 'Username is required',
                    minLength: {
                      value: 2,
                      message: 'Username must be at least 2 characters',
                    },
                  })}
                  className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                  placeholder="e.g., @yourusername"
                />
                {errors.platformData?.[index]?.username && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle /> {errors.platformData[index].username.message}
                  </p>
                )}
              </div>

              {/* Account Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-brown">
                  Account Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  {...register(`platformData.${index}.accountLink`, {
                    required: 'Account link is required',
                    pattern: {
                      value: /^https?:\/\/.+$/,
                      message: 'Please enter a valid URL (e.g., https://...)',
                    },
                  })}
                  className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                  placeholder="e.g., https://www.youtube.com/@yourusername"
                />
                {errors.platformData?.[index]?.accountLink && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle /> {errors.platformData[index].accountLink.message}
                  </p>
                )}
              </div>

              {/* Audience Size */}
              <div>
                <label className="block text-sm font-medium mb-1 text-brown">
                  Audience Size
                </label>
                <input
                  type="number"
                  {...register(`platformData.${index}.audienceSize`, {
                    min: {
                      value: 0,
                      message: 'Audience size cannot be negative',
                    },
                  })}
                  className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                  placeholder="e.g., 1000"
                />
                {errors.platformData?.[index]?.audienceSize && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationCircle /> {errors.platformData[index].audienceSize.message}
                  </p>
                )}
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-brown">
                  Content Type
                </label>
                <input
                  type="text"
                  {...register(`platformData.${index}.contentType`)}
                  className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                  placeholder="e.g., Gaming, Lifestyle, Education"
                />
              </div>
            </div>
          </motion.div>
        ))
      )}

      {/* Add Platform Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={addPlatform}
        className="flex items-center justify-center gap-2 w-full md:w-auto py-3 px-6 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300"
      >
        <FaPlus size={18} /> Add Platform
      </motion.button>
    </motion.div>
  );
};

export default PlatformInformation;