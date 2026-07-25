import React from 'react';

interface IntroSectionProps {
  onScheduleClick: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onScheduleClick }) => {
  return (
    <section className="bg-[#F4F5F8] text-[#101535] py-16 md:py-24 px-6 sm:px-12 lg:px-20 w-full border-y border-[#D6B585]/40 select-none">
      <div className="w-full max-w-6xl mx-auto text-center space-y-8">
        {/* Main Perfectly Balanced Paragraph Text using CSS text-wrap: balance */}
        <p className="font-sora text-sm sm:text-base md:text-lg leading-[1.6] text-[#101535]/90 font-light tracking-tight max-w-5xl mx-auto text-center [text-wrap:balance]">
          The Eastline New York, at 38 East 35th Street, is ideally positioned between Park and Madison Avenues on a rare, tree-lined block. This exceptional new Midtown condominium offers a sophisticated retreat in the heart of Manhattan. The Eastline New York places residents moments from Madison Square Park, Bryant Park, NoMad, and the very best of New York City living.
        </p>

        {/* Schedule a Tour Button with rounded-none */}
        <div className="pt-2">
          <button
            onClick={onScheduleClick}
            className="px-6 py-2.5 rounded-none bg-[#101535] text-white border border-[#101535] hover:bg-[#242C5B] hover:scale-105 font-sora text-[11px] tracking-widest font-semibold uppercase transition-all duration-300 shadow-md cursor-pointer"
          >
            Schedule a Tour
          </button>
        </div>
      </div>
    </section>
  );
};
