// File: src/components/FloorPlan.jsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Text } from '@react-three/drei';
import { saveAs } from 'file-saver';
import { GLTFExporter } from 'three-stdlib';
import FloorPlanCustomizationModal from './FloorPlanCustomizationModal';
import { loadTexture, roomTextureMap } from '../utils/textures';

const ROOM_SCALE = 4.5;
const DEFAULT_WALL_HEIGHT = 1.8;
const DOOR_WIDTH = 1.0;
const CEILING_THICKNESS = 0.05;
const PLAYER_HEIGHT = 1.6; // camera height for walking
const MOVE_SPEED = 3; // units per second

// Door component with open/close animation and customizable color
const Door = ({ x, z, rotationY = 0, color = '#8B4513' }) => {
  const doorRef = useRef();
  const [open, setOpen] = useState(false);
  const targetRotation = open ? Math.PI / 2 : 0; // 90 degrees open

  useFrame(() => {
    if (!doorRef.current) return;
    // Smoothly animate door rotation on Y axis
    doorRef.current.rotation.y += (targetRotation - doorRef.current.rotation.y) * 0.1;
  });

  return (
    <mesh
      ref={doorRef}
      position={[x, 1.2, z]}
      rotation={[0, rotationY, 0]}
      onClick={() => setOpen(!open)}
      castShadow
      receiveShadow
      style={{ cursor: 'pointer' }}
    >
      <boxGeometry args={[DOOR_WIDTH, 1.8, 0.1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const FloorPlan = ({ rooms = [], showGarage: initialShowGarage = true }) => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [topView, setTopView] = useState(false);
  const [maximized, setMaximized] = useState(true);
  const [scene, setScene] = useState(null);
  const [showGarage, setShowGarage] = useState(initialShowGarage);
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [show3D, setShow3D] = useState(true);
  const [showCeiling, setShowCeiling] = useState(true);
  const [walkMode, setWalkMode] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(true);

  const [roomFloorTextures, setRoomFloorTextures] = useState({});
  const [roomWallTextures, setRoomWallTextures] = useState({});
  const [doorColor, setDoorColor] = useState('#8B4513'); // door color customization

  // Filter and assign IDs to rooms
  const roomsWithIds = rooms
    .filter((r) => (showGarage || r.label?.toLowerCase() !== 'garage') && r.label?.toLowerCase() !== 'lawn')
    .map((room, idx) => ({ ...room, id: room.id ?? `room-${idx}` }));

  const SceneConnector = ({ setScene }) => {
    const { scene } = useThree();
    useEffect(() => {
      setScene(scene);
    }, [scene]);
    return null;
  };

  // Wall component (for walls and bounding boxes)
  const Wall = ({ x, z, width, height, color, wallHeight }) => (
    <mesh position={[x + width / 2, wallHeight / 2, z + height / 2]} castShadow receiveShadow>
      <boxGeometry args={[width, wallHeight, height]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );

  // Ceiling component
  const Ceiling = ({ x, z, width, depth }) => (
    <mesh position={[x + width / 2, DEFAULT_WALL_HEIGHT + CEILING_THICKNESS / 2, z + depth / 2]}>
      <boxGeometry args={[width, CEILING_THICKNESS, depth]} />
      <meshStandardMaterial color="#aaa" transparent opacity={showCeiling ? 0.9 : 0} />
    </mesh>
  );

  // Room component with floor, walls, doors, ceiling, labels, and textures
  const Room = ({ room }) => {
    const label = (room?.label || '').toLowerCase();
    const x = room.x * ROOM_SCALE;
    const z = room.y * ROOM_SCALE;
    const width = Math.max(room.width * ROOM_SCALE, 1);
    const depth = Math.max(room.height * ROOM_SCALE, 1);
    const cx = x + width / 2;
    const cz = z + depth / 2;
    const wallHeight = room.wallHeight || DEFAULT_WALL_HEIGHT;

    const floorPath = roomFloorTextures[room.id] || roomTextureMap[label] || roomTextureMap.default;
    const floorTexture = useMemo(() => loadTexture(floorPath), [floorPath]);
    const wallColor = roomWallTextures[room.id] || '#666';

    return (
      <group>
        {/* Floor */}
        <mesh position={[cx, 0.01, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial map={floorTexture} />
        </mesh>

        {/* Interior Lighting */}
        <pointLight position={[cx, wallHeight - 0.2, cz]} intensity={0.5} />

        {/* Walls */}
        <Wall x={x} z={z} width={width} height={0.1} color={wallColor} wallHeight={wallHeight} />
        <Wall x={x} z={z + depth} width={width} height={0.1} color={wallColor} wallHeight={wallHeight} />
        <Wall x={x} z={z} width={0.1} height={depth} color={wallColor} wallHeight={wallHeight} />
        <Wall x={x + width} z={z} width={0.1} height={depth} color={wallColor} wallHeight={wallHeight} />

        {/* Doors - placed along bottom wall with rotation Y = 0 */}
        <Door
          x={x + width / 2 - DOOR_WIDTH / 2}
          z={z}
          rotationY={0}
          color={doorColor}
        />

        {/* Ceiling */}
        <Ceiling x={x} z={z} width={width} depth={depth} />

        {/* Label */}
        <Text position={[cx, wallHeight + 0.4, cz]} fontSize={0.5} color="white" anchorX="center">
          {room.label}
        </Text>
      </group>
    );
  };

  // =============== Movement and Collision Setup ===============

  // Store keys pressed for WASD movement
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const direction = useRef(new THREE.Vector3(0, 0, 0));

  // Walls bounding boxes for collision detection
  const wallsBoundingBoxes = useRef([]);

  useEffect(() => {
    const boxes = [];

    roomsWithIds.forEach((room) => {
      const x = room.x * ROOM_SCALE;
      const z = room.y * ROOM_SCALE;
      const width = Math.max(room.width * ROOM_SCALE, 1);
      const depth = Math.max(room.height * ROOM_SCALE, 1);
      const wallHeight = room.wallHeight || DEFAULT_WALL_HEIGHT;

      const thickness = 0.2;

      // Front wall bounding box
      boxes.push(
        new THREE.Box3(
          new THREE.Vector3(x - thickness, 0, z - thickness),
          new THREE.Vector3(x + width + thickness, wallHeight, z + thickness)
        )
      );
      // Back wall bounding box
      boxes.push(
        new THREE.Box3(
          new THREE.Vector3(x - thickness, 0, z + depth - thickness),
          new THREE.Vector3(x + width + thickness, wallHeight, z + depth + thickness)
        )
      );
      // Left wall bounding box
      boxes.push(
        new THREE.Box3(
          new THREE.Vector3(x - thickness, 0, z - thickness),
          new THREE.Vector3(x + thickness, wallHeight, z + depth + thickness)
        )
      );
      // Right wall bounding box
      boxes.push(
        new THREE.Box3(
          new THREE.Vector3(x + width - thickness, 0, z - thickness),
          new THREE.Vector3(x + width + thickness, wallHeight, z + depth + thickness)
        )
      );
    });

    wallsBoundingBoxes.current = boxes;
  }, [roomsWithIds]);

  // Movement and collision handler hook
  function useMovement(camera) {
    useFrame((state, delta) => {
      if (!walkMode) return;

      velocity.current.x -= velocity.current.x * 10.0 * delta;
      velocity.current.z -= velocity.current.z * 10.0 * delta;

      direction.current.z = Number(keys.current.w) - Number(keys.current.s);
      direction.current.x = Number(keys.current.d) - Number(keys.current.a);
      direction.current.normalize();

      if (keys.current.w || keys.current.s) velocity.current.z -= direction.current.z * MOVE_SPEED * delta;
      if (keys.current.a || keys.current.d) velocity.current.x -= direction.current.x * MOVE_SPEED * delta;

      const moveX = velocity.current.x;
      const moveZ = velocity.current.z;

      const newPosition = camera.position.clone();
      newPosition.x += moveX;
      newPosition.z += moveZ;

      const collision = wallsBoundingBoxes.current.some((box) => box.containsPoint(newPosition));

      if (!collision) {
        camera.position.x = newPosition.x;
        camera.position.z = newPosition.z;
      }

      camera.position.y = PLAYER_HEIGHT;
    });
  }

  // Keyboard input listeners for WASD
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.code === 'KeyW') keys.current.w = true;
      if (event.code === 'KeyS') keys.current.s = true;
      if (event.code === 'KeyA') keys.current.a = true;
      if (event.code === 'KeyD') keys.current.d = true;
    }
    function handleKeyUp(event) {
      if (event.code === 'KeyW') keys.current.w = false;
      if (event.code === 'KeyS') keys.current.s = false;
      if (event.code === 'KeyA') keys.current.a = false;
      if (event.code === 'KeyD') keys.current.d = false;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Controls wrapper for switching between Orbit and PointerLock controls
  const ControlsWrapper = () => {
    const { camera } = useThree();
    useMovement(camera);

    return walkMode ? (
      <PointerLockControls
        onLock={() => setInstructionsVisible(false)}
        onUnlock={() => setInstructionsVisible(true)}
      />
    ) : (
      <OrbitControls enableRotate={!walkMode} maxPolarAngle={Math.PI / 2} />
    );
  };

  // GLB export function
  const handleExportGLB = () => {
    if (!scene) {
      alert('Scene not found!');
      return;
    }
    const exporter = new GLTFExporter();

    exporter.parse(
      scene,
      (result) => {
        const blob = new Blob([result], { type: 'model/gltf-binary' });
        saveAs(blob, 'floorplan.glb');
      },
      (error) => {
        console.error('GLB export error:', error);
        alert('Failed to export GLB');
      },
      { binary: true }
    );
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '90%',
          maxWidth: 1000,
          height: maximized ? '70vh' : '40vh',
          position: 'relative',
          border: '2px dashed #999',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {show3D && (
          <Canvas shadows camera={{ position: topView ? [0, 30, 0.1] : [20, 20, 20], near: 0.1, far: 1000, fov: 50 }}>
            <SceneConnector setScene={setScene} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <ControlsWrapper />
            {roomsWithIds.map((room) => (
              <Room key={room.id} room={room} />
            ))}
          </Canvas>
        )}

        {/* Persistent walkthrough instructions bar */}
        {walkMode && (
          <div
            style={{
              position: 'fixed',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: 20,
              fontSize: 14,
              zIndex: 30,
              pointerEvents: 'none',
              userSelect: 'none',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            Use WASD keys to move, mouse to look around. Press ESC to unlock mouse.
          </div>
        )}

        {/* Button to toggle walk mode */}
        <div style={{ position: 'absolute', top: 10, right: 50, zIndex: 20 }}>
          <button
            onClick={() => setWalkMode((prev) => !prev)}
            style={{
              padding: '8px 12px',
              background: walkMode ? '#e63946' : '#2a9d8f',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {walkMode ? 'Exit Walkthrough' : 'Enter Walkthrough'}
          </button>
        </div>

        {/* Main menu toggle button */}
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
          <button onClick={() => setShowMenu(true)} style={btnStyle('#333')}>
            ☰
          </button>
        </div>

        {/* Menu panel */}
        {showMenu && (
          <div style={modalStyle}>
            <button onClick={() => setShowMenu(false)} style={closeBtnStyle}>
              ✖
            </button>
            <button onClick={() => setIsModalOpen(true)} style={btnStyle('#FF8C00')}>
              ⚙ Customize
            </button>
            <button onClick={() => setMaximized((prev) => !prev)} style={btnStyle('#444')}>
              {maximized ? 'Minimize' : 'Maximize'}
            </button>
            <button onClick={() => setShowCeiling((prev) => !prev)} style={btnStyle('#888')}>
              {showCeiling ? 'Hide Ceilings' : 'Show Ceilings'}
            </button>
          </div>
        )}

        {/* Customization modal */}
        {isModalOpen && (
          <FloorPlanCustomizationModal
            onClose={() => setIsModalOpen(false)}
            topView={topView}
            setTopView={setTopView}
            showGarage={showGarage}
            setShowGarage={setShowGarage}
            handleExportGLB={handleExportGLB}
            show3D={show3D}
            setShow3D={setShow3D}
            roomFloorTextures={roomFloorTextures}
            setRoomFloorTextures={setRoomFloorTextures}
            roomWallTextures={roomWallTextures}
            setRoomWallTextures={setRoomWallTextures}
            doorColor={doorColor}
            setDoorColor={setDoorColor}
            rooms={roomsWithIds}
            sceneRefComponents={() => roomsWithIds.map((room) => <Room key={room.id} room={room} />)}
          />
        )}
      </div>
    </div>
  );
};

const btnStyle = (bg) => ({
  padding: '8px 12px',
  background: bg,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
});

const modalStyle = {
  position: 'absolute',
  top: 50,
  right: 10,
  width: 200,
  background: '#222',
  padding: 15,
  borderRadius: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  zIndex: 20,
  boxShadow: '0 0 15px rgba(0,0,0,0.3)',
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: 18,
  alignSelf: 'flex-end',
  cursor: 'pointer',
};

export default FloorPlan;
