// Donation Model — Mongoose Schema
// Stores each donation: which campaign, which donor, amount, and Razorpay payment details

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference is required']
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor reference is required']
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Amount must be at least ₹1']
    },
    paymentId: {
      type: String,
      required: [true, 'Razorpay payment ID is required'],
      unique: true
    },
    orderId: {
      type: String,
      required: [true, 'Razorpay order ID is required']
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'success'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
