"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Proven = () => {
  const sectionRef = useRef(null);
  const circleRef = useRef(null);
  const contentRef = useRef(null);
  const mobileImageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const circle = circleRef.current;
    const content = contentRef.current;

    if (!section || !circle || !content) return;

    // Get viewport dimensions for proper scaling
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const diagonal = Math.sqrt(vw * vw + vh * vh);
    const scaleValue = (diagonal / 300) * 2; // Calculate scale to fill screen

    // Set initial states - START with full screen coverage
    gsap.set(circle, {
      scale: scaleValue, // Start scaled up (covering full screen)
      transformOrigin: "center center",
    });

    gsap.set(content, {
      opacity: 1,
    });

    // Initial state for mobile image - simple and elegant
    if (mobileImageRef.current) {
      gsap.set(mobileImageRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
      });
    }

    // Create the scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Optional: Add any additional logic during scroll
        },
      },
    });

    // Animate the circle to contract from full screen to small circle
    tl.to(circle, {
      scale: 1, // End at normal size (small circle)
      duration: 1,
      ease: "power2.out",
    });

    const floatingTl = gsap.timeline({ repeat: -1 });

    floatingTl
      .to(circle, {
        y: "+=30",
        x: "+=20",
        duration: 3,
        ease: "power1.inOut",
      })
      .to(circle, {
        y: "-=60",
        x: "-=10",
        duration: 3,
        ease: "power1.inOut",
      })
      .to(circle, {
        y: "+=30",
        x: "-=10",
        duration: 3,
        ease: "power1.inOut",
      });

    // Mobile image animation - simple and elegant entrance
    const imageEntranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    if (mobileImageRef.current) {
      imageEntranceTl.to(mobileImageRef.current, {
        duration: 1.2,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "power2.out",
        delay: 0.3,
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      floatingTl.kill();
      imageEntranceTl.kill();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className=" proven-section relative z-10 flex flex-col item-center justify-center h-screen lg:gap-40 gap-10 overflow-hidden xl:px-0 lg:px-5 px-5"
    >
      <div
        ref={circleRef}
        className="absolute w-[300px] h-[300px] bg-white rounded-full bottom-0 -right-40 "
      />
      <h1 className="z-10 text-black lg:text-[48px] text-[20px] lg:leading-[58px] leading-[28px] font-medium max-w-2xl  text-center mx-auto">
       Proven Efficacy<br/><span className="text-[#F79C7D] uppercase font-bold"> Without the Nasties
       </span>             
      </h1>
       <div
        ref={contentRef}
        className="relative z-10 flex flex-row justify-between max-w-6xl w-full mx-auto  lg:h-1/2 h-3/4 "
      >
        <div className="absolute top-0 left-0 flex flex-col lg:text-[32px] text-[16px] lg:leading-[34px] leading-[18px] font-medium lg:max-w-lg max-w-[250px]">
          <span className="text-black">A clean, plant-powered roll-on that keeps odor in check </span>
          <span className="text-[#8FB78F]">without aluminum, parabens, or the stickiness.</span>
        </div>

        {/* Mobile Image with Perfect Responsive Sizing and Centering */}
        <div className="md:hidden flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Image
            ref={mobileImageRef}
            src="https://ik.imagekit.io/99y1fc9mh/summr/SummrDeoSpray-TealSilver3%202.png?updatedAt=1757677986156"
            alt="Summr Deodorant Spray"
            width={300}
            height={300}
            className="w-[45vw] h-auto max-w-[180px] min-w-[120px] object-contain"
            priority
          />
        </div>
        
        <div className="absolute bottom-0 right-0 lg:text-[32px] text-[16px] lg:leading-[34px] leading-[18px] font-medium max-w-lg text-right">
           <span className="text-black">Lightly scented, ultra-smooth, and quick-drying,</span>
          <span className="text-[#9AD4D6]"> it's designed for all-day comfort even on the hottest days</span>
        </div>
      </div>  

    </div>
  );
};

export default Proven;