import { media } from '../lib/media';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    subLabel: 'The Materials',
    startFrame: 1,
    description: 'Pale fluted upper cabinetry over light oak below, with stone countertops — or grey fluted uppers over grey lowers, same stone, same architecture.',
  },
  {
    id: 'kitchen-island',
    name: 'Kitchen Appliances',
    subLabel: 'The Features',
    startFrame: 31,
    description: 'A full electric appliance suite: range, refrigerator, dishwasher, and countertop microwave from GE and LG, with Fisher & Paykel appliances in select residences.',
  },
  {
    id: 'living-room',
    name: 'Living Room',
    subLabel: 'Light-Flooded',
    startFrame: 61,
    description: 'Ceilings reach up to nine feet. Floor-to-ceiling windows deliver daylight deep into the plan, and select residences carry double exposures, private balconies, or terraces.',
  },
  {
    id: 'bedroom',
    name: 'The Bedroom',
    subLabel: 'A Quiet Escape',
    startFrame: 91,
    description: 'Blackout shades installed before move-in, with individually controlled central heating and cooling.',
  },
  {
    id: 'primary-bath',
    name: 'Primary Bathroom',
    subLabel: 'Spa-Like',
    startFrame: 121,
    description: 'The same discipline, in two registers. A dark scheme in charcoal and black marble-look porcelain, carried floor to ceiling. A light scheme in pale marble-look porcelain, equally continuous, with lighter shower tiling.',
  },
  {
    id: 'guest-bath',
    name: 'Typical Bathroom',
    subLabel: 'Refreshingly Calm',
    startFrame: 151,
    description: 'Typical bathrooms pair a dark charcoal floor with light marble-look walls and a darker lower band, or run light porcelain floor to ceiling throughout; Italian porcelain, specified for depth of veining rather than sheen.',
  },
];

interface ResidencesPageProps {
  onSelectResidence: (residence: Residence) => void;
  onOpenInquireWithName: (name: string) => void;
  onNavigatePage: (page: 'home' | 'residences' | 'amenities') => void;
  onImageClick: (src: string, title: string, groupImages?: { src: string; title?: string }[]) => void;
}

export const ResidencesPage: React.FC<ResidencesPageProps> = ({
  onSelectResidence,
  onOpenInquireWithName,
  onNavigatePage,
  onImageClick,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSliderMobile, setIsSliderMobile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo === 'availability') {
      // Clear location state to avoid re-triggering scrolling on refresh/history events
      navigate(location.pathname, { replace: true, state: {} });
      setTimeout(() => {
        const el = document.getElementById('availability');
        if (el) {
          el.scrollIntoView();
        }
      }, 150);
    }
  }, [location, navigate]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0;
    }
    const handleResize = () => {
      setIsSliderMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [tier, setTier] = useState<FrameTier>(getFrameTier);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const newTier = getFrameTier();
      setTier((prev) => (prev.dir !== newTier.dir ? newTier : prev));
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const handleSkipIntro = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const heroSection = document.getElementById('residences-hero');
    if (heroSection) {
      window.scrollTo({
        top: heroSection.offsetTop + heroSection.offsetHeight,
        behavior: 'smooth',
      });
    }
  };

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
      if (!tier) return '';
      if (tier.dir === 'desktop-hq' || tier.dir === 'mobile') {
        return media(`/frames/residences/desktop/${String(i).padStart(4, '0')}.webp`);
      }
      return '';
    },
    [tier]
  );

  const contentOpacity = Math.max(0, 1 - progress * 12);
  const roomLabelOpacity = Math.min(1, Math.max(0, (progress - 0.04) * 20));

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
      sliderRef.current.scrollBy({ left: -(cardWidth + 32), behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild?.getBoundingClientRect().width || 340;
      sliderRef.current.scrollBy({ left: cardWidth + 32, behavior: 'smooth' });
    }
  };

  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.firstElementChild?.getBoundingClientRect().width || 340;
    const index = Math.round(sliderRef.current.scrollLeft / (cardWidth + 32));
    const maxIdx = isSliderMobile ? sliderCards.length - 1 : sliderCards.length - 2;
    setActiveSlide(Math.max(0, Math.min(maxIdx, index)));
  };

  return (
    <div className="bg-[#ECE7DF] text-[#101535] min-h-screen font-sans selection:bg-[#D6B585] selection:text-[#101535] w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION: Canvas Frame-Scrubbed Video Hero */}
      <section id="residences-hero" className="w-full relative select-none bg-[#101535]">
        <FrameScrub
          frameCount={180}
          framePath={framePath}
          fallbackFramePath={fallbackFramePath}
          poster={media("/frames/residences/poster.webp")}
          posterBase="/frames/residences"
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

          {/* Bottom Hero CTAs Bar (Centered on Desktop & Mobile, Parallel Skip Intro on Left for Mobile) */}
          <div
            className="absolute bottom-24 sm:bottom-8 md:bottom-12 left-0 right-0 z-30 px-5 sm:px-10 flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-out"
            style={{ opacity: contentOpacity }}
          >
            {/* Skip Intro Button: Parallel on Left on Mobile, Right on Desktop */}
            <button
              onClick={handleSkipIntro}
              className="absolute left-5 sm:left-auto sm:right-10 flex flex-col sm:flex-col items-start sm:items-center gap-0.5 sm:gap-1 pointer-events-auto opacity-75 sm:opacity-85 hover:opacity-100 transition-opacity cursor-pointer group drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
              aria-label="Skip the intro"
            >
              <span className="font-sora text-[9px] sm:text-[10px] tracking-[0.05em] sm:tracking-[-0.015em] leading-[1.5] font-medium text-white/90 sm:text-white uppercase border-b border-white/30 sm:border-none pb-0.5 sm:pb-0">
                Skip the intro
              </span>
              <ChevronDown className="hidden sm:block w-3 h-3 sm:w-3.5 sm:h-3.5 text-white animate-bounce group-hover:translate-y-0.5 transition-transform" />
            </button>

            {/* Centered Scroll to Explore */}
            <div className="flex flex-col items-center gap-1 opacity-90 select-none pointer-events-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              <span className="font-sora text-[10px] tracking-[-0.015em] leading-[1.5] font-medium text-white uppercase">
                Scroll to Explore
              </span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white animate-bounce" />
            </div>
          </div>

          {/* Pinned Bottom-Left Room Label Overlay (Fades in as user scrubs sequence) */}
          <div
            className="absolute bottom-28 left-4 sm:bottom-12 sm:left-12 md:left-16 z-30 flex flex-col items-start pointer-events-none transition-opacity duration-300 ease-out max-w-[210px] sm:max-w-sm md:max-w-md px-1 sm:px-0"
            style={{ opacity: roomLabelOpacity }}
          >
            <div key={activeRoom.id} className="transition-opacity duration-300 ease-out space-y-0.5">
              {activeRoom.subLabel && (
                <span className="univ-label-eyebrow text-[#D6B585] block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {activeRoom.subLabel}
                </span>
              )}
              <h2 className="univ-h2-overlay text-[#F4F5F8] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {activeRoom.name}
              </h2>
              {activeRoom.description && (
                <p className="univ-p-body text-[#F4F5F8]/85 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pt-0.5">
                  {activeRoom.description}
                </p>
              )}
            </div>
          </div>
        </FrameScrub>
      </section>

      {/* Intro Subtitle Block */}
      <section className="bg-[#ECE7DF] text-[#101535] py-14 md:py-20 px-6 md:px-16 w-full border-y border-[#101535]/10 select-none">
        <div className="w-full max-w-3xl mx-auto text-center space-y-5">

          <p
            data-typo-id="res-intro-body"
            data-typo-label="Residences / Intro Paragraph"
            className="univ-p-body text-[#101535]/80 max-w-2xl mx-auto text-center [text-wrap:balance]"
          >
            198 residences, studio through three-bedroom, designed around the two things Manhattan apartments most often surrender: light and storage. Ceilings reach up to nine feet over engineered prefinished hardwood. Every residence includes custom built-out closets, installed window treatments: blackout shades in the bedrooms, privacy shades in the living areas, individually controlled central heating and cooling, and a vented in-home LG washer and dryer. Select residences carry double exposures, private balconies, and/or terraces.*
          </p>
        </div>
      </section>

      {/* 2. ASYMMETRIC EDITORIAL BLOCK 1: Text Left + Image Right with Side Padding */}
      <section className="w-full py-12 md:py-20 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1500px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="univ-h2-section text-[#101535] uppercase">
              LIGHT AND STORAGE, BOTH DESIGNED RATHER THAN IMPROVISED
            </h3>
            <p className="univ-p-body text-[#101535]/80">
              The closets are built out, not left to the resident. The window treatments are installed, not budgeted for later. The heating and cooling are controlled residence by residence. These are the decisions that determine how a home actually lives.
            </p>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-7 w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden shadow-2xl">
            <img
              onClick={() => onImageClick( media('/images/residences-living-room.webp'), 'Sunlit Living Room')}
              src={media("/images/residences-living-room.webp")}
              alt="Living Room Interior"
              loading="lazy"
              decoding="async"
              width={875}
              height={650}
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
          loading="lazy"
          decoding="async"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-center"
        />
      </section>

      {/* 4. CAROUSEL SLIDER SECTION (Matching Homepage LifestyleSection Exactly) */}
      <section className="bg-[#ECE7DF] text-[#101535] py-16 md:py-20 px-4 sm:px-8 lg:px-16 w-full border-y border-[#101535]/10 select-none">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Centered Heading */}
          <div className="text-center max-w-4xl mx-auto px-4">
            <h2 className="univ-h2-section text-[#101535] uppercase [text-wrap:balance]">
              AN UNWAIVERING ATTENTION TO DETAIL, <span className="text-[#D6B585]">PERFECTED.</span>
            </h2>
          </div>

          {/* Carousel Slider Container */}
          <div className="relative w-full group/slider">
            {/* Left Arrow Button */}
            <button
              onClick={handleScrollLeft}
              disabled={activeSlide === 0}
              className={`absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#101535] text-white border border-white/25 flex items-center justify-center shadow-md hover:bg-[#242C5B] hover:scale-110 transition-all cursor-pointer ${
                activeSlide === 0 ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''
              }`}
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={handleScrollRight}
              disabled={activeSlide === (isSliderMobile ? sliderCards.length - 1 : sliderCards.length - 2)}
              className={`absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#101535] text-white border border-white/25 flex items-center justify-center shadow-md hover:bg-[#242C5B] hover:scale-110 transition-all cursor-pointer ${
                activeSlide === (isSliderMobile ? sliderCards.length - 1 : sliderCards.length - 2) ? 'opacity-40 cursor-not-allowed hover:scale-100' : ''
              }`}
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
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
                  onClick={() => onImageClick(
                    card.src,
                    card.title,
                    sliderCards.map(c => ({ src: c.src, title: c.title }))
                  )}
                  className="group cursor-pointer relative overflow-hidden w-full md:w-[calc(50%-16px)] shrink-0 snap-start aspect-[16/10]"
                >
                  <img
                    src={card.src}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    width={624}
                    height={390}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-none"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>

            {/* Slide Indicator Dots */}
            <div className="flex justify-center items-center gap-2 pt-4">
              {(isSliderMobile ? sliderCards : sliderCards.slice(0, sliderCards.length - 1)).map((_, idx) => (
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
            <p className="univ-p-body text-[#101535]/80 max-w-2xl mx-auto text-center [text-wrap:balance]">
              Two palettes run through the building, each built on the same architecture of fluted cabinetry and stone. The first pairs pale fluted uppers with light oak below, warm, quiet, grain-forward. The second runs grey fluted uppers over grey lowers for something cooler and more graphic. Stone countertops in both, with a full electric appliance suite from GE and LG: range, refrigerator, dishwasher, and countertop microwave. Fisher &amp; Paykel appliances in select residences.*
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
                loading="lazy"
                decoding="async"
                width={875}
                height={650}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
              />
            </div>
            <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
              <h3 className="univ-h2-section text-[#101535] uppercase">
                SPA-INSPIRED BATHROOMS
              </h3>
              <p className="univ-p-body text-[#101535]/80">
                The same discipline, in two registers. Primary baths run either dark, charcoal and black marble-look porcelain, floor to ceiling, or light, in marble-look porcelain carried the same full height with lighter shower tiling. Typical baths pair a dark charcoal floor with light marble-look walls and a darker lower band, or run light porcelain floor to ceiling throughout, in Italgraniti tile. Walk-in showers are finished with frameless glass; select residences include soaking tubs with fixed glass panels.* Recessed medicine cabinets with integrated mirrors keep the wall plane clean.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* 6. PENTHOUSE & TERRACES FEATURE SECTION */}
      <section className="py-16 md:py-24 w-full text-center space-y-12">
        {/* Full-bleed Terrace View Photo: Full Screen Height */}
        <div
          onClick={() => onImageClick( media('/images/middle-section-image.webp'), 'Penthouse Setback Terrace')}
          className="group cursor-pointer relative overflow-hidden w-full h-screen"
        >
          <img
            src={media("/images/middle-section-image.webp")}
            alt="Penthouse Terrace"
            loading="lazy"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </section>

      {/* 7. AVAILABLE RESIDENCES INTERACTIVE TABLE SECTION */}
      <section id="availability" className="py-12 bg-[#ECE7DF]">
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

