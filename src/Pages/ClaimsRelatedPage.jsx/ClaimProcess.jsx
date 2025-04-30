import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import { backendUrl } from '../../App';
import Loading from '../../Resources/Loading';
import ClaimIncidentDetails from '../../Component/ClaimsComponents/ClaimsIncidentDetails';
import ClaimEvidenceUpload from '../../Component/ClaimsComponents/ClaimsEvidenceUpload';
import ClaimReviewAndSubmit from '../../Component/ClaimsComponents/ClaimReviewAndSubmit';
import { FaExclamationCircle } from 'react-icons/fa'; // Importing FaExclamationCircle for error messages
const steps = [
  { id: 1, name: 'Incident Details', enumName: 'IncidentDetails', component: ClaimIncidentDetails },
  { id: 2, name: 'Evidence Upload', enumName: 'EvidenceUpload', component: ClaimEvidenceUpload },
  { id: 3, name: 'Review & Submit', enumName: 'Submitted', component: ClaimReviewAndSubmit },
];

const ClaimProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { loading, setLoading } = useContext(GeneralContext);
  const navigate = useNavigate();
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
  // Fetch existing claim data on mount
  useEffect(() => {
    const fetchClaimData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue.');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/claims/my-claim`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const { claimStatus, claimProgress, incidentDetails, evidenceFiles } = response.data.data;

          // Check if user has a pending claim
          if (claimStatus?.status === 'Pending' || claimStatus?.status === 'Approved') {
            toast.error('You have a pending or approved claim. View status in dashboard.');
            navigate('/dashboard');
            return;
          }

          // Populate form data
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
          if (evidenceFiles) {
            setValue('evidenceFiles', evidenceFiles || []);
          }
          if (claimStatus?.termsAgreed) {
            setValue('termsAgreed', claimStatus.termsAgreed);
          }
          const stepMap = {
            IncidentDetails: 1,
            EvidenceUpload: 2,
            Submitted: 3,
          };
          setCurrentStep(stepMap[claimProgress?.step] || 1);
        }
      } catch (error) {
        console.error('Fetch claim data error:', error.response?.data || error.message);
        if (error.response?.data?.error?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          toast.error('Session expired. Please log in again.');
          navigate('/login');
        } else {
          toast.error('Failed to fetch claim data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClaimData();
  }, [navigate, setValue, setLoading]);

// Save progress to backend
const saveProgress = async (data, stepEnum) => {
  setLoading(true);
  const token = localStorage.getItem('token');
  if (!token) {
    setLoading(false);
    toast.error('Session expired. Please log in again.');
    navigate('/login');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('incidentDetails', JSON.stringify(data.incidentDetails));
    if (data.evidence.accountScreenshot instanceof File) {
      formData.append('accountScreenshot', data.evidence.accountScreenshot);
    }
    if (data.evidence.emailScreenshot instanceof File) {
      formData.append('emailScreenshot', data.evidence.emailScreenshot);
    }
    formData.append('emailMessage', data.evidence.emailMessage || '');
    data.evidence.additionalFiles.forEach((file, index) => {
      if (file instanceof File) {
        formData.append(`additionalFiles`, file);
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
    if (response.data.success) {
      toast.success(response.data.message);
    }
  } catch (error) {
    console.error('Save progress error:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.error || 'Failed to save progress.';
    toast.error(errorMessage);
    if (errorMessage.includes('invalid signature') || errorMessage.includes('Unauthorized')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  } finally {
    setLoading(false);
  }
};

// Submit claim
const submitClaim = async (data) => {
  setLoading(true);
  const token = localStorage.getItem('token');
  if (!token) {
    setLoading(false);
    toast.error('Session expired. Please log in again.');
    navigate('/login');
    return;
  }

  if (!data.incidentDetails.platform || !data.incidentDetails.incidentType) {
    setLoading(false);
    toast.error('Please provide all required incident details.');
    return;
  }
  if (!data.evidence.accountScreenshot) {
    setLoading(false);
    toast.error('Please upload a screenshot of your account status.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('incidentDetails', JSON.stringify(data.incidentDetails));
    if (data.evidence.accountScreenshot instanceof File) {
      formData.append('accountScreenshot', data.evidence.accountScreenshot);
    }
    if (data.evidence.emailScreenshot instanceof File) {
      formData.append('emailScreenshot', data.evidence.emailScreenshot);
    }
    formData.append('emailMessage', data.evidence.emailMessage || '');
    data.evidence.additionalFiles.forEach((file, index) => {
      if (file instanceof File) {
        formData.append(`additionalFiles`, file);
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
    if (response.data.success) {
      toast.success('Claim submitted successfully! Await our team’s review.');
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
    }
  } catch (error) {
    console.error('Submit claim error:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.error || 'Failed to submit claim.';
    toast.error(errorMessage);
    if (errorMessage.includes('invalid signature') || errorMessage.includes('Unauthorized')) {
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

  // Handle form submission for each step
  const onSubmit = async (data) => {
    if (currentStep < steps.length) {
      await saveProgress(data, steps[currentStep - 1].enumName);
      setCurrentStep(currentStep + 1);
    } else {
      const isValid = await trigger(['termsAgreed', 'evidence.accountScreenshot']);
      if (!isValid || !data.termsAgreed) {
        toast.error('Please agree to the terms and upload an account screenshot.');
        return;
      }
  
      const confirmSubmission = window.confirm(
        'Are you sure you want to submit your claim? Ensure all details are accurate.'
      );
      if (!confirmSubmission) {
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
      navigate('/dashboard');
    }
  };

  // Render the current step’s component
  const CurrentStepComponent = steps[currentStep - 1].component;

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-white text-brown flex flex-col items-center justify-start py-10 px-4 md:px-10 overflow-auto"
    >
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-brown text-center">
          Submit a Claim
        </h2>
        <p className="text-lg text-yellowGreen mt-3 text-center">
          Provide details and evidence to process your insurance claim.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="w-full max-w-4xl mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-appleGreen text-white'
                      : 'bg-fadeBrown text-brown'
                  } z-10`}
                  animate={{ scale: currentStep === step.id ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep > step.id ? (
                    <FaCheckCircle size={20} />
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
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2">
                  <div
                    className={`w-full h-full ${
                      currentStep > step.id ? 'bg-appleGreen' : 'bg-fadeBrown'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <motion.div
        key={currentStep}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-appleGreen p-6 md:p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CurrentStepComponent
            register={register}
            errors={errors}
            getValues={getValues}
            setValue={setValue}
            control={control}
            onBack={handleBack}
            formData={getValues()}
            onSubmit={onSubmit}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg font-semibold text-brown shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaArrowLeft /> {currentStep === 1 ? 'Dashboard' : 'Back'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-md hover:shadow-yellowGreen/50 transition-all duration-300"
            >
              {currentStep === steps.length ? 'Submit Claim' : 'Next'} <FaArrowRight />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ClaimProcess;