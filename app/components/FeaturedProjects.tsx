'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  offset?: number;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'NKORA COFFEE',
    category: 'Brand design',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=1200&h=900&fit=crop',
    offset: 0,
  },
  {
    id: 2,
    title: 'PARIS WORLD CHAMPIONSHIPS',
    category: 'Spatial Design',
    image: 'https://images.unsplash.com/photo-1549887534-7edbc0ec9fb5?w=1200&h=900&fit=crop',
    offset: 150,
  },
  {
    id: 3,
    title: 'FINISH LINE CAFE',
    category: 'Spatial Design',
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=900&fit=crop',
    offset: 0,
  },
  {
    id: 4,
    title: 'KOREAN FRIED CHICKEN',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1565299624946-b28cf4ba199e?w=1200&h=900&fit=crop',
    offset: 150,
  },
];

export default function FeaturedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      if (!item) return;

      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top center',
          end: 'center center',
          scrub: 1,
          markers: false,
        },
        opacity: 1,
        y: 0,
        duration: 1,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="projects-section">
      <div className="projects-container">
        <h2 className="projects-title">Recent Work</h2>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="project-item"
              style={{ transform: 'translateY(40px)', opacity: 0 }}
            >
              <div className="project-image-wrapper">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                />
                <div className="project-overlay" />
              </div>

              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category">{project.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="projects-footer">
          <button className="discover-btn">
            Discover all projects
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
