import { useState, useEffect, useCallback, useRef } from 'react';
import type { NormalizedOrientation } from '../types';

/** Options accepted by {@link useDeviceOrientation}. */
interface UseDeviceOrientationOptions {
  /** Whether orientation tracking is enabled. @default true */
  enabled?: boolean;
}

/** Return value of {@link useDeviceOrientation}. */
export interface UseDeviceOrientationReturn {
  /** Current orientation normalized to [-1, 1] on both axes. */
  orientation: NormalizedOrientation;
  /** Whether the native gyroscope API is available on this device. */
  isGyroscopeAvailable: boolean;
  /** Which input source is currently driving the orientation values. */
  source: 'gyroscope' | 'mouse' | 'none';
}

const LERP_FACTOR = 0.08;
const EPSILON = 0.0001;

/**
 * Hook that provides **normalized device orientation data**.
 *
 * On devices with a gyroscope it reads `DeviceOrientationEvent` (beta / gamma).
 * On desktop it falls back to tracking the mouse position within the viewport.
 * Values are smoothed via linear interpolation for fluid animation.
 *
 * @param options - Configuration (currently just an `enabled` flag).
 * @returns Current orientation, gyroscope availability, and active source.
 *
 * @example
 * ```tsx
 * const { orientation, source } = useDeviceOrientation();
 * // orientation.x ∈ [-1, 1], orientation.y ∈ [-1, 1]
 * ```
 */
export function useDeviceOrientation(
  options: UseDeviceOrientationOptions = {},
): UseDeviceOrientationReturn {
  const { enabled = true } = options;

  const [orientation, setOrientation] = useState<NormalizedOrientation>({ x: 0, y: 0 });
  const [isGyroscopeAvailable, setIsGyroscopeAvailable] = useState(false);
  const [source, setSource] = useState<'gyroscope' | 'mouse' | 'none'>('none');

  const rafRef = useRef<number | undefined>(undefined);
  const targetRef = useRef<NormalizedOrientation>({ x: 0, y: 0 });
  const gyroDetectedRef = useRef(false);

  // ---- Smooth interpolation loop ------------------------------------

  const tick = useCallback(() => {
    setOrientation((prev) => {
      const dx = targetRef.current.x - prev.x;
      const dy = targetRef.current.y - prev.y;

      if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) return prev;

      return {
        x: prev.x + dx * LERP_FACTOR,
        y: prev.y + dy * LERP_FACTOR,
      };
    });
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, tick]);

  // ---- Gyroscope (DeviceOrientationEvent) ---------------------------

  useEffect(() => {
    if (!enabled) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;

      if (!gyroDetectedRef.current) {
        gyroDetectedRef.current = true;
        setIsGyroscopeAvailable(true);
        setSource('gyroscope');
      }

      targetRef.current = {
        x: clamp(e.gamma / 45, -1, 1),
        y: clamp((e.beta - 45) / 45, -1, 1),
      };
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [enabled]);

  // ---- Mouse fallback -----------------------------------------------

  useEffect(() => {
    if (!enabled || gyroDetectedRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (source !== 'mouse') setSource('mouse');
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, source]);

  return { orientation, isGyroscopeAvailable, source };
}

/** Clamp a value between `min` and `max`. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
