import type { StyleSpecification } from 'maplibre-gl';

/**
 * Hand-written MapLibre style for the neighbourhood map.
 *
 * Tiles come from OpenFreeMap (OpenMapTiles schema) — free for commercial use,
 * no API key and no request limits. Only the handful of layers the map actually
 * needs are declared, which keeps it far lighter than a stock 111-layer style
 * and lets the palette match the printed factsheet: cream streets, sage parks
 * and deep navy water.
 *
 * Attribution for OpenFreeMap / OpenMapTiles / OpenStreetMap is required and is
 * rendered by the AttributionControl the map adds.
 */

const CREAM = '#EFE9DC';
const CREAM_DEEP = '#E4DCCB';
const ROAD = '#FFFFFF';
const ROAD_CASING = '#DDD3C0';
const GREEN = '#A9C296';
const WATER = '#1B2A55';
const LABEL = '#7C7362';
const LABEL_HALO = '#F7F3EA';

export const ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> · ' +
  '<a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> · ' +
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

export const mapStyle: StyleSpecification = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
      attribution: ATTRIBUTION,
    },
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': CREAM } },

    // Blocks read slightly deeper than the street grid.
    {
      id: 'landuse',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landuse',
      filter: ['in', ['get', 'class'], ['literal', ['residential', 'suburb', 'neighbourhood']]],
      paint: { 'fill-color': CREAM_DEEP },
    },
    {
      id: 'landcover-green',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landcover',
      filter: ['in', ['get', 'class'], ['literal', ['wood', 'grass', 'park']]],
      paint: { 'fill-color': GREEN, 'fill-opacity': 0.85 },
    },
    {
      id: 'park',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'park',
      paint: { 'fill-color': GREEN, 'fill-opacity': 0.85 },
    },

    { id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water', paint: { 'fill-color': WATER } },

    // Road casing under fill gives the crisp printed-map edge.
    {
      id: 'road-casing',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['!', ['in', ['get', 'class'], ['literal', ['path', 'track', 'ferry']]]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': ROAD_CASING,
        'line-width': [
          'interpolate', ['exponential', 1.4], ['zoom'],
          11, 1.2,
          14, 5,
          17, 20,
        ],
      },
    },
    {
      id: 'road',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['!', ['in', ['get', 'class'], ['literal', ['path', 'track', 'ferry']]]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': ROAD,
        'line-width': [
          'interpolate', ['exponential', 1.4], ['zoom'],
          11, 0.5,
          14, 3.2,
          17, 16,
        ],
      },
    },

    {
      id: 'building',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'building',
      minzoom: 15,
      paint: { 'fill-color': '#E0D6C3', 'fill-opacity': 0.55 },
    },

    {
      id: 'road-label',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'transportation_name',
      minzoom: 13,
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Noto Sans Regular'],
        'symbol-placement': 'line',
        'text-size': 11,
        'text-letter-spacing': 0.04,
      },
      paint: { 'text-color': LABEL, 'text-halo-color': LABEL_HALO, 'text-halo-width': 1.4 },
    },
    {
      id: 'place-label',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      filter: ['in', ['get', 'class'], ['literal', ['suburb', 'neighbourhood']]],
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Noto Sans Regular'],
        'text-size': 12,
        'text-letter-spacing': 0.12,
        'text-transform': 'uppercase',
      },
      paint: { 'text-color': '#9A9081', 'text-halo-color': LABEL_HALO, 'text-halo-width': 1.6 },
    },
  ],
};
