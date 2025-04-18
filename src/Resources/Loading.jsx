import React from 'react';

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-brown">
            <div className="relative flex items-center justify-center w-40 h-40">
                <div className="absolute w-full h-full border-4 border-t-transparent border-yellowGreen rounded-full animate-spin"></div>
                <div className="absolute w-36 h-36 border-4 border-t-transparent border-brown rounded-full animate-spin delay-150"></div>
                <div className="absolute w-32 h-32 border-4 border-t-transparent border-appleGreen rounded-full animate-spin delay-300"></div>
            </div>
            <p className="mt-4 text-2xl font-medium text-brown animate-pulse">
                Loading, please wait...
            </p>
        </div>
    );
};

export default Loading;
