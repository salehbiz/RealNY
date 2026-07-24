import { media } from '../lib/media';
import React from 'react';
import { MapPin, Mail, Phone, ChevronRight, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (id: string) => void;
  onOpenInquire: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenInquire }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Building & Skyline', id: 'skyline' },
    { label: 'Residences', id: 'residences' },
    { label: 'Amenities', id: 'amenities' },
    { label: 'Neighborhood', id: 'neighborhood' },
    { label: 'Availability', id: 'availability' },
  ];

  return (
    <footer className="bg-[#0B0F28] text-[#F4F5F8] pt-16 pb-12 px-6 md:px-12 border-t border-[#D6B585]/30 relative overflow-hidden font-sans-clean select-none">
      {/* Background Decorative Gold Ambient Radial */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D6B585]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Main Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pt-4">
          {/* Col 1: Brand & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={scrollToTop}>
              <img
                src={media("/brand/Icon_Gold.svg")}
                alt="The Eastline Crest"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <img
                src={media("/brand/Wordmark_Gold.svg")}
                alt="The Eastline New York"
                className="h-8 w-auto object-contain"
              />
            </div>

            <p className="font-sora text-xs text-[#F4F5F8]/70 leading-relaxed max-w-sm">
              Luxury boutique condominiums positioned between Park and Madison Avenues in Midtown Manhattan.
            </p>

            <div className="space-y-3 font-sora text-xs text-[#F4F5F8]/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D6B585] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Building Location:</strong>
                  <span>38 East 35th Street, New York, NY 10016</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D6B585] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Sales Gallery:</strong>
                  <span>35A East 35th Street, 2nd Floor</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Mail className="w-4 h-4 text-[#D6B585] shrink-0" />
                <a
                  href="mailto:hello@theeastlinenyc.com"
                  className="text-[#D6B585] hover:text-white hover:underline transition-colors font-medium"
                >
                  hello@theeastlinenyc.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-sora text-xs tracking-[0.25em] font-semibold text-[#D6B585] uppercase border-b border-[#D6B585]/20 pb-3">
              Explore Residence
            </h2>
            <ul className="space-y-2.5 font-sora text-xs text-[#F4F5F8]/80">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigateSection(item.id)}
                    className="flex items-center gap-2 group hover:text-[#D6B585] transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#D6B585]/50 group-hover:text-[#D6B585] group-hover:translate-x-1 transition-all" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenInquire}
                  className="flex items-center gap-2 group text-[#D6B585] hover:text-white transition-colors cursor-pointer font-medium pt-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#D6B585] group-hover:translate-x-1 transition-all" />
                  <span>Inquire Now</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Development Team (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-sora text-xs tracking-[0.25em] font-semibold text-[#D6B585] uppercase border-b border-[#D6B585]/20 pb-3">
              Development Partners
            </h2>
            
            <div className="space-y-5 pt-1">
              <div className="space-y-1">
                <span className="block font-sora text-[10px] tracking-wider uppercase text-[#F4F5F8]/50">
                  Developer & Sponsor
                </span>
                <img
                  src={media("/img/continuum-logo.webp")}
                  alt="Continuum Company"
                  className="h-7 w-auto object-contain brightness-200 contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="space-y-1">
                <span className="block font-sora text-[10px] tracking-wider uppercase text-[#F4F5F8]/50">
                  Exclusive Sales & Marketing
                </span>
                <img
                  src={media("/img/corcoran-logo.webp")}
                  alt="Corcoran New Development"
                  className="h-7 w-auto object-contain brightness-200 contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="space-y-1">
                <span className="block font-sora text-[10px] tracking-wider uppercase text-[#F4F5F8]/50">
                  Partner
                </span>
                <img
                  src={media("/img/aksoy-holdıng-logo.svg")}
                  alt="Aksoy Holding"
                  className="h-6 w-auto object-contain brightness-200 contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Col 4: Sales Hours & Back to Top (2 cols) */}
          <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="font-sora text-xs tracking-[0.25em] font-semibold text-[#D6B585] uppercase border-b border-[#D6B585]/20 pb-3">
                Sales Gallery
              </h2>
              <div className="font-sora text-xs text-[#F4F5F8]/70 space-y-1.5">
                <p className="font-medium text-white">Hours of Operation:</p>
                <p>Monday – Sunday</p>
                <p className="text-[#D6B585]">By Appointment Only</p>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 self-start px-4 py-2.5 rounded-full border border-[#D6B585]/30 hover:border-[#D6B585] text-xs font-sora tracking-wider text-[#D6B585] hover:text-white hover:bg-[#1A224B] transition-all cursor-pointer group"
              title="Return to top of page"
            >
              <span>Back To Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#D6B585] group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#F4F5F8]/40 font-sora text-[11px] border-t border-[#D6B585]/20 pt-6">
          <p>© {new Date().getFullYear()} The Eastline New York. All Rights Reserved.</p>
          <p>
            Branding & Digital by <span className="font-semibold text-[#D6B585]">The Eastline New York</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

