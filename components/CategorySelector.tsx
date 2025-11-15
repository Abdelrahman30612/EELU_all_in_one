import React from 'react';

interface CategorySelectorProps {
  categories: { name: string, count: number }[];
  onSelectCategory: (category: string) => void;
  onBack: () => void;
  subject: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, onSelectCategory, onBack, subject }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-gray-200">
      <div className="text-center w-full max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-2">مادة: {subject}</h1>
        <p className="text-xl text-gray-300 mb-12">الرجاء اختيار التصنيف</p>
        
        {categories.length > 0 ? (
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {categories.map(({ name, count }) => (
              <button
                key={name}
                onClick={() => onSelectCategory(name)}
                className="bg-gray-800 text-gray-200 p-8 rounded-lg shadow-lg border-2 border-gray-700 hover:border-cyan-500 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50 flex flex-col justify-center items-center w-full sm:w-64 h-48"
              >
                <span className="text-3xl font-bold">{name}</span>
                <span className="mt-4 text-sm font-semibold px-3 py-1 bg-gray-600 rounded-full">{count} عنصر</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-lg text-yellow-400">لا توجد تصنيفات متاحة لهذه المادة.</p>
        )}
        
        <div className="mt-12">
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 text-sm text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto"
            aria-label="الرجوع لاختيار المادة"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>تغيير المادة</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;
