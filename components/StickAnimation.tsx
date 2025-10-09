"use client";
import React, { useRef, useEffect } from "react";
import { LeftArrow, RigthArrow } from "@/assets/Arrows";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Model from "./Model";
import { FiChevronDown } from "react-icons/fi";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const StickAnimation = () => {
  const containerRef = useRef(null);
  const caseRef = useRef(null);
  const refillRef = useRef(null);
  const capRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const caseElement = caseRef.current;
    const refillElement = refillRef.current;
    const capElement = capRef.current;
    const scrollRefElement = scrollRef.current;
        const isMobile = window.innerWidth <= 768;
        const endValue = isMobile ? "+=350%" : "+=500%";

    if (
      !container ||
      !caseElement ||
      !refillElement ||
      !capElement ||
      !scrollRefElement
    )
      return;

    // Set initial state - hide all text elements completely
    gsap.set([caseElement, refillElement, capElement, scrollRefElement], {
      opacity: 0,
      x: 0, // Start from natural position
      visibility: "hidden", // Ensure they're completely hidden initially
    });

    // Create the main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 10%",
        end: endValue,
        scrub: 1, // Smooth scrubbing
        pin: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          console.log("Scroll progress:", self.progress);
        },
      },
    });

    // Animation sequence - Starting from 40%
    tl.to(scrollRefElement, {
      opacity: 1,
      visibility: "visible",
    })
      // Phase 1: Show Case (40% - 55% of scroll)
      .to(
        caseElement,
        {
          opacity: 1,
          visibility: "visible",
          x: 0,
          duration: 0.15, // 15% of timeline (0.55 - 0.4)
          ease: "power2.out",
        },
        0.4
      )

      // Phase 2: Show Refill (55% - 70% of scroll)
      .to(
        refillElement,
        {
          opacity: 1,
          visibility: "visible",
          x: 0,
          duration: 0.15, // 15% of timeline (0.7 - 0.55)
          ease: "power2.out",
        },
        0.55
      )

      // Phase 3: Show Cap (70% - 80% of scroll)
      .to(
        capElement,
        {
          opacity: 1,
          visibility: "visible",
          x: 0,
          duration: 0.1, // 10% of timeline (0.8 - 0.7)
          ease: "power2.out",
        },
        0.7
      )

      // Phase 4: Hide Cap (80% - 85% of scroll) - FADE OUT ONLY
      .to(
        capElement,
        {
          opacity: 0,

          duration: 0.5, // 5% of timeline (0.85 - 0.8)
          ease: "power2.in",
        },
        0.8
      )

      // Phase 5: Hide Refill (85% - 90% of scroll) - FADE OUT ONLY
      .to(
        refillElement,
        {
          opacity: 0,

          duration: 0.5, // 5% of timeline (0.9 - 0.85)
          ease: "power2.in",
        },
        0.85
      )

      // Phase 6: Hide Case (90% - 95% of scroll) - FADE OUT ONLY
      .to(
        caseElement,
        {
          opacity: 0,

          duration: 0.5, // 5% of timeline (0.95 - 0.9)
          ease: "power2.in",
        },
        0.9
      )

       .to(scrollRefElement, {
        visibility: "hidden",
        opacity: 0,
      }, 0.9)

      .to(caseElement, {
        visibility: "hidden",
      })

      .to(refillElement, {
        visibility: "hidden",
      })
      .to(capElement, {
        visibility: "hidden",
      });

     
    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[300vh]">
      {/* Case - Bottom Right */}
      <div
        ref={caseRef}
        className="fixed md:right-25 right-12 bottom-10 w-1/2 h-1/2 flex flex-row items-center justify-start px-0 md:px-20 z-10 pb-20 md:gap-2 py-20"
        style={{ visibility: "hidden" }} // Additional CSS fallback
      >
        <Image src={RigthArrow} alt="Right Arrow" className="md:w-25 w-15" />

        <div className="flex flex-col md:gap-2 md:mt-30 mt-15">
          <h1 className="text-[#F79C7D] md:text-[40px] text-[20px] leading-[42px] font-bold">
            Refill
          </h1>
          <p className="md:text-[16px] text-[10px] md:leading-[24px] text-black md:max-w-[220px] max-w-[500px]">
            Choose your favourite Summr fragrance pod and we'll take care of the
            rest.
          </p>
        </div>
      </div>

      {/* Refill - Left Middle */}
      <div
        ref={refillRef}
        className="fixed md:left-10 left-[-2%]  top-[35%] transform -translate-y-1/2 w-1/2 h-1/2 flex flex-row items-center text-right justify-end px-2 md:px-20 z-10 md:gap-2"
        style={{ visibility: "hidden" }} // Additional CSS fallback
      >
        <div className="flex flex-col md:gap-2 mt-20">
          <h1 className="text-[#9AD4D6] md:text-[40px] text-[20px] leading-[42px] font-bold">
            Case
          </h1>
          <p className="md:text-[16px] text-[10px] md:leading-[24px] text-black md:max-w-[270px] max-w-[500px]">
            Collectible refill cases crafted from recycled ocean plastics and
            endlessly recyclable aluminium.
          </p>
        </div>
        <Image src={LeftArrow} alt="Left Arrow" className="md:w-25 w-15" />
      </div>

      {/* Stick Animation - Always visible in center */}
      <div className="flex items-center justify-center z-0">
        <Model jsonPath="/stick.json" scrollSpeed={1.9} id="animation-1" />
      </div>

      {/* Cap - Top Right - Fixed for mobile responsiveness */}
      <div
        ref={capRef}
        className="fixed md:right-[-100px] right-[170px] md:top-10 top-30 w-1/2 h-1/2 flex md:flex-row flex-row-reverse items-start justify-start px-0 md:px-20 z-10 md:pt-20 pt-4 md:gap-2 gap-1"
        style={{ visibility: "hidden" }}
      >
        <Image
          src={RigthArrow}
          alt="Right Arrow"
          className="md:w-25 w-12 flex-shrink-0 md:block hidden"
        />
         <Image
          src={LeftArrow}
          alt="Right Arrow"
          className="md:w-25 w-15 flex-shrink-0  md:hidden block "
        />
        <div className="flex flex-col md:gap-2 gap-1 md:mt-10 mt-2">
          <h1 className="text-[#8FB78F] md:text-[40px] text-[18px] leading-[20px] md:leading-[42px] font-bold">
            Cap
          </h1>
          <p className="md:text-[16px] text-[10px] md:leading-[24px]  text-black md:max-w-[200px] max-w-[500px]">
            Seamless seal, flawless glide. Designed to lock in, never leak out.
          </p>
        </div>
      </div>

      {/* Keep Scrolling Indicator - Improved Responsiveness */}
      <div
        ref={scrollRef}
        style={{ visibility: "hidden" }}
        className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center items-center z-50 px-4"
      >
        <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 md:py-3">
          {/* Animated Dot */}
          <div className="flex items-center justify-center">
            <div className="dot-animation bg-black" />
          </div>
          
          {/* Text */}
          <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-black whitespace-nowrap leading-none">
            Keep scrolling
          </span>
        </div>

        {/* Styles */}
        <style jsx>{`
          .dot-animation {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            animation: pulseCircle 1.5s infinite ease-in-out;
            flex-shrink: 0;
          }

          @media (min-width: 640px) {
            .dot-animation {
              width: 8px;
              height: 8px;
            }
          }

          @media (min-width: 768px) {
            .dot-animation {
              width: 10px;
              height: 10px;
            }
          }

          @media (min-width: 1024px) {
            .dot-animation {
              width: 12px;
              height: 12px;
            }
          }

          @keyframes pulseCircle {
            0% {
              opacity: 0.3;
              transform: scale(0.8) translateX(0);
            }
            50% {
              opacity: 1;
              transform: scale(1.2) translateX(2px);
            }
            100% {
              opacity: 0.3;
              transform: scale(0.8) translateX(0);
            }
          }

          @media (min-width: 640px) {
            @keyframes pulseCircle {
              0% {
                opacity: 0.3;
                transform: scale(0.8) translateX(0);
              }
              50% {
                opacity: 1;
                transform: scale(1.2) translateX(3px);
              }
              100% {
                opacity: 0.3;
                transform: scale(0.8) translateX(0);
              }
            }
          }

          @media (min-width: 768px) {
            @keyframes pulseCircle {
              0% {
                opacity: 0.3;
                transform: scale(0.8) translateX(0);
              }
              50% {
                opacity: 1;
                transform: scale(1.2) translateX(4px);
              }
              100% {
                opacity: 0.3;
                transform: scale(0.8) translateX(0);
              }
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default StickAnimation;