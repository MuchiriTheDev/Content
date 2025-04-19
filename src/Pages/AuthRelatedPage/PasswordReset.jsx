import React, { useContext, useState } from 'react';
import { GeneralContext } from '../../Context/GeneralContext';
import toast from 'react-hot-toast';
import { backendUrl } from '../../App';
import axios from 'axios';
import Loading from '../../Resources/Loading';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams

const PasswordReset = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { loading, setLoading } = useContext(GeneralContext);
    const navigate = useNavigate();
    const { token } = useParams(); // Extract token from URL params

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!password || !confirmPassword) {
            toast.info('Please fill in both password fields!');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/auth/reset-password/${token}`, { password }); // Include token in the request
            if (response.data.success) {
                toast.success('Password reset successfully!');
                console.log('Password reset:', response.data);
                navigate('/login');
            } else {
                toast.error('Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error?.response?.data?.error || 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-beige flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
                <h2 className="text-3xl font-extrabold text-yellowGreen mb-8 text-center">
                    Reset Your Password
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter your new password below to reset your account password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-appleGreen mb-2"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 
                                                 text-gray-800 placeholder-gray-400 focus:outline-none 
                                                 focus:ring-2 focus:ring-yellowGreen focus:border-yellowGreen"
                            placeholder="Enter your new password"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-appleGreen mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 
                                                 text-gray-800 placeholder-gray-400 focus:outline-none 
                                                 focus:ring-2 focus:ring-yellowGreen focus:border-yellowGreen"
                            placeholder="Confirm your new password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-yellowGreen text-white rounded-lg 
                                             font-semibold hover:bg-appleGreen transition-colors duration-300
                                             focus:outline-none focus:ring-2 focus:ring-appleGreen"
                    >
                        Reset Password
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

export default PasswordReset;