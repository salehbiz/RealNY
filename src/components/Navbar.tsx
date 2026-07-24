import { media } from '../lib/media';
import React, { useState, useEffect } from 'react';
import { Menu, X, Eye, Phone, Mail, MapPin } from 'lucide-react';

export type PageType = 'home' | 'residences' | 'amenities';

interface NavbarProps {
  currentPage: PageType;
  onNavigatePage: (page: PageType) => void;
  onOpenInquire: () => void;
  onOpenAvailability: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigatePage,
  onOpenInquire,
  onOpenAvailability,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let heroEl: HTMLElement | null = null;
      if (currentPage === 'home') {
        heroEl = document.getElementById('hero');
      } else if (currentPage === 'residences') {
        heroEl = document.getElementById('residences-hero');
      } else if (currentPage === 'amenities') {
        heroEl = document.getElementById('amenities-hero');
      }

      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        if (rect.bottom <= 120) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      } else {
        if (window.scrollY > 50) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add('contrast-125', 'saturate-150');
    } else {
      document.documentElement.classList.remove('contrast-125', 'saturate-150');
    }
  };

  const navLinks: { label: string; id: PageType }[] = [
    { label: 'HOME', id: 'home' },
    { label: 'RESIDENCES', id: 'residences' },
    { label: 'AMENITIES', id: 'amenities' },
  ];

  const handleLinkClick = (id: PageType) => {
    setIsMenuOpen(false);
    onNavigatePage(id);
    window.scrollTo(0, 0);
  };

  const isDarkHeader = !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isDarkHeader ? 'bg-transparent py-5' : 'glass-header-scrolled py-3 shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Horizontal Logo (Icon next to Wordmark) */}
          <div
            className="flex items-center gap-3 sm:gap-3.5 cursor-pointer group shrink-0"
            onClick={() => handleLinkClick('home')}
          >
            <img
              src={media("/brand/Icon_Gold.svg")}
              alt="The Eastline New York Icon"
              className="h-6 sm:h-7 lg:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <img
              src={media("/brand/Wordmark_White.svg")}
              alt="The Eastline New York"
              className="h-6 sm:h-7 lg:h-8 w-auto object-contain transition-all duration-300"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = link.id === currentPage;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`font-sora text-xs tracking-[0.2em] font-semibold uppercase transition-all duration-300 relative py-1 cursor-pointer group/nav ${
                    isActive
                      ? 'text-[#D6B585]'
                      : 'text-[#F4F5F8]/80 hover:text-[#D6B585]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#D6B585] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover/nav:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right side: Mobile Menu Trigger + CTA Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Menu Button (lg:hidden) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D6B585]/40 bg-[#101535]/80 text-[#F4F5F8] hover:bg-[#D6B585] hover:text-[#101535] transition-all duration-300 cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu className="w-4 h-4 text-current" />
              <span className="font-sora text-[11px] tracking-[0.18em] font-medium uppercase">
                Menu
              </span>
            </button>

            {/* Desktop CTA Buttons */}
            <button
              onClick={onOpenAvailability}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-full border border-[#D6B585]/50 bg-transparent text-[#F4F5F8] hover:border-[#D6B585] hover:text-[#D6B585] font-sora text-[11px] tracking-[0.18em] font-medium uppercase transition-all duration-300 cursor-pointer"
            >
              Availability
            </button>

            <button
              onClick={onOpenInquire}
              className="inline-flex items-center px-5 py-2 rounded-full font-sora text-[11px] tracking-[0.2em] font-bold uppercase transition-all duration-300 shadow-lg cursor-pointer bg-[#D6B585] text-[#101535] hover:bg-[#E8CA9D] hover:scale-105"
            >
              Inquire
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Drawer Overlay Menu */}
      <div
        className={`fixed inset-0 z-[100] bg-[#101535] text-[#F4F5F8] transition-all duration-700 ease-in-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        {/* Drawer Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between border-b border-[#D6B585]/20">
          <button
            onClick={toggleHighContrast}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D6B585]/30 hover:border-[#D6B585] text-xs font-sora tracking-wider text-[#D6B585] hover:text-white transition-colors cursor-pointer"
            title="Toggle Accessibility Contrast"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{highContrast ? 'STANDARD CONTRAST' : 'ACCESSIBILITY MODE'}</span>
          </button>

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleLinkClick('home')}>
            <img src={media("/brand/Icon_Gold.svg")} alt="The Eastline New York Icon" className="h-6 sm:h-7 w-auto object-contain" />
            <img src={media("/brand/Wordmark_Gold.svg")} alt="The Eastline New York" className="h-6 sm:h-7 w-auto object-contain" />
          </div>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full border border-[#D6B585]/30 hover:border-[#D6B585] hover:bg-[#242C5B] text-[#F4F5F8] transition-all cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Body Grid */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-[calc(100vh-100px)] overflow-y-auto">
          {/* Left Column: Navigation Links */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {navLinks.map((link, idx) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="group text-left transition-transform duration-300 hover:translate-x-3 cursor-pointer"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-sora text-xs tracking-widest text-[#D6B585]/60 group-hover:text-[#D6B585]">
                    0{idx + 1}
                  </span>
                  <span className="font-rexton text-3xl md:text-5xl font-bold tracking-[0.12em] text-[#F4F5F8] group-hover:text-[#D6B585] transition-colors">
                    {link.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Crest Icon & Contact Info */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#D6B585]/20 pt-8 lg:pt-0 lg:pl-12 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <img
              src={media("/brand/Icon_Gold.svg")}
              alt="The Eastline New York Crest"
              className="w-20 h-auto object-contain"
            />

            <div className="space-y-4 font-sora text-sm tracking-wider text-[#F4F5F8]/80">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <MapPin className="w-4 h-4 text-[#D6B585] shrink-0" />
                <span>38 East 35th Street, New York, NY 10016</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <Phone className="w-4 h-4 text-[#D6B585] shrink-0" />
                <span>Sales Gallery: 35A East 35th Street, 2nd Floor</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <Mail className="w-4 h-4 text-[#D6B585] shrink-0" />
                <span>hello@theeastlinenyc.com</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenInquire();
                }}
                className="px-8 py-3 rounded-full bg-[#D6B585] text-[#101535] font-sora text-xs tracking-[0.2em] font-bold uppercase hover:bg-white transition-all shadow-lg cursor-pointer"
              >
                SCHEDULE A TOUR
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
