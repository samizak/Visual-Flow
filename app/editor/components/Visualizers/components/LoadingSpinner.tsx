import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading visualization..." 
}) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      {message && (
        <div className="ml-4 text-gray-400">{message}</div>
      )}
    </div>
  );
};

export default LoadingSpinner;