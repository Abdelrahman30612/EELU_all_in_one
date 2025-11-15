
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
};

export default LoadingSpinner;
