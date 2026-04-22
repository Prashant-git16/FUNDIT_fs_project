// Campaign Model — Mongoose Schema
// Stores campaign title, description, goal, raised amount, category, image, and creator

const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
      minlength: [20, 'Description must be at least 20 characters']
    },
    goal: {
      type: Number,
      required: [true, 'Fundraising goal is required'],
      min: [100, 'Goal must be at least ₹100']
    },
    raised: {
      type: Number,
      default: 0,
      min: 0
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Medical', 'Education', 'Social', 'Environment', 'Animal Welfare', 'Disaster Relief', 'Other']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);
