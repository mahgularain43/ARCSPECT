import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader"; // Adjust the path as necessary

const House = () => {
  const { scene } = useGLTF("/eba33e68e3734bb5bab4e817e8325d96/scene.gltf"); // Ensure the path is correct

  return (
    <primitive object={scene} scale={[10, 10, 10]} position={[0, 0, 0]} /> // Increase scale for visibility
  );
};

const HouseCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      camera={{
        fov: 75, // Adjust the field of view to encompass the larger model
        near: 0.1,
        far: 100,
        position: [0, 5, 20], // Move the camera further back to fit the model
      }}
    >
      <color attach="background" args={["transparent"]} />
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 10]} intensity={1} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}  // Enable zoom to allow users to get a closer look
          enableRotate={true}
          autoRotate={false}
          rotateSpeed={0.5}
        />
        <House />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default HouseCanvas;
