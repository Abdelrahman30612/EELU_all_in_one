import React from 'react';

interface LevelSelectorProps {
  levels: string[];
  onSelectLevel: (level: string) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ levels, onSelectLevel }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-gray-200">
      <div className="text-center max-w-2xl mx-auto w-full">
        <h1 className="text-6xl sm:text-8xl font-bold text-cyan-400 mb-2 tracking-wider">EELU</h1>
        <p className="text-2xl sm:text-3xl text-gray-300 mb-4">All in one</p>
        <p className="text-lg text-gray-400 mb-8">الرجاء اختيار المستوى الدراسي للبدء</p>
        
        <div className="mb-12 flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto">
          <a
            href="https://sis.eelu.edu.eg/static/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-lg"
          >
            SIS
          </a>
          <a
            href="https://www.eelu.edu.eg/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-lg"
          >
            EELU
          </a>
        </div>
        
        {levels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => onSelectLevel(level)}
                className="bg-gray-800 text-gray-200 text-2xl font-bold py-10 px-6 rounded-lg shadow-lg border-2 border-gray-700 hover:border-cyan-500 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
              >
                {level}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-lg text-yellow-400">لا توجد مستويات متاحة. يرجى التأكد من إعداد ملف Google Sheet بشكل صحيح.</p>
        )}
      </div>
    </div>
  );
};

export default LevelSelector;