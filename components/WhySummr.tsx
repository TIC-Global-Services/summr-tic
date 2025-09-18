"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import { cards } from "@/data/WhySummr";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const WhySummr = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="bg-white md:py-40 py-20 rounded-b-[700px] " ref={containerRef}>
      <h1 className="md:text-[54px] tex-[24px] text-black md:leading-[56px] leading-[27px]  font-semibold text-center md:mb-10">
        WHY SUMMR IS <span className="text-[#8FB78F]">DIFFERENT</span>
      </h1>
      <div className="max-w-[1040px] mx-auto px-4">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          initialSlide={2}
          slidesPerView="auto"
          preventClicks={true}
          loop={true}
       
          autoplay={{ 
            delay: 1500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 350,
            modifier: 1,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="coverflow-swiper"
        >
          {cards.concat(cards).map((items, index) => (
            <SwiperSlide key={`slide-${index}`} className="!w-[320px]">
              <div
                className="w-[320px] h-[420px] flex flex-col py-[46px] px-[37px] items-center justify-center rounded-[20px] space-y-5"
                style={{ backgroundColor: items.color }}
              >
                <h1 className="text-[26px] leading-[28px] font-gellix text-black font-bold text-center">
                  {items.title}
                </h1>
                <Image src={items.image} alt={items.title} className="w-50" />
                <p className="text-[14px] leading-[16px] text-black text-center">
                  {items.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`
        .coverflow-swiper {
          padding: 50px 0 80px 0;
        }
        .coverflow-swiper .swiper-slide {
          background-position: center;
          background-size: cover;
          width: 320px;
          height: auto;
        }
        .coverflow-swiper .swiper-pagination {
          bottom: 20px;
        }
        .coverflow-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
        .coverflow-swiper .swiper-button-next,
        .coverflow-swiper .swiper-button-prev {
          top: 50%;
          margin-top: -22px;
        }
        .coverflow-swiper .swiper-button-next:after,
        .coverflow-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        /* Make slide shadows more mild */
        .swiper-slide-shadow-left,
        .swiper-slide-shadow-right {
          background-image: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0)
          ) !important;
        }
        .swiper-slide-shadow-right {
          background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0)
          ) !important;
        }
      `}</style>
    </div>
  );
};

export default WhySummr;