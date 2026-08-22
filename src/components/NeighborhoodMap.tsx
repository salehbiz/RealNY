import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapStyle } from '../lib/mapStyle';
import { CATEGORIES, EASTLINE, POIS } from '../data/neighborhood';
import type { CategoryId, Poi } from '../data/neighborhood';

/**
 * Inline lucide icon paths, one per category. Markers are plain DOM nodes rather
 * than React components so MapLibre can own them without a second React root.
 */
const ICONS: Record<CategoryId, string> = {
  cafes: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  dining: '<path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/>',
  cultural: '<path d="M10 18v-7"/><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',
  parks: '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
  wellness: '<path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/>',
  transit: '<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="m9 15-1-1"/><path d="m15 15 1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/>',
};

const COLOR: Record<CategoryId, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.color]),
) as Record<CategoryId, string>;

const iconSvg = (cat: CategoryId, size = 15) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
  `stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${ICONS[cat]}</svg>`;

export const NeighborhoodMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const visible = useMemo(
    () => (activeCategory === 'all' ? POIS : POIS.filter((p) => p.category === activeCategory)),
    [activeCategory],
  );

  // ---- map init (once) ----
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        // MapLibre normalises the style object in place, so a remount (React
        // StrictMode double-invokes effects) would otherwise hand the next map
        // an already-consumed style and silently fail to load.
        style: structuredClone(mapStyle),
        center: [EASTLINE.lng, EASTLINE.lat],
        zoom: 14.1,
        minZoom: 12,
        maxZoom: 17,
        attributionControl: { compact: true },
      });
    } catch {
      setFailed(true);
      return;
    }

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    // A single failed tile request should not take the whole section down; the
    // list beside the map carries the same information either way.
    map.on('error', (e) => {
      if (import.meta.env.DEV) console.warn('[neighbourhood map]', e?.error ?? e);
    });
    map.on('load', () => setReady(true));
    mapRef.current = map;

    // The Eastline itself — a gold teardrop, matching the factsheet's "E" marker.
    const home = document.createElement('div');
    home.className = 'eastline-home-marker';
    home.innerHTML =
      '<div class="eastline-home-pin"><span>E</span></div>';
    new maplibregl.Marker({ element: home, anchor: 'bottom' })
      .setLngLat([EASTLINE.lng, EASTLINE.lat])
      .addTo(map);

    // One marker per POI, created once and shown/hidden as filters change.
    POIS.forEach((poi) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'eastline-poi-marker';
      el.setAttribute('aria-label', `${poi.name} — ${poi.address}`);
      el.style.setProperty('--poi-color', COLOR[poi.category]);
      el.innerHTML = iconSvg(poi.category);
      el.addEventListener('mouseenter', () => setHoveredId(poi.id));
      el.addEventListener('mouseleave', () => setHoveredId(null));
      el.addEventListener('focus', () => setHoveredId(poi.id));
      el.addEventListener('blur', () => setHoveredId(null));

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([poi.lng, poi.lat])
        .setPopup(
          new maplibregl.Popup({
            offset: 18,
            closeButton: false,
            className: 'eastline-poi-popup',
          }).setHTML(
            `<p class="poi-name">${poi.name}</p>` +
              `<p class="poi-address">${poi.address}</p>` +
              `<p class="poi-blurb">${poi.blurb}</p>`,
          ),
        )
        .addTo(map);

      el.addEventListener('mouseenter', () => marker.togglePopup());
      el.addEventListener('mouseleave', () => marker.getPopup()?.remove());
      markersRef.current.set(poi.id, marker);
    });

    // The section sits behind `content-visibility: auto`, so the container can
    // report the wrong size while it is still off-screen. Re-measure whenever it
    // changes rather than trusting the size at construction time.
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(containerRef.current);

    const markers = markersRef.current;
    return () => {
      ro.disconnect();
      markers.forEach((m) => m.remove());
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ---- filtering: toggle marker visibility ----
  useEffect(() => {
    const shown = new Set(visible.map((p) => p.id));
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const on = shown.has(id);
      el.style.display = on ? '' : 'none';
      if (!on) marker.getPopup()?.remove();
    });
  }, [visible]);

  // ---- hover highlight ----
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.getElement().classList.toggle('is-active', id === hoveredId);
    });
  }, [hoveredId]);

  const flyTo = (poi: Poi) => {
    mapRef.current?.flyTo({ center: [poi.lng, poi.lat], zoom: 16, duration: 900 });
  };

  return (
    <div className="w-full">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center mb-6 md:mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`font-sora text-[10px] sm:text-[11px] tracking-[0.16em] font-semibold uppercase px-4 py-2 border transition-all duration-300 cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#101535] text-[#F4F5F8] border-[#101535]'
              : 'bg-transparent text-[#101535]/70 border-[#101535]/20 hover:border-[#101535]/50'
          }`}
        >
          All Locations
        </button>
        {CATEGORIES.map((cat) => {
          const on = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(on ? 'all' : cat.id)}
              className={`inline-flex items-center gap-2 font-sora text-[10px] sm:text-[11px] tracking-[0.16em] font-semibold uppercase px-4 py-2 border transition-all duration-300 cursor-pointer ${
                on ? 'text-[#F4F5F8]' : 'bg-transparent text-[#101535]/70 hover:text-[#101535]'
              }`}
              style={
                on
                  ? { backgroundColor: cat.color, borderColor: cat.color }
                  : { borderColor: `${cat.color}66` }
              }
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: on ? '#F4F5F8' : cat.color }}
              />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-0 border border-[#101535]/12 bg-[#F4F5F8] overflow-hidden">
        {/* Map */}
        <div className="relative h-[420px] sm:h-[520px] lg:h-[640px] order-1">
          {/* w-full/h-full rather than inset-0: maplibre-gl.css forces
              position:relative on its container, which cancels inset offsets. */}
          <div ref={containerRef} className="w-full h-full" />
          {!ready && !failed && (
            <div className="absolute inset-0 grid place-items-center bg-[#EFE9DC] pointer-events-none">
              <span className="font-sora text-[11px] tracking-[0.2em] uppercase text-[#101535]/40">
                Loading map…
              </span>
            </div>
          )}
          {failed && (
            <div className="absolute inset-0 grid place-items-center bg-[#EFE9DC] px-6 text-center">
              <span className="font-sora text-xs text-[#101535]/60">
                The map could not be loaded. The full list of neighbourhood
                destinations is available alongside.
              </span>
            </div>
          )}
        </div>

        {/* Synced list */}
        <div className="order-2 lg:border-l border-t lg:border-t-0 border-[#101535]/12 lg:h-[640px] lg:overflow-y-auto">
          {visible.map((poi) => (
            <button
              key={poi.id}
              onMouseEnter={() => setHoveredId(poi.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(poi.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => flyTo(poi)}
              className={`w-full text-left flex gap-3.5 px-5 py-4 border-b border-[#101535]/8 transition-colors duration-200 cursor-pointer ${
                hoveredId === poi.id ? 'bg-[#ECE7DF]' : 'bg-transparent hover:bg-[#ECE7DF]/60'
              }`}
            >
              <span
                className="mt-0.5 w-7 h-7 rounded-full grid place-items-center shrink-0"
                style={{ backgroundColor: `${COLOR[poi.category]}1A`, color: COLOR[poi.category] }}
                dangerouslySetInnerHTML={{ __html: iconSvg(poi.category, 14) }}
              />
              <span className="min-w-0">
                <span className="block font-sora text-sm font-semibold text-[#101535] leading-snug">
                  {poi.name}
                </span>
                <span className="block font-sora text-[11px] tracking-wider text-[#101535]/50 mt-0.5">
                  {poi.address}
                </span>
                <span className="block font-sora text-xs text-[#101535]/70 leading-relaxed mt-1.5">
                  {poi.blurb}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodMap;
