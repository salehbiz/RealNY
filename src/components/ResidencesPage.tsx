import { media } from '../lib/media';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { AvailabilitySection } from './AvailabilitySection';
import type { Residence } from './AvailabilitySection';
import { InquireSection } from './InquireSection';
import { Footer } from './Footer';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import FrameScrub from './FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

export interface ResidenceRoomConfig {
  id: string;
  name: string;
  subLabel?: string;
  startFrame: number;
  description?: string;
}

// 6 spaces in fixed order (all left-to-right lateral moves).
// Note: startFrame indices are initial placeholders evenly distributed across 180 total frames.
// Adjust these frame numbers manually against actual video footage.
export const RESIDENCE_ROOMS: ResidenceRoomConfig[] = [
  {
    id: 'kitchen-dining',
    name: 'Kitchen & Dining',
    subLabel: 'Galley Kitchen & Dining',
    startFrame: 1,
    description: 'Custom white oak cabinetry, honed marble countertops, and integrated Gaggenau appliances.',
  },
  {
    id: 'kitchen-island',
    name: 'Waterfall Kitchen',
    subLabel: 'Custom Oak & Marble Island',
    startFrame: 31,
    description: 'Sculptural stone island framed by architectural brass accents and ambient lighting.',
  },
  {
    id: 'living-room',
    name: 'Living Room',
    subLabel: 'Corner Living Suite',
    startFrame: 61,
    description: 'Expansive floor-to-ceiling corner windows framing panoramic Manhattan views.',
  },
  {
    id: 'bedroom',
    name: 'Primary Bedroom',
    subLabel: 'Sunlit Bedroom Suite',
    startFrame: 91,
    description: 'Tranquil sanctuary with tailored acoustic detailing and serene natural light.',
  },
  {
    id: 'primary-bath',
    name: 'Master Bathroom',
    subLabel: 'Calacatta Marble Spa Bath',
    startFrame: 121,
    description: 'Enveloped in floor-to-ceiling Calacatta marble with custom rain shower and soaking tub.',
  },
  {
    id: 'guest-bath',
    name: 'Bathroom',
    subLabel: 'Sculptural Guest Bath',
    startFrame: 151,
    description: 'Refined marble vanity with bespoke wall-mounted Dornbracht bronze hardware.',
  },
];

interface ResidencesPageProps {
  onSelectResidence: (residence: Residence) => void;
  onOpenInquireWithName: (name: string) => void;
  onNavigatePage: (page: 'home' | 'residences' | 'amenities') => void;
  onImageClick: (src: string, title: string) => void;
}

export const ResidencesPage: React.FC<ResidencesPageProps> = ({
  onSelectResidence,
  onOpenInquireWithName,
  onNavigatePage,
  onImageClick,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0;
    }
  }, []);

  const [tier] = useState<FrameTier>(getFrameTier);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);

  // Determine active room from frame playhead
  const activeRoom = useMemo(() => {
    for (let i = RESIDENCE_ROOMS.length - 1; i >= 0; i--) {
      if (currentFrame >= RESIDENCE_ROOMS[i].startFrame) {
        return RESIDENCE_ROOMS[i];
      }
    }
    return RESIDENCE_ROOMS[0];
  }, [currentFrame]);

  const framePath = useCallback(
    (i: number) => {
      return tier ? media(`/frames/residences/${tier.dir}/${String(i).padStart(4, '0')}.${tier.ext}`) : '';
    },
    [tier]
  );

  const fallbackFramePath = useCallback(
    (i: number) => {
      return tier && tier.dir === 'desktop-hq'
        ? media(`/frames/residences/desktop/${String(i).padStart(4, '0')}.webp`)
        : '';
    },
    [tier]
  );

  const contentOpacity = Math.max(0, 1 - progress * 12);
  const roomLabelOpacity = Math.min(1, Math.max(0, (progress - 0.04) * 20));
  const pointerEvents = contentOpacity > 0.05 ? 'auto' : 'none';

  const sliderCards = [
    {
      src: media('/images/slider/residences-slide-1.webp'),
      title: 'Handcrafted Italian Cabinetry',
      subtitle: 'Custom white oak, matte bronze hardware, and integrated Gaggenau suite.',
    },
    {
      src: media('/images/slider/residences-slide-2.webp'),
      title: 'Calacatta Marble Baths',
      subtitle: 'Spa-inspired primary baths enveloped in full-height honed Calacatta marble.',
    },
    {
      src: media('/images/slider/residences-slide-3.webp'),
      title: 'Sculptural Powder Rooms',
      subtitle: 'Monolithic stone basins with wall-mounted Dornbracht bronze fixtures.',
    },
    {
      src: media('/images/slider/residences-slide-4.webp'),
      title: 'Bespoke Living Spaces',
      subtitle: 'Corner window layouts framing panoramic Manhattan skyline views.',
    },
    {
      src: media('/images/slider/residences-slide-5.webp'),
      title: 'Private Setback Terraces',
      subtitle: 'Generous outdoor terrace space with textured limestone paving.',
    },
  ];

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild?.getBoundingClientRect().width || 340;
      sliderRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild?.getBoundingClientRect().width || 340;
      sliderRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
    }
  };

  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.firstElementChild?.getBoundingClientRect().width || 340;
    const index = Math.round(sliderRef.current.scrollLeft / (cardWidth + 24));
    setActiveSlide(Math.max(0, Math.min(sliderCards.length - 1, index)));
  };

  return (
    <div className="bg-[#ECE7DF] text-[#101535] min-h-screen font-sans selection:bg-[#D6B585] selection:text-[#101535] w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION: Canvas Frame-Scrubbed Video Hero */}
      <section id="residences-hero" className="w-full relative select-none bg-[#101535]">
        <FrameScrub
          frameCount={180}
          framePath={framePath}
          fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
          poster={media("/frames/residences/poster.webp")}
          scrollLengthVh={400}
          className="w-full"
          tierResolved={!!tier}
          pathKey={tier ? tier.dir : ''}
          onProgress={(prog, frame) => {
            setProgress(prog);
            if (frame) setCurrentFrame(frame);
          }}
        >
          {/* Subtle top overlay for top header clarity */}
          <div className="absolute top-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />

          {/* Overlay ONLY on the bottom part of the hero section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 pointer-events-none" />

          {/* Top Header Spacer */}
          <div className="pt-24 z-20 pointer-events-auto" />

          {/* Bottom-Centered Hero Content Container (Appears on landing, disappears on scroll) */}
          <div
            className="relative z-20 max-w-3xl mx-auto px-6 text-center flex flex-col items-center mt-auto pb-12 sm:pb-16 space-y-3 transition-opacity duration-300 ease-out"
            style={{ opacity: contentOpacity, pointerEvents: pointerEvents as any }}
          >
            {/* Hero Title */}
            <h1 className="font-rexton text-lg sm:text-2xl md:text-3xl font-bold tracking-wider text-[#F4F5F8] uppercase drop-shadow-md">
              Refined Residences
            </h1>

            {/* Scroll to Explore CTA */}
            <div className="pt-1">
              <div className="flex flex-col items-center gap-1 group opacity-85 hover:opacity-100 transition-opacity">
                <span className="font-sora text-[10px] tracking-[0.25em] font-medium text-[#D6B585] uppercase">
                  Scroll to Explore
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#D6B585] animate-bounce" />
              </div>
            </div>
          </div>

          {/* Pinned Bottom-Left Room Label Overlay (Fades in as user scrubs sequence) */}
          <div
            className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 md:left-16 z-30 flex flex-col items-start pointer-events-none transition-opacity duration-300 ease-out max-w-sm sm:max-w-md"
            style={{ opacity: roomLabelOpacity }}
          >
            <div key={activeRoom.id} className="transition-opacity duration-300 ease-out space-y-0.5">
              {activeRoom.subLabel && (
                <span className="font-sora text-[10px] sm:text-[11px] tracking-[0.2em] font-semibold text-[#D6B585] uppercase block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {activeRoom.subLabel}
                </span>
              )}
              <h2 className="font-rexton text-sm sm:text-base md:text-lg font-bold tracking-wider text-[#F4F5F8] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {activeRoom.name}
              </h2>
              {activeRoom.description && (
                <p className="font-sora text-xs sm:text-sm text-[#F4F5F8]/85 font-light leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pt-0.5">
                  {activeRoom.description}
                </p>
              )}
            </div>
          </div>
        </FrameScrub>
      </section>

      {/* Intro Subtitle Block */}
      <section className="py-16 md:py-24 px-6 md:px-16 text-center max-w-4xl mx-auto space-y-4 border-b border-[#101535]/15">
        <h2 className="font-sora text-xs md:text-sm tracking-[0.25em] font-semibold text-[#D6B585] uppercase">
          INC ARCHITECTURE & DESIGN
        </h2>
        <p className="font-sora page-intro-p text-[#101535]/90 font-light max-w-4xl mx-auto text-center [text-wrap:balance]">
          A boutique collection of studio through three-bedroom homes, duplexes, and penthouse suites—crafted with natural oak, soft light, and refined detail for mindful luxury.
        </p>
      </section>

      {/* 2. ASYMMETRIC EDITORIAL BLOCK 1: Text Left + Image Right with Side Padding */}
      <section className="w-full py-12 md:py-20 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1500px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-rexton text-2xl sm:text-3xl md:text-4xl font-bold text-[#101535] uppercase page-heading">
              SUNLIT LIVING & DINING SANCTUARIES
            </h3>
            <p className="font-sora page-body-p text-[#101535]/80 font-light">
              Featuring 10-foot ceiling heights, custom wide-plank white oak flooring in chevron patterns, and floor-to-ceiling corner windows framing tree-lined cityscapes between Park and Madison.
            </p>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-7 w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden shadow-2xl">
            <img
              onClick={() => onImageClick( media('/images/residences-living-room.webp'), 'Sunlit Living Room')}
              src={media("/images/residences-living-room.webp")}
              alt="Living Room Interior"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 3. FULL-BLEED KITCHEN BANNER: Full Width & Full Screen */}
      <section className="w-full h-screen overflow-hidden relative">
        <img
          src={media("/images/residences-kitchen.webp")}
          alt="Chef Kitchen"
          className="w-full h-full object-cover object-center"
        />
      </section>

      {/* 4. CAROUSEL SLIDER SECTION (Matching Homepage LifestyleSection Exactly) */}
      <section className="bg-[#F4F5F8] text-[#101535] py-16 md:py-20 px-4 sm:px-8 lg:px-16 w-full border-y border-[#101535]/10 select-none">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Centered Heading */}
          <div className="text-center max-w-4xl mx-auto px-4">
            <h2 className="font-rexton text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#101535] leading-tight tracking-tight uppercase [text-wrap:balance]">
              Crafted with <span className="text-[#D6B585]">Uncompromising</span> <br className="hidden md:inline" />
              Architectural <span className="text-[#D6B585]">Detail</span>.
            </h2>
          </div>

          {/* Carousel Slider Container */}
          <div className="relative w-full group/slider">
            {/* Left Arrow Button */}
            <button
              onClick={handleScrollLeft}
              disabled={activeSlide === 0}
              className={`absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#101535] text-[#D6B585] border border-[#D6B585]/40 flex items-center justify-center shadow-xl hover:bg-[#242C5B] hover:scale-110 transition-all cursor-pointer ${
                activeSlide === 0 ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''
              }`}
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={handleScrollRight}
              disabled={activeSlide === sliderCards.length - 1}
              className={`absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#101535] text-[#D6B585] border border-[#D6B585]/40 flex items-center justify-center shadow-xl hover:bg-[#242C5B] hover:scale-110 transition-all cursor-pointer ${
                activeSlide === sliderCards.length - 1 ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''
              }`}
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scrollable Track */}
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              className="flex items-center gap-8 overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth w-full py-2 snap-x snap-mandatory"
            >
              {sliderCards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => onImageClick(card.src, card.title)}
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
              {sliderCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (sliderRef.current) {
                      const cardWidth = sliderRef.current.firstElementChild?.getBoundingClientRect().width || 400;
                      sliderRef.current.scrollTo({ left: (cardWidth + 32) * idx, behavior: 'smooth' });
                    }
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlide
                      ? 'w-6 bg-[#D6B585]'
                      : 'w-1.5 bg-[#101535]/20 hover:bg-[#101535]/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="max-w-3xl mx-auto text-center space-y-5 pt-2">
            <p className="font-sora text-base md:text-lg leading-relaxed text-[#101535]/80 font-light">
              Every residence at The Eastline New York is crafted with custom Italian cabinetry, honed marble surfaces, Dornbracht fixtures, and warm oak finishes by INC Architecture & Design.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ALTERNATING ASYMMETRIC CONTENT BLOCKS with Side Padding */}
      <div className="w-full space-y-12 md:space-y-20 py-8 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1500px] mx-auto">
        {/* Block A: Image Left + Text Right */}
        <section className="w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
            <div className="lg:col-span-7 w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden shadow-2xl order-2 lg:order-1">
              <img
                onClick={() => onImageClick( media('/images/residences-primary-bathroom.webp'), 'Primary Spa Bathroom')}
                src={media("/images/residences-primary-bathroom.webp")}
                alt="Primary Spa Bathroom"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
              />
            </div>
            <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
              <h3 className="font-rexton text-2xl sm:text-3xl md:text-4xl font-bold text-[#101535] uppercase page-heading">
                SPA-INSPIRED PRIMARY SUITES
              </h3>
              <p className="font-sora page-body-p text-[#101535]/80 font-light">
                Enveloped in full-height honed Calacatta marble with radiantly heated floors, floating custom oak vanities, freestanding soaking tubs, and thermostatic rain showers.
              </p>
            </div>
          </div>
        </section>

        {/* Block B: Text Left + Image Right */}
        <section className="w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-rexton text-2xl sm:text-3xl md:text-4xl font-bold text-[#101535] uppercase page-heading">
                SCULPTURAL GUEST POWDER ROOMS
              </h3>
              <p className="font-sora page-body-p text-[#101535]/80 font-light">
                Dramatic guest powder rooms featuring custom monolithic stone pedestal basins, wall-mounted bronze Dornbracht fixtures, and rich warm sconce illumination.
              </p>
            </div>
            <div className="lg:col-span-7 w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden shadow-2xl">
              <img
                onClick={() => onImageClick( media('/images/residences-powder-room.webp'), 'Guest Powder Room')}
                src={media("/images/residences-powder-room.webp")}
                alt="Powder Room"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
              />
            </div>
          </div>
        </section>
      </div>

      {/* 6. PENTHOUSE & TERRACES FEATURE SECTION */}
      <section className="py-16 md:py-24 w-full text-center space-y-12">
        <div className="space-y-3 px-6 max-w-5xl mx-auto">
          <h2 className="font-rexton text-3xl sm:text-5xl font-bold tracking-tight text-[#101535] uppercase">
            PENTHOUSE RESIDENCES & SKYLINE TERRACES
          </h2>
          <p className="font-sora text-xs sm:text-sm tracking-[0.2em] font-medium text-[#D6B585] uppercase">
            Private Outdoor Setbacks Overlooking Midtown Manhattan
          </p>
        </div>

        {/* Full-bleed Terrace View Photo: Full Screen Height */}
        <div
          onClick={() => onImageClick( media('/images/middle-section-image.webp'), 'Penthouse Setback Terrace')}
          className="group cursor-pointer relative overflow-hidden w-full h-screen"
        >
          <img
            src={media("/images/middle-section-image.webp")}
            alt="Penthouse Terrace"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </section>

      {/* 7. AVAILABLE RESIDENCES INTERACTIVE TABLE SECTION */}
      <section id="availability" className="py-12 bg-white">
        <AvailabilitySection
          onSelectResidence={onSelectResidence}
          onOpenInquire={() => onOpenInquireWithName('')}
        />
      </section>

      {/* 8. INQUIRY & FOOTER */}
      <InquireSection initialResidence="" sideImage={media("/images/residences-living-room.webp")} />

      <Footer
        onNavigateSection={(id) => {
          if (id === 'hero' || id === 'skyline' || id === 'neighborhood') {
            onNavigatePage('home');
          } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenInquire={() => onOpenInquireWithName('')}
      />
    </div>
  );
};

