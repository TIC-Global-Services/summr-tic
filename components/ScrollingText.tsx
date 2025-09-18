"use client";
import React, { ReactNode } from "react";

interface ScrollingTextProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  speed?: number; // control animation speed
  icon?: ReactNode; // any SVG or icon component
}

const ScrollingText: React.FC<ScrollingTextProps> = ({
  text,
  bgColor = "#014DD6",
  textColor = "#ffffff",
  speed = 60,
  icon,
}) => {
  return (
    <div>
      <section
        className="h-[69px] w-full flex items-center overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="flex whitespace-nowrap animate-scroll"
          style={{
            animation: `scroll ${speed}s linear infinite`,
          }}
        >
          {/* First set of text */}
          <div className="flex shrink-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={`first-${i}`}
                className="text-sm sm:text-[24px] px-4 flex items-center gap-2"
                style={{ color: textColor }}
              >
                {icon && <span className="flex-shrink-0">{icon}</span>}
                {text}
              </span>
            ))}
          </div>

          {/* Duplicate set for seamless loop */}
          <div className="flex shrink-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={`second-${i}`}
                className="text-sm sm:text-[24px] px-4 flex items-center gap-2"
                style={{ color: textColor }}
              >
                {icon && <span className="flex-shrink-0">{icon}</span>}
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause animation on hover */
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ScrollingText;
