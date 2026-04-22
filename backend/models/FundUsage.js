// FundUsage Model — Tracks how campaign funds are spent
// Campaign creator logs each expenditure: title, amount, category, receipt

const mongoose = require('mongoose');

const fundUsageSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Usage title is required'],
      trim: true,
      maxlength: 100
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least ₹1']
    },
    category: {
      type: String,
      enum: ['Medical', 'Education', 'Travel', 'Equipment', 'Food', 'Shelter', 'Other'],
      default: 'Other'
    },
    note: {
      type: String,
      default: '',
      maxlength: 300
    },
    // Optional: URL to a receipt or proof image
    receiptUrl: {
      type: String,
      default: ''
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FundUsage', fundUsageSchema);
