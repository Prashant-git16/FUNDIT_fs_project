// User Profile Page — Shows user info, their campaigns, and donations they made
// Campaign creators can also send thank-you messages to donors from here

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

const CATEGORY_EMOJI = {
  Medical: '🏥', Education: '📚', Social: '🤝',
  Environment: '🌿', 'Animal Welfare': '🐾',
  'Disaster Relief': '⛑️', Other: '💡'
};

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' | 'donations'
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Thank-you state
  const [thankMsg, setThankMsg] = useState({});       // { [donationId]: message }
  const [thankSent, setThankSent] = useState({});     // { [donationId]: true }
  const [thankLoading, setThankLoading] = useState({}); // { [donationId]: true }

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/users/me');
        setProfileData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Send a thank-you message from campaign creator to a donor
  // Note: This is shown when viewing the dashboard of your own campaign's donors
  const handleThankYou = async (donationId) => {
    const msg = thankMsg[donationId];
    if (!msg || !msg.trim()) return;

    try {
      setThankLoading((prev) => ({ ...prev, [donationId]: true }));
      await axios.post(`/api/users/thank/${donationId}`, { message: msg });
      setThankSent((prev) => ({ ...prev, [donationId]: true }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send thank you.');
    } finally {
      setThankLoading((prev) => ({ ...prev, [donationId]: false }));
    }
  };

  if (loading) return (
    <div className="loading-state" style={{ minHeight: '60vh' }}>
      <div className="spinner spinner-lg" />
      <p>Loading profile...</p>
    </div>
  );

  if (error) return (
    <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <div className="alert alert-error" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <span>⚠️</span><p>{error}</p>
      </div>
    </div>
  );

  const { myCampaigns = [], myDonations = [] } = profileData || {};
  const totalRaised = myCampaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalDonated = myDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="profile-page">
      <div className="container">

        {/* ── Profile Header Card ────────────────────────── */}
        <div className="profile-header-card">
          <div className="profile-avatar-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">📧 {user.email}</p>
            {user.role === 'admin' && <span className="badge badge-blue">⚙️ Admin</span>}
          </div>

          {/* Quick Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-val">{myCampaigns.length}</span>
              <span className="profile-stat-label">Campaigns</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-val" style={{ color: 'var(--green)' }}>
                ₹{totalRaised.toLocaleString('en-IN')}
              </span>
              <span className="profile-stat-label">Total Raised</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-val">{myDonations.length}</span>
              <span className="profile-stat-label">Donations Made</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-val" style={{ color: 'var(--primary)' }}>
                ₹{totalDonated.toLocaleString('en-IN')}
              </span>
              <span className="profile-stat-label">Total Donated</span>
            </div>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <Link to="/create-campaign" className="btn btn-green btn-sm">+ New Campaign</Link>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────── */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'campaigns' ? 'profile-tab-active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            📋 My Campaigns ({myCampaigns.length})
          </button>
          <button
            className={`profile-tab ${activeTab === 'donations' ? 'profile-tab-active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            💙 My Donations ({myDonations.length})
          </button>
        </div>

        {/* ── My Campaigns Tab ──────────────────────────── */}
        {activeTab === 'campaigns' && (
          <div className="profile-section">
            {myCampaigns.length === 0 ? (
              <div className="empty-state">
                <h3>No campaigns yet</h3>
                <p>Start your first fundraising campaign!</p>
                <Link to="/create-campaign" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  🚀 Start Campaign
                </Link>
              </div>
            ) : (
              <div className="my-campaigns-list">
                {myCampaigns.map((c) => {
                  const pct = Math.min(Math.round((c.raised / c.goal) * 100), 100);
                  return (
                    <div key={c._id} className="my-campaign-card">
                      <div className="my-campaign-left">
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.title} className="my-campaign-img" />
                        ) : (
                          <div className="my-campaign-img-placeholder">
                            {CATEGORY_EMOJI[c.category] || '💡'}
                          </div>
                        )}
                      </div>
                      <div className="my-campaign-body">
                        <div className="my-campaign-top">
                          <h3 className="my-campaign-title">{c.title}</h3>
                          <span className="badge badge-blue">{c.category}</span>
                        </div>
                        <div className="my-campaign-progress">
                          <div className="progress-bar-wrapper">
                            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="my-campaign-nums">
                            <span>
                              <strong style={{ color: 'var(--green)' }}>
                                ₹{c.raised.toLocaleString('en-IN')}
                              </strong> raised of ₹{c.goal.toLocaleString('en-IN')}
                            </span>
                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{pct}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="my-campaign-actions">
                        <Link to={`/campaigns/${c._id}`} className="btn btn-primary btn-sm">
                          View & Manage
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── My Donations Tab ──────────────────────────── */}
        {activeTab === 'donations' && (
          <div className="profile-section">
            {myDonations.length === 0 ? (
              <div className="empty-state">
                <h3>No donations yet</h3>
                <p>Browse campaigns and make your first donation!</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Browse Campaigns
                </Link>
              </div>
            ) : (
              <div className="my-donations-list">
                {myDonations.map((d) => (
                  <div key={d._id} className="my-donation-card">
                    <div className="my-donation-left">
                      <div className="my-donation-emoji">
                        {CATEGORY_EMOJI[d.campaign?.category] || '💡'}
                      </div>
                    </div>
                    <div className="my-donation-body">
                      <h4 className="my-donation-campaign">
                        {d.campaign?.title || 'Campaign'}
                      </h4>
                      <span className="my-donation-date">
                        📅 {new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="my-donation-amount">
                      ₹{d.amount.toLocaleString('en-IN')}
                    </div>
                    <Link to={`/campaigns/${d.campaign?._id}`} className="btn btn-secondary btn-sm">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
