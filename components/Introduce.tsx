"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Contents } from "@/data/Introducing";
import gsap from "gsap";
import SplitText from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

function Introduce() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const subHeaderRef = useRef<HTMLSpanElement>(null);
  const introducingTextRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);
  const introducingLabelRef = useRef<HTMLHeadingElement>(null);
  const circularBgRef = useRef<HTMLDivElement>(null);
  const mobileImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (
        !headerRef.current ||
        !subHeaderRef.current ||
        !introducingTextRef.current ||
        !contentsRef.current
      ) {
        return;
      }

      // Check device type
      const isMobile = window.innerWidth <= 767;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      let endValue = "+=100%"; // Default for desktop
      if (isMobile) {
        endValue = "+=10%";
      } else if (isTablet) {
        endValue = "+=100%";
      }

      const headerSplit = new SplitText(headerRef.current, {
        type: "chars",
      });
      const subHeaderSplit = new SplitText(subHeaderRef.current, {
        type: "chars",
      });
      const introducingTextSplit = new SplitText(introducingTextRef.current, {
        type: "chars",
        wordsClass: "char-animate",
      });

      // Initial states
      gsap.set(headerSplit.chars, { opacity: 0, y: 30 });
      gsap.set(subHeaderSplit.chars, { opacity: 0, y: 30 });
      gsap.set(introducingTextSplit.chars, {
        opacity: 0,
      });
      gsap.set(introducingLabelRef.current, { opacity: 0, x: -30 });
      gsap.set(logoRef.current, { opacity: 0, scale: 0, rotation: -40 });

      // Initial state for mobile image - simple and elegant
      if (mobileImageRef.current) {
        gsap.set(mobileImageRef.current, {
          opacity: 0,
          y: 20,
          scale: 0.95,
        });
      }

      // Initial state for circular background
      gsap.set(circularBgRef.current, {
        scale: 0,
        opacity: 1,
      });

      // Enhanced initial states for content items - more dramatic and premium
      const contentItems = Array.from(
        contentsRef.current.children
      ) as HTMLElement[];
      const contentImages = contentItems.map((item) =>
        item.querySelector("img")
      );
      const contentTexts = contentItems.map((item) => item.querySelector("h1"));

      gsap.set(contentItems, {
        opacity: 0,
      });

      // Separate initial states for images and text within content items
      gsap.set(contentImages, {
        scale: 0.3,
        rotation: 45,
        opacity: 0,
        transformOrigin: "center center",
      });

      gsap.set(contentTexts, {
        x: 30,
        opacity: 0,
      });

      // First animation timeline - triggers on section enter
      const enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      enterTl
        // Circular background animation
        .to(circularBgRef.current, {
          duration: 1.2,
          scale: 1,
          ease: "power2.out",
        })
        // Header animation
        .to(
          headerSplit.chars,
          {
            duration: 0.8,
            opacity: 1,
            y: 0,
            stagger: {
              from: "start",
              each: 0.02,
            },
            ease: "power2.out",
          },
          0.3
        )
        // Subheader animation
        .to(
          subHeaderSplit.chars,
          {
            duration: 0.8,
            opacity: 1,
            y: 0,
            stagger: {
              from: "start",
              each: 0.02,
            },
            ease: "power2.out",
          },
          0.6
        )
        // Make introducing text visible but still disabled color
        .to(
          introducingTextSplit.words,
          {
            duration: 0.6,
            opacity: 1,
            ease: "power2.out",
          },
          0.9
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
          1.1
        );

      // Main scroll-triggered timeline - with device-responsive end value
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: endValue, // Dynamic end value based on screen size
          scrub: 1.5,
          pin: true,
        },
      });

      // Calculate text animation duration based on character count
      const textCharCount = introducingTextSplit.chars.length;
      const textAnimationDuration = textCharCount;
      const textAnimationEnd = 4 + textAnimationDuration;

      // Create individual animations for each step with proper timing
      mainTl
        // Step 1: Introduction label appears (0-1s in timeline)
        .to(
          introducingLabelRef.current,
          {
            duration: 2,
            opacity: 1,
            x: 0,
            ease: "power3.out",
          },
          0
        )

        // Step 2: Logo animation (0.8-3s in timeline)
        .to(
          logoRef.current,
          {
            duration: 2.5,
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: "elastic.out(1, 0.5)",
          },
          0.8
        )

        // Step 3: Text color initialization (3.5s in timeline)
        .to(
          introducingTextSplit.chars,
          {
            color: "#8F8F8F",
            opacity: 1,
            duration: 0.1,
          },
          3.5
        )

        // Step 4: Text color change animation (4-12s in timeline)
        .to(
          introducingTextSplit.chars,
          {
            duration: textAnimationDuration,
            color: "#000000",
            opacity: 1,
            ease: "none",
            stagger: {
              each: 0.5,
              from: "start",
            },
          },
          4
        )

        // Step 5: Content items animation - starts after text animation is completely done
        // First, make content items visible
        .to(
          contentItems,
          {
            opacity: 1,
            duration: 0.1,
          },
          textAnimationEnd + 1
        )

        // Then animate each content item one by one with slower, smoother effect
        .to(
          contentImages,
          {
            duration: 4, // Even slower duration for smoother effect
            scale: 1,
            rotation: 0,
            opacity: 1,
            ease: "power2.out",
            stagger: {
              each: 2.5, // Slower stagger - 2.5 seconds between each item
              from: "start",
            },
          },
          textAnimationEnd + 1.5
        )

        // Animate text with a slight delay after each image
        .to(
          contentTexts,
          {
            duration: 3.5, // Slower text animation
            x: 0,
            opacity: 1,
            ease: "power2.out",
            stagger: {
              each: 2.5, // Same stagger timing as images
              from: "start",
            },
          },
          textAnimationEnd + 2 // Start slightly after images for cascading effect
        );

      return () => {
        headerSplit.revert();
        subHeaderSplit.revert();
        introducingTextSplit.revert();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={sectionRef}
        className="relative  h-screen xl:py-20 lg:py-30 py-10 xl:px-0 lg:px-7 px-5 overflow-hidden    xl:block lg:block md:block hidden"
      >
        {/* Circular expanding background */}
        <div
          ref={circularBgRef}
          className="absolute inset-0 bg-[#9AD4D6] lg:rounded-tl-[400px] lg:rounded-br-[400px] w-full h-full"
          style={{
            transformOrigin: "top right",
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 h-full rounded-tl-[400px] rounded-br-[400px]">
          <div className="text-black lg:text-[54px] text-[20px] lg:leading-[56px] leading-[24px] text-center  font-bold mb-20">
            <h1
              ref={headerRef}
              className="perspective-1000 font-medium tracking-tight"
            >
              Customized Sweatcare
            </h1>
            <span
              ref={subHeaderRef}
              className="text-white lg:text-[48px] lg:leading-[50px] perspective-1000"
            >
              That Works
            </span>
          </div>

          <div className="max-w-5xl mx-auto h-3/4 relative px-8">
            <div className="absolute top-0 left-0">
              <div className="flex flex-row gap-2 items-center mb-2">
                <h1
                  ref={introducingLabelRef}
                  className="text-black lg:text-[24px] text-[16px] lg:leading-[28px] leading-[18px] font-semibold"
                >
                  Introducing
                </h1>
                <Image
                  ref={logoRef}
                  src="/logo/summrWhite.png"
                  alt="Summr Logo"
                  width={200}
                  height={200}
                  className="lg:w-[100px] w-[65px] filter drop-shadow-lg"
                />
              </div>
              <p
                ref={introducingTextRef}
                className="text-black lg:text-[24px] text-[16px] lg:leading-[32px] leading-[19px] max-w-[430px] font-medium"
              >
                We don't just solve sweat and body odour. We give you seriously
                fresh pits - Solve pigmentation, Chafing, Ingrown hair and a lil
                extra love for your pits
              </p>
            </div>

            {/* Mobile Image with Perfect Responsive Sizing */}
            <div className="md:hidden flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <Image
                ref={mobileImageRef}
                src="https://ik.imagekit.io/99y1fc9mh/summr/SummrDeoSpray-TealSilver3%202.png?updatedAt=1757677986156"
                alt="Summr Deodorant Spray"
                width={300}
                height={300}
                className="w-[35vw] h-auto max-w-[150px] min-w-[120px] object-contain"
                priority
              />
            </div>

            <div
              ref={contentsRef}
              className="absolute lg:bottom-0 lg:right-0 bottom-[-55] right-25"
            >
              {Contents.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center lg:gap-3 gap-2 lg:mb-4 mb-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
                  style={{
                    willChange: "transform, opacity",
                  }}
                >
                  <div className="rounded-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={50}
                      height={50}
                      className="lg:w-8 w-5 lg:h-8 h-5"
                    />
                  </div>
                  <h1 className="text-black lg:text-[24px] text-[14px] lg:leading-[28px] leading-[16px] font-semibold">
                    {item.title}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* /new mobile */}


      <div className=" h-screen py-10 px-5 bg-[#9AD4D6] xl:hidden lg:hidden md:hidden block ">
        <div className=" z-10 h-full flex flex-col justify-between ">
        
          <div className="text-black lg:text-[54px] text-[20px] lg:leading-[56px] leading-[24px] text-center font-bold">
            <h1 className="perspective-1000 font-medium tracking-tight">
              Customized Sweatcare
            </h1>
            <span className="text-white lg:text-[48px] lg:leading-[50px] perspective-1000">
              That Works
            </span>
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col justify-center items-center">
            {/* Product and Features Section */}
            <div className="flex flex-row justify-center items-center ">
              <Image
         
                src="https://ik.imagekit.io/99y1fc9mh/summr/SummrDeoSpray-TealSilver3%202.png?updatedAt=1757677986156"
                alt="Summr Deodorant Spray"
                width={300}
                height={300}
                className="w-[35vw] h-auto max-w-[150px] min-w-[120px] object-contain"
                priority
              />
              <div className="flex flex-col items-start">
                {Contents.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center gap-2 mb-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
                    style={{
                      willChange: "transform, opacity",
                    }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h1 className="text-black text-[16px] whitespace-nowrap leading-[18px] font-semibold">
                      {item.title}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center">
            <div className="flex flex-row gap-2 items-center justify-center mb-4">
              <h1
       
                className="text-black lg:text-[24px] text-[16px] lg:leading-[28px] leading-[18px] font-semibold"
              >
                Introducing
              </h1>
              <Image
               
                src="/logo/summrWhite.png"
                alt="Summr Logo"
                width={200}
                height={200}
                className="lg:w-[100px] w-[65px] filter drop-shadow-lg"
              />
            </div>
            <p className="text-black lg:text-[24px] text-[16px] lg:leading-[32px] leading-[19px] max-w-[430px] mx-auto text-center font-medium">
              We don't just solve sweat and body odour. We give you seriously
              fresh pits - Solve pigmentation, Chafing, Ingrown hair and a lil
              extra love for your pits
            </p>
          </div>
        </div>
      </div>
    
    </>
  );
}

export default Introduce;
