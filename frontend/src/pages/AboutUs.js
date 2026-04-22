// About Us Page — FundIt's story, mission, tech stack, impact
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const stats = [
  { icon: '💙', value: '10,000+', label: 'Donors Nationwide' },
  { icon: '📢', value: '₹50 Cr+', label: 'Funds Raised' },
  { icon: '🌱', value: '1 Million+', label: 'Lives Impacted' },
  { icon: '⭐', value: '98%', label: 'Trust Score' },
  { icon: '🏥', value: '500+', label: 'Medical Campaigns' },
  { icon: '🎓', value: '300+', label: 'Education Campaigns' },
];

const timeline = [
  { year: '2023', icon: '💡', title: 'The Idea', desc: 'A team of engineers noticed that India lacked a trustworthy, transparent, and tech-powered crowdfunding platform for real people — not just celebrities.' },
  { year: '2023', icon: '🔨', title: 'Built the Foundation', desc: 'Developed the core MERN stack platform with JWT auth, Razorpay integration, and campaign management in under 3 months.' },
  { year: '2024', icon: '🚀', title: 'Launch', desc: 'FundIt went live with its first 10 campaigns. Within weeks, the first medical emergency was fully funded — ₹3 lakhs in 48 hours.' },
  { year: '2024', icon: '📈', title: 'Growth', desc: 'Crossed 1,000 donors. Added category filters, fund usage tracking, and donor thank-you messaging for maximum transparency.' },
  { year: '2025', icon: '🌍', title: 'Impact at Scale', desc: 'Now supporting 6 categories: Medical, Education, Social, Environment, Animal Welfare, and Disaster Relief across India.' },
];

const techStack = [
  { icon: '⚛️', name: 'React.js', desc: 'Component-driven frontend SPA', color: '#61dafb' },
  { icon: '🟢', name: 'Node.js', desc: 'High-performance backend runtime', color: '#68a063' },
  { icon: '⚡', name: 'Express.js', desc: 'Fast, minimal REST API framework', color: '#000000' },
  { icon: '🍃', name: 'MongoDB', desc: 'Flexible NoSQL document database', color: '#47a248' },
  { icon: '🔑', name: 'JWT Auth', desc: 'Stateless, secure token auth', color: '#d63aff' },
  { icon: '💳', name: 'Razorpay', desc: 'India\'s trusted payment gateway', color: '#3395ff' },
  { icon: '🐳', name: 'Docker', desc: 'Containerized for any deployment', color: '#2496ed' },
  { icon: '⚙️', name: 'GitHub Actions', desc: 'Automated CI/CD pipeline', color: '#2088ff' },
];

const values = [
  { icon: '🔍', title: 'Radical Transparency', desc: 'Every rupee is tracked. Campaign creators must log how funds are used with our Fund Usage Tracker.' },
  { icon: '🔒', title: '100% Secure', desc: 'All payments go through Razorpay — India\'s PCI DSS compliant gateway. We never store card details.' },
  { icon: '🤝', title: 'Zero Hidden Fees', desc: 'We believe in fair crowdfunding. Our platform charges no hidden platform fees — more of your donation reaches the cause.' },
  { icon: '💙', title: 'Human-First Design', desc: 'Built by developers who care about people. Every UI decision prioritises clarity and trust over engagement tricks.' },
];

const AboutUs = () => {
  // Animate stats on scroll
  const sectionRef = useRef(null);

  useEffect(() => {
    document.title = 'About Us — FundIt';
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.about-animate').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">

      {/* ── Hero ──────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero-blob about-blob-1" />
        <div className="about-hero-blob about-blob-2" />
        <div className="container about-hero-content">
          <div className="about-hero-badge">🇮🇳 Made in India, for India</div>
          <h1 className="about-hero-title">
            Funding <span className="about-gradient-text">Hope.</span><br />
            One Campaign at a Time.
          </h1>
          <p className="about-hero-sub">
            FundIt is India's most transparent crowdfunding platform — connecting compassionate donors
            with real people who need support for medical emergencies, education, and social causes.
          </p>
          <div className="about-hero-actions">
            <Link to="/" className="btn btn-primary btn-lg">Explore Campaigns</Link>
            <Link to="/register" className="btn btn-outline-white btn-lg">Join FundIt</Link>
          </div>
        </div>
      </section>

      {/* ── Impact Stats ─────────────────────── */}
      <section className="about-stats-strip">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((s, i) => (
              <div className="about-stat-card about-animate" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="about-stat-icon">{s.icon}</div>
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────── */}
      <section className="about-section">
        <div className="container about-mission">
          <div className="about-mission-text about-animate">
            <div className="section-eyebrow">Our Mission</div>
            <h2>Transforming How India Gives</h2>
            <p>
              Millions of Indians face financial crises every year — a medical emergency, a child's education
              cut short, a natural disaster wiping out livelihoods. Yet traditional donation channels are
              opaque, slow, and riddled with friction.
            </p>
            <p>
              <strong>FundIt changes that.</strong> We leverage modern technology to create a frictionless, 
              transparent bridge between people who want to help and people who urgently need it.
              Real-time progress tracking, verified campaigns, and instant Razorpay payments mean 
              help arrives faster, and donors can see exactly where their money goes.
            </p>
            <div className="about-mission-highlights">
              {values.map((v, i) => (
                <div className="mission-highlight" key={i}>
                  <span className="mh-icon">{v.icon}</span>
                  <div>
                    <strong>{v.title}</strong>
                    <p>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-mission-visual about-animate">
            <div className="impact-visual-card">
              <div className="iv-header">🏥 Medical Emergency Funded</div>
              <div className="iv-campaign">
                <div className="iv-avatar">R</div>
                <div>
                  <div className="iv-name">Riya's Cancer Treatment</div>
                  <div className="iv-sub">Funded in 3 days by 142 donors</div>
                </div>
              </div>
              <div className="iv-progress-bar"><div className="iv-fill" style={{ width: '100%' }} /></div>
              <div className="iv-row">
                <span className="iv-raised">₹5,00,000</span>
                <span className="iv-pct">Goal Reached! ✅</span>
              </div>
              <div className="iv-donors">
                {['A', 'P', 'S', 'M', 'K'].map((l, i) => (
                  <div className="iv-donor-dot" key={i} style={{ zIndex: 5 - i }}>{l}</div>
                ))}
                <span className="iv-more">+137 donors</span>
              </div>
            </div>
            <div className="impact-visual-card iv-card-2">
              <div className="iv-header">🎓 Education Supported</div>
              <div className="iv-campaign">
                <div className="iv-avatar iv-green">A</div>
                <div>
                  <div className="iv-name">Arjun's Engineering Dream</div>
                  <div className="iv-sub">67% funded — still going!</div>
                </div>
              </div>
              <div className="iv-progress-bar"><div className="iv-fill iv-fill-green" style={{ width: '67%' }} /></div>
              <div className="iv-row">
                <span className="iv-raised iv-raised-green">₹1,34,000</span>
                <span className="iv-pct iv-pct-partial">67%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Journey Timeline ──────────────────── */}
      <section className="about-section about-section-dark">
        <div className="container">
          <div className="section-eyebrow light">Our Journey</div>
          <h2 className="section-title-white">From Idea to Impact</h2>
          <div className="about-timeline">
            {timeline.map((t, i) => (
              <div className="timeline-item about-animate" key={i}>
                <div className="timeline-left">
                  <div className="timeline-year">{t.year}</div>
                </div>
                <div className="timeline-connector">
                  <div className="timeline-dot">{t.icon}</div>
                  {i < timeline.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-right">
                  <h3 className="timeline-title">{t.title}</h3>
                  <p className="timeline-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────── */}
      <section className="about-section">
        <div className="container">
          <div className="section-eyebrow">Built With</div>
          <h2>Modern Technology for a Human Cause</h2>
          <p className="section-sub">
            FundIt is built on a production-grade MERN stack with containerized deployment,
            automated CI/CD, and enterprise-level payment security.
          </p>
          <div className="tech-grid">
            {techStack.map((t, i) => (
              <div className="tech-card about-animate" key={i} style={{ '--tech-color': t.color }}>
                <div className="tech-icon">{t.icon}</div>
                <div className="tech-name">{t.name}</div>
                <div className="tech-desc">{t.desc}</div>
              </div>
            ))}
          </div>
          <div className="arch-diagram">
            <div className="arch-layer arch-frontend">
              <span>⚛️ React Frontend</span>
              <span className="arch-arrow">→</span>
              <span>🟢 Node/Express API</span>
              <span className="arch-arrow">→</span>
              <span>🍃 MongoDB</span>
            </div>
            <div className="arch-layer arch-payments">
              <span>💳 Razorpay Payments</span>
              <span className="arch-arrow">→</span>
              <span>🔑 JWT Auth</span>
              <span className="arch-arrow">→</span>
              <span>🐳 Docker + CI/CD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of donors and campaign creators across India.</p>
          <div className="about-cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
