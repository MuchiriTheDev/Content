import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const VerificationNotification = () => {
    const [timer, setTimer] = useState(60); // 60 seconds countdown
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setIsButtonDisabled(false);
        }
    }, [timer]);

    const handleResendEmail = () => {
        // Logic to resend the email
        console.log('Resend email clicked');
        setTimer(60); // Reset the timer
        setIsButtonDisabled(true); // Disable the button again
    };

    const handleGoBack = () => {
        window.history.go(-1);
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-50 md:bg-gray-100 text-gray-800"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="bg-none md:bg-white shadow-none md:shadow-lg md:shadow-appleGreen max-w-2xl w-full rounded-lg p-6 md:p-8 text-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <FiMail className="text-appleGreen text-6xl mb-4" />
                <h1 className="text-2xl font-bold text-brown mb-4">Verify Your Email</h1>
                <p className="text-gray-600 text-sm mb-4">
                    An email has been sent to your registered email address. Please check your inbox and follow the instructions to verify your email.
                </p>
                <p className="text-gray-600 text-sm mb-6">
                    If you don't see the email, check your spam folder or click the button below to resend the verification email.
                </p>
                <motion.button
                    className={`bg-yellowGreen text-brown font-bold px-6 py-2 rounded-lg shadow-md ${
                        isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellowGreen'
                    }`}
                    whileHover={!isButtonDisabled ? { scale: 1.1 } : {}}
                    whileTap={!isButtonDisabled ? { scale: 0.9 } : {}}
                    onClick={handleResendEmail}
                    disabled={isButtonDisabled}
                >
                    {isButtonDisabled ? `Resend Email in ${timer}s` : 'Resend Email'}
                </motion.button>
                <div className="w-full  flex justify-center items-center mt-4">
                    <motion.button
                        className="flex font-medium items-center text-gray-800"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleGoBack}
                    >
                        <FiArrowLeft className="mr-2" />
                        Go Back
                    </motion.button>
                </div>
            </motion.div>
           
        </motion.div>
    );
};

export default VerificationNotification;