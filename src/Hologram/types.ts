import type { CSSProperties, ReactNode } from 'react';

/**
 * Available hologram color preset names.
 *
 * Each preset defines a distinct holographic color palette:
 * - `'cyan'` — Classic sci-fi cyan/teal hologram
 * - `'green'` — Matrix-style green hologram
 * - `'magenta'` — Vibrant magenta/pink hologram
 * - `'gold'` — Warm golden hologram
 * - `'rainbow'` — Multi-color iridescent hologram
 */
export type HologramColorPreset = 'cyan' | 'green' | 'magenta' | 'gold' | 'rainbow';

/**
 * Device orientation data normalized to the [-1, 1] range on both axes.
 * Used internally to drive holographic effects from gyroscope or mouse input.
 */
export interface NormalizedOrientation {
  /** Horizontal tilt/position, -1 (left) to 1 (right) */
  x: number;
  /** Vertical tilt/position, -1 (up) to 1 (down) */
  y: number;
}

/**
 * Computed hologram visual-effect parameters derived from device orientation
 * and time-based animations. These drive the CSS custom properties of the component.
 */
export interface HologramEffectParams {
  /** Hue rotation offset in degrees */
  hueShift: number;
  /** Horizontal parallax / chromatic-aberration offset in px */
  offsetX: number;
  /** Vertical parallax / chromatic-aberration offset in px */
  offsetY: number;
  /** Angle of the holographic gradient overlay in degrees */
  gradientAngle: number;
  /** Position of the light-band highlight (0–100 %) */
  lightBandPosition: number;
  /** Flicker opacity multiplier (0–1) */
  flickerOpacity: number;
}

/**
 * Props accepted by the {@link Hologram} component.
 */
export interface HologramProps {
  /**
   * Content to render inside the hologram.
   * Typically text, but any React node is supported.
   */
  children: ReactNode;

  /**
   * Optional background image URL.
   * The image is automatically converted to a holographic color palette
   * using CSS filters and a tinted gradient overlay.
   */
  backgroundImage?: string;

  /**
   * Hologram color — either a preset name or any valid CSS color value.
   *
   * Presets: `'cyan'` | `'green'` | `'magenta'` | `'gold'` | `'rainbow'`
   *
   * When a custom CSS color (e.g. `'#ff4500'`) is provided the component
   * derives the hue automatically.
   *
   * @default 'cyan'
   */
  color?: HologramColorPreset | (string & {});

  /**
   * Overall intensity of the holographic effects, from 0 (off) to 1 (full).
   * Controls the magnitude of hue-shift, parallax, chromatic aberration,
   * and gradient movement.
   *
   * @default 0.7
   */
  intensity?: number;

  /**
   * Duration of one full scanline scroll cycle in seconds.
   * Lower values produce faster scanlines.
   *
   * @default 8
   */
  scanlineSpeed?: number;

  /**
   * Intensity of the random-flicker effect, from 0 (none) to 1 (heavy).
   *
   * @default 0.3
   */
  flickerIntensity?: number;

  /**
   * Magnitude of the chromatic-aberration offset in pixels (0–5).
   * The direction follows the device orientation / mouse position.
   *
   * @default 2
   */
  chromaticAberration?: number;

  /**
   * Whether to enable the random glitch effect.
   *
   * @default true
   */
  glitch?: boolean;

  /**
   * Min/max interval in milliseconds between random glitch bursts.
   *
   * @default [2000, 6000]
   */
  glitchInterval?: [number, number];

  /**
   * Whether to track device gyroscope / mouse position and drive
   * interactive parallax, hue-shift, and light-band effects.
   * When `false`, the hologram renders as a static effect.
   *
   * @default true
   */
  interactive?: boolean;

  /** Additional CSS class name appended to the root element. */
  className?: string;

  /** Additional inline styles applied to the root element. */
  style?: CSSProperties;
}
