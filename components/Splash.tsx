// components/Splash.tsx
"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Splash: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const loadingSteps = [
      { progress: 10, text: "Loading fonts...", delay: 300 },
      { progress: 25, text: "Preparing 3D assets...", delay: 500 },
      { progress: 45, text: "Loading textures...", delay: 700 },
      { progress: 65, text: "Initializing shaders...", delay: 600 },
      { progress: 85, text: "Optimizing performance...", delay: 500 },
      { progress: 100, text: "Almost ready...", delay: 400 },
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const executeStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];

        setTimeout(
          () => {
            setLoadingText(step.text);

            // Smooth progress animation
            const startProgress = currentProgress;
            const targetProgress = step.progress;
            const duration = 300;
            const startTime = Date.now();

            const animateProgress = () => {
              const elapsed = Date.now() - startTime;
              const progressRatio = Math.min(elapsed / duration, 1);

              // Easing function for smooth animation
              const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
              const easedProgress = easeOutCubic(progressRatio);

              const newProgress =
                startProgress +
                (targetProgress - startProgress) * easedProgress;
              setProgress(newProgress);
              currentProgress = newProgress;

              if (progressRatio < 1) {
                requestAnimationFrame(animateProgress);
              } else {
                currentStep++;
                if (currentStep < loadingSteps.length) {
                  setTimeout(executeStep, step.delay);
                } else {
                  // Final step - complete loading
                  setTimeout(() => {
                    setIsExiting(true);
                    setTimeout(() => {
                      setIsVisible(false);
                    }, 800); // Match exit animation duration
                  }, 500);
                }
              }
            };

            requestAnimationFrame(animateProgress);
          },
          currentStep === 0 ? 100 : 0
        );
      }
    };

    // ✅ Proper preloading of 3D models into drei/GLTF cache
    const preloadGLTFModels = () => {
      const gltfAssets = [
        "/models/s.glb",
        "/models/sp.glb",
        "/customize/case-navy.glb",
        "/customize/case-pink.glb",
        "/customize/case-silver.glb",
        "/customize/refill-navy.glb",
        "/customize/refill-pink.glb",
        "/customize/refill-silver.glb",
        "/customize/Spray-case-navy.glb",
        "/customize/Spray-case-pink.glb",
        "/customize/Spray-case-teal.glb",
      ];

      gltfAssets.forEach((asset) => useGLTF.preload(asset));
    };

    // ✅ Preload other JSON or small static resources
    const preloadResources = () => {
      const criticalAssets = ["/spray.json", "/stick.json"];

      criticalAssets.forEach((asset) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = asset;
        link.as = "fetch";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      });
    };

    preloadGLTFModels();
    preloadResources();

    // Check if fonts are already loaded
    const checkFontsLoaded = async () => {
      try {
        await document.fonts.ready;
        executeStep();
      } catch {
        executeStep();
      }
    };

    // Start loading process
    setTimeout(checkFontsLoaded, 500);
  }, []);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col bg-[#9AD4D6] w-full transition-all duration-800 ${
        isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Main content area */}
      <div className="flex-1 flex items-end justify-start px-8">
        {/* Main loading content */}
        <div className="relative z-10 text-center space-y-8 w-full">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <Image
              src="/logo/summrWhite.png"
              alt="Logo"
              width={500}
              height={500}
            />
          </div>

          {/* Loading progress */}
          <div className="space-y-6 w-full">
            {/* Progress bar - Full width */}
            <div className="relative w-full">
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full unique-progress-bar rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Progress percentage with new font style */}
            <div className="flex justify-end w-full">
              <div className="custom-percentage text-[100px] text-white font-bold tracking-wider drop-shadow-lg">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
