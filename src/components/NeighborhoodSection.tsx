import React, { Suspense, useEffect, useRef, useState } from 'react';

// Lazy so maplibre-gl never lands in the initial homepage bundle.
const NeighborhoodMap = React.lazy(() =>
  import('./NeighborhoodMap').then((m) => ({ default: m.NeighborhoodMap })),
);

const MapPlaceholder: React.FC = () => (
  <div className="h-[420px] sm:h-[520px] lg:h-[640px] grid place-items-center border border-[#101535]/12 bg-[#EFE9DC]">
    <span className="font-sora text-[11px] tracking-[0.2em] uppercase text-[#101535]/40">
      Loading map…
    </span>
  </div>
);

export const NeighborhoodSection: React.FC = () => {
  // Only pull in maplibre once the map is close to the viewport — otherwise
  // every homepage visit downloads it whether or not the visitor scrolls here.
  const mapSlotRef = useRef<HTMLDivElement | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const el = mapSlotRef.current;
    if (!el || showMap) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShowMap(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [showMap]);

  return (
    <section id="neighborhood" className="bg-[#ECE7DF] text-[#101535] pt-20 pb-20 md:pt-[120px] md:pb-[120px] px-4 sm:px-8 lg:px-16 w-full border-b border-[#101535]/10 select-none">
      <div className="w-full">
        {/* Interactive neighbourhood map */}
        <div className="w-full max-w-[1500px] mx-auto pb-20 md:pb-[120px] select-text">
          <div className="text-center max-w-3xl mx-auto pb-10 md:pb-14 space-y-4">
            <span className="font-sora text-[11px] tracking-[0.3em] font-semibold uppercase text-[#745831]">
              The Neighbourhood
            </span>
            <h3 className="univ-h2-section text-[#101535] uppercase">
              Everything Within Reach
            </h3>
            <p className="font-sora text-sm text-[#101535]/70 leading-relaxed max-w-xl mx-auto">
              Cafés, dining, culture, parks and transit — the Upper East Side,
              mapped from the front door of 355 East 86th Street.
            </p>
          </div>
          <div ref={mapSlotRef}>
            {showMap ? (
              <Suspense fallback={<MapPlaceholder />}>
                <NeighborhoodMap />
              </Suspense>
            ) : (
              <MapPlaceholder />
            )}
          </div>
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
