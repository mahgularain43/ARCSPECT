import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FloorPlan from "./FloorPlan";

function ModelViewer() {
  const { id: modelId } = useParams();
  const [rooms, setRooms] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!modelId) return;

    const fetchLayout = async () => {
      try {
        const res = await fetch(`http://localhost:8000/static/outputs/${modelId}/${modelId}_layout.json`);
        if (!res.ok) throw new Error("Failed to fetch layout");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid layout format");
        setRooms(data);
      } catch (err) {
        console.error("❌ Failed to load 3D layout:", err);
        setError("Unable to load 3D layout");
      }
    };

    fetchLayout();
  }, [modelId]);

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!rooms) return <p style={{ textAlign: "center" }}>Loading 3D layout...</p>;

  return <FloorPlan rooms={rooms} />;
}

export default ModelViewer;
