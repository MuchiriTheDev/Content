import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaArrowRight, FaExclamationCircle, FaInfoCircle, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import { backendUrl } from '../../App';
import Loading from '../../Resources/Loading';

// Single-step ClaimProcess (CCI: 4 fields + optional evidence in one view)
const ClaimProcess = () => {
  const [filePreviews, setFilePreviews] = useState([]); // For optional evidence preview
  const { loading, setLoading } = useContext(GeneralContext);
  const navigate = useNavigate();

  // Form setup (CCI: 4 core fields + optional evidence)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      incidentType: '',
      incidentDate: '',
      youTubeEmail: '',
      appealStatus: '',
      evidenceSummary: '', // Optional
      evidenceFiles: [], // Handled via state
    },
  });

  // Fetch user data and check active policy/pending claims on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue.');
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        // Fetch user for policy check
        const userResponse = await axios.get(`${backendUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userResponse.data.success) {
          const user = userResponse.data.user;
          // Check active policy (CCI requirement)
          if (user.insuranceStatus.status !== 'Approved' || new Date() > user.insuranceStatus.policyEndDate) {
            toast.error('No active insurance policy. Renew in dashboard.');
            // navigate('/dashboard');
            return;
          }
        } else {
          throw new Error(userResponse.data.error || 'Failed to fetch user data');
        }

        // Check for existing pending claims
        const claimsResponse = await axios.get(`${backendUrl}/claims/my-claims`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (claimsResponse.data.success) {
          const pendingClaims = claimsResponse.data.claims.filter(claim =>
            ['Submitted', 'Under Review', 'AI Reviewed', 'Manual Review', 'Approved'].includes(
              claim.statusHistory.history[claim.statusHistory.history.length - 1]?.status
            )
          );
          if (pendingClaims.length > 0) {
            toast.error('You have pending claims. View status in dashboard.');
            // navigate('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Fetch data error:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.error || 'Failed to fetch data.';
        toast.error(errorMessage);
        if (errorMessage.includes('Unauthorized') || errorMessage.includes('invalid signature')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, setLoading]);

  // Handle optional file uploads/previews
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: 'Notification', // Default; user can adjust
      description: '',
    }));
    setFilePreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove file preview
  const removeFile = (index) => {
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Submit claim to backend (CCI: Direct with 4 fields + optional evidence)
  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    // Validate core fields
    const isValid = await trigger(['incidentType', 'incidentDate', 'appealStatus']);
    if (!isValid) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (!window.confirm('Are you sure? Claim will auto-process (7-10 days).')) {
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      // Core 4 fields
      formData.append('incidentType', data.incidentType);
      formData.append('incidentDate', data.incidentDate);
      formData.append('youTubeEmail', data.youTubeEmail || '');
      formData.append('appealStatus', data.appealStatus);
      // Optional evidence summary
      formData.append('evidenceSummary', data.evidenceSummary || '');

      // Append optional files
      filePreviews.forEach((fileObj, index) => {
        formData.append('evidenceFiles', fileObj.file);
        formData.append(`fileType_${index}`, fileObj.type || 'Notification');
        formData.append(`fileDescription_${index}`, fileObj.description || '');
      });

      const response = await axios.post(`${backendUrl}/claims/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const { status, payout, fraudScore, message } = response.data;
      toast.success(`${message} Status: ${status}. Payout: KSh ${payout || 0}`);
      if (status === 'Paid' || status === 'Approved') {
        toast.success(`Payout: KSh ${payout} in 7 days!`);
      } else if (status === 'Rejected') {
        toast.error(`Rejected: ${message}. Appeal if eligible.`);
      } else if (status === 'Under Review') {
        toast.info('Under review—expect update in 24h.');
      }

      reset();
      setFilePreviews([]);
      navigate('/dashboard');
    } catch (error) {
      console.error('Submit claim error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to submit claim.';
      toast.error(errorMessage);
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('invalid signature')) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (errorMessage.includes('No active policy')) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle back to dashboard
  const handleBack = () => {
    if (window.confirm('Return to dashboard?')) {
      navigate('/dashboard');
    }
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-gray-50 text-brown flex flex-col items-center justify-start py-10 px-4 md:px-10"
      role="main"
      aria-label="Claim Submission"
    >
      {/* Header */}
      <div className="w-full max-w-5xl mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brown">Submit a Claim</h2>
        <p className="text-lg text-yellowGreen mt-3">
          Enter details for YouTube income protection. Auto-verified & paid in 7-10 days (70% of avg daily earnings).
        </p>
      </div>

      {/* Single Form Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-appleGreen/10 p-6 md:p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Incident Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Incident Type <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">Select the type of YouTube issue.</p>
            <select
              {...register('incidentType', { required: 'Please select an incident type' })}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              aria-label="Select incident type"
            >
              <option value="">Select Incident Type</option>
              <option value="Full suspension">Full suspension</option>
              <option value="Limited ads">Limited ads</option>
              <option value="Video demonetization">Video demonetization</option>
            </select>
            {errors.incidentType && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle aria-hidden="true" />
                {errors.incidentType.message}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" aria-hidden="true" />
              Covers platform risks like demonetization (yellow icon) or temp suspension.
            </p>
          </div>

          {/* Incident Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Incident Date <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">When did the issue start?</p>
            <input
              type="date"
              {...register('incidentDate', {
                required: 'Please enter the incident date',
                validate: value => new Date(value) <= new Date() || 'Date cannot be in the future',
              })}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              aria-label="Incident date"
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.incidentDate && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle aria-hidden="true" />
                {errors.incidentDate.message}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" aria-hidden="true" />
              Used for revenue drop calculation (≥70% vs prior 7 days).
            </p>
          </div>

          {/* Appeal Status */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Appeal Status <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">Status of your YouTube appeal.</p>
            <select
              {...register('appealStatus', { required: 'Please select appeal status' })}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              aria-label="Select appeal status"
            >
              <option value="">Select Appeal Status</option>
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Rejected">Rejected</option>
            </select>
            {errors.appealStatus && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle aria-hidden="true" />
                {errors.appealStatus.message}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" aria-hidden="true" />
              Helps verify eligibility (e.g., rejected appeals may flag risks).
            </p>
          </div>

          {/* YouTube Email (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              YouTube Notification Email (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-1">Paste the email from YouTube (or upload as evidence).</p>
            <textarea
              {...register('youTubeEmail')}
              className="w-full h-20 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              placeholder="e.g., Your channel has been demonetized due to policy update..."
              aria-label="YouTube notification email (optional)"
            />
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" aria-hidden="true" />
              Optional—API pulls handle most verification.
            </p>
          </div>

          {/* Optional Evidence Upload */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Evidence Upload (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-1">Upload screenshots/emails (up to 5 files; API verifies most).</p>
            <div className="border-2 border-dashed border-appleGreen rounded-lg p-6 text-center hover:border-yellowGreen transition-colors">
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="evidenceFiles"
              />
              <label htmlFor="evidenceFiles" className="cursor-pointer flex flex-col items-center gap-2">
                <FaUpload className="text-3xl text-appleGreen" />
                <p className="text-brown font-medium">Click to upload files</p>
                <p className="text-xs text-gray-500">or drag and drop (max 5, 10MB each)</p>
              </label>
            </div>
            {filePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {filePreviews.map((preview, index) => (
                  <div key={index} className="relative border rounded-lg p-2 bg-gray-50">
                    {preview.file.type.startsWith('image/') ? (
                      <img src={preview.preview} alt="Preview" className="w-full h-20 object-cover rounded" />
                    ) : (
                      <div className="w-full h-20 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-sm text-gray-500">{preview.file.name}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mt-1 truncate">{preview.file.name}</p>
                    <select
                      value={preview.type}
                      onChange={(e) => {
                        const newPreviews = [...filePreviews];
                        newPreviews[index].type = e.target.value;
                        setFilePreviews(newPreviews);
                      }}
                      className="w-full mt-1 text-xs border rounded"
                    >
                      <option value="Screenshot">Screenshot</option>
                      <option value="Video">Video</option>
                      <option value="Document">Document</option>
                      <option value="Email">Email</option>
                      <option value="Notification">Notification</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={preview.description}
                      onChange={(e) => {
                        const newPreviews = [...filePreviews];
                        newPreviews[index].description = e.target.value;
                        setFilePreviews(newPreviews);
                      }}
                      className="w-full mt-1 px-2 py-1 text-xs border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                    >
                      <FaExclamationCircle size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <FaInfoCircle className="text-gray-400" aria-hidden="true" />
              Optional—helps if API pull misses details. At least one Screenshot/Email/Notification recommended.
            </p>
          </div>

          {/* Optional Evidence Summary */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Evidence Summary (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-1">Brief summary of evidence (100 chars max).</p>
            <textarea
              {...register('evidenceSummary', { maxLength: { value: 100, message: 'Max 100 characters' } })}
              className="w-full h-16 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 py-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              placeholder="e.g., Yellow icon on 3 videos due to July 2025 policy wave."
              aria-label="Evidence summary (optional)"
            />
            {errors.evidenceSummary && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle aria-hidden="true" />
                {errors.evidenceSummary.message}
              </p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg font-semibold text-brown shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Return to Dashboard"
            >
              <FaArrowLeft aria-hidden="true" />
              Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-300 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellowGreen to-appleGreen text-brown hover:shadow-yellowGreen/50'
              }`}
              aria-label="Submit Claim"
            >
              {isSubmitting ? 'Processing...' : 'Submit Claim'}
              <FaArrowRight aria-hidden="true" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ClaimProcess;