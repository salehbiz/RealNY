import React, { useState, useCallback, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import FrameScrub from './FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';
import { media } from '../lib/media';

interface HeroProps {
  onScheduleClick?: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [tier, setTier] = useState<FrameTier>(getFrameTier);

  React.useEffect(() => {
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

  const framePath = useCallback(
    (i: number) => {
      return tier ? media(`/frames/hero/${tier.dir}/${String(i).padStart(4, '0')}.${tier.ext}`) : '';
    },
    [tier]
  );

  const fallbackFramePath = useCallback(
    (i: number) => {
      if (!tier) return '';
      if (tier.dir === 'desktop-hq' || tier.dir === 'mobile') {
        return media(`/frames/hero/desktop/${String(i).padStart(4, '0')}.webp`);
      }
      return '';
    },
    [tier]
  );

  const handleSkipIntro = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onExploreClick();
    const introEl = document.getElementById('intro');
    if (introEl) {
      introEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        window.scrollTo({
          top: heroSection.offsetTop + heroSection.offsetHeight,
          behavior: 'smooth',
        });
      }
    }
  };

  // DOM Refs for scroll-driven text overlays
  const neighborhoodRef = useRef<HTMLDivElement>(null);
  const eastlineRef = useRef<HTMLDivElement>(null);
  const lobbyRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  return (
    <section id="hero" className="w-full relative select-none bg-[#101535]">
      <FrameScrub
        frameCount={180}
        framePath={framePath}
        fallbackFramePath={fallbackFramePath}
        poster={media("/frames/hero/poster.webp")}
        posterBase="/frames/hero"
        scrollLengthVh={350}
        className="w-full"
        eager={true}
        tierResolved={!!tier}
        pathKey={tier ? tier.dir : ''}
        onProgress={(prog, frame) => {
          const frameNum = frame || 1;

          // 1. CTAs opacity
          const contentOpacity = frameNum > 2 ? 0 : Math.max(0, 1 - prog * 10);
          if (ctasRef.current) {
            ctasRef.current.style.opacity = String(contentOpacity);
            ctasRef.current.style.pointerEvents = contentOpacity > 0 ? 'auto' : 'none';
          }



          // 3. Neighborhood text overlay opacity (Frames 30 - 61)
          let neighborhoodOpacity = 0;
          if (frameNum >= 30 && frameNum <= 61) {
            if (frameNum < 33) {
              neighborhoodOpacity = (frameNum - 30) / 3;
            } else if (frameNum > 58) {
              neighborhoodOpacity = (61 - frameNum) / 3;
            } else {
              neighborhoodOpacity = 1;
            }
          }
          if (neighborhoodRef.current) {
            neighborhoodRef.current.style.opacity = String(neighborhoodOpacity);
          }

          // 4. The Eastline New York text overlay opacity (Frames 62 - 101)
          let eastlineOpacity = 0;
          if (frameNum >= 62 && frameNum <= 101) {
            if (frameNum < 65) {
              eastlineOpacity = (frameNum - 62) / 3;
            } else if (frameNum > 98) {
              eastlineOpacity = (101 - frameNum) / 3;
            } else {
              eastlineOpacity = 1;
            }
          }
          if (eastlineRef.current) {
            eastlineRef.current.style.opacity = String(eastlineOpacity);
          }

          // 5. Lobby text overlay opacity (Frames 118 - 178)
          let lobbyOpacity = 0;
          if (frameNum >= 118 && frameNum <= 178) {
            if (frameNum < 121) {
              lobbyOpacity = (frameNum - 117) / 3;
            } else if (frameNum > 175) {
              lobbyOpacity = (178 - frameNum) / 3;
            } else {
              lobbyOpacity = 1;
            }
          }
          if (lobbyRef.current) {
            lobbyRef.current.style.opacity = String(lobbyOpacity);
          }
        }}
      >


        {/* Frame 30 - 61: Welcome to the Upper East Side Text Overlay */}
        <div
          ref={neighborhoodRef}
          className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-36 sm:bottom-28 z-30 w-full sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-4 sm:px-0"
          style={{ opacity: 0 }}
        >
          <h2
            data-typo-id="hero-f2-h2"
            data-typo-label="[Hero Section] Heading 2: Welcome to Upper East Side"
            className="font-rexton text-[10px] xs:text-[11px] sm:text-sm md:text-base font-bold tracking-[0.16em] sm:tracking-[0.25em] text-[#D6B585] uppercase whitespace-nowrap sm:whitespace-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            Welcome to The Upper East Side
          </h2>
          <p
            data-typo-id="hero-f2-p"
            data-typo-label="[Hero Section] Paragraph 2: Welcome to Upper East Side"
            className="font-sora text-[7px] xs:text-[7.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            <span className="sm:hidden block">
              A quieter side of Manhattan, where tree-lined streets<br />
              meet all the shopping & transit conveniences.
            </span>
            <span className="hidden sm:inline">A quieter side of Manhattan, where tree-lined streets<br />meet all the shopping & transit conveniences.</span>
          </p>
        </div>

        {/* Frame 62 - 101: The Eastline New York Text Overlay */}
        <div
          ref={eastlineRef}
          className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-36 sm:bottom-28 z-30 w-full sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-4 sm:px-0"
          style={{ opacity: 0 }}
        >
          <h2
            data-typo-id="hero-f3-h2"
            data-typo-label="[Hero Section] Heading 3: The Eastline New York"
            className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D6B585] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            THE EASTLINE
          </h2>
          <p
            data-typo-id="hero-f3-p"
            data-typo-label="[Hero Section] Paragraph 3: The Eastline New York"
            className="font-sora text-[6.2px] xs:text-[6.8px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            23-stories tall with over fifteen amenity spaces between them.<br />
            198 spectacular homes, ranging from studios to three-bedrooms<br />
            with private outdoor spaces in select units.
          </p>
        </div>

        {/* Frame 118 - 178: Step into Luxury Text Overlay */}
        <div
          ref={lobbyRef}
          className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-36 sm:bottom-28 z-30 w-full sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-4 sm:px-0"
          style={{ opacity: 0 }}
        >
          <h2
            data-typo-id="hero-f4-h2"
            data-typo-label="[Hero Section] Heading 4: Step into Luxury"
            className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            Ready to Experience<br />a New Line of Luxury?
          </h2>
        </div>

        {/* Top-only header overlay for button & logo clarity */}
        <div className="absolute top-0 left-0 right-0 h-20 sm:h-24 bg-gradient-to-b from-black/75 via-black/35 to-transparent z-10 pointer-events-none" />

        {/* Overlay ONLY on the bottom part of the hero section */}
        <div className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 bg-gradient-to-t from-black/35 via-black/10 to-transparent z-10 pointer-events-none" />

        {/* Top Header Spacer */}
        <div className="pt-24 z-20 pointer-events-auto" />

        {/* Bottom Hero CTAs Bar (Centered on Desktop & Mobile, Parallel Skip Intro on Left for Mobile) */}
        <div
          ref={ctasRef}
          className="absolute bottom-24 sm:bottom-8 md:bottom-12 left-0 right-0 z-30 px-5 sm:px-10 flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-out"
          style={{ opacity: 1 }}
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
      </FrameScrub>
    </section>
  );
};
