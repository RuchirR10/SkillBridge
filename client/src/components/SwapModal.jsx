import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const SwapModal = ({ receiver, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [offeredSkill, setOfferedSkill] = useState(user?.skillsOffered?.[0] || '');
  const [requestedSkill, setRequestedSkill] = useState(receiver?.skillsOffered?.[0] || '');
  const [message, setMessage] = useState('Hi, I would like to exchange skills with you!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendSwap = async (e) => {
    e.preventDefault();
    if (!offeredSkill || !requestedSkill) {
      setError('Please select both offered and requested skills');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: user._id,
          receiver: receiver._id,
          offeredSkill,
          requestedSkill,
          message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send request');
      }

      alert('Swap request sent successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '1.75rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>
            Send Swap Request to {receiver.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#6b7280',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 0.25rem'
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.65rem 0.85rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSendSwap}>
          {/* Skill you offer */}
          <div className="input-group">
            <label className="input-label">Skill You Offer:</label>
            {user?.skillsOffered && user.skillsOffered.length > 0 ? (
              <select
                className="select-field"
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                required
              >
                {user.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="input-field"
                placeholder="e.g. React"
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                required
              />
            )}
          </div>

          {/* Skill you want */}
          <div className="input-group">
            <label className="input-label">Skill You Want to Learn from {receiver.name}:</label>
            {receiver?.skillsOffered && receiver.skillsOffered.length > 0 ? (
              <select
                className="select-field"
                value={requestedSkill}
                onChange={(e) => setRequestedSkill(e.target.value)}
                required
              >
                {receiver.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Python"
                value={requestedSkill}
                onChange={(e) => setRequestedSkill(e.target.value)}
                required
              />
            )}
          </div>

          {/* Proposal Message */}
          <div className="input-group">
            <label className="input-label">Message:</label>
            <textarea
              className="textarea-field"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a short message to coordinate your skill exchange..."
              style={{ minHeight: '80px' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem' }}
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
