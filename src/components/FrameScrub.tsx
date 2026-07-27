import React, { useEffect, useRef, useState, useCallback } from 'react';
import { media } from '../lib/media';


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

  const previewBlobs = useRef<Map<number, Blob>>(new Map());
  const realBlobs = useRef<Map<number, Blob>>(new Map());
  const previewFetchedOrInFlight = useRef<Set<number>>(new Set());
  const realFetchedOrInFlight = useRef<Set<number>>(new Set());

  const previewBitmaps = useRef<Map<number, ImageBitmap>>(new Map());
  const realBitmaps = useRef<Map<number, ImageBitmap>>(new Map());
  const decodingFrames = useRef<Set<number>>(new Set());
  const pumpRef = useRef<(() => void) | undefined>(undefined);

  const playhead = useRef(1);
  const target = useRef(1);

  const [ready, setReady] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
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
  const lastDrawn = useRef<{ frame: number; quality: 'preview' | 'real' | null }>({ frame: -1, quality: null });

  useEffect(() => {
    setIsFallenBack(false);
    hasDrawnFirst.current = false;
    setCanvasDisplay('none');
    setCanvasOpacity(0);
  }, [pathKey]);

  useEffect(() => {
    if (loadFull) return;
    if (eager) {
      setLoadFullRef.current(true);
      return;
    }
    const triggerFullLoad = () => {
      setLoadFullRef.current(true);
    };
    window.addEventListener('scroll', triggerFullLoad, { passive: true, once: true });
    window.addEventListener('wheel', triggerFullLoad, { passive: true, once: true });
    window.addEventListener('touchstart', triggerFullLoad, { passive: true, once: true });
    return () => {
      window.removeEventListener('scroll', triggerFullLoad);
      window.removeEventListener('wheel', triggerFullLoad);
      window.removeEventListener('touchstart', triggerFullLoad);
    };
  }, [loadFull, eager]);

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
    const pBitmaps = previewBitmaps.current;
    const rBitmaps = realBitmaps.current;
    const pBlobs = previewBlobs.current;
    const rBlobs = realBlobs.current;
    const pInflight = previewFetchedOrInFlight.current;
    const rInflight = realFetchedOrInFlight.current;
    const decoding = decodingFrames.current;
    return () => {
      pBitmaps.forEach((bitmap) => bitmap.close());
      pBitmaps.clear();
      rBitmaps.forEach((bitmap) => bitmap.close());
      rBitmaps.clear();
      pBlobs.clear();
      rBlobs.clear();
      pInflight.clear();
      rInflight.clear();
      decoding.clear();
      pumpRef.current = undefined;
    };
  }, []);

  // Decode helper if the frame is very close to the active playhead
  const decodeImmediateIfClose = (frame: number, blob: Blob, isReal: boolean) => {
    const center = Math.round(playhead.current);
    if (Math.abs(frame - center) <= 5) {
      if (isReal && realBitmaps.current.has(frame)) return;
      if (!isReal && previewBitmaps.current.has(frame)) return;
      if (decodingFrames.current.has(frame)) return;

      decodingFrames.current.add(frame);
      createImageBitmap(blob)
        .then((bmp) => {
          decodingFrames.current.delete(frame);
          if (isReal) {
            realBitmaps.current.set(frame, bmp);
          } else {
            previewBitmaps.current.set(frame, bmp);
          }
        })
        .catch(() => {
          decodingFrames.current.delete(frame);
        });
    }
  };

  // Stride-based downloading & playhead priority management
  useEffect(() => {
    if (!visible || !tierResolved || reduced || !posterLoaded) return;

    let cancelled = false;

    // Reset caches if the resolution path key changes
    const key = `${pathKey}_${isFallenBack}`;
    const prevKey = `${lastPathKey.current}_${lastIsFallenBack.current}`;
    if (key !== prevKey) {
      previewBlobs.current.clear();
      previewBitmaps.current.forEach((bitmap) => bitmap.close());
      previewBitmaps.current.clear();
      previewFetchedOrInFlight.current.clear();

      realBlobs.current.clear();
      realBitmaps.current.forEach((bitmap) => bitmap.close());
      realBitmaps.current.clear();
      realFetchedOrInFlight.current.clear();

      decodingFrames.current.clear();
      setReady(false);
      lastPathKey.current = pathKey;
      lastIsFallenBack.current = isFallenBack;
    }

    let previewDownloadedCount = previewBlobs.current.size;
    const requiredForReady = isMobile ? 3 : 6;
    if (previewDownloadedCount >= requiredForReady) {
      setReady(true);
    }

    // Stride-pyramid order for preview tier (Stride 8 -> 4 -> 2 -> 1)
    const previewOrder: number[] = [];
    const strides = [8, 4, 2, 1];
    for (const stride of strides) {
      for (let i = 1; i <= frameCount; i += stride) {
        if (!previewOrder.includes(i)) previewOrder.push(i);
      }
    }

    const getPreviewFramePath = (i: number) => {
      const base = isMobile ? 'preview-mobile' : 'preview-desktop';
      return framePathRef.current(i).replace(/\/(desktop-hq|desktop|mobile)\//, `/${base}/`);
    };

    const pump = () => {
      if (cancelled) return;

      const previewFinished = previewBlobs.current.size === frameCount;

      if (!previewFinished) {
        // --- PHASE A: Preview tier fetching (Pyramid order) ---
        let inFlightPreview = previewFetchedOrInFlight.current.size - previewBlobs.current.size;
        const maxPreviewInFlight = isMobile ? 6 : 10;

        while (inFlightPreview < maxPreviewInFlight) {
          let frame = null;
          for (const f of previewOrder) {
            if (!previewFetchedOrInFlight.current.has(f)) {
              frame = f;
              break;
            }
          }

          if (frame === null) break;

          previewFetchedOrInFlight.current.add(frame);
          inFlightPreview++;

          const currentFrame = frame;
          const targetPath = getPreviewFramePath(currentFrame);

          const fetchPreviewFrame = async () => {
            try {
              let res: Response | undefined;
              let cache: Cache | null = null;

              try {
                cache = await caches.open('frame-cache-v1');
                const cachedRes = await cache.match(targetPath);
                if (cachedRes) {
                  res = cachedRes;
                }
              } catch { /* Cache API unavailable */ }

              if (!res) {
                const fetchPriority = (currentFrame === 1 || currentFrame === 9 || currentFrame === 17) ? 'high' : 'low';
                res = await fetch(targetPath, { priority: fetchPriority } as any);
                if (res.ok && cache) {
                  try {
                    cache.put(targetPath, res.clone());
                  } catch { /* ignore */ }
                }
              }

              if (!res.ok) throw new Error(`Status: ${res.status}`);
              const blob = await res.blob();
              if (cancelled) return;

              previewBlobs.current.set(currentFrame, blob);
              previewDownloadedCount++;

              if (previewDownloadedCount >= requiredForReady) {
                setReady(true);
              }

              decodeImmediateIfClose(currentFrame, blob, false);

              if (previewBlobs.current.size === frameCount) {
                setTimeout(() => {
                  if (pumpRef.current) pumpRef.current();
                }, 0);
              } else {
                pump();
              }
            } catch (err) {
              if (cancelled) return;
              previewFetchedOrInFlight.current.delete(currentFrame);
              setTimeout(pump, 1000);
            }
          };

          fetchPreviewFrame();
        }
      } else {
        // --- PHASE B: Real tier upgrading (Background, Playhead-aware) ---
        let inFlightReal = realFetchedOrInFlight.current.size - realBlobs.current.size;
        const maxRealInFlight = isMobile ? 4 : 6;

        while (inFlightReal < maxRealInFlight) {
          const center = Math.round(playhead.current);
          const UPGRADE_WINDOW = isMobile ? 25 : 40;

          const candidates: number[] = [];
          const lo = Math.max(1, center - UPGRADE_WINDOW);
          const hi = Math.min(frameCount, center + UPGRADE_WINDOW);

          for (let i = lo; i <= hi; i++) {
            if (!realFetchedOrInFlight.current.has(i)) {
              candidates.push(i);
            }
          }

          if (candidates.length === 0) break;

          const diff = target.current - playhead.current;
          const scrollDir = diff > 0 ? 1 : (diff < 0 ? -1 : 0);

          candidates.sort((a, b) => {
            const distA = Math.abs(a - center);
            const distB = Math.abs(b - center);

            const biasA = (scrollDir > 0 && a > center) || (scrollDir < 0 && a < center) ? 0.7 : 1.0;
            const biasB = (scrollDir > 0 && b > center) || (scrollDir < 0 && b < center) ? 0.7 : 1.0;

            return (distA * biasA) - (distB * biasB);
          });

          const frame = candidates[0];
          realFetchedOrInFlight.current.add(frame);
          inFlightReal++;

          const currentFrame = frame;
          const targetPath = isFallenBack && fallbackFramePathRef.current
            ? fallbackFramePathRef.current(currentFrame)
            : framePathRef.current(currentFrame);

          const fetchRealFrame = async () => {
            try {
              let res: Response | undefined;
              let cache: Cache | null = null;

              try {
                cache = await caches.open('frame-cache-v1');
                const cachedRes = await cache.match(targetPath);
                if (cachedRes) {
                  res = cachedRes;
                }
              } catch { /* Cache API unavailable */ }

              if (!res) {
                res = await fetch(targetPath, { priority: 'low' } as any);
                if (res.ok && cache) {
                  try {
                    cache.put(targetPath, res.clone());
                  } catch { /* ignore */ }
                }
              }

              if (!res.ok) throw new Error(`Status: ${res.status}`);
              const blob = await res.blob();
              if (cancelled) return;

              realBlobs.current.set(currentFrame, blob);

              decodeImmediateIfClose(currentFrame, blob, true);

              pump();
            } catch (err) {
              if (cancelled) return;
              if (!isFallenBack && fallbackFramePathRef.current) {
                setIsFallenBack(true);
                cancelled = true;
              } else {
                realFetchedOrInFlight.current.delete(currentFrame);
                setTimeout(pump, 1000);
              }
            }
          };

          fetchRealFrame();
        }
      }
    };

    pumpRef.current = pump;
    pump();

    return () => {
      cancelled = true;
      pumpRef.current = undefined;
    };
  }, [visible, frameCount, isMobile, tierResolved, reduced, isFallenBack, loadFull, posterLoaded]);

  // GSAP ScrollTrigger pinning and target calculation
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__PRERENDER__) {
      return;
    }
    const track = trackRef.current;
    if (!track) return;

    let ctx: any;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
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

      timer = setTimeout(() => ScrollTrigger.refresh(), 300);
    };

    init();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [frameCount, scrollLengthVh, snapPoints]);

  // Distance-first, Quality-second Nearest Frame Selection
  const findNearestFrame = useCallback((frame: number): number | null => {
    if (realBitmaps.current.has(frame)) return frame;
    if (previewBitmaps.current.has(frame)) return frame;

    let minDistance = Infinity;
    let nearest: { frame: number; isReal: boolean } | null = null;

    for (const key of realBitmaps.current.keys()) {
      const dist = Math.abs(key - frame);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { frame: key, isReal: true };
      }
    }
    for (const key of previewBitmaps.current.keys()) {
      const dist = Math.abs(key - frame);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { frame: key, isReal: false };
      } else if (dist === minDistance) {
        // Real-tier preferred if distance is equal
        if (nearest && !nearest.isReal) {
          // nearest is already preview, no change needed
        }
      }
    }

    if (nearest !== null) {
      let finalFrame = nearest.frame;
      let finalIsReal = nearest.isReal;

      if (!finalIsReal) {
        let bestRealFrame = null;
        let minRealDist = Infinity;
        for (const key of realBitmaps.current.keys()) {
          const dist = Math.abs(key - frame);
          if (dist < minRealDist) {
            minRealDist = dist;
            bestRealFrame = key;
          }
        }
        if (bestRealFrame !== null && minRealDist <= minDistance + 2) {
          finalFrame = bestRealFrame;
          finalIsReal = true;
        }
      }

      return finalFrame;
    }

    let nearestBlobFrame = null;
    let minBlobDist = Infinity;
    let isRealBlob = false;

    for (const key of realBlobs.current.keys()) {
      const dist = Math.abs(key - frame);
      if (dist < minBlobDist) {
        minBlobDist = dist;
        nearestBlobFrame = key;
        isRealBlob = true;
      }
    }
    for (const key of previewBlobs.current.keys()) {
      const dist = Math.abs(key - frame);
      if (dist < minBlobDist || (dist === minBlobDist && isRealBlob)) {
        minBlobDist = dist;
        nearestBlobFrame = key;
        isRealBlob = false;
      }
    }

    if (nearestBlobFrame !== null) {
      const blob = isRealBlob ? realBlobs.current.get(nearestBlobFrame) : previewBlobs.current.get(nearestBlobFrame);
      if (blob && !decodingFrames.current.has(nearestBlobFrame)) {
        decodingFrames.current.add(nearestBlobFrame);
        createImageBitmap(blob)
          .then((bmp) => {
            decodingFrames.current.delete(nearestBlobFrame!);
            if (isRealBlob) {
              realBitmaps.current.set(nearestBlobFrame!, bmp);
            } else {
              previewBitmaps.current.set(nearestBlobFrame!, bmp);
            }
          })
          .catch(() => {
            decodingFrames.current.delete(nearestBlobFrame!);
          });
      }
    }

    return null;
  }, []);

  // Sliding Decode Window with Eviction and Budgeting
  const decodeFrames = useCallback(
    async (center: number) => {
      const PREVIEW_WINDOW = isMobile ? 40 : 60;
      const REAL_WINDOW = isMobile ? 25 : 40;

      const pLo = Math.max(1, center - PREVIEW_WINDOW);
      const pHi = Math.min(frameCount, center + PREVIEW_WINDOW);

      const rLo = Math.max(1, center - REAL_WINDOW);
      const rHi = Math.min(frameCount, center + REAL_WINDOW);

      // 1. Evict offscreen preview bitmaps
      for (const [key, bitmap] of previewBitmaps.current) {
        if (key < pLo || key > pHi) {
          bitmap.close();
          previewBitmaps.current.delete(key);
        }
      }

      // 2. Evict offscreen real bitmaps
      for (const [key, bitmap] of realBitmaps.current) {
        if (key < rLo || key > rHi) {
          bitmap.close();
          realBitmaps.current.delete(key);
        }
      }

      // 3. Budget-controlled decode of real frames
      const realDecodeOrder: number[] = [];
      for (let dist = 0; dist <= REAL_WINDOW; dist++) {
        const p = center + dist;
        if (p >= rLo && p <= rHi) realDecodeOrder.push(p);
        if (dist > 0) {
          const m = center - dist;
          if (m >= rLo && m <= rHi) realDecodeOrder.push(m);
        }
      }

      let decodedCount = 0;
      const BUDGET = 4;

      for (const i of realDecodeOrder) {
        if (decodedCount >= BUDGET) break;
        if (
          !realBitmaps.current.has(i) &&
          !decodingFrames.current.has(i) &&
          realBlobs.current.has(i)
        ) {
          const blob = realBlobs.current.get(i);
          if (blob) {
            decodedCount++;
            decodingFrames.current.add(i);
            createImageBitmap(blob)
              .then((bmp) => {
                decodingFrames.current.delete(i);
                const currentCenter = Math.round(playhead.current);
                const currentLo = Math.max(1, currentCenter - REAL_WINDOW);
                const currentHi = Math.min(frameCount, currentCenter + REAL_WINDOW);
                if (i >= currentLo && i <= currentHi) {
                  realBitmaps.current.set(i, bmp);
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

      // 4. Budget-controlled decode of preview frames
      const previewDecodeOrder: number[] = [];
      for (let dist = 0; dist <= PREVIEW_WINDOW; dist++) {
        const p = center + dist;
        if (p >= pLo && p <= pHi) previewDecodeOrder.push(p);
        if (dist > 0) {
          const m = center - dist;
          if (m >= pLo && m <= pHi) previewDecodeOrder.push(m);
        }
      }

      for (const i of previewDecodeOrder) {
        if (decodedCount >= BUDGET) break;
        if (
          !previewBitmaps.current.has(i) &&
          !decodingFrames.current.has(i) &&
          previewBlobs.current.has(i)
        ) {
          const blob = previewBlobs.current.get(i);
          if (blob) {
            decodedCount++;
            decodingFrames.current.add(i);
            createImageBitmap(blob)
              .then((bmp) => {
                decodingFrames.current.delete(i);
                const currentCenter = Math.round(playhead.current);
                const currentLo = Math.max(1, currentCenter - PREVIEW_WINDOW);
                const currentHi = Math.min(frameCount, currentCenter + PREVIEW_WINDOW);
                if (i >= currentLo && i <= currentHi) {
                  previewBitmaps.current.set(i, bmp);
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
    let raf = 0;

    const draw = (frame: number) => {
      const canvas = canvasRef.current;
      const bmp = realBitmaps.current.get(frame) || previewBitmaps.current.get(frame);
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
          const lqip = document.getElementById('hero-lqip');
          if (lqip) {
            lqip.style.opacity = '0';
            setTimeout(() => lqip.remove(), 400);
          }
        });
      }
    };

    const loop = () => {
      playhead.current += (target.current - playhead.current) * LERP;
      const idealFrame = Math.round(playhead.current);
      const frame = findNearestFrame(idealFrame);

      if (frame !== null) {
        const quality = realBitmaps.current.has(frame) ? 'real' : 'preview';
        if (frame !== lastDrawn.current.frame || quality !== lastDrawn.current.quality) {
          draw(frame);
          lastDrawn.current = { frame, quality };
        }
      }

      decodeFrames(idealFrame);
      if (pumpRef.current) {
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
      lastDrawn.current = { frame: -1, quality: null };
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [ready, findNearestFrame, decodeFrames, tierResolved]);

  const posterImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = posterImgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || reduced) {
      setPosterLoaded(true);
      return;
    }

    const onLoad = async () => {
      try {
        const bmp = await createImageBitmap(img);
        if (!realBitmaps.current.has(1)) {
          realBitmaps.current.set(1, bmp);
        }
        setReady(true);
      } catch (err) {
        // poster decode failed, fall through to normal flow
      }
      setPosterLoaded(true);
    };

    if (img.complete && img.naturalWidth > 0) {
      onLoad();
    } else {
      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', () => {
        setPosterLoaded(true);
      }, { once: true });
      return () => img.removeEventListener('load', onLoad);
    }
  }, [reduced]);

  const renderPoster = (style: React.CSSProperties) => {
    if (posterBase) {
      return (
        <picture>
          <source srcSet={media(`${posterBase}/mobile-poster.webp`)} type="image/webp" media="(max-width: 767px)" />
          <img
            ref={posterImgRef}
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
        ref={posterImgRef}
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
              width: 'calc(100% - 1px)',
              height: 'calc(100% - 1px)',
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
                width: 'calc(100% - 1px)',
                height: 'calc(100% - 1px)',
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
