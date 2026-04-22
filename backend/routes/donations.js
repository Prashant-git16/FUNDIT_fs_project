// Donation Routes — Razorpay payment integration
// Flow: Create Order → User pays via Razorpay → Record Donation in DB

const express = require('express');
const Razorpay = require('razorpay');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Initialize Razorpay lazily — ensures env vars are loaded before accessing them
let _razorpay = null;
const getRazorpay = () => {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return _razorpay;
};


// POST /api/donations/create-order — Step 1: Create a Razorpay order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount, campaignId } = req.body;

    if (!amount || !campaignId) {
      return res.status(400).json({ message: 'Amount and campaign ID are required.' });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({ message: 'Amount must be at least ₹1.' });
    }

    // Verify campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // Create order on Razorpay (amount in paise = rupees × 100)
    const order = await getRazorpay().orders.create({
      amount: Math.round(parsedAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payment order.', error: err.message });
  }
});

// POST /api/donations/record — Step 2: Record donation after successful payment
router.post('/record', authMiddleware, async (req, res) => {
  try {
    const { campaignId, amount, paymentId, orderId } = req.body;

    if (!campaignId || !amount || !paymentId || !orderId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Prevent duplicate recording
    const existing = await Donation.findOne({ paymentId });
    if (existing) {
      return res.status(409).json({ message: 'This payment has already been recorded.' });
    }

    const parsedAmount = Number(amount);

    // Save donation to database
    const donation = new Donation({
      campaign: campaignId,
      donor: req.user._id,
      amount: parsedAmount,
      paymentId,
      orderId,
      status: 'success'
    });
    await donation.save();

    // Update campaign raised amount using atomic $inc
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { raised: parsedAmount }
    });

    await donation.populate('donor', 'name');

    res.status(201).json({
      message: 'Donation recorded successfully!',
      donation
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate payment.' });
    }
    res.status(500).json({ message: 'Failed to record donation.' });
  }
});

// GET /api/donations/:campaignId — Get all donations for a campaign (public)
router.get('/:campaignId', async (req, res) => {
  try {
    const donations = await Donation.find({
      campaign: req.params.campaignId,
      status: 'success'
    })
      .populate('donor', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ donations });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid campaign ID.' });
    }
    res.status(500).json({ message: 'Failed to fetch donations.' });
  }
});

module.exports = router;
