// Login Page — Email + Password login with JWT
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }

    try {
      setLoading(true);
      setError('');
      // Send login request to backend
      const { data } = await axios.post('/api/auth/login', { email, password });
      // Save user data and token in AuthContext
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left: Brand Panel */}
        <div className="auth-brand">
          <h2>Welcome Back 💙</h2>
          <p>Log in to continue supporting causes that matter to you.</p>
          <div className="auth-features">
            <span>✅ Track your donations</span>
            <span>✅ Create campaigns</span>
            <span>✅ 100% secure with Razorpay</span>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="auth-form-panel">
          <h1>Sign In</h1>
          <p className="auth-subtitle">Enter your credentials to access your account</p>

          {error && <div className="alert alert-error"><span>⚠️</span><p>{error}</p></div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in...</> : '🔐 Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
