import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { backendUrl } from '../../App';
import toast from 'react-hot-toast';
import Loading from '../../Resources/Loading';

const EmailVerify = () => {
    const { token } = useParams(); // Extract token from URL parameters
    const [status, setStatus] = useState('loading'); // Tracks the verification status: 'loading', 'success', or 'error'
    const [errorMessage, setErrorMessage] = useState(''); // Stores detailed error messages if verification fails
    const navigate = useNavigate();
    const hasVerified = useRef(false); // Ref to track if verification has already been triggered

    useEffect(() => {
        // Function to verify the email using the token
        const verifyEmail = async () => {
            try {
                // Make a GET request to the backend to verify the email
                const response = await axios.get(`${backendUrl}/auth/verify/${token}`);
                
                // Check if the response indicates success
                if (response.data.success) {
                    setStatus('success');
                    toast.success('Your email has been successfully verified!');
                    setTimeout(() => {
                        navigate('/login');
                    }, 30000);
                } else {
                    setStatus('error');
                    setErrorMessage(response.data.message || 'Verification failed due to an unknown error.');
                    console.error('Verification failed:', response.data.message);
                }
            } catch (error) {
                // Handle errors during the verification process
                setStatus('error');
                setErrorMessage(
                    error?.response?.data?.error || 
                    'An error occurred while verifying your email. Please try again later.'
                );
                console.error('Error during email verification:', error);
                toast.error(
                    error?.response?.data?.error || 
                    'An error occurred while verifying your email. Please try again later.'
                );
            }
        };

        // Trigger email verification if a token is present and hasn't been verified yet
        if (token && !hasVerified.current) {
            hasVerified.current = true; // Mark as verified to prevent multiple calls
            verifyEmail();
        } else if (!token) {
            setStatus('error');
            setErrorMessage('No token provided for email verification.');
            console.error('No token provided for email verification.');
        }
    }, [token, navigate]);

    if (status === 'loading') return <Loading />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">

            {/* Show success message if the email verification is successful */}
            {status === 'success' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center max-w-xl w-full mx-auto p-8 bg-none md:bg-white shadow-none md:shadow-lg rounded-lg mt-10"
                >
                    <FaCheckCircle className="text-6xl text-yellowGreen mb-4" />
                    <h1 className="text-2xl font-bold text-appleGreen">Email Verified!</h1>
                    <p className="text-gray-600 mt-5">
                        Your email has been successfully verified. You can now proceed to login.
                    </p>
                    <button
                        onClick={() => (window.location.href = '/login')}
                        className="mt-6 px-6 py-2 bg-appleGreen text-white rounded-lg shadow hover:bg-yellowGreen"
                    >
                        Go to Login
                    </button>
                </motion.div>
            )}

            {/* Show error message if the email verification fails */}
            {status === 'error' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center max-w-xl w-full mx-auto p-8 bg-none md:bg-white shadow-none md:shadow-lg rounded-lg mt-10"
                >
                    <FaExclamationCircle className="text-6xl text-brown mb-4" />
                    <h1 className="text-2xl font-bold text-brown">Verification Failed</h1>
                    <p className="text-gray-600 mt-5">
                        {'We encountered an issue while verifying your email. This could be due to an invalid or expired token. Please try again or contact support if the issue persists.'}
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-brown text-white rounded-lg shadow hover:bg-yellowGreen"
                        >
                            Verify Again
                        </button>
                        <button
                            onClick={() => (window.location.href = '/login')}
                            className="ml-2 px-6 py-2 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-50"
                        >
                            Go to Login
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default EmailVerify;