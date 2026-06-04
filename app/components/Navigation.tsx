'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLLIElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const items = menuItemsRef.current.filter(Boolean);

    if (isMenuOpen) {
      // Kill previous timeline
      tlRef.current?.kill();

      gsap.set(overlay, { display: 'flex' });
      gsap.set(items, { y: 60, opacity: 0 });

      tlRef.current = gsap.timeline();
      tlRef.current
        .to(overlay, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.7,
          ease: 'expo.inOut',
        })
        .to(
          items,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'expo.out',
          },
          '-=0.3'
        );
    } else {
      tlRef.current?.kill();

      tlRef.current = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
        },
      });
      tlRef.current
        .to(items, {
          y: -30,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.in',
        })
        .to(
          overlay,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.6,
            ease: 'expo.inOut',
          },
          '-=0.15'
        );
    }
  }, [isMenuOpen]);

  // Initialize overlay state
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.set(overlay, { clipPath: 'inset(0% 0% 100% 0%)', display: 'none' });
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`c-header${isMenuOpen ? ' is-open' : ''}`}>
      <div className="c-header-inner">
        <Link href="/" className="c-header-logo">
          <span className="c-header-logo-name">CAPOS</span>
          <span className="c-header-logo-city t-h6">London</span>
        </Link>

        <nav className="c-header-nav">
          <ul className="c-header-nav-list t-h6">
            {['Home', 'Work', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                  className="c-header-nav-link"
                >
                  <span className="c-header-nav-link-text">{item}</span>
                  <span className="c-header-nav-link-line" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="c-header-clocks t-h6">
          <span className="c-header-clock is-active">{londonTime} LDN</span>
          <span className="c-header-clock">{tokyoTime} TKY</span>
        </div>

        <button
          className="c-header-burger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="c-header-burger-label t-h6">Menu</span>
          <span className="c-header-burger-icon">
            <span className="c-header-burger-line" />
            <span className="c-header-burger-line" />
            <span className="c-header-burger-line" />
          </span>
        </button>
      </div>

      {/* Mobile / Fullscreen overlay */}
      <div className="c-header-overlay" ref={overlayRef}>
        <nav className="c-header-overlay-nav">
          <ul>
            {['Home', 'Work', 'About', 'Contact'].map((item, i) => (
              <li
                key={item}
                ref={(el) => {
                  if (el) menuItemsRef.current[i] = el;
                }}
              >
                <Link
                  href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                  onClick={closeMenu}
                >
                  <span className="c-header-overlay-number">0{i + 1}</span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
