/**
 * Neighbourhood points of interest for the interactive map.
 *
 * Source of truth is page 2 of The Eastline factsheet ("LOCATION"), which lists
 * 33 places across six categories. Coordinates were resolved once, by hand, from
 * OpenStreetMap (Nominatim for street addresses, Overpass for the subway
 * stations, ferry landing and dog runs) and are hard-coded here — nothing is
 * geocoded at runtime.
 */

export type CategoryId =
  | 'cafes'
  | 'dining'
  | 'cultural'
  | 'parks'
  | 'wellness'
  | 'transit';

export interface Category {
  id: CategoryId;
  label: string;
  /** Pin fill; taken from the printed factsheet's colour coding. */
  color: string;
}

export interface Poi {
  id: string;
  name: string;
  address: string;
  category: CategoryId;
  /** One-line description shown on hover. */
  blurb: string;
  lat: number;
  lng: number;
}

/** 355 East 86th Street — the building itself. */
export const EASTLINE = {
  name: 'The Eastline',
  address: '355 East 86th Street',
  lat: 40.77734,
  lng: -73.95026,
};

export const CATEGORIES: Category[] = [
  { id: 'cafes', label: 'Cafés', color: '#A33A3A' },
  { id: 'dining', label: 'Restaurants & Bars', color: '#3C6E9F' },
  { id: 'cultural', label: 'Cultural', color: '#C8802D' },
  { id: 'parks', label: 'Parks', color: '#5C8A3A' },
  { id: 'wellness', label: 'Wellness & Fitness', color: '#A6459A' },
  { id: 'transit', label: 'Transit', color: '#9A8A2E' },
];

export const POIS: Poi[] = [
  // Cafés
  {
    id: 'lb-coffee', name: 'L B Coffee', address: '454 E 84th St.', category: 'cafes',
    blurb: 'Mediterranean-inspired café serving locally roasted coffee, organic matcha and Levantine bites.',
    lat: 40.77464, lng: -73.94839,
  },
  {
    id: 'maison-brew', name: 'Maison Brew', address: '310 E 93rd St.', category: 'cafes',
    blurb: 'Women-owned Yorkville café pairing artisanal lattes with fresh-baked pastries.',
    lat: 40.78181, lng: -73.94789,
  },
  {
    id: 'asano', name: 'Asano', address: '322 E 86th St.', category: 'cafes',
    blurb: "Japanese-accented morning café inside Sandro's, for matcha lattes and Asian pastries.",
    lat: 40.77720, lng: -73.95094,
  },
  {
    id: 'green-lane', name: 'Green Lane Coffee', address: '1582 First Ave.', category: 'cafes',
    blurb: 'Greenpoint-born roaster pouring organic, fair-trade coffee alongside homemade pastries.',
    lat: 40.77446, lng: -73.95090,
  },
  {
    id: 'dear-coffee', name: 'Dear Coffee', address: '1246 Lexington Ave.', category: 'cafes',
    blurb: 'Spacious wood-lined room known for craft espresso and cinnamon rolls.',
    lat: 40.77815, lng: -73.95674,
  },
  {
    id: 'cabuc', name: 'Cabuc Coffee', address: '1211 Lexington Ave.', category: 'cafes',
    blurb: 'Family-run Turkish coffee house roasting its own beans, with cardamom-spiced brews.',
    lat: 40.77698, lng: -73.95724,
  },

  // Restaurants & Bars
  {
    id: 'pavin86', name: 'Pavin 86', address: '1663 First Ave.', category: 'dining',
    blurb: 'Family-owned Italian kitchen for handmade pasta and curated Italian wines.',
    lat: 40.77745, lng: -73.94932,
  },
  {
    id: 'andiamo', name: 'Andiamo', address: '1705 First Ave.', category: 'dining',
    blurb: 'Nautical-themed all-day bar — espresso in the morning, martinis after dark.',
    lat: 40.77855, lng: -73.94858,
  },
  {
    id: 'bar-vivant', name: 'Bar Vivant', address: '164 E 88th St.', category: 'dining',
    blurb: 'Intimate wine bar pouring biodynamic bottles beside European small plates.',
    lat: 40.78033, lng: -73.95407,
  },
  {
    id: 'keuka', name: 'Keuka Wine Bar & Kitchen', address: '435 E 86th St.', category: 'dining',
    blurb: 'Finger Lakes–inspired list, forty wines by the glass and a seasonal menu.',
    lat: 40.77653, lng: -73.94793,
  },
  {
    id: 'sandros', name: "Sandro's", address: '322 E 86th St.', category: 'dining',
    blurb: 'Roman cooking from chef Sandro Fioriti, a neighbourhood institution since 1985.',
    lat: 40.77732, lng: -73.95084,
  },
  {
    id: 'masseria-east', name: 'Masseria East', address: '1404 Third Ave.', category: 'dining',
    blurb: 'Elegant Italian dining room in the long-running former Parma space.',
    lat: 40.77493, lng: -73.95721,
  },

  // Cultural
  {
    id: 'met', name: 'The Metropolitan Museum of Art', address: '1000 Fifth Ave.', category: 'cultural',
    blurb: 'Five thousand years of art at the edge of Central Park.',
    lat: 40.77944, lng: -73.96338,
  },
  {
    id: 'berggruen', name: 'Alexander Berggruen', address: '1018 Madison Ave.', category: 'cultural',
    blurb: 'Third-floor contemporary gallery with a new exhibition every six weeks.',
    lat: 40.77604, lng: -73.96268,
  },
  {
    id: 'white-cube', name: 'White Cube New York', address: '1002 Madison Ave.', category: 'cultural',
    blurb: "The British gallery's first permanent US home, 8,000 square feet over three floors.",
    lat: 40.77552, lng: -73.96303,
  },
  {
    id: 'gagosian', name: 'Gagosian', address: '980 Madison Ave.', category: 'cultural',
    blurb: 'Blue-chip modern and contemporary exhibitions on Madison Avenue.',
    lat: 40.77458, lng: -73.96318,
  },
  {
    id: 'guggenheim', name: 'Solomon R. Guggenheim Museum', address: '1071 Fifth Ave.', category: 'cultural',
    blurb: "Frank Lloyd Wright's spiral rotunda and its modern collection.",
    lat: 40.78299, lng: -73.95892,
  },
  {
    id: '92ny', name: 'Kaufmann Concert Hall at 92NY', address: '1395 Lexington Ave.', category: 'cultural',
    blurb: 'Landmark stage for concerts, readings and public conversation.',
    lat: 40.78304, lng: -73.95277,
  },

  // Parks
  {
    id: 'central-park', name: 'Central Park', address: 'East 85th St & Fifth Ave', category: 'parks',
    blurb: '843 acres of meadow, water and woodland beginning at Fifth Avenue.',
    lat: 40.78100, lng: -73.96200,
  },
  {
    id: 'carl-schurz', name: 'Carl Schurz Park', address: 'East 86th St & East End Ave.', category: 'parks',
    blurb: 'Riverside lawns along the East River, home to Gracie Mansion.',
    lat: 40.77517, lng: -73.94353,
  },
  {
    id: 'dog-runs', name: 'Carl Schurz Park Dog Runs', address: 'East End Ave, between E 84th & E 89th St.', category: 'parks',
    blurb: 'Separate fenced runs for large and small dogs, tucked inside the park.',
    lat: 40.77409, lng: -73.94392,
  },
  {
    id: 'catbird', name: 'Catbird Playground', address: 'East End Ave & East 84th St.', category: 'parks',
    blurb: '1935 playground with swings, a sandpit and jungle gyms.',
    lat: 40.77397, lng: -73.94475,
  },
  {
    id: 'john-jay', name: 'John Jay Park', address: 'FDR Drive & East 77th St.', category: 'parks',
    blurb: 'Riverside park with ball courts, playground and a seasonal outdoor pool.',
    lat: 40.76926, lng: -73.94954,
  },

  // Wellness & Fitness
  {
    id: 'paradigm', name: 'Paradigm Studio', address: '1551 Second Ave.', category: 'wellness',
    blurb: "Classical Pilates studio built on Joseph Pilates' original method.",
    lat: 40.77444, lng: -73.95449,
  },
  {
    id: 'natural-pilates', name: 'Natural Pilates UES', address: '244 E 84th St.', category: 'wellness',
    blurb: 'Classical Pilates blended with physical-therapy-informed movement.',
    lat: 40.77661, lng: -73.95308,
  },
  {
    id: 'fitness-office', name: 'The Fitness Office', address: '219 E 81st St.', category: 'wellness',
    blurb: 'Private one-on-one training studios, no membership required.',
    lat: 40.77537, lng: -73.95530,
  },
  {
    id: 'mind-your-body', name: 'Mind Your Body', address: '1435 Lexington Ave.', category: 'wellness',
    blurb: 'Pilates and GYROTONIC® studio on the Upper East Side since 1995.',
    lat: 40.78422, lng: -73.95193,
  },
  {
    id: 'real-pilates', name: 'Real Pilates UES', address: '1226 Lexington Ave.', category: 'wellness',
    blurb: "Alycea Ungaro's classical studio, a deliberately music-free room.",
    lat: 40.77749, lng: -73.95729,
  },
  {
    id: 'pushlab', name: 'PushLab Fitness', address: '249 E 77th St.', category: 'wellness',
    blurb: 'Small-group HIIT blending strength, endurance and agility work.',
    lat: 40.77242, lng: -73.95641,
  },

  // Transit
  {
    id: '86-q', name: '86 St (Q)', address: '2nd Avenue & East 86th St.', category: 'transit',
    blurb: 'Second Avenue Subway, direct to Midtown and Times Square.',
    lat: 40.77789, lng: -73.95179,
  },
  {
    id: 'ferry-90', name: 'East 90th St Ferry Landing', address: 'East 90th Street & FDR Drive', category: 'transit',
    blurb: 'NYC Ferry landing on the East River esplanade.',
    lat: 40.77750, lng: -73.94216,
  },
  {
    id: '86-456', name: '86 St (4/5/6)', address: 'Lexington Avenue & East 86th St.', category: 'transit',
    blurb: 'Lexington Avenue express and local, the fastest run to Grand Central.',
    lat: 40.77949, lng: -73.95553,
  },
  {
    id: '96-q', name: '96 St (Q)', address: '2nd Avenue & East 96th St.', category: 'transit',
    blurb: 'Second Avenue Subway stop at 96th Street.',
    lat: 40.78432, lng: -73.94715,
  },
];
