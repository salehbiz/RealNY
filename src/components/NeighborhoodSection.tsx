import { media } from '../lib/media';
import React from 'react';

interface NeighborhoodSectionProps {
  onExploreNeighborhood: () => void;
  onImageClick: (src: string, title: string) => void;
}

export const NeighborhoodSection: React.FC<NeighborhoodSectionProps> = ({
  onExploreNeighborhood,
  onImageClick,
}) => {
  const cards = [
    {
      src: media('/images/neighborhood-river-east.webp'),
      title: 'East River & Waterfront Vistas',
      subtitle: 'Panoramic river views and serene waterfront access',
    },
    {
      src: media('/images/neighborhood-central-park.webp'),
      title: 'Central Park & Midtown Parks',
      subtitle: 'Expansive lush greenery, parks, and tree-lined avenues',
    },
    {
      src: media('/images/neighborhood-3.webp'),
      title: 'Manhattan Skyline & Hospitality',
      subtitle: 'Premier dining, elevated lounges, and vibrant cultural energy',
    },
  ];

  return (
    <section id="neighborhood" className="bg-[#F4F5F8] text-[#101535] py-16 md:py-24 px-4 sm:px-8 lg:px-16 w-full border-b border-[#101535]/10 select-none">
      <div className="w-full space-y-10">
        {/* Centered Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-rexton text-[19px] font-bold text-[#101535] leading-[1.05] tracking-[-0.15em]">
            Where the Best of Manhattan <span className="text-[#D6B585]">Reveals Itself</span>
          </h2>
        </div>

        {/* 3-Column Image Grid (Without Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => onImageClick(card.src, `${card.title} - ${card.subtitle}`)}
              className="group cursor-pointer relative overflow-hidden w-full h-[400px] sm:h-[500px] lg:h-[580px]"
            >
              <img
                src={card.src}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>

        {/* Text & Action CTA */}
        <div className="max-w-3xl mx-auto text-center space-y-5 pt-2">
          <p className="font-sora text-[15.5px] tracking-[-0.05em] leading-[1.0] text-[#101535]/80 font-light max-w-2xl mx-auto text-center [text-wrap:balance]">
            Moments from Madison Square Park, Bryant Park, Midtown, and the cultural energy of NoMad, The Eastline New York offers a rare convergence of intimacy and access.
          </p>

          <div>
            <button
              onClick={onExploreNeighborhood}
              className="px-9 py-3.5 rounded-none bg-[#101535] text-[#D6B585] border border-[#D6B585]/30 hover:bg-[#242C5B] hover:scale-105 font-sora text-xs tracking-wider font-semibold uppercase transition-all duration-300 shadow-md cursor-pointer"
            >
              Explore Neighborhood Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
