// File: src/components/LogoutButton.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setMessage('✅ You have been logged out. Redirecting to login...');

    setTimeout(() => {
      setMessage('');
      navigate('/login');
    }, 2000);
  };

  return (
    <>
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '10px 16px',
          backgroundColor: '#FF6347',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 1000
        }}
      >
        Logout
      </button>

      {message && (
        <div style={{
          position: 'fixed',
          top: 70,
          right: 20,
          backgroundColor: '#1c463d',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '6px',
          fontWeight: 'bold',
          zIndex: 1000,
        }}>
          {message}
        </div>
      )}
    </>
  );
};

export default LogoutButton;
