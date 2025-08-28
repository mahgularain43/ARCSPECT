// File: src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';

// Firebase imports (make sure you have firebase.js configured and exporting these)
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

import HomeRedirectButton from '../components/HomeRedirectButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('white');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manual login via backend API (no Firebase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login', formData);
      const token = response.data.access_token;

      localStorage.setItem('token', token);
      setMessage('✅ Login successful! Redirecting...');
      setMessageColor('lightgreen');

      setTimeout(() => navigate('/get-started'), 2000);
    } catch (error) {
      const msg = error.response?.data?.detail || 'Unable to login';
      setMessage(`❌ Login failed: ${msg}`);
      setMessageColor('red');
    }
  };

  // Google login via Firebase
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem('token', token);

      // Optional: send welcome email
      await emailjs.send(
        'service_06iop7g', // Your EmailJS service ID
        'template_8lu6cl9', // Your EmailJS template ID
        {
          to_name: user.displayName || 'Valued User',
          email: user.email,
        },
        'KsmC8-oRiIaSAfMcW' // Your EmailJS public key
      );

      setMessage('✅ Google login successful! Redirecting...');
      setMessageColor('lightgreen');

      setTimeout(() => navigate('/get-started'), 2000);
    } catch (error) {
      console.error("Google Sign-In or Email Error:", error);
      setMessage(`❌ Google sign-in failed: ${error?.message || 'Unknown error'}`);
      setMessageColor('red');
    }
  };

  return (
    <div style={styles.container}>
      <HomeRedirectButton />
      <div style={styles.card}>
        <h1>Welcome Back</h1>
        <p>Please enter your details</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <Link to="/forgot-password" style={styles.link}>Forgot password?</Link>
          <button type="submit" style={styles.button}>Login</button>
        </form>

        {message && <p style={{ color: messageColor, marginTop: '10px' }}>{message}</p>}

        <div style={styles.divider}>or</div>

        <button
          onClick={handleGoogleLogin}
          style={{ ...styles.button, ...styles.socialButton }}
        >
          Continue with Google
        </button>

        <div style={{ marginTop: '10px' }}>
          Don’t have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'url(/your_background.jpg) no-repeat center center',
    backgroundSize: 'cover',
    position: 'relative',
  },
  card: {
    padding: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '10px',
    width: '400px',
    textAlign: 'center',
    color: 'white',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  link: {
    color: '#00bfff',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    margin: '10px 0',
  },
  divider: {
    margin: '20px 0',
    color: '#ccc',
  },
  socialButton: {
    backgroundColor: '#dd4b39',
  },
};

export default LoginPage;
