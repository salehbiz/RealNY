import { media } from '../lib/media';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LifestyleSectionProps {
  onExploreAmenities: () => void;
  onImageClick: (src: string, title: string) => void;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({
  onExploreAmenities,
  onImageClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    {
      src: media('/images/amenities-1-courtyard.webp'),
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
      src: media('/images/amenities-5-golf.webp'),
      title: 'PGA Golf Simulator Suite',
      subtitle: 'Immersive virtual golf simulator, wet bar & executive lounge',
    },
  ];

  // Initialize scroll position to 0 so it always starts from the first image
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
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
    const clampedIndex = Math.max(0, Math.min(cards.length - 1, rawIndex));
    setActiveIndex(clampedIndex);
  };

  return (
    <section id="amenities" className="bg-[#F4F5F8] text-[#101535] py-16 md:py-20 px-4 sm:px-8 lg:px-16 w-full border-b border-[#101535]/10 select-none">
      <div className="w-full space-y-8">
        {/* Centered Heading */}
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 id="crossroads-heading" className="font-rexton text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#101535] leading-tight tracking-tight uppercase [text-wrap:balance]">
            At the crossroads of <span className="text-[#D6B585]">Midtown Manhattan’s</span> <br className="hidden md:inline" />
            energy and evolution.
          </h2>
        </div>

        {/* 5-Image Carousel Slider Container */}
        <div className="relative w-full group/slider">
          {/* Left Arrow Button */}
          <button
            onClick={handleScrollLeft}
            disabled={activeIndex === 0}
            className={`absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#101535] text-[#D6B585] border border-[#D6B585]/40 flex items-center justify-center shadow-xl hover:bg-[#242C5B] hover:scale-110 transition-all cursor-pointer ${
              activeIndex === 0 ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''
            }`}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleScrollRight}
            disabled={activeIndex === cards.length - 1}
            className={`absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#101535] text-[#D6B585] border border-[#D6B585]/40 flex items-center justify-center shadow-xl hover:bg-[#242C5B] hover:scale-110 transition-all cursor-pointer ${
              activeIndex === cards.length - 1 ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''
            }`}
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
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
                onClick={() => onImageClick(card.src, `${card.title} - ${card.subtitle}`)}
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
            {cards.map((_, idx) => (
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
          <p className="font-sora text-base md:text-lg leading-relaxed text-[#101535]/80 font-light">
            Residents at The Eastline New York enjoy more than 10,000 square feet of amenities surrounding an enchanting private garden courtyard, all beautifully envisioned by renowned hospitality designer Paul Duesing & Partners.
          </p>

          <div>
            <button
              onClick={onExploreAmenities}
              className="px-9 py-3.5 rounded-none bg-[#101535] text-[#D6B585] border border-[#D6B585]/30 hover:bg-[#242C5B] hover:scale-105 font-sora text-xs tracking-wider font-semibold uppercase transition-all duration-300 shadow-md cursor-pointer"
            >
              Explore All Amenities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
