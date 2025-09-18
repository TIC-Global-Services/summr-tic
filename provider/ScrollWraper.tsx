'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

export default function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 3, // Increase duration for slower scrolling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smoother easing curve
      lerp: 0.1, // Lower lerp for more inertia and slower response
      smoothWheel: true, // Ensure wheel scrolling is smooth
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}