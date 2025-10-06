"use client";
import { Environment, useGLTF, Stats } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

// Register GSAP plugin only once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GLTFResult {
  scene: THREE.Group;
}

// Custom hook for mobile detection with debouncing
const useMobile = (threshold = 1024) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < threshold);
    
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    checkMobile();
    window.addEventListener("resize", debouncedResize, { passive: true });
    
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [threshold]);

  return isMobile;
};

// Custom hook for GSAP context management
const useGSAPAnimation = (
  callback: () => void,
  dependencies: React.DependencyList,
  delay = 0
) => {
  const ctxRef = useRef<gsap.Context | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const cleanup = () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };

    const init = () => {
      cleanup();
      ctxRef.current = gsap.context(callback);
    };

    const timer = setTimeout(init, delay);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, dependencies);

  return scrollTriggerRef;
};

function SticktModel({ setIsAbsolute }: { setIsAbsolute: (value: boolean) => void }) {
  const { scene } = useGLTF("/models/s.glb") as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = useMobile();

  // Memoized animation values - keeping your exact values
  const animationConfig = useMemo(() => ({
    sections: [
      {
        scale: { x: isMobile ? 3.4 : 3.6, y: isMobile ? 3.4 : 3.6, z: isMobile ? 3.4 : 3.6 },
        position: { x: isMobile ? -0.3 : -0.8, y: isMobile ? -5.2 : -5.5, z: 0.5 },
        rotation: { x: -0.05, y: Math.PI * 3.05, z: -0.15 }
      },
      {
        scale: { x: isMobile ? 2 : 2.5, y: isMobile ? 2 : 2.5, z: isMobile ? 2 : 2.5 },
        position: { x: isMobile ? -0.2 : -0.5, y: isMobile ? -1.5 : -4.1, z: 1.2 },
        rotation: { x: 0.02, y: Math.PI * 3.08, z: -0.1 }
      },
      {
        scale: { x: isMobile ? 2.2 : 2.8, y: isMobile ? 2.2 : 2.8, z: isMobile ? 2.2 : 2.8 },
        position: { x: isMobile ? Math.PI * 0.01 : Math.PI * 0.4, y: isMobile ? -1.5 : -3, z: 2 },
        rotation: { x: Math.PI * -0.1, y: Math.PI * 0.1, z: 0 }
      },
      {
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        position: { x: -1, y: isMobile ? -3 : -4, z: -1 },
        rotation: { x: Math.PI * -0.1, y: Math.PI * 4, z: -0.1 }
      }
    ]
  }), [isMobile]);

  // Performance optimization: reduce dependency array changes
  const stableCallback = useCallback(() => {
    if (!groupRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#animation-container",
        start: "top-=2700 top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,
        onLeave: () => setIsAbsolute(true),
        onEnterBack: () => setIsAbsolute(false),
      },
    });

    animationConfig.sections.forEach((config, index) => {
      const startTime = index * 0.25;
      const duration = index === 2 ? 0.20 : 0.25;
      const ease = index === 0 ? "power2.out" : "power2.inOut";

      tl.to(groupRef.current!.scale, { ...config.scale, ease, duration }, startTime)
        .to(groupRef.current!.position, { ...config.position, ease, duration }, startTime)
        .to(groupRef.current!.rotation, { ...config.rotation, ease, duration }, startTime);
    });
  }, [animationConfig, setIsAbsolute]);

  useGSAPAnimation(stableCallback, [stableCallback], 200);

  // Optimize material properties
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (material?.metalness !== undefined) {
          material.metalness = 1;
          material.roughness = 0.1;
          material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  if (!scene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function SprayModel({ setIsAbsolute }: { setIsAbsolute: (value: boolean) => void }) {
  const { scene } = useGLTF("/models/sp.glb") as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = useMobile();

  // Memoized animation configuration - keeping your exact values
  const animationConfig = useMemo(() => ({
    sections: [
      {
        scale: { x: isMobile ? 1.4 : 1.5, y: isMobile ? 1.4 : 1.5, z: isMobile ? 1.4 : 1.5 },
        position: { x: isMobile ? 1.6 : 2.2, y: isMobile ? -4.7 : -5.3, z: 0.3 },
        rotation: { x: Math.PI * -0.02, y: -Math.PI * 0.12, z: -0.08 }
      },
      {
        scale: { x: isMobile ? 0.5 : 0.7, y: isMobile ? 0.4 : 0.7, z: isMobile ? 0.7 : 0.7 },
        position: { x: isMobile ? -0.3 : -0.6, y: isMobile ? -1.5 : -2.8, z: 0.8 },
        rotation: { x: Math.PI * 0.01, y: -Math.PI * 0.18, z: -0.05 }
      },
      {
        scale: { x: 0.1, y: isMobile ? 0.2 : 0.2, z: isMobile ? 0.3 : 0.3 },
        position: { x: isMobile ? 0 : 1, y: isMobile ? -1 : -2, z: -3 },
        rotation: { x: Math.PI * 0.2, y: -Math.PI * 0.6, z: 0 }
      },
      {
        scale: { x: isMobile ? 1.3 : 1.8, y: isMobile ? 1.3 : 1.8, z: isMobile ? 1.3 : 1.8 },
        position: { x: isMobile ? -1 : -1.1, y: isMobile ? -3.0 : -4, z: 2 },
        rotation: { x: Math.PI * -0.1, y: Math.PI * 4, z: Math.PI * -0.1 }
      }
    ]
  }), [isMobile]);

  // Performance optimization: stable callback
  const stableCallback = useCallback(() => {
    if (!groupRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#animation-container",
        start: "top-=2700 top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,
        onLeave: () => setIsAbsolute(true),
        onEnterBack: () => setIsAbsolute(false),
      },
    });

    animationConfig.sections.forEach((config, index) => {
      const startTime = index * 0.25;
      const duration = 0.25;
      let ease: string;

      switch (index) {
        case 0: ease = "power2.out"; break;
        case 3: ease = index === 3 ? "power3.out" : "power2.inOut"; break;
        default: ease = "power2.inOut";
      }

      // Special handling for section 4 rotation
      if (index === 3) {
        tl.to(groupRef.current!.position, { ...config.position, ease, duration }, startTime)
          .to(groupRef.current!.scale, { ...config.scale, ease: "power2.out", duration }, startTime)
          .to(groupRef.current!.rotation, { ...config.rotation, ease: "none", duration }, startTime);
      } else {
        tl.to(groupRef.current!.scale, { ...config.scale, ease, duration }, startTime)
          .to(groupRef.current!.position, { ...config.position, ease, duration }, startTime)
          .to(groupRef.current!.rotation, { ...config.rotation, ease, duration }, startTime);
      }
    });
  }, [animationConfig, setIsAbsolute]);

  // Main scroll animation
  useGSAPAnimation(stableCallback, [stableCallback], 250);

  if (!scene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  const camRef = useRef({ yaw: 90, pitch: 85, distance: 12 });
  const isMobile = useMobile();

  // Memoized camera configuration - keeping your exact values
  const cameraConfig = useMemo(() => {
    const baseDistance = isMobile ? 18 : 16;
    return {
      baseDistance,
      sections: [
        { yaw: 87, pitch: 78, distance: baseDistance * 1.05 },
        { yaw: 91, pitch: 72, distance: baseDistance * 0.85 },
        { yaw: 89, pitch: 68, distance: baseDistance * 0.75 },
        { yaw: 90, pitch: 78, distance: baseDistance * 0.8 },
        { yaw: 90, pitch: 85, distance: baseDistance * 0.9 }
      ]
    };
  }, [isMobile]);

  const updateCamera = useCallback(() => {
    const { yaw, pitch, distance } = camRef.current;
    const yawRad = THREE.MathUtils.degToRad(yaw);
    const pitchRad = THREE.MathUtils.degToRad(pitch);

    const x = distance * Math.sin(pitchRad) * Math.cos(yawRad);
    const y = distance * Math.cos(pitchRad);
    const z = distance * Math.sin(pitchRad) * Math.sin(yawRad);

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Initialize camera position
  useEffect(() => {
    camRef.current.distance = cameraConfig.baseDistance;
    updateCamera();
  }, [cameraConfig.baseDistance, updateCamera]);

  // Performance optimization: stable callback
  const stableCallback = useCallback(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#animation-container",
        start: "top-=2700 top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,
      },
    });

    // Section 1
    tl.to(camRef.current, {
      ...cameraConfig.sections[0],
      onUpdate: updateCamera,
      ease: "power2.out",
      duration: 0.25,
    }, 0);

    // Section 2 (split into two parts)
    tl.to(camRef.current, {
      ...cameraConfig.sections[1],
      onUpdate: updateCamera,
      ease: "power2.inOut",
      duration: 0.125,
    }, 0.25)
    .to(camRef.current, {
      ...cameraConfig.sections[2],
      onUpdate: updateCamera,
      ease: "power2.inOut",
      duration: 0.125,
    }, 0.375)
    
    // Section 3
    .to(camRef.current, {
      ...cameraConfig.sections[3],
      onUpdate: updateCamera,
      ease: "power3.inOut",
      duration: 0.25,
    }, 0.5)
    
    // Section 4
    .to(camRef.current, {
      ...cameraConfig.sections[4],
      onUpdate: updateCamera,
      ease: "power3.inOut",
      duration: 0.25,
    }, 0.75);
  }, [cameraConfig, updateCamera]);

  // Camera animation
  useGSAPAnimation(stableCallback, [stableCallback], 300);

  return null;
}

const Scene = () => {
  const [isAbsolute, setIsAbsolute] = useState(false);
  const [absoluteTop, setAbsoluteTop] = useState(0);

  // Optimized absolute position calculation with throttling
  useEffect(() => {
    if (!isAbsolute) return;

    let rafId: number;
    
    const updateAbsoluteTop = () => {
      rafId = requestAnimationFrame(() => {
        const animationContainer = document.getElementById("animation-container");
        if (!animationContainer) return;

        const rect = animationContainer.getBoundingClientRect();
        const scrollY = window.scrollY;
        const offset = window.innerHeight * 0.99;
        const containerBottom = scrollY + rect.bottom;
        
        setAbsoluteTop(containerBottom - offset);
      });
    };

    updateAbsoluteTop();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isAbsolute]);

  // Memoized Canvas props for performance - keeping your settings
  const canvasProps = useMemo(() => ({
    camera: {
      fov: 45,
      near: 0.1,
      far: 1000,
      position: [16, 14, 16] as [number, number, number],
    },
    gl: {
      antialias: true,
      alpha: true,
      
    },
    dpr: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
  }), []);

  const containerStyle = useMemo(() => 
    isAbsolute ? {
      top: `${absoluteTop}px`,
      left: 0,
      right: 0,
      bottom: 'auto',
      height: '100vh'
    } : undefined
  , [isAbsolute, absoluteTop]);

  return (
    <div
      className={`inset-0 z-[9999] pointer-events-none md:block hidden ${
        isAbsolute ? "absolute" : "fixed"
      }`}
      style={containerStyle}
    >
      <Canvas {...canvasProps}>
        <Environment preset="city" background={false} />
        {/* <Stats /> */}
        <CameraSetup />
        <SticktModel setIsAbsolute={setIsAbsolute} />
        <SprayModel setIsAbsolute={setIsAbsolute} />
      </Canvas>
    </div>
  );
};

export default Scene;