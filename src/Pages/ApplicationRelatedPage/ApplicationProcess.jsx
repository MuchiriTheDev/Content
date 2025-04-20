import PersonalDetails from '../../Component/ApplicationComponents/PersonalDetails'
import ContentAccountInformation from '../../Component/ApplicationComponents/ContentAccountInformation'
import InsuranceDetails from '../../Component/ApplicationComponents/InsuranceDetails'
import React, { useState } from 'react';


const ApplicationProcess = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleNext = (data) => {
      setFormData({ ...formData, ...data });
      setStep(step + 1);
    };

    const handleBack = () => {
      setStep(step - 1);
    };

    const handleSubmit = (data) => {
      console.log('Final Data:', { ...formData, ...data });
      // Submit the final data
    };

    return (
      <div>
        {step === 1 && <PersonalDetails onNext={handleNext} />}
        {step === 2 && (
          <ContentAccountInformation
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
          />
        )}
        {step === 3 && (
          <InsuranceDetails
            onSubmit={handleSubmit}
            onBack={handleBack}
            formData={formData}
          />
        )}
      </div>
    );
}

export default ApplicationProcess