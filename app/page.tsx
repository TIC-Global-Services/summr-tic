import Customize from "@/components/Customize";
import Founder from "@/components/Founder";
import ScrollingText from "@/components/ScrollingText";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import Subscribe from "@/components/Subscribe";
import SprayAnimation from "@/components/SprayAnimation";
import StickAnimation from "@/components/StickAnimation";
import Hero from "@/components/Hero";
import Introduce from "@/components/Introduce";
import Proven from "@/components/Proven";
import SweatLess from "@/components/SweatLess";

import WhySummr from "@/components/WhySummr";
import Scene from "@/components/Scene";
import Splash from "@/components/Splash";

export default function Home() {
  return (
    <div>
      <Splash />
      <Scene />
      <ScrollingText
        text="Fresh Pits, Big Moves."
        bgColor="#000000"
        textColor="#9AD4D6"
        speed={85}
        icon={<MdOutlineStarPurple500 fill="#9AD4D6" />}
      />
      <div id="animation-container" className="">
        <Hero />
        <Introduce />
       
        <SweatLess />
        <div>
          <Proven />
        </div>
      </div>

      <StickAnimation />
      <SprayAnimation />
      <WhySummr />
      <Customize />
      <Founder />
      <Subscribe />
      <ScrollingText
        text="Sweat Happens. Summr™ solves"
        bgColor="#000000"
        textColor="#FFD57A"
        speed={85}
        icon={<GoDotFill fill="#FFD57A" />}
      />

    
    </div>
  );
}
