/**
 * Beam-variant color definitions for each preset.
 *
 * Used by the `beam` (projected hologram) variant to tint text glow,
 * gradients, and the background-image filter chain.
 */
export const BEAM_PRESETS: Record<
  string,
  { primary: string; secondary: string; tertiary: string; hueRotate: number }
> = {
  cyan: {
    primary: '#00f0ff',
    secondary: '#0070ff',
    tertiary: '#00ff80',
    hueRotate: 160,
  },
  green: {
    primary: '#00ff41',
    secondary: '#00cc33',
    tertiary: '#80ff00',
    hueRotate: 90,
  },
  magenta: {
    primary: '#ff00ff',
    secondary: '#cc00ff',
    tertiary: '#ff0080',
    hueRotate: 270,
  },
  gold: {
    primary: '#ffd700',
    secondary: '#ff8c00',
    tertiary: '#ffff00',
    hueRotate: 10,
  },
  rainbow: {
    primary: '#00f0ff',
    secondary: '#ff00ff',
    tertiary: '#ffff00',
    hueRotate: 160,
  },
};

/**
 * Foil-variant color definitions for each preset.
 *
 * Controls the metallic base tone and hue bias of the rainbow diffraction.
 * Real holographic foil always shows the full spectrum; the preset merely
 * shifts which part of the rainbow is dominant and sets the metallic base
 * color (silver, gold, rose, etc.).
 *
 * - `hueOffset`  — applied via `hue-rotate()` to the entire foil surface.
 * - `metalDark` / `metalMid` / `metalLight` — three stops of the chrome
 *    base gradient (the bottom layer beneath the rainbow).
 * - `saturation` — `saturate()` multiplier on the foil surface.
 */
export const FOIL_PRESETS: Record<
  string,
  {
    hueOffset: number;
    metalDark: string;
    metalMid: string;
    metalLight: string;
    saturation: number;
  }
> = {
  rainbow: {
    hueOffset: 0,
    metalDark: '#666',
    metalMid: '#999',
    metalLight: '#ddd',
    saturation: 1.4,
  },
  cyan: {
    hueOffset: 0,
    metalDark: '#556',
    metalMid: '#788',
    metalLight: '#9bc',
    saturation: 1.5,
  },
  green: {
    hueOffset: -60,
    metalDark: '#565',
    metalMid: '#787',
    metalLight: '#9b9',
    saturation: 1.4,
  },
  magenta: {
    hueOffset: 100,
    metalDark: '#656',
    metalMid: '#878',
    metalLight: '#b9b',
    saturation: 1.5,
  },
  gold: {
    hueOffset: -30,
    metalDark: '#764',
    metalMid: '#a86',
    metalLight: '#dba',
    saturation: 1.2,
  },
};

/**
 * Default prop values for the Hologram component.
 */
export const DEFAULTS = {
  variant: 'foil' as const,
  intensity: 0.7,
  scanlineSpeed: 8,
  flickerIntensity: 0.3,
  chromaticAberration: 2,
  interactive: true,
} as const;
