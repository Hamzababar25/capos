'use client';

import { useState } from 'react';
import '../styles/navigation.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`navigation ${isMenuOpen ? 'is-open' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <h1>CAPOS</h1>
          <p>Coffee Collective</p>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className="nav-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#featured">Our Blends</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
