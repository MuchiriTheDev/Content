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
  const [accounts, setAccounts] = useState([]);
  const { loading, setLoading } = useContext(GeneralContext);
  const navigate = useNavigate();

  // Form setup with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    control,
    trigger,
  } = useForm({
    defaultValues: {
      incidentDetails: {
        platform: '',
        incidentType: '',
        incidentDate: '',
        description: '',
      },
      evidence: {
        accountScreenshot: null,
        emailScreenshot: null,
        emailMessage: '',
        additionalFiles: [],
        additionalUrls: [],
        additionalNotes: '',
      },
      termsAgreed: false,
    },
  });

  // Fallback accounts (for testing without API)
  const fallbackAccounts = [
    { name: 'YouTube', username: '@CreatorYT', accountLink: 'https://youtube.com/@CreatorYT' },
    { name: 'TikTok', username: '@CreatorTok', accountLink: 'https://tiktok.com/@CreatorTok' },
    { name: 'Instagram', username: '@CreatorInsta', accountLink: 'https://instagram.com/CreatorInsta' },
    { name: 'X', username: '@CreatorX', accountLink: 'https://x.com/CreatorX' },
    { name: 'Facebook', username: '@CreatorFB', accountLink: 'https://facebook.com/CreatorFB' },
    { name: 'Other', username: '@CreatorOther', accountLink: 'https://example.com/CreatorOther' },
  ];

  // Fetch user platforms and claim data on mount
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
        // Fetch platforms
        // TODO: Uncomment when API is ready
        // const platformResponse = await axios.get(`${backendUrl}/user/platforms`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // if (platformResponse.data.success) {
        //   setAccounts(platformResponse.data.data);
        // } else {
        //   throw new Error(platformResponse.data.error || 'Failed to fetch platforms');
        // }
        setAccounts(fallbackAccounts); // Use fallback for now

        // Fetch existing claim
        const claimResponse = await axios.get(`${backendUrl}/claims/my-claim`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (claimResponse.data.success) {
          const { claimStatus, claimProgress, incidentDetails, evidence } = claimResponse.data.data;

          // Block if pending or approved claim exists
          if (['Pending', 'Approved'].includes(claimStatus?.status)) {
            toast.error('You have a pending or approved claim. View status in dashboard.');
            navigate('/dashboard');
            return;
          }

          // Populate form
          if (incidentDetails) {
            setValue('incidentDetails', {
              platform: incidentDetails.platform || '',
              incidentType: incidentDetails.incidentType || '',
              incidentDate: incidentDetails.incidentDate
                ? new Date(incidentDetails.incidentDate).toISOString().split('T')[0]
                : '',
              description: incidentDetails.description || '',
            });
          }
          if (evidence) {
            setValue('evidence', {
              accountScreenshot: null, // Files are not restored (stored server-side)
              emailScreenshot: null,
              emailMessage: evidence.emailMessage || '',
              additionalFiles: [], // Files are not restored
              additionalUrls: evidence.additionalUrls || [],
              additionalNotes: evidence.additionalNotes || '',
            });
          }
          if (claimStatus?.termsAgreed) {
            setValue('termsAgreed', claimStatus.termsAgreed);
          }

          // Set step based on progress
          const stepMap = {
            IncidentDetails: 1,
            EvidenceUpload: 2,
            Submitted: 3,
          };
          setCurrentStep(stepMap[claimProgress?.step] || 1);
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
  }, [navigate, setValue, setLoading]);

  // Save progress to backend
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
      if (data.evidence.accountScreenshot instanceof File) {
        formData.append('accountScreenshot', data.evidence.accountScreenshot);
      }
      if (data.evidence.emailScreenshot instanceof File) {
        formData.append('emailScreenshot', data.evidence.emailScreenshot);
      }
      formData.append('emailMessage', data.evidence.emailMessage || '');
      data.evidence.additionalFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append('additionalFiles', file);
        }
      });
      formData.append('additionalUrls', JSON.stringify(data.evidence.additionalUrls || []));
      formData.append('additionalNotes', data.evidence.additionalNotes || '');
      formData.append('saveProgress', stepEnum);
      formData.append('submit', false);

      const response = await axios.post(`${backendUrl}/claims/save`, formData, {
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
      formData.append('incidentDetails', JSON.stringify(data.incidentDetails));
      if (data.evidence.accountScreenshot instanceof File) {
        formData.append('accountScreenshot', data.evidence.accountScreenshot);
      }
      if (data.evidence.emailScreenshot instanceof File) {
        formData.append('emailScreenshot', data.evidence.emailScreenshot);
      }
      formData.append('emailMessage', data.evidence.emailMessage || '');
      data.evidence.additionalFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append('additionalFiles', file);
        }
      });
      formData.append('additionalUrls', JSON.stringify(data.evidence.additionalUrls || []));
      formData.append('additionalNotes', data.evidence.additionalNotes || '');
      formData.append('termsAgreed', data.termsAgreed);
      formData.append('saveProgress', 'Submitted');
      formData.append('submit', true);

      const response = await axios.post(`${backendUrl}/claims/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Claim submitted successfully! Check status in dashboard.');
      setCurrentStep(1);
      setValue('incidentDetails', {
        platform: '',
        incidentType: '',
        incidentDate: '',
        description: '',
      });
      setValue('evidence', {
        accountScreenshot: null,
        emailScreenshot: null,
        emailMessage: '',
        additionalFiles: [],
        additionalUrls: [],
        additionalNotes: '',
      });
      setValue('termsAgreed', false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Submit claim error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to submit claim.';
      toast.error(errorMessage);
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('invalid signature')) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (errorMessage.includes('Claim already submitted')) {
        toast.error('You have already submitted a claim. Check status in dashboard.');
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
          ? ['incidentDetails.platform', 'incidentDetails.incidentType', 'incidentDetails.incidentDate', 'incidentDetails.description']
          : ['evidence.accountScreenshot'];
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        toast.error('Please complete all required fields.');
        return;
      }
      await saveProgress(data, STEPS[currentStep - 1].enumName);
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      const isValid = await trigger(['termsAgreed', 'evidence.accountScreenshot']);
      if (!isValid || !data.termsAgreed) {
        toast.error('Please agree to the terms and upload an account screenshot.');
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
      className="w-full min-h-screen bg-white text-brown flex flex-col items-center justify-start py-10 px-4 md:px-10"
      role="main"
      aria-label="Claim Submission Process"
    >
      {/* Header */}
      <div className="w-full max-w-4xl mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brown">Submit a Claim</h2>
        <p className="text-lg text-yellowGreen mt-3">
          Provide details and evidence to process your insurance claim.
        </p>
      </div>

      {/* Progress Indicator */}
      <nav className="w-full max-w-4xl mb-12" aria-label="Progress Steps">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.id ? 'bg-appleGreen text-white' : 'bg-fadeBrown text-brown'
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
                      currentStep > step.id ? 'bg-appleGreen' : 'bg-fadeBrown'
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
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-appleGreen/10 p-6 md:p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <CurrentStepComponent
            register={register}
            errors={errors}
            getValues={getValues}
            setValue={setValue}
            control={control}
            onBack={handleBack}
            accounts={accounts} // Pass accounts to components
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
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-md hover:shadow-yellowGreen/50 transition-all duration-300"
              aria-label={currentStep === STEPS.length ? 'Submit Claim' : 'Go to Next Step'}
            >
              {currentStep === STEPS.length ? 'Submit Claim' : 'Next'}
              <FaArrowRight aria-hidden="true" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ClaimProcess;