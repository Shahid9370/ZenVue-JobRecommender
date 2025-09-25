import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navItems = [
    { name: 'Home', href: '/' },
    {
      name: 'Jobs',
      href: '#',
      dropdown: [
        { name: 'Search Jobs', href: '/search-jobs' },
        { name: 'My Recommendations', href: '/my-recommendations' },
      ],
    },
    {
      name: 'ATS Tools',
      href: '#',
      dropdown: [
        { name: 'Resume Generator', href: '/resume-generator' },
        { name: 'ATS Checker', href: '/ats-checker' },
      ],
    },
    {
      name: 'Career Tools',
      href: '#',
      dropdown: [
        { name: 'Interview Prep', href: '/interview-prep' },
        { name: 'Skill Gap Analysis', href: '/skill-gap' },
      ],
    },
    { name: 'About Me', href: 'https://portfolio-shahid-shaikh.netlify.app/about' },
    { name: 'Portfolio', href: 'https://portfolio-shahid-shaikh.netlify.app' },
  ];

  const handleDropdownToggle = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-text">
          <h1><Link to="/">ZenVue</Link></h1>
          <p className="tagline">Discover jobs tailored to your skills</p>
        </div>
        <nav className="header-nav desktop-nav">
          {navItems.map((item) => (
            <div key={item.name} className="nav-item" onClick={() => item.dropdown && handleDropdownToggle(item.name)}>
              <a href={item.href} className="nav-link" onClick={(e) => item.dropdown && e.preventDefault()}>
                {item.name} {item.dropdown && <span className="dropdown-indicator">▼</span>}
              </a>
              {item.dropdown && activeDropdown === item.name && (
                <div className="dropdown-menu">
                  {item.dropdown.map((subItem) => (
                    <a key={subItem.name} href={subItem.href} className="dropdown-link">{subItem.name}</a>
                  ))}
                </div>
              )}
            </div>
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
          <div key={item.name} className={`nav-item ${activeDropdown === item.name ? 'active' : ''}`}>
            <a
              href={item.href}
              className="nav-link"
              onClick={(e) => {
                if (item.dropdown) {
                  e.preventDefault();
                  handleDropdownToggle(item.name);
                }
              }}
            >
              {item.name} {item.dropdown && <span className="dropdown-indicator">▼</span>}
            </a>
            {item.dropdown && activeDropdown === item.name && (
              <div className="dropdown-menu mobile">
                {item.dropdown.map((subItem) => (
                  <a
                    key={subItem.name}
                    href={subItem.href}
                    className="dropdown-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {subItem.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Header;