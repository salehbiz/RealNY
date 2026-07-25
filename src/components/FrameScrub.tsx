import React, { useEffect, useRef, useState, useCallback } from 'react';
import { media } from '../lib/media';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  frameCount: number;
  framePath: (i: number) => string;
  poster: string;
  posterBase?: string;
  className?: string;
  scrollLengthVh?: number;
  children?: React.ReactNode;
  onProgress?: (progress: number, frame: number) => void;
  eager?: boolean;
  deferUntilLoad?: boolean;
  tierResolved?: boolean;
  fallbackFramePath?: (i: number) => string;
  pathKey?: string;
  snapPoints?: number[];
};

const LERP = 0.15;

export default function FrameScrub({
  frameCount,
  framePath,
  poster,
  posterBase,
  className = '',
  scrollLengthVh = 350,
  children,
  onProgress,
  eager = true,
  deferUntilLoad = false,
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
  const [canvasDisplay, setCanvasDisplay] = useState<'none' | 'block'>('none');
  const [canvasOpacity, setCanvasOpacity] = useState<number>(0);
  const hasDrawnFirst = useRef(false);

  const [loadFull, setLoadFull] = useState(false);
  const setLoadFullRef = useRef(setLoadFull);
  setLoadFullRef.current = setLoadFull;

  const lastPathKey = useRef('');
  const lastIsFallenBack = useRef(false);

  useEffect(() => {
    setIsFallenBack(false);
    hasDrawnFirst.current = false;
    setCanvasDisplay('none');
    setCanvasOpacity(0);
  }, [pathKey]);

  useEffect(() => {
    if (loadFull) return;
    const triggerFullLoad = (e: Event) => {
      if (e.type === 'scroll' && window.scrollY <= 2) return;
      setLoadFullRef.current(true);
    };
    window.addEventListener('scroll', triggerFullLoad, { passive: true });
    window.addEventListener('wheel', triggerFullLoad, { passive: true, once: true });
    window.addEventListener('touchstart', triggerFullLoad, { passive: true, once: true });
    return () => {
      window.removeEventListener('scroll', triggerFullLoad);
      window.removeEventListener('wheel', triggerFullLoad);
      window.removeEventListener('touchstart', triggerFullLoad);
    };
  }, [loadFull]);

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const framePathRef = useRef(framePath);
  framePathRef.current = framePath;

  const fallbackFramePathRef = useRef(fallbackFramePath);
  fallbackFramePathRef.current = fallbackFramePath;

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
      if (deferUntilLoad) {
        let idleId: number | null = null;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const scheduleIdle = () => {
          if ('requestIdleCallback' in window) {
            idleId = (window as any).requestIdleCallback(
              () => setVisible(true),
              { timeout: 1200 }
            );
          } else {
            timeoutId = setTimeout(() => setVisible(true), 200);
          }
        };

        if (document.readyState === 'complete') {
          scheduleIdle();
        } else {
          const onLoad = () => {
            scheduleIdle();
          };
          window.addEventListener('load', onLoad, { once: true });
          return () => {
            window.removeEventListener('load', onLoad);
            if (idleId !== null && 'cancelIdleCallback' in window) {
              (window as any).cancelIdleCallback(idleId);
            }
            if (timeoutId !== null) {
              clearTimeout(timeoutId);
            }
          };
        }

        return () => {
          if (idleId !== null && 'cancelIdleCallback' in window) {
            (window as any).cancelIdleCallback(idleId);
          }
          if (timeoutId !== null) {
            clearTimeout(timeoutId);
          }
        };
      } else {
        setVisible(true);
        return;
      }
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
  }, [eager, deferUntilLoad]);

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

    // Upgrade of loadFull should not wipe the cached arrays!
    const key = `${pathKey}_${isFallenBack}`;
    const prevKey = `${lastPathKey.current}_${lastIsFallenBack.current}`;
    if (key !== prevKey) {
      compressedBlobs.current.clear();
      decodedBitmaps.current.forEach((bitmap) => bitmap.close());
      decodedBitmaps.current.clear();
      fetchedOrInFlight.current.clear();
      decodingFrames.current.clear();
      setReady(false);
      lastPathKey.current = pathKey;
      lastIsFallenBack.current = isFallenBack;
    }

    let loadedCount = compressedBlobs.current.size;
    const requiredForReady = Math.min(isMobile ? 12 : 24, frameCount);
    if (loadedCount >= requiredForReady) {
      setReady(true);
    }

    const order: number[] = [];
    const step = isMobile ? 2 : 1;

    // Check connection telemetry
    const conn = (navigator as any).connection;
    const slowConn = conn?.saveData || conn?.effectiveType === '3g' || (conn?.downlink && conn.downlink < 3);

    // Build stride list dynamically
    const strides = [];
    if (!loadFull) {
      if (slowConn) {
        strides.push(8);
      } else {
        strides.push(8, 4);
      }
    } else {
      strides.push(8, 4, 2, 1);
    }

    for (const stride of strides) {
      const s = stride * step;
      for (let i = 1; i <= frameCount; i += s) {
        if (!order.includes(i)) order.push(i);
      }
    }

    let idx = 0;
    let inFlight = 0;
    const inSet = (f: number) => !isMobile || (f - 1) % step === 0;

    const findPriorityFrame = (center: number, maxDistance = 15): number | null => {
      for (let dist = 0; dist <= maxDistance; dist++) {
        const framePlus = center + dist;
        if (
          framePlus >= 1 &&
          framePlus <= frameCount &&
          inSet(framePlus) &&
          !fetchedOrInFlight.current.has(framePlus)
        ) {
          return framePlus;
        }
        if (dist > 0) {
          const frameMinus = center - dist;
          if (
            frameMinus >= 1 &&
            frameMinus <= frameCount &&
            inSet(frameMinus) &&
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
      const concurrency = isMobile ? 4 : 6;
      while (inFlight < concurrency) {
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

        const fetchFrame = async () => {
          try {
            let res: Response | undefined;
            const cache = await caches.open('frame-cache-v1');
            const cachedRes = await cache.match(targetPath);
            if (cachedRes) {
              res = cachedRes;
            } else {
              const fetchPriority = (eager && currentFrame <= 12) ? 'high' : 'low';
              res = await fetch(targetPath, { priority: fetchPriority } as any);
              if (res.ok) {
                cache.put(targetPath, res.clone());
              }
            }
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const blob = await res.blob();
            if (cancelled) return;
            compressedBlobs.current.set(currentFrame, blob);
            loadedCount++;
            if (loadedCount >= requiredForReady) {
              setReady(true);
            }
            inFlight--;
            pump();
          } catch (err) {
            if (cancelled) return;
            if (!isFallenBack && fallbackFramePathRef.current) {
              setIsFallenBack(true);
              cancelled = true;
            } else {
              inFlight--;
              pump();
            }
          }
        };
        fetchFrame();
      }
    };

    pumpRef.current = pump;
    pump();

    return () => {
      cancelled = true;
      pumpRef.current = undefined;
    };
  }, [visible, frameCount, isMobile, tierResolved, reduced, isFallenBack, loadFull]);

  // GSAP ScrollTrigger pinning and target calculation
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__PRERENDER__) {
      return;
    }
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
          if (progress > 0) {
            setLoadFullRef.current(true);
          }
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

            createImageBitmap(blob, { resizeQuality: 'high' })
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
    if (typeof window !== 'undefined' && (window as any).__PRERENDER__) {
      return;
    }
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
      if (!hasDrawnFirst.current) {
        hasDrawnFirst.current = true;
        setCanvasDisplay('block');
        requestAnimationFrame(() => {
          setCanvasOpacity(1);
        });
      }
    };

    let pumpThrottleCount = 0;

    const loop = () => {
      playhead.current += (target.current - playhead.current) * LERP;
      const idealFrame = Math.round(playhead.current);
      const frame = findNearestFrame(idealFrame);
      if (frame !== null && frame !== lastDrawn) {
        draw(frame);
        lastDrawn = frame;
      }
      decodeFrames(idealFrame);
      if (pumpRef.current && pumpThrottleCount++ % 6 === 0) {
        pumpRef.current();
      }
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const c = canvasRef.current;
      const parent = stickyRef.current;
      if (!c || !parent) return;
      const isMob = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMob ? 1.5 : 2);
      const r = parent.getBoundingClientRect();
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

  const renderPoster = (style: React.CSSProperties) => {
    if (posterBase) {
      return (
        <picture>
          <source srcSet={media(`${posterBase}/mobile-poster.webp`)} type="image/webp" media="(max-width: 767px)" />
          <img
            src={media(`${posterBase}/poster.webp`)}
            alt=""
            fetchPriority="high"
            decoding="async"
            width={1920}
            height={1080}
            style={style}
          />
        </picture>
      );
    }
    return (
      <img
        src={poster}
        alt=""
        fetchPriority="high"
        decoding="async"
        width={1920}
        height={1080}
        style={style}
      />
    );
  };

  return (
    <div ref={trackRef} className={className} style={{ position: 'relative' }}>
      <div ref={stickyRef} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
        {reduced ? (
          renderPoster({
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          })
        ) : (
          <>
            {renderPoster({
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 1,
              pointerEvents: 'none',
              display: 'block',
              zIndex: 5,
            })}
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: canvasOpacity,
                transition: 'opacity 0.4s ease-out',
                display: canvasDisplay,
                transform: 'translateZ(0)',
                zIndex: 10,
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
