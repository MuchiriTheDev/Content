import React, { useState } from 'react';
import ClaimIncidentDetails from '../../Component/ClaimsComponents/ClaimsIncidentDetails';
import ClaimEvidenceUpload from '../../Component/ClaimsComponents/ClaimsEvidenceUpload';
import ClaimReviewAndSubmit from '../../Component/ClaimsComponents/ClaimReviewAndSubmit';

const ClaimProcess = () => {
  const [step, setStep] = useState(1); // Track the current step
  const [formData, setFormData] = useState({}); // Store form data across steps

  const handleNext = (data) => {
    setFormData({ ...formData, ...data }); // Merge new data with existing data
    setStep(step + 1); // Move to the next step
  };

  const handleBack = () => {
    setStep(step - 1); // Move to the previous step
  };

  const handleSubmit = (finalData) => {
    console.log('Final Submission Data:', finalData);
    // Add your submission logic here (e.g., API call)
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {step === 1 && (
        <ClaimIncidentDetails onNext={handleNext} />
      )}
      {step === 2 && (
        <ClaimEvidenceUpload
          onNext={handleNext}
          onBack={handleBack}
          formData={formData}
        />
      )}
      {step === 3 && (
        <ClaimReviewAndSubmit
          onBack={handleBack}
          onSubmit={handleSubmit}
          formData={formData}
        />
      )}
    </div>
  );
};

export default ClaimProcess;