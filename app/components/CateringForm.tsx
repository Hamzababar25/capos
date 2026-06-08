'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './catering-form.css';

gsap.registerPlugin(ScrollTrigger);

const eventTypes = [
  'Corporate Event',
  'Wedding',
  'Private Party',
  'Festival / Market',
  'Product Launch',
  'Conference',
  'Other',
];

const guestCounts = [
  'Under 50',
  '50 – 150',
  '150 – 300',
  '300 – 500',
  '500+',
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venue: string;
  guests: string;
  notes: string;
}

const empty: FormState = {
  name: '', email: '', phone: '',
  eventType: '', eventDate: '', venue: '', guests: '', notes: '',
};

export default function CateringForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm]         = useState<FormState>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]       = useState<Partial<FormState>>({});

  // Scroll-triggered reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const left  = section.querySelector('.cf-left');
    const right = section.querySelector('.cf-right');
    const line  = section.querySelector('.cf-rule');

    gsap.set([line, left, right], { opacity: 0, y: 50 });
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center', opacity: 1 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.timeline()
          .to(line,  { scaleX: 1, duration: 1.1, ease: 'expo.out' })
          .to(left,  { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, '-=0.6')
          .to(right, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, '-=0.7');
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim())      e.name      = 'Required';
    if (!form.email.trim())     e.email     = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim())     e.phone     = 'Required';
    if (!form.eventType)        e.eventType = 'Required';
    if (!form.eventDate)        e.eventDate = 'Required';
    if (!form.venue.trim())     e.venue     = 'Required';
    if (!form.guests)           e.guests    = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <section id="booking" className="cf-section" ref={sectionRef}>
      {/* Top rule */}
      <div className="cf-rule" aria-hidden="true" />

      <div className="cf-inner">
        {/* ── LEFT — info ── */}
        <div className="cf-left">
          <span className="cf-eyebrow t-h6">Catering Enquiries</span>

          <h2 className="cf-heading">
            Bring<br />
            <span className="cf-heading-accent">CAPOS</span><br />
            to your event.
          </h2>

          <p className="cf-desc t-text-lg">
            We set up our specialty coffee station at your venue — from intimate
            corporate breakfasts to large-scale festivals. Every cup, crafted on-site.
          </p>

          <ul className="cf-contact-list">
            <li className="cf-contact-item">
              <span className="cf-contact-icon" aria-hidden="true">✉</span>
              <a href="mailto:hello@capos.coffee" className="cf-contact-link">
                hello@capos.coffee
              </a>
            </li>
            <li className="cf-contact-item">
              <span className="cf-contact-icon" aria-hidden="true">✆</span>
              <a href="tel:+442079460958" className="cf-contact-link">
                +44 20 7946 0958
              </a>
            </li>
            <li className="cf-contact-item cf-contact-note">
              <span className="cf-contact-icon" aria-hidden="true">◷</span>
              We respond within 24 hours.
            </li>
          </ul>

          <div className="cf-tags">
            {['Corporate', 'Weddings', 'Festivals', 'Private Events'].map((t) => (
              <span key={t} className="cf-tag t-h6">{t}</span>
            ))}
          </div>
        </div>

        {/* ── RIGHT — form ── */}
        <div className="cf-right">
          {submitted ? (
            <div className="cf-success">
              <span className="cf-success-icon" aria-hidden="true">✓</span>
              <h3 className="cf-success-title">Enquiry received.</h3>
              <p className="cf-success-body t-text-lg">
                Thank you, {form.name.split(' ')[0]}. Our team will be in touch
                within 24 hours to discuss your event.
              </p>
              <button
                className="btn-primary cf-reset-btn"
                onClick={() => { setForm(empty); setSubmitted(false); }}
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form className="cf-form" onSubmit={handleSubmit} noValidate>
              {/* Row 1 */}
              <div className="cf-row cf-row--2">
                <div className={`cf-field${errors.name ? ' has-error' : ''}`}>
                  <label className="cf-label t-h6" htmlFor="cf-name">Full Name</label>
                  <input
                    id="cf-name" type="text" className="cf-input"
                    placeholder="Ali Hassan"
                    value={form.name} onChange={set('name')}
                    autoComplete="name"
                  />
                  {errors.name && <span className="cf-error">{errors.name}</span>}
                </div>

                <div className={`cf-field${errors.phone ? ' has-error' : ''}`}>
                  <label className="cf-label t-h6" htmlFor="cf-phone">Phone</label>
                  <input
                    id="cf-phone" type="tel" className="cf-input"
                    placeholder="+44 7700 000000"
                    value={form.phone} onChange={set('phone')}
                    autoComplete="tel"
                  />
                  {errors.phone && <span className="cf-error">{errors.phone}</span>}
                </div>
              </div>

              {/* Row 2 */}
              <div className="cf-row">
                <div className={`cf-field${errors.email ? ' has-error' : ''}`}>
                  <label className="cf-label t-h6" htmlFor="cf-email">Email Address</label>
                  <input
                    id="cf-email" type="email" className="cf-input"
                    placeholder="you@example.com"
                    value={form.email} onChange={set('email')}
                    autoComplete="email"
                  />
                  {errors.email && <span className="cf-error">{errors.email}</span>}
                </div>
              </div>

              {/* Row 3 */}
              <div className="cf-row cf-row--2">
                <div className={`cf-field${errors.eventType ? ' has-error' : ''}`}>
                  <label className="cf-label t-h6" htmlFor="cf-type">Event Type</label>
                  <select
                    id="cf-type" className="cf-input cf-select"
                    value={form.eventType} onChange={set('eventType')}
                  >
                    <option value="">Select type</option>
                    {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.eventType && <span className="cf-error">{errors.eventType}</span>}
                </div>

                <div className={`cf-field${errors.guests ? ' has-error' : ''}`}>
                  <label className="cf-label t-h6" htmlFor="cf-guests">Expected Guests</label>
                  <select
                    id="cf-guests" className="cf-input cf-select"
                    value={form.guests} onChange={set('guests')}
                  >
                    <option value="">Select range</option>
                    {guestCounts.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.guests && <span className="cf-error">{errors.guests}</span>}
                </div>
              </div>

              {/* Row 4 */}
              <div className="cf-row cf-row--2">
                <div className={`cf-field${errors.eventDate ? ' has-error' : ''}`}>
                  <label className="cf-label t-h6" htmlFor="cf-date">Event Date</label>
                  <input
                    id="cf-date" type="date" className="cf-input cf-date"
                    value={form.eventDate} onChange={set('eventDate')}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.eventDate && <span className="cf-error">{errors.eventDate}</span>}
                </div>

                <div className={`cf-field${errors.venue ? ' has-error' : ''}`}>
                  <label className="cf-label t-h6" htmlFor="cf-venue">Venue / City</label>
                  <input
                    id="cf-venue" type="text" className="cf-input"
                    placeholder="e.g. London, Manchester"
                    value={form.venue} onChange={set('venue')}
                  />
                  {errors.venue && <span className="cf-error">{errors.venue}</span>}
                </div>
              </div>

              {/* Notes */}
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label t-h6" htmlFor="cf-notes">
                    Additional Details <span className="cf-optional">(optional)</span>
                  </label>
                  <textarea
                    id="cf-notes" className="cf-input cf-textarea"
                    placeholder="Tell us about your event, specific requirements, or any questions…"
                    rows={4}
                    value={form.notes} onChange={set('notes')}
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="cf-submit btn-primary">
                Send Enquiry →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
