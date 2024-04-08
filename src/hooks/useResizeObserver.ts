import { useMemoizedFn } from 'ahooks'
import type { BasicTarget } from 'ahooks/lib/utils/domTarget'
import { getTargetElement } from 'ahooks/lib/utils/domTarget'
import useEffectWithTarget from 'ahooks/lib/utils/useEffectWithTarget'

export function useResizeObserver(
  target: BasicTarget,
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions
) {
  const callbackRef = useMemoizedFn(callback)

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target)
      if (!el) return

      const observer = new ResizeObserver(callbackRef)
      observer.observe(el, options)

      return () => observer.disconnect()
    },
    [],
    target
  )
}
