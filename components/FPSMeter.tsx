// components/SimpleFPS.tsx
'use client';

import { useEffect, useState } from 'react';

export default function SimpleFPS() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const updateFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(updateFPS);
    };

    animationFrameId = requestAnimationFrame(updateFPS);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[9999] bg-black/80 text-green-400 text-[50px] px-3 py-2 font-mono text-sm">
      {fps} FPS
    </div>
  );
}