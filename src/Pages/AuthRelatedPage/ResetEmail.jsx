import React, { useContext, useState } from 'react';
import { GeneralContext } from '../../Context/GeneralContext';
import toast from 'react-hot-toast';
import { backendUrl } from '../../App';
import axios from 'axios';
import Loading from '../../Resources/Loading';
import { useNavigate } from 'react-router-dom';

const ResetEmail = () => {
    const [email, setEmail] = useState('');
    const { loading, setLoading } = useContext(GeneralContext)// Assuming you have a loading state in your context
    const navigate = useNavigate(); // Assuming you're using react-router-dom for navigation

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when form is submitted

        if (!email) {
            toast.info('Please enter your email address!');
            setLoading(false); // Reset loading state
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/auth/forgot-password`, { email });
            if (response.data.success) {
                toast.success('Reset email sent successfully! Please check your inbox.');
                console.log('Reset email sent:', response.data);
                navigate('/verify-email')
            } else {
                toast.error('Failed to send reset email. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error?.response?.data?.error || 'An error occurred. Please try again later.');
            
        } finally {
            setLoading(false); // Reset loading state after API call
        }
        // Add your reset email logic here
        console.log('Reset email for:', email);
    };

    if(loading) return <Loading/>; // Show loading spinner if loading is true
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-beige flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
                <h2 className="text-3xl font-extrabold text-yellowGreen mb-8 text-center">
                    Reset Your Password
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter your email address below, and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-appleGreen mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 
                                                 text-gray-800 placeholder-gray-400 focus:outline-none 
                                                 focus:ring-2 focus:ring-yellowGreen focus:border-yellowGreen"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-yellowGreen text-white rounded-lg 
                                             font-semibold hover:bg-appleGreen transition-colors duration-300
                                             focus:outline-none focus:ring-2 focus:ring-appleGreen"
                    >
                        Send Reset Link
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a
                        href="/login"
                        className="text-sm text-appleGreen hover:text-yellowGreen transition-colors duration-300"
                    >
                        Back to Login
                    </a>
                </div>
            </div>

            <style jsx>{`
                .bg-beige {
                    background-color: #f9f7f1;
                }
            `}</style>
        </div>
    );
};

export default ResetEmail;