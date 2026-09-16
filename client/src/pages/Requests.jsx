import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Requests = () => {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming');
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewModalTarget, setReviewModalTarget] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchSwaps = async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/swaps?userId=${user._id}`);
      const data = await response.json();

      if (response.ok) {
        setSwaps(data);
      }
    } catch (err) {
      console.error('Failed to fetch swap requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, [user?._id]);

  const handleUpdateStatus = async (swapId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/swaps/${swapId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchSwaps();
      }
    } catch (err) {
      alert('Error updating swap status: ' + err.message);
    }
  };

  const handleSendReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please enter a feedback comment');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer: user._id,
          reviewee: reviewModalTarget.peerId,
          rating,
          comment
        })
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setReviewModalTarget(null);
        setComment('');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      alert('Error submitting review: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!user) {
    return (
      <div className="main-content">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Swap Requests</h2>
          <p style={{ color: '#6b7280', margin: '1rem 0' }}>Please log in to manage your swap requests.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const incomingSwaps = swaps.filter((s) => s.receiver?._id === user._id);
  const outgoingSwaps = swaps.filter((s) => s.sender?._id === user._id);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>● Pending</span>;
      case 'accepted':
        return <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>✓ Accepted</span>;
      case 'rejected':
        return <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>✕ Rejected</span>;
      case 'completed':
        return <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>★ Completed</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '780px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Swap Requests</h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Manage your incoming proposals and track sent swap requests
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('incoming')}
            className="btn btn-ghost"
            style={{
              borderBottom: activeTab === 'incoming' ? '3px solid #4f46e5' : '3px solid transparent',
              color: activeTab === 'incoming' ? '#4f46e5' : '#6b7280',
              fontWeight: activeTab === 'incoming' ? 700 : 500,
              borderRadius: 0,
              padding: '0.75rem 1.25rem'
            }}
          >
            Incoming Requests ({incomingSwaps.length})
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className="btn btn-ghost"
            style={{
              borderBottom: activeTab === 'outgoing' ? '3px solid #4f46e5' : '3px solid transparent',
              color: activeTab === 'outgoing' ? '#4f46e5' : '#6b7280',
              fontWeight: activeTab === 'outgoing' ? 700 : 500,
              borderRadius: 0,
              padding: '0.75rem 1.25rem'
            }}
          >
            Sent Proposals ({outgoingSwaps.length})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading requests...</div>
        ) : (
          <div>
            {/* TAB 1: INCOMING */}
            {activeTab === 'incoming' && (
              incomingSwaps.length === 0 ? (
                <div className="card-static" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#6b7280' }}>No incoming swap requests at the moment.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {incomingSwaps.map((swap) => (
                    <div key={swap._id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <strong>{swap.sender?.name || 'Student'}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                            ({swap.sender?.email})
                          </span>
                        </div>
                        {renderStatusBadge(swap.status)}
                      </div>

                      {/* Trade Details */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        backgroundColor: '#f9fafb',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '0.75rem',
                        fontSize: '0.85rem'
                      }}>
                        <div>
                          <span style={{ color: '#4f46e5', fontWeight: 600 }}>They Offer: </span>
                          <strong>{swap.offeredSkill}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#b45309', fontWeight: 600 }}>In Exchange For: </span>
                          <strong>{swap.requestedSkill}</strong>
                        </div>
                      </div>

                      {swap.message && (
                        <p style={{ fontSize: '0.85rem', color: '#4b5563', fontStyle: 'italic', marginBottom: '1rem' }}>
                          "{swap.message}"
                        </p>
                      )}

                      {/* Action Buttons based on status */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
                        {swap.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(swap._id, 'rejected')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#dc2626' }}
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(swap._id, 'accepted')}
                              className="btn btn-primary btn-sm"
                            >
                              Accept
                            </button>
                          </>
                        )}

                        {swap.status === 'accepted' && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
                              Contact at : Email {swap.sender?.email}
                            </span>
                            <button
                              onClick={() => handleUpdateStatus(swap._id, 'completed')}
                              className="btn btn-primary btn-sm"
                            >
                              Mark Completed
                            </button>
                          </div>
                        )}

                        {swap.status === 'completed' && (
                          <button
                            onClick={() => setReviewModalTarget({ peerId: swap.sender?._id, peerName: swap.sender?.name })}
                            className="btn btn-secondary btn-sm"
                          >
                            ⭐ Give Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* TAB 2: OUTGOING */}
            {activeTab === 'outgoing' && (
              outgoingSwaps.length === 0 ? (
                <div className="card-static" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#6b7280' }}>No sent swap proposals yet.</p>
                  <Link to="/explore" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
                    Explore Students to Swap
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {outgoingSwaps.map((swap) => (
                    <div key={swap._id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <strong>Sent to: {swap.receiver?.name || 'Student'}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                            ({swap.receiver?.email})
                          </span>
                        </div>
                        {renderStatusBadge(swap.status)}
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        backgroundColor: '#f9fafb',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '0.75rem',
                        fontSize: '0.85rem'
                      }}>
                        <div>
                          <span style={{ color: '#4f46e5', fontWeight: 600 }}>You Offered: </span>
                          <strong>{swap.offeredSkill}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#b45309', fontWeight: 600 }}>You Requested: </span>
                          <strong>{swap.requestedSkill}</strong>
                        </div>
                      </div>

                      {swap.status === 'accepted' && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
                            💬 Learning Exchange Active: Email {swap.receiver?.email}
                          </span>
                          <button
                            onClick={() => handleUpdateStatus(swap._id, 'completed')}
                            className="btn btn-primary btn-sm"
                          >
                            Mark Completed
                          </button>
                        </div>
                      )}

                      {swap.status === 'completed' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                          <button
                            onClick={() => setReviewModalTarget({ peerId: swap.receiver?._id, peerName: swap.receiver?.name })}
                            className="btn btn-secondary btn-sm"
                          >
                            ⭐ Give Review
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* Review Modal */}
        {reviewModalTarget && (
          <div className="modal-overlay" onClick={() => setReviewModalTarget(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Leave a Review for {reviewModalTarget.peerName}</h3>
                <button onClick={() => setReviewModalTarget(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
              </div>

              <form onSubmit={handleSendReview}>
                <div className="input-group">
                  <label className="input-label">Rating (1 to 5 Stars):</label>
                  <select
                    className="select-field"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Below Average)</option>
                    <option value={1}>⭐ (1 - Poor)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Feedback Comment:</label>
                  <textarea
                    className="textarea-field"
                    rows={3}
                    placeholder="Describe how the learning session went..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setReviewModalTarget(null)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingReview} className="btn btn-primary">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
