import { media } from '../lib/media';
import React from 'react';

interface BearHeroImageProps {
  onImageClick: (src: string, title: string) => void;
}

export const BearHeroImage: React.FC<BearHeroImageProps> = ({ onImageClick }) => {
  const imageSrc = media('/images/neighborhood-bear-sculpture.webp');
  const title = 'Glossy bear sculpture framed by spring cherry blossoms near Park & Madison';

  return (
    <section className="relative w-full h-[60vh] min-h-[450px] max-h-[700px] overflow-hidden select-none my-0 border-y border-[#101535]/10">
      <div
        onClick={() => onImageClick(imageSrc, title)}
        className="w-full h-full group cursor-pointer relative"
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101535]/80 via-transparent to-black/20" />
        <div className="absolute bottom-6 left-6 md:left-12 z-10">
          <span className="font-sora text-xs tracking-wider text-[#101535] bg-[#F4F5F8]/95 backdrop-blur-md px-5 py-2.5 rounded-none font-medium shadow-md border border-[#D6B585]/40">
            Madison & Park Avenue Art Sculptures
          </span>
        </div>
      </div>
    </section>
  );
};
