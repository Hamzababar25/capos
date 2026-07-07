/**
 * Micro-illustrations — subtle brand flourishes to drop into section corners.
 * Uses currentColor so parent can tint them via `color: ...`.
 *
 * These are intentionally sparse line-art SVGs — never dominant,
 * always supporting the surrounding editorial layout.
 */

import { CSSProperties } from 'react';

interface Props {
  className?: string;
  style?: CSSProperties;
  size?: number;
  'aria-hidden'?: boolean;
}

/* -- ROSE — mirrors the rose in the CAPOS logo ---------- */
export function RoseFlourish({ className, style, size = 90, ...rest }: Props) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? true}
    >
      {/* Rose head — layered petals */}
      <circle cx="50" cy="38" r="14" opacity="0.85" />
      <path d="M50 24c4 5 4 12 0 20-4-8-4-15 0-20z" opacity="0.75" />
      <path d="M36 38c5-3 12-3 20 0-8 3-15 3-20 0z" opacity="0.75" />
      <path d="M40 30c3 3 3 8 0 14 3-3 8-3 14 0-3-3-3-8 0-14-3 3-8 3-14 0z" opacity="0.55" />
      <circle cx="50" cy="38" r="4" opacity="0.4" fill="currentColor" />

      {/* Stem */}
      <path d="M50 52c-1 8 0 16 2 24" opacity="0.7" />

      {/* Leaves */}
      <path d="M52 62c4-2 8-1 10 2-4 1-8 0-10-2z" opacity="0.6" />
      <path d="M50 72c-3-2-8-2-10 1 3 1 8 1 10-1z" opacity="0.6" />
    </svg>
  );
}

/* -- COFFEE CUP — steam-curls for atmosphere ------------ */
export function CupFlourish({ className, style, size = 90, ...rest }: Props) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? true}
    >
      {/* Steam — three curling wisps */}
      <path d="M38 22c2-4-2-8 0-12" opacity="0.55" />
      <path d="M50 20c2-5-2-9 0-14" opacity="0.7" />
      <path d="M62 22c2-4-2-8 0-12" opacity="0.55" />

      {/* Cup body */}
      <path d="M28 42h44l-4 32a8 8 0 0 1-8 7H40a8 8 0 0 1-8-7z" opacity="0.85" />

      {/* Handle */}
      <path d="M72 50c8 0 12 6 12 12s-4 12-12 12" opacity="0.7" />

      {/* Coffee surface line */}
      <path d="M32 46h36" opacity="0.5" />

      {/* Saucer */}
      <ellipse cx="50" cy="86" rx="30" ry="3" opacity="0.6" />
    </svg>
  );
}

/* -- ORNATE CORNER — thin flourish for section corners -- */
export function CornerFlourish({ className, style, size = 60, ...rest }: Props) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      aria-hidden={rest['aria-hidden'] ?? true}
    >
      <path d="M2 2h20" opacity="0.55" />
      <path d="M2 2v20" opacity="0.55" />
      <path d="M2 2c8 0 14 6 14 14" opacity="0.35" />
      <circle cx="2" cy="2" r="1.2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/* -- COFFEE BEAN — tiny decorative dot ------------------- */
export function BeanFlourish({ className, style, size = 24, ...rest }: Props) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden={rest['aria-hidden'] ?? true}
    >
      <ellipse cx="12" cy="12" rx="5" ry="8" transform="rotate(30 12 12)" opacity="0.85" />
      <path d="M9 8c1.5 3 3.5 5 6 8" transform="rotate(30 12 12)" opacity="0.6" />
    </svg>
  );
}
