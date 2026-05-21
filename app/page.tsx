'use client';

import { useEffect, useState } from 'react';
import GradientHero from './components/GradientHero';
import FeaturedProjects from './components/FeaturedProjects';
import About from './components/About';
import Footer from './components/Footer';
import './styles/home.css';

export default function Home() {
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsPageReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className={`home-page${isPageReady ? ' is-ready' : ''}`}>
      <GradientHero />
      <About />
      <FeaturedProjects />
      <Footer />
    </main>
  );
}
