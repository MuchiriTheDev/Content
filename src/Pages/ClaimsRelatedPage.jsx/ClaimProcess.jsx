import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import { backendUrl } from '../../App';
import Loading from '../../Resources/Loading';
import ClaimIncidentDetails from '../../Component/ClaimsComponents/ClaimsIncidentDetails';
import ClaimEvidenceUpload from '../../Component/ClaimsComponents/ClaimsEvidenceUpload';
import ClaimReviewAndSubmit from '../../Component/ClaimsComponents/ClaimReviewAndSubmit';


// Constants
const STEPS = [
  { id: 1, name: 'Incident Details', enumName: 'IncidentDetails', component: ClaimIncidentDetails },
  { id: 2, name: 'Evidence Upload', enumName: 'EvidenceUpload', component: ClaimEvidenceUpload },
  { id: 3, name: 'Review & Submit', enumName: 'Submitted', component: ClaimReviewAndSubmit },
];

const ClaimProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [insuredPlatforms, setInsuredPlatforms] = useState([]);
  const { loading, setLoading } = useContext(GeneralContext);
  const navigate = useNavigate();

  // Form setup with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    control,
    trigger,
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      incidentDetails: {
        platform: '',
        incidentType: '',
        incidentDate: '',
        incidentDescription: '',
        reportedEarningsLoss: '',
        currency: 'KES',
        platformNotification: '',
      },
      evidence: {
        files: [], // Array of { file, type, description }
        affectedContent: [], // Array of { url, description, mediaType }
        evidenceSummary: '',
        additionalNotes: '',
      },
      termsAgreed: false,
    },
  });

  // Fetch user data and existing claims on mount
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
        // Fetch user platforms
        const userResponse = await axios.get(`${backendUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userResponse.data.success) {
          const platforms = userResponse.data.user.platformInfo.platforms || [];
          setInsuredPlatforms(platforms);
          if (platforms.length === 0) {
            toast.error('No insured platforms found. Please add platforms in your profile.');
            navigate('/profile');
          }
        } else {
          throw new Error(userResponse.data.error || 'Failed to fetch user data');
        }

        // Check for existing claims
        const claimsResponse = await axios.get(`${backendUrl}/claims/my-claims`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (claimsResponse.data.success) {
          const pendingOrApproved = claimsResponse.data.claims.some(claim =>
            ['Submitted', 'Under Review', 'AI Reviewed', 'Manual Review', 'Approved'].includes(
              claim.statusHistory.history[claim.statusHistory.history.length - 1].status
            )
          );
          if (pendingOrApproved) {
            toast.error('You have a pending or approved claim. View status in dashboard.');
            navigate('/dashboard');
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

  // Save progress to backend (optional for partial saves)
  const saveProgress = async (data, stepEnum) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('incidentDetails', JSON.stringify(data.incidentDetails));
      formData.append('evidence', JSON.stringify({
        affectedContent: data.evidence.affectedContent,
        evidenceSummary: data.evidence.evidenceSummary,
        additionalNotes: data.evidence.additionalNotes,
      }));

      // Append files with types and descriptions
      data.evidence.files.forEach((fileObj, index) => {
        if (fileObj.file instanceof File) {
          formData.append('evidenceFiles', fileObj.file);
          formData.append(`fileType_${index}`, fileObj.type);
          formData.append(`fileDescription_${index}`, fileObj.description || '');
        }
      });

      formData.append('saveProgress', stepEnum);
      formData.append('submit', false);

      const response = await axios.post(`${backendUrl}/claims/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message || 'Progress saved successfully!');
    } catch (error) {
      console.error('Save progress error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to save progress.';
      toast.error(errorMessage);
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('invalid signature')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit claim to backend
  const submitClaim = async (data) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('platform', data.incidentDetails.platform);
      formData.append('incidentType', data.incidentDetails.incidentType);
      formData.append('incidentDate', data.incidentDetails.incidentDate);
      formData.append('incidentDescription', data.incidentDetails.incidentDescription);
      formData.append('reportedEarningsLoss', data.incidentDetails.reportedEarningsLoss);
      formData.append('currency', data.incidentDetails.currency);
      formData.append('platformNotification', data.incidentDetails.platformNotification);
      formData.append('evidenceSummary', data.evidence.evidenceSummary);
      formData.append('additionalNotes', data.evidence.additionalNotes || '');
      formData.append('affectedContent', JSON.stringify(data.evidence.affectedContent));
      formData.append('termsAgreed', data.termsAgreed);

      // Append files with types and descriptions
      data.evidence.files.forEach((fileObj, index) => {
        if (fileObj.file instanceof File) {
          formData.append('evidenceFiles', fileObj.file);
          formData.append(`fileType_${index}`, fileObj.type);
          formData.append(`fileDescription_${index}`, fileObj.description || '');
        }
      });

      const response = await axios.post(`${backendUrl}/claims/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Claim submitted successfully! Check status in dashboard.');
      reset();
      setCurrentStep(1);
      navigate('/dashboard');
    } catch (error) {
      console.error('Submit claim error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to submit claim.';
      toast.error(errorMessage);
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('invalid signature')) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (errorMessage.includes('pending or approved claim')) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (currentStep < STEPS.length) {
      // Validate current step
      const fieldsToValidate =
        currentStep === 1
          ? [
              'incidentDetails.platform',
              'incidentDetails.incidentType',
              'incidentDetails.incidentDate',
              'incidentDetails.incidentDescription',
              'incidentDetails.reportedEarningsLoss',
              'incidentDetails.platformNotification',
            ]
          : [
              'evidence.files',
              'evidence.evidenceSummary',
            ];
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        toast.error('Please complete all required fields.');
        return;
      }
      await saveProgress(data, STEPS[currentStep - 1].enumName);
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      const isValid = await trigger(['termsAgreed', 'evidence.files', 'evidence.evidenceSummary']);
      if (!isValid || !data.termsAgreed) {
        toast.error('Please agree to the terms and ensure all required evidence is provided.');
        return;
      }

      if (!data.evidence.files.some(file => ['Screenshot', 'Email', 'Notification'].includes(file.type))) {
        toast.error('At least one evidence file must be a Screenshot, Email, or Notification.');
        return;
      }

      if (!window.confirm('Are you sure you want to submit your claim? Ensure all details are accurate.')) {
        return;
      }

      await submitClaim(data);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      if (window.confirm('Return to dashboard? Unsaved changes may be lost.')) {
        navigate('/dashboard');
      }
    }
  };

  // Render current step component
  const CurrentStepComponent = STEPS[currentStep - 1].component;

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-gray-50 text-brown flex flex-col items-center justify-start py-10 px-4 md:px-10"
      role="main"
      aria-label="Claim Submission Process"
    >
      {/* Header */}
      <div className="w-full max-w-5xl mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brown">Submit a Claim</h2>
        <p className="text-lg text-yellowGreen mt-3">
          Provide details and evidence to process your insurance claim efficiently.
        </p>
      </div>

      {/* Progress Indicator */}
      <nav className="w-full max-w-5xl mb-12" aria-label="Progress Steps">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.id ? 'bg-appleGreen text-white' : 'bg-gray-200 text-brown'
                  } z-10`}
                  animate={{ scale: currentStep === step.id ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                  aria-current={currentStep === step.id ? 'step' : undefined}
                  aria-label={`Step ${step.id}: ${step.name}`}
                >
                  {currentStep > step.id ? (
                    <FaCheckCircle size={20} aria-hidden="true" />
                  ) : (
                    <span className="text-lg font-bold">{step.id}</span>
                  )}
                </motion.div>
                <p
                  className={`mt-2 text-xs md:text-sm font-semibold text-center ${
                    currentStep >= step.id ? 'text-brown' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-1 mx-2">
                  <div
                    className={`w-full h-full ${
                      currentStep > step.id ? 'bg-appleGreen' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>

      {/* Form */}
      <motion.div
        key={currentStep}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-appleGreen/10 p-6 md:p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <CurrentStepComponent
            register={register}
            errors={errors}
            getValues={getValues}
            setValue={setValue}
            control={control}
            onBack={handleBack}
            insuredPlatforms={insuredPlatforms} // Pass insured platforms
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg font-semibold text-brown shadow-md hover:shadow-lg transition-all duration-300"
              aria-label={currentStep === 1 ? 'Return to Dashboard' : 'Go to Previous Step'}
            >
              <FaArrowLeft aria-hidden="true" />
              {currentStep === 1 ? 'Dashboard' : 'Back'}
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
              aria-label={currentStep === STEPS.length ? 'Submit Claim' : 'Go to Next Step'}
            >
              {isSubmitting ? (
                'Processing...'
              ) : currentStep === STEPS.length ? (
                'Submit Claim'
              ) : (
                'Next'
              )}
              <FaArrowRight aria-hidden="true" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ClaimProcess;