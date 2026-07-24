export type FrameTier = {
  dir: 'desktop-hq' | 'desktop' | 'mobile';
  ext: 'webp';
};

export function getFrameTier(): FrameTier {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const conn = typeof navigator !== 'undefined' ? (navigator as any).connection : undefined;
  const slowConn =
    conn?.effectiveType === '3g' || (conn?.downlink && conn.downlink < 3);

  // Mobile layout
  if (w < 768) return { dir: 'mobile', ext: 'webp' };

  // Desktop HQ (only for retina/high-DPR screens on fast connections)
  if (dpr >= 1.25 && !slowConn) {
    return { dir: 'desktop-hq', ext: 'webp' };
  }

  // Standard Desktop
  return { dir: 'desktop', ext: 'webp' };
}
