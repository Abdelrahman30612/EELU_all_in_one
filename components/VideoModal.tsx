import React, { useEffect, useRef } from 'react';
import type { Lecture } from '../types';

interface VideoModalProps {
  lecture: Lecture;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ lecture, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
      onClose();
    }
  };
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getGoogleDriveEmbedUrl = (url: string): string | null => {
    // Regex to capture file ID from both drive.google.com/file/d/ and docs.google.com/videos/d/ URLs
    const regex = /(?:drive\.google\.com\/file\/d\/|docs\.google\.com\/videos\/d\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/embed`;
    }
    return null;
  };

  const embedUrl = getGoogleDriveEmbedUrl(lecture.url);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gray-900 rounded-lg shadow-2xl w-11/12 max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden border border-gray-700">
        <header className="p-4 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-bold text-cyan-400 truncate">{lecture.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="إغلاق"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-0 bg-black flex-grow flex items-center justify-center overflow-hidden aspect-video">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={lecture.title}
            ></iframe>
          ) : (
            <video
              className="w-full h-auto max-h-[75vh] object-contain"
              controls
              autoPlay
              src={lecture.url}
              aria-label={`مشغل فيديو لـ: ${lecture.title}`}
            >
              عذرًا، متصفحك لا يدعم تشغيل الفيديوهات المدمجة أو أن الرابط غير صالح.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;