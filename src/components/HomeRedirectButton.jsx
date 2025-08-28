import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeRedirectButton = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleRedirect = () => {
    setMessage('🏠 Redirecting to home...');

    setTimeout(() => {
      setMessage('');
      navigate('/');
    }, 1500);
  };

  return (
    <>
      <button
        onClick={handleRedirect}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '10px 16px',
          backgroundColor: '#DD4B39', // Steel blue
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 1000
        }}
      >
        Go to Home
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

export default HomeRedirectButton;
