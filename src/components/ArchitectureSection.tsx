import { media } from '../lib/media';
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArchitectureSectionProps {
  onImageClick: (src: string, title: string) => void;
}

export const ArchitectureSection: React.FC<ArchitectureSectionProps> = ({ onImageClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      id: 'proj-1',
      title: 'Tsuki Sanctuary',
      subtitle: 'Sunlit Living & Dining',
      image: media('/images/residences-living-room.webp'),
      tags: ['Bespoke Interior', 'Primary Living'],
      offset: false,
    },
    {
      id: 'proj-2',
      title: 'Mizu Courtyard',
      subtitle: 'Paul Duesing & Partners Design',
      image: media('/images/amenities-courtyard-day.webp'),
      tags: ['Garden Sanctuary', 'Outdoor Terrace'],
      offset: true,
    },
    {
      id: 'proj-3',
      title: 'Hikari Spa & Sauna',
      subtitle: 'Scandinavian Cedar Wellness',
      image: media('/images/amenities-sauna.webp'),
      tags: ['Thermal Spa', 'Wellness Retreat'],
      offset: false,
    },
    {
      id: 'proj-4',
      title: 'Aozora Penthouse',
      subtitle: '360° Panoramic Skyline',
      image: media('/images/residences-duplex-and-penthouse-exterior.webp'),
      tags: ['Penthouse', 'Skyline Terraces'],
      offset: true,
    },
    {
      id: 'proj-5',
      title: 'Hikari Atrium Lounge',
      subtitle: 'Social & Executive Suite',
      image: media('/images/amenities-lounge.webp'),
      tags: ['Billiards Lounge', 'Catering Bar'],
      offset: false,
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative bg-[#ECE7DF] text-[#101535] py-16 md:py-24 px-4 sm:px-8 lg:px-16 w-full border-b border-[#101535]/10 select-none overflow-hidden">
      {/* Subtle Background Watermark Text */}
      <div className="absolute bottom-2 left-0 right-0 pointer-events-none z-0 overflow-hidden leading-none opacity-[0.03] flex justify-center">
        <span className="font-rexton text-[12vw] font-black uppercase text-[#101535] whitespace-nowrap tracking-tight">
          THE EASTLINE
        </span>
      </div>

      <div className="w-full space-y-8 relative z-10">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-none border border-[#D6B585]/40 bg-[#ECE7DF] text-[#101535] font-sora text-[11px] font-semibold">
              <span className="text-[#D6B585] text-xs">✳</span>
              <span>Featured Highlights</span>
            </div>

            <h2 className="font-sora text-3xl sm:text-4xl lg:text-5xl font-normal text-[#101535] tracking-tight leading-tight">
              The Architecture of{' '}
              <span className="font-sora italic font-light text-[#D6B585]">
                Well-Being
              </span>
            </h2>
          </div>

          {/* Right Description & Scroll Nav Arrows */}
          <div className="flex flex-col md:items-end gap-3 max-w-md">
            <p className="font-sora text-xs sm:text-sm text-[#101535]/75 font-light leading-relaxed">
              <strong className="font-medium text-[#101535]">Exploring Sensory Design:</strong> Dedicated to creating spaces that transcend the ordinary, focusing on human-centric luxury.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleScroll('left')}
                className="p-2 rounded-none border border-[#101535]/20 bg-[#ECE7DF] hover:bg-[#101535] hover:text-white hover:border-[#101535] transition-all cursor-pointer shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-2 rounded-none border border-[#101535]/20 bg-[#ECE7DF] hover:bg-[#101535] hover:text-white hover:border-[#101535] transition-all cursor-pointer shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Smooth Horizontal Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pt-2 pb-4 scroll-smooth"
        >
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onImageClick(proj.image, proj.title)}
              className={`flex-none w-[300px] sm:w-[360px] md:w-[400px] bg-[#ECE7DF] p-5 rounded-none shadow-sm hover:shadow-md border border-[#101535]/10 group cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                proj.offset ? 'mt-4 md:mt-8' : ''
              }`}
            >
              {/* Image Frame with Larger Size & Sharp Corners */}
              <div className="relative overflow-hidden rounded-none aspect-[16/11] bg-[#101535]/5 mb-4 border border-[#101535]/5">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1 mb-3">
                <h3 className="font-sora text-lg sm:text-xl font-bold text-[#101535] group-hover:text-[#D6B585] transition-colors leading-snug truncate">
                  {proj.title}
                </h3>
                <p className="font-sora text-xs text-[#101535]/65 font-light truncate">
                  {proj.subtitle}
                </p>
              </div>

              {/* Category Tags */}
              <div className="flex flex-wrap gap-2">
                {proj.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-none bg-[#ECE7DF] text-[#101535]/80 font-sora text-[10px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
