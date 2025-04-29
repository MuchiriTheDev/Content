import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaPauseCircle, FaTimes, FaPlay } from 'react-icons/fa';

const ContentReviewing = () => {
  const [contentType, setContentType] = useState('text'); // 'text', 'image', or 'video'
  const [textInput, setTextInput] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [reviewResult, setReviewResult] = useState(null); // Null until review is complete
  const [isReviewing, setIsReviewing] = useState(false); // State for review animation
  const [showPopup, setShowPopup] = useState(false); // State for image popup
  const [showVideo, setShowVideo] = useState(false); // State for video player visibility

  // Simulated AI review logic with delay for animation
  const reviewContent = () => {
    setIsReviewing(true);
    setReviewResult(null);

    setTimeout(() => {
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
      setIsReviewing(false);
    }, 2000); // 2-second delay for animation
  };

  // Generate preview URL for media
  const getMediaPreview = () => {
    if (!mediaFile) return null;
    return URL.createObjectURL(mediaFile);
  };

  // Generate thumbnail for video
  const getVideoThumbnail = () => {
    if (!mediaFile || contentType !== 'video') return null;
    const video = document.createElement('video');
    video.src = URL.createObjectURL(mediaFile);
    return new Promise((resolve) => {
      video.addEventListener('loadeddata', () => {
        video.currentTime = 1; // Capture frame at 1 second
      });
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      });
    });
  };

  // Variants for orbiting nodes during review
  const nodeVariants = {
    orbit: (custom) => ({
      x: [Math.cos(custom.angle * Math.PI / 180) * custom.radius, Math.cos((custom.angle + 360) * Math.PI / 180) * custom.radius],
      y: [Math.sin(custom.angle * Math.PI / 180) * custom.radius, Math.sin((custom.angle + 360) * Math.PI / 180) * custom.radius],
      opacity: [0.9, 0.6, 0.9],
      scale: [1, 1.2, 1],
      transition: {
        duration: custom.speed,
        repeat: Infinity,
        ease: 'linear',
      },
    }),
  };

  // Variants for central core during review
  const coreVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      boxShadow: [
        '0 0 10px rgba(170, 198, 36, 0.6)',
        '0 0 25px rgba(170, 198, 36, 0.9)',
        '0 0 10px rgba(170, 198, 36, 0.6)',
      ],
      transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
    },
  };

  // Review animation component
  const ReviewAnimation = () => {
    const nodes = Array.from({ length: 8 }, (_, index) => ({
      id: index,
      angle: (index * 360) / 8,
      radius: 45,
      speed: 2.5,
    }));

    return (
      <motion.div className="relative flex items-center justify-center w-32 h-32">
        <motion.div
          className="absolute w-12 h-12 bg-yellowGreen rounded-full shadow-[0_0_15px_rgba(170,198,36,0.8)]"
          variants={coreVariants}
          animate="pulse"
        />
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute w-3 h-3 bg-appleGreen rounded-full shadow-[0_0_5px_rgba(123,191,42,0.6)]"
            style={{ top: '50%', left: '50%' }}
            variants={nodeVariants}
            animate="orbit"
            custom={{ angle: node.angle, radius: node.radius, speed: node.speed }}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full bg-white shadow-lg border border-appleGreen/10"
      style={{ background: 'linear-gradient(145deg, #ffffff, #f7f9f7)' }}
    >
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <h3 className="text-3xl  font-bold text-brown mb-3 tracking-tight">
          Content Review
        </h3>
        <p className="text-brown/60 text-sm mb-8 font-sans">
          Analyze your content’s safety with our AI-powered review tool.
        </p>

        {/* Content Type Selection */}
        <div className="flex gap-3 mb-8 justify-center">
          {['text', 'image', 'video'].map((type) => (
            <motion.button
              key={type}
              onClick={() => {
                setContentType(type);
                setMediaFile(null);
                setReviewResult(null);
                setTextInput('');
                setShowVideo(false);
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(170, 198, 36, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-medium font-sans transition-all duration-300 ${
                contentType === type
                  ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown shadow-md'
                  : 'bg-gray-50 text-brown/50 hover:bg-yellowGreen/10'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Input Area */}
        <div className="mb-8">
          {contentType === 'text' ? (
            <motion.textarea
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your text content..."
              className="w-full p-4 bg-white border border-appleGreen/20 rounded-lg text-brown text-sm font-sans focus:outline-none focus:ring-2 focus:ring-yellowGreen/50 shadow-sm hover:shadow-md transition-all duration-300"
              rows="6"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {!mediaFile ? (
                <label className="flex flex-col items-center justify-center w-full h-64 bg-white border-2 border-dashed border-appleGreen/30 rounded-lg cursor-pointer hover:bg-yellowGreen/10 hover:border-yellowGreen/50 transition-all duration-300 shadow-sm">
                  <div className="flex flex-col items-center">
                    <FaUpload className="text-brown text-4xl mb-3" />
                    <p className="text-brown text-base font-medium font-sans">
                      Upload {contentType === 'image' ? 'an Image' : 'a Video'}
                    </p>
                    <p className="text-xs text-brown/50 font-sans mt-2">
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
              ) : (
                <div className="relative flex items-center justify-center">
                  {contentType === 'image' ? (
                    <img
                      src={getMediaPreview()}
                      alt="Preview"
                      className="w-full max-w-2xl h-80 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-95 transition-opacity duration-200"
                      onClick={() => setShowPopup(true)}
                    />
                  ) : (
                    <div className="w-full max-w-2xl h-80 relative">
                      {showVideo ? (
                        <video
                          src={getMediaPreview()}
                          controls
                          className="w-full h-full object-cover rounded-lg shadow-md"
                          style={{
                            '--video-controls-bg': '#AAC624',
                            '--video-controls-hover': '#7BBF2A',
                          }}
                        />
                      ) : (
                        <motion.div
                          className="relative w-full h-full rounded-lg shadow-md overflow-hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={getMediaPreview()}
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover"
                            onLoad={async () => {
                              const thumbnail = await getVideoThumbnail();
                              if (thumbnail) {
                                document.querySelector('img[alt="Video Thumbnail"]').src = thumbnail;
                              }
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowVideo(true)}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-brown/80 rounded-full text-white hover:bg-brown transition-all duration-200"
                          >
                            <FaPlay size={24} />
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setMediaFile(null);
                      setShowVideo(false);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-sm"
                  >
                    <FaTimes size={14} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(170, 198, 36, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={reviewContent}
          disabled={isReviewing}
          className={`w-full max-w-md mx-auto py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown text-sm font-sans shadow-md transition-all duration-300 ${
            isReviewing ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'
          }`}
        >
          {isReviewing ? (
            <span className="flex items-center justify-center gap-2">
              <FaUpload className="animate-spin" />
              Reviewing...
            </span>
          ) : (
            'Review Content'
          )}
        </motion.button>

        {/* Review Result or Animation */}
        <div className="mt-8">
          {isReviewing ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center"
            >
              <ReviewAnimation />
              <p className="text-brown/60 text-sm font-sans mt-4">Analyzing content...</p>
            </motion.div>
          ) : reviewResult ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-white rounded-lg shadow-md border border-appleGreen/20 flex items-start gap-4 max-w-2xl mx-auto"
            >
              <div className="text-2xl flex-shrink-0">
                {reviewResult.status === 'Safe' && <FaCheckCircle className="text-green-500" />}
                {reviewResult.status === 'Banned' && <FaTimesCircle className="text-red-500" />}
                {reviewResult.status === 'Demonetized' && <FaExclamationTriangle className="text-yellow-500" />}
                {reviewResult.status === 'Suspended' && <FaPauseCircle className="text-orange-500" />}
                {reviewResult.status === 'Error' && <FaExclamationTriangle className="text-gray-500" />}
              </div>
              <div>
                <p className="font-semibold text-brown text-sm font-sans">
                  Status:{' '}
                  <span
                    className={
                      reviewResult.status === 'Safe'
                        ? 'text-green-500'
                        : reviewResult.status === 'Banned'
                        ? 'text-red-500'
                        : reviewResult.status === 'Demonetized'
                        ? 'text-yellow-500'
                        : reviewResult.status === 'Suspended'
                        ? 'text-orange-500'
                        : 'text-gray-500'
                    }
                  >
                    {reviewResult.status}
                  </span>
                </p>
                <p className="text-brown/70 text-sm font-sans mt-1">{reviewResult.message}</p>
              </div>
            </motion.div>
          ) : null}
        </div>

        {/* Image Popup */}
        {showPopup && mediaFile && contentType === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative max-w-5xl w-full p-4 bg-white rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getMediaPreview()}
                alt="Close-up preview"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-sm"
              >
                <FaTimes size={16} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ContentReviewing;