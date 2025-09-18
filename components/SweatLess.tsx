"use client";
import { Contents } from "@/data/SweatLess";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SweatLess = () => {
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
    const scaleValue = (diagonal / 300) * 2; // Increased multiplier for perfect fill

    // Set initial states
    gsap.set(circle, {
      scale: 1,
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

    // Animate the circle to cover the entire screen
    tl.to(circle, {
      scale: scaleValue,
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
      className="sweatless-section relative z-10 flex flex-col item-center justify-center h-screen lg:gap-40  gap-1 px-5 lg:px-0 overflow-hidden"
    >
      <div
        ref={circleRef}
        className="absolute w-[300px] h-[300px] bg-white rounded-full top-10 -left-10 "
      />
      <h1 className="z-10 text-black lg:text-[24px] text-[12px] lg:leading-[28px] leading-[15px] font-medium max-w-[800px]  text-center mx-auto">
        <span>
          Freshness That Lasts. Impact That Counts. <br />
          Plastic-free, compostable refills in a lifetime-worthy case. Smelling
          good and doing good has never been easier.
        </span>
      </h1>

      <div
        ref={contentRef}
        className="relative z-10 flex lg:flex-row flex-col justify-between max-w-[1080px] w-full lg:h-auto h-3/4 mx-auto "
      >
        <div className="flex flex-col lg:text-[100px] text-[40px] lg:leading-[102px] leading-[45px] font-semibold lg:text-start text-center">
          <span className="text-[#9AD4D6]">Sweat Less.</span>
          <span className="text-[#8FB78F]">Live More.</span>
        </div>

        {/* Mobile Image with Perfect Responsive Sizing and Centering */}
        <div className="md:hidden flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-10 z-20">
          <Image
            ref={mobileImageRef}
            src="https://ik.imagekit.io/99y1fc9mh/summr/SummrStick_Teal-Full-Straight%203.png?updatedAt=1757677986604"
            alt="Summr Stick Deodorant"
            width={500}
            height={500}
            className="w-[50vw] h-auto max-w-[300px] min-w-[140px] object-contain -mt-25"
            priority
          />
        </div>

        <div className="lg:text-start md:text-center text-center flex flex-col lg:justify-start md:justify-center justify-center lg:items-start md:items-center items-center">
          {Contents.map((item, index) => (
            <div
              key={index}
              className="flex md:flex-row flex-col items-center justify-center max-w-xs gap-3 mb-3"
            >
              <item.icon color={item.iconColor} className="md:w-10" />
              <p className="text-black lg:text-[20px] text-[14px] lg:leading-[24px] leading-[16px] font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SweatLess;
