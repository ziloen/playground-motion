import type { MotionValue } from 'motion/react'
import { useSyncExternalStore } from 'react'

/**
 * Sync a MotionValue to React state.
 *
 * @example
 * ```tsx
 * const x = useMotionValue(0) // MotionValue<number>
 * const xState = useMotionValueState(x) // number
 * ```
 */
export function useMotionValueState<T>(motionValue: MotionValue<T>): T {
  return useSyncExternalStore<T>(
    (onStoreChange) => motionValue.on('change', onStoreChange),
    () => motionValue.get(),
    () => motionValue.get(),
  )
}
