import { useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import type { PageType } from './components/Navbar';
import { Hero } from './components/Hero';
import { IntroSection } from './components/IntroSection';
import { SkylineSection } from './components/SkylineSection';
import { EntranceHeroImage } from './components/EntranceHeroImage';
import { LifestyleSection } from './components/LifestyleSection';
import { ExteriorHeroImage } from './components/ExteriorHeroImage';
import { NeighborhoodSection } from './components/NeighborhoodSection';
import type { Residence } from './components/AvailabilitySection';
import { InquireSection } from './components/InquireSection';
import { Footer } from './components/Footer';


import { ResidencesPage } from './components/ResidencesPage';
import { AmenitiesPage } from './components/AmenitiesPage';

import { LightBoxModal } from './components/LightBoxModal';
import { FloorplanModal } from './components/FloorplanModal';
import { ExploreModal } from './components/ExploreModal';
import type { ExploreType } from './components/ExploreModal';
import { ScrollToTop } from './components/ScrollToTop';

export function App() {
  // URL-based routing
  const navigate = useNavigate();
  const location = useLocation();

  // Derive currentPage from the URL path (for Navbar active-state highlighting)
  const currentPage: PageType = useMemo(() => {
    if (location.pathname === '/residences') return 'residences';
    if (location.pathname === '/amenities') return 'amenities';
    return 'home';
  }, [location.pathname]);

  // Modal states
  const [lightBoxImage, setLightBoxImage] = useState<{ src: string; title: string } | null>(null);
  const [selectedResidence, setSelectedResidence] = useState<Residence | null>(null);
  const [exploreType, setExploreType] = useState<ExploreType>(null);
  const [inquireResidenceName, setInquireResidenceName] = useState<string>('');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenInquireWithName = (residenceName: string = '') => {
    setInquireResidenceName(residenceName);
    scrollToSection('inquire');
  };

  const handleNavigatePage = (page: PageType) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#ECE7DF] text-[#1F261E] flex flex-col relative font-sans-clean">
      <ScrollToTop />
      {/* Header & Drawer Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigatePage={handleNavigatePage}
        onOpenInquire={() => handleOpenInquireWithName('')}
        onOpenAvailability={() => {
          if (currentPage !== 'residences') {
            handleNavigatePage('residences');
            setTimeout(() => scrollToSection('availability'), 100);
          } else {
            scrollToSection('availability');
          }
        }}
      />

      {/* Main Page Content */}
      <main id="main-content" className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Banner */}
              <Hero
                onScheduleClick={() => handleOpenInquireWithName('')}
                onExploreClick={() => scrollToSection('intro')}
              />

              {/* Intro Paragraph & Quote */}
              <div id="intro">
                <IntroSection onScheduleClick={() => handleOpenInquireWithName('')} />
              </div>

              {/* Skyline & City Aligns */}
              <SkylineSection
                onExploreBuilding={() => setExploreType('building')}
                onImageClick={(src, title) => setLightBoxImage({ src, title })}
              />

              {/* Thoughtfully Considered Lifestyle & Amenities */}
              <LifestyleSection
                onExploreAmenities={() => handleNavigatePage('amenities')}
                onImageClick={(src, title) => setLightBoxImage({ src, title })}
              />

              {/* Upper Exterior Full-Width Hero Image */}
              <ExteriorHeroImage
                onImageClick={(src, title) => setLightBoxImage({ src, title })}
              />

              {/* Neighborhood Highlights */}
              <NeighborhoodSection
                onExploreNeighborhood={() => setExploreType('neighborhood')}
                onImageClick={(src, title) => setLightBoxImage({ src, title })}
              />

              {/* Entrance Hero Full-Width Image */}
              <EntranceHeroImage
                onImageClick={(src, title) => setLightBoxImage({ src, title })}
              />

              {/* Inquiry Form */}
              <InquireSection initialResidence={inquireResidenceName} sideImage={'/images/skyline-architecture.webp'} />


              {/* Footer */}
              <Footer
                onNavigateSection={scrollToSection}
                onOpenInquire={() => handleOpenInquireWithName('')}
              />
            </>
          } />

          <Route path="/residences" element={
            <ResidencesPage
              onSelectResidence={(res) => setSelectedResidence(res)}
              onOpenInquireWithName={handleOpenInquireWithName}
              onNavigatePage={handleNavigatePage}
              onImageClick={(src, title) => setLightBoxImage({ src, title })}
            />
          } />

          <Route path="/amenities" element={
            <AmenitiesPage
              onOpenInquireWithName={handleOpenInquireWithName}
              onNavigatePage={handleNavigatePage}
              onImageClick={(src, title) => setLightBoxImage({ src, title })}
            />
          } />
        </Routes>
      </main>

      {/* Interactive Modals */}
      <LightBoxModal
        src={lightBoxImage?.src || null}
        title={lightBoxImage?.title}
        onClose={() => setLightBoxImage(null)}
      />

      <FloorplanModal
        residence={selectedResidence}
        onClose={() => setSelectedResidence(null)}
        onInquire={(resName) => handleOpenInquireWithName(resName)}
      />

      <ExploreModal
        type={exploreType}
        onClose={() => setExploreType(null)}
        onOpenInquire={() => handleOpenInquireWithName('')}
        onSelectImage={(src, title) => setLightBoxImage({ src, title })}
      />

      {/* Permanent Custom Typography & Spacing Configuration */}
      <style>
        {`
          /* Hero Section Spacing Overrides */
          @media (min-width: 1024px) {
            #hero h1 { font-size: 49px !important; }
            #hero p.font-rexton { font-size: 29.4px !important; }
          }
          #hero h1, #hero p.font-rexton {
            letter-spacing: -0.08em !important;
            line-height: 1.08 !important;
          }
          #hero p.font-sora {
            font-size: 16px !important;
            letter-spacing: 0em !important;
          }

          /* Intro Section Spacing Overrides */
          #intro p {
            font-size: 21px !important;
            letter-spacing: -0.04em !important;
            line-height: 1.34 !important;
          }

          /* Skyline Showcase Spacing Overrides */
          @media (min-width: 1024px) {
            #skyline h3 { font-size: 34px !important; }
            #skyline p { font-size: 18px !important; }
          }
          @media (max-width: 1023px) {
            #skyline h3 { font-size: 20px !important; }
            #skyline p { font-size: 13px !important; }
          }
          #skyline h3 {
            letter-spacing: -0.08em !important;
            line-height: 1.14 !important;
          }
          #skyline p {
            letter-spacing: -0.015em !important;
          }

          /* Crossroads Heading Banner Spacing Overrides */
          @media (min-width: 1024px) {
            #crossroads-heading { font-size: 26px !important; }
          }
          #crossroads-heading {
            letter-spacing: -0.12em !important;
            line-height: 1.15 !important;
          }

          /* Lifestyle (Amenities) Spacing Overrides */
          @media (min-width: 1024px) {
            #amenities h2 { font-size: 33px !important; }
          }
          #amenities h2 {
            letter-spacing: -0.12em !important;
            line-height: 1.46 !important;
          }
          #amenities p {
            font-size: 18px !important;
            letter-spacing: -0.015em !important;
          }

          /* Interiors (Residences) Spacing Overrides */
          #residences p {
            font-size: 20px !important;
            letter-spacing: -0.035em !important;
            line-height: 1.62 !important;
          }

          /* Neighborhood Spacing Overrides */
          @media (min-width: 1024px) {
            #neighborhood h2 { font-size: 34px !important; }
          }
          #neighborhood h2 {
            letter-spacing: -0.08em !important;
            line-height: 1.14 !important;
          }
          #neighborhood p {
            font-size: 18px !important;
            letter-spacing: -0.015em !important;
          }

          /* Global Matching Page Typography & Line Spacing Rules */
          .page-intro-p {
            font-size: 21px !important;
            letter-spacing: -0.04em !important;
            line-height: 1.34 !important;
          }
          .page-body-p {
            font-size: 18px !important;
            letter-spacing: -0.015em !important;
            line-height: 1.45 !important;
          }
          .page-heading {
            letter-spacing: -0.08em !important;
            line-height: 1.14 !important;
          }
        `}
      </style>
    </div>
  );
}

export default App;
