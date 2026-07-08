'use client';

import { useEffect, useState } from 'react';
import GradientHero from './components/GradientHero';
import About from './components/About';
import StatsSection from './components/StatsSection';
import QuoteSection from './components/QuoteSection';
import CateringForm from './components/CateringForm';
import Footer from './components/Footer';
import ScrollToSection from './components/ScrollToSection';
import Marquee from './components/Marquee';
import SectionLabels from './components/SectionLabels';
import './styles/home.css';
import './styles/hero.css';

export default function Home() {
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsPageReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className={`home-page${isPageReady ? ' is-ready' : ''}`}>
      <ScrollToSection />
      <SectionLabels />
      <GradientHero />
      <Marquee />
      <About />
      <StatsSection />
      <QuoteSection />
      <CateringForm />
      <Footer />
    </main>
  );
}
