import React, { useState, useMemo, Suspense } from 'react';
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
import { ScrollToTop } from './components/ScrollToTop';
import type { ExploreType } from './components/ExploreModal';

const ResidencesPage = React.lazy(() => import('./components/ResidencesPage').then(m => ({ default: m.ResidencesPage })));
const AmenitiesPage = React.lazy(() => import('./components/AmenitiesPage').then(m => ({ default: m.AmenitiesPage })));
const LightBoxModal = React.lazy(() => import('./components/LightBoxModal').then(m => ({ default: m.LightBoxModal })));
const FloorplanModal = React.lazy(() => import('./components/FloorplanModal').then(m => ({ default: m.FloorplanModal })));
const ExploreModal = React.lazy(() => import('./components/ExploreModal').then(m => ({ default: m.ExploreModal })));

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
        <Suspense fallback={<div className="min-h-screen bg-[#101535]" />}>
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
        </Suspense>
      </main>

      {/* Interactive Modals */}
      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
}

export default App;
