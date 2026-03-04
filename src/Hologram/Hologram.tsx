import { useId, type CSSProperties } from 'react';
import { useHologramEffect } from './hooks';
import { resolveBeamPalette, resolveFoilPalette } from './utils';
import { DEFAULTS } from './constants';
import type { HologramProps } from './types';
import styles from './Hologram.module.css';

/**
 * `<Hologram>` renders its children (text, images, any React node) with a
 * holographic visual effect.
 *
 * Two visual variants are available:
 *
 * ### `variant="foil"` (default) — Realistic holographic material
 *
 * Simulates real-world holographic foil / security-label material with:
 * - **Conic rainbow diffraction** — full-spectrum color wheel that rotates
 *   with device tilt / mouse position.
 * - **Secondary rainbow band** — an offset linear gradient that creates
 *   complex spatial color variation (different areas show different hues).
 * - **Chrome metallic base** — multi-stop silver/gold gradient beneath the
 *   rainbow for realistic reflectivity.
 * - **Micro-line diffraction grating** — very fine repeating lines that
 *   reproduce the texture of real holographic foil.
 * - **Specular highlight** — a bright radial hot-spot that follows
 *   the device orientation.
 * - **Fresnel edge brightening** — perimeter glow simulating light catch.
 *
 * Background images are blended with `mix-blend-mode: multiply`, so dark
 * areas of the image appear as "ink" printed on the foil, while light areas
 * reveal the rainbow surface underneath — exactly like real holographic
 * stickers.
 *
 * ### `variant="beam"` — Sci-fi projected hologram
 *
 * A glowing, translucent aesthetic inspired by sci-fi holograms:
 * - Chromatic aberration, scanlines, edge bloom, and flicker.
 * - Background images are re-graded to a monochromatic holographic palette.
 *
 * @example
 * ```tsx
 * // Realistic holographic foil (default)
 * <Hologram>HOLOGRAM TEXT</Hologram>
 *
 * // Foil with a background image printed on it
 * <Hologram backgroundImage="/logo.png" color="gold">
 *   <h1>CERTIFIED</h1>
 * </Hologram>
 *
 * // Sci-fi projected hologram
 * <Hologram variant="beam" color="cyan">
 *   <h1>SYSTEM ONLINE</h1>
 * </Hologram>
 * ```
 */
export function Hologram({
  children,
  variant = DEFAULTS.variant,
  backgroundImage,
  color,
  intensity = DEFAULTS.intensity,
  scanlineSpeed = DEFAULTS.scanlineSpeed,
  flickerIntensity = DEFAULTS.flickerIntensity,
  chromaticAberration = DEFAULTS.chromaticAberration,
  interactive = DEFAULTS.interactive,
  className,
  style,
}: HologramProps) {
  const id = useId();

  // Resolve default color per variant
  const resolvedColor = color ?? (variant === 'foil' ? 'rainbow' : 'cyan');

  const { params, permissionState, requestPermission } = useHologramEffect({
    intensity,
    flickerIntensity,
    interactive,
  });

  const permissionOverlay =
    interactive && permissionState === 'prompt' ? (
      <button
        type="button"
        className={styles.gyroPrompt}
        onClick={() => void requestPermission()}
        aria-label="Tap to enable gyroscope-driven holographic effect"
      >
        <span className={styles.gyroPromptIcon} aria-hidden>
          &#x21BB;
        </span>
        Tap to enable motion
      </button>
    ) : null;

  if (variant === 'foil') {
    return (
      <FoilHologram
        id={id}
        resolvedColor={resolvedColor}
        params={params}
        scanlineSpeed={scanlineSpeed}
        backgroundImage={backgroundImage}
        className={className}
        style={style}
        permissionOverlay={permissionOverlay}
      >
        {children}
      </FoilHologram>
    );
  }

  return (
    <BeamHologram
      id={id}
      resolvedColor={resolvedColor}
      params={params}
      scanlineSpeed={scanlineSpeed}
      chromaticAberration={chromaticAberration}
      backgroundImage={backgroundImage}
      className={className}
      style={style}
      permissionOverlay={permissionOverlay}
    >
      {children}
    </BeamHologram>
  );
}

/* ====================================================================
   FOIL variant — realistic holographic material
   ==================================================================== */

interface FoilProps {
  id: string;
  resolvedColor: string;
  params: ReturnType<typeof useHologramEffect>['params'];
  scanlineSpeed: number;
  backgroundImage?: string;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  permissionOverlay: React.ReactNode;
}

function FoilHologram({
  id,
  resolvedColor,
  params,
  scanlineSpeed,
  backgroundImage,
  className,
  style,
  children,
  permissionOverlay,
}: FoilProps) {
  const foil = resolveFoilPalette(resolvedColor);

  const gratingAngle = `${params.secondaryAngle * 0.5 + 30}deg`;
  const baseAngle = `${params.gradientAngle + 90}deg`;

  const cssVars: CSSProperties & Record<string, string> = {
    '--holo-conic-angle': `${params.conicAngle}deg`,
    '--holo-secondary-angle': `${params.secondaryAngle}deg`,
    '--holo-base-angle': baseAngle,
    '--holo-grating-angle': gratingAngle,
    '--holo-light-x': `${params.lightX}%`,
    '--holo-light-y': `${params.lightY}%`,
    '--holo-flicker': `${params.flickerOpacity}`,
    '--holo-scanline-speed': `${scanlineSpeed}s`,
    '--holo-foil-hue': `${foil.hueOffset}deg`,
    '--holo-foil-sat': `${foil.saturation}`,
    '--holo-metal-dark': foil.metalDark,
    '--holo-metal-mid': foil.metalMid,
    '--holo-metal-light': foil.metalLight,
  };

  const rootClasses = [styles.root, className].filter(Boolean).join(' ');

  const foilLayer = `${styles.foilLayer}`;

  return (
    <div
      className={rootClasses}
      style={{ ...cssVars, ...style }}
      role="presentation"
      data-hologram-id={id}
    >
      {/* Holographic foil surface — separate layers for robustness */}
      <div className={styles.foilSurface} aria-hidden>
        <div className={`${foilLayer} ${styles.foilMetalBase}`} />
        <div className={`${foilLayer} ${styles.foilRainbow}`} />
        <div className={`${foilLayer} ${styles.foilSecondary}`} />
        <div className={`${foilLayer} ${styles.foilGrating}`} />
        <div className={`${foilLayer} ${styles.foilSpecular}`} />
        <div className={`${foilLayer} ${styles.foilFresnel}`} />
      </div>

      {/* Background image blended onto the foil via multiply */}
      {backgroundImage && (
        <div className={styles.foilBackgroundImage} aria-hidden>
          <img src={backgroundImage} alt="" draggable={false} />
        </div>
      )}

      {/* Scanlines (subtle) */}
      <div
        className={`${styles.scanlines} ${styles.foilScanlines}`}
        aria-hidden
      />

      {/* Film grain noise */}
      <div className={styles.noise} aria-hidden />

      {/* Content (dark print on shiny foil) */}
      <div className={styles.foilContent}>{children}</div>

      {/* iOS gyroscope permission prompt */}
      {permissionOverlay}
    </div>
  );
}

/* ====================================================================
   BEAM variant — sci-fi projected hologram
   ==================================================================== */

interface BeamProps {
  id: string;
  resolvedColor: string;
  params: ReturnType<typeof useHologramEffect>['params'];
  scanlineSpeed: number;
  chromaticAberration: number;
  backgroundImage?: string;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  permissionOverlay: React.ReactNode;
}

function BeamHologram({
  id,
  resolvedColor,
  params,
  scanlineSpeed,
  chromaticAberration,
  backgroundImage,
  className,
  style,
  children,
  permissionOverlay,
}: BeamProps) {
  const palette = resolveBeamPalette(resolvedColor);

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

  const rootClasses = [
    styles.root,
    styles.beamEdgeGlow,
    resolvedColor === 'rainbow' && styles.beamRainbow,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={rootClasses}
      style={{ ...cssVars, ...style }}
      role="presentation"
      data-hologram-id={id}
    >
      {/* Background image (holographic color conversion) */}
      {backgroundImage && (
        <div className={styles.beamBackgroundLayer}>
          <img
            className={styles.beamBackgroundImage}
            src={backgroundImage}
            alt=""
            aria-hidden
            draggable={false}
          />
          <div className={styles.beamBackgroundOverlay} />
        </div>
      )}

      {/* Scanlines */}
      <div className={styles.scanlines} aria-hidden />

      {/* Specular light band */}
      <div className={styles.beamLightBand} aria-hidden />

      {/* Film grain noise */}
      <div className={styles.noise} aria-hidden />

      {/* Content */}
      <div className={styles.beamContent}>{children}</div>

      {/* iOS gyroscope permission prompt */}
      {permissionOverlay}
    </div>
  );
}
