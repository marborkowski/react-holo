import { useMemo, useState, useEffect, useRef } from 'react';
import {
  useDeviceOrientation,
  type DeviceOrientationPermission,
} from './useDeviceOrientation';
import type { HologramEffectParams } from '../types';

/** Options accepted by {@link useHologramEffect}. */
interface UseHologramEffectOptions {
  /** Effect intensity multiplier (0–1). @default 0.7 */
  intensity?: number;
  /** Flicker strength (0–1). @default 0.3 */
  flickerIntensity?: number;
  /** Enable interactive orientation tracking. @default true */
  interactive?: boolean;
}

/** Return value of {@link useHologramEffect}. */
interface UseHologramEffectReturn {
  /** Computed CSS-driving parameters. */
  params: HologramEffectParams;
  /** Which input source drives the orientation ('gyroscope' | 'mouse' | 'none'). */
  orientationSource: 'gyroscope' | 'mouse' | 'none';
  /** iOS gyroscope permission state. @see DeviceOrientationPermission */
  permissionState: DeviceOrientationPermission;
  /** Request gyroscope permission on iOS. Must be called from a user gesture. */
  requestPermission: () => Promise<DeviceOrientationPermission>;
}

/**
 * Orchestrator hook that turns raw device orientation and time-based
 * animations into concrete hologram visual-effect parameters.
 *
 * It composes {@link useDeviceOrientation} internally and layers flicker
 * logic on top. The returned params drive CSS custom properties
 * for both the `foil` and `beam` variants.
 *
 * @param options - Fine-tuning knobs for the effect.
 * @returns Effect parameters and the active orientation source.
 *
 * @example
 * ```tsx
 * const { params } = useHologramEffect({ intensity: 0.8 });
 * // params.conicAngle, params.lightX, etc. → CSS custom properties
 * ```
 */
export function useHologramEffect(
  options: UseHologramEffectOptions = {},
): UseHologramEffectReturn {
  const {
    intensity = 0.7,
    flickerIntensity = 0.3,
    interactive = true,
  } = options;

  const { orientation, source, permissionState, requestPermission } =
    useDeviceOrientation({ enabled: interactive });

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

  // ---- Derived params -----------------------------------------------

  const params = useMemo<HologramEffectParams>(
    () => ({
      // Beam-variant params
      hueShift: orientation.x * 30 * intensity,
      offsetX: orientation.x * 10 * intensity,
      offsetY: orientation.y * 10 * intensity,
      gradientAngle: 135 + orientation.x * 45,
      lightBandPosition: 50 + orientation.x * 30,
      flickerOpacity,

      // Foil-variant params
      conicAngle: orientation.x * 180 * intensity,
      secondaryAngle: 60 + orientation.y * 120 * intensity,
      lightX: 50 + orientation.x * 40 * intensity,
      lightY: 50 + orientation.y * 40 * intensity,
    }),
    [orientation, intensity, flickerOpacity],
  );

  return { params, orientationSource: source, permissionState, requestPermission };
}
