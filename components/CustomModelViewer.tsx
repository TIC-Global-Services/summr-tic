"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Center, Environment, OrbitControls } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { useRef } from "react";

interface ModelProps {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
}

const Model = ({ modelPath, scale = 1, position = [0, 0, 0] }: ModelProps) => {
  const { scene } = useGLTF(modelPath);

  return (
    <Center position={position}>
      <primitive object={scene} scale={scale} />
    </Center>
  );
};

interface CustomModelViewerProps {
  modelPath: string;
  className?: string;
  scale?: number;
  exposure?: number;
  environment?: string;
  environmentIntensity?: number;
  position?: [number, number, number];
}

const CustomModelViewer = ({
  modelPath,
  className = "user-select-none",
  scale = 1,
  exposure = 1,
  environment = "studio",
  environmentIntensity = 1,
  position = [0, 0, 0],
}: CustomModelViewerProps) => {
  const isDesktop = useMediaQuery({ minWidth: 1000 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1199 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const controlsRef = useRef<any>(null);

  const getInteractionSettings = () => {
    if (isMobile) {
      return {
        enableZoom: false,
        enablePan: false,
        enableRotate: false,
      };
    } else {
      return {
        enableZoom: true,
        enablePan: true,
        enableRotate: true,
      };
    }
  };

  const interactions = getInteractionSettings();

  const handleControlsChange = () => {
    if (controlsRef.current && !isMobile) {
      const controls = controlsRef.current;
      const currentTarget = controls.target;

      const minY = -1;
      const maxY = 1;

      if (currentTarget.y < minY) controls.target.y = minY;
      else if (currentTarget.y > maxY) controls.target.y = maxY;

      const maxX = 4;
      const maxZ = 4;

      if (Math.abs(currentTarget.x) > maxX)
        controls.target.x = Math.sign(currentTarget.x) * maxX;
      if (Math.abs(currentTarget.z) > maxZ)
        controls.target.z = Math.sign(currentTarget.z) * maxZ;
    }
  };

  const getCameraConfig = () => {
    if (isMobile) {
      return {
        position: [0, 0, 8] as [number, number, number],
        fov: 75,
        minDistance: 6,
        maxDistance: 12,
      };
    } else if (isTablet) {
      return {
        position: [0, 0, 10] as [number, number, number],
        fov: 60,
        minDistance: 5,
        maxDistance: 15,
      };
    } else {
      return {
        position: [0, 0, 8] as [number, number, number],
        fov: 70,
        minDistance: 4,
        maxDistance: 12,
      };
    }
  };

  const cameraConfig = getCameraConfig();

  const getContainerStyle = () => {
    if (isMobile) {
      return {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        minHeight: "300px",
        maxHeight: "350px",
        overflow: "hidden",
        position: "relative" as const,
      };
    } else if (isTablet) {
      return {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        minHeight: "500px",
        overflow: "hidden",
        position: "relative" as const,
      };
    } else {
      return {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        minHeight: "600px",
        overflow: "hidden",
        position: "relative" as const,
      };
    }
  };

  const containerStyle = getContainerStyle();

  return (
    <div className={`flex justify-center items-center w-full h-full ${className}`}>
      <div style={containerStyle}>
        <Canvas
          camera={{
            position: cameraConfig.position,
            fov: cameraConfig.fov,
            near: 0.1,
            far: 100,
          }}
          resize={{
            scroll: false,
            debounce: { scroll: 50, resize: 0 },
          }}
          style={{
            width: "100%",
            height: "100%",
            transform: isMobile ? "rotate(4deg)" : "rotate(12deg)",
            transformOrigin: "center center",
            pointerEvents: isMobile ? "none" : "auto",
            userSelect: isMobile ? "none" : "auto",
            display: "block",
            margin: "0 auto",
          }}
          gl={{
            toneMappingExposure: exposure,
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.7} />
          <spotLight
            position={[0, 10, 10]}
            angle={0.3}
            penumbra={0.5}
            intensity={1}
            castShadow
          />
          <Environment
            preset={environment as any}
            environmentIntensity={environmentIntensity}
          />

          <Model modelPath={modelPath} scale={scale} position={position} />

          <OrbitControls
            ref={controlsRef}
            autoRotate={false}
            enableZoom={false}
            enablePan={interactions.enablePan}
            enableRotate={interactions.enableRotate}
            zoomSpeed={0}
            minDistance={cameraConfig.minDistance}
            maxDistance={cameraConfig.maxDistance}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI - Math.PI / 5}
            dampingFactor={0.05}
            enableDamping
            panSpeed={0.5}
            onChange={handleControlsChange}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default CustomModelViewer;
