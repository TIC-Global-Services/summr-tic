import React from "react";
import Image from "next/image";
import { InstgramLogo, MailLogo, PhoneLogo } from "@/assets/Footer";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center md:py-20 py-8 bg-transparent xl:px-0 lg:px-5 px-5">
      <Image
        src="/logo/summrPeach.png"
        alt="Footer Summr Logo Peach"
        width={1200}
        height={1000}
      />

      <div className="flex flex-row justify-between w-full pt-10 pb-5 max-w-6xl">
        {/* Phone Section */}
        <div className="flex flex-row items-center md:gap-2 gap-1 justify-center group hover:opacity-80 active:scale-95 transition-all duration-200">
          <Image
            src={PhoneLogo}
            alt="Phone Logo"
            className="md:w-6 md:h-6 w-5 h-5 group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-[#8FB78F] md:text-[16px] text-[12px] group-hover:underline underline-offset-4">
            +9986486844
          </span>
        </div>

        {/* Instagram (Desktop) */}
        <div className="md:block hidden">
          <Link
            href="https://www.instagram.com/getsummr?igsh=MWl6cmY0Z29sYWozcg=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center gap-2 justify-center group hover:opacity-80 active:scale-95 transition-all duration-200"
          >
            <Image
              src={InstgramLogo}
              alt="Instagram Logo"
              className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-[#8FB78F] text-[16px] group-hover:underline underline-offset-4">
              @getsummr
            </span>
          </Link>
        </div>

        {/* Email */}
        <Link
          href="mailto:info@summr.com"
          className="flex flex-row items-center gap-2 justify-center group hover:opacity-80 active:scale-95 transition-all duration-200"
        >
          <Image
            src={MailLogo}
            alt="Email Logo"
            className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-[#8FB78F] text-[16px] group-hover:underline underline-offset-4">
            info@summr.com
          </span>
        </Link>
      </div>

      {/* Instagram (Mobile) */}
      <div className="flex flex-row gap-4 md:hidden mt-7">
        <Link
          href="https://www.instagram.com/getsummr?igsh=MWl6cmY0Z29sYWozcg=="
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center gap-2 justify-center group hover:opacity-80 active:scale-95 transition-all duration-200"
        >
          <Image
            src={InstgramLogo}
            alt="Instagram Logo"
            className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-[#8FB78F] text-[16px] group-hover:underline underline-offset-4">
            @getsummr
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;