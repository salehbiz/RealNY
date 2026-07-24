import { media } from '../lib/media';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { InquireSection } from './InquireSection';
import { Footer } from './Footer';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import FrameScrub from './FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

export interface AmenityRoomConfig {
  id: string;
  name: string;
  floor: string;
  startFrame: number;
  description?: string;
}

// 13 rooms in fixed sequence order, grouped by floor.
// Note: startFrame indices are initial placeholders evenly distributed across 180 total frames.
// Adjust these frame numbers manually against actual video footage.
export const AMENITY_ROOMS: AmenityRoomConfig[] = [
  { id: 'lobby', name: 'Lobby', floor: 'Floor 1', startFrame: 1, description: 'Double-height entrance with 24-hour concierge, stone fireplace, and custom art.' },
  { id: 'lounge', name: 'Lounge', floor: 'Floor 1', startFrame: 15, description: 'Sophisticated social salon featuring plush seating, coffee bar, and garden views.' },
  { id: 'coworking', name: 'Coworking', floor: 'Floor 1', startFrame: 29, description: 'Private executive suites and communal work tables with high-speed fiber internet.' },
  { id: 'screening-room', name: 'Screening Room', floor: 'Floor 1', startFrame: 43, description: 'Immersive 4K cinema experience with acoustic sound dampening and velvet seating.' },
  { id: 'kids-room', name: 'Kids Room', floor: 'Floor 1', startFrame: 57, description: 'Thoughtfully designed interactive play room with creative activity zones.' },
  { id: 'spa', name: 'Spa', floor: 'Cellar', startFrame: 71, description: 'Serene wellness sanctuary with treatment rooms and hydrotherapy plunge pools.' },
  { id: 'sauna', name: 'Sauna', floor: 'Cellar', startFrame: 85, description: 'Cedar-lined Scandinavian sauna and eucalyptus steam room for relaxation.' },
  { id: 'gym', name: 'Gym', floor: 'Cellar', startFrame: 99, description: 'State-of-the-art fitness center equipped with Technogym strength and cardio.' },
  { id: 'yoga', name: 'Yoga', floor: 'Cellar', startFrame: 113, description: 'Peaceful studio designed for private yoga practice, Pilates, and meditation.' },
  { id: 'golf-simulator', name: 'Golf Simulator', floor: 'Cellar', startFrame: 127, description: 'High-definition TrackMan golf simulator and virtual sports lounge.' },
  { id: 'party-room', name: 'Party Room', floor: 'Cellar', startFrame: 141, description: 'Exclusive entertaining space complete with chef’s kitchen and dining setup.' },
  { id: 'sky-lounge', name: 'Sky Lounge', floor: 'Floor 23', startFrame: 155, description: 'Panoramic high-floor cocktail lounge offering sweeping skyline perspectives.' },
  { id: 'rooftop', name: 'Rooftop', floor: 'Roof', startFrame: 169, description: 'Landscaped roof deck with outdoor dining, fire pits, and open-air lounging.' },
];

interface AmenitiesPageProps {
  onOpenInquireWithName: (name: string) => void;
  onNavigatePage: (page: 'home' | 'residences' | 'amenities') => void;
  onImageClick: (src: string, title: string) => void;
}

export const AmenitiesPage: React.FC<AmenitiesPageProps> = ({
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
    for (let i = AMENITY_ROOMS.length - 1; i >= 0; i--) {
      if (currentFrame >= AMENITY_ROOMS[i].startFrame) {
        return AMENITY_ROOMS[i];
      }
    }
    return AMENITY_ROOMS[0];
  }, [currentFrame]);

  const framePath = useCallback(
    (i: number) => {
      return tier ? media(`/frames/amenities/${tier.dir}/${String(i).padStart(4, '0')}.${tier.ext}`) : '';
    },
    [tier]
  );

  const fallbackFramePath = useCallback(
    (i: number) => {
      return tier && tier.dir === 'desktop-hq'
        ? media(`/frames/amenities/desktop/${String(i).padStart(4, '0')}.webp`)
        : '';
    },
    [tier]
  );

  const contentOpacity = Math.max(0, 1 - progress * 12);
  const roomLabelOpacity = Math.min(1, Math.max(0, (progress - 0.04) * 20));
  const pointerEvents = contentOpacity > 0.05 ? 'auto' : 'none';

  const sliderCards = [
    {
      src: media('/images/slider/amenities-slide-1.webp'),
      title: 'Private Dining & Outdoor Tastings',
      subtitle: 'Intimate alfresco dining, wine tastings, and chef-curated gatherings.',
    },
    {
      src: media('/images/slider/amenities-slide-2.webp'),
      title: 'Co-Working & Creative Suites',
      subtitle: 'Quiet workspaces, high-speed fiber connectivity, and meeting lounges.',
    },
    {
      src: media('/images/slider/amenities-slide-3.webp'),
      title: 'Pet Spa & Care Services',
      subtitle: 'Dedicated pet grooming station and outdoor courtyard play lawn.',
    },
    {
      src: media('/images/slider/amenities-slide-4.webp'),
      title: 'Resident Lounge & Billiards',
      subtitle: 'Executive game table, private bar alcove, and fireplace seating.',
    },
    {
      src: media('/images/slider/amenities-slide-5.webp'),
      title: 'Private Cinema & Media Room',
      subtitle: '4K projection, acoustic surround sound, and custom velvet seating.',
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
      <section id="amenities-hero" className="w-full relative select-none bg-[#101535]">
        <FrameScrub
          frameCount={180}
          framePath={framePath}
          fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
          poster={tier?.dir === 'mobile' ? '/frames/amenities/mobile-poster.webp' : media('/frames/amenities/poster.webp')}
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

          {/* Bottom-Centered Initial Hero Content Container (Fades out quickly on scroll) */}
          <div
            className="relative z-20 max-w-3xl mx-auto px-6 text-center flex flex-col items-center mt-auto pb-12 sm:pb-16 space-y-3 transition-opacity duration-300 ease-out"
            style={{ opacity: contentOpacity, pointerEvents: pointerEvents as any }}
          >
            {/* Hero Title */}
            <h1 className="font-rexton text-lg sm:text-2xl md:text-3xl font-bold tracking-wider text-[#F4F5F8] uppercase drop-shadow-md">
              Indoor & Outdoor Amenities
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

          {/* Pinned Bottom-Left Room Label Overlay (Fades in cleanly as user scrubs sequence) */}
          <div
            className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 md:left-16 z-30 flex flex-col items-start pointer-events-none transition-opacity duration-300 ease-out max-w-sm sm:max-w-md"
            style={{ opacity: roomLabelOpacity }}
          >
            <div key={activeRoom.id} className="transition-opacity duration-300 ease-out space-y-0.5">
              <span className="font-sora text-[10px] sm:text-[11px] tracking-[0.2em] font-semibold text-[#D6B585] uppercase block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {activeRoom.floor}
              </span>
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
          INDOOR & OUTDOOR COURTYARD
        </h2>
        <p className="font-sora page-intro-p text-[#101535]/90 font-light max-w-4xl mx-auto text-center [text-wrap:balance]">
          A garden at the center of it all. More than 10,000 square feet of wellness, social, and remote work spaces enveloping an enchanting private landscaped courtyard.
        </p>
      </section>

      {/* 2. ASYMMETRIC EDITORIAL BLOCK 1: Text Left + Image Right with Side Padding */}
      <section className="w-full py-12 md:py-20 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1500px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-rexton text-2xl sm:text-3xl md:text-4xl font-bold text-[#101535] uppercase page-heading">
              ENCHANTED COURTYARD & PRIVATE GARDENS
            </h3>
            <p className="font-sora page-body-p text-[#101535]/80 font-light">
              Designed by Paul Duesing & Partners, the central courtyard garden serves as a peaceful green sanctuary. Custom outdoor lounges, seasonal flora, and subtle evening sconces balance quiet reflection with intimate social gatherings.
            </p>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-7 w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden shadow-2xl">
            <img
              onClick={() => onImageClick( media('/images/amenities-courtyard-night.webp'), 'Enchanted Courtyard Garden')}
              src={media("/images/amenities-courtyard-night.webp")}
              alt="Courtyard Garden Evening"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 3. FULL-BLEED INTERIOR BANNER (Full Width & Full Screen) */}
      <section className="w-full h-screen overflow-hidden relative">
        <img
          src={media("/images/amenities-lobby.webp")}
          alt="Lobby & Social Lounge"
          className="w-full h-full object-cover object-center"
        />
      </section>

      {/* 4. CAROUSEL SLIDER SECTION (Matching Homepage LifestyleSection Exactly) */}
      <section className="bg-[#F4F5F8] text-[#101535] py-16 md:py-20 px-4 sm:px-8 lg:px-16 w-full border-y border-[#101535]/10 select-none">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Centered Heading */}
          <div className="text-center max-w-5xl mx-auto">
            <h2 className="font-rexton text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#101535] leading-tight tracking-tighter uppercase">
              <span className="sm:whitespace-nowrap">GATHER AND <span className="text-[#D6B585]">CREATE</span></span> <br className="hidden sm:inline" />
              <span className="sm:whitespace-nowrap"><span className="text-[#D6B585]">UNFORGETTABLE</span> MOMENTS.</span>
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
              Residents at The Eastline New York enjoy more than 10,000 square feet of amenities surrounding an enchanting private garden courtyard, all beautifully envisioned by renowned hospitality designer Paul Duesing & Partners.
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
              <picture className="w-full h-full block">
                <source media="(max-width: 767px)" srcSet={media("/images/amenities-lounge-mobile.webp")} />
                <img
                  onClick={() => {
                    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                    onImageClick(
                      isMobile ? '/images/amenities-lounge-mobile.webp' : media('/images/amenities-lounge.webp'),
                      'Recreation & Social Lounge'
                    );
                  }}
                  src={media("/images/amenities-lounge.webp")}
                  alt="Social Lounge"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
                />
              </picture>
            </div>
            <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
              <h3 className="font-rexton text-2xl sm:text-3xl md:text-4xl font-bold text-[#101535] uppercase page-heading">
                RECREATION & SOCIAL LOUNGE
              </h3>
              <p className="font-sora page-body-p text-[#101535]/80 font-light">
                State-of-the-art social spaces featuring plush seating, game tables, and private bar alcoves for effortlessly entertaining guests or relaxing after a long day.
              </p>
            </div>
          </div>
        </section>

        {/* Block B: Text Left + Image Right */}
        <section className="w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-rexton text-2xl sm:text-3xl md:text-4xl font-bold text-[#101535] uppercase page-heading">
                PRIVATE DINING & EVENT SUITE
              </h3>
              <p className="font-sora page-body-p text-[#101535]/80 font-light">
                An intimate, reservable venue equipped with a catering kitchen, executive dining table, and direct courtyard access for hosting formal dinners and milestone celebrations.
              </p>
            </div>
            <div className="lg:col-span-7 w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden shadow-2xl">
              <img
                onClick={() => onImageClick( media('/images/amenities-coworking.webp'), 'Private Dining & Event Suite')}
                src={media("/images/amenities-coworking.webp")}
                alt="Private Event Suite"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
              />
            </div>
          </div>
        </section>
      </div>

      {/* 6. FITNESS & WELLNESS SANCTUARY */}
      <section className="py-16 md:py-24 w-full text-center space-y-12">
        <div className="space-y-3 px-6 max-w-5xl mx-auto">
          <h2 className="font-rexton text-3xl sm:text-5xl font-bold tracking-tight text-[#101535] uppercase page-heading">
            STATELY FITNESS & WELLNESS CENTERS
          </h2>
          <p className="font-sora text-xs sm:text-sm tracking-[0.2em] font-medium text-[#D6B585] uppercase">
            Designed for Peak Vitality & Restoration
          </p>
        </div>

        {/* Full-bleed Fitness Center Photo: Full Screen Height */}
        <div
          onClick={() => {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            onImageClick(
              isMobile ? '/images/amenities-gym-mobile.webp' : media('/images/amenities-2-gym.webp'),
              'State-of-the-Art Fitness Center'
            );
          }}
          className="group cursor-pointer relative overflow-hidden w-full h-screen"
        >
          <picture className="w-full h-full block">
            <source media="(max-width: 767px)" srcSet={media("/images/amenities-gym-mobile.webp")} />
            <img
              src={media("/images/amenities-2-gym.webp")}
              alt="State-of-the-Art Fitness Center"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </picture>
        </div>

        {/* Sauna Side-by-Side Block with Side Padding */}
        <div className="w-full overflow-hidden text-left pt-6 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
            <div className="lg:col-span-7 w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden shadow-2xl">
              <img
                onClick={() => onImageClick( media('/images/amenities-sauna.webp'), 'Cedar Sauna & Thermal Spa')}
                src={media("/images/amenities-sauna.webp")}
                alt="Cedar Sauna"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
              />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-rexton text-2xl sm:text-3xl md:text-4xl font-bold text-[#101535] uppercase page-heading">
                CEDAR WOOD SAUNA & SPA
              </h3>
              <p className="font-sora page-body-p text-[#101535]/80 font-light">
                Reenergize in a Scandinavian cedar-lined thermal sauna featuring glowing heater stones, adjacent rain shower refresh stalls, and plush relaxation benches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FULL WIDTH BOTTOM FEATURE BANNER: Full Screen Height */}
      <section className="relative w-full h-screen overflow-hidden select-none">
        <img
          src={media("/images/amenities-5-golf.webp")}
          alt="PGA Golf Simulator & Lounge"
          className="w-full h-full object-cover object-center"
        />
      </section>

      {/* 8. INQUIRY & FOOTER */}
      <InquireSection initialResidence="" sideImage={media("/images/amenities-1-courtyard.webp")} />

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

