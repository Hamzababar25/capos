'use client';

import { useEffect, useState, useRef } from 'react';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import FeaturedProjects from './components/FeaturedProjects';
import About from './components/About';
import Footer from './components/Footer';
import './styles/home.css';

export default function Home() {
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    setIsPageReady(true);
  }, []);

  return (
    <main className={`home-page ${isPageReady ? 'is-ready' : ''}`}>
      <Navigation />
      <Hero />
      <FeaturedProjects />
      <About />
      <Footer />
    </main>
  );
}
