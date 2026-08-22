import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { media } from '../lib/media';
import { Footer } from './Footer';

interface ResidentHubPageProps {
  onOpenInquire: () => void;
}

interface HubLink {
  id: string;
  title: string;
  description: string;
  /** External portal URL; omit to route to the on-site contact section instead. */
  href?: string;
  cta: string;
}

const HUB_LINKS: HubLink[] = [
  {
    id: 'request',
    title: 'Request Center',
    description: 'Report maintenance issues or submit a building-related request directly to our team.',
    href: 'https://www.chessmanagementny.com/',
    cta: 'Submit a Request',
  },
  {
    id: 'smart-entry',
    title: 'Smart Entry',
    description: 'Grant guest access, manage doorbell alerts, or unlock your unit from anywhere.',
    href: 'https://accounts.butterflymx.com/login/new',
    cta: 'Access Smart Entry',
  },
  {
    id: 'payment',
    title: 'Make a Payment',
    description: 'Easily manage your account and pay your rent online through the resident portal.',
    href: 'https://chess.twa.rentmanager.com/',
    cta: 'Pay Rent Online',
  },
];

export const ResidentHubPage: React.FC<ResidentHubPageProps> = ({ onOpenInquire }) => {
  return (
    <>
      {/* Hero Band */}
      <section
        id="residenthub-hero"
        className="relative bg-[#101535] text-[#F4F5F8] pt-36 pb-20 sm:pt-44 sm:pb-24 px-6 md:px-12 overflow-hidden select-none"
      >
        {/* Ambient gold radial, matching footer treatment */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D6B585]/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <span className="font-sora text-[11px] tracking-[0.3em] font-semibold uppercase text-[#D6B585]">
            The Eastline New York
          </span>
          <h1 className="font-rexton text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.12em] uppercase">
            Resident Hub
          </h1>
          <div className="w-16 h-[2px] bg-[#D6B585] mx-auto" />
          <p className="font-sora text-sm sm:text-base text-[#F4F5F8]/80 max-w-xl mx-auto leading-relaxed">
            Everything you need to manage life at The Eastline — service requests,
            building access, and rent payments, all in one place.
          </p>
        </div>
      </section>

      {/* Hub Link Cards */}
      <section className="bg-[#ECE7DF] py-16 sm:py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {HUB_LINKS.map((link) => {
            const cardClass =
              'group flex flex-col text-left cursor-pointer bg-[#F4F5F8] border border-[#101535]/10 p-8 lg:p-10 shadow-sm hover:shadow-xl hover:border-[#D6B585] hover:-translate-y-1 transition-all duration-300';
            const cardContent = (
              <>
                <h2 className="font-sora text-sm tracking-[0.2em] font-bold uppercase text-[#101535] mb-3">
                  {link.title}
                </h2>

                <p className="font-sora text-sm text-[#1F261E]/70 leading-relaxed flex-grow">
                  {link.description}
                </p>

                <span className="mt-8 inline-flex items-center gap-2 font-sora text-[11px] tracking-[0.2em] font-bold uppercase text-[#101535] group-hover:text-[#B08D5B] transition-colors duration-300">
                  {link.cta}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </span>
              </>
            );

            return link.href ? (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {cardContent}
              </a>
            ) : (
              <button key={link.id} onClick={onOpenInquire} className={cardClass}>
                {cardContent}
              </button>
            );
          })}
        </div>

        {/* Assistance note */}
        <div className="max-w-6xl mx-auto mt-14 text-center">
          <p className="font-sora text-sm text-[#1F261E]/60">
            Need additional assistance? Reach our team at{' '}
            <a
              href="mailto:eastline@realnyproperties.com"
              className="text-[#101535] font-medium underline decoration-[#D6B585] underline-offset-4 hover:text-[#B08D5B] transition-colors"
            >
              eastline@realnyproperties.com
            </a>
          </p>
        </div>
      </section>

      {/* Full-width building photography (replaces the inquiry form — residents
          reach the team via the assistance note above or the homepage form) */}
      <section className="relative w-full h-screen overflow-hidden select-none border-y border-[#101535]/10">
        <picture className="w-full h-full block">
          <source
            media="(max-width: 767px)"
            srcSet={media('/images/building-corner-detail-dusk-wide-mobile.webp')}
          />
          <img
            src={media('/images/building-corner-detail-dusk-wide.webp')}
            alt="Corner residences at dusk · The Eastline New York"
            loading="lazy"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center"
          />
        </picture>
        <div className="absolute bottom-6 left-6 md:left-12 z-10">
          <span className="font-sora text-xs tracking-wider text-[#F4F5F8] bg-[#101535]/90 backdrop-blur-md px-5 py-2.5 rounded-none font-medium shadow-md border border-[#D6B585]/40">
            Corner Residences • 355 East 86th Street
          </span>
        </div>
      </section>

      <Footer onNavigateSection={() => {}} onOpenInquire={onOpenInquire} />
    </>
  );
};
