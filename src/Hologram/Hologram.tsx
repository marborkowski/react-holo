import { useId, type CSSProperties } from 'react';
import { useHologramEffect } from './hooks';
import { resolveColorPalette } from './utils';
import { DEFAULTS } from './constants';
import type { HologramProps } from './types';
import styles from './Hologram.module.css';

/**
 * `<Hologram>` renders its children (text, images, any React node) with a
 * realistic holographic visual effect.
 *
 * The effect is composed of multiple GPU-accelerated CSS layers:
 *
 * 1. **Background image** — automatically converted to a holographic color
 *    palette via CSS filters (`grayscale → sepia → hue-rotate → saturate`).
 * 2. **Iridescent gradient overlay** — blended on top of the background with
 *    `mix-blend-mode: screen` for a light-diffraction look.
 * 3. **Animated scanlines** — horizontal interference lines that scroll
 *    continuously.
 * 4. **Specular light band** — a bright highlight that moves with the
 *    device tilt / mouse position.
 * 5. **Film grain noise** — a subtle static-noise texture for realism.
 * 6. **Chromatic aberration** — RGB channel splitting on text that follows
 *    the orientation input.
 * 7. **Glow** — soft colored bloom on text and container edges.
 * 8. **Flicker** — random subtle brightness variations.
 * 9. **Glitch** — occasional horizontal displacement + hue burst.
 *
 * All orientation-driven effects read from the device gyroscope
 * (`DeviceOrientationEvent`) and fall back to mouse-position tracking on
 * desktop.
 *
 * @example
 * ```tsx
 * <Hologram>HELLO WORLD</Hologram>
 *
 * <Hologram
 *   backgroundImage="/hero.jpg"
 *   color="magenta"
 *   intensity={0.9}
 * >
 *   <h1>Cyberpunk Title</h1>
 * </Hologram>
 * ```
 */
export function Hologram({
  children,
  backgroundImage,
  color = DEFAULTS.color,
  intensity = DEFAULTS.intensity,
  scanlineSpeed = DEFAULTS.scanlineSpeed,
  flickerIntensity = DEFAULTS.flickerIntensity,
  chromaticAberration = DEFAULTS.chromaticAberration,
  glitch = DEFAULTS.glitch,
  glitchInterval = DEFAULTS.glitchInterval,
  interactive = DEFAULTS.interactive,
  className,
  style,
}: HologramProps) {
  const id = useId();
  const palette = resolveColorPalette(color);

  const { params, isGlitching } = useHologramEffect({
    intensity,
    flickerIntensity,
    interactive,
    glitch,
    glitchInterval,
  });

  // ---- CSS custom properties ----------------------------------------

  const cssVars: CSSProperties & Record<string, string> = {
    '--holo-primary': palette.primary,
    '--holo-secondary': palette.secondary,
    '--holo-tertiary': palette.tertiary,
    '--holo-bg-hue': `${palette.hueRotate}deg`,
    '--holo-hue-shift': `${params.hueShift}deg`,
    '--holo-gradient-angle': `${params.gradientAngle}deg`,
    '--holo-light-pos': `${params.lightBandPosition}%`,
    '--holo-ca-x': `${params.offsetX * (chromaticAberration / 2)}`,
    '--holo-ca-y': `${params.offsetY * (chromaticAberration / 2)}`,
    '--holo-flicker': `${params.flickerOpacity}`,
    '--holo-scanline-speed': `${scanlineSpeed}s`,
  };

  // ---- Class composition --------------------------------------------

  const rootClasses = [
    styles.root,
    styles.edgeGlow,
    isGlitching && styles.glitchActive,
    color === 'rainbow' && styles.rainbow,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={rootClasses}
      style={{ ...cssVars, ...style }}
      role="presentation"
      aria-hidden={false}
      data-hologram-id={id}
    >
      {/* Background image (holographic color conversion) */}
      {backgroundImage && (
        <div className={styles.backgroundLayer}>
          <img
            className={styles.backgroundImage}
            src={backgroundImage}
            alt=""
            aria-hidden
            draggable={false}
          />
          <div className={styles.backgroundOverlay} />
        </div>
      )}

      {/* Scanlines */}
      <div className={styles.scanlines} aria-hidden />

      {/* Specular light band */}
      <div className={styles.lightBand} aria-hidden />

      {/* Film grain noise */}
      <div className={styles.noise} aria-hidden />

      {/* Content */}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
