import { media } from '../lib/media';
import React from 'react';

interface EntranceHeroImageProps {
  onImageClick: (src: string, title: string, groupImages?: { src: string; title?: string }[]) => void;
}

export const EntranceHeroImage: React.FC<EntranceHeroImageProps> = ({ onImageClick }) => {
  const imageSrc = media('/images/skyline-architecture.webp');
  const imageSrcMobile = media('/images/skyline-architecture-mobile.webp');
  const title = 'Street-level arrival entrance · 355 East 86th Street';

  return (
    <section className="relative w-full h-screen overflow-hidden select-none my-0 border-y border-[#101535]/10">
      <div
        onClick={() => onImageClick(window.innerWidth < 768 ? imageSrcMobile : imageSrc, title)}
        className="w-full h-full group cursor-pointer relative"
      >
        <picture>
          <source media="(max-width: 767px)" srcSet={imageSrcMobile} />
          <img
            src={imageSrc}
            alt={title}
            loading="lazy"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
        </picture>
        <div className="absolute bottom-6 left-6 md:left-12 z-10">
          <span className="font-sora text-xs tracking-wider text-[#F4F5F8] bg-[#101535]/90 backdrop-blur-md px-5 py-2.5 rounded-none font-medium shadow-md border border-[#D6B585]/40">
            Main Arrival Entrance • 355 East 86th Street
          </span>
        </div>
      </div>
    </section>
  );
};
