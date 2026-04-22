// ═══════════════════════════════════════════════════════
// FundIt Backend — Express.js REST API Server
// Tech: Node.js + Express + MongoDB + JWT + Razorpay
// ═══════════════════════════════════════════════════════

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');
dns.setServers(['1.1.1.1','8.8.8.8']);
// Load environment variables from .env file
dotenv.config();

// Import route handlers
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const donationRoutes = require('./routes/donations');
const fundUsageRoutes = require('./routes/fundUsage');
const usersRoutes = require('./routes/users');

// Create Express app
const app = express();

// ─── Middleware ───────────────────────────────────────────
// CORS: Allow frontend to call this API from any origin
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// ─── API Routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes);              // Register & Login
app.use('/api/campaigns', campaignRoutes);      // Campaign CRUD
app.use('/api/donations', donationRoutes);      // Razorpay Donations
app.use('/api/fund-usage', fundUsageRoutes);    // Fund Usage Tracker
app.use('/api/users', usersRoutes);             // User Profile + Thank-you

// Health check endpoint (useful for deployment monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FundIt API is running' });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Startup Validation ──────────────────────────────────
const PORT = process.env.PORT || 5000;

// Check that required environment variables are set
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('\n❌ Missing required environment variables!');
  console.error('   Please set MONGO_URI and JWT_SECRET in backend/.env');
  console.error('   See README.md for setup instructions.\n');
  process.exit(1);
}

// ─── Connect to MongoDB and Start Server ─────────────────
console.log('🔌 Connecting to MongoDB...');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`\n🚀 FundIt backend is running on http://localhost:${PORT}\n`);
    });
  })
  .catch((err) => {
    console.error('\n❌ MongoDB Connection Failed:', err.message);
    console.error('   Check MONGO_URI in backend/.env and whitelist your IP in Atlas.\n');
    process.exit(1);
  });
