import { media } from '../lib/media';
import React, { useState } from 'react';

interface SkylineSectionProps {
  onExploreBuilding: () => void;
  onImageClick: (src: string, title: string) => void;
}

export const SkylineSection: React.FC<SkylineSectionProps> = ({
  onExploreBuilding: _onExploreBuilding,
  onImageClick,
}) => {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      id: 'interiors',
      tabLabel: 'Interior Design',
      title: 'Interior Design',
      description: 'Bespoke living spaces balancing natural oak, soft light, and refined detail for mindful luxury.',
      image: media('/images/skyline-interiors.webp'),
      imageMobile: media('/images/skyline-interiors-mobile.webp'),
    },
    {
      id: 'architecture',
      tabLabel: 'Architecture Design',
      title: 'Architecture Design',
      description: 'A modern tribute to Manhattan’s Gilded Age with bronze panels, glass, and textured limestone.',
      image: media('/images/skyline-architecture.webp'),
      imageMobile: media('/images/skyline-architecture-mobile.webp'),
    },
    {
      id: 'landscape',
      tabLabel: 'Landscape Design',
      title: 'Landscape Design',
      description: 'A central garden courtyard envisioned by Paul Duesing with seasonal green sanctuary.',
      image: media('/images/skyline-landscape.webp'),
      imageMobile: media('/images/skyline-landscape-mobile.webp'),
    },
  ];

  const currentCategory = categories[activeCategory];

  return (
    <section id="skyline" className="bg-[#F4F5F8] py-6 md:py-10 px-4 sm:px-8 lg:px-16 w-full select-none border-b border-[#101535]/10">
      
      {/* Showcase Container */}
      <div className="relative w-full h-[540px] max-h-[75vh] md:h-[80vh] md:min-h-[550px] md:max-h-[850px] overflow-hidden rounded-none bg-[#101535] shadow-2xl">
        
        {/* Cross-fading Background Images */}
        <div className="absolute inset-0 w-full h-full">
          {categories.map((cat, idx) => (
            <picture key={cat.id}>
              <source media="(max-width: 767px)" srcSet={cat.imageMobile} />
              <img
                src={cat.image}
                alt={cat.title}
                onClick={() => onImageClick(window.innerWidth < 768 ? cat.imageMobile : cat.image, `${cat.title} Showcase`)}
                className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-all duration-1000 ease-in-out transform ${
                  idx === activeCategory ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                }`}
              />
            </picture>
          ))}
        </div>

        {/* Mobile Ultra-Sleek Horizontal Pill Tabs (Top Row, Unobtrusive) */}
        <div className="md:hidden absolute top-4 left-1/2 transform -translate-x-1/2 flex justify-center gap-1.5 z-20 w-full px-2">
          {categories.map((cat, idx) => {
            const isActive = idx === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(idx)}
                className={`px-2.5 py-1 rounded-none font-sora text-[10px] flex items-center transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#101535] text-[#D6B585] border border-[#D6B585]/40 font-semibold'
                    : 'bg-black/40 text-white/80 border border-white/15 backdrop-blur-md font-light'
                }`}
              >
                {isActive && <span className="w-1 h-1 rounded-full bg-[#D6B585] mr-1.5 inline-block" />}
                {cat.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Desktop Left-Aligned Compact Pill Tabs */}
        <div className="hidden md:flex absolute top-6 left-6 flex-wrap justify-start gap-2.5 z-20">
          {categories.map((cat, idx) => {
            const isActive = idx === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(idx)}
                className={`px-4 py-1.5 rounded-none font-sora text-xs flex items-center transition-all duration-300 shadow-md cursor-pointer ${
                  isActive
                    ? 'bg-[#101535] text-[#D6B585] border border-[#D6B585]/40 font-semibold'
                    : 'bg-black/40 hover:bg-[#101535]/90 text-white/90 border border-white/20 backdrop-blur-md font-light'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D6B585] mr-2 inline-block" />}
                {cat.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Bottom Text-Only Gradient Overlay & Content Container */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12 pb-5 md:pt-16 md:pb-8 px-4 sm:px-6 z-20 flex flex-col items-center text-center text-white pointer-events-none">
          <div className="max-w-2xl mx-auto flex flex-col items-center space-y-1.5 md:space-y-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
            <h2 className="font-rexton text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-widest uppercase">
              {currentCategory.title}
            </h2>
            <p className="font-sora text-xs sm:text-sm md:text-base text-white/95 font-light leading-snug md:leading-relaxed max-w-lg md:max-w-xl line-clamp-2 [text-wrap:balance]">
              {currentCategory.description}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
