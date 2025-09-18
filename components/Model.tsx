"use client";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
 import { useMediaQuery } from "react-responsive";


// Register plugin only once
if (typeof window !== 'undefined') {
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
  fitMode?: 'contain' | 'cover' | 'stretch';
  id?: string;
}

// Create a unique ID generator
let instanceCounter = 0;
const generateInstanceId = () => {
  instanceCounter++;
  return `model-instance-${instanceCounter}-${Date.now()}`;
};

const Model: React.FC<ModelProps> = ({ 
  jsonPath, 
  maxWidth = "100%", 
  scrollSpeed = 1, 
  fitMode = '',
  id
}) => {
  // Generate truly unique ID
  const instanceId = useMemo(() => id || generateInstanceId(), [id]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  
  // Use a more robust cleanup approach
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const isMountedRef = useRef(true);
  const animationFrameRef = useRef<number | null>(null);

  // Ensure cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Kill ScrollTrigger instance
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
        scrollTriggerInstanceRef.current = null;
      }
      
      // Refresh ScrollTrigger to recalculate remaining instances
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };
  }, []);

  // Load JSON data
  useEffect(() => {
    let isCancelled = false;
    
    const loaddata = async () => {
      if (!isMountedRef.current) return;
      
      try {
        setError(null);
        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error(`Failed to load JSON: ${response.statusText}`);
        }
        const data = await response.json();

        if (isCancelled || !isMountedRef.current) return;

        if (!data.assets || !Array.isArray(data.assets)) {
          throw new Error("Invalid Lottie JSON: No assets found");
        }

        console.log(`[${instanceId}] Lottie data loaded:`, {
          totalFrames: data.op - data.ip,
          assets: data.assets.length,
          dimensions: `${data.w}x${data.h}`,
        });

        setData(data);
      } catch (error) {
        if (!isCancelled && isMountedRef.current) {
          console.error(`[${instanceId}] Error loading Lottie JSON:`, error);
          setError(error instanceof Error ? error.message : "Failed to load animation data");
        }
      }
    };

    loaddata();
    
    return () => {
      isCancelled = true;
    };
  }, [jsonPath, instanceId]);

  // Extract frame count and dimensions
  const { totalFrames, width, videoHeight } = useMemo(() => {
    if (!data) return { totalFrames: 0, width: 1920, videoHeight: 1080 };
    return {
      totalFrames: data.op - data.ip,
      width: data.w || 1920,
      videoHeight: data.h || 1080
    };
  }, [data]);

  // Load images
  useEffect(() => {
    let isCancelled = false;
    
    const loadImages = async () => {
      if (!data || !data.assets || !isMountedRef.current) return;

      const validAssets = data.assets.filter(asset => {
        if (!asset.p) return false;
        return asset.p.startsWith('data:image/') || (asset.u && asset.p) || asset.p;
      });

      console.log(`[${instanceId}] Loading ${validAssets.length} valid assets`);

      if (validAssets.length === 0) {
        if (!isCancelled && isMountedRef.current) {
          setError("No valid image assets found in animation data");
        }
        return;
      }

      try {
        let loadedCount = 0;
        const imagePromises = validAssets.map((asset, index) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            const onLoad = () => {
              loadedCount++;
              if (!isCancelled && isMountedRef.current) {
                setLoadingProgress(Math.round((loadedCount / validAssets.length) * 100));
              }
              resolve(img);
            };
            
            const onError = () => {
              reject(new Error(`Failed to load image ${index}`));
            };
            
            img.addEventListener('load', onLoad, { once: true });
            img.addEventListener('error', onError, { once: true });

            // Set image source
            let imageSrc: string;
            if (asset.p.startsWith('data:image/')) {
              imageSrc = asset.p;
            } else if (asset.u && asset.p) {
              imageSrc = asset.u + asset.p;
            } else {
              imageSrc = asset.p;
            }
            
            img.src = imageSrc;
          });
        });

        const loadedImages = await Promise.all(imagePromises);
        
        if (!isCancelled && isMountedRef.current) {
          setImages(loadedImages);
          setIsLoaded(true);
          console.log(`[${instanceId}] Successfully loaded ${loadedImages.length} frames`);
        }
      } catch (error) {
        if (!isCancelled && isMountedRef.current) {
          console.error(`[${instanceId}] Error loading images:`, error);
          setError("Failed to load animation frames");
        }
      }
    };

    if (data && data.assets && data.assets.length > 0) {
      setIsLoaded(false);
      setLoadingProgress(0);
      loadImages();
    }
    
    return () => {
      isCancelled = true;
    };
  }, [data, instanceId]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isMountedRef.current) return false;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const newWidth = rect.width * dpr;
    const newHeight = rect.height * dpr;

    if (
      canvasSizeRef.current.width !== newWidth ||
      canvasSizeRef.current.height !== newHeight
    ) {
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      canvasSizeRef.current = { width: newWidth, height: newHeight };
      return true;
    }
    return false;
  }, []);

  const renderFrame = useCallback(
    (frameIndex: number, forceRender = false) => {
      if (!isMountedRef.current) return;
      
      const canvas = canvasRef.current;
      if (!canvas || !images[frameIndex] || !isLoaded) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const canvasResized = setupCanvas();

      if (!forceRender && !canvasResized && currentFrameRef.current === frameIndex) {
        return;
      }

      currentFrameRef.current = frameIndex;

      const rect = canvas.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      let scaledWidth, scaledHeight, offsetX, offsetY;

      if (fitMode === 'stretch') {
        scaledWidth = containerWidth;
        scaledHeight = containerHeight;
        offsetX = 0;
        offsetY = 0;
      } else if (fitMode === 'cover') {
        const scaleX = containerWidth / width;
        const scaleY = containerHeight / videoHeight;
        const scale = Math.max(scaleX, scaleY);
        scaledWidth = width * scale;
        scaledHeight = videoHeight * scale;
        offsetX = (containerWidth - scaledWidth) / 2;
        offsetY = (containerHeight - scaledHeight) / 2;
      } else {
        const scaleX = containerWidth / width;
        const scaleY = containerHeight / videoHeight;
        const scale = Math.min(scaleX, scaleY);
        scaledWidth = width * scale;
        scaledHeight = videoHeight * scale;
        offsetX = (containerWidth - scaledWidth) / 2;
        offsetY = (containerHeight - scaledHeight) / 2;
      }

      ctx.clearRect(0, 0, containerWidth, containerHeight);
      
      try {
        ctx.drawImage(images[frameIndex], offsetX, offsetY, scaledWidth, scaledHeight);
      } catch (drawError) {
        console.error(`[${instanceId}] Error drawing frame:`, drawError);
      }
    },
    [images, isLoaded, width, videoHeight, setupCanvas, fitMode, instanceId]
  );

  // ScrollTrigger setup with better isolation
  useEffect(() => {
    if (!isLoaded || !containerRef.current || images.length === 0 || !isMountedRef.current) {
      return;
    }

    const container = containerRef.current;

    // Clean up any existing ScrollTrigger
    if (scrollTriggerInstanceRef.current) {
      scrollTriggerInstanceRef.current.kill();
      scrollTriggerInstanceRef.current = null;
    }

    // Use a small delay to ensure DOM is fully settled
    const timeoutId = setTimeout(() => {
      if (!isMountedRef.current || !container) return;

      const scrollDistance = Math.max(200, window.innerHeight * scrollSpeed * 2);

      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        refreshPriority: -1, // Lower priority to avoid conflicts
        onUpdate: (self) => {
          if (!isMountedRef.current) return;
          
          const progress = self.progress;
          const frameIndex = Math.min(
            Math.floor(progress * (images.length - 1)),
            images.length - 1
          );

          // Cancel previous animation frame
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }

          animationFrameRef.current = requestAnimationFrame(() => {
            if (isMountedRef.current) {
              renderFrame(Math.max(0, frameIndex));
            }
          });
        },
        onRefresh: () => {
          if (!isMountedRef.current) return;
          
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }

          animationFrameRef.current = requestAnimationFrame(() => {
            if (isMountedRef.current) {
              renderFrame(0, true);
            }
          });
        },
      });

      scrollTriggerInstanceRef.current = st;

      // Initial render
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        if (isMountedRef.current) {
          renderFrame(0, true);
        }
      });
    }, 50); // Small delay to ensure stability

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
        scrollTriggerInstanceRef.current = null;
      }
    };
  }, [isLoaded, images.length, renderFrame, scrollSpeed]);

  // Handle window resize
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      if (!isMountedRef.current) return;
      
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isLoaded && currentFrameRef.current >= 0 && isMountedRef.current) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          animationFrameRef.current = requestAnimationFrame(() => {
            if (isMountedRef.current) {
              renderFrame(currentFrameRef.current, true);
            }
          });
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isLoaded, renderFrame]);

  const getMaxWidthStyle = () => {
    if (typeof maxWidth === 'number') {
      return `${maxWidth}px`;
    }
    return maxWidth;
  };

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
          maxWidth: getMaxWidthStyle(),
          margin: '0 auto'
        }}
        data-model-instance={instanceId}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading... {loadingProgress}%</p>
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
          
            willChange: "auto",
          }}
        />
      </div>
    </div>
  );
};

export default Model;