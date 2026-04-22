// Home Page — Shows hero section + all campaign cards
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

// Emoji map for each campaign category
const CATEGORY_EMOJI = {
  Medical: '🏥', Education: '📚', Social: '🤝',
  Environment: '🌿', 'Animal Welfare': '🐾',
  'Disaster Relief': '⛑️', Other: '💡'
};

const CATEGORIES = ['All', 'Medical', 'Education', 'Social', 'Environment', 'Animal Welfare', 'Disaster Relief', 'Other'];

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch campaigns from backend API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (searchTerm.trim()) params.search = searchTerm.trim();

        const { data } = await axios.get('/api/campaigns', { params });
        // Backend may return array directly OR { campaigns: [...] }
        const list = Array.isArray(data) ? data : (data.campaigns || data.data || []);
        setCampaigns(list);
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="home-page">

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Give Hope. Change Lives.<br />
              <span className="gradient-text">Fund Every Dream.</span>
            </h1>
            <p className="hero-subtitle">
              Join thousands of donors supporting life-changing causes across India — from medical emergencies to education and social welfare.
            </p>
            <div className="hero-buttons">
              <Link to="/create-campaign" className="btn btn-green btn-lg">✨ Start a Campaign</Link>
              <a href="#campaigns" className="btn btn-secondary btn-lg">Explore Causes</a>
            </div>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="hero-stat"><span className="hero-stat-number">10K+</span><span className="hero-stat-label">Donors</span></div>
            <div className="hero-stat"><span className="hero-stat-number">₹50Cr+</span><span className="hero-stat-label">Raised</span></div>
            <div className="hero-stat"><span className="hero-stat-number">1M+</span><span className="hero-stat-label">Lives Impacted</span></div>
            <div className="hero-stat"><span className="hero-stat-number">98%</span><span className="hero-stat-label">Trust Score</span></div>
          </div>
        </div>

        {/* Animated background blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
      </section>

      {/* ── Trust Badges ─────────────────────────────────── */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-items">
            <span className="trust-item"><span className="trust-item-icon">🔒</span>100% Secure Payments</span>
            <span className="trust-item"><span className="trust-item-icon">✅</span>Verified Campaigns</span>
            <span className="trust-item"><span className="trust-item-icon">💳</span>Razorpay Protected</span>
            <span className="trust-item"><span className="trust-item-icon">📊</span>Zero Hidden Fees</span>
          </div>
        </div>
      </section>

      {/* ── Campaigns Section ────────────────────────────── */}
      <section className="campaigns-section" id="campaigns">
        <div className="container">
          <div className="section-header">
            <h2>Explore Campaigns</h2>
            <p>Find a cause close to your heart and make a difference today.</p>
          </div>

          {/* Search + Category Filter */}
          <div className="filter-bar">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="category-tabs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-tab ${selectedCategory === cat ? 'category-tab-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat !== 'All' && <span className="category-tab-icon">{CATEGORY_EMOJI[cat]}</span>} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Cards Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner spinner-lg" />
              <p>Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="empty-state">
              <h3>No campaigns found</h3>
              <p>Try a different search or category filter.</p>
            </div>
          ) : (
            <div className="campaigns-grid">
              {campaigns.map((campaign) => {
                const progress = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
                return (
                  <Link to={`/campaigns/${campaign._id}`} key={campaign._id} className="campaign-card">
                    {/* Card Image */}
                    <div className="card-image-wrapper">
                      {campaign.imageUrl ? (
                        <img src={campaign.imageUrl} alt={campaign.title} className="card-image" />
                      ) : (
                        <div className="card-image-placeholder">
                          {CATEGORY_EMOJI[campaign.category] || '💡'}
                        </div>
                      )}
                      <span className="card-category-badge">
                        <span className="card-category-icon">{CATEGORY_EMOJI[campaign.category]}</span> {campaign.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      <h3 className="card-title">{campaign.title}</h3>
                      <p className="card-desc">{(campaign.description || '').substring(0, 80)}{(campaign.description || '').length > 80 ? '...' : ''}</p>

                      {/* Progress Bar */}
                      <div className="card-progress">
                        <div className="progress-bar-wrapper">
                          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="card-progress-row">
                          <span className="card-raised">₹{campaign.raised.toLocaleString('en-IN')}</span>
                          <span className="card-goal">of ₹{campaign.goal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="card-footer-row">
                        <span className="card-creator">by {campaign.creator?.name || 'Anonymous'}</span>
                        <span className="card-pct">{progress}%</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Make a Difference?</h2>
          <p>Start your own campaign and raise funds for a cause you care about.</p>
          <Link to="/create-campaign" className="btn btn-green btn-xl">🚀 Start Your Campaign</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
