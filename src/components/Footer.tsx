import { media } from '../lib/media';
import React from 'react';
import { MapPin, Mail, ChevronRight, ArrowUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface FooterProps {
  onNavigateSection: (id: string) => void;
  onOpenInquire: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInquire }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const navItems = [
    { label: 'Home', target: 'home' },
    { label: 'Residences', target: 'residences' },
    { label: 'Amenities', target: 'amenities' },
    { label: 'Availability', target: 'availability' },
    { label: 'Inquire', target: 'inquire' },
  ];

  const handleNavClick = (target: 'home' | 'residences' | 'amenities' | 'availability' | 'inquire') => {
    if (target === 'home') {
      if (location.pathname === '/') {
        window.scrollTo(0, 0);
      } else {
        navigate('/');
        window.scrollTo(0, 0);
      }
    } else if (target === 'residences') {
      if (location.pathname === '/residences') {
        window.scrollTo(0, 0);
      } else {
        navigate('/residences');
        window.scrollTo(0, 0);
      }
    } else if (target === 'amenities') {
      if (location.pathname === '/amenities') {
        window.scrollTo(0, 0);
      } else {
        navigate('/amenities');
        window.scrollTo(0, 0);
      }
    } else if (target === 'availability') {
      if (location.pathname === '/residences') {
        const el = document.getElementById('availability');
        if (el) el.scrollIntoView();
      } else {
        navigate('/residences', { state: { scrollTo: 'availability' } });
      }
    } else if (target === 'inquire') {
      onOpenInquire();
    }
  };

  return (
    <footer className="bg-[#0B0F28] text-[#F4F5F8] pt-16 pb-12 px-6 md:px-12 border-t border-[#D6B585]/30 relative overflow-hidden font-sans-clean select-none">
      {/* Background Decorative Gold Ambient Radial */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D6B585]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Main Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pt-4">
          {/* Col 1: Brand & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center cursor-pointer group" onClick={scrollToTop}>
              <img
                src={media("/brand/Wordmark_Gold.svg")}
                alt="The Eastline New York"
                className="h-8 w-auto object-contain"
              />
            </div>

            <div className="space-y-3 font-sora text-xs text-[#F4F5F8]/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D6B585] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Building Location:</strong>
                  <span className="block text-white/90">1655 First Avenue, New York, NY 10028</span>
                  <span className="block text-white/90 mt-1">355 East 86th Street, New York, NY 10028</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Mail className="w-4 h-4 text-[#D6B585] shrink-0" />
                <a
                  href="mailto:eastline@realnyproperties.com"
                  className="text-[#D6B585] hover:text-white hover:underline transition-colors font-medium"
                >
                  eastline@realnyproperties.com
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
                <li key={item.target}>
                  <button
                    onClick={() => handleNavClick(item.target as any)}
                    className={`flex items-center gap-2 group transition-colors cursor-pointer text-left ${
                      item.target === 'inquire'
                        ? 'text-[#D6B585] hover:text-white font-medium pt-1'
                        : 'hover:text-[#D6B585]'
                    }`}
                  >
                    <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-all ${
                      item.target === 'inquire' ? 'text-[#D6B585]' : 'text-[#D6B585]/50 group-hover:text-[#D6B585]'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Development Team (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-sora text-xs tracking-[0.25em] font-semibold text-[#D6B585] uppercase border-b border-[#D6B585]/20 pb-3">
              Development
            </h2>
            
            <div className="space-y-6 pt-1">
              <div className="space-y-2.5">
                <span className="block font-sora text-[10px] tracking-wider uppercase text-[#F4F5F8]/50">
                  Developer & Sponsor
                </span>
                <img
                  src={media("/img/chess-logo.png")}
                  alt="CHESS"
                  className="h-3 w-auto object-contain brightness-200 contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="space-y-2.5">
                <span className="block font-sora text-[10px] tracking-wider uppercase text-[#F4F5F8]/50">
                  Exclusive Leasing & Marketing
                </span>
                <img
                  src={media("/img/realny-logo.png")}
                  alt="REAL NY"
                  className="h-6 w-auto object-contain brightness-200 contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Col 4: Sales Hours & Back to Top (2 cols) */}
          <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="font-sora text-xs tracking-[0.25em] font-semibold text-[#D6B585] uppercase border-b border-[#D6B585]/20 pb-3">
                Leasing Office
              </h2>
              <div className="font-sora text-xs text-[#F4F5F8]/70 space-y-1.5">
                <p className="font-medium text-white">Hours of Operation:</p>
                <p>Monday – Sunday</p>
                <p className="text-[#D6B585]">By Appointment Only</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-start">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full border border-white/20 hover:border-white text-[10px] font-sora tracking-wider text-white/80 hover:text-white hover:bg-[#1A224B] transition-all cursor-pointer group"
                title="Return to top of page"
              >
                <span>Back To Top</span>
                <ArrowUp className="w-3 h-3 text-white/80 group-hover:text-white group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <img
                src={media("/img/eho-logo-trimmed.png")}
                alt="Equal Housing Opportunity"
                className="h-6 w-auto object-contain brightness-200 contrast-125 opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#F4F5F8]/40 font-sora text-[11px] border-t border-[#D6B585]/20 pt-6">
          <p>© {new Date().getFullYear()} The Eastline New York. All Rights Reserved.</p>
          <p>
            Branding & Digital by <span className="font-semibold text-[#D6B585]">Real New York</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

