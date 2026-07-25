import { media } from '../lib/media';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LifestyleSectionProps {
  onExploreAmenities: () => void;
  onImageClick: (src: string, title: string, groupImages?: { src: string; title?: string }[]) => void;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({
  onExploreAmenities,
  onImageClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    {
      src: media('/images/skyline-amenities.webp'),
      title: 'Private Courtyard Garden',
      subtitle: 'Enchanting outdoor sanctuary with lush landscaping & lounge seating',
    },
    {
      src: media('/images/amenities-2-gym.webp'),
      title: 'Fitness & Movement Studio',
      subtitle: 'Technogym cardio suite, strength training, and dedicated stretch area',
    },
    {
      src: media('/images/amenities-3-sauna.webp'),
      title: 'Cedar Wood Sauna & Spa',
      subtitle: 'Luminous Scandinavian sauna and holistic wellness sanctuary',
    },
    {
      src: media('/images/amenities-4-cinema.webp'),
      title: 'Private Cinema Room',
      subtitle: 'Acoustically tuned cinema lounge with plush seating & 4K projection',
    },
    {
      src: media('/images/amenities-5-rooftop.webp'),
      title: 'Landscaped Rooftop Terrace',
      subtitle: 'Panoramic skyline views, outdoor dining, and open-air lounging',
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  // Initialize scroll position to 0 so it always starts from the first image
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.firstElementChild?.getBoundingClientRect().width || 400;
      const gap = 32;
      container.scrollTo({ left: (cardWidth + gap) * index, behavior: 'smooth' });
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.firstElementChild?.getBoundingClientRect().width || 400;
      container.scrollBy({ left: -(cardWidth + 32), behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.firstElementChild?.getBoundingClientRect().width || 400;
      container.scrollBy({ left: cardWidth + 32, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.firstElementChild?.getBoundingClientRect().width || 400;
    const scrollPos = container.scrollLeft;
    const rawIndex = Math.round(scrollPos / (cardWidth + 32));
    const maxIdx = isMobile ? cards.length - 1 : cards.length - 2;
    const clampedIndex = Math.max(0, Math.min(maxIdx, rawIndex));
    setActiveIndex(clampedIndex);
  };

  return (
    <section id="amenities" className="bg-[#ECE7DF] text-[#101535] pt-20 pb-16 md:pt-[120px] md:pb-20 px-4 sm:px-8 lg:px-16 w-full border-b border-[#101535]/10 select-none">
      <div className="w-full">
        {/* Centered Heading with Equal Spacing */}
        <div className="text-center max-w-4xl mx-auto px-4 pb-20 md:pb-[120px] flex justify-center items-center">
          <h2 id="crossroads-heading" className="font-rexton text-[22.5px] font-bold text-[#101535] leading-[1.15] tracking-[-0.15em] uppercase text-center [text-wrap:balance]">
            At the crossroads of <span className="text-[#D6B585] tracking-[-0.15em] font-bold uppercase">Midtown Manhattan’s</span> <br className="hidden md:inline" />
            energy and evolution.
          </h2>
        </div>

        {/* 5-Image Carousel Slider Container */}
        <div className="relative w-full group/slider mb-10 md:mb-12">
          {/* Left Arrow Button */}
          <button
            onClick={handleScrollLeft}
            disabled={activeIndex === 0}
            className={`absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-[#101535] text-white border border-white/25 flex items-center justify-center shadow-md hover:bg-[#242C5B] hover:scale-110 transition-all cursor-pointer ${
              activeIndex === 0 ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''
            }`}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleScrollRight}
            disabled={activeIndex === (isMobile ? cards.length - 1 : cards.length - 2)}
            className={`absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-[#101535] text-white border border-white/25 flex items-center justify-center shadow-md hover:bg-[#242C5B] hover:scale-110 transition-all cursor-pointer ${
              activeIndex === (isMobile ? cards.length - 1 : cards.length - 2) ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''
            }`}
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-center gap-8 overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth w-full py-2 snap-x snap-mandatory"
          >
            {cards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => onImageClick(
                  card.src,
                  `${card.title} - ${card.subtitle}`,
                  cards.map(c => ({ src: c.src, title: `${c.title} - ${c.subtitle}` }))
                )}
                className="group cursor-pointer relative overflow-hidden w-full md:w-[calc(50%-16px)] shrink-0 snap-start aspect-[16/10]"
              >
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-none"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex justify-center items-center gap-2 pt-4">
            {(isMobile ? cards : cards.slice(0, cards.length - 1)).map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? 'w-6 bg-[#D6B585]'
                    : 'w-1.5 bg-[#101535]/20 hover:bg-[#101535]/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Text & Action CTA */}
        <div className="max-w-3xl mx-auto text-center space-y-5 pt-2">
          <p className="font-sora text-[15px] tracking-[-0.015em] leading-[1.0] text-[#101535]/80 font-light max-w-2xl mx-auto text-center [text-wrap:balance]">
            Residents at The Eastline New York enjoy more than 10,000 square feet of amenities surrounding an enchanting private garden courtyard, all beautifully envisioned by renowned hospitality designer Paul Duesing &amp; Partners.
          </p>

          <div>
            <button
              onClick={onExploreAmenities}
              className="px-4 py-1.5 rounded-none bg-[#101535] text-white border border-white/20 hover:bg-[#242C5B] hover:scale-105 font-sora text-[9px] tracking-widest font-semibold uppercase transition-all duration-300 shadow-md cursor-pointer"
            >
              Explore All Amenities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
