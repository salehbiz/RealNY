import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface LightBoxModalProps {
  src: string | null;
  title?: string;
  onClose: () => void;
}

export const LightBoxModal: React.FC<LightBoxModalProps> = ({ src, title, onClose }) => {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 transition-all duration-300">
      {/* Top Header Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-white/80 font-sans-clean text-xs tracking-widest uppercase">
          <ZoomIn className="w-4 h-4" />
          <span>{title || 'PHOTO GALLERY'}</span>
        </div>

        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Image Display */}
      <div className="relative max-w-6xl max-h-[85vh] overflow-hidden rounded-xl shadow-2xl border border-white/10">
        <img
          src={src}
          alt={title || 'High resolution view'}
          className="w-full h-full object-contain max-h-[85vh]"
        />
      </div>
    </div>
  );
};
