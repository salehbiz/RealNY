import React from 'react';

interface IntroSectionProps {
  onScheduleClick: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onScheduleClick }) => {
  return (
    <section className="bg-[#ECE7DF] text-[#101535] py-14 md:py-20 px-6 sm:px-12 lg:px-20 w-full border-y border-[#101535]/10 select-none">
      <div className="w-full max-w-3xl mx-auto text-center space-y-5">

        {/* Paragraph */}
        <p
          data-typo-id="home-intro-body"
          data-typo-label="Home / Intro Paragraph"
          className="univ-p-body text-[#101535]/80 max-w-2xl mx-auto text-center [text-wrap:balance]"
        >
          The Eastline New York, at 355 East 86th Street, New York, NY 10028, is ideally positioned between Park and Madison Avenues on a rare, tree-lined block. This exceptional new Midtown condominium offers a sophisticated retreat in the heart of Manhattan. The Eastline New York places residents moments from Madison Square Park, Bryant Park, NoMad, and the very best of New York City living.
        </p>
        {/* CTA Button */}
        <div className="pt-1">
          <button
            onClick={onScheduleClick}
            className="px-4 py-1.5 rounded-none bg-[#101535] text-white border border-[#101535] hover:bg-[#242C5B] hover:scale-105 font-sora text-[9px] tracking-widest font-semibold uppercase transition-all duration-300 shadow-md cursor-pointer"
          >
            Schedule a Tour
          </button>
        </div>
      </div>
    </section>
  );
};
