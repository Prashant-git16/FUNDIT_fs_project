// Navbar Component — Site-wide navigation bar
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow to navbar when user scrolls
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/fundit.png" alt="FundIt" className="navbar-logo-img" />
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
            Contact
          </NavLink>
          {isAuthenticated() && (
            <NavLink to="/create-campaign" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              Start Campaign
            </NavLink>
          )}
          {isAdmin() && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="navbar-auth">
          {isAuthenticated() ? (
            <div className="user-menu">
              <Link to="/profile" className="user-avatar" title="My Profile">{user.name.charAt(0).toUpperCase()}</Link>
              <Link to="/profile" className="user-name">{user.name.split(' ')[0]}</Link>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Log In</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className={`hamburger ${menuOpen ? 'hamburger-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className="mobile-nav-link" onClick={closeMenu} end>🏠 Home</NavLink>
          <NavLink to="/about" className="mobile-nav-link" onClick={closeMenu}>ℹ️ About Us</NavLink>
          <NavLink to="/contact" className="mobile-nav-link" onClick={closeMenu}>📞 Contact Us</NavLink>
          {isAuthenticated() && (
            <NavLink to="/create-campaign" className="mobile-nav-link" onClick={closeMenu}>✨ Start Campaign</NavLink>
          )}
          {isAdmin() && (
            <NavLink to="/admin" className="mobile-nav-link" onClick={closeMenu}>⚙️ Admin</NavLink>
          )}
          <div className="mobile-auth">
            {isAuthenticated() ? (
              <>
                <Link to="/profile" className="mobile-nav-link" onClick={closeMenu}>👤 My Profile</Link>
                <button className="btn btn-secondary btn-full" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-full" onClick={closeMenu}>Log In</Link>
                <Link to="/register" className="btn btn-primary btn-full" onClick={closeMenu}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
