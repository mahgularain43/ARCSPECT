// File: src/pages/SignUpForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeRedirectButton from '../components/HomeRedirectButton'; // ✅ Import

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('white');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      setMessageColor("red");
      return;
    }

    try {
      await axios.post('http://localhost:8000/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setMessage("✅ Signup successful! Redirecting to login...");
      setMessageColor("lightgreen");

      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      const errMsg = error.response?.data?.detail || 'Server error';
      setMessage(`❌ Signup failed: ${errMsg}`);
      setMessageColor("red");
    }
  };

  return (
    <div style={styles.wrapper}>
      <HomeRedirectButton /> {/* ✅ Add button */}
      <div style={styles.card}>
        <h1 style={{ textAlign: 'center' }}>Sign Up</h1>
        <p style={{ textAlign: 'center' }}>Create your account</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} style={styles.input} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} style={styles.input} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} style={styles.input} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} style={styles.input} />
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        {message && <p style={{ color: messageColor, textAlign: 'center', marginTop: '10px' }}>{message}</p>}
        <p style={styles.text}>
          Already have an account? <a href="/login" style={styles.link}>Log in</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    height: '100vh', color: 'white',
    background: 'url(/path_to_video_or_image.jpg) center/cover no-repeat',
    position: 'relative' // ✅ needed for absolute button
  },
  card: {
    width: '400px', backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '20px', borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
  },
  input: {
    width: '100%', padding: '10px',
    marginBottom: '10px', border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    width: '100%', padding: '12px',
    backgroundColor: '#0A3C30E5', color: 'white',
    border: 'none', borderRadius: '5px',
    cursor: 'pointer', fontWeight: 'bold',
    fontSize: '16px',
  },
  text: {
    marginTop: '15px', textAlign: 'center',
  },
  link: {
    color: '#069', textDecoration: 'none', cursor: 'pointer'
  }
};

export default SignUpForm;
