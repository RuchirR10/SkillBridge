import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0.85rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#4f46e5',
            letterSpacing: '-0.02em'
          }}>
            Skill<span style={{ color: '#111827' }}>Bridge</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/explore" className="nav-link">Explore Students</Link>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/requests" className="nav-link">Requests</Link>
              <Link to="/profile" className="nav-link">My Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ marginLeft: '0.5rem' }}>
                Logout ({user.name ? user.name.split(' ')[0] : 'User'})
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
