import type { MotionValue } from 'motion/react'
import { useCallback, useSyncExternalStore } from 'react'

/**
 * Sync a MotionValue to React state.
 *
 * @example
 * ```tsx
 * const x = useMotionValue(0) // MotionValue<number>
 * const xMVState = useMotionValueState(x) // number
 * ```
 */
export function useMotionValueState<T>(motionValue: MotionValue<T>): T {
  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      return motionValue.on('change', onStoreChange)
    },
    [motionValue],
  )

  const getSnapshot = useCallback(() => motionValue.get(), [motionValue])

  return useSyncExternalStore<T>(subscribe, getSnapshot, getSnapshot)
}
