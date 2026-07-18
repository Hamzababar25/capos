'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CupFlourish, RoseFlourish } from './Flourishes';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ─────────────────────────────────────────── */

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

const budgetRanges = [
  'Under $500',
  '$500 – $1,000',
  '$1,000 – $2,500',
  '$2,500 – $5,000',
  '$5,000+',
  'To be discussed',
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venue: string;
  guests: string;
  budget: string;
  notes: string;
}

const empty: FormState = {
  name: '', email: '', phone: '',
  eventType: '', eventDate: '', venue: '', guests: '', budget: '', notes: '',
};

/* ── Step configuration ──────────────────────────── */

const steps = [
  { id: 1, label: 'The event',    prompt: 'Tell us about the occasion.' },
  { id: 2, label: 'The details',  prompt: 'When and where?' },
  { id: 3, label: 'Your contact', prompt: 'How do we reach you?' },
] as const;

type StepIdx = 0 | 1 | 2;

/* ── Shared input styles ─────────────────────────── */

const inputBase = [
  'w-full',
  'rounded-[4px]',
  'border border-[rgba(151,29,19,0.18)]',
  'bg-[rgba(8,13,10,0.6)]',
  'px-4 py-[14px]',
  'text-[14px] text-white',
  'font-[inherit]',
  'outline-none',
  'transition-all duration-300 ease-out',
  'placeholder:text-[rgba(138,125,107,0.5)]',
  'focus:border-[#971d13] focus:bg-[rgba(8,13,10,0.9)]',
  'focus:shadow-[0_0_0_3px_rgba(151,29,19,0.12)]',
  'hover:border-[rgba(151,29,19,0.3)]',
  'appearance-none',
].join(' ');

const errorBorder = 'border-[rgba(220,80,60,0.6)]';

const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23971d13' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`;

const selectStyle = {
  backgroundImage: selectArrow,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 14px center',
  backgroundSize: '12px 8px',
};

/* ── Small building blocks ───────────────────────── */

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-bold uppercase tracking-[0.16em] text-[#7a8a84]"
      style={{ fontSize: 'max(0.677vw, 11px)' }}
    >
      {children}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? (
    <span className="mt-1 block text-[11px] tracking-[0.06em] text-[rgba(220,100,80,0.9)]">
      {msg}
    </span>
  ) : null;
}

/* ═════════════════════════════════════════════════════
   Main component
   ═════════════════════════════════════════════════════ */

export default function CateringForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef   = useRef<HTMLDivElement>(null);

  const [step, setStep]   = useState<StepIdx>(0);
  const [form, setForm]   = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [sendError, setSendError] = useState('');

  /* Section reveal */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const left = section.querySelector('[data-cf="left"]');
    const right = section.querySelector('[data-cf="right"]');
    const rule = section.querySelector('[data-cf="rule"]');

    gsap.set([left, right], { opacity: 0, y: 40 });
    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center', opacity: 1 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.timeline()
          .to(rule,  { scaleX: 1, duration: 1.1, ease: 'expo.out' })
          .to(left,  { opacity: 1, y: 0, duration: 0.95, ease: 'expo.out' }, '-=0.65')
          .to(right, { opacity: 1, y: 0, duration: 0.95, ease: 'expo.out' }, '-=0.8');
      },
    });

    return () => trigger.kill();
  }, []);

  /* Animate between steps */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const active = stage.querySelector('.cf-step.is-active');
    if (!active) return;

    const fields = active.querySelectorAll('[data-cf-field]');
    gsap.fromTo(
      fields,
      { opacity: 0, y: 16 },
      {
        opacity: 1, y: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: 'power3.out',
      }
    );
  }, [step]);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  /* Per-step validation */
  const validateStep = (which: StepIdx): boolean => {
    const e: Partial<FormState> = {};
    if (which === 0) {
      if (!form.eventType) e.eventType = 'Required';
      if (!form.guests)    e.guests    = 'Required';
    }
    if (which === 1) {
      if (!form.eventDate)     e.eventDate = 'Required';
      if (!form.venue.trim())  e.venue     = 'Required';
    }
    if (which === 2) {
      if (!form.name.trim())  e.name  = 'Required';
      if (!form.email.trim()) e.email = 'Required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
      if (!form.phone.trim()) e.phone = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => (Math.min(s + 1, steps.length - 1)) as StepIdx);
  };

  const goPrev = () => {
    setErrors({});
    setStep((s) => (Math.max(s - 1, 0)) as StepIdx);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;

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

  const reset = () => {
    setForm(empty);
    setSubmitted(false);
    setErrors({});
    setStep(0);
  };

  const currentStep = steps[step];

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0d1410] pb-14 pr-4 sm:pb-[72px] sm:pr-8 lg:pb-[100px] lg:pr-12"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -right-[20%] top-0 h-[60vw] w-[60vw]"
        style={{ background: 'radial-gradient(circle, rgba(151,29,19,0.045) 0%, transparent 65%)' }}
        aria-hidden
      />

      {/* Corner flourishes */}
      <CupFlourish
        className="pointer-events-none absolute z-0 hidden sm:block"
        style={{
          top: '80px',
          right: '5vw',
          color: 'rgba(151, 29, 19, 0.22)',
          filter: 'drop-shadow(0 0 20px rgba(151, 29, 19, 0.12))',
        }}
        size={110}
      />

      <RoseFlourish
        className="pointer-events-none absolute z-0 hidden md:block"
        style={{
          bottom: '40px',
          left: '2vw',
          color: 'rgba(151, 29, 19, 0.14)',
        }}
        size={140}
      />

      {/* Animated red rule */}
      <div
        data-cf="rule"
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, #971d13 0%, rgba(151,29,19,0.12) 100%)',
          marginBottom: '80px',
        }}
        aria-hidden
      />

      <div className="relative z-10 grid grid-cols-1 gap-12 px-5 sm:px-6 md:grid-cols-[40%_60%] md:gap-[6vw] md:px-[3.9vw]">
        {/* ── LEFT — info panel (static) ────────────── */}
        <div data-cf="left" className="flex flex-col opacity-0">
          <span
            className="mb-7 block font-bold uppercase tracking-[0.22em] text-[#971d13]"
            style={{ fontSize: 'max(0.677vw, 11px)' }}
          >
            Catering Enquiries
          </span>

          <h2
            className="mb-7 font-bold uppercase leading-none tracking-[-0.03em] text-white"
            style={{ fontSize: 'clamp(38px, 4.2vw, 68px)' }}
          >
            Bring<br />
            <span className="text-[#971d13]">CAPOS</span><br />
            to your event.
          </h2>

          <p
            className="mb-10 max-w-[380px] leading-[1.75] text-[rgba(240,237,230,0.6)]"
            style={{ fontSize: 'max(1.04vw, 17px)' }}
          >
            We set up our specialty coffee station at your venue, from intimate
            corporate breakfasts to large-scale festivals.
            <br />Every cup, crafted on-site.
          </p>

          <ul className="mb-9 flex list-none flex-col gap-[14px] p-0">
            <li className="flex items-center gap-3 text-[rgba(240,237,230,0.7)]" style={{ fontSize: 'max(0.9vw, 14px)' }}>
              <span className="w-[18px] shrink-0 text-[#971d13]" aria-hidden>✉</span>
              <a href="mailto:info@capos.com" className="text-white transition-colors duration-300 hover:text-[#971d13]">
                info@capos.com
              </a>
            </li>
            <li className="flex items-center gap-3 text-[rgba(240,237,230,0.7)]" style={{ fontSize: 'max(0.9vw, 14px)' }}>
              <span className="w-[18px] shrink-0 text-[#971d13]" aria-hidden>✆</span>
              <a href="tel:+17327894792" className="text-white transition-colors duration-300 hover:text-[#971d13]">
                +1 (732) 789-4792
              </a>
            </li>
            <li className="flex items-center gap-3 tracking-[0.06em] text-[rgba(240,237,230,0.55)]" style={{ fontSize: 'max(0.9vw, 14px)' }}>
              <span className="w-[16px] shrink-0 text-[#971d13]" aria-hidden>◷</span>
              We&apos;ll get back to you as soon as possible.
            </li>
          </ul>

          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {['Corporate', 'Weddings', 'Festivals', 'Private Events'].map((t) => (
              <span
                key={t}
                className="rounded-sm border border-[rgba(151,29,19,0.28)] px-[14px] py-[6px] tracking-[0.14em] text-[rgba(151,29,19,0.75)]"
                style={{ fontSize: 'max(0.677vw, 10px)', fontWeight: 700, textTransform: 'uppercase' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT — wizard ─────────────────────────── */}
        <div data-cf="right" className="pr-14 opacity-0">
          {submitted ? (
            <div className="cf-success">
              <div className="cf-success-badge" aria-hidden>
                <div className="cf-success-pulse" />
                <div className="cf-success-pulse cf-success-pulse--2" />
                <svg viewBox="0 0 48 48" width="52" height="52">
                  <circle cx="24" cy="24" r="22" fill="none" stroke="#971d13" strokeWidth="1.5" />
                  <path
                    className="cf-success-check"
                    d="M14 24 L21 31 L34 17"
                    fill="none"
                    stroke="#971d13"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3
                className="m-0 font-bold tracking-[-0.02em] text-white"
                style={{ fontSize: 'clamp(24px, 2.8vw, 40px)' }}
              >
                Enquiry received.
              </h3>
              <p
                className="m-0 max-w-[440px] leading-[1.7] text-[rgba(240,237,230,0.7)]"
                style={{ fontSize: 'max(1.04vw, 17px)' }}
              >
                Thank you, {form.name.split(' ')[0] || 'friend'}. Our team will be in touch
                within 24 hours to discuss your event.
              </p>
              <button
                type="button"
                className="btn-primary mt-2 self-start"
                style={{ fontSize: 'max(0.677vw, 11px)', padding: '12px 24px', letterSpacing: '0.1em' }}
                onClick={reset}
              >
                Submit another enquiry →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
              {/* Progress indicator */}
              <div className="cf-progress" role="tablist" aria-label="Form progress">
                {steps.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === step}
                    className={`cf-progress-step${
                      i === step ? ' is-active' : i < step ? ' is-done' : ''
                    }`}
                    onClick={() => {
                      /* Allow jumping back; forward only if current is valid */
                      if (i < step) setStep(i as StepIdx);
                      else if (i > step && validateStep(step)) setStep(i as StepIdx);
                    }}
                  >
                    <span className="cf-progress-num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="cf-progress-label">{s.label}</span>
                    {i < steps.length - 1 && (
                      <span className="cf-progress-bar" aria-hidden />
                    )}
                  </button>
                ))}
              </div>

              {/* Prompt for the current step */}
              <div
                key={`prompt-${step}`}
                className="cf-prompt"
              >
                <span
                  className="cf-prompt-eyebrow"
                  style={{ fontSize: 'max(0.677vw, 10px)' }}
                >
                  Step {String(step + 1).padStart(2, '0')} of {String(steps.length).padStart(2, '0')}
                </span>
                <h3 className="cf-prompt-text">
                  {currentStep.prompt}
                </h3>
              </div>

              {/* Steps stage */}
              <div ref={stageRef} className="cf-stage">
                {/* ── STEP 1 — Event & Guests ─────────── */}
                <div className={`cf-step${step === 0 ? ' is-active' : ''}`} aria-hidden={step !== 0}>
                  <div className="flex flex-col gap-5">
                    <div data-cf-field className="flex flex-col">
                      <Label htmlFor="cf-type">Event Type</Label>
                      <select
                        id="cf-type"
                        className={`${inputBase} cursor-pointer pr-10${errors.eventType ? ` ${errorBorder}` : ''}`}
                        style={selectStyle}
                        value={form.eventType}
                        onChange={set('eventType')}
                        disabled={step !== 0}
                      >
                        <option value="" style={{ background: '#0d1410', color: '#fff' }}>Select type</option>
                        {eventTypes.map((t) => (
                          <option key={t} value={t} style={{ background: '#0d1410', color: '#fff' }}>{t}</option>
                        ))}
                      </select>
                      <FieldError msg={errors.eventType} />
                    </div>

                    <div data-cf-field className="flex flex-col">
                      <Label htmlFor="cf-guests">Expected Guests</Label>
                      <select
                        id="cf-guests"
                        className={`${inputBase} cursor-pointer pr-10${errors.guests ? ` ${errorBorder}` : ''}`}
                        style={selectStyle}
                        value={form.guests}
                        onChange={set('guests')}
                        disabled={step !== 0}
                      >
                        <option value="" style={{ background: '#0d1410', color: '#fff' }}>Select range</option>
                        {guestCounts.map((g) => (
                          <option key={g} value={g} style={{ background: '#0d1410', color: '#fff' }}>{g}</option>
                        ))}
                      </select>
                      <FieldError msg={errors.guests} />
                    </div>

                    <div data-cf-field className="flex flex-col">
                      <Label htmlFor="cf-budget">Estimated Budget</Label>
                      <select
                        id="cf-budget"
                        className={`${inputBase} cursor-pointer pr-10`}
                        style={selectStyle}
                        value={form.budget}
                        onChange={set('budget')}
                        disabled={step !== 0}
                      >
                        <option value="" style={{ background: '#0d1410', color: '#fff' }}>Select range</option>
                        {budgetRanges.map((b) => (
                          <option key={b} value={b} style={{ background: '#0d1410', color: '#fff' }}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div data-cf-field className="flex flex-col">
                      <Label htmlFor="cf-notes">
                        A note about your vision{' '}
                        <span className="font-normal normal-case tracking-normal text-[rgba(138,125,107,0.5)]">(optional)</span>
                      </Label>
                      <textarea
                        id="cf-notes"
                        rows={3}
                        className={`${inputBase} min-h-[100px] resize-y leading-[1.6]`}
                        placeholder="Themes, dietary needs, drink favourites, anything else…"
                        value={form.notes}
                        onChange={set('notes')}
                        disabled={step !== 0}
                      />
                    </div>
                  </div>
                </div>

                {/* ── STEP 2 — Date & Venue ───────────── */}
                <div className={`cf-step${step === 1 ? ' is-active' : ''}`} aria-hidden={step !== 1}>
                  <div className="flex flex-col gap-5">
                    <div data-cf-field className="flex flex-col">
                      <Label htmlFor="cf-date">Event Date</Label>
                      <input
                        id="cf-date"
                        type="date"
                        className={`${inputBase} [color-scheme:dark]${errors.eventDate ? ` ${errorBorder}` : ''}`}
                        value={form.eventDate}
                        onChange={set('eventDate')}
                        min={new Date().toISOString().split('T')[0]}
                        disabled={step !== 1}
                      />
                      <FieldError msg={errors.eventDate} />
                    </div>

                    <div data-cf-field className="flex flex-col">
                      <Label htmlFor="cf-venue">Venue / City</Label>
                      <input
                        id="cf-venue"
                        type="text"
                        className={`${inputBase}${errors.venue ? ` ${errorBorder}` : ''}`}
                        placeholder="e.g. Brooklyn, NY"
                        value={form.venue}
                        onChange={set('venue')}
                        disabled={step !== 1}
                      />
                      <FieldError msg={errors.venue} />
                    </div>
                  </div>
                </div>

                {/* ── STEP 3 — Contact ────────────────── */}
                <div className={`cf-step${step === 2 ? ' is-active' : ''}`} aria-hidden={step !== 2}>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
                      <div data-cf-field className="flex flex-1 flex-col">
                        <Label htmlFor="cf-name">Full Name</Label>
                        <input
                          id="cf-name"
                          type="text"
                          autoComplete="name"
                          className={`${inputBase}${errors.name ? ` ${errorBorder}` : ''}`}
                          placeholder="Your name"
                          value={form.name}
                          onChange={set('name')}
                          disabled={step !== 2}
                        />
                        <FieldError msg={errors.name} />
                      </div>
                      <div data-cf-field className="flex flex-1 flex-col">
                        <Label htmlFor="cf-phone">Phone</Label>
                        <input
                          id="cf-phone"
                          type="tel"
                          autoComplete="tel"
                          className={`${inputBase}${errors.phone ? ` ${errorBorder}` : ''}`}
                          placeholder="+1 555 123 4567"
                          value={form.phone}
                          onChange={set('phone')}
                          disabled={step !== 2}
                        />
                        <FieldError msg={errors.phone} />
                      </div>
                    </div>

                    <div data-cf-field className="flex flex-col">
                      <Label htmlFor="cf-email">Email Address</Label>
                      <input
                        id="cf-email"
                        type="email"
                        autoComplete="email"
                        className={`${inputBase}${errors.email ? ` ${errorBorder}` : ''}`}
                        placeholder="your@example.com"
                        value={form.email}
                        onChange={set('email')}
                        disabled={step !== 2}
                      />
                      <FieldError msg={errors.email} />
                    </div>

                    {/* Live summary — makes the last step feel personal */}
                    <div data-cf-field className="cf-summary">
                      <span className="cf-summary-eyebrow t-h6">Your enquiry</span>
                      <dl className="cf-summary-list">
                        <div className="cf-summary-row">
                          <dt>Event</dt>
                          <dd>{form.eventType || '—'} · {form.guests || '—'} guests</dd>
                        </div>
                        <div className="cf-summary-row">
                          <dt>Budget</dt>
                          <dd>{form.budget || '—'}</dd>
                        </div>
                        <div className="cf-summary-row">
                          <dt>When</dt>
                          <dd>
                            {form.eventDate
                              ? new Date(form.eventDate).toLocaleDateString(undefined, {
                                  year: 'numeric', month: 'long', day: 'numeric',
                                })
                              : '—'}
                          </dd>
                        </div>
                        <div className="cf-summary-row">
                          <dt>Where</dt>
                          <dd>{form.venue || '—'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav buttons */}
              <div className="cf-nav">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={step === 0 || sending}
                  className="cf-back"
                  aria-label="Previous step"
                >
                  <span aria-hidden>←</span>
                  <span>Back</span>
                </button>

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="btn-primary cf-next"
                    style={{
                      padding: '14px 32px',
                      fontSize: 'max(0.677vw, 12px)',
                      letterSpacing: '0.12em',
                    }}
                  >
                    <span>Continue</span>
                    <span className="cf-next-arrow" aria-hidden>→</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary cf-next"
                    style={{
                      padding: '14px 32px',
                      fontSize: 'max(0.677vw, 12px)',
                      letterSpacing: '0.12em',
                      opacity: sending ? 0.6 : 1,
                    }}
                  >
                    <span>{sending ? 'Sending…' : 'Send Enquiry'}</span>
                    <span className="cf-next-arrow" aria-hidden>→</span>
                  </button>
                )}
              </div>

              {sendError && (
                <p style={{ marginTop: 4, fontSize: 13, color: 'rgba(220,80,60,0.9)', lineHeight: 1.6 }}>
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
