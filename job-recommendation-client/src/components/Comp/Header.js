import React, { useState } from 'react';
import 'job-recommendation-client/src/css/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'About', href: 'https://portfolio-shahid-shaikh.netlify.app/' },
    { name: 'Contact', href: 'https://portfolio-shahid-shaikh.netlify.app/' },
    { name: 'Check ATS', href: '/components/UnderWorkingPage.js' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-text">
          <h1>ZenVue</h1>
          <p className="tagline">Discover jobs tailored to your skills</p>
        </div>
        <nav className="header-nav desktop-nav">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="nav-link">
              {item.name}
            </a>
          ))}
        </nav>
        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="hamburger-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      <nav className={`header-nav mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;