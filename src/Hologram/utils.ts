import { BEAM_PRESETS, FOIL_PRESETS } from './constants';
import type { HologramColorPreset } from './types';

/**
 * Resolve a color prop into the beam-variant palette (glow colors + filter hue).
 */
export function resolveBeamPalette(color: HologramColorPreset | string): {
  primary: string;
  secondary: string;
  tertiary: string;
  hueRotate: number;
} {
  const preset = BEAM_PRESETS[color];
  if (preset) return preset;

  const hue = parseHue(color);
  return {
    primary: color,
    secondary: color,
    tertiary: color,
    hueRotate: hue === null ? 160 : hueToSepiaRotation(hue),
  };
}

/**
 * Resolve a color prop into the foil-variant palette (metallic base + hue bias).
 */
export function resolveFoilPalette(color: HologramColorPreset | string): {
  hueOffset: number;
  metalDark: string;
  metalMid: string;
  metalLight: string;
  saturation: number;
} {
  const preset = FOIL_PRESETS[color];
  if (preset) return preset;

  const hue = parseHue(color);
  return {
    hueOffset: hue !== null ? hue - 180 : 0,
    metalDark: '#666',
    metalMid: '#999',
    metalLight: '#ddd',
    saturation: 1.4,
  };
}

/**
 * Attempt to extract the hue (0–360) from a hex color string.
 * Returns `null` for unparseable values.
 */
function parseHue(color: string): number | null {
  const hex = color.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) return 0;

  let hue: number;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;
  return hue;
}

/**
 * Convert an absolute hue (0–360) to the `hue-rotate()` offset needed
 * after the `sepia(1)` filter (sepia baseline ≈ 30°).
 */
function hueToSepiaRotation(targetHue: number): number {
  const SEPIA_BASE_HUE = 30;
  return targetHue - SEPIA_BASE_HUE;
}
