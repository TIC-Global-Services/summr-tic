"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import CustomModelViewer from "./CustomModelViewer";

// Define the data structure directly in the component file
const customizeData = {
  case: [
    {
      stick: "/customize/case-navy.glb",
      spray: "/customize/Spray-case-navy.glb",
    },
    {
      stick: "/customize/case-pink.glb",
      spray: "/customize/Spray-case-pink.glb",
    },
    {
      stick: "/customize/case-silver.glb",
      spray: "/customize/Spray-case-teal.glb",
    },
  ],
  refill: [
    {
      stick: "/customize/refill-navy.glb",
      spray: "/customize/Spray-Navy-refill.glb",
    },
    {
      stick: "/customize/refill-pink.glb",
      spray: "/customize/Spray-pink-refill.glb",
    },
    {
      stick: "/customize/refill-silver.glb",
      spray: "/customize/Spray-teal-refill.glb",
    },
  ],
};

const CustomizeComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<"case" | "refill">("case");
  // Force re-render when switching models with more specific key
  const [renderKey, setRenderKey] = useState(0);
  // Add loading state to ensure proper initialization
  const [isInitialized, setIsInitialized] = useState(false);

  // Add responsive breakpoints to match CustomModelViewer
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1199 });

  const currentData = customizeData[activeCategory];
  const maxIndex = currentData.length - 1;

  // Initialize component properly
  useEffect(() => {
    setIsInitialized(true);
    setRenderKey(prev => prev + 1);
  }, []);

  // Force re-render when category changes
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [activeCategory, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    // Add small delay to ensure clean transition
    setTimeout(() => {
      setRenderKey(prev => prev + 1);
    }, 50);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    // Add small delay to ensure clean transition
    setTimeout(() => {
      setRenderKey(prev => prev + 1);
    }, 50);
  };

  const handleCategoryChange = (category: "case" | "refill") => {
    setActiveCategory(category);
    setCurrentIndex(0);
    // Force immediate re-render with new category
    setTimeout(() => {
      setRenderKey(prev => prev + 1);
    }, 100);
  };

  const currentItem = currentData[currentIndex];

  // Configuration for consistent positioning across all devices
  const getModelConfig = (type: 'stick' | 'spray', category: 'case' | 'refill') => {
    if (type === 'stick') {
      return {
        scale: category === 'case' ? 3.5 : 4,
        position: [0, 0, 0] as [number, number, number],
      };
    } else { // spray
      return {
        scale: category === 'case' ? 1.6 : 2,
        position: [0, 0, 0] as [number, number, number],
      };
    }
  };

  // Get current configurations
  const stickConfig = getModelConfig('stick', activeCategory);
  const sprayConfig = getModelConfig('spray', activeCategory);

  // Create unique keys that include all relevant state
  const stickKey = `stick-${activeCategory}-${currentIndex}-${stickConfig.scale}-${renderKey}-${isInitialized}`;
  const sprayKey = `spray-${activeCategory}-${currentIndex}-${sprayConfig.scale}-${renderKey}-${isInitialized}`;

  // Don't render until initialized
  if (!isInitialized) {
    return (
      <div className="bg-[#FBC4B0] rounded-t-[800px] -mt-20 items-center justify-center lg:h-[1180px] lg:py-40 py-30">
        <div className="w-full max-w-6xl mx-auto p-4 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBC4B0] rounded-t-[800px] -mt-20 items-center justify-center lg:h-[1180px] lg:py-40 py-30">
      <div className="w-full max-w-6xl mx-auto p-4">
        {/* Category Selector */}
        <div className="flex flex-col gap-10 justify-center items-center xl:pt-10 lg:pt-10 md:pt-10 pt-15 lg:mb-8">
          {/* Title */}
          <h1 className="text-center lg:text-[54px] text-[24px] lg:leading-[56px] leading-[27px] font-semibold lg:mb-6">
            CUSTOMIZE <span className="text-black">YOUR FRESH</span>
          </h1>

          {/* Fixed Buttons */}
          <div className="flex w-full gap-x-4 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => handleCategoryChange("case")}
              className={`flex-1 md:px-6 px-3 md:py-3 py-2 md:text-lg text-sm rounded-md font-medium transition-all duration-300 transform ${
                activeCategory === "case"
                  ? "bg-white text-black shadow-lg border-2 border-black scale-102"
                  : "bg-transparent text-black border-2 border-black hover:bg-white hover:text-black hover:shadow-lg hover:scale-102 hover:border-black"
              }`}
            >
              Choose your case
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange("refill")}
              className={`flex-1 md:px-6 px-3 md:py-3 py-2 md:text-lg text-sm rounded-md font-medium transition-all duration-300 transform ${
                activeCategory === "refill"
                  ? "bg-white text-black shadow-lg border-2 border-black scale-102"
                  : "bg-transparent text-black border-2 border-black hover:bg-white hover:text-black hover:shadow-lg hover:scale-102 hover:border-black"
              }`}
            >
              Pick your scent
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative flex items-center">
          {/* Navigation Buttons */}
          <button
            type="button"
            onClick={handlePrevious}
            className="md:block hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-200"
            aria-label="Previous model"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 hover:text-black transition-colors duration-200" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="md:block hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-200"
            aria-label="Next model"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 hover:text-black transition-colors duration-200" />
          </button>

<div className="md:hidden  absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-200"
              aria-label="Previous model"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 hover:text-black transition-colors duration-200" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-200"
              aria-label="Next model"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 hover:text-black transition-colors duration-200" />
            </button>
          </div>
          {/* Models Container with consistent positioning */}
          <div className="grid grid-cols-2 lg:grid-cols-2 w-full h-full lg:-space-x-30 -space-x-0">
            {/* Stick Model */}
            <div className="flex items-center justify-center h-[450px] xl:h-[600px] lg:h-[600px] md:h-[600px]">
              <div className="w-full h-full flex items-center justify-center relative">
                <CustomModelViewer
                  key={stickKey}
                  modelPath={currentItem.stick}
                  className="h-full w-full md:pointer-events-auto pointer-events-none"
                  scale={stickConfig.scale}
                  position={stickConfig.position}
                  exposure={1}
                  environment="city"
                  environmentIntensity={1.5}
                 
                />
              </div>
            </div>

            {/* Spray Model */}
            <div className="flex items-center justify-center h-[390px] md:mt-0 mt-6 xl:h-[600px] lg:h-[600px] md:h-[600px]">
              <div className="w-full h-full flex items-center justify-center relative pointer-events-none select-none">
                <CustomModelViewer
                  key={sprayKey}
                  modelPath={currentItem.spray}
                  className="h-full w-full md:pointer-events-auto pointer-events-none"
                  scale={sprayConfig.scale}
                  position={sprayConfig.position}
                  exposure={1.4}
                  environment="city"
                  environmentIntensity={1.5}
                  
                 
                />
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-center lg:text-[32px] text-[24px] lg:leading-[34px] leading-[18px] text-black font-bold lg:mb-6 lg:mt-18 mt-15">
          Your Summr, <span className="text-white">Your Vibe</span>
        </h1>
      </div>
    </div>
  );
};

export default CustomizeComponent;