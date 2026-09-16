import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SwapModal } from '../components/SwapModal';
import userAvatarImg from '../assets/user.png';

export const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const profileId = id || currentUser?._id;

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillsOfferedInput, setSkillsOfferedInput] = useState('');
  const [skillsWantedInput, setSkillsWantedInput] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchProfileAndReviews = async () => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Fetch profile
      const userRes = await fetch(`http://localhost:5000/api/users/${profileId}`);
      const userData = await userRes.json();

      if (userRes.ok) {
        setProfile(userData);
        setName(userData.name || '');
        setBio(userData.bio || '');
        setSkillsOfferedInput((userData.skillsOffered || []).join(', '));
        setSkillsWantedInput((userData.skillsWanted || []).join(', '));
      }

      // 2. Fetch reviews
      const reviewRes = await fetch(`http://localhost:5000/api/reviews/${profileId}`);
      const reviewData = await reviewRes.json();

      if (reviewRes.ok) {
        setReviews(reviewData);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndReviews();
  }, [profileId]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);

      const skillsOffered = skillsOfferedInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const skillsWanted = skillsWantedInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const response = await fetch(`http://localhost:5000/api/users/${profile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          bio,
          skillsOffered,
          skillsWanted
        })
      });

      const updatedUser = await response.json();

      if (response.ok) {
        setProfile(updatedUser);
        if (currentUser && currentUser._id === updatedUser._id) {
          updateUser(updatedUser);
        }
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="main-content">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Profile not found</h2>
          <p style={{ color: '#6b7280', margin: '1rem 0' }}>Please log in to view your profile.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '720px' }}>
        {/* Profile Card */}
        <div className="card-static" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={userAvatarImg}
                alt="User Avatar"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid #e5e7eb',
                  padding: '2px',
                  backgroundColor: '#f3f4f6'
                }}
              />
              <div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{profile.name}</h1>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>{profile.email}</p>
              </div>
            </div>

            <div>
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-secondary btn-sm"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              ) : (
                <button
                  onClick={() => setShowSwapModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  Send Swap Request
                </button>
              )}
            </div>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Full Name:</label>
                <input
                  type="text"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Bio:</label>
                <textarea
                  className="textarea-field"
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Skills You Offer (comma separated):</label>
                <input
                  type="text"
                  className="input-field"
                  value={skillsOfferedInput}
                  onChange={(e) => setSkillsOfferedInput(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Skills You Want to Learn (comma separated):</label>
                <input
                  type="text"
                  className="input-field"
                  value={skillsWantedInput}
                  onChange={(e) => setSkillsWantedInput(e.target.value)}
                />
              </div>

              <button type="submit" disabled={saveLoading} className="btn btn-primary">
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div style={{ marginTop: '1.25rem' }}>
              {profile.bio && (
                <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {profile.bio}
                </p>
              )}

              {/* Skills Offered */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Skills Offered ({profile.skillsOffered?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
                    profile.skillsOffered.map((s, idx) => (
                      <span key={idx} className="badge badge-teaching" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No skills offered listed</span>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div>
                <h3 style={{ fontSize: '0.9rem', color: '#b45309', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Skills Wanted ({profile.skillsWanted?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profile.skillsWanted && profile.skillsWanted.length > 0 ? (
                    profile.skillsWanted.map((s, idx) => (
                      <span key={idx} className="badge badge-learning" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No skills wanted listed</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="card-static" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Peer Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
              No reviews yet for this student.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((rev) => (
                <div key={rev._id} style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong>{rev.reviewer?.name || 'Student'}</strong>
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                      {'⭐'.repeat(rev.rating)} ({rev.rating}/5)
                    </span>
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Modal */}
        {showSwapModal && (
          <SwapModal
            receiver={profile}
            onClose={() => setShowSwapModal(false)}
            onSuccess={() => fetchProfileAndReviews()}
          />
        )}
      </div>
    </div>
  );
};
