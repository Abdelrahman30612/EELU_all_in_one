import React from 'react';

interface TabsProps {
  subjects: string[];
  activeSubject: string | null;
  onTabClick: (subject: string) => void;
  lectureCounts: Map<string, number>;
}

const Tabs: React.FC<TabsProps> = ({ subjects, activeSubject, onTabClick, lectureCounts }) => {
  return (
    <div className="flex justify-center flex-wrap gap-2 sm:gap-3 p-2 rounded-lg bg-gray-800/50">
      {subjects.map(subject => (
        <button
          key={subject}
          onClick={() => onTabClick(subject)}
          className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 flex items-center gap-2
            ${
              activeSubject === subject
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
        >
          {subject}
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
            activeSubject === subject ? 'bg-white/20 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            {lectureCounts.get(subject) || 0}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;