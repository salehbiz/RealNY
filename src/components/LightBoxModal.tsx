import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightBoxImageItem {
  src: string;
  title?: string;
}

interface LightBoxModalProps {
  src: string | null;
  title?: string;
  onClose: () => void;
  groupImages?: LightBoxImageItem[];
}

export const LightBoxModal: React.FC<LightBoxModalProps> = ({
  src,
  title,
  onClose,
  groupImages = [],
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(-1);

  const hasMultiple = groupImages.length > 1;

  const handlePrev = () => {
    if (groupImages.length <= 1) return;
    setCurrentIdx((prev) => (prev - 1 + groupImages.length) % groupImages.length);
  };

  const handleNext = () => {
    if (groupImages.length <= 1) return;
    setCurrentIdx((prev) => (prev + 1) % groupImages.length);
  };

  // Synchronize state when src or groupImages change
  useEffect(() => {
    if (src) {
      if (groupImages.length > 0) {
        const idx = groupImages.findIndex((img) => img.src === src);
        setCurrentIdx(idx >= 0 ? idx : 0);
      } else {
        setCurrentIdx(-1);
      }
    } else {
      setCurrentIdx(-1);
    }
  }, [src, groupImages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [groupImages.length, onClose]);

  // Early return must be below all hook declarations to respect React's Rules of Hooks
  if (!src) return null;

  // Resolve current active image details
  const activeImgSrc = hasMultiple && currentIdx >= 0 ? groupImages[currentIdx].src : src;
  const activeImgTitle = hasMultiple && currentIdx >= 0 ? groupImages[currentIdx].title || title : title;

  return (
    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 transition-all duration-300 select-none">
      {/* Top Header Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-35">
        <div className="flex items-center gap-2 text-white/80 font-sans-clean text-xs tracking-widest uppercase">
          <ZoomIn className="w-4 h-4 text-[#D6B585]" />
          <span>{activeImgTitle || 'PHOTO GALLERY'}</span>
          {hasMultiple && currentIdx >= 0 && (
            <span className="text-white/40 ml-2 font-light">
              ({currentIdx + 1} / {groupImages.length})
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Close Lightbox"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 z-30 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 transition-all cursor-pointer hover:scale-110 active:scale-95 backdrop-blur-sm shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 z-30 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 transition-all cursor-pointer hover:scale-110 active:scale-95 backdrop-blur-sm shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image Display */}
      <div className="relative max-w-6xl max-h-[85vh] overflow-hidden rounded-xl shadow-2xl border border-white/10 z-20">
        <img
          src={activeImgSrc}
          alt={activeImgTitle || 'High resolution view'}
          className="w-full h-full object-contain max-h-[85vh] select-none"
        />
      </div>
    </div>
  );
};

