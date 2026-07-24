import { media } from '../lib/media';
import React, { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import FrameScrub from './FrameScrub';
import { getFrameTier, type FrameTier } from '../lib/frameTier';

interface HeroProps {
  onScheduleClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScheduleClick, onExploreClick }) => {
  const [tier] = useState<FrameTier>(getFrameTier);
  const [progress, setProgress] = useState(0);

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

  // Smoothly fade out text and overlay as soon as scroll starts (from progress 0 to ~0.08)
  const contentOpacity = Math.max(0, 1 - progress * 12);
  const pointerEvents = contentOpacity > 0.05 ? 'auto' : 'none';

  return (
    <section id="hero" className="w-full relative select-none bg-[#101535]">
      <FrameScrub
        frameCount={180}
        framePath={framePath}
        fallbackFramePath={tier && tier.dir === 'desktop-hq' ? fallbackFramePath : undefined}
        poster={media("/frames/hero/poster.webp")}
        scrollLengthVh={350}
        className="w-full"
        tierResolved={!!tier}
        pathKey={tier ? tier.dir : ''}
        onProgress={(prog) => setProgress(prog)}
      >
        {/* Subtle top overlay for top header clarity */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />

        {/* Overlay ONLY on the bottom part of the hero section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 pointer-events-none" />

        {/* Top Header Spacer */}
        <div className="pt-24 z-20 pointer-events-auto" />

        {/* Bottom-Centered Hero Content & Scroll CTA Container */}
        <div
          className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center mt-auto pb-14 md:pb-18 space-y-3 sm:space-y-4 transition-opacity duration-300 ease-out"
          style={{ opacity: contentOpacity, pointerEvents: pointerEvents as any }}
        >
          {/* Hero Title */}
          <div className="space-y-0.5 pt-1 w-full flex flex-col items-center">
            <h1 className="font-rexton text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-[#F4F5F8] whitespace-nowrap max-w-full drop-shadow-md">
              The Beauty of Being
            </h1>
            <p className="font-rexton text-base sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-[#D6B585] whitespace-nowrap max-w-full drop-shadow-md">
              Between Park & Madison
            </p>
          </div>

          {/* Hero Copy */}
          <p className="font-sora text-xs sm:text-sm tracking-wide text-[#F4F5F8]/90 font-light max-w-xl leading-relaxed drop-shadow-sm">
            The Eastline New York, at 38 East 35th Street, is ideally positioned between Park and Madison Avenues on a rare, tree-lined block.
          </p>

          {/* Schedule a Tour Button */}
          <div className="pt-1">
            <button
              onClick={onScheduleClick}
              className="px-8 py-3 rounded-full bg-[#D6B585] text-[#101535] hover:bg-[#E8CA9D] hover:scale-105 font-sora text-xs tracking-wider font-bold uppercase transition-all duration-300 shadow-xl cursor-pointer"
            >
              Schedule a Private Tour
            </button>
          </div>

          {/* Scroll to Explore CTA (Minimal) */}
          <div className="pt-2">
            <button
              onClick={onExploreClick}
              className="flex flex-col items-center gap-1 group cursor-pointer opacity-85 hover:opacity-100 transition-opacity"
              aria-label="Scroll down"
            >
              <span className="font-sora text-[10px] tracking-[0.25em] font-medium text-[#D6B585] uppercase">
                Scroll to Explore
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#D6B585] animate-bounce" />
            </button>
          </div>
        </div>
      </FrameScrub>
    </section>
  );
};
