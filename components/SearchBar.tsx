import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange, placeholder }) => {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder || "ابحث عن محاضرة..."}
          className="w-full py-2.5 pr-10 pl-4 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
          aria-label="Search lectures"
        />
      </div>
    </div>
  );
};

export default SearchBar;