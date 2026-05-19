'use client';

import { useState, useRef, useEffect } from 'react';
import '../styles/featured-projects.css';

const projects = [
  {
    id: 1,
    title: 'Ethiopian Highlands',
    category: 'Single Origin',
    description: 'Bright notes of blueberry with floral undertones',
    image: 'linear-gradient(135deg, #A0826D 0%, #D4AF37 50%, #6F4E37 100%)',
  },
  {
    id: 2,
    title: 'Columbian Deep Roast',
    category: 'Premium Blend',
    description: 'Rich chocolate and nut flavors with smooth finish',
    image: 'linear-gradient(135deg, #6F4E37 0%, #2C1810 50%, #3E2723 100%)',
  },
  {
    id: 3,
    title: 'Kenyan AA',
    category: 'Single Origin',
    description: 'Complex berry notes with subtle citrus brightness',
    image: 'linear-gradient(135deg, #D4AF37 0%, #C9A961 50%, #A0826D 100%)',
  },
  {
    id: 4,
    title: 'Sumatra Mandheling',
    category: 'Single Origin',
    description: 'Full-bodied with earthy spice and herbal notes',
    image: 'linear-gradient(135deg, #3E2723 0%, #6F4E37 50%, #2C1810 100%)',
  },
];

export default function FeaturedProjects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  return (
    <section id="featured" className="featured-projects">
      <div className="featured-header container">
        <div>
          <h2>Featured Collections</h2>
          <p className="text-sm">Our most beloved blends</p>
        </div>
      </div>

      <div className="carousel-wrapper">
        <div className="carousel" ref={carouselRef}>
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`carousel-slide ${index === currentIndex ? 'is-active' : ''}`}
            >
              <div className="project-card">
                <div
                  className="project-image"
                  style={{ background: project.image }}
                >
                  <div className="project-overlay"></div>
                </div>

                <div className="project-info">
                  <div className="project-meta">
                    <span className="category">{project.category}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <a href="#" className="link-primary">View Details</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-controls">
          <button
            className="carousel-btn carousel-prev"
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            className="carousel-btn carousel-next"
            onClick={handleNext}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        <div className="carousel-indicators">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'is-active' : ''}`}
              onClick={() => {
                setIsAutoPlay(false);
                setCurrentIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
