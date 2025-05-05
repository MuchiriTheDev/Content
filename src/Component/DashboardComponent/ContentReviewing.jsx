import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { FaUpload, FaCheckCircle, FaExclamationTriangle, FaTimes, FaPlay, FaInfoCircle, FaVideo, FaImage } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import { backendUrl } from '../../App';
import Loading from '../../Resources/Loading';

const ContentReviewing = () => {
  const { loading, setLoading } = useContext(GeneralContext);
  const [reviewResult, setReviewResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      platform: '',
      contentType: '',
      title: '',
      description: '',
      mediaFiles: null,
    },
    mode: 'onChange',
  });

  const platform = useWatch({ control, name: 'platform' });

  // Show result popup when reviewResult is set
  useEffect(() => {
    if (reviewResult) {
      setShowPopup(true);
    }
  }, [reviewResult]);

  // Dynamic platform guidance
  const platformGuidance = (name) => {
    const messages = {
      YouTube: 'Include a title and description for accurate risk assessment based on YouTube’s Community Guidelines.',
      TikTok: 'Add a description or image to assess risks under TikTok’s Community Standards.',
      Instagram: 'Provide a description or image to evaluate compliance with Instagram’s policies.',
      X: 'Include a description or image to check for violations of X’s rules on abusive behavior.',
      Facebook: 'Add a description or image to ensure compliance with Facebook’s Community Standards.',
      Other: 'Provide a description or image to assess risks for your custom platform.',
      '': 'Select a platform to see how we’ll analyze your content.',
    };
    return messages[name] || messages[''];
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    if (file.type.startsWith('image/')) {
      setValue('mediaFiles', file);
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name);
      setFileType('image');
      setShowVideo(false);
      setThumbnailUrl(null);
      toast.success('Image uploaded successfully!');
    } else if (file.type === 'video/mp4') {
      setValue('mediaFiles', file);
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name);
      setFileType('video');
      setShowVideo(false);
      setThumbnailUrl(null);
      generateThumbnail(file);
      toast.success('Video uploaded successfully!');
    } else {
      toast.error('Please upload an image (JPG/PNG) or MP4 video.');
    }
  };

  // Generate video thumbnail
  const generateThumbnail = async (file) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.addEventListener('loadeddata', () => {
      video.currentTime = 1;
    });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnailUrl(canvas.toDataURL('image/jpeg'));
    });
    video.addEventListener('error', () => {
      toast.error('Failed to generate video thumbnail.');
    });
  };

  // Submit content for review
  const onSubmit = async (data) => {
    setLoading(true);
    setReviewResult(null);

    try {
      const formData = new FormData();
      formData.append('platform', data.platform);
      formData.append('contentType', data.contentType);
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.mediaFiles) formData.append('mediaFiles', data.mediaFiles);

      const response = await axios.post(`${backendUrl}/content/submit`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Log response for debugging
      console.log('Backend response:', response.data);

      const riskAssessment = response.data.riskAssessment || {};
      setReviewResult({
        isSafe: riskAssessment.isSafe ?? null,
        riskLevel: riskAssessment.riskLevel || 'N/A',
        risks: Array.isArray(riskAssessment.risks) ? riskAssessment.risks : [],
        reasons: Array.isArray(riskAssessment.reasons) ? riskAssessment.reasons : [],
        mediaAnalysis: riskAssessment.mediaAnalysis || { type: 'None', description: '', analysisNotes: '' }, // Include media analysis
      });
      toast.success('Content reviewed successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to submit content.';
      toast.error(errorMessage);
      setReviewResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const coreVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      boxShadow: [
        '0 0 8px rgba(170, 198, 36, 0.5)',
        '0 0 16px rgba(170, 198, 36, 0.8)',
        '0 0 8px rgba(170, 198, 36, 0.5)',
      ],
      transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
    },
  };

  const nodeVariants = {
    orbit: (i) => ({
      x: [Math.cos((i * 60) * (Math.PI / 180)) * 40, Math.cos(((i * 60) + 360) * (Math.PI / 180)) * 40],
      y: [Math.sin((i * 60) * (Math.PI / 180)) * 40, Math.sin(((i * 60) + 360) * (Math.PI / 180)) * 40],
      opacity: [0.7, 0.4, 0.7],
      transition: { duration: 2.5, repeat: Infinity, ease: 'linear' },
    }),
  };

  const ReviewAnimation = () => (
    <motion.div className="relative w-20 h-20 mx-auto">
      <motion.div
        className="absolute w-10 h-10 bg-yellowGreen rounded-full shadow-md"
        variants={coreVariants}
        animate="pulse"
      />
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-appleGreen rounded-full"
          style={{ top: '50%', left: '50%' }}
          variants={nodeVariants}
          animate="orbit"
          custom={i}
        />
      ))}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-appleGreen p-6 md:p-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-brown bg-clip-text">
            Content Review
          </h1>
          <p className="text-xs md:text-base text-brown/70 mt-2">
            Ensure your content is safe before posting with AI-powered risk analysis.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Content Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-appleGreen/10"
          >
            <h2 className="text-xl font-semibold text-brown mb-4">Content Details</h2>
            <div className="space-y-6">
              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1" htmlFor="platform">
                  Platform <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-brown/60 mb-2">{platformGuidance(platform)}</p>
                <select
                  id="platform"
                  {...register('platform', { required: 'Please select a platform' })}
                  className="w-full h-12 bg-white/70 border-2 border-appleGreen/20 rounded-xl text-brown px-4 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-300 hover:border-appleGreen/50"
                  aria-invalid={errors.platform ? 'true' : 'false'}
                >
                  <option value="">Select Platform</option>
                  {['YouTube', 'TikTok', 'Instagram', 'X', 'Facebook', 'Other'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.platform && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {errors.platform.message}
                  </p>
                )}
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1" htmlFor="contentType">
                  Content Type <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-brown/60 mb-2">Describe the type of content (e.g., Gaming, Lifestyle, Tweet).</p>
                <input
                  id="contentType"
                  type="text"
                  {...register('contentType', { required: 'Please enter the content type' })}
                  className="w-full h-12 bg-white/70 border-2 border-appleGreen/20 rounded-xl text-brown px-4 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-300 hover:border-appleGreen/50"
                  placeholder="e.g., Gaming, Lifestyle, Tweet"
                  aria-invalid={errors.contentType ? 'true' : 'false'}
                />
                {errors.contentType && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {errors.contentType.message}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1" htmlFor="title">
                  Title {platform === 'YouTube' || platform === 'TikTok' ? <span className="text-red-500">*</span> : '(Optional)'}
                </label>
                <p className="text-xs text-brown/60 mb-2">Recommended for YouTube/TikTok; optional for X, Instagram, or Facebook.</p>
                <input
                  id="title"
                  type="text"
                  {...register('title', {
                    required: platform === 'YouTube' || platform === 'TikTok' ? 'Please enter a title' : false,
                    maxLength: { value: 200, message: 'Title cannot exceed 200 characters' },
                  })}
                  className="w-full h-12 bg-white/70 border-2 border-appleGreen/20 rounded-xl text-brown px-4 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-300 hover:border-appleGreen/50"
                  placeholder="e.g., My Latest Video"
                  aria-invalid={errors.title ? 'true' : 'false'}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1" htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-brown/60 mb-2">Provide a description, tweet, or note about your content.</p>
                <textarea
                  id="description"
                  {...register('description', {
                    required: 'Please provide a description of your content',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters long',
                    },
                    maxLength: {
                      value: 1000,
                      message: 'Description cannot exceed 1000 characters',
                    },
                  })}
                  className="w-full h-24 bg-white/70 border-2 border-appleGreen/20 rounded-xl text-brown px-4 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-300 hover:border-appleGreen/50"
                  placeholder="e.g., My tweet about a new product launch"
                  aria-invalid={errors.description ? 'true' : 'false'}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Media Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-appleGreen/10"
          >
            <h2 className="text-xl font-semibold text-brown mb-4">Media Upload</h2>
            <label className="block text-sm font-medium text-brown mb-2">
              Upload an image or video (Optional)
            </label>
            <p className="text-xs text-brown/60 mb-4">JPG, PNG, or MP4 (max 5MB).</p>
            {!previewUrl ? (
              <label
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-appleGreen/40 rounded-xl cursor-pointer bg-white/30 hover:bg-yellowGreen/10 transition-all duration-300"
                htmlFor="mediaFiles"
              >
                <FaUpload className="text-brown text-4xl mb-3" />
                <p className="text-brown text-sm font-medium">Drop or click to upload</p>
                <p className="text-xs text-brown/50 mt-1">Image or Video (max 5MB)</p>
                <input
                  id="mediaFiles"
                  type="file"
                  accept="image/*,video/mp4"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload media file"
                />
              </label>
            ) : (
              <div className="relative max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-2 text-brown text-sm">
                  {fileType === 'image' ? <FaImage className="text-yellowGreen" /> : <FaVideo className="text-yellowGreen" />}
                  <span>{fileType === 'image' ? 'Image' : 'Video'}: {fileName}</span>
                </div>
                {fileType === 'image' ? (
                  <img
                    src={previewUrl}
                    alt="Image Preview"
                    className="w-full h-64 object-cover rounded-xl shadow-md cursor-pointer hover:opacity-90 transition-all duration-300 border-2 border-yellowGreen/20"
                    onClick={() => setShowImagePopup(true)}
                  />
                ) : (
                  <div className="w-full h-64 relative">
                    {showVideo ? (
                      <video
                        src={previewUrl}
                        controls
                        className="w-full h-full object-cover rounded-xl shadow-md border-2 border-appleGreen/20"
                        aria-label="Video preview"
                      />
                    ) : (
                      <motion.div
                        className="relative w-full h-full rounded-xl shadow-md overflow-hidden border-2 border-appleGreen/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={thumbnailUrl || previewUrl}
                          alt="Video Thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowVideo(true)}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-brown/80 rounded-full text-white hover:bg-brown transition-all duration-300"
                          aria-label="Play video"
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
                    setValue('mediaFiles', null);
                    setPreviewUrl(null);
                    setThumbnailUrl(null);
                    setShowVideo(false);
                    setFileName(null);
                    setFileType(null);
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-md"
                  aria-label="Remove media"
                >
                  <FaTimes size={16} />
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Sticky Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="sticky bottom-0 bg-white/80 backdrop-blur-md py-4 -mx-6 md:-mx-8 border-t border-appleGreen/20"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(170, 198, 36, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              animate={isValid ? { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 1.5 } } : {}}
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 mx-auto py-3 px-8 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
                loading || !isValid ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
              aria-label="Submit content for review"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <FaUpload className="animate-spin" />
                  Reviewing...
                </span>
              ) : (
                'Submit for Review'
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Loading Animation */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-8 flex flex-col items-center"
          >
            <ReviewAnimation />
            <p className="text-brown/60 text-sm mt-4">Analyzing content...</p>
          </motion.div>
        )}

        {/* Image Popup */}
        {showImagePopup && previewUrl && fileType === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowImagePopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative max-w-5xl w-full p-4 bg-white rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewUrl}
                alt="Close-up image preview"
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowImagePopup(false)}
                className="absolute top-0 right-0 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-md"
                aria-label="Close image preview"
              >
                <FaTimes size={16} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Review Result Popup */}
        <AnimatePresence>
          {showPopup && reviewResult && (
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
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.4 }}
                className="relative max-w-lg w-full bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-yellowGreen"
                onClick={(e) => e.stopPropagation()}
                aria-live="polite"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPopup(false)}
                  className="absolute top-3 right-3 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-md"
                  aria-label="Close result popup"
                >
                  <FaTimes size={16} />
                </motion.button>

                {reviewResult.error ? (
                  <div className="text-center">
                    <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-brown mb-2">Review Failed</h3>
                    <p className="text-red-500 text-sm">{reviewResult.error}</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">
                        {reviewResult.isSafe ? (
                          <FaCheckCircle className="text-green-500 text-5xl animate-pulse" />
                        ) : (
                          <FaExclamationTriangle className="text-red-500 text-5xl animate-pulse" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-brown">Review Complete!</h3>
                      <p className="text-brown/70 text-sm mt-2">
                        Status: <span className={reviewResult.isSafe ? 'text-green-500' : 'text-red-500'}>{reviewResult.isSafe ? 'Safe' : 'Unsafe'}</span>
                      </p>
                      <p className="text-brown/70 text-sm">Risk Level: <span className="font-medium">{reviewResult.riskLevel}</span></p>
                    </div>

                    <div className="space-y-4">
                      {/* Media Analysis Section */}
                      {reviewResult.mediaAnalysis && reviewResult.mediaAnalysis.type !== 'None' && (
                        <div>
                          <h4 className="text-sm font-medium text-brown flex items-center gap-2 mb-2">
                            <FaInfoCircle className="text-yellowGreen" /> Media Analysis
                          </h4>
                          <div className="space-y-2">
                            {reviewResult.mediaAnalysis.description && (
                              <p className="text-sm text-brown/80 bg-white/10 p-2 rounded-lg">
                                <span className="font-medium">Description:</span> {reviewResult.mediaAnalysis.description}
                              </p>
                            )}
                            {reviewResult.mediaAnalysis.analysisNotes && (
                              <p className="text-sm text-brown/80 bg-white/10 p-2 rounded-lg">
                                <span className="font-medium">Notes:</span> {reviewResult.mediaAnalysis.analysisNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Risks Section */}
                      {reviewResult.risks.length > 0 ? (
                        <div>
                          <h4 className="text-sm font-medium text-brown flex items-center gap-2 mb-2">
                            <FaInfoCircle className="text-yellowGreen" /> Potential Risks
                          </h4>
                          <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {reviewResult.risks.map((risk, index) => (
                              <li key={index} className="text-sm text-brown/80 flex items-start gap-2 bg-white/10 p-2 rounded-lg">
                                <span className="font-medium text-yellowGreen bg-yellowGreen/20 px-2 py-1 rounded">{risk.type}</span>
                                <span>({risk.probability}%): {risk.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-sm text-brown/80 bg-white/10 p-2 rounded-lg">No specific risks identified.</p>
                      )}

                      {/* Reasons Section */}
                      <div>
                        <h4 className="text-sm font-medium text-brown flex items-center gap-2 mb-2">
                          <FaInfoCircle className="text-yellowGreen" /> Reasons
                        </h4>
                        <p className="text-sm text-brown/80 bg-white/10 p-2 rounded-lg">
                          {reviewResult.reasons.length > 0 ? reviewResult.reasons.join('; ') : 'No additional reasons provided.'}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPopup(false)}
                      className="mt-6 w-full py-2 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                      aria-label="Close result popup"
                    >
                      Close
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ContentReviewing;