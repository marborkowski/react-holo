import { useState, useEffect, useCallback, useRef } from 'react';
import type { NormalizedOrientation } from '../types';

/** Options accepted by {@link useDeviceOrientation}. */
interface UseDeviceOrientationOptions {
  /** Whether orientation tracking is enabled. @default true */
  enabled?: boolean;
}

/**
 * iOS permission state for `DeviceOrientationEvent`.
 *
 * - `'not-needed'` — the browser does not gate the API behind a permission
 *   prompt (desktop browsers, Android Chrome, etc.).
 * - `'prompt'` — iOS 13+ detected and permission has not been requested yet.
 *   Call `requestPermission()` inside a user-gesture handler (tap/click).
 * - `'granted'` — user granted gyroscope access on iOS.
 * - `'denied'` — user denied gyroscope access on iOS.
 */
export type DeviceOrientationPermission =
  | 'not-needed'
  | 'prompt'
  | 'granted'
  | 'denied';

/** Return value of {@link useDeviceOrientation}. */
export interface UseDeviceOrientationReturn {
  /** Current orientation normalized to [-1, 1] on both axes. */
  orientation: NormalizedOrientation;
  /** Whether the native gyroscope API is available on this device. */
  isGyroscopeAvailable: boolean;
  /** Which input source is currently driving the orientation values. */
  source: 'gyroscope' | 'mouse' | 'none';
  /**
   * iOS permission state. On non-iOS browsers this is always `'not-needed'`.
   * When `'prompt'`, call {@link requestPermission} from a user gesture.
   */
  permissionState: DeviceOrientationPermission;
  /**
   * Request gyroscope permission on iOS 13+.
   *
   * **Must** be called from a user-initiated event handler (click / tap).
   * Resolves to the new permission state (`'granted'` or `'denied'`).
   * On non-iOS browsers this is a no-op that resolves to `'not-needed'`.
   */
  requestPermission: () => Promise<DeviceOrientationPermission>;
}

const LERP_FACTOR = 0.08;
const EPSILON = 0.0001;

/**
 * Detect whether the current browser requires an explicit permission prompt
 * for `DeviceOrientationEvent` (iOS 13+).
 */
function needsPermissionPrompt(): boolean {
  return (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown })
      .requestPermission === 'function'
  );
}

/**
 * Hook that provides **normalized device orientation data**.
 *
 * On devices with a gyroscope it reads `DeviceOrientationEvent` (beta / gamma).
 * On desktop it falls back to tracking the mouse position within the viewport.
 * Values are smoothed via linear interpolation for fluid animation.
 *
 * ### iOS permission
 *
 * Starting with iOS 13, Safari gates the gyroscope API behind a permission
 * prompt that **must** be triggered from a user gesture (tap / click).
 * This hook exposes {@link UseDeviceOrientationReturn.permissionState} and
 * {@link UseDeviceOrientationReturn.requestPermission} so the consuming
 * component can show a prompt and request access at the right time.
 *
 * @param options - Configuration (currently just an `enabled` flag).
 * @returns Current orientation, gyroscope availability, active source,
 *   iOS permission state, and a permission-request function.
 *
 * @example
 * ```tsx
 * const { orientation, source, permissionState, requestPermission } =
 *   useDeviceOrientation();
 *
 * // Show a "Tap to enable gyroscope" button when permissionState === 'prompt'
 * ```
 */
export function useDeviceOrientation(
  options: UseDeviceOrientationOptions = {},
): UseDeviceOrientationReturn {
  const { enabled = true } = options;

  const [orientation, setOrientation] = useState<NormalizedOrientation>({ x: 0, y: 0 });
  const [isGyroscopeAvailable, setIsGyroscopeAvailable] = useState(false);
  const [source, setSource] = useState<'gyroscope' | 'mouse' | 'none'>('none');
  const [permissionState, setPermissionState] = useState<DeviceOrientationPermission>(() =>
    needsPermissionPrompt() ? 'prompt' : 'not-needed',
  );

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

  // ---- Gyroscope handler (shared) -----------------------------------

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
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
  }, []);

  // ---- Gyroscope (DeviceOrientationEvent) ---------------------------
  // Only attach when permission is not required or has been granted.

  useEffect(() => {
    if (!enabled) return;
    if (permissionState === 'prompt' || permissionState === 'denied') return;

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [enabled, permissionState, handleOrientation]);

  // ---- iOS permission request ---------------------------------------

  const requestPermission = useCallback(async (): Promise<DeviceOrientationPermission> => {
    if (!needsPermissionPrompt()) return 'not-needed';

    try {
      const result = await (
        DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<'granted' | 'denied'>;
        }
      ).requestPermission();

      if (result === 'granted') {
        setPermissionState('granted');
        return 'granted';
      }

      setPermissionState('denied');
      return 'denied';
    } catch {
      setPermissionState('denied');
      return 'denied';
    }
  }, []);

  // ---- Mouse fallback -----------------------------------------------

  useEffect(() => {
    if (!enabled || gyroDetectedRef.current) return;
    // On iOS where permission is pending, don't start mouse fallback —
    // the user might grant gyro permission shortly.
    if (permissionState === 'prompt') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (source !== 'mouse') setSource('mouse');
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, source, permissionState]);

  return { orientation, isGyroscopeAvailable, source, permissionState, requestPermission };
}

/** Clamp a value between `min` and `max`. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
