import React, { useState } from 'react';
import type { Lecture } from '../types';
import VideoModal from './VideoModal';

interface VideoCardProps {
  lecture: Lecture;
}

const VideoCard: React.FC<VideoCardProps> = ({ lecture }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // A simple check for a valid URL.
  const isValidUrl = (url: string) => url && (url.startsWith('http://') || url.startsWith('https://'));

  if (!isValidUrl(lecture.url)) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full group items-center justify-center p-4 aspect-w-16 aspect-h-9">
        <p className="text-red-400 text-center text-sm">بيانات المحاضرة غير صالحة</p>
        <p className="text-xs text-gray-500 text-center truncate w-full mt-2">يرجى التأكد من رابط الفيديو في الملف</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full group cursor-pointer"
        onClick={openModal}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openModal()}
        role="button"
        tabIndex={0}
        aria-label={`تشغيل فيديو: ${lecture.title}`}
      >
        <div className="relative aspect-w-16 aspect-h-9 w-full bg-gray-700 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800"></div>
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-all duration-300 opacity-70 group-hover:opacity-100 group-hover:bg-opacity-40">
            <div className="bg-black bg-opacity-50 rounded-full p-3 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4 flex-grow">
          <h3 className="font-bold text-md sm:text-lg text-gray-200 group-hover:text-cyan-400 transition-colors">{lecture.title}</h3>
        </div>
      </div>
      
      {isModalOpen && (
        <VideoModal lecture={lecture} onClose={closeModal} />
      )}
    </>
  );
};

export default VideoCard;
