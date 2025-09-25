import React from 'react';
import 'job-recommendation-client/src/css/Footer.css';

const Footer = () => {
  const footerLinks = [
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Support', href: '#support' },
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/shahid-shaikh-68993a214/', icon: 'M16 2H8a6 6 0 00-6 6v8a6 6 0 006 6h8a6 6 0 006-6V8a6 6 0 00-6-6zm-1 14h-2v-5h2v5zm-1-6a1 1 0 110-2 1 1 0 010 2zM10 16H8v-5h2v5zm-1-6a1 1 0 110-2 1 1 0 010 2z' },
    { name: 'GitHub', href: 'https://github.com/Shahid9370', icon: 'M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.49 2.29 1.06 2.85.81.09-.62.35-1.06.64-1.3-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.5A10 10 0 0022 12 10 10 0 0012 2z' },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <p>© 2025 <strong>ZenVue</strong>. All rights reserved.</p>
        </div>
        <nav className="footer-links">
          {footerLinks.map((link) => (
            <a key={link.name} href={link.href} className="footer-link">
              {link.name}
            </a>
          ))}
        </nav>
        <div className="footer-social">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
            >
              <svg
                className="social-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={link.icon} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;