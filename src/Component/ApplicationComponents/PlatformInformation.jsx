import React from 'react';
import { FaPlus, FaTrash, FaExclamationCircle, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useFieldArray, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

// Component for rendering each platform
const PlatformItem = ({ field, index, removePlatform, platformData, register, errors, control }) => {
  const { fields: riskHistoryFields, append: appendRisk, remove: removeRisk } = useFieldArray({
    control,
    name: `platformData.${index}.riskHistory`,
  });

  // Dynamic guidance for platform selection
  const platformGuidance = (platformName) => {
    const messages = {
      YouTube: 'We’ll analyze YouTube’s policies to tailor your coverage and protect against demonetization or bans.',
      TikTok: 'We’ll assess TikTok’s guidelines to ensure your coverage fits your content’s risk profile.',
      Instagram: 'We’ll review Instagram’s rules to provide coverage for suspensions or content restrictions.',
      X: 'We’ll evaluate X’s policies to protect your income from platform actions.',
      Facebook: 'We’ll check Facebook’s standards to customize your insurance for potential bans or demonetization.',
      Other: 'We’ll review your platform’s policies to provide tailored coverage.',
      '': 'Select a platform to see how we’ll protect your income.',
    };
    return messages[platformName] || messages[''];
  };

  return (
    <motion.div
      key={field.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 bg-white rounded-lg shadow-md transition-shadow duration-300"
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
          <p className="text-xs text-gray-500 mb-1">
            This helps us assess platform-specific risks for your coverage.
          </p>
          <select
            {...register(`platformData.${index}.name`, {
              required: 'Please select a platform',
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
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
            <FaLock className="text-gray-400" /> {platformGuidance(platformData[index]?.name)}
          </p>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1 text-brown">
            Username <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1">
            This helps us verify your account for coverage and claims.
          </p>
          <input
            type="text"
            {...register(`platformData.${index}.username`, {
              required: 'Please enter your username',
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
          <p className="text-xs text-gray-500 mb-1">
            This lets us review your content to tailor your coverage.
          </p>
          <input
            type="url"
            {...register(`platformData.${index}.accountLink`, {
              required: 'Please enter your account link',
              pattern: {
                value: /^https?:\/\/.+$/,
                message: 'Enter a valid profile URL, e.g., https://www.youtube.com/@yourusername',
              },
            })}
            className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
            placeholder="e.g., https://www.tiktok.com/@yourusername"
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
          <p className="text-xs text-gray-500 mb-1">
            This helps us estimate your income and risk for a fair premium.
          </p>
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
          <p className="text-xs text-gray-500 mb-1">
            This helps us assess risk and offer violation prevention tools.
          </p>
          <input
            type="text"
            {...register(`platformData.${index}.contentType`)}
            className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
            placeholder="e.g., Gaming, Lifestyle, Education"
          />
        </div>

        {/* Risk History */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-brown">
              Past Incidents (Bans, Suspensions, Demonetizations)
            </label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => appendRisk({ violationType: '', date: '', description: '' })}
              className="flex items-center gap-2 py-2 px-4 bg-appleGreen text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaPlus size={14} /> Incident
            </motion.button>
          </div>
          {riskHistoryFields.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No incidents added. Add any past bans, suspensions, or demonetizations.
            </p>
          ) : (
            riskHistoryFields.map((risk, riskIndex) => (
              <div key={risk.id} className="border border-gray-200 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-sm font-semibold text-brown">Incident {riskIndex + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeRisk(riskIndex)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Violation Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">
                      Incident Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`platformData.${index}.riskHistory.${riskIndex}.violationType`, {
                        required: 'Please enter the incident type',
                      })}
                      className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      placeholder="e.g., Ban, Suspension, Demonetization"
                    />
                    {errors.platformData?.[index]?.riskHistory?.[riskIndex]?.violationType && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaExclamationCircle />{' '}
                        {errors.platformData[index].riskHistory[riskIndex].violationType.message}
                      </p>
                    )}
                  </div>
                  {/* Incident Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register(`platformData.${index}.riskHistory.${riskIndex}.date`, {
                        required: 'Please enter the incident date',
                        validate: (value) =>
                          new Date(value) <= new Date() || 'Date cannot be in the future',
                      })}
                      className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                    />
                    {errors.platformData?.[index]?.riskHistory?.[riskIndex]?.date && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaExclamationCircle />{' '}
                        {errors.platformData[index].riskHistory[riskIndex].date.message}
                      </p>
                    )}
                  </div>
                  {/* Incident Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-brown">
                      Description (Optional)
                    </label>
                    <textarea
                      {...register(`platformData.${index}.riskHistory.${riskIndex}.description`, {
                        maxLength: {
                          value: 500,
                          message: 'Description cannot exceed 500 characters',
                        },
                      })}
                      className="w-full h-24 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      placeholder="e.g., Temporary suspension due to community guideline violation"
                    />
                    {errors.platformData?.[index]?.riskHistory?.[riskIndex]?.description && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaExclamationCircle />{' '}
                        {errors.platformData[index].riskHistory[riskIndex].description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

const PlatformInformation = ({ register, errors, control, getValues, setValue }) => {
  const { fields: platformFields, append: appendPlatform, remove: removePlatform } = useFieldArray({
    control,
    name: 'platformData',
  });

  // Watch platformData to dynamically show guidance
  const platformData = useWatch({ control, name: 'platformData', defaultValue: [] });

  // Add a new platform
  const addPlatform = () => {
    const currentPlatforms = getValues('platformData') || [];
    if (currentPlatforms.length >= 5) {
      return toast.error('You can add up to 5 platforms.');
    }
    if (currentPlatforms.length > 0) {
      const lastPlatform = currentPlatforms[currentPlatforms.length - 1];
      if (!lastPlatform.name || !lastPlatform.username || !lastPlatform.accountLink) {
        return toast.error('Please complete the current platform details before adding a new one.');
      }
    }
    appendPlatform({
      name: '',
      username: '',
      accountLink: '',
      audienceSize: 0,
      contentType: '',
      riskHistory: [],
    });
  };

  // Remove a platform with confirmation
  const removePlatformHandler = (index) => {
    if (window.confirm('Are you sure you want to remove this platform?')) {
      removePlatform(index);
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
          Add the social media platforms you want to insure, including any past bans, suspensions, or demonetizations.
        </p>
      </div>

      {/* Platform List */}
      {platformFields.length === 0 ? (
        <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500 italic text-center">
            No platforms added yet. Click "Add Platform" to start.
          </p>
        </div>
      ) : (
        platformFields.map((field, index) => (
          <PlatformItem
            key={field.id}
            field={field}
            index={index}
            removePlatform={removePlatformHandler}
            platformData={platformData}
            register={register}
            errors={errors}
            control={control}
          />
        ))
      )}

      {/* Add Platform Button */}
     <div className="w-full flex justify-center mt-4">
      <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={addPlatform}
          className="flex items-center justify-center gap-2 w-full md:w-auto py-3 px-6 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300"
          aria-label="Add a new platform"
        >
          <FaPlus size={18} /> Add Platform
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PlatformInformation;