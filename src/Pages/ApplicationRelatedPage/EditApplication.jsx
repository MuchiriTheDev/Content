// src/Pages/EditApplication.jsx
import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import { backendUrl } from '../../App';
import Loading from '../../Resources/Loading';
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import PlatformInformation from '../../Component/ApplicationComponents/PlatformInformation';
import FinancialInformation from '../../Component/ApplicationComponents/FinancialInformation';
import InsuranceDetails from '../../Component/ApplicationComponents/InsuranceDetails';

const steps = [
  { id: 1, name: 'Platform Information', enumName: 'PlatformInfo', component: PlatformInformation },
  { id: 2, name: 'Financial Information', enumName: 'FinancialInfo', component: FinancialInformation },
  { id: 3, name: 'Insurance Details', enumName: 'Submitted', component: InsuranceDetails },
];

const EditApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { loading, setLoading } = useContext(GeneralContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues, setValue, control, trigger } = useForm({
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

  // Fetch existing application data
  useEffect(() => {
    const fetchApplicationData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue.');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/insurance/my-insurance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const { insuranceStatus, platformInfo, financialInfo } = response.data.data;
          if (insuranceStatus.status !== 'Pending') {
            toast.error('You can only edit a pending application.');
            navigate('/dashboard');
            return;
          }

          // Populate form
          if (platformInfo?.platforms) {
            setValue('platformData', platformInfo.platforms.map((p) => ({
              name: p.name,
              username: p.username,
              accountLink: p.accountLink,
              audienceSize: p.audienceSize || 0,
              contentType: p.contentType || '',
              riskHistory: p.riskHistory.map((r) => ({
                violationType: r.violationType,
                date: r.date ? new Date(r.date).toISOString().split('T')[0] : '',
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
        }
      } catch (error) {
        toast.error('Failed to load application data.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationData();
  }, [navigate, setValue, setLoading]);

  const onSubmit = async (data) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setLoading(false);
      return;
    }

    // Validate final step
    const isValid = await trigger(['coveragePeriod', 'accurateInfo', 'termsAgreed']);
    if (!isValid || !data.accurateInfo || !data.termsAgreed || ![6, 12, 24].includes(Number(data.coveragePeriod))) {
      setLoading(false);
      toast.error('Please complete all required fields and agree to terms.');
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/insurance/edit`,
        {
          platformData: data.platformData,
          financialInfo: data.financialInfo,
          coveragePeriod: Number(data.coveragePeriod),
          accurateInfo: data.accurateInfo,
          termsAgreed: data.termsAgreed,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update application.';
      toast.error(errorMessage);
      if (errorMessage.includes('Unauthorized')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-white text-brown flex flex-col items-center justify-start py-10 px-4 md:px-10"
    >
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-3xl font-bold text-brown text-center">Edit Insurance Application</h2>
        <p className="text-lg text-yellowGreen mt-3 text-center">
          Update your pending insurance application details.
        </p>
      </div>

      <div className="w-full max-w-4xl mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id ? 'bg-appleGreen text-white' : 'bg-fadeBrown text-brown'
                  }`}
                  animate={{ scale: currentStep === step.id ? 1.2 : 1 }}
                >
                  {currentStep > step.id ? <FaCheckCircle size={20} /> : step.id}
                </motion.div>
                <p
                  className={`mt-2 text-xs font-semibold ${
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

      <motion.div
        key={currentStep}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-appleGreen p-6"
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
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg font-semibold text-brown"
            >
              <FaArrowLeft /> {currentStep === 1 ? 'Dashboard' : 'Back'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown"
            >
              {currentStep === steps.length ? 'Update Application' : 'Next'} <FaArrowRight />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditApplication;