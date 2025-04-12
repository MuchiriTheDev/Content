import React from 'react';
import Title from '../../Resources/Title';
import { Link } from 'react-router-dom';

const HowToApply = () => {
  return (
    <div id='how-to-apply' className="w-full min-h-screen bg-fadeBrown text-white overflow-hidden relative">
      {/* Futuristic Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern bg-blue-800 opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-yellow-700 opacity-5"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <Title 
            head={'How to Apply'} 
            subHead={'Your Gateway to Financial Ascension'} 
            headStyle="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-yellowGreen"
            subHeadStyle="text-xl text-silverGlow font-light tracking-wider"
          />

          {/* Steps Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 h-fit">
            {/* Step 1 */}
            <div className="group relative p-6 bg-white rounded-xl flex flex-col justify-center items-center shadow-lg hover:shadow-neon transition-all duration-300 border border-appleGreen/20 text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-neonPink opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
          <div className=' bg-yellowGreen text-white p-3 text-xl mb-2 flex justify-center items-center rounded-full font-bold'>01.</div>
          <h3 className="text-2xl font-bold text-brown mb-4">Create An Account</h3>
          <p className="text-gray-500 text-center text-sm leading-relaxed">
            Begin your journey by creating a secure account. This will serve as your personalized portal to manage your financial future.
          </p>
            </div>

            {/* Step 2 */}
            <div className="group relative p-6 bg-white rounded-xl flex flex-col justify-center items-center shadow-lg hover:shadow-neon transition-all duration-300 border border-appleGreen/20 text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-neonPink opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
          <div className=' bg-yellowGreen text-white p-3 text-xl mb-2 flex justify-center items-center rounded-full font-bold'>02.</div>
          <h3 className="text-2xl font-bold text-brown mb-4">Apply For Insurance</h3>
          <p className="text-gray-500 text-center text-sm leading-relaxed">
            Submit your application effortlessly through our intuitive platform and unlock tailored insurance solutions.
          </p>
            </div>

            {/* Step 3 */}
            <div className="group relative p-6 bg-white rounded-xl flex flex-col justify-center items-center shadow-lg hover:shadow-neon transition-all duration-300 border border-appleGreen/20 text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-neonPink opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
          <div className=' bg-yellowGreen text-white p-3 text-xl mb-2 flex justify-center items-center rounded-full font-bold'>03.</div>
          <h3 className="text-2xl font-bold text-brown mb-4">Pay Your First Premium</h3>
          <p className="text-gray-500 text-center text-sm leading-relaxed">
            Secure your coverage by completing your first premium payment and enjoy peace of mind knowing you're protected.
          </p>
            </div>
          </div>

          {/* Apply Now Button */}
        <div className="mt-16 text-center">
          <Link to='/application' className="relative px-10 py-4 bg-yellowGreen text-white font-semibold rounded-lg shadow-lg hover:shadow-neon transition-all duration-300 transform hover:scale-105">
            <span className="relative z-10">Apply Now</span>
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 rounded-full transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowToApply;