import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  frameCount: number;
  framePath: (i: number) => string;
  poster: string;
  className?: string;
  scrollLengthVh?: number;
  children?: React.ReactNode;
  onProgress?: (progress: number, frame: number) => void;
  eager?: boolean;
  tierResolved?: boolean;
  fallbackFramePath?: (i: number) => string;
  pathKey?: string;
  snapPoints?: number[];
};

const LERP = 0.18;
const CONCURRENCY = 6;

export default function FrameScrub({
  frameCount,
  framePath,
  poster,
  className = '',
  scrollLengthVh = 350,
  children,
  onProgress,
  eager = true,
  tierResolved = true,
  fallbackFramePath,
  pathKey = '',
  snapPoints,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const compressedBlobs = useRef<Map<number, Blob>>(new Map());
  const decodedBitmaps = useRef<Map<number, ImageBitmap>>(new Map());
  const fetchedOrInFlight = useRef<Set<number>>(new Set());
  const decodingFrames = useRef<Set<number>>(new Set());
  const pumpRef = useRef<(() => void) | undefined>(undefined);

  const playhead = useRef(1);
  const target = useRef(1);

  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isFallenBack, setIsFallenBack] = useState(false);
  const [firstFrameDrawn, setFirstFrameDrawn] = useState(false);

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const framePathRef = useRef(framePath);
  framePathRef.current = framePath;

  const fallbackFramePathRef = useRef(fallbackFramePath);
  fallbackFramePathRef.current = fallbackFramePath;

  useEffect(() => {
    setIsFallenBack(false);
    setFirstFrameDrawn(false);
  }, [pathKey]);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (eager) {
      setVisible(true);
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '1000px 0px' }
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    const bitmaps = decodedBitmaps.current;
    const blobs = compressedBlobs.current;
    const inflight = fetchedOrInFlight.current;
    const decoding = decodingFrames.current;
    return () => {
      bitmaps.forEach((bitmap) => bitmap.close());
      bitmaps.clear();
      blobs.clear();
      inflight.clear();
      decoding.clear();
      pumpRef.current = undefined;
    };
  }, []);

  // Stride-based downloading & playhead priority management
  useEffect(() => {
    if (!visible || !tierResolved || reduced) return;

    let cancelled = false;
    let loadedCount = 0;
    const requiredForReady = Math.min(24, frameCount);

    compressedBlobs.current.clear();
    decodedBitmaps.current.forEach((bitmap) => bitmap.close());
    decodedBitmaps.current.clear();
    fetchedOrInFlight.current.clear();
    decodingFrames.current.clear();
    setReady(false);

    const order: number[] = [];
    const step = isMobile ? 2 : 1;
    for (const stride of [8, 4, 2, 1]) {
      const s = stride * step;
      for (let i = 1; i <= frameCount; i += s) {
        if (!order.includes(i)) order.push(i);
      }
    }

    let idx = 0;
    let inFlight = 0;

    const findPriorityFrame = (center: number, maxDistance = 15): number | null => {
      for (let dist = 0; dist <= maxDistance; dist++) {
        const framePlus = center + dist;
        if (
          framePlus >= 1 &&
          framePlus <= frameCount &&
          !fetchedOrInFlight.current.has(framePlus)
        ) {
          return framePlus;
        }
        if (dist > 0) {
          const frameMinus = center - dist;
          if (
            frameMinus >= 1 &&
            frameMinus <= frameCount &&
            !fetchedOrInFlight.current.has(frameMinus)
          ) {
            return frameMinus;
          }
        }
      }
      return null;
    };

    const pump = () => {
      if (cancelled) return;
      while (inFlight < CONCURRENCY) {
        const center = Math.round(playhead.current);
        let frame = findPriorityFrame(center, 15);

        if (frame === null) {
          while (idx < order.length) {
            const candidate = order[idx++];
            if (!fetchedOrInFlight.current.has(candidate)) {
              frame = candidate;
              break;
            }
          }
        }

        if (frame === null) break;

        fetchedOrInFlight.current.add(frame);
        inFlight++;

        const currentFrame = frame;
        const targetPath =
          isFallenBack && fallbackFramePathRef.current
            ? fallbackFramePathRef.current(currentFrame)
            : framePathRef.current(currentFrame);

        fetch(targetPath)
          .then((res) => {
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            return res.blob();
          })
          .then((blob) => {
            if (cancelled) return;
            compressedBlobs.current.set(currentFrame, blob);
            loadedCount++;
            if (loadedCount >= requiredForReady) {
              setReady(true);
            }
            inFlight--;
            pump();
          })
          .catch(() => {
            if (cancelled) return;
            if (!isFallenBack && fallbackFramePathRef.current) {
              setIsFallenBack(true);
              cancelled = true;
            } else {
              inFlight--;
              pump();
            }
          });
      }
    };

    pumpRef.current = pump;
    pump();

    return () => {
      cancelled = true;
      pumpRef.current = undefined;
    };
  }, [visible, frameCount, isMobile, tierResolved, reduced, isFallenBack]);

  // GSAP ScrollTrigger pinning and target calculation
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: () => `+=${window.innerHeight * (scrollLengthVh / 100 - 1)}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0,
        snap:
          snapPoints && snapPoints.length > 0
            ? {
                snapTo: snapPoints,
                duration: { min: 0.25, max: 0.5 },
                delay: 0.08,
                ease: 'power1.inOut',
              }
            : undefined,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          target.current = 1 + progress * (frameCount - 1);
          if (onProgressRef.current) {
            onProgressRef.current(progress, Math.round(target.current));
          }
        },
      });
    }, track);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [frameCount, scrollLengthVh, snapPoints]);

  const findNearestFrame = useCallback((frame: number): number | null => {
    if (decodedBitmaps.current.has(frame)) return frame;
    for (let delta = 1; delta <= 10; delta++) {
      if (decodedBitmaps.current.has(frame + delta)) return frame + delta;
      if (decodedBitmaps.current.has(frame - delta)) return frame - delta;
    }
    return null;
  }, []);

  const decodeFrames = useCallback(
    async (center: number) => {
      const DECODE_WINDOW = isMobile ? 15 : 30;
      const lo = Math.max(1, center - DECODE_WINDOW);
      const hi = Math.min(frameCount, center + DECODE_WINDOW);

      // Evict offscreen ImageBitmaps with bitmap.close()
      for (const [key, bitmap] of decodedBitmaps.current) {
        if (key < lo || key > hi) {
          bitmap.close();
          decodedBitmaps.current.delete(key);
        }
      }

      const decodeOrder: number[] = [];
      for (let dist = 0; dist <= DECODE_WINDOW; dist++) {
        const p = center + dist;
        if (p >= lo && p <= hi) decodeOrder.push(p);
        if (dist > 0) {
          const m = center - dist;
          if (m >= lo && m <= hi) decodeOrder.push(m);
        }
      }

      let decodedCount = 0;
      const BUDGET = 4;

      for (const i of decodeOrder) {
        if (decodedCount >= BUDGET) break;

        if (
          !decodedBitmaps.current.has(i) &&
          !decodingFrames.current.has(i) &&
          compressedBlobs.current.has(i)
        ) {
          const blob = compressedBlobs.current.get(i);
          if (blob) {
            decodedCount++;
            decodingFrames.current.add(i);

            createImageBitmap(blob)
              .then((bmp) => {
                decodingFrames.current.delete(i);
                const currentCenter = Math.round(playhead.current);
                const currentLo = Math.max(1, currentCenter - DECODE_WINDOW);
                const currentHi = Math.min(frameCount, currentCenter + DECODE_WINDOW);
                if (i >= currentLo && i <= currentHi) {
                  decodedBitmaps.current.set(i, bmp);
                } else {
                  bmp.close();
                }
              })
              .catch(() => {
                decodingFrames.current.delete(i);
              });
          }
        }
      }
    },
    [frameCount, isMobile]
  );

  // RAF Draw loop
  useEffect(() => {
    if (!ready || !tierResolved) return;
    let raf = 0,
      lastDrawn = -1;

    const draw = (frame: number) => {
      const canvas = canvasRef.current;
      const bmp = decodedBitmaps.current.get(frame);
      if (!canvas || !bmp) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      const cr = canvas.width / canvas.height;
      const ir = bmp.width / bmp.height;

      let dw: number, dh: number, dx: number, dy: number;
      if (ir > cr) {
        dh = canvas.height;
        dw = dh * ir;
        dx = (canvas.width - dw) / 2;
        dy = 0;
      } else {
        dw = canvas.width;
        dh = dw / ir;
        dx = 0;
        dy = (canvas.height - dh) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bmp, dx, dy, dw, dh);
      setFirstFrameDrawn(true);
    };

    const loop = () => {
      playhead.current += (target.current - playhead.current) * LERP;
      const idealFrame = Math.round(playhead.current);
      const frame = findNearestFrame(idealFrame);
      if (frame !== null && frame !== lastDrawn) {
        draw(frame);
        lastDrawn = frame;
      }
      decodeFrames(idealFrame);
      if (pumpRef.current) {
        pumpRef.current();
      }
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const isMob = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMob ? 1.5 : 2);
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      lastDrawn = -1;
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [ready, findNearestFrame, decodeFrames, tierResolved]);

  return (
    <div ref={trackRef} className={className} style={{ position: 'relative' }}>
      <div
        ref={stickyRef}
        style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}
      >
        {reduced ? (
          <img
            src={poster}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.04) saturate(1.06) brightness(1.01)',
            }}
          />
        ) : (
          <>
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: firstFrameDrawn ? 1 : 0,
                transition: 'opacity 0.4s ease-out',
                display: 'block',
                transform: 'translateZ(0)',
                filter: 'contrast(1.04) saturate(1.06) brightness(1.01)',
              }}
            />
            <img
              src={poster}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: firstFrameDrawn ? 0 : 1,
                transition: 'opacity 0.4s ease-out',
                pointerEvents: 'none',
                display: 'block',
                filter: 'contrast(1.04) saturate(1.06) brightness(1.01)',
              }}
            />
          </>
        )}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
}
