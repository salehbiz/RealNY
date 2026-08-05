import { media } from '../lib/media';
import React from 'react';

interface NeighborhoodSectionProps {
  onImageClick: (src: string, title: string, groupImages?: { src: string; title?: string }[]) => void;
}

export const NeighborhoodSection: React.FC<NeighborhoodSectionProps> = ({
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
    <section id="neighborhood" className="bg-[#ECE7DF] text-[#101535] pt-20 pb-20 md:pt-[120px] md:pb-[120px] px-4 sm:px-8 lg:px-16 w-full border-b border-[#101535]/10 select-none">
      <div className="w-full">
        {/* Centered Heading with Balanced Spacing */}
        <div className="text-center max-w-4xl mx-auto pb-20 md:pb-[120px] flex justify-center items-center">
          <h2 className="font-rexton text-[26.5px] font-bold text-[#101535] leading-[1.2] tracking-[-0.15em]">
            Where the Best of Manhattan <span className="text-[28px] text-[#745831] tracking-[-0.08em] leading-[1.14] font-bold inline-block">Reveals Itself</span>
          </h2>
        </div>

        {/* 3-Column Image Grid (Without Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pb-20 md:pb-[120px]">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => onImageClick(
                card.src,
                `${card.title} - ${card.subtitle}`,
                cards.map(c => ({ src: c.src, title: `${c.title} - ${c.subtitle}` }))
              )}
              className="group cursor-pointer relative overflow-hidden w-full h-[400px] sm:h-[500px] lg:h-[580px]"
            >
              <img
                src={card.src}
                alt={card.title}
                loading="lazy"
                decoding="async"
                width={426}
                height={580}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>

        {/* Text & Action CTA */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <p className="font-sora text-[16.5px] tracking-[-0.04em] leading-[1.0] text-[#101535]/80 font-light max-w-2xl mx-auto text-center [text-wrap:balance]">
            ButterflyMX keyless entry and video intercom put building access, guest entry, and package delivery on your phone. Verizon Fios and Spectrum service are available throughout.
          </p>
        </div>
      </div>
    </section>
  );
};
