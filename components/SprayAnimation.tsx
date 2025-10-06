"use client";
import React, { useRef, useEffect } from 'react'
import { LeftArrow, RigthArrow } from '@/assets/Arrows';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Model from './Model';
import { FiChevronDown } from "react-icons/fi";
import { scroll } from 'framer-motion';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SprayAnimation = () => {
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
    const isMobile = window.innerWidth <= 768;
    const startValue = isMobile ? "bottom+=80% bottom" : "bottom bottom"
    const endValue = isMobile ? "+=150%" : "+=170%";
    const scrollRefElement = scrollRef.current;


    if (!container || !caseElement || !refillElement || !capElement || !scrollRefElement) return;

    // Set initial state - hide all text elements
    gsap.set([caseElement, refillElement, capElement, scrollRefElement], {
      opacity: 0,
      visibility: 'hidden' // Ensure they're completely hidden initially
    });

    // Create the main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: startValue,
       end: endValue,
        scrub: 1, // Smooth scrubbing
        pin: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          console.log('Scroll progress:', self.progress);
        }
      }
    });

    // Animation sequence with more delay and slower fade-out
    tl
      .to(scrollRefElement, {
        visibility:"Visible",
        opacity: 1,
      })
      // Phase 1: Show Case - More delayed start (40% instead of 30%)
      .to(caseElement, {
        opacity: 1,
        visibility: 'visible',
        x: 0,
        duration: 0.7, // Slightly longer fade-in
        ease: "power2.out"
      }, 0.2) // Increased delay
      
      // Phase 2: Show Refill - More delayed (65% instead of 60%)
      .to(refillElement, {
        opacity: 1,
        visibility: 'visible',
        x: 0,
        duration: 0.7, // Slightly longer fade-in
        ease: "power2.out"
      }, 0.7) // Increased delay
      
      // Phase 3: Show Cap - More delayed (80% instead of 75%)
      .to(capElement, {
        opacity: 1,
        visibility: 'visible',
        x: 0,
        duration: 0.7, // Slightly longer fade-in
        ease: "power2.out"
      }, 0.9) // Increased delay
      
      // Phase 4: Hide Case - Slower fade-out
      .to(capElement, {
        opacity: 0,
        x: 50,
        duration: 1.8, // Much slower fade-out (was 0.3)
        ease: "power2.out" // Smoother easing for fade-out
      }, 0.97)
      
      // Phase 5: Hide Refill - Slower fade-out
      .to(refillElement, {
        opacity: 0,

        x: -50,
        duration: 0.8, // Much slower fade-out (was 0.3)
        ease: "power2.out" // Smoother easing for fade-out
      }, 0.98)
      
      // Phase 6: Hide Cap - Slower fade-out
      .to(caseElement,  {
        opacity: 0,

        x: 50,
        duration: 0.8, // Much slower fade-out (was 0.3)
        ease: "power2.out" // Smoother easing for fade-out
      }, 0.99)

       .to(scrollRefElement, {
        visibility:'hidden'
      }, 0.99)
      
      .to(caseElement, {
        visibility:'hidden'
      })

       .to(refillElement, {
        visibility:'hidden'
      })
       .to(capElement, {
        visibility:'hidden'
      })

     
      
      
      ;

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    
     <div ref={containerRef} className="relative md:min-h-[300vh] min-h-[100vh] bg-white">
      
      {/* Case - Bottom Right */}
      <div
        ref={caseRef}
        className="fixed md:right-0 -right-5 bottom-1 w-1/2 h-1/2 flex md:flex-row flex-col md:items-center items-start justify-start px-8 md:px-20 z-10 pb-20 md:gap-2 py-20"
        style={{ visibility: 'hidden' }} // Additional CSS fallback
      >
        <Image unoptimized src={RigthArrow} alt='Right Arrow' className='md:w-25 w-12' />
        <div className='flex flex-col md:gap-2 md:mt-20'>
          <h1 className='text-[#8FB78F] md:md:text-[40px] text-[20px] leading-[42px] font-bold '>
            Case
          </h1>
          <p className='md:text-[16px] text-[10px] md:leading-[24px]  text-black  md:max-w-[270px] max-w-full'>
            Collectible refill cases crafted from recycled ocean plastics and endlessly recyclable aluminium.
          </p>
        </div>
      </div>

      {/* Refill - Left Middle */}
      <div
        ref={refillRef}
        className="fixed md:left-0 left-[-5%] md:top-[30%] top-[60%] transform -translate-y-1/2 w-1/2 h-1/2 flex md:flex-row flex-col-reverse md:items-center items-end text-right justify-end px-8 md:px-20 z-10 md:gap-2"
        style={{ visibility: 'hidden' }} // Additional CSS fallback
      >
        <div className='flex flex-col md:gap-2 md:mt-20 -mt-10 md:text-end text-start'>
          <h1 className='text-[#F79C7D] md:text-[40px] text-[20px] leading-[42px] font-bold '>
            Refill
          </h1>
          <p className='md:text-[16px] text-[10px] md:leading-[24px]  text-black md:max-w-[220px]'>
            Choose your favourite Summr fragrance pod and we'll take care of the rest.
          </p>
        </div>
        <Image unoptimized src={LeftArrow} alt='Left Arrow' className='md:w-25 w-12' />
      </div>

      {/* Stick Animation - Always visible in center */}
      <div className="flex items-center justify-center z-0">
        <Model jsonPath="/spray.json" scrollSpeed={1} id='animation-2' />
      </div>

      {/* Cap - Top Right */}
      <div
        ref={capRef}
        className="fixed right-0 md:-top-10 -top-[-5px] w-1/2 h-1/2 flex flex-row items-start justify-start px-1 md:px-20 z-10 md:pt-20 pt-15 md:gap-2"
        style={{ visibility: 'hidden' }} // Additional CSS fallback
      >
        <Image unoptimized src={RigthArrow} alt='Right Arrow' className='md:w-25 w-12' />
        <div className='flex flex-col md:gap-2 mt-8'>
          <h1 className='text-[#8FB78F] md:text-[40px] text-[20px] leading-[42px] font-bold '>
            Cap
          </h1>
          <p className='md:text-[16px] text-[10px] md:leading-[24px]  text-black max-w-[200px]'>
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

 
  )
}

export default SprayAnimation