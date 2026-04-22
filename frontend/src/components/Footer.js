// Footer Component — Redesigned with social media links
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">

      {/* Top Wave Divider */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#0f172a" />
        </svg>
      </div>

      <div className="container">
        <div className="footer-grid">

          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/fundit.png" alt="FundIt" className="footer-logo-img" />
            </Link>
            <p className="footer-tagline">
              India's trusted crowdfunding platform. Empowering people to raise funds for medical emergencies, education, and social causes.
            </p>

            {/* Social Media Icons */}
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter / X">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Browse Campaigns</Link>
            <Link to="/create-campaign">Start a Campaign</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
            
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <span><span className="footer-icon">🏥</span>Medical</span>
            <span><span className="footer-icon">📚</span>Education</span>
            <span><span className="footer-icon">🤝</span>Social</span>
            <span><span className="footer-icon">🌿</span>Environment</span>
            <span><span className="footer-icon">⛑️</span>Disaster Relief</span>
            <span><span className="footer-icon">🐾</span>Animal Welfare</span>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <a href="mailto:support@fundit.in"><span className="footer-icon">📧</span>support@fundit.in</a>
            <a href="tel:+919876543210"><span className="footer-icon">📞</span>+91-9876543210</a>
            <span><span className="footer-icon">📍</span>Chandigarh, India</span>
            <div className="footer-badge">
              <span className="footer-icon">🔒</span>
              <span>100% Secure &amp; Trusted</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FundIt. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/">Privacy Policy</a>
            <span className="dot">·</span>
            <a href="/">Terms of Service</a>
            <span className="dot">·</span>
            <a href="/">Refund Policy</a>
          </div>
          <p>Built with 💙 for social impact</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
