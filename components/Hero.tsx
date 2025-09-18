"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import SplitText from "gsap/dist/SplitText";

gsap.registerPlugin(SplitText);

const Hero = () => {
  const leftRef = useRef<HTMLHeadingElement>(null);
  const rightRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const mobileImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!leftRef.current || !rightRef.current || !imageRef.current) return;

      // Split text into words
      const leftSplit = new SplitText(leftRef.current, { type: "words" });
      const rightSplit = new SplitText(rightRef.current, { type: "words" });

      // Set initial state
      gsap.set(leftSplit.words, { opacity: 0, y: 20, filter: "blur(4px)" });
      gsap.set(rightSplit.words, { opacity: 0, y: 20, filter: "blur(4px)" });

      // Initial state for mobile image - simple and elegant
      if (mobileImageRef.current) {
        gsap.set(mobileImageRef.current, {
          opacity: 0,
          y: 20,
          scale: 0.95,
        });
      }

      // Timeline for smooth reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Eye-opening animation for the image
      tl
        // Left text reveal
        .to(
          leftSplit.words,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.07,
            duration: 0.8,
          },
          "-=0.6"
        )
        // Right text reveal
        .to(
          rightSplit.words,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.07,
            duration: 0.8,
          },
          "-=0.6"
        )
        // Mobile image animation - simple and elegant
        .to(
          mobileImageRef.current,
          {
            duration: 1.2,
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
          },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col items-center lg:justify-start justify-center lg:gap-15 h-[100dvh] lg:py-25 py-10 xl:px-0 lg:px-5 px-5 xl:-mt-10 lg:mt-0">
      {/* Wrapping image inside a container so we can animate it */}
      <div ref={imageRef} className="">
        <Image
          unoptimized
          src="/logo/summrBlue.png"
          alt="Summr Logo"
          width={1000}
          height={1000}
          className="lg:w-[1200px] "
        />
      </div>

      <div className="flex lg:flex-row flex-col max-w-[1050px] mx-auto justify-between lg:mt-0 mt-10 lg:items-start items-center w-full lg:h-full bg-transparent h-3/4 relative">
        <h1
          ref={leftRef}
          className="xl:text-[24px] lg:text-[24px] text-[16px] xl:leading-[28px] leading-[18px] text-black lg:text-start text-center lg:max-w-xs max-w-[250px] font-medium"
        >
          Meet The Next Generation Of Sweat and Body Care!
        </h1>
        
        {/* Mobile Image with Perfect Responsive Sizing and Centering */}
        <div className="md:hidden flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 ">
          <Image
            ref={mobileImageRef}
            src="https://ik.imagekit.io/99y1fc9mh/summr/Frame%20287.png?updatedAt=1757677986582"
            alt="Summr Product Frame"
            width={600}
            height={600}
            className="w-[90vw] h-auto max-w-[400px] min-w-[200px] object-contain"
            priority
          />
        </div>

        <h1
          ref={rightRef}
          className="xl:text-[24px] lg:text-[24px] text-[16px] xl:leading-[28px] lg:leading-[28px] leading-[18px] text-black lg:max-w-[360px] max-w-[300px] lg:text-start text-center font-medium mt-auto"
        >
          The Sustainable Anti Perspirant Deodorant Hybrid Backed By Breakthrough Science.
        </h1>
      </div>
    </div>
  );
};

export default Hero;