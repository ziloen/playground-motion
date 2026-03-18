import { useTransform } from 'motion/react'
import { useMotionValueState } from './useMotionValueState'

export function useTransformState<T>(transformer: () => T): T {
  return useMotionValueState(useTransform(transformer))
}
