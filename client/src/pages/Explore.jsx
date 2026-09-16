import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SwapModal } from '../components/SwapModal';
import userAvatarImg from '../assets/user.png';

export const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenSwap = (peer) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedUserForSwap(peer);
  };

  return (
    <div className="main-content">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', marginBottom: '0.35rem' }}>
            Explore Students
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Browse peers across campus and send skill swap proposals
          </p>
        </div>

        {/* Students Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6b7280' }}>
            Loading students directory...
          </div>
        ) : users.length === 0 ? (
          <div className="card-static" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              No students registered yet. Be the first to register and offer a skill!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch'
          }}>
            {users.map((peer) => {
              const isSelf = user?._id === peer._id;

              return (
                <div
                  key={peer._id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Top Header: Avatar PNG + Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <img
                        src={userAvatarImg}
                        alt="User Avatar"
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          flexShrink: 0,
                          backgroundColor: '#f3f4f6',
                          border: '1.5px solid #e5e7eb',
                          padding: '2px'
                        }}
                      />

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <Link
                            to={`/profile/${peer._id}`}
                            style={{
                              color: '#111827',
                              fontWeight: 700,
                              fontSize: '1.05rem',
                              textDecoration: 'none'
                            }}
                          >
                            {peer.name}
                          </Link>
                          {isSelf && (
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              backgroundColor: '#f3f4f6',
                              color: '#4b5563',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '999px',
                              border: '1px solid #e5e7eb'
                            }}>
                              You
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}>
                          {peer.email}
                        </div>
                      </div>
                    </div>

                    {/* Skills Section Container */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                      {/* Skills Offered */}
                      <div style={{
                        backgroundColor: '#f8faff',
                        border: '1px solid #e0e7ff',
                        borderRadius: '8px',
                        padding: '0.75rem'
                      }}>
                        <div style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#4338ca',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '0.4rem'
                        }}>
                          Skills Offered:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {peer.skillsOffered && peer.skillsOffered.length > 0 ? (
                            peer.skillsOffered.map((skill, idx) => (
                              <span
                                key={idx}
                                style={{
                                  backgroundColor: '#ffffff',
                                  color: '#3730a3',
                                  border: '1px solid #c7d2fe',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: 600
                                }}
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>None listed</span>
                          )}
                        </div>
                      </div>

                      {/* Skills Wanted */}
                      <div style={{
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fef3c7',
                        borderRadius: '8px',
                        padding: '0.75rem'
                      }}>
                        <div style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#b45309',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '0.4rem'
                        }}>
                          Wants To Learn:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {peer.skillsWanted && peer.skillsWanted.length > 0 ? (
                            peer.skillsWanted.map((skill, idx) => (
                              <span
                                key={idx}
                                style={{
                                  backgroundColor: '#ffffff',
                                  color: '#92400e',
                                  border: '1px solid #fde68a',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: 600
                                }}
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>None listed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{
                    display: 'flex',
                    gap: '0.65rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f3f4f6',
                    marginTop: 'auto'
                  }}>
                    {!isSelf ? (
                      <>
                        <button
                          onClick={() => handleOpenSwap(peer)}
                          className="btn btn-primary btn-sm"
                          style={{
                            flex: 1,
                            padding: '0.55rem 0.75rem',
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}
                        >
                          Send Swap Request
                        </button>
                        <Link
                          to={`/profile/${peer._id}`}
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '0.55rem 0.85rem',
                            fontWeight: 500,
                            borderRadius: '6px'
                          }}
                        >
                          View Profile
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/profile/${peer._id}`}
                        className="btn btn-secondary btn-sm"
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          padding: '0.55rem',
                          fontWeight: 500,
                          borderRadius: '6px'
                        }}
                      >
                        View Your Profile
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Swap Modal */}
        {selectedUserForSwap && (
          <SwapModal
            receiver={selectedUserForSwap}
            onClose={() => setSelectedUserForSwap(null)}
            onSuccess={() => fetchUsers()}
          />
        )}
      </div>
    </div>
  );
};
