// Campaign Detail Page — Shows full campaign info + donation form + fund usage tracker
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CampaignDetail.css';

const CATEGORY_EMOJI = {
  Medical: '🏥', Education: '📚', Social: '🤝',
  Environment: '🌿', 'Animal Welfare': '🐾',
  'Disaster Relief': '⛑️', Other: '💡'
};

const PRESET_AMOUNTS = [100, 500, 1000, 2500, 5000];
const USAGE_CATEGORIES = ['Medical', 'Education', 'Travel', 'Equipment', 'Food', 'Shelter', 'Other'];

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Core state
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [fundUsages, setFundUsages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Donation state
  const [donateAmount, setDonateAmount] = useState('');
  const [donateError, setDonateError] = useState('');
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateSuccess, setDonateSuccess] = useState('');

  // Fund usage form (creator only)
  const [showUsageForm, setShowUsageForm] = useState(false);
  const [usageTitle, setUsageTitle] = useState('');
  const [usageAmount, setUsageAmount] = useState('');
  const [usageCategory, setUsageCategory] = useState('Other');
  const [usageNote, setUsageNote] = useState('');
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState('');

  // Thank-you state for creator
  const [thankMsg, setThankMsg] = useState({});
  const [thankSent, setThankSent] = useState({});
  const [thankLoading, setThankLoading] = useState({});

  // Active tab: 'details' | 'usage' | 'donors'
  const [activeTab, setActiveTab] = useState('details');

  // ── Data fetching ──────────────────────────────────────
  const fetchCampaign = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/campaigns/${id}`);
      setCampaign(data.campaign);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campaign.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchDonations = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/donations/${id}`);
      setDonations(data.donations);
    } catch { /* non-critical */ }
  }, [id]);

  const fetchFundUsage = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/fund-usage/${id}`);
      setFundUsages(data.usages);
    } catch { /* non-critical */ }
  }, [id]);

  useEffect(() => {
    fetchCampaign();
    fetchDonations();
    fetchFundUsage();
  }, [fetchCampaign, fetchDonations, fetchFundUsage]);

  // Check if the logged-in user is the campaign creator
  const isCreator = campaign && user && campaign.creator?._id === user._id;

  // ── Razorpay Donation ──────────────────────────────────
  // Step 1: Create Razorpay order → Step 2: Pop checkout → Step 3: Record donation
  const handleDonate = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    const amount = Number(donateAmount);
    if (!donateAmount || isNaN(amount) || amount < 1) {
      setDonateError('Please enter a valid amount (minimum ₹1).'); return;
    }

    try {
      setDonateLoading(true);
      setDonateError('');
      setDonateSuccess('');

      const { data: orderData } = await axios.post('/api/donations/create-order', {
        amount, campaignId: id
      });

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FundIt',
        description: `Donation to: ${campaign.title}`,
        order_id: orderData.orderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: '#1a56db' },
        handler: async (response) => {
          try {
            await axios.post('/api/donations/record', {
              campaignId: id,
              amount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            });
            setDonateSuccess(`🎉 Thank you! ₹${amount.toLocaleString('en-IN')} donated successfully!`);
            setDonateAmount('');
            fetchCampaign();
            fetchDonations();
          } catch {
            setDonateError('Payment succeeded but recording failed. Please contact support.');
          } finally {
            setDonateLoading(false);
          }
        },
        modal: { ondismiss: () => { setDonateLoading(false); } }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => {
        setDonateLoading(false);
        setDonateError(`Payment failed: ${r.error.description || 'Unknown error.'}`);
      });
      rzp.open();
    } catch (err) {
      setDonateLoading(false);
      setDonateError(err.response?.data?.message || 'Failed to initiate payment.');
    }
  };

  // ── Fund Usage Entry (creator only) ───────────────────
  const handleAddUsage = async (e) => {
    e.preventDefault();
    if (!usageTitle || !usageAmount) { setUsageError('Title and amount are required.'); return; }
    if (Number(usageAmount) < 1) { setUsageError('Amount must be at least ₹1.'); return; }

    try {
      setUsageLoading(true);
      setUsageError('');
      await axios.post(`/api/fund-usage/${id}`, {
        title: usageTitle.trim(),
        amount: Number(usageAmount),
        category: usageCategory,
        note: usageNote.trim()
      });
      setUsageTitle(''); setUsageAmount(''); setUsageNote(''); setShowUsageForm(false);
      fetchFundUsage();
    } catch (err) {
      setUsageError(err.response?.data?.message || 'Failed to record usage.');
    } finally {
      setUsageLoading(false);
    }
  };

  const handleDeleteUsage = async (usageId) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await axios.delete(`/api/fund-usage/${usageId}`);
      fetchFundUsage();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete entry.');
    }
  };

  // ── Thank-you (creator → donor) ────────────────────────
  const handleThankYou = async (donationId) => {
    const msg = thankMsg[donationId];
    if (!msg || !msg.trim()) return;
    try {
      setThankLoading((p) => ({ ...p, [donationId]: true }));
      await axios.post(`/api/users/thank/${donationId}`, { message: msg });
      setThankSent((p) => ({ ...p, [donationId]: true }));
    } catch (err) {
      alert(err.response?.data?.message || 'Already sent a thank-you to this donor.');
    } finally {
      setThankLoading((p) => ({ ...p, [donationId]: false }));
    }
  };

  // ── Render loading / error ─────────────────────────────
  if (loading) return (
    <div className="loading-state" style={{ minHeight: '60vh' }}>
      <div className="spinner spinner-lg" /><p>Loading campaign...</p>
    </div>
  );

  if (error) return (
    <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
        <span>⚠️</span><p>{error}</p>
      </div>
      <Link to="/" className="btn btn-primary">← Back to Campaigns</Link>
    </div>
  );

  const progress = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
  const remaining = Math.max(campaign.goal - campaign.raised, 0);

  // Fund usage calculations
  const totalSpent = fundUsages.reduce((sum, u) => sum + u.amount, 0);
  const raisedFromDonors = campaign.raised;
  const surplusOrDeficit = raisedFromDonors - totalSpent;

  return (
    <div className="campaign-detail-page">
      <div className="container">
        <div className="detail-layout">

          {/* ── Left: Campaign Info ──────────────────────── */}
          <div className="detail-main">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <Link to="/">Campaigns</Link>
              <span>/</span>
              <span className="badge badge-blue">{campaign.category}</span>
            </div>

            {/* Hero Image */}
            <div className="detail-image-wrapper">
              {campaign.imageUrl ? (
                <img src={campaign.imageUrl} alt={campaign.title} className="detail-image" />
              ) : (
                <div className="detail-image-placeholder">{CATEGORY_EMOJI[campaign.category] || '💡'}</div>
              )}
              {campaign.raised >= campaign.goal && (
                <div className="goal-reached-badge">✅ Goal Reached!</div>
              )}
            </div>

            {/* Info Card */}
            <div className="detail-info-card">
              <h1 className="detail-title">{campaign.title}</h1>
              <div className="detail-meta">
                <span className="meta-chip">👤 By <strong>{campaign.creator?.name || 'Anonymous'}</strong></span>
                <span className="meta-chip">📅 {new Date(campaign.createdAt).toLocaleDateString('en-IN')}</span>
                <span className="badge badge-blue">{campaign.category}</span>
                {isCreator && <span className="badge badge-green">✏️ Your Campaign</span>}
              </div>

              {/* Tabs */}
              <div className="detail-tabs">
                <button className={`detail-tab ${activeTab === 'details' ? 'detail-tab-active' : ''}`} onClick={() => setActiveTab('details')}>📄 Story</button>
                <button className={`detail-tab ${activeTab === 'usage' ? 'detail-tab-active' : ''}`} onClick={() => setActiveTab('usage')}>
                  💰 Fund Tracker {fundUsages.length > 0 && <span className="tab-count">{fundUsages.length}</span>}
                </button>
                <button className={`detail-tab ${activeTab === 'donors' ? 'detail-tab-active' : ''}`} onClick={() => setActiveTab('donors')}>
                  💙 Donors {donations.length > 0 && <span className="tab-count">{donations.length}</span>}
                </button>
              </div>

              {/* ── Story Tab ────────────────────────────── */}
              {activeTab === 'details' && (
                <div className="detail-description">
                  {campaign.description.split('\n').map((para, i) =>
                    para.trim() ? <p key={i}>{para}</p> : null
                  )}
                </div>
              )}

              {/* ── Fund Usage Tab ────────────────────────── */}
              {activeTab === 'usage' && (
                <div className="fund-usage-section">
                  {/* Summary Cards */}
                  <div className="usage-summary-cards">
                    <div className="usage-summary-card">
                      <span className="usage-icon">💰</span>
                      <span className="usage-val" style={{ color: 'var(--green)' }}>
                        ₹{raisedFromDonors.toLocaleString('en-IN')}
                      </span>
                      <span className="usage-lbl">Total Raised</span>
                    </div>
                    <div className="usage-summary-card">
                      <span className="usage-icon">💸</span>
                      <span className="usage-val" style={{ color: 'var(--danger)' }}>
                        ₹{totalSpent.toLocaleString('en-IN')}
                      </span>
                      <span className="usage-lbl">Total Spent</span>
                    </div>
                    <div className="usage-summary-card">
                      <span className="usage-icon">{surplusOrDeficit >= 0 ? '✅' : '⚠️'}</span>
                      <span className="usage-val" style={{ color: surplusOrDeficit >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
                        ₹{Math.abs(surplusOrDeficit).toLocaleString('en-IN')}
                      </span>
                      <span className="usage-lbl">{surplusOrDeficit >= 0 ? 'Balance Remaining' : 'Overspent'}</span>
                    </div>
                    <div className="usage-summary-card">
                      <span className="usage-icon">🎯</span>
                      <span className="usage-val">₹{remaining.toLocaleString('en-IN')}</span>
                      <span className="usage-lbl">Still Needed</span>
                    </div>
                  </div>

                  {/* Add usage form (creator only) */}
                  {isCreator && (
                    <div className="usage-creator-panel">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowUsageForm((p) => !p)}
                      >
                        {showUsageForm ? '✕ Cancel' : '+ Log Expenditure'}
                      </button>

                      {showUsageForm && (
                        <form className="usage-form" onSubmit={handleAddUsage}>
                          {usageError && <div className="alert alert-error"><span>⚠️</span><p>{usageError}</p></div>}
                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">Description *</label>
                              <input className="form-input" type="text" placeholder="e.g., Hospital bills" value={usageTitle} onChange={(e) => setUsageTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Amount (₹) *</label>
                              <input className="form-input" type="number" placeholder="e.g., 25000" value={usageAmount} onChange={(e) => setUsageAmount(e.target.value)} min={1} required />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">Category</label>
                              <select className="form-input" value={usageCategory} onChange={(e) => setUsageCategory(e.target.value)}>
                                {USAGE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Note (optional)</label>
                              <input className="form-input" type="text" placeholder="Any additional details..." value={usageNote} onChange={(e) => setUsageNote(e.target.value)} />
                            </div>
                          </div>
                          <button className="btn btn-green btn-sm" type="submit" disabled={usageLoading}>
                            {usageLoading ? <><span className="spinner" /> Saving...</> : '💾 Save Entry'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Usage entries */}
                  {fundUsages.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem' }}>
                      <p>No fund usage recorded yet.</p>
                      {isCreator && <p style={{ fontSize: '0.82rem', marginTop: '0.3rem' }}>Click "+ Log Expenditure" to add entries.</p>}
                    </div>
                  ) : (
                    <div className="usage-list">
                      {fundUsages.map((u) => (
                        <div key={u._id} className="usage-entry">
                          <div className="usage-entry-left">
                            <span className="usage-entry-icon">💸</span>
                            <div>
                              <div className="usage-entry-title">{u.title}</div>
                              <div className="usage-entry-meta">
                                <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>{u.category}</span>
                                {u.note && <span className="usage-note">{u.note}</span>}
                                <span className="usage-date">{new Date(u.createdAt).toLocaleDateString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="usage-entry-right">
                            <span className="usage-entry-amount">₹{u.amount.toLocaleString('en-IN')}</span>
                            {isCreator && (
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUsage(u._id)}>✕</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Donors Tab ────────────────────────────── */}
              {activeTab === 'donors' && (
                <div className="donors-section">
                  {donations.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem' }}>
                      <p>🌟 Be the first to support this campaign!</p>
                    </div>
                  ) : (
                    <div className="donors-list">
                      {donations.map((d) => (
                        <div key={d._id} className="donor-row">
                          <div className="donor-avatar">{(d.donor?.name || 'A').charAt(0).toUpperCase()}</div>
                          <div className="donor-info">
                            <div className="donor-name">{d.donor?.name || 'Anonymous'}</div>
                            <div className="donor-date">{new Date(d.createdAt).toLocaleDateString('en-IN')}</div>
                          </div>
                          <div className="donor-amount">₹{d.amount.toLocaleString('en-IN')}</div>

                          {/* Thank-you button — only for campaign creator */}
                          {isCreator && (
                            <div className="thank-you-inline">
                              {thankSent[d._id] ? (
                                <span className="badge badge-green">✅ Thanks Sent</span>
                              ) : (
                                <div className="thank-form">
                                  <input
                                    type="text"
                                    className="thank-input"
                                    placeholder="Send a thank-you..."
                                    value={thankMsg[d._id] || ''}
                                    onChange={(e) => setThankMsg((p) => ({ ...p, [d._id]: e.target.value }))}
                                    maxLength={200}
                                  />
                                  <button
                                    className="btn btn-green btn-sm"
                                    onClick={() => handleThankYou(d._id)}
                                    disabled={thankLoading[d._id] || !thankMsg[d._id]?.trim()}
                                  >
                                    {thankLoading[d._id] ? '...' : '💌 Thank'}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Donation Sidebar ──────────────────── */}
          <div className="donation-sidebar">
            {/* Progress Card */}
            <div className="progress-card">
              <div className="raised-amount-display">₹{campaign.raised.toLocaleString('en-IN')}</div>
              <div className="raised-of-goal">raised of ₹{campaign.goal.toLocaleString('en-IN')} goal</div>
              <div className="progress-bar-wrapper" style={{ height: '10px' }}>
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-stats-row">
                <div className="p-stat"><span className="p-stat-val" style={{ color: 'var(--primary)' }}>{progress}%</span><span className="p-stat-label">Funded</span></div>
                <div className="p-stat"><span className="p-stat-val">{donations.length}</span><span className="p-stat-label">Donors</span></div>
                <div className="p-stat"><span className="p-stat-val">₹{remaining.toLocaleString('en-IN')}</span><span className="p-stat-label">Left</span></div>
              </div>
            </div>

            {/* Donate Card */}
            <div className="donate-form-card">
              <h3 className="donate-form-title">💙 Make a Donation</h3>

              {donateSuccess && <div className="alert alert-success"><span>🎉</span><p>{donateSuccess}</p></div>}
              {donateError && <div className="alert alert-error"><span>⚠️</span><p>{donateError}</p></div>}

              {!isAuthenticated() ? (
                <>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Sign in to support this campaign.
                  </p>
                  <Link to="/login" className="login-to-donate-btn">🔐 Sign In to Donate</Link>
                </>
              ) : isCreator ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
                  This is <strong>your campaign</strong>. Manage it via the tabs above. 👆
                </p>
              ) : (
                <>
                  <div className="preset-grid">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        className={`preset-btn ${donateAmount === String(amt) ? 'preset-btn-active' : ''}`}
                        onClick={() => { setDonateAmount(String(amt)); setDonateError(''); setDonateSuccess(''); }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <div className="amount-input-wrapper">
                    <span className="amount-prefix">₹</span>
                    <input
                      type="number"
                      className="amount-input"
                      placeholder="Enter custom amount"
                      value={donateAmount}
                      onChange={(e) => { setDonateAmount(e.target.value); setDonateError(''); setDonateSuccess(''); }}
                      min={1}
                    />
                  </div>
                  <button
                    className="donate-cta-btn"
                    onClick={handleDonate}
                    disabled={donateLoading || !donateAmount || Number(donateAmount) < 1}
                  >
                    {donateLoading ? <><span className="spinner" /> Processing...</> : '💚 Donate via Razorpay'}
                  </button>
                  <div className="secure-badge">🔒 100% Secure · Powered by Razorpay</div>
                </>
              )}
            </div>

            {/* Share Card */}
            <div className="share-card">
              <p className="share-card-title">📣 Share This Campaign</p>
              <div className="share-buttons">
                <button className="share-btn share-wa" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Support "${campaign.title}" on FundIt: ${window.location.href}`)}`)}>
                  📱 WhatsApp
                </button>
                <button className="share-btn share-copy" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}>
                  🔗 Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
