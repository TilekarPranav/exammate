import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-emerald-400 animate-spin"></div>
        {/* Inner pulse */}
        <div className="absolute inset-3 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
