import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaPauseCircle } from 'react-icons/fa';

const ContentReviewing = () => {
  const [contentType, setContentType] = useState('text'); // 'text', 'image', or 'video'
  const [textInput, setTextInput] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [reviewResult, setReviewResult] = useState( {status: 'Error', message: 'Please provide content to review.' });

  // Simulated AI review logic
  const reviewContent = () => {
    let result = { status: 'Safe', message: 'Your content is safe to post!' };

    if (contentType === 'text' && textInput) {
      const bannedWords = ['hate', 'violence', 'spam'];
      const lowerText = textInput.toLowerCase();
      if (bannedWords.some(word => lowerText.includes(word))) {
        result = { status: 'Banned', message: 'Content contains prohibited terms and may be banned.' };
      } else if (lowerText.includes('promo')) {
        result = { status: 'Demonetized', message: 'Promotional content may be demonetized.' };
      }
    } else if (contentType === 'image' && mediaFile) {
      if (mediaFile.size > 5 * 1024 * 1024) {
        result = { status: 'Suspended', message: 'Image exceeds size limit and may be suspended.' };
      }
    } else if (contentType === 'video' && mediaFile) {
      if (mediaFile.type !== 'video/mp4') {
        result = { status: 'Banned', message: 'Unsupported video format may lead to a ban.' };
      }
    } else {
      result = { status: 'Error', message: 'Please provide content to review.' };
    }

    setReviewResult(result);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="p-6 bg-gradient-to-br from-white to-appleGreen/20 rounded-xl shadow-xl border border-appleGreen/30 w-full mx-auto"
    >
      {/* Header */}
      <h3 className="text-2xl md:text-3xl font-extrabold text-brown mb-2 tracking-tight">
        Content Reviewing
      </h3>
      <p className="text-brown/80 text-sm md:text-base mb-6">
        Preview your content’s safety before posting. Free and easy!
      </p>

      {/* Content Type Selection */}
      <div className="flex gap-3 mb-6">
        {['text', 'image', 'video'].map((type) => (
          <motion.button
            key={type}
            onClick={() => setContentType(type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-colors duration-300 ${
              contentType === type
                ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown shadow-sm'
                : 'bg-gray-100 text-brown/70 hover:bg-yellowGreen/30'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Input Area */}
      <div className="mb-6">
        {contentType === 'text' ? (
          <motion.textarea
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full p-4 bg-white border border-appleGreen/50 rounded-lg text-brown text-sm md:text-base resize-none focus:outline-none focus:ring-2 focus:ring-yellowGreen/70 shadow-sm hover:shadow-md transition-all duration-300"
            rows="5"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center w-full"
          >
            <label className="flex flex-col items-center justify-center w-full h-40 bg-white border-2 border-dashed border-appleGreen/70 rounded-lg cursor-pointer hover:bg-yellowGreen/10 transition-all duration-300 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <FaUpload className="text-brown text-3xl mb-2" />
                <p className="text-brown font-medium">
                  {mediaFile ? mediaFile.name : `Upload ${contentType === 'image' ? 'an Image' : 'a Video'}`}
                </p>
                <p className="text-xs text-brown/60 mt-1">
                  {contentType === 'image' ? 'JPG, PNG (max 5MB)' : 'MP4 only'}
                </p>
              </div>
              <input
                type="file"
                accept={contentType === 'image' ? 'image/*' : 'video/mp4'}
                onChange={(e) => setMediaFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </motion.div>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 213, 162, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        onClick={reviewContent}
        className="w-fit py-3 px-6 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-md hover:shadow-lg transition-all duration-300 text-base md:text-lg"
      >
        Review Content
      </motion.button>

      {/* Review Result */}
      {reviewResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-6 p-4 bg-white rounded-lg shadow-md border border-appleGreen/50 flex items-start gap-3"
        >
          <div className="text-2xl flex-shrink-0">
            {reviewResult.status === 'Safe' && <FaCheckCircle className="text-green-600" />}
            {reviewResult.status === 'Banned' && <FaTimesCircle className="text-red-600" />}
            {reviewResult.status === 'Demonetized' && <FaExclamationTriangle className="text-yellow-600" />}
            {reviewResult.status === 'Suspended' && <FaPauseCircle className="text-orange-600" />}
            {reviewResult.status === 'Error' && <FaExclamationTriangle className="text-gray-600" />}
          </div>
          <div>
            <p className="font-semibold text-brown text-sm md:text-base">
              Status:{' '}
              <span
                className={
                  reviewResult.status === 'Safe'
                    ? 'text-green-600'
                    : reviewResult.status === 'Banned'
                    ? 'text-red-600'
                    : reviewResult.status === 'Demonetized'
                    ? 'text-yellow-600'
                    : reviewResult.status === 'Suspended'
                    ? 'text-orange-600'
                    : 'text-gray-600'
                }
              >
                {reviewResult.status}
              </span>
            </p>
            <p className="text-brown/80 text-sm mt-1">{reviewResult.message}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContentReviewing;