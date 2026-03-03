/**
 * Color definitions for each hologram preset.
 *
 * - `primary`   — dominant glow / text-shadow color
 * - `secondary` — accent used in gradients and secondary glow
 * - `tertiary`  — third gradient stop (iridescent edge)
 * - `hueRotate` — CSS `hue-rotate()` value applied to the background image
 *                 filter chain (sepia → hue-rotate) to tint towards this palette
 */
export const COLOR_PRESETS: Record<
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
 * Default prop values for the Hologram component.
 * Kept in one place for easy reference and to avoid magic numbers in code.
 */
export const DEFAULTS = {
  color: 'cyan' as const,
  intensity: 0.7,
  scanlineSpeed: 8,
  flickerIntensity: 0.3,
  chromaticAberration: 2,
  glitch: true,
  glitchInterval: [2000, 6000] as [number, number],
  interactive: true,
} as const;
