// Contact Us Page — Interactive contact form + details
import React, { useState } from 'react';
import './ContactUs.css';

const contactMethods = [
  {
    icon: '📧',
    title: 'Email Us',
    value: 'support@fundit.in',
    sub: 'We reply within 24 hours',
    color: '#3b82f6',
    href: 'mailto:support@fundit.in',
  },
  {
    icon: '📞',
    title: 'Call Us',
    value: '+91-9876543210',
    sub: 'Mon–Sat, 9 AM – 6 PM IST',
    color: '#059669',
    href: 'tel:+919876543210',
  },
  {
    icon: '📍',
    title: 'Visit Us',
    value: 'Chandigarh, India',
    sub: 'Sector 17, Chandigarh 160017',
    color: '#8b5cf6',
    href: 'https://maps.google.com/?q=Sector+17+Chandigarh',
  },
  {
    icon: '💬',
    title: 'Live Chat',
    value: 'Chat on WhatsApp',
    sub: 'Fastest response channel',
    color: '#25d366',
    href: 'https://wa.me/919876543210',
  },
];

const faqs = [
  { q: 'How do I start a campaign?', a: 'Register a free account, click "Start Campaign" in the navbar, fill in the campaign details, and submit. Your campaign goes live instantly.' },
  { q: 'Is my payment safe on FundIt?', a: 'Yes — all payments are processed via Razorpay, which is PCI DSS Level 1 compliant. FundIt never stores your card details.' },
  { q: 'What are the platform fees?', a: 'FundIt charges zero hidden platform fees. Razorpay charges a standard gateway fee of 2%, which is industry standard.' },
  { q: 'Can I track where my donation goes?', a: 'Absolutely! Campaign creators post Fund Usage updates showing exactly how the money is being spent — from hospital bills to receipts.' },
  { q: 'How do I become a campaign creator?', a: 'Any registered user can create a campaign. We recommend adding a real photo, a detailed story, and a realistic goal amount for best results.' },
  { q: 'How do I report a suspicious campaign?', a: 'Use the "Report" button on any campaign page, or email us at support@fundit.in. We review all reports within 24 hours.' },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1400);
  };

  return (
    <div className="contact-page">

      {/* ── Hero ──────────────────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero-bg" />
        <div className="container contact-hero-content">
          <div className="contact-hero-badge">💬 We're Here to Help</div>
          <h1>Get in <span className="contact-gradient">Touch</span></h1>
          <p>Have a question, concern, or just want to say hi? Our team is ready to help you within 24 hours.</p>
        </div>
      </section>

      {/* ── Contact Cards ─────────────────────── */}
      <section className="contact-cards-section">
        <div className="container">
          <div className="contact-cards-grid">
            {contactMethods.map((c, i) => (
              <a href={c.href} target="_blank" rel="noreferrer" className="contact-card" key={i} style={{ '--c-color': c.color }}>
                <div className="cc-icon-ring">{c.icon}</div>
                <div className="cc-title">{c.title}</div>
                <div className="cc-value">{c.value}</div>
                <div className="cc-sub">{c.sub}</div>
                <div className="cc-arrow">→</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ────────────────────────── */}
      <section className="contact-main-section">
        <div className="container contact-main-grid">

          {/* Contact Form */}
          <div className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p className="contact-form-sub">Fill out the form and we'll get back to you at the earliest.</p>

            {sent ? (
              <div className="contact-success">
                <div className="success-icon">✅</div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out, <strong>{form.name || 'there'}</strong>! We'll reply to your email within 24 hours.</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setSent(false)}>Send Another</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="cf-row">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input name="name" className="form-input" placeholder="Prashant Sharma" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select name="subject" className="form-input" value={form.subject} onChange={handleChange} required>
                    <option value="">Select a topic...</option>
                    <option>Campaign Support</option>
                    <option>Payment Issue</option>
                    <option>Account Help</option>
                    <option>Report a Campaign</option>
                    <option>Partnership Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea name="message" className="form-input contact-textarea" placeholder="Describe your query in detail..." value={form.message} onChange={handleChange} required rows={5} />
                </div>
                <button type="submit" className="contact-submit-btn" disabled={loading}>
                  {loading ? <><span className="spinner" /> Sending...</> : '🚀 Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Interactive Map + Info */}
          <div className="contact-sidebar">
            {/* Embedded Map */}
            <div className="contact-map-card">
              <div className="map-header">📍 Find Us</div>
              <div className="map-embed">
                <iframe
                  title="FundIt Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.0!2d76.7794!3d30.7333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0be66ef96b%3A0xa5ff67f9527319fe!2sSector%2017%2C%20Chandigarh!5e0!3m2!1sen!2sin!4v1"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="map-address">
                <div className="map-addr-row"><span>📍</span><span>Sector 17, Chandigarh 160017</span></div>
                <div className="map-addr-row"><span>🕐</span><span>Mon–Sat: 9:00 AM – 6:00 PM IST</span></div>
                <div className="map-addr-row"><span>📧</span><span>support@fundit.in</span></div>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-social-card">
              <div className="csc-title">Follow FundIt</div>
              <div className="csc-links">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="csc-link" style={{ '--sc': '#1877f2' }}>
                  <span>f</span> Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="csc-link" style={{ '--sc': '#e1306c' }}>
                  <span>📷</span> Instagram
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="csc-link" style={{ '--sc': '#000' }}>
                  <span>𝕏</span> X (Twitter)
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="csc-link" style={{ '--sc': '#0a66c2' }}>
                  <span>in</span> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────── */}
      <section className="contact-faq-section">
        <div className="container">
          <div className="faq-header">
            <div className="section-eyebrow">FAQ</div>
            <h2>Frequently Asked Questions</h2>
            <p className="section-sub">Can't find an answer? Email us at <a href="mailto:support@fundit.in">support@fundit.in</a></p>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className={`faq-item ${openFaq === i ? 'faq-open' : ''}`} key={i}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <span className="faq-chevron">{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactUs;
