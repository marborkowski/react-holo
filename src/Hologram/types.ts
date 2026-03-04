import type { CSSProperties, ReactNode } from 'react';

/**
 * Available hologram color preset names.
 *
 * Each preset defines a distinct holographic color palette:
 * - `'cyan'` — Cool-toned silver-blue holographic foil
 * - `'green'` — Green-biased holographic foil
 * - `'magenta'` — Pink/purple-biased holographic foil
 * - `'gold'` — Warm gold metallic holographic foil
 * - `'rainbow'` — Neutral silver foil with full-spectrum rainbow (default for foil)
 */
export type HologramColorPreset = 'cyan' | 'green' | 'magenta' | 'gold' | 'rainbow';

/**
 * Visual variant of the hologram component.
 *
 * - `'foil'` — Realistic holographic foil/sticker material with rainbow
 *   diffraction, metallic sheen, and micro-line grating. Content appears
 *   dark (printed) on top of the shiny surface. Matches real-world
 *   holographic labels and security stickers.
 *
 * - `'beam'` — Sci-fi projected-hologram aesthetic with glowing text,
 *   chromatic aberration, scanlines, and edge bloom on a dark background.
 *   Think Star Wars holograms or cyberpunk UI panels.
 */
export type HologramVariant = 'foil' | 'beam';

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
  /** Start angle of the primary conic rainbow gradient (0–360 deg, foil variant) */
  conicAngle: number;
  /** Angle of the secondary linear rainbow gradient (foil variant) */
  secondaryAngle: number;
  /** X position of the specular highlight (0–100 %, foil variant) */
  lightX: number;
  /** Y position of the specular highlight (0–100 %, foil variant) */
  lightY: number;
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
   * Visual variant.
   *
   * - `'foil'` — Realistic holographic foil material (rainbow diffraction,
   *   metallic sheen). Content appears as dark print on the shiny surface.
   *   Background images are blended via `multiply`, so dark areas of the
   *   image "print" onto the foil while light areas reveal the rainbow.
   *
   * - `'beam'` — Sci-fi projected hologram (glowing text, chromatic
   *   aberration, scanlines). Background images are tinted to a
   *   single-hue holographic palette.
   *
   * @default 'foil'
   */
  variant?: HologramVariant;

  /**
   * Optional background image URL.
   *
   * - **foil variant** — image is blended with `mix-blend-mode: multiply`
   *   on top of the holographic foil surface. Dark areas appear as "ink",
   *   light areas reveal the rainbow foil beneath.
   * - **beam variant** — image is converted to a monochromatic holographic
   *   palette via CSS filters.
   */
  backgroundImage?: string;

  /**
   * Hologram color — either a preset name or any valid CSS color value.
   *
   * Presets: `'cyan'` | `'green'` | `'magenta'` | `'gold'` | `'rainbow'`
   *
   * - In **foil** mode the preset biases the rainbow spectrum and metallic
   *   base tone (e.g. `'gold'` gives a warm brass base).
   * - In **beam** mode the preset sets the glow / tint color.
   *
   * When a custom CSS color (e.g. `'#ff4500'`) is provided the component
   * derives the hue automatically.
   *
   * @default 'rainbow' (foil) / 'cyan' (beam)
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
   * Primarily visible in the `beam` variant.
   *
   * @default 2
   */
  chromaticAberration?: number;

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
