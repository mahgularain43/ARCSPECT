// File: src/components/FloorPlanCustomizationModal.jsx

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const FloorPlanCustomizationModal = ({
  onClose,
  onSave,
  topView,
  setTopView,
  showGarage,
  setShowGarage,
  handleExportGLB,
  sceneRefComponents,
  wallColor,
  setWallColor,
  wallTexture,
  setWallTexture,
  floorTexture,
  setFloorTexture,
  doorColor,
  setDoorColor,
}) => {
  // Local state copies to allow previewing & canceling
  const [localWallColor, setLocalWallColor] = useState(wallColor);
  const [localWallTexture, setLocalWallTexture] = useState(wallTexture);
  const [localFloorTexture, setLocalFloorTexture] = useState(floorTexture);
  const [localDoorColor, setLocalDoorColor] = useState(doorColor);
  const [localTopView, setLocalTopView] = useState(topView);
  const [localShowGarage, setLocalShowGarage] = useState(showGarage);

  // Sync props when modal opens or props change
  useEffect(() => {
    setLocalWallColor(wallColor);
    setLocalWallTexture(wallTexture);
    setLocalFloorTexture(floorTexture);
    setLocalDoorColor(doorColor);
    setLocalTopView(topView);
    setLocalShowGarage(showGarage);
  }, [wallColor, wallTexture, floorTexture, doorColor, topView, showGarage]);

  // Save changes & close modal
  const handleSave = () => {
    setWallColor(localWallColor);
    setWallTexture(localWallTexture);
    setFloorTexture(localFloorTexture);
    setDoorColor(localDoorColor);
    setTopView(localTopView);
    setShowGarage(localShowGarage);
    onSave?.();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          width: '90%',
          height: '85vh',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          border: '3px solid #333',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 20,
            fontSize: 24,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          ×
        </button>

        {/* Left side: 3D Canvas preview */}
        <div style={{ flex: 2, borderRight: '2px dashed #999' }}>
          <Canvas shadows camera={{ position: localTopView ? [0, 30, 0.1] : [20, 20, 20], fov: 50 }}>
            {sceneRefComponents()}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <OrbitControls enableRotate={!localTopView} />
          </Canvas>
        </div>

        {/* Right side: controls */}
        <div
          style={{
            flex: 1,
            background: '#222831',
            color: '#fff',
            padding: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <h2 style={{ marginBottom: 10 }}>Customize View</h2>

          <button
            style={btn}
            onClick={() => setLocalTopView((prev) => !prev)}
          >
            {localTopView ? 'Switch to 3D View' : 'Switch to Top View'}
          </button>

          <button
            style={btn}
            onClick={() => setLocalShowGarage((prev) => !prev)}
          >
            {localShowGarage ? 'Hide Garage' : 'Show Garage'}
          </button>

          <div style={labelGroup}>
            <label style={label}>Wall Color</label>
            <input
              type="color"
              value={localWallColor}
              onChange={(e) => setLocalWallColor(e.target.value)}
              style={colorInput}
            />
          </div>

          <div style={labelGroup}>
            <label style={label}>Wall Texture</label>
            <select
              style={dropdown}
              value={localWallTexture}
              onChange={(e) => setLocalWallTexture(e.target.value)}
            >
              <option value="Paint (Color Only)">Paint</option>
              <option value="Brick">Brick</option>
              <option value="Wallpaper">Wallpaper</option>
              <option value="Stone">Stone</option>
              <option value="Matte">Matte</option>
            </select>
          </div>

          <div style={labelGroup}>
            <label style={label}>Floor Texture</label>
            <select
              style={dropdown}
              value={localFloorTexture}
              onChange={(e) => setLocalFloorTexture(e.target.value)}
            >
              <option value="Wood">Wood</option>
              <option value="Marble">Marble</option>
              <option value="Tiles">Tiles</option>
              <option value="Concrete">Concrete</option>
              <option value="Matte">Matte</option>
              <option value="Lawn">Lawn</option>
            </select>
          </div>

          <div style={labelGroup}>
            <label style={label}>Door Color</label>
            <input
              type="color"
              value={localDoorColor}
              onChange={(e) => setLocalDoorColor(e.target.value)}
              style={colorInput}
            />
          </div>

          <button
            style={{ ...btn, marginTop: 'auto', background: '#1E90FF' }}
            onClick={handleSave}
          >
            💾 Save Changes
          </button>

          <button
            style={{ ...btn, background: '#FF6347' }}
            onClick={handleExportGLB}
          >
            ⬇ Export GLB
          </button>
        </div>
      </div>
    </div>
  );
};

const btn = {
  background: '#FF6347',
  color: 'white',
  fontWeight: 600,
  padding: '10px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
};

const labelGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const label = {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 2,
};

const dropdown = {
  padding: '8px',
  borderRadius: 6,
  fontSize: 14,
  border: '1px solid #ccc',
  outline: 'none',
};

const colorInput = {
  width: '100%',
  height: 40,
  border: 'none',
  borderRadius: 6,
};

export default FloorPlanCustomizationModal;
