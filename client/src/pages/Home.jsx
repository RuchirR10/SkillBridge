import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="main-content">
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '2rem auto 3rem auto' }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: '#e0e7ff',
            color: '#4338ca',
            padding: '0.3rem 0.8rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            🎓 Peer-to-Peer Student Skill Sharing
          </span>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '1rem' }}>
            Learn Together by <br />
            <span style={{ color: '#4f46e5' }}>Exchanging Your Skills</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '2rem' }}>
            A simple student platform where you can teach what you know (e.g. React, Python, C++)
            in exchange for learning what you want without paying any money.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {user ? (
              <>
                <Link to="/explore" className="btn btn-primary btn-lg">Explore Students</Link>
                <Link to="/dashboard" className="btn btn-secondary btn-lg">Go to Dashboard</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Register Free</Link>
                <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
                <Link to="/explore" className="btn btn-ghost btn-lg">Explore Students</Link>
              </>
            )}
          </div>
        </div>

        {/* How It Works Flow */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          maxWidth: '820px',
          margin: '0 auto'
        }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            How SkillBridge Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            textAlign: 'center'
          }}>
            <div className="card-static" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5', marginBottom: '0.5rem' }}>1</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Register & Profile</h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Create an account and list the skills you can teach and what you want to learn.</p>
            </div>

            <div className="card-static" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5', marginBottom: '0.5rem' }}>2</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Browse Students</h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Browse other students and check what skills they teach.</p>
            </div>

            <div className="card-static" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5', marginBottom: '0.5rem' }}>3</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Swap & Learn</h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Send a swap request, get accepted, connect for learning sessions, and leave a review.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
