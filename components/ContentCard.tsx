import React, { useState } from 'react';
import type { Lecture } from '../types';
import VideoModal from './VideoModal';

interface ContentCardProps {
  lecture: Lecture;
}

// Helper function to create a direct download link for Google Drive files
const getGoogleDriveDownloadUrl = (url: string): string => {
    // Regex to capture file ID from various Google Drive URL formats
    const regex = /(?:drive\.google\.com\/(?:file\/d\/|uc\?id=)|docs\.google\.com\/videos\/d\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    // For non-Google Drive links or if regex fails, return the original URL.
    // The 'download' attribute on the <a> tag will suggest downloading.
    return url;
};


const ContentCard: React.FC<ContentCardProps> = ({ lecture }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Use a more robust check for lecture category
  const isLecture = lecture.category.toLowerCase().trim().includes('lecture');
  const isValidUrl = (url: string) => url && (url.startsWith('http://') || url.startsWith('https://'));

  if (!isValidUrl(lecture.url)) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col h-full group items-center justify-center p-4 text-center">
        <p className="text-red-400 text-sm font-semibold">رابط غير صالح</p>
        <p className="text-xs text-gray-500 mt-1 truncate w-full">يرجى مراجعة الرابط في الملف</p>
      </div>
    );
  }

  // Render for Lectures (opens modal)
  if (isLecture) {
    return (
      <>
        <div 
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full group cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
          onClick={openModal}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openModal()}
          role="button"
          tabIndex={0}
          aria-label={`تشغيل: ${lecture.title}`}
        >
          <div className="relative aspect-video w-full bg-gray-700 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800"></div>
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:bg-opacity-50">
              <div className="bg-black bg-opacity-50 rounded-full p-3 transition-transform duration-300 group-hover:scale-110">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">
              محاضرة
            </div>
          </div>
          <div className="p-4 flex-grow">
            <h3 className="font-bold text-md text-gray-200 group-hover:text-cyan-400 transition-colors">{lecture.title}</h3>
          </div>
        </div>
        
        {isModalOpen && <VideoModal lecture={lecture} onClose={closeModal} />}
      </>
    );
  }

  // Render for Materials with separate Read and Download actions
  const downloadUrl = getGoogleDriveDownloadUrl(lecture.url);

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full group transform hover:-translate-y-1 transition-transform duration-300"
    >
      {/* Visual part of the card */}
      <div className="relative aspect-video w-full bg-gray-700 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800"></div>
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:bg-opacity-50">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">
          مادة تعليمية
        </div>
      </div>
      
      {/* Content and Actions part */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <h3 className="font-bold text-md text-gray-200 group-hover:text-cyan-400 transition-colors mb-4">
            {lecture.title}
        </h3>
        <div className="flex items-center justify-between gap-3 mt-auto">
           <a
              href={lecture.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 text-sm"
              aria-label={`قراءة: ${lecture.title}`}
            >
              قراءة
            </a>
            <a
              href={downloadUrl}
              download
              className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors duration-300"
              aria-label={`تنزيل: ${lecture.title}`}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
