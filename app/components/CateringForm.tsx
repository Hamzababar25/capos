'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

// Exact pixel-match with the original CSS design
const inputBase = [
  'w-full',
  'rounded-[4px]',
  'border border-[rgba(200,146,42,0.18)]',
  'bg-[rgba(10,9,6,0.6)]',
  'px-4 py-[13px]',
  'text-[14px] text-[#f0ede6]',
  'font-[inherit]',
  'outline-none',
  'transition-[border-color,background]',
  'placeholder:text-[rgba(138,125,107,0.5)]',
  'focus:border-[#c8922a] focus:bg-[rgba(10,9,6,0.85)]',
  'appearance-none',
].join(' ');

const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c8922a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`;

export default function CateringForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [errors, setErrors] = useState<Partial<FormState>>({});

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const left  = section.querySelector('[data-cf="left"]');
    const right = section.querySelector('[data-cf="right"]');
    const line  = section.querySelector('[data-cf="rule"]');

    gsap.set([line, left, right], { opacity: 0, y: 50 });
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center', opacity: 1 });

    const trigger = ScrollTrigger.create({
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

    return () => trigger.kill();
  }, []);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim())     e.name      = 'Required';
    if (!form.email.trim())    e.email     = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim())    e.phone     = 'Required';
    if (!form.eventType)       e.eventType = 'Required';
    if (!form.eventDate)       e.eventDate = 'Required';
    if (!form.venue.trim())    e.venue     = 'Required';
    if (!form.guests)          e.guests    = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    setSendError('');
    try {
      const res = await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setSubmitted(true);
    } catch {
      setSendError('Something went wrong. Please try again or email us directly at hello@capos.coffee');
    } finally {
      setSending(false);
    }
  };

  const errorBorder = 'border-[rgba(220,80,60,0.6)]';

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#1e1a15] pb-14 sm:pb-[72px] lg:pb-[100px] pr-12"
    >
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute -right-[20%] top-0 h-[60vw] w-[60vw]"
        style={{ background: 'radial-gradient(circle, rgba(200,146,42,0.045) 0%, transparent 65%)' }}
        aria-hidden
      />

      {/* Animated amber rule — GSAP scaleX reveal */}
      <div
        data-cf="rule"
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, #c8922a 0%, rgba(200,146,42,0.12) 100%)', marginBottom: '80px' }}
        aria-hidden
      />

      <div
        className="relative z-10 grid grid-cols-1 gap-12 px-5 sm:px-6 md:grid-cols-[40%_60%] md:gap-[6vw] md:px-[3.9vw]"
      >
        {/* ── LEFT — info panel ── */}
        <div data-cf="left" className="flex flex-col opacity-0">

          <span
            className="mb-7 block font-bold uppercase tracking-[0.22em] text-[#c8922a]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            Catering Enquiries
          </span>

          <h2
            className="mb-7 font-bold uppercase leading-none tracking-[-0.03em] text-[#f0ede6]"
            style={{ fontSize: 'clamp(38px, 4.2vw, 68px)' }}
          >
            Bring<br />
            <span className="text-[#c8922a]">CAPOS</span><br />
            to your event.
          </h2>

          <p
            className="mb-10 max-w-[380px] leading-[1.75] text-[rgba(240,237,230,0.6)]"
            style={{ fontSize: 'max(1.04vw, 17px)' }}
          >
            We set up our specialty coffee station at your venue, from intimate
            corporate breakfasts to large-scale festivals.
            <br/> Every cup, crafted on-site.
          </p>

          <ul className="mb-9 flex list-none flex-col gap-[14px] p-0">
            <li className="flex items-center gap-3 text-[rgba(240,237,230,0.7)]" style={{ fontSize: 'max(0.9vw, 14px)' }}>
              <span className="w-[18px] shrink-0 text-[#c8922a]" aria-hidden>✉</span>
              <a href="mailto:info@capos.com" className="text-[#f0ede6] transition-colors duration-300 hover:text-[#c8922a]">
                info@capos.com
              </a>
            </li>
            <li className="flex items-center gap-3 text-[rgba(240,237,230,0.7)]" style={{ fontSize: 'max(0.9vw, 14px)' }}>
              <span className="w-[18px] shrink-0 text-[#c8922a]" aria-hidden>✆</span>
              <a href="tel:+442079460958" className="text-[#f0ede6] transition-colors duration-300 hover:text-[#c8922a]">
                +1 (732) 789-4792
              </a>
            </li>
            <li className="flex items-center gap-3 tracking-[0.06em] text-[rgba(240,237,230,0.55)]" style={{ fontSize: 'max(0.677vw, 11px)' }}>
              <span className="w-[16px] shrink-0 text-[#c8922a]" aria-hidden>◷</span>
              We will get to you as soon as possible.
            </li>
          </ul>

          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {['Corporate', 'Weddings', 'Festivals', 'Private Events'].map((t) => (
              <span
                key={t}
                className="rounded-sm border border-[rgba(200,146,42,0.28)] px-[14px] py-[6px] tracking-[0.14em] text-[rgba(200,146,42,0.75)]"
                style={{ fontSize: 'max(0.677vw, 10px)', fontWeight: 700, textTransform: 'uppercase' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT — form ── */}
        <div data-cf="right" className="opacity-0">
          {submitted ? (
            <div className="flex flex-col gap-5 rounded-md border border-[rgba(200,146,42,0.2)] bg-[rgba(10,9,6,0.4)] p-8 sm:p-10">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-[#c8922a] text-xl text-[#c8922a]"
                aria-hidden
              >
                ✓
              </span>
              <h3
                className="m-0 font-bold tracking-[-0.02em] text-[#f0ede6]"
                style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
              >
                Enquiry received.
              </h3>
              <p
                className="m-0 max-w-[420px] leading-[1.7] text-[rgba(240,237,230,0.6)]"
                style={{ fontSize: 'max(1.04vw, 17px)' }}
              >
                Thank you, {form.name.split(' ')[0]}. Our team will be in touch
                within 24 hours to discuss your event.
              </p>
              <button
                type="button"
                className="btn-primary mt-2 self-start"
                style={{ fontSize: 'max(0.677vw, 11px)', padding: '12px 24px', letterSpacing: '0.1em' }}
                onClick={() => { setForm(empty); setSubmitted(false); }}
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>

              {/* Row — Name + Phone */}
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <label
                    className="block font-bold uppercase tracking-[0.16em] text-[#8a7d6b]"
                    style={{ fontSize: 'max(0.677vw, 11px)' }}
                    htmlFor="cf-name"
                  >
                    Full Name
                  </label>
                  <input
                    id="cf-name" type="text"
                    className={`${inputBase}${errors.name ? ` ${errorBorder}` : ''}`}
                    placeholder="John Doe"
                    value={form.name} onChange={set('name')}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <span className="text-[11px] tracking-[0.06em] text-[rgba(220,100,80,0.9)]">{errors.name}</span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <label
                    className="block font-bold uppercase tracking-[0.16em] text-[#8a7d6b]"
                    style={{ fontSize: 'max(0.677vw, 11px)' }}
                    htmlFor="cf-phone"
                  >
                    Phone
                  </label>
                  <input
                    id="cf-phone" type="tel"
                    className={`${inputBase}${errors.phone ? ` ${errorBorder}` : ''}`}
                    placeholder="+11 12 44622"
                    value={form.phone} onChange={set('phone')}
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <span className="text-[11px] tracking-[0.06em] text-[rgba(220,100,80,0.9)]">{errors.phone}</span>
                  )}
                </div>
              </div>

              {/* Row — Email */}
              <div className="flex flex-col gap-2">
                <label
                  className="block font-bold uppercase tracking-[0.16em] text-[#8a7d6b]"
                  style={{ fontSize: 'max(0.677vw, 11px)' }}
                  htmlFor="cf-email"
                >
                  Email Address
                </label>
                <input
                  id="cf-email" type="email"
                  className={`${inputBase}${errors.email ? ` ${errorBorder}` : ''}`}
                  placeholder="your@example.com"
                  value={form.email} onChange={set('email')}
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="text-[11px] tracking-[0.06em] text-[rgba(220,100,80,0.9)]">{errors.email}</span>
                )}
              </div>

              {/* Row — Event Type + Guests */}
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <label
                    className="block font-bold uppercase tracking-[0.16em] text-[#8a7d6b]"
                    style={{ fontSize: 'max(0.677vw, 11px)' }}
                    htmlFor="cf-type"
                  >
                    Event Type
                  </label>
                  <select
                    id="cf-type"
                    className={`${inputBase} cursor-pointer pr-10${errors.eventType ? ` ${errorBorder}` : ''}`}
                    style={{
                      backgroundImage: selectArrow,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      backgroundSize: '12px 8px',
                    }}
                    value={form.eventType} onChange={set('eventType')}
                  >
                    <option value="" style={{ background: '#1e1a15', color: '#f0ede6' }}>Select type</option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t} style={{ background: '#1e1a15', color: '#f0ede6' }}>{t}</option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <span className="text-[11px] tracking-[0.06em] text-[rgba(220,100,80,0.9)]">{errors.eventType}</span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <label
                    className="block font-bold uppercase tracking-[0.16em] text-[#8a7d6b]"
                    style={{ fontSize: 'max(0.677vw, 11px)' }}
                    htmlFor="cf-guests"
                  >
                    Expected Guests
                  </label>
                  <select
                    id="cf-guests"
                    className={`${inputBase} cursor-pointer pr-10${errors.guests ? ` ${errorBorder}` : ''}`}
                    style={{
                      backgroundImage: selectArrow,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      backgroundSize: '12px 8px',
                    }}
                    value={form.guests} onChange={set('guests')}
                  >
                    <option value="" style={{ background: '#1e1a15', color: '#f0ede6' }}>Select range</option>
                    {guestCounts.map((g) => (
                      <option key={g} value={g} style={{ background: '#1e1a15', color: '#f0ede6' }}>{g}</option>
                    ))}
                  </select>
                  {errors.guests && (
                    <span className="text-[11px] tracking-[0.06em] text-[rgba(220,100,80,0.9)]">{errors.guests}</span>
                  )}
                </div>
              </div>

              {/* Row — Date + Venue */}
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <label
                    className="block font-bold uppercase tracking-[0.16em] text-[#8a7d6b]"
                    style={{ fontSize: 'max(0.677vw, 11px)' }}
                    htmlFor="cf-date"
                  >
                    Event Date
                  </label>
                  <input
                    id="cf-date" type="date"
                    className={`${inputBase} [color-scheme:dark]${errors.eventDate ? ` ${errorBorder}` : ''}`}
                    value={form.eventDate} onChange={set('eventDate')}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.eventDate && (
                    <span className="text-[11px] tracking-[0.06em] text-[rgba(220,100,80,0.9)]">{errors.eventDate}</span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <label
                    className="block font-bold uppercase tracking-[0.16em] text-[#8a7d6b]"
                    style={{ fontSize: 'max(0.677vw, 11px)' }}
                    htmlFor="cf-venue"
                  >
                    Venue / City
                  </label>
                  <input
                    id="cf-venue" type="text"
                    className={`${inputBase}${errors.venue ? ` ${errorBorder}` : ''}`}
                    placeholder="e.g. Brooklyn, NY"
                    value={form.venue} onChange={set('venue')}
                  />
                  {errors.venue && (
                    <span className="text-[11px] tracking-[0.06em] text-[rgba(220,100,80,0.9)]">{errors.venue}</span>
                  )}
                </div>
              </div>

              {/* Row — Notes */}
              <div className="flex flex-col gap-2">
                <label
                  className="block font-bold uppercase tracking-[0.16em] text-[#8a7d6b]"
                  style={{ fontSize: 'max(0.677vw, 11px)' }}
                  htmlFor="cf-notes"
                >
                  Additional Details{' '}
                  <span className="font-normal normal-case tracking-normal text-[rgba(138,125,107,0.5)]">(optional)</span>
                </label>
                <textarea
                  id="cf-notes"
                  className={`${inputBase} min-h-[110px] resize-y leading-[1.6]`}
                  placeholder="Tell us about your event, specific requirements, or any questions…"
                  rows={4}
                  value={form.notes} onChange={set('notes')}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="btn-primary mt-2 self-start"
                style={{ padding: '14px 32px', fontSize: 'max(0.677vw, 12px)', letterSpacing: '0.12em', opacity: sending ? 0.6 : 1 }}
              >
                {sending ? 'Sending…' : 'Send Enquiry →'}
              </button>

              {sendError && (
                <p style={{ marginTop: 12, fontSize: 13, color: 'rgba(220,80,60,0.9)', lineHeight: 1.6 }}>
                  {sendError}
                </p>
              )}

            </form>
          )}
        </div>
      </div>
    </section>
  );
}
