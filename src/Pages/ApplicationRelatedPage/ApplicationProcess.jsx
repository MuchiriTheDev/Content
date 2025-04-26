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
import PlatformInformation from '../../Component/ApplicationComponents/PlatformInformation';
import FinancialInformation from '../../Component/ApplicationComponents/FinancialInformation';
import InsuranceDetails from '../../Component/ApplicationComponents/InsuranceDetails';

const steps = [
  { id: 1, name: 'Platform Information', component: PlatformInformation },
  { id: 2, name: 'Financial Information', component: FinancialInformation },
  { id: 3, name: 'Insurance Details', component: InsuranceDetails },
];

const ApplicationProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { loading, setLoading, profile } = useContext(GeneralContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues, setValue, control } = useForm({
    defaultValues: {
      platformData: [],
      financialInfo: {
        monthlyEarnings: 0,
        currency: 'Ksh',
        paymentMethod: { type: 'Mpesa', details: {} },
      },
      coveragePeriod: '',
      accurateInfo: false,
      termsAgreed: false,
    },
  });

  // Fetch existing insurance data on mount
  useEffect(() => {
    const fetchInsuranceData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue.');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/insurance/my-insurance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const { insuranceStatus, premium, applicationProgress, platformInfo, financialInfo } = response.data.data;
          // Pre-populate form if application exists
          if (platformInfo?.platforms) {
            setValue('platformData', platformInfo.platforms.map(p => ({
              name: p.name,
              username: p.username,
              accountLink: p.accountLink,
              audienceSize: p.audienceSize || 0,
              contentType: p.contentType || '',
              riskHistory: p.riskHistory.map(r => ({
                violationType: r.violationType, // Updated to violationType
                date: r.date ? new Date(r.date).toISOString().split('T')[0] : '', // Convert to date input format
                description: r.description || '',
              })) || [],
            })));
          }
          if (financialInfo) {
            setValue('financialInfo', {
              monthlyEarnings: financialInfo.monthlyEarnings || 0,
              currency: financialInfo.currency || 'Ksh',
              paymentMethod: financialInfo.paymentMethod || { type: 'Mpesa', details: {} },
            });
          }
          if (insuranceStatus?.coveragePeriod) {
            setValue('coveragePeriod', String(insuranceStatus.coveragePeriod));
          }
          if (insuranceStatus?.termsAndAccuracy) {
            setValue('accurateInfo', insuranceStatus.termsAndAccuracy.hasProvidedAccurateInfo);
            setValue('termsAgreed', insuranceStatus.termsAndAccuracy.hasAgreedToTerms);
          }
          // Set current step based on application progress
          const stepMap = {
            PlatformInfo: 1,
            FinancialInfo: 2,
            Submitted: 3,
            Completed: 3,
          };
          setCurrentStep(stepMap[applicationProgress?.step] || 1);
          if (insuranceStatus?.status === 'Pending' || insuranceStatus?.status === 'Approved') {
            toast.info('You have an existing application. Review or update your details.');
          }
        }
      } catch (error) {
        console.error('Fetch insurance data error:', error.response?.data || error.message);
        if (error.response?.data?.error?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          toast.error('Session expired. Please log in again.');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInsuranceData();
  }, [navigate, setValue, setLoading]);

  // Save progress to backend
  const saveProgress = async (data, step) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/insurance/apply`,
        {
          platformData: data.platformData, // Includes riskHistory with violationType
          financialInfo: data.financialInfo,
          coveragePeriod: Number(data.coveragePeriod) || undefined,
          accurateInfo: data.accurateInfo,
          termsAgreed: data.termsAgreed,
          saveProgress: step,
          submit: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  // Submit application
  const submitApplication = async (data) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/insurance/apply`,
        {
          platformData: data.platformData, // Includes riskHistory with violationType
          financialInfo: data.financialInfo,
          coveragePeriod: Number(data.coveragePeriod),
          accurateInfo: data.accurateInfo,
          termsAgreed: data.termsAgreed,
          saveProgress: 'Submitted',
          submit: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success('Application submitted successfully! Await our team’s review.');
        setCurrentStep(1);
        setValue('platformData', []);
        setValue('financialInfo', {
          monthlyEarnings: 0,
          currency: 'Ksh',
          paymentMethod: { type: 'Mpesa', details: {} },
        });
        setValue('coveragePeriod', '');
        setValue('accurateInfo', false);
        setValue('termsAgreed', false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Submit application error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to submit application.';
      toast.error(errorMessage);
      if (errorMessage.includes('invalid signature') || errorMessage.includes('Unauthorized')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for each step
  const onSubmit = async (data) => {
    if (currentStep < steps.length) {
      await saveProgress(data, steps[currentStep - 1].name);
      setCurrentStep(currentStep + 1);
    } else {
      await submitApplication(data);
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
          Insurance Application
        </h2>
        <p className="text-lg text-yellowGreen mt-3 text-center">
          Complete the steps to apply for Content Creators Insurance.
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
              {currentStep === steps.length ? 'Submit' : 'Next'} <FaArrowRight />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ApplicationProcess;