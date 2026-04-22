// Fund Usage Routes — Campaign creator logs how collected funds were spent
// Public: GET usage for a campaign | Auth (creator only): POST, DELETE

const express = require('express');
const FundUsage = require('../models/FundUsage');
const Campaign = require('../models/Campaign');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/fund-usage/:campaignId — Public: get all fund usage records for a campaign
router.get('/:campaignId', async (req, res) => {
  try {
    const usages = await FundUsage.find({ campaign: req.params.campaignId })
      .sort({ createdAt: -1 });
    res.status(200).json({ usages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch fund usage.' });
  }
});

// POST /api/fund-usage/:campaignId — Auth (creator only): add a usage entry
router.post('/:campaignId', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });

    // Only the campaign creator can post usage
    if (campaign.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the campaign creator can log fund usage.' });
    }

    const { title, amount, category, note, receiptUrl } = req.body;
    if (!title || !amount) {
      return res.status(400).json({ message: 'Title and amount are required.' });
    }

    const usage = new FundUsage({
      campaign: req.params.campaignId,
      title: title.trim(),
      amount: Number(amount),
      category: category || 'Other',
      note: note ? note.trim() : '',
      receiptUrl: receiptUrl ? receiptUrl.trim() : '',
      postedBy: req.user._id
    });

    await usage.save();
    res.status(201).json({ message: 'Fund usage recorded.', usage });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record fund usage.', error: err.message });
  }
});

// DELETE /api/fund-usage/:usageId — Auth (creator): delete a usage entry
router.delete('/:usageId', authMiddleware, async (req, res) => {
  try {
    const usage = await FundUsage.findById(req.params.usageId).populate('campaign');
    if (!usage) return res.status(404).json({ message: 'Entry not found.' });

    if (usage.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this entry.' });
    }

    await FundUsage.findByIdAndDelete(req.params.usageId);
    res.status(200).json({ message: 'Entry deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete entry.' });
  }
});

module.exports = router;
