import React, { useState } from 'react';
import { auth } from '../firebase'; // your configured Firebase auth instance
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('black');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`✅ Password reset email sent to ${email}. Please check your inbox.`);
      setMessageColor('green');
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        setMessage('❌ No user found with this email.');
      } else if (error.code === 'auth/invalid-email') {
        setMessage('❌ Please enter a valid email address.');
      } else {
        setMessage('❌ Failed to send reset email. Please try again.');
      }
      setMessageColor('red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Reset Password</h1>
        <p>Enter your email address to receive a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        {message && <p style={{ color: messageColor, marginTop: '10px' }}>{message}</p>}
        <div style={{ marginTop: '10px' }}>
          <Link to="/login" style={styles.link}>Back to Login</Link>
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
  },
};

export default ForgotPassword;
