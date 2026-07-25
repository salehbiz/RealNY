import { media } from '../lib/media';
import React from 'react';

interface ExteriorHeroImageProps {
  onImageClick: (src: string, title: string, groupImages?: { src: string; title?: string }[]) => void;
}

export const ExteriorHeroImage: React.FC<ExteriorHeroImageProps> = ({ onImageClick }) => {
  const desktopImageSrc = media('/images/residences-upper-levels-exterior.webp');
  const mobileImageSrc = media('/images/exterior-hero-mobile.webp');
  const title = 'Twilight exterior view of upper terrace setbacks and penthouse residences';

  const handleClick = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    onImageClick(isMobile ? mobileImageSrc : desktopImageSrc, title);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden select-none my-0 border-y border-[#101535]/10">
      <div
        onClick={handleClick}
        className="w-full h-full group cursor-pointer relative"
      >
        <picture className="w-full h-full block">
          <source media="(max-width: 767px)" srcSet={mobileImageSrc} />
          <img
            src={desktopImageSrc}
            alt={title}
            loading="lazy"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
        </picture>
        <div className="absolute bottom-6 right-6 md:right-12 z-10">
          <span className="font-sora text-xs tracking-wider text-[#F4F5F8] bg-[#101535]/90 backdrop-blur-md px-5 py-2.5 rounded-none font-medium shadow-md border border-[#D6B585]/40">
            Upper Tier Terraces & Penthouse Setbacks
          </span>
        </div>
      </div>
    </section>
  );
};
