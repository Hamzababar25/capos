'use client';

import { useState, useEffect } from 'react';
import './navigation.css';

function useClock(timezone: string) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [timezone]);

  return time;
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const londonTime = useClock('Europe/London');
  const tokyoTime = useClock('Asia/Tokyo');

  return (
    <header className={`c-header${isMenuOpen ? ' is-open' : ''}`}>
      <div className="c-header-inner container">
        {/* Logo */}
        <a href="/" className="c-header-logo">
          <span className="c-header-logo-name">CAPOS</span>
          <span className="c-header-logo-city t-h6">London</span>
        </a>

        {/* Desktop nav */}
        <nav className="c-header-nav">
          <ul className="c-header-nav-list t-h6">
            <li><a href="/" className="c-header-nav-link">Home</a></li>
            <li><a href="#work" className="c-header-nav-link">Work</a></li>
            <li><a href="#about" className="c-header-nav-link">About</a></li>
            <li><a href="#contact" className="c-header-nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* Clocks */}
        <div className="c-header-clocks t-h6">
          <span className="c-header-clock is-active">{londonTime} LDN</span>
          <span className="c-header-clock">{tokyoTime} TKY</span>
        </div>

        {/* Burger */}
        <button
          className="c-header-burger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="c-header-burger-label t-h6">Menu</span>
          <span className="c-header-burger-icon">
            <span className="c-header-burger-line" />
            <span className="c-header-burger-line" />
            <span className="c-header-burger-line" />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div className="c-header-overlay">
        <nav className="c-header-overlay-nav">
          <ul>
            <li><a href="/" onClick={() => setIsMenuOpen(false)}>Home</a></li>
            <li><a href="#work" onClick={() => setIsMenuOpen(false)}>Work</a></li>
            <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
            <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
