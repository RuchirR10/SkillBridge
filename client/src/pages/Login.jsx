import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card-static" style={{ padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.25rem' }}>Login to SkillBridge</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Enter your credentials to access your account
          </p>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email:</label>
              <input
                type="email"
                className="input-field"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password:</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Don't have an account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600 }}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
