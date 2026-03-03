import { COLOR_PRESETS } from './constants';
import type { HologramColorPreset } from './types';

/**
 * Resolve a color prop (preset name *or* custom CSS color) into the
 * three-color palette and hue-rotate value used by the component.
 *
 * @param color - A preset name (`'cyan'`, `'green'`, …) or any CSS color string.
 * @returns An object with `primary`, `secondary`, `tertiary` CSS color values
 *          and a `hueRotate` number (degrees) for the background-image filter.
 */
export function resolveColorPalette(color: HologramColorPreset | string): {
  primary: string;
  secondary: string;
  tertiary: string;
  hueRotate: number;
} {
  const preset = COLOR_PRESETS[color];
  if (preset) return preset;

  // Custom color: use it as the primary, derive secondary/tertiary,
  // and compute hue-rotate from the color's hue.
  const hue = parseHue(color);
  return {
    primary: color,
    secondary: color,
    tertiary: color,
    hueRotate: hue === null ? 160 : hueToSepiaRotation(hue),
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
