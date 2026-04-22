// Admin Dashboard — View and manage all campaigns (admin only)
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all campaigns (including inactive) via admin endpoint
  const fetchAllCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/campaigns/admin/all');
      const list = Array.isArray(data) ? data : (data.campaigns || data.data || []);
      setCampaigns(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllCampaigns(); }, [fetchAllCampaigns]);

  // Delete a campaign
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await axios.delete(`/api/campaigns/${id}`);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter campaigns by search term
  const filtered = campaigns.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + c.goal, 0);

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>⚙️ Admin Dashboard</h1>
            <p>Manage all FundIt campaigns</p>
          </div>
          <Link to="/create-campaign" className="btn btn-primary btn-sm">+ New Campaign</Link>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{campaigns.length}</div><div className="stat-label">Total Campaigns</div></div>
          <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-value" style={{ color: 'var(--green)' }}>₹{totalRaised.toLocaleString('en-IN')}</div><div className="stat-label">Total Raised</div></div>
          <div className="stat-card"><div className="stat-icon">🎯</div><div className="stat-value">₹{totalGoal.toLocaleString('en-IN')}</div><div className="stat-label">Combined Goal</div></div>
          <div className="stat-card"><div className="stat-icon">📈</div><div className="stat-value">{totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0}%</div><div className="stat-label">Overall Progress</div></div>
        </div>

        {error && <div className="alert alert-error"><span>⚠️</span><p>{error}</p></div>}

        {/* Search */}
        <div className="admin-controls">
          <input
            type="text"
            className="admin-search-input"
            placeholder="🔍 Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {filtered.length} of {campaigns.length} campaigns
          </span>
        </div>

        {/* Table */}
        <div className="admin-table-card">
          {loading ? (
            <div className="loading-state"><div className="spinner spinner-lg" /><p>Loading...</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><h3>No campaigns found</h3></div>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Title</th><th>Category</th><th>Creator</th><th>Goal</th><th>Raised</th><th>Progress</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const pct = Math.min(Math.round((c.raised / c.goal) * 100), 100);
                    return (
                      <tr key={c._id}>
                        <td>{i + 1}</td>
                        <td><Link to={`/campaigns/${c._id}`} className="campaign-link-cell">{c.title}</Link></td>
                        <td><span className="badge badge-blue">{c.category}</span></td>
                        <td>{c.creator?.name || 'N/A'}</td>
                        <td>₹{c.goal.toLocaleString('en-IN')}</td>
                        <td style={{ color: 'var(--green)', fontWeight: 700 }}>₹{c.raised.toLocaleString('en-IN')}</td>
                        <td>
                          <div className="progress-cell">
                            <div className="progress-bar-wrapper" style={{ height: '6px', flex: 1 }}>
                              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pct}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="action-cell">
                            <Link to={`/campaigns/${c._id}`} className="btn btn-secondary btn-sm">View</Link>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id, c.title)} disabled={deletingId === c._id}>
                              {deletingId === c._id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
