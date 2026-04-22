// User Profile Routes — Get own profile data, own campaigns, donation history
// Thank-you message: campaign creator thanks a specific donor

const express = require('express');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const ThankYou = require('../models/ThankYou');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/me — Get current user's profile + their campaigns + donations made
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    // Campaigns this user created
    const myCampaigns = await Campaign.find({ creator: req.user._id })
      .sort({ createdAt: -1 });

    // Donations this user has made
    const myDonations = await Donation.find({ donor: req.user._id, status: 'success' })
      .populate('campaign', 'title imageUrl category')
      .sort({ createdAt: -1 });

    res.status(200).json({ user, myCampaigns, myDonations });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

// POST /api/users/thank/:donationId — Campaign creator sends thank-you to a donor
router.post('/thank/:donationId', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Thank-you message is required.' });
    }

    // Get the donation to find campaign + donor
    const donation = await Donation.findById(req.params.donationId).populate('campaign');
    if (!donation) return res.status(404).json({ message: 'Donation not found.' });

    // Verify requester is the campaign creator
    if (donation.campaign.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the campaign creator can send thank-you messages.' });
    }

    // Check if already sent for this donation
    const existing = await ThankYou.findOne({ campaign: donation.campaign._id, donor: donation.donor });
    if (existing) {
      return res.status(409).json({ message: 'You already sent a thank-you to this donor.' });
    }

    const thanks = new ThankYou({
      campaign: donation.campaign._id,
      donor: donation.donor,
      message: message.trim().substring(0, 500),
      sentBy: req.user._id
    });
    await thanks.save();

    res.status(201).json({ message: 'Thank-you sent successfully!', thanks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send thank-you.', error: err.message });
  }
});

// GET /api/users/thanks/:campaignId — Get all thank-yous sent for a campaign
router.get('/thanks/:campaignId', authMiddleware, async (req, res) => {
  try {
    const thanks = await ThankYou.find({ campaign: req.params.campaignId })
      .populate('donor', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ thanks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch thank-yous.' });
  }
});

module.exports = router;
