import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetail from './pages/CampaignDetail';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

// Protected Route — redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-state"><div className="spinner spinner-lg" /></div>;
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Admin Route — only allows admin users
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="loading-state"><div className="spinner spinner-lg" /></div>;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
};

const AppContent = () => (
  <Router>
    <Navbar />
    <main className="page-wrapper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="*" element={
          <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', color: 'var(--primary-light)' }}>404</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Page not found</p>
            <a href="/" className="btn btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </main>
    <Footer />
  </Router>
);

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
