'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import './navigation.css';

function useClock(timezone: string) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
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
  const [isScrolled, setIsScrolled] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  /**
   * Navigate to a section on the home page.
   * - If already on home → smooth scroll, no URL change
   * - If on another page → store target in sessionStorage, navigate to /
   *   (ScrollToSection component on home page picks it up)
   */
  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      sessionStorage.setItem('scrollTo', sectionId);
      router.push('/');
    }
  };

  const ldnTime = useClock('Europe/London');
  const nyTime  = useClock('America/New_York');
  const khiTime = useClock('Asia/Karachi');
  const tkyTime = useClock('Asia/Tokyo');

  const overlayRef   = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLLIElement[]>([]);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const items = menuItemsRef.current.filter(Boolean);

    if (isMenuOpen) {
      tlRef.current?.kill();
      gsap.set(overlay, { display: 'flex' });
      gsap.set(items, { y: 60, opacity: 0 });

      tlRef.current = gsap.timeline()
        .to(overlay, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.65, ease: 'expo.inOut' })
        .to(items,   { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'expo.out' }, '-=0.28');
    } else {
      tlRef.current?.kill();
      tlRef.current = gsap.timeline({
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      })
        .to(items,   { y: -30, opacity: 0, duration: 0.35, stagger: 0.05, ease: 'power2.in' })
        .to(overlay, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.55, ease: 'expo.inOut' }, '-=0.12');
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.set(overlay, { clipPath: 'inset(0% 0% 100% 0%)', display: 'none' });
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = ['Catering', 'About', 'Contact'];

  const overlayItems: { label: string; href?: string; section?: string }[] = [
    { label: 'Home',            href: '/'          },
    { label: 'Catering',        href: '/catering'  },
    { label: 'Moments',         href: '/moments'   },
    { label: 'About',           section: 'about'   },
    { label: 'FAQ',             href: '/faq'       },
    { label: 'Book Your Event', section: 'booking' },
  ];

  return (
    <header className={`c-header${isMenuOpen ? ' is-open' : ''}${isScrolled ? ' is-scrolled' : ''}`}>
      <div className="c-header-inner">
        {/* Logo */}
        <Link href="/" className="c-header-logo">
          <Image
            src="/logo.png"
            alt="Capos logo"
            width={596}
            height={627}
            className="c-header-logo-mark"
            priority
          />
          <span className="c-header-logo-name">CAPOS</span>
          <span className="c-header-logo-city t-h6">Coffee</span>
        </Link>

        {/* Desktop nav */}
        <nav className="c-header-nav" aria-label="Primary">
          <ul className="c-header-nav-list t-h6">
            {navLinks.map((item) => {
              const isCatering    = item === 'Catering';
              const isActivePage  = isCatering && pathname === '/catering';
              const classes       = `c-header-nav-link${isActivePage ? ' is-active' : ''}`;

              return (
                <li key={item}>
                  {isCatering ? (
                    <Link href="/catering" className={classes} aria-current={isActivePage ? 'page' : undefined}>
                      <span className="c-header-nav-link-text">{item}</span>
                      <span className="c-header-nav-link-line" aria-hidden="true" />
                    </Link>
                  ) : (
                    <a
                      href="#"
                      className="c-header-nav-link"
                      onClick={scrollToSection(item.toLowerCase())}
                    >
                      <span className="c-header-nav-link-text">{item}</span>
                      <span className="c-header-nav-link-line" aria-hidden="true" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 4-city clocks — compact in header */}
        <div className="c-header-clocks t-h6">
          <span className="c-header-clock is-active">{nyTime} <em>NYC</em></span>
          <span className="c-header-clock">{khiTime} <em>KHI</em></span>
        </div>

        {/* Booking CTA */}
        <a
          href="#"
          className="c-header-cta btn-primary"
          onClick={scrollToSection('booking')}
        >
          Book Your Event
        </a>

        {/* Burger — label changed so it doesn't clash with "Catering" nav link */}
        <button
          className="c-header-burger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="c-header-burger-label t-h6">
            {isMenuOpen ? 'Close' : 'Open'}
          </span>
          <span className="c-header-burger-icon">
            <span className="c-header-burger-line" />
            <span className="c-header-burger-line" />
            <span className="c-header-burger-line" />
          </span>
        </button>
      </div>

      {/* Fullscreen overlay */}
      <div className="c-header-overlay" ref={overlayRef}>
        {/* All 4 cities */}
        <div className="c-header-overlay-time t-h6">
           {nyTime} NJ &nbsp;·&nbsp; {khiTime} KHI &nbsp;·&nbsp; 
        </div>

        <nav className="c-header-overlay-nav">
          <ul>
            {overlayItems.map(({ label, href, section }, i) => (
              <li
                key={label}
                ref={(el) => { if (el) menuItemsRef.current[i] = el; }}
                className={label === 'Book Your Event' ? 'is-cta-item' : ''}
              >
                {section ? (
                  <a href="#" onClick={scrollToSection(section)}>
                    <span className="c-header-overlay-number">0{i + 1}</span>
                    {label}
                  </a>
                ) : (
                  <Link href={href!} onClick={closeMenu}>
                    <span className="c-header-overlay-number">0{i + 1}</span>
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
