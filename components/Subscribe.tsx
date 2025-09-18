"use client";
import { motion, useInView } from "framer-motion";
import React, { useRef, useState, FormEvent } from "react";
import { toast } from "react-hot-toast";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const containerRef = useRef(null);

  const isTitle1InView = useInView(title1Ref, {
    once: false,
    margin: "-100px 0px",
  });

  const isTitle2InView = useInView(title2Ref, {
    once: false,
    margin: "-100px 0px",
  });

  const isContainerInView = useInView(containerRef, {
    once: false,
    margin: "-100px 0px",
  });

  const validateForm = () => {
    const errors = [];

    if (!email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push("Please enter a valid email address");
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      setLoading(false);
      return;
    }

    // Replace this URL with your actual Google Apps Script URL
    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbzpTwe-3o0jj1aJQ5Gs1Bckf4lq4V12RogTUtPmNkK4X_Ft1NaFw4hg-5BG6wNHJ01A/exec";

    try {
      const formDataToSend = {
        email: email.trim().toLowerCase(),
        timestamp: new Date().toISOString(),
      };

      console.log("Sending data:", formDataToSend);

      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      toast.success("Successfully subscribed!");

      // Reset form after successful submission
      setEmail("");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between max-w-[1170px] mx-auto md:py-20 py-10 xl:px-0 lg:px-5 px-5 ">
        <div className="flex md:flex-row flex-col items-center justify-center space-y-2">
          <motion.h1
            ref={title1Ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isTitle1InView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-regular  text-black md:text-[48px] text-[20px] leading-[22px] md:leading-[56px] md:max-w-[510px] max-w-[200px] md:text-start text-center"
          >
            Unlock Summr Before Anyone Else.
          </motion.h1>
          <motion.h1
            ref={title2Ref}
            initial={{ opacity: 0, x: 50 }}
            animate={isTitle2InView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-regular text-[#F79C7D] md:text-[38px] text-[20px]  leading-[22px] md:leading-[47px] lg:tracking-[-2px] md:max-w-lg max-w-[300px] md:ml-auto  md:text-end text-center"
          >
            Don't miss out, join the custom case waitlist!
          </motion.h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex lg:flex-row flex-col lg:justify-between justify-center items-center  md:py-15 py-5 gap-4"
        >
          <input
            type="email"
            placeholder="Enter Your Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="shadow-sm flex-grow bg-white lg:h-[80px] lg:w-70 w-full h-[50px] px-4 md:rounded-[12px] rounded-[6px] text-black opacity-70 placeholder-gray-400  outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="
  shadow-sm
  md:w-[300px] w-[200px]
    h-[50px] lg:h-[80px] 
    px-4 sm:px-5 lg:px-20 
    text-sm sm:text-base lg:text-lg 
    bg-white text-black opacity-70 
    rounded-full transition-transform 
    cursor-pointer hover:scale-105 
    duration-300 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  "
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Subscribe;
