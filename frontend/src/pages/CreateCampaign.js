// Create Campaign Page — Form to create a new fundraising campaign
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateCampaign.css';

const CATEGORIES = ['Medical', 'Education', 'Social', 'Environment', 'Animal Welfare', 'Disaster Relief', 'Other'];

const CreateCampaign = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !description || !goal || !category) {
      setError('All fields except image are required.'); return;
    }
    if (description.length < 20) {
      setError('Description must be at least 20 characters.'); return;
    }
    if (Number(goal) < 100) {
      setError('Goal must be at least ₹100.'); return;
    }

    try {
      setLoading(true);
      setError('');
      const { data } = await axios.post('/api/campaigns', {
        title: title.trim(),
        description: description.trim(),
        goal: Number(goal),
        category,
        imageUrl: imageUrl.trim()
      });
      // Redirect to the newly created campaign page
      navigate(`/campaigns/${data.campaign._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-campaign-page">
      <div className="container">
        <div className="create-page-header">
          <h1>🚀 Start a Campaign</h1>
          <p>Share your cause and raise funds from generous donors across India.</p>
        </div>

        <div className="create-layout">
          {/* Form */}
          <div className="create-form-card">
            {error && <div className="alert alert-error"><span>⚠️</span><p>{error}</p></div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Campaign Title *</label>
                <input type="text" className="form-input" placeholder="e.g., Help Riya get cancer treatment" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} required />
              </div>

              <div className="form-group">
                <label className="form-label">Campaign Story *</label>
                <textarea className="form-input" rows={6} placeholder="Describe your cause — who needs help, why, and how funds will be used..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fundraising Goal (₹) *</label>
                  <input type="number" className="form-input" placeholder="e.g., 500000" value={goal} onChange={(e) => setGoal(e.target.value)} min={100} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>Select category...</option>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input type="url" className="form-input" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>

              <button type="submit" className="create-submit-btn" disabled={loading}>
                {loading ? <><span className="spinner" /> Creating...</> : '🚀 Launch Campaign'}
              </button>
            </form>
          </div>

          {/* Tips Sidebar */}
          <div className="create-sidebar">
            <div className="tips-card">
              <p className="tips-title">💡 Tips for Success</p>
              <ul className="tips-list">
                <li>Be specific about how funds will be used</li>
                <li>Add a real photo to build donor trust</li>
                <li>Share a personal story that connects emotionally</li>
                <li>Set a realistic goal based on actual needs</li>
                <li>Share your campaign on WhatsApp and social media</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
