// src/components/ScenePage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Floorplan3D from "./Floorplan3D"; // Your 3D floorplan component

const ScenePage = () => {
  const { sceneId } = useParams();
  return (
    <div style={{ padding: 20 }}>
      <h1>3D Floorplan for Scene: {sceneId}</h1>
      <Floorplan3D sceneId={sceneId} />
    </div>
  );
};

export default ScenePage;
