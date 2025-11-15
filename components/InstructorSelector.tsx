import React from 'react';

interface InstructorSelectorProps {
  instructors: { name: string, count: number }[];
  onSelectInstructor: (instructor: string) => void;
  onBack: () => void;
  subject: string;
}

const InstructorSelector: React.FC<InstructorSelectorProps> = ({ instructors, onSelectInstructor, onBack, subject }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-gray-200">
      <div className="text-center w-full max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-2">مادة: {subject}</h1>
        <p className="text-xl text-gray-300 mb-12">الرجاء اختيار المحاضر</p>
        
        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map(({ name, count }) => (
              <button
                key={name}
                onClick={() => onSelectInstructor(name)}
                className="bg-gray-800 text-gray-200 p-6 rounded-lg shadow-lg border-2 border-gray-700 hover:border-cyan-500 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50 flex flex-col justify-between items-center h-40"
              >
                <span className="text-2xl font-bold text-center">{name}</span>
                <span className="text-sm font-semibold px-3 py-1 bg-gray-600 rounded-full">{count} محاضرة</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-lg text-yellow-400">لا يوجد محاضرون متاحون لهذه المادة.</p>
        )}
        
        <div className="mt-12">
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 text-sm text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto"
            aria-label="الرجوع لاختيار التصنيف"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>تغيير التصنيف</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorSelector;
