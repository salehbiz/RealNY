import { media } from '../lib/media';
import React, { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import FrameScrub from './FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

interface HeroProps {
  onScheduleClick?: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [tier] = useState<FrameTier>(getFrameTier);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);

  // Exact tuned filter: brightness(1.16) contrast(0.84) saturate(0.88)
  const activeFilterStyle = 'brightness(1.16) contrast(0.84) saturate(0.88)';

  const framePath = useCallback(
    (i: number) => {
      return tier ? media(`/frames/hero/${tier.dir}/${String(i).padStart(4, '0')}.${tier.ext}`) : '';
    },
    [tier]
  );

  const fallbackFramePath = useCallback(
    (i: number) => {
      return tier && tier.dir === 'desktop-hq'
        ? media(`/frames/hero/desktop/${String(i).padStart(4, '0')}.webp`)
        : '';
    },
    [tier]
  );

  // Smoothly fade out text and overlay as soon as scroll starts past frame 2
  const contentOpacity = currentFrame > 2 ? 0 : Math.max(0, 1 - progress * 10);

  // River East text overlay opacity (Frames 2 - 17)
  let riverEastOpacity = 0;
  if (currentFrame >= 2 && currentFrame <= 17) {
    if (currentFrame < 4) {
      riverEastOpacity = (currentFrame - 1) / 3;
    } else if (currentFrame > 14) {
      riverEastOpacity = (17 - currentFrame) / 3;
    } else {
      riverEastOpacity = 1;
    }
  }

  // Neighborhood text overlay opacity (Frames 30 - 61)
  let neighborhoodOpacity = 0;
  if (currentFrame >= 30 && currentFrame <= 61) {
    if (currentFrame < 33) {
      neighborhoodOpacity = (currentFrame - 30) / 3;
    } else if (currentFrame > 58) {
      neighborhoodOpacity = (61 - currentFrame) / 3;
    } else {
      neighborhoodOpacity = 1;
    }
  }

  // The Eastline New York text overlay opacity (Frames 62 - 101)
  let eastlineOpacity = 0;
  if (currentFrame >= 62 && currentFrame <= 101) {
    if (currentFrame < 65) {
      eastlineOpacity = (currentFrame - 62) / 3;
    } else if (currentFrame > 98) {
      eastlineOpacity = (101 - currentFrame) / 3;
    } else {
      eastlineOpacity = 1;
    }
  }

  // Lobby text overlay opacity (Frames 118 - 178)
  let lobbyOpacity = 0;
  if (currentFrame >= 118 && currentFrame <= 178) {
    if (currentFrame < 121) {
      lobbyOpacity = (currentFrame - 117) / 3;
    } else if (currentFrame > 175) {
      lobbyOpacity = (178 - currentFrame) / 3;
    } else {
      lobbyOpacity = 1;
    }
  }

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

  return (
    <section id="hero" className="w-full relative select-none bg-[#101535]">
      <FrameScrub
        frameCount={180}
        framePath={framePath}
        fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
        poster={media("/frames/hero/poster.webp")}
        posterBase="/frames/hero"
        scrollLengthVh={350}
        className="w-full"
        eager={true}
        deferUntilLoad={true}
        tierResolved={!!tier}
        pathKey={tier ? tier.dir : ''}
        filterStyle={activeFilterStyle}
        onProgress={(prog, frame) => {
          setProgress(prog);
          if (frame) setCurrentFrame(frame);
        }}
      >


        {/* Frame 2 - 17: East River Text Overlay */}
        <div
          className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-32 sm:bottom-28 z-30 w-[95vw] sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-2 sm:px-0"
          style={{ opacity: riverEastOpacity }}
        >
          <h2 className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D6B585] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            East River
          </h2>
          <p className="font-sora text-[9.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            <span className="sm:hidden">Where Manhattan meets the water, a rare stretch<br />of calm along the East River's edge.</span>
            <span className="hidden sm:inline">Where Manhattan meets the water, a rare stretch of calm<br />along the East River's edge.</span>
          </p>
        </div>

        {/* Frame 30 - 61: Welcome to the Upper East Side Text Overlay */}
        <div
          className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-32 sm:bottom-28 z-30 w-[95vw] sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-2 sm:px-0"
          style={{ opacity: neighborhoodOpacity }}
        >
          <h2 className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D6B585] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            Welcome to the Upper East Side
          </h2>
          <p className="font-sora text-[9.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            <span className="sm:hidden block">
              <span className="whitespace-nowrap block">A quieter side of Manhattan, where leafy streets</span>
              <span className="whitespace-nowrap block">meet the river and the city stays within reach.</span>
            </span>
            <span className="hidden sm:inline">A quieter side of Manhattan, where leafy streets meet the open river<br />and the whole city stays within reach.</span>
          </p>
        </div>

        {/* Frame 62 - 101: The Eastline New York Text Overlay */}
        <div
          className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-32 sm:bottom-28 z-30 w-[95vw] sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-2 sm:px-0"
          style={{ opacity: eastlineOpacity }}
        >
          <h2 className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D6B585] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            The Eastline New York
          </h2>
          <p className="font-sora text-[9.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            <span className="sm:hidden">The Eastline New York rises where the city quiets,<br />a modern address built for calm and everyday ease.</span>
            <span className="hidden sm:inline">The Eastline New York rises where the city quiets,<br />a modern address built for calm, light, and everyday ease.</span>
          </p>
        </div>

        {/* Frame 118 - 178: Step into Luxury Text Overlay */}
        <div
          className="absolute left-0 right-0 mx-auto sm:left-12 sm:right-auto sm:mx-0 bottom-32 sm:bottom-28 z-30 w-[95vw] sm:w-auto max-w-xl sm:max-w-3xl space-y-1 sm:space-y-1.5 pointer-events-none transition-opacity duration-300 ease-out text-center sm:text-left px-2 sm:px-0"
          style={{ opacity: lobbyOpacity }}
        >
          <h2 className="font-rexton text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D6B585] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            Step into Luxury
          </h2>
          <p className="font-sora text-[9.5px] sm:text-xs md:text-sm font-light tracking-tight sm:tracking-wide text-[#F4F5F8] leading-snug sm:leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            <span className="sm:hidden">Step inside to a warm, light-filled lobby<br />where the city softens and home begins.</span>
            <span className="hidden sm:inline">Step inside to a warm, light-filled lobby<br />where the city softens and home begins.</span>
          </p>
        </div>

        {/* Top-only header overlay for button & logo clarity */}
        <div className="absolute top-0 left-0 right-0 h-20 sm:h-24 bg-gradient-to-b from-black/75 via-black/35 to-transparent z-10 pointer-events-none" />

        {/* Overlay ONLY on the bottom part of the hero section */}
        <div className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 bg-gradient-to-t from-black/35 via-black/10 to-transparent z-10 pointer-events-none" />

        {/* Top Header Spacer */}
        <div className="pt-24 z-20 pointer-events-auto" />

        {/* Bottom Hero CTAs Bar (Centered on Desktop, Side-by-Side on Mobile) */}
        <div
          className="absolute bottom-16 sm:bottom-8 md:bottom-12 left-0 right-0 z-30 px-5 sm:px-10 flex items-center justify-between sm:justify-center pointer-events-none transition-opacity duration-300 ease-out"
          style={{ opacity: contentOpacity }}
        >
          {/* Centered Scroll to Explore on Desktop */}
          <div className="flex flex-col items-center gap-1 opacity-90 select-none pointer-events-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            <span className="font-sora text-[9.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.25em] font-medium text-[#D6B585] uppercase">
              Scroll to Explore
            </span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D6B585] animate-bounce" />
          </div>

          {/* Right-Aligned Skip Intro Button */}
          <button
            onClick={handleSkipIntro}
            className="sm:absolute sm:right-10 flex flex-col items-center gap-1 pointer-events-auto opacity-85 hover:opacity-100 transition-opacity cursor-pointer group drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
            aria-label="Skip the intro"
          >
            <span className="font-sora text-[9.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.25em] font-medium text-[#D6B585] uppercase">
              Skip the intro
            </span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D6B585] animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </FrameScrub>
    </section>
  );
};
