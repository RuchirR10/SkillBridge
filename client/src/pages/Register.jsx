import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [skillsOfferedInput, setSkillsOfferedInput] = useState('');
  const [skillsWantedInput, setSkillsWantedInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please fill in name, email, and password');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Split comma separated skills into array
      const skillsOffered = skillsOfferedInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const skillsWanted = skillsWantedInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          bio,
          skillsOffered,
          skillsWanted
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Log in user directly with returned user object
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
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card-static" style={{ padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.25rem' }}>Create Student Account</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Join SkillBridge to exchange skills with peers
          </p>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label className="input-label">Full Name:</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email:</label>
              <input
                type="email"
                className="input-field"
                placeholder="e.g. rahul@gmail.com"
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

            <div className="input-group">
              <label className="input-label">Bio (Short intro):</label>
              <textarea
                className="textarea-field"
                rows={2}
                placeholder="e.g. 3rd year IT student interested in web development"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Skills You Can Teach (comma separated):</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. React, JavaScript, HTML"
                value={skillsOfferedInput}
                onChange={(e) => setSkillsOfferedInput(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Skills You Want to Learn (comma separated):</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Python, MongoDB, Figma"
                value={skillsWantedInput}
                onChange={(e) => setSkillsWantedInput(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
