import React, { useState } from 'react';

const ResetEmail = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your reset email logic here
        console.log('Reset email for:', email);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-beige flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
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