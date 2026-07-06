import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ModelViewerAttributes = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string;
  alt?: string;
  poster?: string;
  loading?: 'auto' | 'lazy' | 'eager';
  reveal?: 'auto' | 'interaction' | 'manual';
  'camera-controls'?: boolean;
  'disable-zoom'?: boolean;
  'disable-pan'?: boolean;
  'disable-tap'?: boolean;
  'auto-rotate'?: boolean;
  'auto-rotate-delay'?: number | string;
  'rotation-per-second'?: string;
  'camera-orbit'?: string;
  'camera-target'?: string;
  'field-of-view'?: string;
  'min-camera-orbit'?: string;
  'max-camera-orbit'?: string;
  exposure?: number | string;
  'shadow-intensity'?: number | string;
  'shadow-softness'?: number | string;
  'environment-image'?: string;
  'skybox-image'?: string;
  'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
  'interpolation-decay'?: number | string;
  'touch-action'?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes;
    }
  }
}

export {};
