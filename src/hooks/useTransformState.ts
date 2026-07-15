import { useTransform } from 'motion/react'
import { useMotionValueState } from './useMotionValueState'

/**
 * Same as motion/react `useTransform`, but returns the state of the transformed value instead of a MotionValue.
 *
 * @example
 * ```tsx
 * const x = useMotionValue(0) // MotionValue<number>
 * const doubled = useTransform(() => x * 2) // MotionValue<number>
 * const doubledState = useTransformState(() => x * 2) // number
 * ```
 */
export function useTransformState<T>(compute: () => T): T {
  return useMotionValueState(useTransform(compute))
}
