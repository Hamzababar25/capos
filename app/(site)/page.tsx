'use client';

import { useEffect, useState } from 'react';
import GradientHero from '@/app/components/GradientHero';
import About from '@/app/components/About';
import StatsSection from '@/app/components/StatsSection';
import QuoteSection from '@/app/components/QuoteSection';
import CateringForm from '@/app/components/CateringForm';
import Footer from '@/app/components/Footer';
import ScrollToSection from '@/app/components/ScrollToSection';
import Marquee from '@/app/components/Marquee';
import SectionLabels from '@/app/components/SectionLabels';
import './page.css';

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
