"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Asset {
  id: string;
  w: number;
  h: number;
  u?: string;
  p: string;
  t?: string;
}

interface Data {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: Asset[];
}

interface ModelProps {
  jsonPath: string;
  maxWidth?: string | number;
  scrollSpeed?: number;
  fitMode?: "contain" | "cover" | "stretch";
  id?: string;
}

let instanceCounter = 0;
const generateInstanceId = () =>
  `model-instance-${++instanceCounter}-${Date.now()}`;

const Model: React.FC<ModelProps> = ({
  jsonPath,
  maxWidth = "100%",
  scrollSpeed = 1,
  fitMode = "contain",
  id,
}) => {
  const instanceId = useMemo(() => id || generateInstanceId(), [id]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const isMountedRef = useRef(true);
  const resizeTimerRef = useRef<NodeJS.Timeout>(null);
  const renderCacheRef = useRef<Map<number, ImageBitmap>>(new Map());
  const isRenderingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isLowEndDevice = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency <= 4
      : false;
  }, []);

  const { totalFrames, width, videoHeight } = useMemo(() => {
    if (!data) return { totalFrames: 0, width: 1920, videoHeight: 1080 };
    return {
      totalFrames: data.op - data.ip,
      width: data.w || 1920,
      videoHeight: data.h || 1080,
    };
  }, [data]);

  // Mobile-specific optimizations
// Mobile-specific optimizations
const mobileConfig = useMemo(() => {
  const dpr = typeof window !== 'undefined' 
    ? (isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2))
    : 1; // fallback for SSR

  const useImageBitmap = typeof window !== 'undefined' 
    && 'createImageBitmap' in window 
    && !isMobile;

  return {
    dpr,
    maxFrames: isMobile && isLowEndDevice ? 30 : images.length,
    frameSkip: isMobile && isLowEndDevice ? 2 : 1,
    useImageBitmap,
  };
}, [isMobile, isLowEndDevice, images.length]);

  const cleanup = useCallback(() => {
    isMountedRef.current = false;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (scrollTriggerInstanceRef.current) {
      scrollTriggerInstanceRef.current.kill();
      scrollTriggerInstanceRef.current = null;
    }

    if (resizeTimerRef.current) {
      clearTimeout(resizeTimerRef.current);
    }

    // Clear ImageBitmap cache
    renderCacheRef.current.forEach((bitmap) => bitmap.close());
    renderCacheRef.current.clear();
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      cleanup();
      setTimeout(() => ScrollTrigger.refresh(), 100);
    };
  }, [cleanup]);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      if (!isMountedRef.current) return;

      try {
        setError(null);
        const response = await fetch(jsonPath);

        if (!response.ok) {
          throw new Error(`Failed to load JSON: ${response.statusText}`);
        }

        const jsonData = await response.json();

        if (isCancelled || !isMountedRef.current) return;

        if (!jsonData.assets || !Array.isArray(jsonData.assets)) {
          throw new Error("Invalid Lottie JSON: No assets found");
        }

        setData(jsonData);
      } catch (err) {
        if (!isCancelled && isMountedRef.current) {
          console.error(`[${instanceId}] Error loading Lottie JSON:`, err);
          setError(
            err instanceof Error ? err.message : "Failed to load animation data"
          );
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [jsonPath, instanceId]);

  useEffect(() => {
    if (!data?.assets) return;

    let isCancelled = false;

    const loadImages = async () => {
      const validAssets = data.assets.filter(
        (asset) =>
          asset.p && (asset.p.startsWith("data:image/") || asset.u || asset.p)
      );

      if (validAssets.length === 0) {
        if (!isCancelled && isMountedRef.current) {
          setError("No valid image assets found in animation data");
        }
        return;
      }

      // Reduce number of frames for mobile
      const assetsToLoad =
        isMobile && isLowEndDevice
          ? validAssets.filter((_, i) => i % 2 === 0)
          : validAssets;

      try {
        let loadedCount = 0;

        const imagePromises = assetsToLoad.map(
          (asset, index) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "anonymous";

              // Reduce image quality for mobile
              if (isMobile) {
                img.decoding = "async";
              }

              const onLoad = () => {
                loadedCount++;
                if (!isCancelled && isMountedRef.current) {
                  setLoadingProgress(
                    Math.round((loadedCount / assetsToLoad.length) * 100)
                  );
                }
                resolve(img);
              };

              const onError = () =>
                reject(new Error(`Failed to load image ${index}`));

              img.addEventListener("load", onLoad, { once: true });
              img.addEventListener("error", onError, { once: true });

              img.src = asset.p.startsWith("data:image/")
                ? asset.p
                : asset.u
                ? asset.u + asset.p
                : asset.p;
            })
        );

        const loadedImages = await Promise.all(imagePromises);

        if (!isCancelled && isMountedRef.current) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      } catch (err) {
        if (!isCancelled && isMountedRef.current) {
          console.error(`[${instanceId}] Error loading images:`, err);
          setError("Failed to load animation frames");
        }
      }
    };

    setIsLoaded(false);
    setLoadingProgress(0);
    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [data, instanceId, isMobile, isLowEndDevice]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isMountedRef.current) return false;

    const rect = canvas.getBoundingClientRect();
    const dpr = mobileConfig.dpr;
    const newWidth = rect.width * dpr;
    const newHeight = rect.height * dpr;

    if (
      canvasSizeRef.current.width !== newWidth ||
      canvasSizeRef.current.height !== newHeight
    ) {
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d", {
        alpha: true, // Disable alpha for better performance
        desynchronized: true,
        willReadFrequently: false,
      });

      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = !isMobile; // Disable on mobile for speed
        if (!isMobile) {
          ctx.imageSmoothingQuality = "low"; // Use low quality for speed
        }
      }

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      canvasSizeRef.current = { width: newWidth, height: newHeight };

      return true;
    }
    return false;
  }, [mobileConfig.dpr, isMobile]);

  const renderFrame = useCallback(
    (frameIndex: number, forceRender = false) => {
      // Throttle rendering on mobile
      if (isMobile && !forceRender) {
        const now = performance.now();
        if (now - lastFrameTimeRef.current < 16) {
          // ~60fps cap
          return;
        }
        lastFrameTimeRef.current = now;
      }

      if (!isMountedRef.current || isRenderingRef.current) return;

      const canvas = canvasRef.current;
      const img = images[frameIndex];

      if (!canvas || !img || !isLoaded) return;

      isRenderingRef.current = true;

      const ctx = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
        willReadFrequently: false,
      });

      if (!ctx) {
        isRenderingRef.current = false;
        return;
      }

      const canvasResized = setupCanvas();

      // Skip render if same frame and not resized
      if (
        !forceRender &&
        !canvasResized &&
        currentFrameRef.current === frameIndex
      ) {
        isRenderingRef.current = false;
        return;
      }

      currentFrameRef.current = frameIndex;

      const rect = canvas.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      let scaledWidth, scaledHeight, offsetX, offsetY;

      if (fitMode === "stretch") {
        scaledWidth = containerWidth;
        scaledHeight = containerHeight;
        offsetX = offsetY = 0;
      } else if (fitMode === "cover") {
        const scale = Math.max(
          containerWidth / width,
          containerHeight / videoHeight
        );
        scaledWidth = width * scale;
        scaledHeight = videoHeight * scale;
        offsetX = (containerWidth - scaledWidth) / 2;
        offsetY = (containerHeight - scaledHeight) / 2;
      } else {
        const scale = Math.min(
          containerWidth / width,
          containerHeight / videoHeight
        );
        scaledWidth = width * scale;
        scaledHeight = videoHeight * scale;
        offsetX = (containerWidth - scaledWidth) / 2;
        offsetY = (containerHeight - scaledHeight) / 2;
      }

      // Use solid color fill (faster than clearRect)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, containerWidth, containerHeight);

      try {
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      } catch (err) {
        console.error(`[${instanceId}] Error drawing frame:`, err);
      }

      isRenderingRef.current = false;
    },
    [
      images,
      isLoaded,
      width,
      videoHeight,
      setupCanvas,
      fitMode,
      instanceId,
      isMobile,
    ]
  );

  useEffect(() => {
    if (
      !isLoaded ||
      !containerRef.current ||
      images.length === 0 ||
      !isMountedRef.current
    ) {
      return;
    }

    const container = containerRef.current;

    if (scrollTriggerInstanceRef.current) {
      scrollTriggerInstanceRef.current.kill();
      scrollTriggerInstanceRef.current = null;
    }

    const timeoutId = setTimeout(() => {
      if (!isMountedRef.current || !container) return;

      const scrollDistance = isMobile
        ? Math.max(150, window.innerHeight * scrollSpeed * 1.5)
        : Math.max(200, window.innerHeight * scrollSpeed * 2);

      const st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: isMobile ? 0.8 : 0.5, // Slightly slower scrub on mobile for smoother feel
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        refreshPriority: -1,
        fastScrollEnd: true,
        preventOverlaps: true,
        onUpdate: (self) => {
          if (!isMountedRef.current) return;

          let frameIndex = Math.min(
            Math.floor(self.progress * (images.length - 1)),
            images.length - 1
          );

          // Apply frame skip for low-end devices
          if (mobileConfig.frameSkip > 1) {
            frameIndex =
              Math.floor(frameIndex / mobileConfig.frameSkip) *
              mobileConfig.frameSkip;
          }

          frameIndex = Math.max(0, frameIndex);

          // Skip if already rendering this frame
          if (frameIndex === currentFrameRef.current) {
            return;
          }

          // Use RAF for smoother updates
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
          }

          rafRef.current = requestAnimationFrame(() => {
            renderFrame(frameIndex);
          });
        },
        onRefresh: () => {
          if (!isMountedRef.current) return;
          renderFrame(0, true);
        },
      });

      scrollTriggerInstanceRef.current = st;
      renderFrame(0, true);
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
        scrollTriggerInstanceRef.current = null;
      }
    };
  }, [
    isLoaded,
    images.length,
    renderFrame,
    scrollSpeed,
    isMobile,
    mobileConfig.frameSkip,
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (!isMountedRef.current) return;

      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }

      resizeTimerRef.current = setTimeout(
        () => {
          if (
            isLoaded &&
            currentFrameRef.current >= 0 &&
            isMountedRef.current
          ) {
            renderFrame(currentFrameRef.current, true);
          }
        },
        isMobile ? 150 : 100
      );
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [isLoaded, renderFrame, isMobile]);

  const maxWidthStyle = useMemo(
    () => (typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth),
    [maxWidth]
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <h3 className="text-red-800 font-semibold">Animation Error</h3>
        <p className="text-red-600 mt-1">{error}</p>
        <p className="text-red-500 text-sm mt-1">Instance: {instanceId}</p>
      </div>
    );
  }

  return (
    <div className="w-full md:min-h-screen bg-white">
      <div
        ref={containerRef}
        className="w-full h-screen flex items-center justify-center"
        style={{
          maxWidth: maxWidthStyle,
          margin: "0 auto",
        }}
        data-model-instance={instanceId}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">
                Loading... {loadingProgress}%
              </p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`w-full h-full transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            width: isMobile ? "67%" : "100%",
            height: isMobile ? "70%" : "100%",
            willChange: "transform",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
      </div>
    </div>
  );
};

export default Model;
