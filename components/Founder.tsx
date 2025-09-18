"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Deepika, RoundText } from "@/assets/Founder";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const Founder = () => {
  const titleRef = useRef(null);
  const imageContainerRef = useRef(null);
  const logoRef = useRef(null);
  const contentContainerRef = useRef(null);

  //   let split = SplitText.create(".descContent", {
  //     type:"chars, words, lines"
  //   })

  //   gsap.from(split.lines,{
  //     y:100,
  //     autoAlpha:0,
  //     stagger:0.05
  //   })

  const isTitleInView = useInView(titleRef, {
    once: false,
    margin: "-100px 0px",
  });
  const isImageContainerInView = useInView(imageContainerRef, {
    once: false,
    margin: "-100px 0px",
  });
  const isLogoInView = useInView(logoRef, {
    once: false,
    margin: "-100px 0px",
  });
  const isContentContainerInView = useInView(contentContainerRef, {
    once: false,
    margin: "-100px 0px",
  });
  return (
    <div className="bg-white flex flex-col items-center justify-start rounded-b-[800px] md:h-[1180px]  md:py-20 py-40 space-y-15  md:px-0 px-5">
      <div className="flex lg:flex-row flex-col md:items-center items-start justify-center gap-10 h-[500px] ">
        <motion.h1
          ref={titleRef}
          initial={{ opacity: 0, x: -50 }}
          animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[#8FB78F] lg:text-[80px] text-[40px]  lg:leading-[102px] leading-[44px] font-semibold mb-auto text-start"
        >
          MEET THE <br /> MIND <br /> BEHIND
          {/* <Image
            src="/logo/summrMatcha.png"
            alt="summr Logo"
            width={1000}
            height={1000}
            className="w-[225px] h-[56px] md:hidden block"
          /> */}
        </motion.h1>

        <motion.div
          ref={imageContainerRef}
          initial={{ opacity: 0.5, y: 30 }}
          animate={isImageContainerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative lg:w-[414px]  lg:h-[414px] w-[300px] justify-end items-end mt-auto"
        >
          {/* Main image (Deepika) */}
          <Image
            src={Deepika}
            alt="Deepika Manjunath"
            width={1000}
            height={1000}
            className="lg:w-[414px] lg:h-[414px] w-[300px] relative z-20"
          />

          {/* Rotating round text behind */}
          <Image
            src={RoundText}
            alt="Rotating Text"
            width={1000}
            height={1000}
            className="absolute md:-top-20 -top-10 -right-10  md:-right-20 md:w-[160px] md:h-[151px] w-[95px] h-[91px] z-10 animate-spin-slow"
          />
        </motion.div>
        {/* third logo  */}
        <motion.div
          ref={logoRef}
          initial={{ opacity: 0, x: 50 }}
          animate={isLogoInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center items-center "
        >
          <Image
            src="/logo/summrMatcha.png"
            alt="summr Logo"
            width={1000}
            height={1000}
            className="w-[225px] h-[56px] lg:block hidden"
          />
        </motion.div>
      </div>
      <motion.div
        ref={contentContainerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isContentContainerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1110px] mx-auto flex flex-col items-center justify-center "
      >
        <h1 className="md:text-[54px] leading-[56px] text-[20px] text-black font-semibold">
          Deepika Manjunath
        </h1>
        <p className="descContent md:text-[24px] text-[14px] md:leading-[32px] leading-[18px] text-[#474640] opacity-70 text-center md:mt-6 mt-3 xl:max-w-6xl lg:max-w-3xl md:max-w-2xl">
          I’m Deepika from Bangalore, always battling sweat in India’s heat and
          frustrated by products that only masked the problem. Caring for my
          mother through cancer made me realize skin care is responsibility, not
          habit. I teamed up with my co founder and set out to answer one
          question: Why are sweat and body odour still treated with quick fixes
          that don’t work?
        </p>
      </motion.div>
    </div>
  );
};

export default Founder;
