import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyStats = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch swap statistics using MongoDB aggregation API
        const response = await fetch(`http://localhost:5000/api/swaps/stats?userId=${user._id}`);
        const data = await response.json();

        if (response.ok) {
          const counts = { pending: 0, accepted: 0, completed: 0 };
          data.forEach((item) => {
            if (item._id && counts.hasOwnProperty(item._id)) {
              counts[item._id] = item.count;
            }
          });
          setStats(counts);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStats();
  }, [user?._id]);

  if (!user) {
    return (
      <div className="main-content">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Student Dashboard</h2>
          <p style={{ color: '#6b7280', margin: '1rem 0' }}>Please log in to view your dashboard.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
            Welcome, {user.name} 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Here is your skill sharing summary
          </p>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: My Skills */}
          <div className="card-static" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#4f46e5', margin: 0 }}>
                My Skills (I Can Teach)
              </h2>
              <Link to="/profile" style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600 }}>
                + Add / Edit
              </Link>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0 1rem 0' }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {user.skillsOffered && user.skillsOffered.length > 0 ? (
                user.skillsOffered.map((skill, index) => (
                  <span key={index} className="badge badge-teaching" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                    {skill}
                  </span>
                ))
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>
                  No skills listed yet. Add skills in your profile to start sharing.
                </p>
              )}
            </div>
          </div>

          {/* Card 2: I Want To Learn */}
          <div className="card-static" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#b45309', margin: 0 }}>
                I Want To Learn
              </h2>
              <Link to="/profile" style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
                + Add / Edit
              </Link>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0 1rem 0' }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {user.skillsWanted && user.skillsWanted.length > 0 ? (
                user.skillsWanted.map((skill, index) => (
                  <span key={index} className="badge badge-learning" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                    {skill}
                  </span>
                ))
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>
                  No learning wishlist added yet.
                </p>
              )}
            </div>
          </div>

          {/* Card 3: My Requests Summary */}
          <div className="card-static" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#111827', margin: 0 }}>
                My Requests
              </h2>
              <Link to="/requests" style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600 }}>
                View All Requests ➔
              </Link>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0 1rem 0' }} />

            {loading ? (
              <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>Loading summary...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>
                    {stats.pending}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>Pending</div>
                </div>

                <div style={{ backgroundColor: '#dcfce7', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>
                    {stats.accepted}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Accepted</div>
                </div>

                <div style={{ backgroundColor: '#e0e7ff', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4338ca' }}>
                    {stats.completed}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#3730a3', fontWeight: 600 }}>Completed</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <Link to="/explore" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              🔍 Explore & Find Students
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
