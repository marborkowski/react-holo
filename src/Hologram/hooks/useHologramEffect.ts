import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useDeviceOrientation } from './useDeviceOrientation';
import type { HologramEffectParams } from '../types';

/** Options accepted by {@link useHologramEffect}. */
interface UseHologramEffectOptions {
  /** Effect intensity multiplier (0–1). @default 0.7 */
  intensity?: number;
  /** Flicker strength (0–1). @default 0.3 */
  flickerIntensity?: number;
  /** Enable interactive orientation tracking. @default true */
  interactive?: boolean;
  /** Enable random glitch bursts. @default true */
  glitch?: boolean;
  /** Min/max interval (ms) between glitch bursts. @default [2000,6000] */
  glitchInterval?: [number, number];
}

/** Return value of {@link useHologramEffect}. */
interface UseHologramEffectReturn {
  /** Computed CSS-driving parameters. */
  params: HologramEffectParams;
  /** Whether a glitch burst is currently active. */
  isGlitching: boolean;
  /** Which input source drives the orientation ('gyroscope' | 'mouse' | 'none'). */
  orientationSource: 'gyroscope' | 'mouse' | 'none';
}

/**
 * Orchestrator hook that turns raw device orientation and time-based
 * animations into concrete hologram visual-effect parameters.
 *
 * It composes {@link useDeviceOrientation} internally and layers flicker
 * and glitch logic on top.
 *
 * @param options - Fine-tuning knobs for the effect.
 * @returns Effect parameters, glitch state, and the active orientation source.
 *
 * @example
 * ```tsx
 * const { params, isGlitching } = useHologramEffect({ intensity: 0.8 });
 * // params.hueShift, params.offsetX, etc. → CSS custom properties
 * ```
 */
export function useHologramEffect(
  options: UseHologramEffectOptions = {},
): UseHologramEffectReturn {
  const {
    intensity = 0.7,
    flickerIntensity = 0.3,
    interactive = true,
    glitch = true,
    glitchInterval = [2000, 6000],
  } = options;

  const { orientation, source } = useDeviceOrientation({ enabled: interactive });

  // ---- Flicker ------------------------------------------------------

  const [flickerOpacity, setFlickerOpacity] = useState(1);
  const flickerRafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (flickerIntensity <= 0) {
      setFlickerOpacity(1);
      return;
    }

    let lastUpdate = 0;

    const animate = (time: number) => {
      // Throttle to ~10 Hz so the flicker feels like a fluorescent lamp
      if (time - lastUpdate > 100) {
        lastUpdate = time;
        setFlickerOpacity(1 - Math.random() * flickerIntensity * 0.15);
      }
      flickerRafRef.current = requestAnimationFrame(animate);
    };

    flickerRafRef.current = requestAnimationFrame(animate);
    return () => {
      if (flickerRafRef.current !== undefined) cancelAnimationFrame(flickerRafRef.current);
    };
  }, [flickerIntensity]);

  // ---- Glitch -------------------------------------------------------

  const [isGlitching, setIsGlitching] = useState(false);
  const glitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scheduleGlitch = useCallback(() => {
    if (!glitch) return;

    const [min, max] = glitchInterval;
    const delay = min + Math.random() * (max - min);

    glitchTimeoutRef.current = setTimeout(() => {
      setIsGlitching(true);

      const burstDuration = 100 + Math.random() * 200;
      setTimeout(() => {
        setIsGlitching(false);
        scheduleGlitch();
      }, burstDuration);
    }, delay);
  }, [glitch, glitchInterval]);

  useEffect(() => {
    scheduleGlitch();
    return () => {
      if (glitchTimeoutRef.current !== undefined) clearTimeout(glitchTimeoutRef.current);
    };
  }, [scheduleGlitch]);

  // ---- Derived params -----------------------------------------------

  const params = useMemo<HologramEffectParams>(
    () => ({
      hueShift: orientation.x * 30 * intensity,
      offsetX: orientation.x * 10 * intensity,
      offsetY: orientation.y * 10 * intensity,
      gradientAngle: 135 + orientation.x * 45,
      lightBandPosition: 50 + orientation.x * 30,
      flickerOpacity,
    }),
    [orientation, intensity, flickerOpacity],
  );

  return { params, isGlitching, orientationSource: source };
}
