// Campaign Routes — CRUD operations for campaigns
// Public: GET all, GET one | Auth: POST create | Admin: GET all, DELETE

const express = require('express');
const Campaign = require('../models/Campaign');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/campaigns — Get all active campaigns (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    // Build query filter
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch campaigns, newest first
    const campaigns = await Campaign.find(query)
      .populate('creator', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ campaigns });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch campaigns.' });
  }
});

// GET /api/campaigns/admin/all — All campaigns including inactive (admin only)
// NOTE: This route must come BEFORE /:id to avoid conflict
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find({})
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ campaigns });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch campaigns.' });
  }
});

// GET /api/campaigns/:id — Get single campaign by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('creator', 'name');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    res.status(200).json({ campaign });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid campaign ID.' });
    }
    res.status(500).json({ message: 'Failed to fetch campaign.' });
  }
});

// POST /api/campaigns — Create a new campaign (login required)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, goal, category, imageUrl } = req.body;

    // Validate required fields
    if (!title || !description || !goal || !category) {
      return res.status(400).json({ message: 'Title, description, goal, and category are required.' });
    }

    if (isNaN(goal) || Number(goal) < 100) {
      return res.status(400).json({ message: 'Goal must be at least ₹100.' });
    }

    // Create campaign
    const campaign = new Campaign({
      title: title.trim(),
      description: description.trim(),
      goal: Number(goal),
      category,
      imageUrl: imageUrl || '',
      creator: req.user._id
    });

    await campaign.save();
    await campaign.populate('creator', 'name');

    res.status(201).json({ message: 'Campaign created successfully.', campaign });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Failed to create campaign.' });
  }
});

// DELETE /api/campaigns/:id — Delete a campaign (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }
    res.status(200).json({ message: 'Campaign deleted successfully.' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid campaign ID.' });
    }
    res.status(500).json({ message: 'Failed to delete campaign.' });
  }
});

module.exports = router;
