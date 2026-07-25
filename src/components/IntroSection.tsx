import React from 'react';

interface IntroSectionProps {
  onScheduleClick: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onScheduleClick }) => {
  return (
    <section className="bg-[#F4F5F8] text-[#101535] py-14 md:py-20 px-6 sm:px-12 lg:px-20 w-full border-y border-[#101535]/10 select-none">
      <div className="w-full max-w-3xl mx-auto text-center space-y-5">
        {/* Eyebrow Label */}
        <p
          data-typo-id="home-intro-label"
          data-typo-label="Home / Eyebrow Label"
          className="font-sora text-[10px] tracking-[0.28em] font-semibold text-[#101535] uppercase"
        >
          MIDTOWN MANHATTAN
        </p>
        {/* Paragraph */}
        <p
          data-typo-id="home-intro-body"
          data-typo-label="Home / Intro Paragraph"
          className="font-sora text-sm md:text-[15px] leading-[1.65] text-[#101535]/80 font-light tracking-tight max-w-2xl mx-auto text-center [text-wrap:balance]"
        >
          The Eastline New York, at 38 East 35th Street, is ideally positioned between Park and Madison Avenues on a rare, tree-lined block. This exceptional new Midtown condominium offers a sophisticated retreat in the heart of Manhattan. The Eastline New York places residents moments from Madison Square Park, Bryant Park, NoMad, and the very best of New York City living.
        </p>
        {/* CTA Button */}
        <div className="pt-1">
          <button
            onClick={onScheduleClick}
            className="px-6 py-2.5 rounded-none bg-[#101535] text-white border border-[#101535] hover:bg-[#242C5B] hover:scale-105 font-sora text-[10px] tracking-widest font-semibold uppercase transition-all duration-300 shadow-md cursor-pointer"
          >
            Schedule a Tour
          </button>
        </div>
      </div>
    </section>
  );
};
