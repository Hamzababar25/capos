'use client';

import { useEffect, useRef, useState } from 'react';
import './featured-projects.css';

interface Project {
  id: number;
  title: string;
  titleDisplay: string;
  categories: string[];
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'CAPOS ORIGIN BLEND',
    titleDisplay: 'CAP<i>O</i>S <i>O</i>R<i>I</i>G<i>I</i>N ‣ BLEND',
    categories: ['Brand design', 'Packaging'],
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=1200&h=900&fit=crop&auto=format',
  },
  {
    id: 2,
    title: 'SINGLE ORIGIN SERIES',
    titleDisplay: 'S<i>I</i>NGLE <i>O</i>R<i>I</i>G<i>I</i>N ‣ SER<i>I</i>ES',
    categories: ['Identity', 'Photography'],
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=900&fit=crop&auto=format',
  },
  {
    id: 3,
    title: 'ROASTERY EXPERIENCE',
    titleDisplay: 'R<i>O</i>ASTERY ‣ EXPER<i>I</i>ENCE',
    categories: ['Spatial', 'Brand design'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=900&fit=crop&auto=format',
  },
  {
    id: 4,
    title: 'SEASONAL COLLECTION',
    titleDisplay: 'SEAS<i>O</i>NAL ‣ C<i>O</i>LLECT<i>I</i><i>O</i>N',
    categories: ['Packaging', 'Art direction'],
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=900&fit=crop&auto=format',
  },
];

export default function FeaturedProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionsRef.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="work" className="home-projects" ref={containerRef}>
      {/* Sticky sidebar */}
      <div className="home-projects-sticky container">
        <div className="home-projects-sidebar">
          <p className="home-projects-label t-text-sm">RECENT WORK</p>

          <div className="home-projects-titles">
            {projects.map((project, i) => (
              <div
                key={project.id}
                className={`home-projects-title-item ${
                  i === activeIndex
                    ? 'is-active'
                    : i < activeIndex
                    ? 'is-prev'
                    : 'is-next'
                }`}
              >
                <h3
                  className="t-h3"
                  dangerouslySetInnerHTML={{ __html: project.titleDisplay }}
                />
                <ul className="home-projects-categories t-h6">
                  {project.categories.map((cat) => (
                    <li key={cat}>{cat}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <a href="#work" className="home-projects-view-btn t-h6">
            <span className="home-projects-view-circle">→</span>
          </a>
        </div>
      </div>

      {/* Scrollable project sections */}
      <div className="home-projects-scroll">
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { sectionsRef.current[i] = el; }}
            className="home-project-section"
          >
            <div className="home-project-image-wrap">
              <img
                src={project.image}
                alt={project.title}
                className="home-project-image"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Discover button */}
      <div className="home-projects-discover container">
        <button className="btn-primary">
          <span>Discover all projects</span>
          <span>→</span>
        </button>
      </div>
    </section>
  );
}
