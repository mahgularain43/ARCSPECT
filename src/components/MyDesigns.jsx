import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const MyDesigns = () => {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await axiosInstance.get('/my-designs');
        setDesigns(res.data.designs);
      } catch (err) {
        console.error("❌ Failed to fetch designs:", err);
      }
    };

    fetchDesigns();
  }, []);

  return (
    <div style={{ padding: '2rem', color: '#333' }}>
      <h2>🗂️ My Designs</h2>
      {designs.length === 0 ? (
        <p>No designs yet. Try generating one!</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {designs.map((design, index) => (
            <div key={index} style={{
              width: '300px',
              background: '#fff',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 0 6px rgba(0,0,0,0.1)'
            }}>
              <img src={design.image} alt="Design" style={{ width: '100%', borderRadius: '6px' }} />
              <p><strong>Prompt:</strong> {design.prompt}</p>
              <p><strong>ID:</strong> {design.scene_id}</p>
              <p style={{ fontSize: '12px', color: '#888' }}>
                {new Date(design.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDesigns;
