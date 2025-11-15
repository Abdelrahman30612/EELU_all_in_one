
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Lecture } from './types';
import { fetchAndParseSheet } from './services/googleSheetService';
import { GOOGLE_SHEET_CSV_URL } from './constants';
import ContentCard from './components/ContentCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Instructions from './components/Instructions';
import SearchBar from './components/SearchBar';
import LevelSelector from './components/LevelSelector';
import SubjectSelector from './components/SubjectSelector';
import CategorySelector from './components/CategorySelector';
import InstructorSelector from './components/InstructorSelector';

const App: React.FC = () => {
  const [allLectures, setAllLectures] = useState<Lecture[]>([]);
  // State for the multi-step navigation
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>('ابحث...');
  
  const isLectureCategory = (category: string | null): boolean => 
    !!category && category.toLowerCase().trim().includes('lecture');

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL.includes('YOUR_CSV_URL_HERE')) {
      setError("لم يتم تحديد رابط Google Sheet CSV. يرجى تحديثه في ملف `constants.ts`.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAndParseSheet(GOOGLE_SHEET_CSV_URL);
      if (data.length === 0) {
        setError('لم يتم العثور على بيانات في الملف. تأكد من أن Google Sheet يحتوي على بيانات ومنشور بشكل صحيح.');
      } else {
        setAllLectures(data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`فشل في جلب البيانات: ${err.message}. تأكد من صحة الرابط وأن الشيت منشور للعامة.`);
      } else {
        setError('حدث خطأ غير متوقع.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- MEMOIZED SELECTORS ---

  const availableLevels = useMemo(() => {
    const levels = allLectures.map(l => l.level);
    return Array.from(new Set(levels)).sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }, [allLectures]);

  const subjectsForLevel = useMemo(() => {
    if (!selectedLevel) return [];
    const lecturesForLevel = allLectures.filter(l => l.level === selectedLevel);
    const subjectCounts = lecturesForLevel.reduce((acc, lecture) => {
        acc[lecture.subject] = (acc[lecture.subject] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(subjectCounts).map(([name, count]) => ({ name, count }));
  }, [allLectures, selectedLevel]);

  const categoriesForSubject = useMemo(() => {
    if (!selectedLevel || !selectedSubject) return [];
    const lecturesForSubject = allLectures.filter(l => l.level === selectedLevel && l.subject === selectedSubject);
    const categoryCounts = lecturesForSubject.reduce((acc, lecture) => {
        acc[lecture.category] = (acc[lecture.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
  }, [allLectures, selectedLevel, selectedSubject]);
  
  const availableInstructors = useMemo(() => {
    if (!selectedLevel || !selectedSubject || !isLectureCategory(selectedCategory)) return [];
    const lecturesForCategory = allLectures.filter(l => l.level === selectedLevel && l.subject === selectedSubject && l.category === selectedCategory);
    const instructorCounts = lecturesForCategory.reduce((acc, lecture) => {
      const instructorName = lecture.instructor || 'غير محدد';
      acc[instructorName] = (acc[instructorName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(instructorCounts).map(([name, count]) => ({ name, count }));
  }, [allLectures, selectedLevel, selectedSubject, selectedCategory]);

  const filteredLectures = useMemo(() => {
    if (!selectedLevel || !selectedSubject || !selectedCategory) return [];
    
    let lectures = allLectures.filter(l => 
      l.level === selectedLevel && 
      l.subject === selectedSubject &&
      l.category === selectedCategory
    );

    if (isLectureCategory(selectedCategory)) {
        if (!selectedInstructor) return []; // Don't show lectures until instructor is selected
        lectures = lectures.filter(l => (l.instructor || 'غير محدد') === selectedInstructor);
    }
    
    return lectures.filter(l =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allLectures, selectedLevel, selectedSubject, selectedCategory, selectedInstructor, searchQuery]);
  
  const totalItemsInCategory = useMemo(() => {
     if (!selectedLevel || !selectedSubject || !selectedCategory) return 0;
     const baseFilter = allLectures.filter(l => l.level === selectedLevel && l.subject === selectedSubject && l.category === selectedCategory);
     if(isLectureCategory(selectedCategory) && selectedInstructor) {
        return baseFilter.filter(l => (l.instructor || 'غير محدد') === selectedInstructor).length;
     }
     return baseFilter.length;
  }, [allLectures, selectedLevel, selectedSubject, selectedCategory, selectedInstructor]);

  useEffect(() => {
    if (filteredLectures.length > 0) {
      const randomLecture = filteredLectures[Math.floor(Math.random() * filteredLectures.length)];
      setSearchPlaceholder(`جرب البحث عن: "${randomLecture.title}"`);
    } else {
      setSearchPlaceholder('ابحث...');
    }
  }, [filteredLectures]);

  // --- HANDLER FUNCTIONS ---
  const handleLevelSelect = (level: string) => setSelectedLevel(level);
  const handleSubjectSelect = (subject: string) => setSelectedSubject(subject);
  const handleCategorySelect = (category: string) => setSelectedCategory(category);
  const handleInstructorSelect = (instructor: string) => setSelectedInstructor(instructor);
  
  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedSubject(null);
    setSelectedCategory(null);
    setSelectedInstructor(null);
    setSearchQuery('');
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedCategory(null);
    setSelectedInstructor(null);
    setSearchQuery('');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedInstructor(null);
    setSearchQuery('');
  };

  const handleBackToInstructors = () => {
    setSelectedInstructor(null);
    setSearchQuery('');
  }
  
  // --- RENDER LOGIC ---

  let content: React.ReactNode;

  if (isLoading) {
    content = <div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>;
  } else if (error) {
    if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL.includes('YOUR_CSV_URL_HERE')) {
      content = <div className="p-8"><Instructions error={error} /></div>;
    } else {
      content = <div className="p-8"><ErrorMessage message={error} onRetry={fetchData} /></div>;
    }
  } else if (!selectedLevel) {
    content = <LevelSelector levels={availableLevels} onSelectLevel={handleLevelSelect} />;
  } else if (!selectedSubject) {
    content = <SubjectSelector subjects={subjectsForLevel} onSelectSubject={handleSubjectSelect} onBack={handleBackToLevels} level={selectedLevel} />;
  } else if (!selectedCategory) {
    content = <CategorySelector categories={categoriesForSubject} onSelectCategory={handleCategorySelect} onBack={handleBackToSubjects} subject={selectedSubject} />;
  } else if (isLectureCategory(selectedCategory) && !selectedInstructor) {
    content = <InstructorSelector instructors={availableInstructors} onSelectInstructor={handleInstructorSelect} onBack={handleBackToCategories} subject={selectedSubject} />;
  } else {
    // Final content view
    content = (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">{selectedSubject}</h1>
            <p className="text-2xl text-gray-300 mt-2">{selectedCategory}{isLectureCategory(selectedCategory) && selectedInstructor ? ` - ${selectedInstructor}` : ''}</p>
            
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm">
               <button onClick={handleBackToLevels} className="bg-gray-700/80 hover:bg-gray-700 py-1 px-3 rounded-md transition-colors">
                 {selectedLevel}
               </button>
               <span className="text-gray-500">/</span>
               <button onClick={handleBackToSubjects} className="bg-gray-700/80 hover:bg-gray-700 py-1 px-3 rounded-md transition-colors">
                 {selectedSubject}
               </button>
               <span className="text-gray-500">/</span>
               <button onClick={isLectureCategory(selectedCategory) ? handleBackToCategories : handleBackToSubjects} className="bg-gray-700/80 hover:bg-gray-700 py-1 px-3 rounded-md transition-colors">
                 {selectedCategory}
               </button>
               {isLectureCategory(selectedCategory) && selectedInstructor && (
                  <>
                      <span className="text-gray-500">/</span>
                      <span className="text-cyan-400 font-bold py-1 px-3 rounded-md">
                          {selectedInstructor}
                      </span>
                  </>
               )}
            </div>
          </header>

          <main>
              <div className="mb-6 max-w-lg mx-auto">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  placeholder={searchPlaceholder}
                />
                <p className="text-center text-sm text-gray-400 mt-2">
                  {`عرض ${filteredLectures.length} من أصل ${totalItemsInCategory} عنصر`}
                </p>
              </div>
            
            {filteredLectures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredLectures.map((lecture, index) => (
                  <ContentCard key={`${lecture.url}-${index}`} lecture={lecture} />
                ))}
              </div>
            ) : (
               <div className="text-center py-10 text-lg text-gray-400">
                  {searchQuery ? `لا توجد نتائج تطابق بحثك.` : `لا توجد عناصر متاحة حالياً.`}
               </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      {content}
      <footer className="text-center text-gray-500 py-4 bg-gray-900">
          <p>created by Abrazeq</p>
          <p className="text-sm">EELU Menoufia</p>
      </footer>
    </>
  );
};

export default App;
