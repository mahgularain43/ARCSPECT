import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

const ROOM_HEIGHT = 3; // meters

// Component to render one room as a 3D box with a label
const Room3D = ({ room }) => {
  const { x, y, width, height, label } = room;
  const cx = x + width / 2;
  const cz = y + height / 2;

  return (
    <group name={label}>
      <mesh position={[cx, ROOM_HEIGHT / 2, cz]} castShadow receiveShadow>
        <boxGeometry args={[width, ROOM_HEIGHT, height]} />
        <meshStandardMaterial color="#b0c4de" />
      </mesh>
      <Text
        position={[cx, ROOM_HEIGHT + 0.3, cz]}
        fontSize={0.4}
        color="black"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
};

const Floorplan3D = ({ sceneId }) => {
  const [layout, setLayout] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sceneId) return;

    setLayout(null);
    setError(null);

    fetch(`http://localhost:8000/static/outputs/${sceneId}/${sceneId}_layout.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load layout JSON");
        return res.json();
      })
      .then((data) => {
        setLayout(data);
      })
      .catch((err) => setError(err.message));
  }, [sceneId]);

  if (error)
    return <div style={{ color: "red", textAlign: "center" }}>Error: {error}</div>;

  if (!layout) return <div style={{ textAlign: "center" }}>Loading layout...</div>;

  // Compute center for camera targeting
  const minX = Math.min(...layout.map((r) => r.x));
  const maxX = Math.max(...layout.map((r) => r.x + r.width));
  const minY = Math.min(...layout.map((r) => r.y));
  const maxY = Math.max(...layout.map((r) => r.y + r.height));
  const centerX = (minX + maxX) / 2;
  const centerZ = (minY + maxY) / 2;

  return (
    <Canvas
      shadows
      camera={{ position: [centerX + 20, 20, centerZ + 20], fov: 50 }}
      style={{ width: "100%", height: "80vh", background: "#f0f0f0" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <OrbitControls target={[centerX, 0, centerZ]} />

      {layout.map((room) => (
        <Room3D key={room.id} room={room} />
      ))}
    </Canvas>
  );
};

export default Floorplan3D;
